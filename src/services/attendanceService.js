import { supabase } from 'boot/supabase'

export const attendanceService = {
  async getAttendanceList(classId, date) {
    // 1. Fetch enrolled students for this class
    const { data: enrollments, error: enrollError } = await supabase
      .from('enrollments')
      .select('student_id, students(id, first_name, last_name, whatsapp_number)')
      .eq('class_id', classId)
    
    if (enrollError) throw enrollError

    const students = enrollments.map(e => ({
      id: e.students.id,
      first_name: e.students.first_name,
      last_name: e.students.last_name,
      whatsapp_number: e.students.whatsapp_number
    }))

    // 2. Fetch existing logs
    const { data: logs, error: logError } = await supabase
      .from('attendance_logs')
      .select('student_id, status')
      .eq('class_id', classId)
      .eq('date', date)
    
    if (logError) throw logError

    const logMap = new Map()
    logs.forEach(l => logMap.set(l.student_id, l.status))

    return students.map(s => ({
      ...s,
      status: logMap.get(s.id) || 'Absent'
    }))
  },

  async saveAttendance(classId, date, attendanceData) {
    const upsertData = attendanceData.map(s => ({
      student_id: s.id,
      class_id: classId,
      date: date,
      status: s.status
    }))

    const { error } = await supabase
      .from('attendance_logs')
      .upsert(upsertData, { onConflict: 'student_id, class_id, date' })

    if (error) throw error
    return true
  }
}
