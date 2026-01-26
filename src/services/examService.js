import { supabase } from 'boot/supabase'

export const examService = {
  async getAll() {
    const { data, error } = await supabase
      .from('exams')
      .select('*, classes(subject, grade)')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async create(examData) {
    const { data, error } = await supabase
      .from('exams')
      .insert([examData])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('exams')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  },

  async getStudentMarks(examId) {
    // 1. Fetch students for the class (assuming all for now, but should use enrollments)
    const { data: students, error: sError } = await supabase
      .from('students')
      .select('*')
      .eq('is_active', true)
      .order('first_name')
    if (sError) throw sError

    // 2. Fetch results
    const { data: results, error: rError } = await supabase
      .from('exam_results')
      .select('*')
      .eq('exam_id', examId)
    if (rError) throw rError

    return { students, results }
  },

  async saveMarks(upserts) {
    const { error } = await supabase
      .from('exam_results')
      .upsert(upserts, { onConflict: 'exam_id, student_id' })
    if (error) throw error
    return true
  }
}
