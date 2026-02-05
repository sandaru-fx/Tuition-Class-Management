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
  }
}
