import { supabase } from 'boot/supabase'
import { v4 as uuidv4 } from 'uuid'

export const assignmentService = {
  
  // --- Assignments ---

  // Create a new assignment (Admin/Teacher)
  async create(assignment) {
    const { data, error } = await supabase
      .from('assignments')
      .insert([assignment])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Get assignments for a specific class
  async getByClass(classId) {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('class_id', classId)
      .order('due_date', { ascending: true })

    if (error) throw error
    return data
  },

  // Get ALL assignments (for Admin list)
  async getAll() {
    const { data, error } = await supabase
      .from('assignments')
      .select(`
        *,
        classes (
            grade,
            subject: subjects(name)
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Get Assignments for a specific Grade (Student View)
  async getAssignmentsByGrade(grade) {
    const { data, error } = await supabase
      .from('assignments')
      .select(`
        *,
        classes!inner (
            grade,
            subject: subjects(name)
        )
      `)
      .eq('classes.grade', grade)
      .order('due_date', { ascending: true })

    if (error) throw error
    return data
  },

  // Delete an assignment
  async delete(id) {
    const { error } = await supabase
      .from('assignments')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // --- Submissions ---

  // Submit an assignment (Student)
  // Handles both File Upload and Database Record in one go preferred, but here we separate for clarity
  async submit(submission) {
     const { data, error } = await supabase
      .from('submissions')
      .upsert([submission]) // upsert allows re-submission if ID matches or unique constraint
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get submission for a specific assignment and student
  async getMySubmission(assignmentId, studentId) {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('assignment_id', assignmentId)
      .eq('student_id', studentId)
      .single()

    // It's okay if no submission found (returns null data usually or error PGRST116)
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  // Get ALL submissions for an assignment (Teacher Grading View)
  async getSubmissionsForAssignment(assignmentId) {
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        *,
        student: profiles (
            id,
            first_name,
            last_name,
            whatsapp_number
        )
      `)
      .eq('assignment_id', assignmentId)

    if (error) throw error
    return data
  },

  // Grade a submission (Teacher)
  async grade(submissionId, score, feedback) {
    const { data, error } = await supabase
      .from('submissions')
      .update({ 
        status: 'graded', 
        score: score, 
        feedback: feedback 
      })
      .eq('id', submissionId)
      .select()

    if (error) throw error
    return data
  },

  // --- File Upload Helper ---
  async uploadFile(file, folder = 'assignments') {
    const fileName = `${folder}/${uuidv4()}-${file.name}`
    const { error } = await supabase.storage
        .from('assignments') // Bucket name
        .upload(fileName, file)

    if (error) throw error
    
    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from('assignments')
        .getPublicUrl(fileName)

    return publicUrl
  }
}
