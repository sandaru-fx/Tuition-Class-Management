# End-to-End Testing Guide 🧪

## Prerequisites
✅ Dev server is running at `http://localhost:9000`
✅ Database has sample data (subjects, teachers, classes)

---

## Test Flow Overview

```
Admin → Create Student (Grade 10)
  ↓
Teacher → Create Assignment (Math, Grade 10)
  ↓
Student → View & Submit Assignment
  ↓
Teacher → Grade Submission
  ↓
Student → View Score
```

---

## 📋 Step-by-Step Testing Checklist

### Phase 1: Admin Creates Student

1. **Login as Admin**
   - Navigate to `http://localhost:9000`
   - Login with admin credentials
   - Expected: Dashboard with sidebar navigation

2. **Navigate to Students Page**
   - Click **"Students"** in the sidebar
   - URL should be: `/dashboard/students`
   - Expected: Student list with "Add New Student" button

3. **Create Test Student**
   - Click **"Add New Student"**
   - Fill in the form:
     ```
     Full Name: Test Student Sandaru
     Email: teststudent@test.com
     Password: student123
     Grade: 10
     Role: student (should be auto-selected)
     ```
   - Click **"Create"** or **"Submit"**
   - Expected: Success notification
   - Expected: Student appears in the table

4. **Verify Student Creation**
   - [ ] Student name "Test Student Sandaru" is visible in table
   - [ ] Grade shows "10" 
   - [ ] Email shows "teststudent@test.com"

---

### Phase 2: Teacher Creates Assignment

5. **Logout & Login as Teacher**
   - Click profile dropdown → Logout
   - Login with teacher credentials
   - Expected: Teacher dashboard

6. **Navigate to Assignments**
   - Click **"Assignments"** in sidebar
   - URL should be: `/teacher/assignments`
   - Expected: Assignment list with "Create Assignment" button

7. **Create Assignment (Paper Type)**
   - Click **"Create Assignment"**
   - Fill in the form:
     ```
     Title: Algebra Final Paper
     Description: Complete all questions from the attached paper
     Grade: 10
     Subject: Mathematics (select from dropdown)
     Type: Paper
     Due Date: (Pick a future date)
     Max Score: 100
     ```
   - Click **"Create"**
   - Expected: Success notification
   - Expected: Assignment appears in list

8. **Create Assignment (Quiz Type) - Optional**
   - Click **"Create Assignment"** again
   - Fill in the form:
     ```
     Title: Quadratic Equations Quiz
     Description: MCQ quiz on quadratic equations
     Grade: 10
     Subject: Mathematics
     Type: Quiz/MCQ
     Due Date: (Pick a future date)
     Max Score: 20
     Is Quiz: ✓ (checked)
     ```
   - Add Questions:
     ```
     Question 1: "Solve x² - 5x + 6 = 0"
     Options:
       A) x = 1, 6
       B) x = 2, 3 ✓ (correct)
       C) x = -2, -3
       D) x = 1, -6
     
     Question 2: "What is the discriminant formula?"
     Options:
       A) b² - 4ac ✓ (correct)
       B) -b ± √(b² - 4ac)
       C) ax² + bx + c
       D) a² + b²
     ```
   - Click **"Create"**
   - Expected: Quiz created successfully

9. **Verify Assignments**
   - Both assignments should appear in teacher's assignment list
   - [ ] "Algebra Final Paper" - Type: Paper
   - [ ] "Quadratic Equations Quiz" - Type: Quiz

---

### Phase 3: Student Views & Submits

10. **Logout & Login as Student**
    - Logout from teacher account
    - Login as: `teststudent@test.com` / `student123`
    - Expected: Student dashboard with "ELEVATE" branding

11. **Verify UI Mode**
    - Check the assignments page UI
    - Expected: **Senior Mode** (because Grade 10)
    - Look for:
      - [ ] Professional list layout (not colorful cards)
      - [ ] Date boxes on the left
      - [ ] "Submit PDF" buttons (not "Take Photo")

12. **Navigate to Assignments**
    - Click **"Assignments"** in sidebar
    - URL should be: `/student/assignments`
    - Expected: Both assignments visible

13. **Submit Paper Assignment**
    - Click **"Submit PDF"** on "Algebra Final Paper"
    - Upload Dialog appears
    - Select a test PDF file (or any file for testing)
    - Click **"Submit Assignment"**
    - Expected: Success notification
    - Expected: Assignment shows "Pending Review" badge

14. **Take Quiz Assignment**
    - Click **"Take Quiz"** on "Quadratic Equations Quiz"
    - Full-screen quiz interface appears
    - Answer the questions:
      - Question 1: Select option B (x = 2, 3)
      - Question 2: Select option A (b² - 4ac)
    - Click **"Submit Quiz"**
    - Expected: "Quiz Submitted! 🌟" notification
    - Expected: Auto-graded score appears

15. **Verify Submission Status**
    - [ ] Paper shows "Pending Review" badge
    - [ ] Quiz shows score (e.g., "20/20" or "10/20" depending on answers)

---

### Phase 4: Teacher Grades Submission

16. **Logout & Login as Teacher**
    - Logout from student account
    - Login as teacher again

17. **Navigate to Submissions (If Available)**
    - Look for **"Submissions"** or **"Grading"** link
    - If not available, go to **"Assignments"**
    - Click on the "Algebra Final Paper" assignment
    - Look for submissions list

18. **Grade Student Submission**
    - Find "Test Student Sandaru" in submissions
    - Click **"Grade"** or **"Edit"**
    - Enter score: `85`
    - Enter feedback: `"Good work! Review question 3 for next time."`
    - Click **"Save"** or **"Submit Grade"**
    - Expected: Success notification

19. **Verify Quiz Auto-Grading**
    - Go to "Quadratic Equations Quiz" submissions
    - Find "Test Student Sandaru"
    - Expected: Score is already calculated (20/20 if both correct, 10/20 if one correct)
    - Expected: Status shows "Graded"

---

### Phase 5: Student Views Result

20. **Logout & Login as Student**
    - Logout from teacher account
    - Login as student: `teststudent@test.com` / `student123`

21. **Navigate to Assignments**
    - Go to `/student/assignments`
    - Expected: Both assignments now show scores

22. **Verify Graded Results**
    - [ ] "Algebra Final Paper" shows: **85/100** in green
    - [ ] "Quadratic Equations Quiz" shows: **20/20** (or actual score) in green
    - [ ] Status badges changed from "Pending" to score display

23. **Check Performance Page (Optional)**
    - Navigate to **"Performance"** or **"Grades"**
    - Expected: Chart/graph showing progress
    - Expected: List of graded assignments

---

## ✅ Success Criteria

All of the following should be true:

- [ ] Admin successfully created student with Grade 10
- [ ] Teacher created both Paper and Quiz assignments
- [ ] Student saw **Senior Mode UI** (not Primary)
- [ ] Student submitted paper assignment (file upload)
- [ ] Student completed quiz with MCQ interface
- [ ] Quiz was **auto-graded** correctly
- [ ] Teacher manually graded paper assignment
- [ ] Student sees both scores on assignments page
- [ ] No console errors during any step
- [ ] All navigation links work correctly

---

## 🔍 Additional Checks

### Responsive Design
- [ ] Resize browser to mobile width (< 600px)
- [ ] Bottom navigation tabs appear
- [ ] Tables convert to card views on mobile
- [ ] All buttons meet 44px touch target minimum

### Accessibility
- [ ] Press `Tab` key to navigate - focus indicators visible
- [ ] Press `Tab` then `Enter` on skip link - jumps to main content
- [ ] All buttons have proper labels (check with browser inspector)

### Grade Filtering (Admin Only)
- [ ] Use sidebar grade filter to select "Grade 10"
- [ ] Student list filters to show only Grade 10 students
- [ ] Stats update to reflect filtered data

---

## 🐛 Common Issues & Solutions

### Issue: Student doesn't see assignments
**Solution:** Check that:
- Assignment grade matches student grade (both "10")
- Assignment is not deleted or archived
- Student is logged in with correct account

### Issue: Quiz doesn't auto-grade
**Solution:** Verify:
- `is_quiz` field is `true` in database
- Questions have `correct_answer` index set
- `assignmentService.submitQuiz()` is being called (not regular submit)

### Issue: UI shows Primary mode for Grade 10
**Solution:** Check:
- Student profile has `grade: "10"` (string, not number)
- `isPrimary` computed property logic in StudentAssignmentsPage.vue
- Console log `studentGrade.value` to debug

### Issue: Teacher can't see submissions
**Solution:** Ensure:
- Submissions table exists in database
- Teacher has permission to view submissions
- Foreign keys are set correctly (assignment_id, student_id)

---

## 📊 Database Verification Queries

Run these in your Supabase SQL Editor to verify data:

```sql
-- 1. Check student was created
SELECT * FROM profiles 
WHERE email = 'teststudent@test.com' AND role = 'student';

-- 2. Check assignments were created
SELECT id, title, grade, type, is_quiz 
FROM assignments 
WHERE grade = '10';

-- 3. Check submissions exist
SELECT 
    s.id,
    s.assignment_id,
    a.title,
    s.student_id,
    p.full_name,
    s.score,
    s.status
FROM submissions s
JOIN assignments a ON a.id = s.assignment_id
JOIN profiles p ON p.id = s.student_id
WHERE p.email = 'teststudent@test.com';

-- 4. Verify complete flow
SELECT 
    p.full_name as student,
    p.grade,
    a.title as assignment,
    a.type,
    s.score,
    s.status,
    s.submitted_at
FROM profiles p
JOIN submissions s ON s.student_id = p.id
JOIN assignments a ON a.id = s.assignment_id
WHERE p.email = 'teststudent@test.com'
ORDER BY s.submitted_at DESC;
```

---

## 🎯 Expected Final State

After completing all steps:

**Database:**
- 1 new student record (Grade 10)
- 2 new assignment records (1 paper, 1 quiz)
- 2 new submission records (both graded)

**UI State:**
- Admin sees student in list
- Teacher sees assignments in list
- Teacher sees submissions with scores
- Student sees both assignments with final scores
- Student performance page shows average grade

**Test Complete! 🎉**

If all checkboxes are ticked and queries return expected data, the three-role system is working perfectly!
