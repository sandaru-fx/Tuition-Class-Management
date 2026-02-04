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
  }
}
