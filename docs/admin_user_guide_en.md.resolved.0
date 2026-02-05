# Admin User Guide 👨‍💼
**SYZYGY LMS - Administrator Documentation**

Version 1.0 | Last Updated: February 2026

---

## Table of Contents
1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Student Management](#student-management)
4. [Class Management](#class-management)
5. [Teacher Management](#teacher-management)
6. [Subjects & Resources](#subjects--resources)
7. [Financial Management](#financial-management)
8. [Attendance Tracking](#attendance-tracking)
9. [Reports & Analytics](#reports--analytics)
10. [System Settings](#system-settings)
11. [Best Practices](#best-practices)
12. [Troubleshooting](#troubleshooting)

---

## Getting Started

### First Login

1. **Navigate to the application**
   - Open your web browser
   - Go to your LMS URL (e.g., `https://yourlms.com`)

2. **Login with admin credentials**
   - Email: Your admin email
   - Password: Your admin password
   - Click "Sign In"

3. **You will be redirected to the Admin Dashboard**

> 💡 **Tip:** Bookmark the login page for quick access!

---

## Dashboard Overview

### Main Components

#### 1. **Top Navigation Bar**
- **Left:** ClassMaster logo and menu toggle
- **Right:** Notifications, Profile dropdown, Logout

#### 2. **Sidebar Navigation**
The sidebar contains all major sections:

**OVERVIEW**
- 📊 Dashboard - Home screen with key metrics

**STUDENT MANAGEMENT**
- 👨‍🎓 Students - Manage student records
- ✅ Attendance - Track student attendance

**ACADEMICS**
- 📅 Classes - Manage class schedules
- 📚 Subjects - Configure subjects
- 📁 Resources - Learning materials
- 📝 Exams - Exam management
- 📄 Assignments - View all assignments
- 📢 Communication - Announcements

**FINANCIAL**
- 💰 Payments - Fee tracking

**ADMINISTRATION**
- 👥 Users - Manage all users
- 🔐 Roles - Role permissions

#### 3. **Grade Filter**
At the top of the sidebar:
- Filter all data by grade level
- Options: All, Primary (1-5), Grades 6-9, O/L (10-11), A/L (12-13), or specific grades

> ⚠️ **Important:** The grade filter affects data shown across all pages!

#### 4. **Dashboard Cards**
- **Total Students:** Current enrollment count
- **Active Classes:** Number of ongoing classes
- **Monthly Revenue:** Financial summary
- **Pending Payments:** Outstanding fees

---

## Student Management

### Adding a New Student

1. **Navigate to Students Page**
   - Click "Students" in the sidebar
   - You'll see a list of all current students

2. **Click "Add New Student" Button**
   - Located at the top-right of the page

3. **Fill in Student Information**

   **Required Fields:**
   - **Full Name:** Student's complete name
   - **Email:** Unique email address (used for login)
   - **Password:** Initial password (student can change later)
   - **Grade:** Select from 1-13
   - **Role:** Automatically set to "student"

   **Optional Fields:**
   - **Phone Number:** Contact number
   - **Address:** Residential address
   - **Parent Name:** Guardian's name
   - **Parent Phone:** Guardian's contact

4. **Click "Create" Button**
   - Student will be created immediately
   - Success notification will appear
   - Student appears in the list

5. **Student Receives Login Credentials**
   - Email: The one you entered
   - Password: The one you set
   - They can log in at `/login`

> 💡 **Best Practice:** Use a temporary password like "student123" and ask students to change it on first login.

### Editing Student Information

1. **Find the student** in the students list
2. **Click the Edit (pencil) icon** in the Actions column
3. **Update the information** in the dialog
4. **Click "Update"** to save changes

> ⚠️ **Note:** You cannot change the student's email after creation (it's their unique identifier).

### Deleting a Student

1. **Find the student** in the students list
2. **Click the Delete (trash) icon** in the Actions column
3. **Confirm deletion** in the popup dialog
4. **Click "Delete"** - this action is permanent!

> ⚠️ **Warning:** Deleting a student removes all their data including:
> - Submissions
> - Grades
> - Attendance records
> 
> Consider archiving instead (set status to "inactive").

### Searching Students

Use the search bar at the top of the Students page to filter by:
- Student name
- Email address
- Grade

### Viewing Student Details

Click on any student's row to view:
- Full profile information
- Enrolled classes
- Performance metrics
- Payment status
- Attendance record

---

## Class Management

### Understanding Classes

A **Class** in the LMS represents a scheduled teaching session with:
- **Subject:** What is being taught (e.g., Mathematics)
- **Grade:** Which grade level (1-13)
- **Teacher:** Who teaches it
- **Schedule:** Day and time
- **Hall:** Physical location
- **Fee:** Monthly cost

### Creating a New Class

1. **Navigate to Classes Page**
   - Click "Classes" in the sidebar
   - Click the "Schedule" tab to see the weekly view

2. **Click "Add New Class" Button**

3. **Fill in Class Details**

   **Step 1: Select Grade & Subject**
   - **Grade:** Select target grade (1-13)
   - **Subject:** Dropdown filters based on grade
     - Primary (1-5): Only core subjects
     - Junior (6-9): Standard subjects
     - O/L (10-11): O/L subjects
     - A/L (12-13): All advanced subjects

   **Step 2: Assign Teacher**
   - Select from qualified teachers
   - System shows only teachers qualified for the selected grade
   - If no teachers appear, assign qualified grades to teachers first

   **Step 3: Set Schedule**
   - **Day of Week:** Monday - Sunday
   - **Start Time:** Class start (e.g., 08:00)
   - **End Time:** Class end (e.g., 10:00)

   **Step 4: Select Hall**
   - Choose from available halls
   - System checks for conflicts

   **Step 5: Set Fee (Optional)**
   - Monthly fee for this class
   - Defaults to grade-level standard fee

4. **Click "Create" Button**

### Conflict Detection

The system automatically checks for:
- **Hall conflicts:** Same hall, same time
- **Teacher conflicts:** Same teacher, same time

If a conflict is detected, you'll see:
> ⚠️ **Conflict!** [Teacher Name] or [Hall Name] is busy at this time ([Conflicting Class Name]).

**Solution:** Choose a different time, hall, or teacher.

### Editing a Class

1. **List View:** Click Edit icon in the Actions column
2. **Schedule View:** Click on the class card
3. Update details and click "Update"

### Deleting a Class

1. Click Delete icon
2. Confirm deletion

> ⚠️ **Warning:** Deleting a class removes it from:
> - Teacher's schedule
> - Student enrollments
> - Weekly timetable

### Weekly Schedule View

Switch to the "Weekly Schedule" tab to see:
- All classes organized by day
- Color-coded by grade level:
  - 🟢 **Green:** Primary (1-5)
  - 🔵 **Blue:** Junior (6-9)
  - 🟠 **Orange:** O/L (10-11)
  - 🔴 **Pink:** A/L (12-13)

**Benefits:**
- Quick visual overview
- Easy to spot gaps
- Identify busy periods

---

## Teacher Management

### Adding a Teacher

1. **Navigate to Users Page**
   - Click "Users" in sidebar

2. **Click "Add User" Button**

3. **Fill in Teacher Details**
   - **Full Name:** Teacher's complete name
   - **Email:** Unique email (used for login)
   - **Password:** Initial password
   - **Role:** Select "teacher"
   - **Qualified Grades:** Select grades they can teach (e.g., 10, 11, 12)

4. **Click "Create"**

### Setting Qualified Grades

When creating/editing a teacher, select which grades they're qualified to teach:

**Example:**
- Grade 6, 7, 8, 9 → Can teach junior classes
- Grade 12, 13 → Can teach A/L classes

**Why it matters:**
- When creating a class for Grade 10, only teachers with "10" in qualified grades will appear
- Prevents assigning unqualified teachers

### Viewing Teacher Schedules

1. Go to Classes page
2. Use search to filter by teacher name
3. See all classes assigned to that teacher

---

## Subjects & Resources

### Managing Subjects

1. **Navigate to Subjects Page**

2. **Add New Subject**
   - Click "Add Subject"
   - Enter subject name (e.g., "Mathematics", "Physics")
   - Select applicable grades
   - Click "Create"

3. **Subject Validation**
   The system enforces grade-appropriate subjects:
   - **Primary (1-5):** Core subjects only
   - **Junior (6-9):** No A/L subjects
   - **O/L (10-11):** Standard O/L subjects
   - **A/L (12-13):** All subjects including advanced

### Resource Library

Upload learning materials:
1. Go to Resources page
2. Click "Upload Resource"
3. Select file (PDF, DOC, PPT, etc.)
4. Set grade level and subject
5. Click "Upload"

Students and teachers can access resources filtered by their grades.

---

## Financial Management

### Setting Fee Structures

1. **Navigate to Payments Page**
2. **Configure Default Fees**
   - Set monthly fee per grade
   - Example: Grade 10 = Rs. 5,000/month

3. **Individual Class Fees**
   - When creating a class, you can override the default fee
   - Useful for specialized classes

### Viewing Payment Records

**Filter Options:**
- By student
- By month
- By status (Paid, Pending, Overdue)

**Payment Details Include:**
- Student name
- Month
- Amount
- Status
- Payment date

### Payment Tracking

**Dashboard shows:**
- Total monthly revenue
- Pending payments (red badge)
- Payment completion rate

**Generate Reports:**
- Monthly collection summary
- Student-wise payment history
- Defaulters list

---

## Attendance Tracking

### Viewing Attendance

1. **Navigate to Attendance Page**
2. **Select Date Range**
3. **Filter by:**
   - Grade
   - Class
   - Student

### Attendance Statistics

Dashboard cards show:
- **Attendance Rate:** Percentage of students present
- **Absentees Today:** Count of absent students
- **Classes Today:** Number of scheduled classes

### Teachers Mark Attendance

Teachers mark attendance from their portal:
- You can view the records
- Generate attendance reports
- Identify chronic absentees

---

## Reports & Analytics

### Available Reports

1. **Student Performance Report**
   - Average grades per grade level
   - Top performers
   - Students needing support

2. **Financial Report**
   - Monthly revenue trends
   - Collection efficiency
   - Pending payments

3. **Attendance Report**
   - Attendance trends
   - Class-wise attendance
   - Student-wise attendance

4. **Class Utilization Report**
   - Hall occupancy
   - Teacher workload
   - Peak hours analysis

### Generating Reports

1. Select report type
2. Choose date range
3. Apply filters (grade, subject, etc.)
4. Click "Generate Report"
5. Export as PDF or Excel

---

## System Settings

### User Management

**Create New Users:**
1. Go to Users page
2. Click "Add User"
3. Select role: Admin, Teacher, or Student
4. Fill details
5. Click "Create"

**Manage Existing Users:**
- Edit user information
- Reset passwords
- Change roles
- Deactivate accounts

### Role Permissions

**Admin:**
- Full system access
- Can create/edit/delete all data
- Access to financial records
- System configuration

**Teacher:**
- View assigned classes
- Create assignments
- Grade submissions
- Mark attendance
- View own student's data

**Student:**
- View own classes
- Submit assignments
- View own grades
- Check schedule
- View payment status

### Grade Filter Usage

The grade filter in the sidebar is powerful:

**Select "All":**
- See all students (1-13)
- See all classes
- Global statistics

**Select "Primary":**
- See only grades 1-5
- Classes for primary students
- Primary-specific stats

**Select "Grade 10":**
- See only Grade 10 students
- Classes for Grade 10
- Grade 10 stats

> 💡 **Pro Tip:** Use grade filters to focus on specific grade levels when reviewing data or making decisions.

---

## Best Practices

### Student Data Management

✅ **DO:**
- Keep student information up to date
- Use strong temporary passwords
- Verify email addresses before creating accounts
- Regularly review student enrollment status

❌ **DON'T:**
- Share student login credentials
- Delete students unless absolutely necessary
- Use weak passwords like "123456"
- Forget to update grade levels at year end

### Class Scheduling

✅ **DO:**
- Check teacher and hall availability before scheduling
- Leave gaps between classes for preparation
- Consider student age when scheduling (younger students earlier)
- Use the weekly view for visual planning

❌ **DON'T:**
- Overload teachers with back-to-back classes
- Schedule conflicting times
- Forget to assign halls
- Ignore system conflict warnings

### Financial Management

✅ **DO:**
- Set clear fee structures upfront
- Track payments monthly
- Follow up on pending payments promptly
- Generate regular financial reports

❌ **DON'T:**
- Change fees mid-month without notice
- Ignore overdue payments
- Forget to update fee structures annually

### Communication

✅ **DO:**
- Use the Announcements feature for important updates
- Keep parents informed about student progress
- Respond to teacher queries promptly
- Regular system backups

❌ **DON'T:**
- Share sensitive student data via public channels
- Delay critical communications
- Forget to archive old announcements

---

## Troubleshooting

### Common Issues & Solutions

#### 1. **Cannot create student - Email already exists**

**Problem:** Email address is already in use

**Solution:**
- Use a different email address
- Check if student already exists in system
- If old record, edit instead of creating new

---

#### 2. **No teachers appear when creating class**

**Problem:** Selected grade has no qualified teachers

**Solution:**
- Go to Users page
- Find the teacher
- Click Edit
- Add the grade to "Qualified Grades"
- Try creating class again

---

#### 3. **Class conflict detected**

**Problem:** Teacher or hall is busy at selected time

**Solution:**
- Choose different time slot
- OR choose different teacher
- OR choose different hall
- Use weekly schedule view to find gaps

---

#### 4. **Student cannot login**

**Problem:** Login credentials not working

**Solution:**
- Verify email is correct (case-sensitive)
- Reset student password from Users page
- Check if account is active (not deleted)
- Clear browser cache and try again

---

#### 5. **Grade filter not working**

**Problem:** Data not filtering correctly

**Solution:**
- Refresh the page
- Clear filter and reapply
- Check browser console for errors
- Try different browser

---

#### 6. **Dashboard stats seem wrong**

**Problem:** Numbers don't match expectations

**Solution:**
- Check if grade filter is applied (top of sidebar)
- Verify data by going to specific pages
- Refresh the page
- Check date range if applicable

---

## Quick Reference

### Student Management Workflow
```
1. Click "Students" in sidebar
2. Click "Add New Student"
3. Fill form (Name, Email, Password, Grade)
4. Click "Create"
5. Student can now login
```

### Class Creation Workflow
```
1. Click "Classes" in sidebar
2. Click "Add New Class"
3. Select Grade → Subject filters automatically
4. Select Teacher → Only qualified teachers shown
5. Set Day & Time
6. Select Hall → System checks conflicts
7. Set Fee (optional)
8. Click "Create"
```

### Payment Tracking Workflow
```
1. Click "Payments" in sidebar
2. View pending payments in red
3. Filter by student/month
4. Generate financial reports
5. Export to Excel/PDF
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `?` | Show shortcuts help |
| `g` + `h` | Go to Dashboard |
| `g` + `s` | Go to Students |
| `g` + `c` | Go to Classes |
| `/` | Focus search bar |

> 💡 **Tip:** Press `?` anytime to see all available shortcuts!

---

## Need Help?

### Support Channels

📧 **Email:** support@yourlms.com  
📱 **Phone:** +94 XX XXX XXXX  
💬 **Live Chat:** Available in-app (bottom-right)  
📚 **Knowledge Base:** help.yourlms.com

### Video Tutorials

Check out our video library for visual guides:
- 🎥 Adding students
- 🎥 Creating classes
- 🎥 Managing payments
- 🎥 Generating reports

---

**Happy Managing! 🎉**

*SYZYGY LMS - Empowering Education*
