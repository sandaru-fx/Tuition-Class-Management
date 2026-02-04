import { supabase } from 'boot/supabase'

export const subjectService = {
  async getAll() {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('name')
    if (error) throw error
    return data
  },

  async getByGrade(gradeCategory) {
    // gradeCategory: 'primary', 'junior', 'ol', 'al'
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('grade_category', gradeCategory)
      .order('name')
    if (error) throw error
    return data
  },

  async getByStream(stream) {
    // stream: 'science', 'commerce', 'arts', 'tech'
    // Also include common subjects for AL if any
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('grade_category', 'al')
      .or(`stream.eq.${stream},stream.is.null`)
      .order('name')
    if (error) throw error
    return data
  },

  async create(subjectData) {
    const { data, error } = await supabase
      .from('subjects')
      .insert([subjectData])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('subjects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  }
}
