<template>
  <q-page class="q-pa-lg bg-slate-50">
    <!-- Loading State -->
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner color="blue-600" size="3em" />
      <div class="text-slate-500 q-mt-md">Loading class details...</div>
    </div>

    <!-- Class Detail Content -->
    <div v-else-if="classData">
      <!-- Header with Back Button -->
      <div class="row items-center q-mb-lg">
        <q-btn
          flat
          round
          dense
          icon="arrow_back"
          color="slate-600"
          @click="$router.back()"
          class="q-mr-md"
        />
        <div class="col">
          <div class="text-h4 text-weight-bold text-slate-800 font-outfit">
            {{ classData.subject?.name || 'Class Details' }}
          </div>
          <div class="text-subtitle1 text-slate-500">
            Grade {{ classData.grade }} • {{ classData.day_of_week }} {{ formatTime(classData.start_time) }} - {{ formatTime(classData.end_time) }}
          </div>
        </div>
        <q-btn
          unelevated
          color="blue-600"
          icon="event_available"
          label="Mark Attendance"
          no-caps
          class="rounded-borders"
          @click="showAttendanceDialog = true"
        />
      </div>

      <!-- Info Cards -->
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-6 col-md-3">
          <q-card class="bg-white shadow-sm rounded-xl">
            <q-card-section class="q-pa-md">
              <div class="text-caption text-slate-500">Students</div>
              <div class="text-h5 text-weight-bold text-blue-600">{{ classData.students?.length || 0 }}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-6 col-md-3">
          <q-card class="bg-white shadow-sm rounded-xl">
            <q-card-section class="q-pa-md">
              <div class="text-caption text-slate-500">Hall</div>
              <div class="text-body1 text-weight-bold text-slate-800">{{ classData.hall?.name || 'TBA' }}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-6 col-md-3">
          <q-card class="bg-white shadow-sm rounded-xl">
            <q-card-section class="q-pa-md">
              <div class="text-caption text-slate-500">Monthly Fee</div>
              <div class="text-body1 text-weight-bold text-green-600">Rs. {{ classData.monthly_fee || 0 }}/=</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-6 col-md-3">
          <q-card class="bg-white shadow-sm rounded-xl">
            <q-card-section class="q-pa-md">
              <div class="text-caption text-slate-500">Subject Code</div>
              <div class="text-body1 text-weight-bold text-slate-800">{{ classData.subject?.code || 'N/A' }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Tabs -->
      <q-card class="shadow-sm rounded-xl">
        <q-tabs
          v-model="activeTab"
          dense
          class="text-grey"
          active-color="blue-600"
          indicator-color="blue-600"
          align="left"
          narrow-indicator
        >
          <q-tab name="students" label="Students" icon="groups" no-caps />
          <q-tab name="attendance" label="Attendance" icon="event_available" no-caps />
          <q-tab name="performance" label="Performance" icon="bar_chart" no-caps />
          <q-tab name="resources" label="Resources" icon="folder" no-caps />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="activeTab" animated>
          <!-- Students Tab -->
          <q-tab-panel name="students" class="q-pa-none">
            <div class="q-pa-md row items-center justify-between no-print">
              <div class="text-subtitle1 text-weight-bold">Enrolled Students</div>
              <q-btn 
                outline 
                color="green-600" 
                icon="download" 
                label="Export CSV" 
                no-caps 
                size="sm"
                @click="exportStudents"
              />
            </div>
            <q-table
              :rows="classData.students"
              :columns="studentColumns"
              row-key="id"
              flat
              class="rounded-none"
            >
              <template v-slot:body-cell-student="props">
                <q-td :props="props">
                  <div class="text-weight-bold">{{ props.row.student?.full_name || 'N/A' }}</div>
                  <div class="text-caption text-slate-500">{{ props.row.student?.phone || 'No phone' }}</div>
                </q-td>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    flat
                    dense
                    round
                    icon="more_vert"
                    color="slate-400"
                    size="sm"
                  >
                    <q-menu>
                      <q-list style="min-width: 150px">
                        <q-item clickable v-close-popup :to="`/teacher/students/${props.row.student_id}`">
                          <q-item-section>View Profile</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup>
                          <q-item-section>Send Message</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </q-td>
              </template>

              <template v-slot:no-data>
                <div class="text-center q-pa-lg text-grey-5">
                  <q-icon name="groups" size="48px" />
                  <div class="q-mt-sm">No students enrolled</div>
                </div>
              </template>
            </q-table>
          </q-tab-panel>

          <!-- Attendance Tab -->
          <q-tab-panel name="attendance" class="q-pa-none">
            <div class="q-pa-md row items-center justify-between">
              <div class="text-subtitle1 text-weight-bold">Attendance History</div>
              <div class="q-gutter-sm">
                <q-btn 
                  outline 
                  color="green-600" 
                  icon="download" 
                  label="Export CSV" 
                  no-caps 
                  size="sm"
                  @click="exportAttendance"
                />
                <q-btn
                  unelevated
                  color="blue-600"
                  label="Mark Today"
                  no-caps
                  size="sm"
                  @click="showAttendanceDialog = true"
                />
              </div>
            </div>

            <q-list separator v-if="attendanceHistory.length > 0">
              <q-expansion-item
                v-for="record in attendanceHistory"
                :key="record.date"
                class="shadow-sm q-mb-xs"
                header-class="bg-white"
              >
                <template v-slot:header>
                  <q-item-section avatar>
                    <q-avatar color="blue-50" text-color="blue-600" icon="calendar_today" size="md" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">{{ formatDate(record.date) }}</q-item-label>
                    <q-item-label caption>
                      <span class="text-green text-weight-bold">P: {{ record.present }}</span> | 
                      <span class="text-red text-weight-bold">A: {{ record.absent }}</span> | 
                      <span class="text-orange text-weight-bold">L: {{ record.late }}</span>
                    </q-item-label>
                  </q-item-section>
                </template>

                <q-card>
                  <q-card-section class="q-pa-none">
                    <q-table
                      :rows="record.students"
                      :columns="attendanceDetailColumns"
                      flat
                      bordered
                      dense
                      hide-pagination
                      :pagination="{ rowsPerPage: 0 }"
                    >
                      <template v-slot:body-cell-status="props">
                        <q-td :props="props">
                          <q-badge :color="getStatusColor(props.value)">
                            {{ props.value.toUpperCase() }}
                          </q-badge>
                        </q-td>
                      </template>
                    </q-table>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </q-list>

            <div v-else class="text-center q-pa-xl text-grey-5">
              <q-icon name="event_busy" size="64px" />
              <div class="text-h6 q-mt-md">No attendance history</div>
              <div class="text-caption">Attendance records will appear here after marking.</div>
            </div>
          </q-tab-panel>

          <!-- Performance Tab -->
          <q-tab-panel name="performance" class="q-pa-lg">
            <div class="text-center q-pa-xl text-grey-5">
              <q-icon name="bar_chart" size="64px" />
              <div class="text-h6 q-mt-md">Class Performance Overview</div>
              <div class="text-caption">Coming soon: Charts showing average marks, pass rates, and trends</div>
            </div>
          </q-tab-panel>

          <!-- Resources Tab -->
          <q-tab-panel name="resources" class="q-pa-lg">
            <div class="text-center q-pa-xl text-grey-5">
              <q-icon name="folder" size="64px" />
              <div class="text-h6 q-mt-md">Class Resources</div>
              <div class="text-caption">Coming soon: Upload notes, past papers, and materials for students</div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>

    <!-- Error State -->
    <div v-else class="text-center q-pa-xl">
      <q-icon name="error_outline" size="80px" color="red-5" />
      <div class="text-h6 text-slate-600 q-mt-md">Class not found</div>
      <q-btn
        flat
        color="blue-600"
        label="Go Back"
        @click="$router.back()"
        class="q-mt-md"
      />
    </div>

    <!-- Attendance Dialog (Quick Mark) -->
    <q-dialog v-model="showAttendanceDialog">
      <q-card style="min-width: 500px" class="rounded-xl">
        <q-toolbar class="bg-blue-600 text-white">
          <q-toolbar-title class="font-outfit">Mark Attendance</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-pa-lg">
          <div class="text-caption text-slate-500 q-mb-md">
            {{ classData?.subject?.name }} - {{ classData?.day_of_week }}
          </div>

          <div v-if="classData?.students?.length === 0" class="text-center q-pa-lg text-grey-5">
            No students to mark attendance
          </div>

          <q-list v-else separator>
            <q-item v-for="(enrollment, index) in classData.students" :key="index">
              <q-item-section>
                <q-item-label>{{ enrollment.student?.full_name || 'N/A' }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn-toggle
                  v-model="attendanceData[enrollment.student_id]"
                  toggle-color="green"
                  :options="[
                    { label: 'P', value: 'present', color: 'green' },
                    { label: 'A', value: 'absent', color: 'red' },
                    { label: 'L', value: 'late', color: 'orange' }
                  ]"
                  no-caps
                  unelevated
                />
              </q-item-section>
            </q-item>
          </q-list>

          <q-btn
            unelevated
            color="blue-600"
            label="Save Attendance"
            no-caps
            class="full-width q-mt-lg rounded-borders"
            @click="saveAttendance"
            :disable="classData?.students?.length === 0"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { teacherService } from 'src/services/teacherService'
import { useQuasar } from 'quasar'

const route = useRoute()
const $q = useQuasar()

const classData = ref(null)
const attendanceHistory = ref([])
const loading = ref(true)
const activeTab = ref('students')
const showAttendanceDialog = ref(false)
const attendanceData = ref({})

const studentColumns = [
  { name: 'student', label: 'Student', field: 'student', align: 'left', sortable: true },
  { name: 'enrolled_at', label: 'Enrolled On', field: 'enrolled_at', align: 'left', sortable: true,
    format: (val) => val ? new Date(val).toLocaleDateString() : 'N/A'
  },
  { name: 'actions', label: '', field: '', align: 'right' }
]

const attendanceDetailColumns = [
  { name: 'student', label: 'Student', field: (row) => row.student?.full_name, align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' }
]

async function fetchClassDetails() {
  const classId = route.params.id
  loading.value = true

  try {
    const [details, history] = await Promise.all([
      teacherService.getClassDetails(classId),
      teacherService.getAttendanceHistory(classId)
    ])
    
    classData.value = details
    attendanceHistory.value = history
    
    // Initialize attendance data (default to present)
    if (classData.value?.students) {
      classData.value.students.forEach(enrollment => {
        attendanceData.value[enrollment.student_id] = 'present'
      })
    }
  } catch (error) {
    console.error('Error fetching class details:', error)
    $q.notify({ type: 'negative', message: 'Failed to load class details' })
  } finally {
    loading.value = false
  }
}

function formatTime(time) {
  if (!time) return 'TBA'
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${period}`
}

function formatDate(val) {
  return new Date(val).toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

function getStatusColor(status) {
  switch (status) {
    case 'present': return 'green'
    case 'absent': return 'red'
    case 'late': return 'orange'
    default: return 'grey'
  }
}

async function saveAttendance() {
  try {
    const today = new Date().toISOString().split('T')[0]
    await teacherService.markAttendance(
        route.params.id, 
        today, 
        attendanceData.value
    )
    
    $q.notify({
      type: 'positive',
      message: 'Attendance marked successfully!'
    })
    showAttendanceDialog.value = false
    fetchClassDetails() // Refresh history
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: 'Error saving attendance' })
  }
}

function exportAttendance() {
  const flatData = []
  attendanceHistory.value.forEach(record => {
    record.students.forEach(s => {
      flatData.push({
        Date: record.date,
        Student: s.student?.full_name,
        Status: s.status
      })
    })
  })
  
  teacherService.exportToCSV(flatData, `Attendance_${classData.value?.subject?.name}_Grade_${classData.value?.grade}`)
}

function exportStudents() {
  const flatData = classData.value.students.map(s => ({
    Name: s.student?.full_name,
    Phone: s.student?.phone || 'N/A',
    Enrolled_At: s.enrolled_at ? new Date(s.enrolled_at).toLocaleDateString() : 'N/A'
  }))
  
  teacherService.exportToCSV(flatData, `Students_${classData.value?.subject?.name}_Grade_${classData.value?.grade}`)
}

onMounted(() => {
  fetchClassDetails()
})
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.rounded-xl { border-radius: 16px; }
.rounded-borders { border-radius: 8px; }
.rounded-none { border-radius: 0; }
.bg-slate-50 { background-color: #F8FAFC; }
.text-slate-800 { color: #1E293B; }
.text-slate-600 { color: #475569; }
.text-slate-500 { color: #64748B; }
</style>
