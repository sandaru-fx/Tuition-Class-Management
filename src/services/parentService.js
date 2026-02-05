import { supabase } from 'boot/supabase'

export const parentService = {
  // Login/Verify by phone (Simple version)
  async getParentByPhone(phone) {
    const { data, error } = await supabase
      .from('parents')
      .select('*, students:parent_students(student:students(*))')
      .eq('phone', phone)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  // Get full children details for a parent
  async getChildrenDetails(parentId) {
    // 1. Get student IDs
    const { data: relations, error: relError } = await supabase
        .from('parent_students')
        .select('student_id')
        .eq('parent_id', parentId)
    
    if (relError) throw relError
    if (!relations.length) return []

    const studentIds = relations.map(r => r.student_id)

    // 2. Fetch student data along with attendance and exam results (manually joined or nested)
    const { data: students, error: studError } = await supabase
        .from('students')
        .select('*')
        .in('id', studentIds)

    if (studError) throw studError
    return students
  },

  // Fetch Attendance for specific students
  async getStudentAttendance(studentIds) {
      const { data, error } = await supabase
          .from('attendance_logs')
          .select('*')
          .in('student_id', studentIds)
          .order('date', { ascending: false })
          .limit(20)
      
      if (error) throw error
      return data
  },

  // Fetch Exam Results for specific students
  async getStudentResults(studentIds) {
       const { data, error } = await supabase
          .from('exam_results')
          .select('*, exam:exams(name, date)')
          .in('student_id', studentIds)
          .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
  }
}
