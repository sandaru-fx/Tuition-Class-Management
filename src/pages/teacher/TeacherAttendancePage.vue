<template>
  <q-page class="q-pa-lg bg-slate-50">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold text-slate-800 font-outfit">Mark Attendance</div>
        <div class="text-subtitle1 text-slate-500">Quick attendance marking for today's classes</div>
      </div>
      <q-btn
        unelevated
        color="blue-600"
        icon="history"
        label="View History"
        no-caps
        class="rounded-borders"
        @click="showHistory = true"
      />
    </div>

    <!-- Today's Date Card -->
    <q-card class="q-mb-lg shadow-sm rounded-xl bg-gradient-blue text-white">
      <q-card-section class="q-pa-lg">
        <div class="row items-center">
          <q-icon name="today" size="48px" class="q-mr-md" />
          <div>
            <div class="text-h5 text-weight-bold">{{ formatDate(new Date()) }}</div>
            <div class="text-caption opacity-80">{{ getDayName(new Date()) }}</div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Class Selection -->
    <q-card class="q-mb-lg shadow-sm rounded-xl">
      <q-card-section class="q-pa-lg">
        <div class="text-h6 text-weight-bold text-slate-800 q-mb-md">Select Class</div>
        
        <div v-if="loading" class="text-center q-pa-md">
          <q-spinner color="blue-600" size="2em" />
          <div class="text-caption text-slate-500 q-mt-sm">Loading today's classes...</div>
        </div>

        <div v-else-if="todayClasses.length === 0" class="text-center q-pa-xl text-grey-5">
          <q-icon name="event_busy" size="64px" />
          <div class="text-h6 q-mt-md">No classes today</div>
          <div class="text-caption">Enjoy your day off!</div>
        </div>

        <div v-else class="row q-col-gutter-md">
          <div v-for="cls in todayClasses" :key="cls.id" class="col-12 col-md-6">
            <q-card
              :class="['cursor-pointer transition-all rounded-xl', selectedClass?.id === cls.id ? 'bg-blue-50 border-blue' : 'bg-white']"
              @click="selectClass(cls)"
              flat
              bordered
            >
              <q-card-section class="q-pa-md">
                <div class="row items-center justify-between">
                  <div class="col">
                    <div class="text-weight-bold text-slate-800">{{ cls.subject?.name }}</div>
                    <div class="text-caption text-slate-500 q-mt-xs">
                      Grade {{ cls.grade }} • {{ formatTime(cls.start_time) }} - {{ formatTime(cls.end_time) }}
                    </div>
                    <div class="text-caption text-slate-400 q-mt-xs flex items-center">
                      <q-icon name="meeting_room" size="14px" class="q-mr-xs" />
                      {{ cls.hall?.name || 'TBA' }}
                    </div>
                  </div>
                  <q-icon 
                    :name="selectedClass?.id === cls.id ? 'check_circle' : 'radio_button_unchecked'" 
                    :color="selectedClass?.id === cls.id ? 'blue-600' : 'grey-4'"
                    size="32px"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Attendance Marking (Shown when class selected) -->
    <q-card v-if="selectedClass" class="shadow-sm rounded-xl">
      <q-card-section class="q-pa-lg bg-blue-50">
        <div class="row items-center justify-between">
          <div>
            <div class="text-h6 text-weight-bold text-slate-800">{{ selectedClass.subject?.name }}</div>
            <div class="text-caption text-slate-500">
              {{ studentsData.length }} students • Grade {{ selectedClass.grade }}
            </div>
          </div>
          <div class="text-right">
            <div class="text-caption text-slate-500">Present</div>
            <div class="text-h5 text-weight-bold text-green-600">
              {{ Object.values(attendanceData).filter(v => v === 'present').length }}
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Student List -->
      <q-card-section class="q-pa-none">
        <q-list v-if="studentsData.length > 0" separator>
          <q-item v-for="student in studentsData" :key="student.id">
            <q-item-section avatar>
              <q-avatar color="blue-100" text-color="blue-600" icon="person" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-medium">{{ student.full_name }}</q-item-label>
              <q-item-label caption>{{ student.phone || 'No phone' }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn-toggle
                v-model="attendanceData[student.id]"
                toggle-color="primary"
                :options="[
                  { label: 'Present', value: 'present', icon: 'check_circle', color: 'green' },
                  { label: 'Absent', value: 'absent', icon: 'cancel', color: 'red' },
                  { label: 'Late', value: 'late', icon: 'schedule', color: 'orange' }
                ]"
                no-caps
                unelevated
                spread
                class="attendance-toggle"
              />
            </q-item-section>
          </q-item>
        </q-list>

        <div v-else class="text-center q-pa-xl text-grey-5">
          <q-icon name="groups_off" size="48px" />
          <div class="q-mt-sm">No students enrolled</div>
        </div>
      </q-card-section>

      <!-- Actions -->
      <q-card-actions align="right" class="q-pa-lg bg-grey-1">
        <q-btn
          flat
          label="Clear"
          color="slate-600"
          no-caps
          @click="resetAttendance"
          class="rounded-borders"
        />
        <q-btn
          unelevated
          label="Save Attendance"
          color="blue-600"
          icon-right="check"
          no-caps
          @click="saveAttendance"
          :loading="saving"
          :disable="studentsData.length === 0"
          class="rounded-borders"
        />
      </q-card-actions>
    </q-card>

    <!-- History Dialog -->
    <q-dialog v-model="showHistory" maximized>
      <q-card>
        <q-toolbar class="bg-blue-600 text-white">
          <q-toolbar-title class="font-outfit">Attendance History</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-pa-lg">
          <div class="text-center q-pa-xl text-grey-5">
            <q-icon name="history" size="64px" />
            <div class="text-h6 q-mt-md">Attendance History</div>
            <div class="text-caption">Coming soon: View past attendance records</div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { teacherService } from 'src/services/teacherService'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const authStore = useAuthStore()

const todayClasses = ref([])
const selectedClass = ref(null)
const studentsData = ref([])
const attendanceData = ref({})
const loading = ref(true)
const saving = ref(false)
const showHistory = ref(false)

async function fetchTodayClasses() {
  if (!authStore.profile?.id) {
    $q.notify({ type: 'warning', message: 'Please login to mark attendance' })
    loading.value = false
    return
  }

  loading.value = true
  try {
    todayClasses.value = await teacherService.getTodaySchedule(authStore.profile.id)
  } catch (error) {
    console.error('Error fetching today\'s classes:', error)
    $q.notify({ type: 'negative', message: 'Failed to load today\'s classes' })
  } finally {
    loading.value = false
  }
}

async function selectClass(cls) {
  selectedClass.value = cls
  
  try {
    // Fetch class details with students
    const details = await teacherService.getClassDetails(cls.id)
    studentsData.value = details.students.map(enrollment => enrollment.student)
    
    // Initialize attendance data (default to present)
    attendanceData.value = {}
    studentsData.value.forEach(student => {
      attendanceData.value[student.id] = 'present'
    })
  } catch (error) {
    console.error('Error loading students:', error)
    $q.notify({ type: 'negative', message: 'Failed to load students' })
  }
}

function resetAttendance() {
  studentsData.value.forEach(student => {
    attendanceData.value[student.id] = 'present'
  })
  $q.notify({ type: 'info', message: 'Reset to all present' })
}

async function saveAttendance() {
  saving.value = true
  try {
    const today = new Date().toISOString().split('T')[0]
    await teacherService.markAttendance(
        selectedClass.value.id, 
        today, 
        attendanceData.value
    )
    
    $q.notify({
      type: 'positive',
      message: 'Attendance saved successfully!',
      caption: `${selectedClass.value.subject?.name} - Grade ${selectedClass.value.grade}`
    })
    
    // Reset selection
    selectedClass.value = null
    studentsData.value = []
    attendanceData.value = {}
  } catch (error) {
    console.error('Error saving attendance:', error)
    $q.notify({ type: 'negative', message: 'Failed to save attendance' })
  } finally {
    saving.value = false
  }
}

function formatDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString('en-US', options)
}

function getDayName(date) {
  return date.toLocaleDateString('en-US', { weekday: 'long' })
}

function formatTime(time) {
  if (!time) return 'TBA'
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${period}`
}

onMounted(() => {
  fetchTodayClasses()
})
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.rounded-xl { border-radius: 16px; }
.rounded-borders { border-radius: 8px; }
.bg-slate-50 { background-color: #F8FAFC; }
.bg-grey-1 { background-color: #F5F5F5; }
.text-slate-800 { color: #1E293B; }
.text-slate-600 { color: #475569; }
.text-slate-500 { color: #64748B; }
.text-slate-400 { color: #94A3B8; }
.border-blue { border: 2px solid #2563EB; }
.bg-gradient-blue {
  background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);
}
.opacity-80 { opacity: 0.8; }
.attendance-toggle {
  min-width: 300px;
}
</style>
