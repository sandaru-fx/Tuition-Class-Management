-- Teacher Remarks Table - For teacher notes/comments on individual students
CREATE TABLE IF NOT EXISTS teacher_remarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    remark TEXT NOT NULL,
    tag TEXT CHECK (tag IN ('Needs Attention', 'Top Performer', 'Improving', 'Absent Frequently')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE teacher_remarks ENABLE ROW LEVEL SECURITY;

-- Teachers can view and manage their own remarks
CREATE POLICY "Teachers can manage own remarks" ON teacher_remarks FOR ALL
    USING (teacher_id = auth.uid());

-- Admins can view all remarks (for oversight/reports)
CREATE POLICY "Admins can view all remarks" ON teacher_remarks FOR SELECT
    USING (true); -- Replace with admin role check in production

-- Students can view remarks written about them (optional - depends on your app requirements)
CREATE POLICY "Students can view own remarks" ON teacher_remarks FOR SELECT
    USING (student_id = auth.uid());

COMMENT ON TABLE teacher_remarks IS 'Teacher notes and remarks about individual students';
COMMENT ON COLUMN teacher_remarks.tag IS 'Optional categorization tag for the remark';
