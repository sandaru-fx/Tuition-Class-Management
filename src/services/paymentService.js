import { supabase } from 'boot/supabase'

export const paymentService = {
  // 1. Create a new transaction (Online or Slip)
  async createTransaction(transactionData) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transactionData])
      .select()
      .single()
    if (error) throw error
    return data
  },

  // 2. Upload Bank Slip Image
  async uploadSlip(file, studentId) {
    const fileName = `${studentId}-${Date.now()}-${file.name}`
    const { error } = await supabase.storage
      .from('payment-slips')
      .upload(fileName, file)
    
    if (error) throw error
    
    // Get Public URL
    const { data: publicUrlData } = supabase.storage
      .from('payment-slips')
      .getPublicUrl(fileName)
      
    return publicUrlData.publicUrl
  },

  // 3. Get Pending Transactions (For Admin Verification)
  async getPendingTransactions() {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        student:students(full_name, grade, whatsapp_number),
        class:classes(subject:subjects(name), grade)
      `)
      .eq('status', 'pending')
      .eq('payment_method', 'bank_slip') // Usually admin only verifies slips
      .order('created_at', { ascending: false })
      
    if (error) throw error
    return data
  },

  // 4. Get My Transactions (For Student History)
  async getMyTransactions(studentId) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        class:classes(subject:subjects(name))
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      
    if (error) throw error
    return data
  },

  // 5. Verify/Reject Transaction (Admin Action)
  async verifyTransaction(transactionId, status) { // status: 'verified' or 'rejected'
    const { data, error } = await supabase
      .from('transactions')
      .update({ 
        status: status,
        verified_at: new Date().toISOString()
      })
      .eq('id', transactionId)
      .select()
      .single()
      
    if (error) throw error
    return data
  },

  // 6. Check if student has paid for a specific class/month (Enforcement)
  async checkPaymentStatus(studentId, classId, month) {
    // month format: '2023-10' using created_at check or specific month column
    // For simplicity, checking if a 'verified' transaction exists in the last 30 days or matching month logic
    // This logic might need refinement based on exact reqs
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('student_id', studentId)
      .eq('class_id', classId)
      .eq('status', 'verified')
      .gte('created_at', `${month}-01`) // Very basic check
      .lt('created_at', `${month}-31`)
    
    if (error) throw error
    return data.length > 0
  },

  // 7. Get Aggregated Stats for Admin Analysis
  async getPaymentStats() {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        class:classes(grade, subject:subjects(name))
      `)
      .eq('status', 'verified')

    if (error) throw error

    // Perform manual aggregation
    const stats = {
      totalRevenue: 0,
      byGrade: {}, // { '10': 5000, '12': 15000 }
      byMethod: { online_card: 0, bank_slip: 0, cash: 0 },
      bySubject: {} // { 'Maths': 5000 }
    }

    data.forEach(txn => {
      const amount = Number(txn.amount)
      stats.totalRevenue += amount
      
      // By Grade
      const grade = txn.class?.grade || 'Unknown'
      stats.byGrade[grade] = (stats.byGrade[grade] || 0) + amount

      // By Method
      stats.byMethod[txn.payment_method] = (stats.byMethod[txn.payment_method] || 0) + amount

      // By Subject
      const subjectName = txn.class?.subject?.name || 'Unknown'
      stats.bySubject[subjectName] = (stats.bySubject[subjectName] || 0) + amount
    })

    return stats
  },

  // 8. Initialize PayHere Payment (Online)
  initPayHerePayment(paymentData) {
    return new Promise((resolve, reject) => {
      
      const payment = {
        "sandbox": true,
        "merchant_id": "1211149", // Replace your Merchant ID
        "return_url": "http://localhost:9000/return",
        "cancel_url": "http://localhost:9000/cancel",
        "notify_url": "http://localhost:9000/notify",
        "order_id": `ORD-${Date.now()}`,
        "items": paymentData.items,
        "amount": paymentData.amount,
        "currency": "LKR",
        "hash": "45D770250085C0A04537D716C4D068C6", // Need backend to generate real hash later
        "first_name": paymentData.first_name,
        "last_name": paymentData.last_name,
        "email": paymentData.email,
        "phone": paymentData.phone,
        "address": "Colombo 03",
        "city": "Colombo",
        "country": "Sri Lanka",
      };

      // PayHere Callback Functions
      payhere.onCompleted = function onCompleted(orderId) {
          console.log("Payment completed. OrderID:" + orderId);
          resolve({ status: 'success', orderId: orderId });
      };

      payhere.onDismissed = function onDismissed() {
          console.log("Payment dismissed");
          reject({ status: 'dismissed' });
      };

      payhere.onError = function onError(error) {
          console.log("Error:" + error);
          reject({ status: 'error', message: error });
      };

      // Open Popup
      payhere.startPayment(payment);
    })
  }
}
