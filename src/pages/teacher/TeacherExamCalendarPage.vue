<template>
  <q-page class="q-pa-lg bg-slate-50">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold text-slate-800 font-outfit">Exam Calendar</div>
        <div class="text-subtitle1 text-slate-500">Schedule and manage exams for your classes</div>
      </div>
      <q-btn 
        unelevated 
        color="blue-600" 
        icon="add" 
        label="Schedule Exam" 
        no-caps
        @click="openAddDialog"
      />
    </div>

    <!-- Calendar View -->
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-8">
        <q-card class="shadow-sm rounded-xl">
          <q-card-section class="q-pa-md">
            <div class="row items-center justify-between q-mb-md">
              <div class="text-h6 font-outfit">{{ currentMonthName }} {{ currentYear }}</div>
              <div class="q-gutter-xs">
                <q-btn flat round icon="chevron_left" @click="prevMonth" />
                <q-btn flat label="Today" no-caps @click="goToday" />
                <q-btn flat round icon="chevron_right" @click="nextMonth" />
              </div>
            </div>

            <!-- Calendar Grid -->
            <div class="calendar-grid">
              <!-- Weekdays -->
              <div v-for="day in weekDays" :key="day" class="calendar-weekday">
                {{ day }}
              </div>
              
              <!-- Days -->
              <div 
                v-for="(day, index) in calendarDays" 
                :key="index" 
                class="calendar-day"
                :class="{ 
                  'other-month': !day.isCurrentMonth, 
                  'today': day.isToday 
                }"
              >
                <div class="day-number">{{ day.date.getDate() }}</div>
                <div class="day-events">
                  <div 
                    v-for="exam in getExamsForDay(day.date)" 
                    :key="exam.id" 
                    class="exam-tag"
                    :class="getExamColor(exam)"
                    @click="viewExam(exam)"
                  >
                    <div class="ellipsis">{{ exam.title }}</div>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Upcoming Exams Sidebar -->
      <div class="col-12 col-md-4">
        <q-card class="shadow-sm rounded-xl">
          <q-card-section class="q-pa-md">
            <div class="text-h6 q-mb-md font-outfit">Upcoming Exams</div>
            
            <q-list v-if="upcomingExams.length > 0">
              <q-item v-for="exam in upcomingExams" :key="exam.id" class="rounded-lg q-mb-sm bg-blue-50">
                <q-item-section avatar>
                  <q-avatar color="blue-1" text-color="blue-600" icon="event" size="md" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ exam.title }}</q-item-label>
                  <q-item-label caption>
                    {{ formatDateShort(exam.exam_date) }} | {{ formatTime(exam.start_time) }}
                  </q-item-label>
                  <q-item-label caption>{{ exam.classes?.subject?.name }} - Grade {{ exam.classes?.grade }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn flat round dense icon="more_vert">
                    <q-menu auto-close>
                      <q-list style="min-width: 100px">
                        <q-item clickable @click="editExam(exam)">
                          <q-item-section>Edit</q-item-section>
                        </q-item>
                        <q-item clickable class="text-red" @click="confirmDelete(exam)">
                          <q-item-section>Delete</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </q-item-section>
              </q-item>
            </q-list>

            <div v-else class="text-center q-pa-lg text-grey-5">
              <q-icon name="event_busy" size="48px" />
              <div class="text-subtitle2 q-mt-sm">No upcoming exams</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Add/Edit Exam Dialog -->
    <q-dialog v-model="showExamDialog">
      <q-card style="min-width: 450px" class="rounded-xl">
        <q-card-section class="bg-blue-600 text-white row items-center">
          <div class="text-h6">{{ isEditing ? 'Edit Exam' : 'Schedule Exam' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-gutter-y-md q-pt-lg">
          <q-input outlined v-model="examForm.title" label="Exam Title *" autofocus />
          
          <q-select
            outlined
            v-model="examForm.class_id"
            :options="classOptions"
            option-label="label"
            option-value="id"
            emit-value
            map-options
            label="Class *"
          />

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input outlined v-model="examForm.exam_date" label="Date *" type="date" stack-label />
            </div>
            <div class="col-12 col-sm-6">
              <q-input outlined v-model="examForm.hall" label="Hall / Room" placeholder="e.g. Hall A" />
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input outlined v-model="examForm.start_time" label="Start Time *" type="time" stack-label />
            </div>
            <div class="col-12 col-sm-6">
              <q-input outlined v-model="examForm.end_time" label="End Time *" type="time" stack-label />
            </div>
          </div>

          <q-input outlined v-model="examForm.description" label="Description / Instructions" type="textarea" rows="2" />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" color="grey" v-close-popup no-caps />
          <q-btn 
            unelevated 
            :label="isEditing ? 'Save Changes' : 'Schedule Exam'" 
            color="blue-600" 
            @click="saveExam" 
            :loading="saving" 
            no-caps 
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation -->
    <q-dialog v-model="showDeleteDialog">
      <q-card class="rounded-xl">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="red-1" text-color="red" />
          <span class="q-ml-md text-h6 text-slate-800">Delete Exam?</span>
        </q-card-section>
        <q-card-section class="text-slate-600">
          Are you sure you want to delete <strong>{{ selectedExam?.title }}</strong>? This will remove it from the students' calendar as well.
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" color="grey-7" v-close-popup no-caps />
          <q-btn unelevated label="Delete Exam" color="red" @click="deleteExam" :loading="saving" no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { teacherService } from 'src/services/teacherService'
import { examService } from 'src/services/examService'
import { useQuasar, date } from 'quasar'

const $q = useQuasar()
const authStore = useAuthStore()

const loading = ref(true)
const saving = ref(false)
const showExamDialog = ref(false)
const showDeleteDialog = ref(false)
const isEditing = ref(false)

const exams = ref([])
const classOptions = ref([])
const selectedExam = ref(null)

const examForm = ref({
  title: '',
  class_id: null,
  exam_date: '',
  start_time: '08:00',
  end_time: '11:00',
  hall: '',
  description: ''
})

// Calendar Logic
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const currentDate = ref(new Date())

const currentMonth = computed(() => currentDate.value.getMonth())
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonthName = computed(() => date.formatDate(currentDate.value, 'MMMM'))

const calendarDays = computed(() => {
  const days = []
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1)
  const lastDayOfMonth = new Date(currentYear.value, currentMonth.value + 1, 0)
  
  // Padding for start of month
  const startPadding = firstDayOfMonth.getDay()
  for (let i = startPadding; i > 0; i--) {
    const d = new Date(currentYear.value, currentMonth.value, 1 - i)
    days.push({ date: d, isCurrentMonth: false, isToday: isSameDay(d, new Date()) })
  }
  
  // Days of month
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const d = new Date(currentYear.value, currentMonth.value, i)
    days.push({ date: d, isCurrentMonth: true, isToday: isSameDay(d, new Date()) })
  }
  
  // Padding for end of month
  const endPadding = 42 - days.length
  for (let i = 1; i <= endPadding; i++) {
    const d = new Date(currentYear.value, currentMonth.value + 1, i)
    days.push({ date: d, isCurrentMonth: false, isToday: isSameDay(d, new Date()) })
  }
  
  return days
})

const upcomingExams = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return exams.value
    .filter(e => new Date(e.exam_date) >= today)
    .sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date))
    .slice(0, 5)
})

async function fetchData() {
  loading.value = true
  try {
    const teacherId = authStore.profile.id
    const [examsData, classesData] = await Promise.all([
      examService.getByTeacher(teacherId),
      teacherService.getMyClasses(teacherId)
    ])
    
    exams.value = examsData
    classOptions.value = classesData.map(c => ({
      label: `${c.subject?.name} - Grade ${c.grade}`,
      id: c.id
    }))
  } catch {
    console.error('Failed to load exam data')
    $q.notify({ type: 'negative', message: 'Failed to load exam data' })
  } finally {
    loading.value = false
  }
}

function getExamsForDay(dayDate) {
  return exams.value.filter(e => {
    const d = new Date(e.exam_date)
    return isSameDay(d, dayDate)
  })
}

function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate()
}

function getExamColor(exam) {
  // Logic to return different colors based on subject or status
  const colors = ['bg-blue-1 text-blue-800', 'bg-purple-1 text-purple-800', 'bg-green-1 text-green-800', 'bg-orange-1 text-orange-800']
  const index = exam.class_id ? exam.class_id.charCodeAt(0) % colors.length : 0
  return colors[index]
}

function prevMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

function nextMonth() {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}

function goToday() {
  currentDate.value = new Date()
}

function openAddDialog() {
  isEditing.value = false
  selectedExam.value = null
  examForm.value = {
    title: '',
    class_id: classOptions.value.length > 0 ? classOptions.value[0].id : null,
    exam_date: date.formatDate(new Date(), 'YYYY-MM-DD'),
    start_time: '08:00',
    end_time: '11:00',
    hall: '',
    description: ''
  }
  showExamDialog.value = true
}

function editExam(exam) {
  isEditing.value = true
  selectedExam.value = exam
  examForm.value = {
    title: exam.title,
    class_id: exam.class_id,
    exam_date: exam.exam_date,
    start_time: exam.start_time,
    end_time: exam.end_time,
    hall: exam.hall || '',
    description: exam.description || ''
  }
  showExamDialog.value = true
}

async function saveExam() {
  if (!examForm.value.title || !examForm.value.class_id || !examForm.value.exam_date) {
    $q.notify({ type: 'warning', message: 'Please fill all required fields' })
    return
  }

  saving.value = true
  try {
    const examData = {
      ...examForm.value,
      teacher_id: authStore.profile.id
    }

    if (isEditing.value) {
      await examService.update(selectedExam.value.id, examData)
      $q.notify({ type: 'positive', message: 'Exam updated successfully' })
    } else {
      await examService.create(examData)
      $q.notify({ type: 'positive', message: 'Exam scheduled successfully' })
    }

    showExamDialog.value = false
    fetchData()
  } catch {
    console.error('Failed to save exam')
    $q.notify({ type: 'negative', message: 'Failed to save exam' })
  } finally {
    saving.value = false
  }
}

function confirmDelete(exam) {
  selectedExam.value = exam
  showDeleteDialog.value = true
}

async function deleteExam() {
  saving.value = true
  try {
    await examService.delete(selectedExam.value.id)
    $q.notify({ type: 'positive', message: 'Exam deleted successfully' })
    showDeleteDialog.value = false
    fetchData()
  } catch {
    console.error('Failed to delete exam')
    $q.notify({ type: 'negative', message: 'Failed to delete exam' })
  } finally {
    saving.value = false
  }
}

function viewExam(exam) {
  editExam(exam)
}

function formatDateShort(val) {
  return date.formatDate(val, 'MMM D, YYYY')
}

function formatTime(val) {
  if (!val) return ''
  // Handle HH:mm:ss to HH:mm
  const parts = val.split(':')
  return `${parts[0]}:${parts[1]}`
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.rounded-xl { border-radius: 16px; }
.rounded-lg { border-radius: 12px; }
.bg-slate-50 { background-color: #F8FAFC; }
.text-slate-800 { color: #1E293B; }
.text-slate-500 { color: #64748B; }
.text-slate-600 { color: #475569; }

/* Calendar Styles */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.calendar-weekday {
  background: #f1f5f9;
  padding: 10px;
  text-align: center;
  font-weight: bold;
  font-size: 11px;
  text-transform: uppercase;
  color: #64748B;
  border-bottom: 1px solid #e2e8f0;
}

.calendar-day {
  height: 100px;
  padding: 5px;
  border-right: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  background: white;
  display: flex;
  flex-direction: column;
}

.calendar-day:nth-child(7n) {
  border-right: none;
}

.calendar-day.other-month {
  background: #f8fafc;
  color: #cbd5e1;
}

.calendar-day.today {
  background: #eff6ff;
}

.calendar-day.today .day-number {
  background: #2563eb;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.day-number {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
}

.day-events {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.exam-tag {
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.exam-tag:hover {
  filter: brightness(0.95);
}

.bg-blue-50 { background-color: #EFF6FF; }
</style>
