<template>
  <q-page class="q-pa-lg">
    
    <!-- Welcome Section -->
    <div class="row items-center q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold text-dark q-mb-xs font-outfit">Dashboard Overview</h1>
        <p class="text-grey-7 q-mb-none text-subtitle1">Here's what's happening in your institute today.</p>
      </div>
      <q-space />
      <div class="row q-gutter-sm">
        <q-btn unelevated color="white" text-color="black" label="Refresh Data" icon="refresh" class="border-grey" no-caps @click="fetchDashboardData" :loading="loading" />
        <q-btn unelevated color="black" text-color="white" label="New Student" icon="add" no-caps to="/dashboard/students" />
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row q-col-gutter-lg q-mb-xl">
      <div class="col-12" v-if="pinnedNotice">
          <q-banner rounded class="bg-orange-1 text-dark q-mb-md border-orange">
              <template v-slot:avatar>
                  <q-icon name="campaign" color="orange-9" />
              </template>
              <div class="text-weight-bold">{{ pinnedNotice.title }}</div>
              <div>{{ pinnedNotice.message }}</div>
          </q-banner>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="my-card shadow-1 hover-shadow transition-all bg-gradient-blue text-white">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-caption text-blue-1 text-uppercase text-weight-bold letter-spacing-1">Total Students</div>
                <div class="text-h4 text-weight-bolder q-mt-sm font-outfit">{{ totalStudents }}</div>
              </div>
              <div class="col-auto">
                <q-icon name="groups" size="48px" class="text-blue-2" />
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-caption text-weight-bold bg-white text-blue-9 q-px-sm q-py-xs rounded-borders inline-block">
              <q-icon name="person_add" size="14px" /> New
            </div>
            <span class="text-caption text-blue-1 q-ml-sm">Joined this month</span>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="my-card shadow-1 hover-shadow transition-all">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-caption text-grey-6 text-uppercase text-weight-bold letter-spacing-1">Active Classes</div>
                <div class="text-h4 text-weight-bolder text-dark q-mt-sm font-outfit">{{ activeClasses }}</div>
              </div>
              <div class="col-auto">
                <q-avatar size="48px" font-size="24px" color="purple-1" text-color="purple-9" icon="school" />
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-caption text-purple-7 text-weight-bold bg-purple-1 q-px-sm q-py-xs rounded-borders inline-block">
              Active
            </div>
            <span class="text-caption text-grey-6 q-ml-sm">Scheduled classes</span>
          </q-card-section>
        </q-card>
      </div>

       <div class="col-12 col-sm-6 col-md-3">
        <q-card class="my-card shadow-1 hover-shadow transition-all">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-caption text-grey-6 text-uppercase text-weight-bold letter-spacing-1">Income (Today)</div>
                <div class="text-h4 text-weight-bolder text-dark q-mt-sm font-outfit">{{ formatCurrency(todaysIncome) }}</div>
              </div>
              <div class="col-auto">
                <q-avatar size="48px" font-size="24px" color="green-1" text-color="green-9" icon="payments" />
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-caption text-green-7 text-weight-bold bg-green-1 q-px-sm q-py-xs rounded-borders inline-block">
              <q-icon name="trending_up" size="14px" /> +5%
            </div>
             <span class="text-caption text-grey-6 q-ml-sm">vs yesterday</span>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="my-card shadow-1 hover-shadow transition-all">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-caption text-grey-6 text-uppercase text-weight-bold letter-spacing-1">Attendance</div>
                <div class="text-h4 text-weight-bolder text-dark q-mt-sm font-outfit">{{ attendanceRate }}%</div>
              </div>
              <div class="col-auto">
                <q-avatar size="48px" font-size="24px" color="orange-1" text-color="orange-9" icon="check_circle" />
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
             <div class="text-caption text-orange-8 text-weight-bold bg-orange-1 q-px-sm q-py-xs rounded-borders inline-block">
              Today
            </div>
            <span class="text-caption text-grey-6 q-ml-sm">Rate</span>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- Recent Enrollments (Actually Students) -->
      <div class="col-12 col-md-8">
        <q-card class="shadow-1 rounded-borders-lg">
          <q-card-section class="row items-center justify-between q-pb-none q-px-lg q-pt-lg">
            <div class="text-h6 text-weight-bold font-outfit">Recently Joined Students</div>
            <q-btn flat dense color="primary" label="View All" no-caps to="/dashboard/students" />
          </q-card-section>

          <q-card-section class="q-px-none">
            <q-markup-table flat class="text-left">
              <thead class="bg-grey-1">
                <tr>
                  <th class="text-left text-grey-7 text-weight-bold q-pl-lg">Student</th>
                  <th class="text-left text-grey-7 text-weight-bold">Grade</th>
                  <th class="text-left text-grey-7 text-weight-bold">Joined Date</th>
                  <th class="text-center text-grey-7 text-weight-bold q-pr-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="recentStudents.length === 0">
                    <td colspan="4" class="text-center text-grey-6 q-py-md">No students found.</td>
                </tr>
                <tr v-else v-for="(student, index) in recentStudents" :key="index" class="hover-bg-grey-1 transition-all">
                  <td class="q-pl-lg">
                    <div class="row items-center">
                      <q-avatar size="32px" color="blue-1" text-color="blue-8" class="q-mr-md text-weight-bold">{{ student.first_name ? student.first_name.charAt(0) : '?' }}</q-avatar>
                      <div class="column">
                          <span class="text-weight-bold">{{ student.first_name }} {{ student.last_name }}</span>
                          <span class="text-caption text-grey text-italic">{{ student.school }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="text-grey-8">{{ student.grade }}</td>
                  <td class="text-grey-6">{{ formatDate(student.created_at) }}</td>
                  <td class="text-center q-pr-lg">
                    <q-chip size="sm" :color="student.is_active ? 'green-1' : 'red-1'" :text-color="student.is_active ? 'green-8' : 'red-8'" :label="student.is_active ? 'Active' : 'Inactive'" class="text-weight-bold" />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>
        </q-card>
      </div>

      <!-- Quick Actions / Upcoming -->
      <div class="col-12 col-md-4">
        <q-card class="shadow-1 rounded-borders-lg q-mb-md">
            <q-card-section>
                 <div class="text-h6 text-weight-bold font-outfit q-mb-md">Quick Actions</div>
                 <div class="row q-col-gutter-sm">
                     <div class="col-6">
                         <q-btn outline color="primary" class="full-width" icon="school" label="Classes" stack to="/dashboard/classes" />
                     </div>
                     <div class="col-6">
                         <q-btn outline color="primary" class="full-width" icon="assignment" label="Exams" stack to="/dashboard/exams" />
                     </div>
                 </div>
            </q-card-section>
        </q-card>

        <q-card class="shadow-1 rounded-borders-lg h-100">
          <q-card-section class="q-px-lg q-pt-lg">
             <div class="text-h6 text-weight-bold font-outfit q-mb-md">Upcoming Exams</div>
             
             <q-list separator>
               <q-item v-if="upcomingExams.length === 0" class="text-grey-6 text-center">
                   <q-item-section>No upcoming exams</q-item-section>
               </q-item>
               <q-item v-for="exam in upcomingExams" :key="exam.id" class="q-px-none q-py-md">
                 <q-item-section avatar>
                   <div class="bg-orange-1 text-orange-9 q-pa-sm rounded-borders text-center" style="min-width: 50px">
                     <div class="text-caption text-weight-bold">TERM</div>
                     <div class="text-h6 text-weight-bold line-height-tight">1</div>
                   </div>
                 </q-item-section>
                 <q-item-section>
                   <div class="text-subtitle2 text-weight-bold">{{ exam.name }}</div>
                   <div class="text-caption text-grey-6">{{ exam.start_date || exam.date }}</div>
                 </q-item-section>
                 <q-item-section side>
                   <q-btn round flat icon="chevron_right" color="grey-5" @click="$router.push('/dashboard/exams')" />
                 </q-item-section>
               </q-item>
             </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from 'boot/supabase'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const loading = ref(false)

// Reactive State
const totalStudents = ref(0)
const todaysIncome = ref(15000) // Mock
const activeClasses = ref(0)
const attendanceRate = ref(85) // Mock
const recentStudents = ref([])
const upcomingExams = ref([])
const pinnedNotice = ref(null)


async function fetchDashboardData() {
  loading.value = true
  try {
    // 0. Fetch Pinned Notice
    const { data: notices } = await supabase.from('notices').select('*').eq('is_pinned', true).order('created_at', { ascending: false }).limit(1)
    if (notices && notices.length > 0) pinnedNotice.value = notices[0]

    // 1. Fetch Total Students
    const { count: studentCount, error: studentError, data: studentsData } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: false })
      .order('created_at', { ascending: false })
      .limit(5)

    if (studentError) throw studentError
    totalStudents.value = studentCount || 0
    recentStudents.value = studentsData || []

    // 2. Fetch Active Classes
    const { count: classCount, error: classError } = await supabase
      .from('classes')
      .select('*', { count: 'exact', head: true })
    
    if (classError) throw classError
    activeClasses.value = classCount || 0

    // 3. Fetch Upcoming Exams
    const { data: exams, error: examsError } = await supabase
        .from('exams')
        .select('*')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(3)
        
    if (!examsError) {
        upcomingExams.value = exams
    }

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to load dashboard data'
    })
  } finally {
      loading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})

function formatCurrency(value) {
  return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(value)
}

function formatDate(dateStr) {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-UK', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.font-outfit {
  font-family: 'Outfit', sans-serif;
}
.border-grey {
  border: 1px solid #e0e0e0;
}
.border-orange {
    border: 1px solid #ffe0b2;
}
.my-card {
  border-radius: 12px;
  border: 1px solid #f0f0f0;
}
.rounded-borders-lg {
  border-radius: 16px;
}
.letter-spacing-1 {
  letter-spacing: 1px;
}
.hover-shadow:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}
.transition-all {
  transition: all 0.3s ease;
}
.inline-block {
  display: inline-block;
}
.hover-bg-grey-1:hover {
  background-color: #fafafa;
}
.line-height-tight {
  line-height: 1.1;
}
.bg-gradient-blue {
    background: linear-gradient(135deg, #1976d2 0%, #0d47a1 100%);
}
</style>
