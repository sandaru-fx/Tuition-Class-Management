import { supabase } from 'boot/supabase'

export const feeService = {
  async getAll() {
    const { data, error } = await supabase
      .from('fee_templates')
      .select('*')
      .order('grade_category')
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('fee_templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async create(template) {
    const { data, error } = await supabase
      .from('fee_templates')
      .insert([template])
      .select()
      .single()
    if (error) throw error
    return data
  },
  
  async delete(id) {
    const { error } = await supabase
      .from('fee_templates')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  },

  // Helper to get fee by grade (e.g. "5" -> PRIMARY fee)
  async getFeeForGrade(grade) {
    let category = 'primary'
    const g = Number(grade)
    if (g >= 6 && g <= 9) category = 'junior'
    if (g >= 10 && g <= 11) category = 'ol'
    if (g >= 12 && g <= 13) category = 'al'

    const { data, error } = await supabase
        .from('fee_templates')
        .select('amount')
        .eq('grade_category', category)
        .single()
    
    return data?.amount || 0
  }
}
