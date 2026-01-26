import { supabase } from 'boot/supabase'

export const paymentService = {
  async getRecentPayments(limit = 20) {
    const { data, error } = await supabase
      .from('payments')
      .select('*, students(first_name, last_name)')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return data
  },

  async processPayment(payload) {
    const { data, error } = await supabase
      .from('payments')
      .insert([payload])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getDueReport(classId, month) {
    // Logic for finding students who haven't paid for a class/month
    // This often involves checking enrollments vs payments
    const { data: enrollments, error: enrollError } = await supabase
      .from('enrollments')
      .select('student_id, students(first_name, last_name, whatsapp_number)')
      .eq('class_id', classId)
    
    if (enrollError) throw enrollError

    const { data: paidStudents, error: payError } = await supabase
      .from('payments')
      .select('student_id')
      .eq('class_id', classId)
      .eq('month', month)
      .eq('payment_type', 'Monthly Fee')

    if (payError) throw payError

    const paidIds = new Set(paidStudents.map(p => p.student_id))
    return enrollments
      .filter(e => !paidIds.has(e.student_id))
      .map(e => e.students)
  }
}
