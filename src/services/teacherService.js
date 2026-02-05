import { supabase } from 'boot/supabase'

export const teacherService = {
  // ==========================================
  // TEACHER DASHBOARD FUNCTIONS
  // ==========================================

  /**
   * Get all classes assigned to a teacher
   * @param {string} teacherId - Teacher's profile ID
   * @returns {Array} Classes with subject, hall, and student count
   */
  async getMyClasses(teacherId) {
    const { data, error } = await supabase
      .from('classes')
      .select(`
        *,
        subject:subjects(id, name, code),
        hall:halls(id, name),
        teacher:profiles!classes_teacher_id_fkey(id, full_name)
      `)
      .eq('teacher_id', teacherId)
      .order('day_of_week')
      .order('start_time')
    
    if (error) throw error

    // Get student counts for each class
    const classesWithCounts = await Promise.all(
      data.map(async (cls) => {
        const { count } = await supabase
          .from('enrollments')
          .select('*', { count: 'exact', head: true })
          .eq('class_id', cls.id)
        
        return { ...cls, student_count: count || 0 }
      })
    )

    return classesWithCounts
  },

  /**
   * Get today's schedule for a teacher
   * @param {string} teacherId - Teacher's profile ID
   * @returns {Array} Classes scheduled for today
   */
  async getTodaySchedule(teacherId) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const today = days[new Date().getDay()]

    const { data, error } = await supabase
      .from('classes')
      .select(`
        *,
        subject:subjects(id, name, code),
        hall:halls(id, name)
      `)
      .eq('teacher_id', teacherId)
      .eq('day_of_week', today)
      .order('start_time')
    
    if (error) throw error
    return data || []
  },

  /**
   * Get count of pending grading submissions
   * @param {string} teacherId - Teacher's profile ID
   * @returns {Array} Assignments with pending submission counts
   */
  async getPendingGrading(teacherId) {
    // Get all assignments created by teacher or for teacher's classes
    const { data: assignments, error: assignError } = await supabase
      .from('assignments')
      .select(`
        id,
        title,
        class_id,
        classes:class_id(id, name, subject:subjects(name))
      `)
      .eq('teacher_id', teacherId)
    
    if (assignError) throw assignError

    // For each assignment, count pending submissions
    const pendingCounts = await Promise.all(
      (assignments || []).map(async (assignment) => {
        const { count } = await supabase
          .from('submissions')
          .select('*', { count: 'exact', head: true })
          .eq('assignment_id', assignment.id)
          .eq('status', 'submitted') // Not yet graded
        
        return {
          id: assignment.id,
          assignment: assignment.title,
          class: assignment.classes?.name || 'Unknown Class',
          subject: assignment.classes?.subject?.name || '',
          count: count || 0
        }
      })
    )

    // Filter to only show assignments with pending grading
    return pendingCounts.filter(item => item.count > 0)
  },

  /**
   * Get weekly statistics for teacher
   * @param {string} teacherId - Teacher's profile ID
   * @returns {Object} Stats: total classes, total students, avg attendance
   */
  async getWeeklyStats(teacherId) {
    // Get total unique students across all classes
    const { data: classes } = await supabase
      .from('classes')
      .select('id')
      .eq('teacher_id', teacherId)
    
    const classIds = (classes || []).map(c => c.id)

    // Count unique students enrolled
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('student_id')
      .in('class_id', classIds)
    
    const uniqueStudents = new Set((enrollments || []).map(e => e.student_id))

    // Calculate attendance for this week (last 7 days)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const { data: attendanceRecords } = await supabase
      .from('attendance')
      .select('status')
      .in('class_id', classIds)
      .gte('date', weekAgo.toISOString().split('T')[0])
    
    const presentCount = (attendanceRecords || []).filter(a => a.status === 'present').length
    const totalCount = attendanceRecords?.length || 0
    const avgAttendance = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0

    return {
      totalClasses: classes?.length || 0,
      totalStudents: uniqueStudents.size,
      avgAttendance: avgAttendance
    }
  },

  /**
   * Get detailed class information with student roster
   * @param {string} classId - Class ID
   * @returns {Object} Class details with enrolled students
   */
  async getClassDetails(classId) {
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select(`
        *,
        subject:subjects(*),
        hall:halls(*),
        teacher:profiles!classes_teacher_id_fkey(id, full_name)
      `)
      .eq('id', classId)
      .single()
    
    if (classError) throw classError

    // Get enrolled students
    const { data: students, error: studentsError } = await supabase
      .from('enrollments')
      .select(`
        *,
        student:profiles!enrollments_student_id_fkey(id, full_name, phone)
      `)
      .eq('class_id', classId)
    
    if (studentsError) throw studentsError

    return {
      ...classData,
      students: students || []
    }
  },

  // ==========================================
  // ADMIN-SIDE TEACHER CRUD (Keep existing)
  // ==========================================

  async getAll() {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .order('full_name')
    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(teacher) {
    const { data, error } = await supabase
      .from('teachers')
      .insert([teacher])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('teachers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('teachers')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  },

  async markAttendance(classId, date, attendanceData) {
    const upsertData = Object.entries(attendanceData).map(([studentId, status]) => ({
      class_id: classId,
      student_id: studentId,
      date: date, // 'YYYY-MM-DD'
      status: status,
      marked_by: (await supabase.auth.getUser()).data.user?.id
    }))

    if (upsertData.length === 0) return

    const { error } = await supabase
      .from('attendance_logs')
      .upsert(upsertData, { onConflict: 'class_id, student_id, date' })

    if (error) throw error
    return true
  }
}
