-- Create Assignments Table
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('homework', 'paper')), -- 'homework' for Primary, 'paper' for Senior
    due_date TIMESTAMP WITH TIME ZONE,
    max_score INTEGER DEFAULT 100, -- 5 for Star Rating, 100 for Marks
    attachment_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Submissions Table
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    file_url TEXT, -- URL of the uploaded image/PDF
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'graded', 'late', 'missing')),
    score INTEGER, -- Stars count or Marks
    feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one submission per student per assignment
    UNIQUE(assignment_id, student_id)
);

-- Enable RLS
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Policies (Adjust as needed for your specific role logic)
-- 1. Everyone can read assignments (or limit to students in that class)
CREATE POLICY "Students can view assignments" ON assignments FOR SELECT USING (true);
CREATE POLICY "Admins can manage assignments" ON assignments FOR ALL USING (true); -- Replace 'true' with Admin Role Check in production

-- 2. Students can manage their own submissions
CREATE POLICY "Students can view own submissions" ON submissions FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can create submissions" ON submissions FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can update own submissions" ON submissions FOR UPDATE USING (auth.uid() = student_id);

-- 3. Admins can view/grade all submissions
CREATE POLICY "Admins can manage all submissions" ON submissions FOR ALL USING (true); -- Replace with role check
