import { supabase } from 'boot/supabase'

export const classService = {
  async getAll() {
    const { data, error } = await supabase
      .from('classes')
      .select('*, teacher:profiles(full_name)')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getOptions() {
    const { data, error } = await supabase
      .from('classes')
      .select('id, subject, grade')
    if (error) throw error
    return data.map(c => ({
      label: `${c.subject} - ${c.grade}`,
      value: c.id
    }))
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(classData) {
    const { data, error } = await supabase
      .from('classes')
      .insert([classData])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('classes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  }
}
