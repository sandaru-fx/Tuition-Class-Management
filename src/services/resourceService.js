import { supabase } from 'boot/supabase'

export const resourceService = {
  async getAll(grade = null) {
    let query = supabase
      .from('resources')
      .select('*, subject:subjects(name)')
      .order('created_at', { ascending: false })
    
    if (grade && grade !== 'all') {
      // Handle grade categories if needed, but for now simple filter
      query = query.eq('grade', grade)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async create(resource) {
    const { data, error } = await supabase
      .from('resources')
      .insert([resource])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  },

  async uploadFile(file) {
    const fileName = `${Date.now()}_${file.name}`
    const { error } = await supabase.storage
      .from('resources')
      .upload(fileName, file)
    
    if (error) throw error
    
    const { data: urlData } = supabase.storage
      .from('resources')
      .getPublicUrl(fileName)
      
    return urlData.publicUrl
  }
}
