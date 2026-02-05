import { supabase } from 'boot/supabase'

export const hallService = {
  async getAll() {
    const { data, error } = await supabase
      .from('halls')
      .select('*')
      .eq('is_active', true)
      .order('name')
    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('halls')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(hall) {
    const { data, error } = await supabase
      .from('halls')
      .insert([hall])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('halls')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id) {
    // Soft delete recommended or check for references
    const { error } = await supabase
      .from('halls')
      .update({ is_active: false })
      .eq('id', id)
    if (error) throw error
    return true
  }
}
