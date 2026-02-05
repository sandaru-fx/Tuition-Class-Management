import { supabase } from 'boot/supabase'

export const studentService = {
  async getAll() {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('is_active', true)
      .order('first_name')
    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(studentData) {
    const { data, error } = await supabase
      .from('students')
      .insert([studentData])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  },

  async promoteStudents(fromGrade, toGrade) {
    // 1. Get IDs of students in source grade
    const { data: students, error: fetchError } = await supabase
        .from('students')
        .select('id')
        .eq('grade', fromGrade)
        .eq('is_active', true)
    
    if (fetchError) throw fetchError
    if (!students || students.length === 0) return 0

    // 2. Bulk update
    // Note: Suapbase generic update doesn't support "WHERE grade = X" directly without RLS complications sometimes,
    // but standard UPDATE should work. 
    // However, to be safe and get accurate count, we can use an 'in' filter.
    const ids = students.map(s => s.id)
    
    const { error: updateError, count } = await supabase
        .from('students')
        .update({ grade: toGrade })
        .in('id', ids)
        .select('id', { count: 'exact' })

    if (updateError) throw updateError
    return count || ids.length
  }
}
