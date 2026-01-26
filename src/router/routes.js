const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/login', component: () => import('pages/LoginPage.vue') },
      { path: '/register', component: () => import('pages/RegisterPage.vue') }
    ]
  },
  {
    path: '/dashboard',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true, roles: ['admin'] },
    children: [
      { path: '', component: () => import('pages/DashboardPage.vue') },
      { path: 'profile', component: () => import('pages/ProfilePage.vue') },
      { path: 'users', component: () => import('pages/UsersPage.vue') },
      { path: 'roles', component: () => import('pages/RolesPage.vue') },
      { path: 'students', component: () => import('pages/StudentsPage.vue') },
      { path: 'classes', component: () => import('pages/ClassesPage.vue') },
      { path: 'exams', component: () => import('pages/ExamsPage.vue') },
      { path: 'communication', component: () => import('pages/CommunicationPage.vue') },
      { path: 'attendance', component: () => import('pages/AttendancePage.vue') }
    ]
  },
  {
    path: '/student',
    component: () => import('layouts/StudentLayout.vue'),
    meta: { requiresAuth: true, roles: ['student', 'admin'] },
    children: [
        { path: '', component: () => import('pages/StudentDashboardPage.vue') },
        { path: 'courses', component: () => import('pages/StudentCoursesPage.vue') },
        { path: 'assignments', component: () => import('pages/StudentAssignmentsPage.vue') },
        { path: 'grades', component: () => import('pages/StudentPerformancePage.vue') },
        { path: 'schedule', component: () => import('pages/StudentSchedulePage.vue') },
        { path: 'settings', component: () => import('pages/StudentSettingsPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/teacher',
    component: () => import('layouts/TeacherLayout.vue'),
    meta: { requiresAuth: true, roles: ['teacher', 'admin'] },
    children: [
        { path: '', component: () => import('pages/teacher/TeacherDashboardPage.vue') },
        { path: 'classes', component: () => import('pages/teacher/TeacherClassesPage.vue') },
        { path: 'assignments', component: () => import('pages/teacher/TeacherAssignmentsPage.vue') },
        { path: 'students', component: () => import('pages/teacher/TeacherStudentsPage.vue') },
        { path: 'reports', component: () => import('pages/teacher/TeacherReportsPage.vue') },
        { path: 'profile', component: () => import('pages/teacher/TeacherProfilePage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
