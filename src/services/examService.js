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

  // Get exams for a specific teacher's classes
  async getByTeacher(teacherId) {
    const { data, error } = await supabase
      .from('exams')
      .select(`
        *,
        classes!inner (
            id,
            grade,
            subject: subjects(name),
            teacher_id
        )
      `)
      .eq('classes.teacher_id', teacherId)
      .order('exam_date', { ascending: true })

    if (error) throw error
    return data
  },

  // Update an existing exam
  async update(id, updates) {
    const { data, error } = await supabase
      .from('exams')
      .update(updates)
      .eq('id', id)
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
    const { data: students, error: sError } = await supabase
      .from('students')
      .select('*')
      .eq('is_active', true)
      .order('first_name')
    if (sError) throw sError

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
