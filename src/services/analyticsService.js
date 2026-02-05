import { supabase } from 'boot/supabase'

export const analyticsService = {
  async getRevenueByGrade() {
    // Current approach: Summing monthly_fee from classes grouped by grade
    // Note: A real revenue system would use the 'payments' table.
    // For now, let's join classes and get potential revenue by grade.
    const { data, error } = await supabase
      .from('classes')
      .select('grade, monthly_fee')
    
    if (error) throw error

    const grades = ['1','2','3','4','5','6','7','8','9','10','11','12','13']
    const result = grades.map(g => ({ grade: g, revenue: 0 }))

    data.forEach(item => {
      const gObj = result.find(r => r.grade === item.grade)
      if (gObj) gObj.revenue += Number(item.monthly_fee || 0)
    })

    return result
  },

  async getEnrollmentStats() {
      const { data, error } = await supabase
        .from('students')
        .select('grade')
      
      if (error) throw error

      const counts = {}
      data.forEach(s => {
          counts[s.grade] = (counts[s.grade] || 0) + 1
      })

      return Object.keys(counts).map(k => ({ label: `Grade ${k}`, value: counts[k] }))
  },

  // Get Pass Rate by Grade (Calculated from Assignments for now)
  async getPassRateByGrade() {
      // Fetch all graded assignments
      const { data, error } = await supabase
        .from('submissions')
        .select('score, assignment: assignments!inner(classes!inner(grade))')
        .eq('status', 'graded')
      
      if (error) throw error

      const stats = {} // { grade: { totalScore: 0, count: 0 } }

      data.forEach(sub => {
          const grade = sub.assignment?.classes?.grade
          if (!grade) return
          if (!stats[grade]) stats[grade] = { totalScore: 0, count: 0 }
          
          stats[grade].totalScore += (sub.score || 0)
          stats[grade].count++
      })

      return Object.keys(stats).map(g => ({
          grade: g,
          passRate: Math.round((stats[g].totalScore / stats[g].count)) // actually avg score
      }))
  },

  // Get Teacher Workload (Real Data)
  async getTeacherWorkload() {
      const { data, error } = await supabase
        .from('classes')
        .select('teacher_name') // counting rows
      
      if (error) throw error

      const counts = {}
      data.forEach(c => {
          const name = c.teacher_name || 'Unknown'
          counts[name] = (counts[name] || 0) + 1
      })
      
      return Object.keys(counts).map(name => ({
          teacher: name,
          classes: counts[name]
      }))
  },

  // Get Teacher Performance (Mocked for MVP as it requires complex joins on attendance + grades)
  async getTeacherPerformance() {
      // Real implementation would aggregate:
      // 1. Avg Student Attendance per Teacher's Class
      // 2. Avg Student Grade in Teacher's Subject

      // Returning structure for frontend to consume
      return [
          { id: 1, name: 'Mr. Perera', subject: 'Physics', avgAttendance: 85, avgScore: 78, students: 120 },
          { id: 2, name: 'Ms. Silva', subject: 'Biology', avgAttendance: 92, avgScore: 88, students: 95 },
          { id: 3, name: 'Mr. Fernando', subject: 'Combined Maths', avgAttendance: 78, avgScore: 65, students: 110 },
          { id: 4, name: 'Mrs. Bandara', subject: 'Chemistry', avgAttendance: 88, avgScore: 82, students: 105 }
      ]
  }
}
