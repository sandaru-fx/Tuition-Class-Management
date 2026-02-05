-- Resources Table for Teacher uploaded study materials
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT, -- 'pdf', 'doc', 'image', etc.
    file_size INTEGER, -- in bytes
    category TEXT CHECK (category IN ('notes', 'past_papers', 'worksheets', 'other')),
    is_public BOOLEAN DEFAULT false, -- If true, visible to all teachers
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Teachers can manage their own resources
CREATE POLICY "Teachers can manage own resources" ON resources FOR ALL
    USING (teacher_id = auth.uid());

-- Teachers can view public resources
CREATE POLICY "Teachers can view public resources" ON resources FOR SELECT
    USING (is_public = true);

-- Students can view resources for their enrolled classes
CREATE POLICY "Students can view class resources" ON resources FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM enrollments 
        WHERE enrollments.class_id = resources.class_id 
        AND enrollments.student_id = auth.uid()
    ));

-- Admins can view all resources
CREATE POLICY "Admins can view all resources" ON resources FOR SELECT
    USING (true); -- Replace with admin role check

COMMENT ON TABLE resources IS 'Study materials uploaded by teachers (notes, past papers, worksheets)';
COMMENT ON COLUMN resources.is_public IS 'If true, resource is visible to all teachers in the school';
