import { supabase } from 'boot/supabase'

export const teacherService = {
  async getAll() {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .order('full_name') // Changed from name to full_name based on table schema
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
  }
}
