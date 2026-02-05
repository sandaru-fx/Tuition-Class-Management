import { supabase } from 'boot/supabase'

export const announcementService = {
  
  /**
   * Create a new announcement
   * @param {Object} announcement - { teacher_id, class_id, title, message, priority }
   */
  async create(announcement) {
    const { data, error } = await supabase
      .from('announcements')
      .insert([announcement])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  /**
   * Get announcements created by a specific teacher
   * @param {string} teacherId 
   */
  async getByTeacher(teacherId) {
    const { data, error } = await supabase
      .from('announcements')
      .select(`
        *,
        classes (
            id,
            grade,
            subject: subjects(name)
        )
      `)
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  /**
   * Get announcements for a specific class (Student View)
   * @param {string} classId 
   */
  async getByClass(classId) {
    const { data, error } = await supabase
      .from('announcements')
      .select(`
        *,
        teacher: profiles (full_name)
      `)
      .eq('class_id', classId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  /**
   * Delete an announcement
   * @param {string} id 
   */
  async delete(id) {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
