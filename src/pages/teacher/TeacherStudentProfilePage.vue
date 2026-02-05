<template>
  <q-page class="q-pa-lg bg-slate-50">
    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <q-btn flat round icon="arrow_back" color="slate-600" @click="$router.back()" class="q-mr-md" />
      <div class="col">
        <div v-if="student" class="text-h4 text-weight-bold text-slate-800 font-outfit">
          {{ student.full_name }}
        </div>
        <div class="text-subtitle1 text-slate-500">Student Performance Profile</div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner color="blue-600" size="3em" />
      <div class="text-slate-500 q-mt-md">Loading student data...</div>
    </div>

    <!-- Content -->
    <div v-else-if="student">
      <!-- Info Cards -->
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12 col-md-3">
          <q-card class="shadow-sm rounded-xl">
            <q-card-section class="text-center q-pa-lg">
              <q-avatar size="80px" color="blue-100" text-color="blue-600" icon="person" class="q-mb-md" />
              <div class="text-h6 text-weight-bold">{{ student.full_name }}</div>
              <div class="text-caption text-slate-500">{{ student.phone || 'No phone' }}</div>
              <q-separator class="q-my-md" />
              <div class="text-caption text-uppercase text-slate-400">Grade</div>
              <div class="text-h5 text-weight-bold text-blue-600">{{ student.grade || 'N/A' }}</div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-9">
          <div class="row q-col-gutter-md full-height">
            <div class="col-6 col-md-4">
              <q-card class="shadow-sm rounded-xl full-height">
                <q-card-section class="q-pa-md">
                  <div class="text-caption text-slate-500">Classes Enrolled</div>
                  <div class="text-h4 text-weight-bold text-blue-600">{{ enrolledClasses.length }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-6 col-md-4">
              <q-card class="shadow-sm rounded-xl full-height">
                <q-card-section class="q-pa-md">
                  <div class="text-caption text-slate-500">Avg Attendance</div>
                  <div class="text-h4 text-weight-bold text-green-600">{{ avgAttendance }}%</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 col-md-4">
              <q-card class="shadow-sm rounded-xl full-height">
                <q-card-section class="q-pa-md">
                  <div class="text-caption text-slate-500">Avg Score</div>
                  <div class="text-h4 text-weight-bold text-purple-600">{{ avgScore }}%</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
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
          <q-tab name="classes" label="Enrolled Classes" icon="school" no-caps />
          <q-tab name="assignments" label="Assignments" icon="assignment" no-caps />
          <q-tab name="attendance" label="Attendance" icon="event_available" no-caps />
          <q-tab name="remarks" label="Teacher Remarks" icon="note" no-caps />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="activeTab" animated>
          <!-- Classes Tab -->
          <q-tab-panel name="classes" class="q-pa-none">
            <q-list v-if="enrolledClasses.length > 0" separator>
              <q-item v-for="enrollment in enrolledClasses" :key="enrollment.id">
                <q-item-section avatar>
                  <q-avatar color="blue-50" text-color="blue-600" icon="class" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">
                    {{ enrollment.classes?.subject?.name || 'Subject' }}
                  </q-item-label>
                  <q-item-label caption>
                    Grade {{ enrollment.classes?.grade }} • 
                    {{ enrollment.classes?.day_of_week }} 
                    {{ formatTime(enrollment.classes?.start_time) }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-chip size="sm" color="blue-1" text-color="blue-8">
                    Enrolled {{ formatDate(enrollment.enrolled_at) }}
                  </q-chip>
                </q-item-section>
              </q-item>
            </q-list>
            <div v-else class="text-center q-pa-xl text-grey-5">
              <q-icon name="school_off" size="64px" />
              <div class="q-mt-md">Not enrolled in any classes</div>
            </div>
          </q-tab-panel>

          <!-- Assignments Tab -->
          <q-tab-panel name="assignments" class="q-pa-none">
            <q-list v-if="submissions.length > 0" separator>
              <q-item v-for="sub in submissions" :key="sub.id">
                <q-item-section>
                  <q-item-label class="text-weight-medium">{{ sub.assignments?.title }}</q-item-label>
                  <q-item-label caption>
                    {{ sub.assignments?.classes?.subject?.name }} • 
                    Due: {{ formatDateDisplay(sub.assignments?.due_date) }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-chip 
                    size="sm" 
                    :color="getStatusColor(sub.status)" 
                    :text-color="getStatusTextColor(sub.status)"
                  >
                    {{ sub.status.toUpperCase() }}
                  </q-chip>
                  <div v-if="sub.score !== null" class="text-weight-bold text-blue-8 q-mt-xs">
                    {{ sub.score }} / {{ sub.assignments?.max_score }}
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
            <div v-else class="text-center q-pa-xl text-grey-5">
              <q-icon name="assignment" size="64px" />
              <div class="q-mt-md">No submissions yet</div>
            </div>
          </q-tab-panel>

          <!-- Attendance Tab -->
          <q-tab-panel name="attendance" class="q-pa-lg">
            <div class="text-center q-pa-xl text-grey-5">
              <q-icon name="event_available" size="64px" />
              <div class="text-h6 q-mt-md">Attendance History</div>
              <div class="text-caption">Coming soon: Calendar view with attendance records</div>
            </div>
          </q-tab-panel>

          <!-- Remarks Tab -->
          <q-tab-panel name="remarks" class="q-pa-md">
            <div class="q-mb-md row items-center justify-between">
              <div class="text-subtitle1 text-weight-bold">Add Teacher Remark</div>
              <q-btn unelevated color="blue-600" label="Add Remark" icon="add" no-caps @click="showRemarkDialog = true" />
            </div>

            <q-list v-if="remarks.length > 0" separator>
              <q-item v-for="remark in remarks" :key="remark.id" class="q-pa-md">
                <q-item-section>
                  <q-item-label class="text-grey-8">{{ remark.remark }}</q-item-label>
                  <q-item-label caption class="q-mt-xs">
                    <q-icon name="schedule" size="xs" /> {{ formatDateDisplay(remark.created_at) }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side v-if="remark.tag">
                  <q-chip size="sm" :color="getTagColor(remark.tag)" :text-color="getTagTextColor(remark.tag)">
                    {{ remark.tag.replace('_', ' ') }}
                  </q-chip>
                </q-item-section>
              </q-item>
            </q-list>
            <div v-else class="text-center q-pa-xl text-grey-5">
              <q-icon name="note" size="64px" />
              <div class="q-mt-md">No remarks yet</div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>

    <!-- Add Remark Dialog -->
    <q-dialog v-model="showRemarkDialog">
      <q-card style="min-width: 400px" class="rounded-xl">
        <q-card-section class="bg-blue-600 text-white">
          <div class="text-h6">Add Teacher Remark</div>
        </q-card-section>

        <q-card-section class="q-gutter-y-md">
          <q-input outlined v-model="remarkForm.remark" label="Remark *" type="textarea" rows="3" autofocus />
          
          <q-select
            outlined
            v-model="remarkForm.tag"
            :options="tagOptions"
            label="Tag (Optional)"
            clearable
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" color="grey" v-close-popup no-caps />
          <q-btn unelevated label="Save" color="blue-600" @click="saveRemark" :loading="savingRemark" no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from 'boot/supabase'
import { useAuthStore } from 'src/stores/auth'
import { useQuasar, date } from 'quasar'

const route = useRoute()
const $q = useQuasar()
const authStore = useAuthStore()

const studentId = route.params.id
const student = ref(null)
const enrolledClasses = ref([])
const submissions = ref([])
const remarks = ref([])
const loading = ref(true)
const activeTab = ref('classes')
const showRemarkDialog = ref(false)
const savingRemark = ref(false)

const tagOptions = ['Needs Attention', 'Top Performer', 'Improving', 'Absent Frequently']

const remarkForm = ref({
  remark: '',
  tag: null
})

const avgAttendance = computed(() => {
  // Placeholder - would calculate from attendance records
  return 85
})

const avgScore = computed(() => {
  const graded = submissions.value.filter(s => s.score !== null)
  if (graded.length === 0) return 0
  
  const total = graded.reduce((sum, s) => sum + ((s.score / s.assignments?.max_score) * 100 || 0), 0)
  return Math.round(total / graded.length)
})

async function fetchStudentData() {
  loading.value = true
  try {
    // Fetch student profile
    const { data: studentData, error: studentError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', studentId)
      .single()
    
    if (studentError) throw studentError
    student.value = studentData

    // Fetch enrollments
    const { data: enrollData, error: enrollError } = await supabase
      .from('enrollments')
      .select(`
        *,
        classes (
          id,
          grade,
          day_of_week,
          start_time,
          end_time,
          subject: subjects(name)
        )
      `)
      .eq('student_id', studentId)
    
    if (enrollError) throw enrollError
    enrolledClasses.value = enrollData || []

    // Fetch submissions
    const { data: subData, error: subError } = await supabase
      .from('submissions')
      .select(`
        *,
        assignments (
          id,
          title,
          due_date,
          max_score,
          classes (
            subject: subjects(name)
          )
        )
      `)
      .eq('student_id', studentId)
      .order('submitted_at', { ascending: false })
    
    if (subError) throw subError
    submissions.value = subData || []

    // Fetch teacher remarks
    const { data: remarkData, error: remarkError } = await supabase
      .from('teacher_remarks')
      .select('*')
      .eq('student_id', studentId)
      .eq('teacher_id', authStore.profile.id)
      .order('created_at', { ascending: false })
    
    if (remarkError && remarkError.code !== 'PGRST116') {
      console.error('Remarks error:', remarkError)
    } else {
      remarks.value = remarkData || []
    }

  } catch (e) {
    console.error('Error loading student data:', e)
    $q.notify({ type: 'negative', message: 'Failed to load student data' })
  } finally {
    loading.value = false
  }
}

async function saveRemark() {
  if (!remarkForm.value.remark) {
    $q.notify({ type: 'warning', message: 'Please enter a remark' })
    return
  }

  savingRemark.value = true
  try {
    const { error } = await supabase
      .from('teacher_remarks')
      .insert({
        teacher_id: authStore.profile.id,
        student_id: studentId,
        remark: remarkForm.value.remark,
        tag: remarkForm.value.tag
      })
    
    if (error) throw error
    
    $q.notify({ type: 'positive', message: 'Remark added' })
    showRemarkDialog.value = false
    remarkForm.value = { remark: '', tag: null }
    fetchStudentData()
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: 'Failed to save remark' })
  } finally {
    savingRemark.value = false
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
  return date.formatDate(val, 'MMM D, YYYY')
}

function formatDateDisplay(val) {
  return date.formatDate(val, 'MMM D, YYYY h:mm A')
}

function getStatusColor(status) {
  switch(status) {
    case 'submitted': return 'blue-1'
    case 'graded': return 'green-1'
    case 'late': return 'orange-1'
    default: return 'grey-1'
  }
}

function getStatusTextColor(status) {
  switch(status) {
    case 'submitted': return 'blue-9'
    case 'graded': return 'green-9'
    case 'late': return 'orange-9'
    default: return 'grey-8'
  }
}

function getTagColor(tag) {
  switch(tag) {
    case 'Needs Attention': return 'red-1'
    case 'Top Performer': return 'green-1'
    case 'Improving': return 'blue-1'
    case 'Absent Frequently': return 'orange-1'
    default: return 'grey-1'
  }
}

function getTagTextColor(tag) {
  switch(tag) {
    case 'Needs Attention': return 'red-9'
    case 'Top Performer': return 'green-9'
    case 'Improving': return 'blue-9'
    case 'Absent Frequently': return 'orange-9'
    default: return 'grey-8'
  }
}

onMounted(() => {
  fetchStudentData()
})
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.rounded-xl { border-radius: 16px; }
.bg-slate-50 { background-color: #F8FAFC; }
.text-slate-800 { color: #1E293B; }
.text-slate-500 { color: #64748B; }
.text-slate-400 { color: #94A3B8; }
.full-height { height: 100%; }
</style>
