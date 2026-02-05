-- Migration: Add teacher_id, questions, and answers fields to assignments system
-- Run this ONLY if you haven't already created the assignments table

-- If table exists, add missing columns
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS questions JSONB;

-- Update type constraint to include 'mcq'
ALTER TABLE assignments DROP CONSTRAINT IF EXISTS assignments_type_check;
ALTER TABLE assignments ADD CONSTRAINT assignments_type_check CHECK (type IN ('homework', 'paper', 'mcq'));

-- Add answers column to submissions
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS answers JSONB;

-- Add teacher policy if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'assignments' AND policyname = 'Teachers can manage own assignments'
    ) THEN
        CREATE POLICY "Teachers can manage own assignments" ON assignments FOR ALL 
            USING (teacher_id = auth.uid() OR EXISTS (
                SELECT 1 FROM classes WHERE classes.id = assignments.class_id AND classes.teacher_id = auth.uid()
            ));
    END IF;
END $$;

COMMENT ON COLUMN assignments.teacher_id IS 'Teacher who created the assignment (for teacher-created assignments)';
COMMENT ON COLUMN assignments.questions IS 'For MCQ type: JSONB array of {question, options: [], correctOption: index}';
COMMENT ON COLUMN submissions.answers IS 'For MCQ submissions: JSONB array of selected option indices';
