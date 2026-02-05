-- Create Exams Table
CREATE TABLE IF NOT EXISTS exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    hall TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Everyone can read exams (or limit to students in that class)
CREATE POLICY "Students can view exams" ON exams FOR SELECT USING (true);
CREATE POLICY "Teachers can manage own exams" ON exams FOR ALL 
    USING (teacher_id = auth.uid());
CREATE POLICY "Admins can manage all exams" ON exams FOR ALL USING (true); -- Replace with role check in production

COMMENT ON TABLE exams IS 'Scheduled exams for classes';
