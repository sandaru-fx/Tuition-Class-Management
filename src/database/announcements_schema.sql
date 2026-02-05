-- Create Announcements Table
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE, -- If NULL, could imply all teacher's classes, but let's enforce class for now or handle in logic
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT CHECK (priority IN ('normal', 'high')) DEFAULT 'normal',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Policies

-- Teachers can view their own announcements
CREATE POLICY "Teachers can view their own announcements" 
ON announcements FOR SELECT 
USING (auth.uid() = teacher_id);

-- Teachers can insert announcements for themselves
CREATE POLICY "Teachers can create announcements" 
ON announcements FOR INSERT 
WITH CHECK (auth.uid() = teacher_id);

-- Teachers can update/delete their own
CREATE POLICY "Teachers can update own announcements" 
ON announcements FOR UPDATE 
USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete own announcements" 
ON announcements FOR DELETE 
USING (auth.uid() = teacher_id);

-- Students can view announcements for their enrolled classes
CREATE POLICY "Students can view class announcements" 
ON announcements FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM enrollments 
        WHERE enrollments.class_id = announcements.class_id 
        AND enrollments.student_id = auth.uid()
    )
);
