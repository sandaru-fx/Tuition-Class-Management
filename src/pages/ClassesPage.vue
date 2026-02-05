<template>
  <q-page class="q-pa-lg">
    <!-- Header -->
    <div class="row items-center q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold text-dark q-mb-xs font-outfit">Class Schedule</h1>
        <p class="text-grey-7 q-mb-none text-subtitle1">Manage weekly class schedules, teachers, and halls.</p>
      </div>
      <q-space />
      <q-btn unelevated color="black" text-color="white" label="Add New Class" icon="add" no-caps @click="openAddDialog" />
    </div>

    <!-- Tabs -->
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="left"
      narrow-indicator
    >
      <q-tab name="list" label="List View" icon="list" no-caps />
      <q-tab name="schedule" label="Weekly Schedule" icon="calendar_view_week" no-caps />
    </q-tabs>

    <q-separator class="q-mb-md" />

    <q-tab-panels v-model="tab" animated class="bg-transparent">
      <!-- List View -->
      <q-tab-panel name="list" class="q-pa-none">
        <q-card class="my-card shadow-1 rounded-borders-lg overflow-hidden">
          <q-card-section class="q-pa-md bg-grey-1 row items-center">
            <q-input dense outlined bg-color="white" v-model="search" placeholder="Search classes..." class="col-12 col-sm-4" debounce="300">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </q-card-section>

          <q-markup-table flat class="text-left">
            <thead>
              <tr class="bg-grey-1">
                <th class="text-left text-grey-7 text-weight-bold q-pl-lg">Subject</th>
                <th class="text-left text-grey-7 text-weight-bold">Grade</th>
                <th class="text-left text-grey-7 text-weight-bold">Teacher</th>
                <th class="text-left text-grey-7 text-weight-bold">Schedule</th>
                <th class="text-left text-grey-7 text-weight-bold">Hall</th>
                <th class="text-right text-grey-7 text-weight-bold q-pr-lg">Actions</th>
              </tr>
            </thead>
            <tbody v-if="loading">
                 <tr>
                    <td colspan="6" class="text-center q-pa-lg">
                        <q-spinner color="primary" size="3em" />
                    </td>
                 </tr>
            </tbody>
            <tbody v-else>
              <tr v-if="filteredClasses.length === 0">
                <td colspan="6" class="text-center q-pa-xl text-grey-6">
                  <q-icon name="class" size="48px" class="q-mb-md" />
                  <div>No classes found.</div>
                </td>
              </tr>
              <tr v-for="cls in filteredClasses" :key="cls.id" class="hover-bg-grey-1 transition-all">
                <td class="q-pl-lg text-weight-bold">{{ cls.subject?.name || 'Unknown' }}</td>
                <td>
                  <q-badge color="blue-1" text-color="blue-9" class="q-px-sm text-weight-bold">
                    {{ cls.grade }}
                  </q-badge>
                </td>
                <td class="text-grey-9">{{ cls.teacher_name }}</td>
                <td>
                    <div class="row items-center">
                        <q-icon name="event" size="xs" class="q-mr-xs text-grey-6" />
                        <span class="text-weight-medium">{{ cls.day_of_week }}</span>
                        <span class="q-mx-sm text-grey-4">|</span>
                        <span class="text-caption text-grey-8">{{ formatTime(cls.start_time) }} - {{ formatTime(cls.end_time) }}</span>
                    </div>
                </td>
                <td>
                  <q-chip size="sm" icon="meeting_room" color="grey-2" text-color="grey-9">
                    {{ cls.hall }}
                  </q-chip>
                </td>
                <td class="text-right q-pr-lg">
                  <q-btn flat round dense color="grey-7" icon="edit" class="q-mr-xs" @click="openEditDialog(cls)" />
                  <q-btn flat round dense color="red-4" icon="delete" @click="confirmDelete(cls)" />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card>
      </q-tab-panel>

      <!-- Schedule View -->
      <q-tab-panel name="schedule" class="q-pa-none">
          <!-- Grade Context Awareness -->
          <div v-if="selectedGrade !== 'all'" class="q-mb-md bg-blue-50 text-blue-9 q-pa-sm rounded-borders text-center text-weight-bold">
              Showing Schedule for Grade {{ selectedGrade }}
          </div>

          <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4 col-lg-3" v-for="day in daysOfWeek" :key="day">
                  <q-card class="bg-grey-1 shadow-0 rounded-borders-lg" style="min-height: 200px">
                      <q-card-section class="q-py-sm bg-white text-weight-bold border-bottom text-center">
                          {{ day }}
                      </q-card-section>
                      <q-card-section class="q-pa-sm q-gutter-y-sm">
                          <div v-for="cls in getClassesForDay(day)" :key="cls.id">
                              <q-card 
                                class="my-card shadow-1 cursor-pointer hover-lift" 
                                @click="openEditDialog(cls)"
                                :class="getGradeColorClass(cls.grade)"
                              >
                                  <q-card-section class="q-pa-sm">
                                      <div class="text-subtitle2 text-weight-bold">{{ cls.subject?.name || 'Unknown' }}</div>
                                      <div class="text-caption text-grey-8">{{ cls.grade }} • {{ cls.teacher_name }}</div>
                                      <div class="row items-center q-mt-xs">
                                          <q-icon name="schedule" size="12px" class="q-mr-xs"/>
                                          <span class="text-caption text-weight-medium">
                                              {{ formatTime(cls.start_time) }} - {{ formatTime(cls.end_time) }}
                                          </span>
                                      </div>
                                      <div class="text-caption text-grey-6 q-mt-xs text-right">
                                          <q-icon name="place" size="10px"/> {{ cls.hall }}
                                      </div>
                                  </q-card-section>
                              </q-card>
                          </div>
                           <div v-if="getClassesForDay(day).length === 0" class="text-center text-grey-5 q-mt-md text-caption">
                               No classes
                          </div>
                      </q-card-section>
                  </q-card>
              </div>
          </div>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Class Dialog -->
    <q-dialog v-model="showDialog">
      <q-card style="min-width: 500px" class="q-pa-md rounded-borders-lg">
        <q-card-section>
          <div class="text-h6 font-outfit">{{ isEditing ? 'Edit Class' : 'Schedule New Class' }}</div>
        </q-card-section>

        <q-form @submit="saveClass" class="q-gutter-md">
            <div class="row q-col-gutter-sm">
                <div class="col-6">
                    <q-select 
                        outlined 
                        v-model="form.grade" 
                        :options="gradeOptions" 
                        label="Grade *" 
                        dense 
                        @update:model-value="suggestTimeSlot"
                        :rules="[val => !!val || 'Required']" 
                    />
                </div>
                <div class="col-6">
                     <q-select 
                        outlined 
                        v-model="form.subject_id" 
                        :options="filteredSubjectOptions"
                        label="Subject *" 
                        dense 
                        map-options
                        emit-value
                        :disable="!form.grade"
                        :hint="!form.grade ? 'Select grade first' : ''"
                        :rules="[val => !!val || 'Required']" 
                    />
                </div>
            </div>

            <q-select 
                outlined 
                v-model="form.teacher_id" 
                :options="filteredTeachers"
                option-label="full_name"
                option-value="id"
                emit-value
                map-options
                label="Teacher *" 
                dense 
                @update:model-value="(val) => { 
                    const t = teachers.find(x => x.id === val);
                    if(t) form.teacher_name = t.full_name;
                }"
                :rules="[val => !!val || 'Required']" 
                :hint="filteredTeachers.length < teachers.length ? 'Showing only qualified teachers for Grade ' + form.grade : ''"
            >
                <template v-slot:no-option>
                    <q-item>
                        <q-item-section class="text-grey">
                            No qualified teachers found for Grade {{ form.grade }}
                        </q-item-section>
                    </q-item>
                </template>
            </q-select>

             <div class="row q-col-gutter-sm">
                <div class="col-4">
                     <q-select outlined v-model="form.day_of_week" :options="daysOfWeek" label="Day *" dense :rules="[val => !!val || 'Required']" />
                </div>
                 <div class="col-4">
                     <q-input outlined v-model="form.start_time" label="Start Time *" dense type="time" :rules="[val => !!val || 'Required']" />
                 </div>
                  <div class="col-4">
                     <q-input outlined v-model="form.end_time" label="End Time *" dense type="time" :rules="[val => !!val || 'Required']" />
                 </div>
            </div>

             <div class="row q-col-gutter-sm">
                  <div class="col-6">
                    <q-select 
                        outlined 
                        v-model="form.hall_id" 
                        :options="halls" 
                        option-label="name"
                        option-value="id"
                        emit-value
                        map-options
                        label="Hall *" 
                        dense 
                        @update:model-value="(val) => { 
                            const h = halls.find(x => x.id === val);
                            if(h) form.hall = h.name;
                        }"
                        :rules="[val => !!val || 'Required']"
                    />
                  </div>
                 <div class="col-6">
                    <q-input outlined v-model="form.monthly_fee" label="Monthly Fee" prefix="Rs." dense type="number" />
                 </div>
             </div>

            <div class="row justify-end q-mt-lg">
                 <q-btn flat label="Cancel" color="grey-7" v-close-popup no-caps class="q-mr-sm" />
                 <q-btn unelevated :label="isEditing ? 'Update' : 'Create'" color="black" type="submit" :loading="submitting" no-caps />
            </div>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showDeleteDialog">
      <q-card style="min-width: 350px" class="q-pa-sm rounded-borders-lg">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="red-1" text-color="red" size="md" />
          <span class="q-ml-md text-h6 font-outfit">Confirm Delete</span>
        </q-card-section>
        <q-card-section class="q-pt-none text-grey-8">
          Delete <strong>{{ classToDelete?.subject?.name }}</strong> ({{ classToDelete?.grade }})?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey-7" v-close-popup no-caps />
          <q-btn unelevated label="Delete" color="red" @click="deleteClass" :loading="deleting" no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { supabase } from 'boot/supabase'
import { useAppStore } from 'src/stores/app'
import { storeToRefs } from 'pinia'
import { subjectService } from 'src/services/subjectService'
import { feeService } from 'src/services/feeService'
import { teacherService } from 'src/services/teacherService'
import { hallService } from 'src/services/hallService'

const $q = useQuasar()
const appStore = useAppStore()
const { selectedGrade } = storeToRefs(appStore)

const tab = ref('list')
const search = ref('')
const classes = ref([])
const loading = ref(false)
const submitting = ref(false)
const deleting = ref(false)
const subjects = ref([])
const teachers = ref([])
const halls = ref([])

const showDialog = ref(false)
const showDeleteDialog = ref(false)
const isEditing = ref(false)
const classToDelete = ref(null)

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
// Grade Options (Could be moved to a centralized constant)
const gradeOptions = [
  '1', '2', '3', '4', '5', 
  '6', '7', '8', '9', 
  '10', '11', '12', '13'
]

const form = ref({
  id: null,
  subject_id: null,
  grade: '',
  teacher_id: null,
  teacher_name: '', // still used for display/search convenience
  day_of_week: 'Monday',
  start_time: '',
  end_time: '',
  hall_id: null,
  hall: '', // still used for display
  monthly_fee: ''
})

const filteredClasses = computed(() => {
  let result = classes.value

  // 1. Grade Filter (from Sidebar/Store)
  if (selectedGrade.value && selectedGrade.value !== 'all') {
    if (selectedGrade.value === 'primary') {
      result = result.filter(c => ['1','2','3','4','5'].includes(c.grade))
    } else if (selectedGrade.value === 'ol') {
      result = result.filter(c => ['10','11'].includes(c.grade))
    } else if (selectedGrade.value === 'al') {
      result = result.filter(c => ['12','13'].includes(c.grade))
    } else {
      result = result.filter(c => c.grade === selectedGrade.value)
    }
  }

  // 2. Search Filter
  const query = search.value.toLowerCase()
  if (query) {
    result = result.filter(c => 
        (c.subject?.name || '').toLowerCase().includes(query) || 
        c.teacher_name.toLowerCase().includes(query) ||
        c.grade.toLowerCase().includes(query)
    )
  }
  
  return result
})

// Filter Subjects based on selected grade in form
const filteredSubjectOptions = computed(() => {
    if (!form.value.grade) return []
    // Simple mapping logic: 
    // If Grade 1-5, show Primary subjects
    // If Grade 6-9, show Junior subjects
    // Real implementation would use the 'category' from subjectService
    return subjects.value.map(s => ({ label: s.name, value: s.id }))
})

// Filter Teachers based on qualified grades for the selected class grade
const filteredTeachers = computed(() => {
    if (!form.value.grade) return teachers.value
    
    // Return teachers who have the selected grade in their qualified_grades array
    // OR teachers who have NO qualified_grades set (assuming they are generalists or data is missing)
    return teachers.value.filter(t => {
        if (!t.qualified_grades || t.qualified_grades.length === 0) return true
        return t.qualified_grades.includes(form.value.grade)
    })
})

function getClassesForDay(day) {
    return filteredClasses.value
        .filter(c => c.day_of_week === day)
        .sort((a, b) => a.start_time.localeCompare(b.start_time))
}

function getGradeColorClass(grade) {
    const g = Number(grade)
    if (g <= 5) return 'grade-primary'
    if (g <= 9) return 'grade-junior'
    if (g <= 11) return 'grade-ol'
    return 'grade-al'
}

function formatTime(timeStr) {
    if (!timeStr) return ''
    const [hours, minutes] = timeStr.split(':')
    const date = new Date()
    date.setHours(hours, minutes)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

// Auto-Suggest Time Logic
function suggestTimeSlot(grade) {
    // Only suggest if time is empty
    if (form.value.start_time) return

    const g = Number(grade)
    if (g <= 5) {
        // Primary: After School (2 PM)
        form.value.start_time = '14:00'
        form.value.end_time = '15:30'
    } else if (g <= 9) {
        // Junior: Evening (4 PM)
        form.value.start_time = '16:00'
        form.value.end_time = '17:30'
    } else {
        // Senior: Late Evening or Weekend Morning defaults
        form.value.start_time = '08:00'
        form.value.end_time = '10:00'
    }

    // Auto-Suggest Fee
    suggestFee(grade)
}

async function suggestFee(grade) {
    if (form.value.monthly_fee) return // Don't overwrite if already set
    try {
        const amount = await feeService.getFeeForGrade(grade)
        if (amount > 0) form.value.monthly_fee = amount
    } catch (e) { console.error(e) }
}

async function fetchClasses() {
  loading.value = true
  try {
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('*, subject:subjects(name), teacher:teachers(full_name), hall_ref:halls(name)') 
      .order('created_at', { ascending: false })
    
    if (classError) throw classError
    classes.value = classData

    // Fetch Subjects for dropdown
    const { data: subData } = await subjectService.getAll()
    subjects.value = subData || []

    // Fetch Teachers with their qualified grades
    const tData = await teacherService.getAll()
    teachers.value = tData || []

    const hData = await hallService.getAll()
    halls.value = hData || []

  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Failed to load data' })
  } finally {
    loading.value = false
  }
}

function openAddDialog() {
  isEditing.value = false
  form.value = {
    id: null,
    subject_id: null,
    grade: '',
    teacher_id: null,
    teacher_name: '',
    day_of_week: 'Monday',
    start_time: '',
    end_time: '',
    hall_id: null,
    hall: '',
    monthly_fee: ''
  }
  showDialog.value = true
}

function openEditDialog(cls) {
  isEditing.value = true
  const startTime = cls.start_time && cls.start_time.length > 5 ? cls.start_time.substring(0, 5) : cls.start_time
  const endTime = cls.end_time && cls.end_time.length > 5 ? cls.end_time.substring(0, 5) : cls.end_time
  
  form.value = { 
      ...cls,
      start_time: startTime,
      end_time: endTime
  }
  showDialog.value = true
}

async function saveClass() {
  submitting.value = true
  try {
    const classData = { ...form.value }
    delete classData.id // remove ID for insert/update payload
    // delete classData.subject // remove joined object if present
    
    // Check Conflicts
    const conflict = classes.value.find(c => 
        c.id !== form.value.id && 
        c.day_of_week === classData.day_of_week &&
        (
            // Same Hall Check
            (c.hall_id === classData.hall_id && 
            ((classData.start_time >= c.start_time && classData.start_time < c.end_time) ||
             (classData.end_time > c.start_time && classData.end_time <= c.end_time))) ||
             
            // Same Teacher Check
            (c.teacher_id === classData.teacher_id && 
            ((classData.start_time >= c.start_time && classData.start_time < c.end_time) ||
             (classData.end_time > c.start_time && classData.end_time <= c.end_time)))
        )
    )

    if (conflict) {
        $q.notify({
            type: 'warning',
            message: `Conflict! ${conflict.teacher_name} or ${conflict.hall} is busy at this time (${conflict.subject?.name}).`,
            timeout: 5000,
            position: 'top'
        })
        return 
    }

    if (isEditing.value) {
      const { error } = await supabase
        .from('classes')
        .update({
            grade: classData.grade,
            subject_id: classData.subject_id,
            teacher_id: classData.teacher_id,
            teacher_name: classData.teacher_name,
            day_of_week: classData.day_of_week,
            start_time: classData.start_time,
            end_time: classData.end_time,
            hall_id: classData.hall_id,
            hall: classData.hall,
            monthly_fee: classData.monthly_fee
        })
        .eq('id', form.value.id)
      if (error) throw error
      $q.notify({ type: 'positive', message: 'Class updated successfully' })
    } else {
      const { error } = await supabase
        .from('classes')
        .insert([{
            grade: classData.grade,
            subject_id: classData.subject_id,
            teacher_id: classData.teacher_id,
            teacher_name: classData.teacher_name,
            day_of_week: classData.day_of_week,
            start_time: classData.start_time,
            end_time: classData.end_time,
            hall_id: classData.hall_id,
            hall: classData.hall,
            monthly_fee: classData.monthly_fee
        }])
      if (error) throw error
      $q.notify({ type: 'positive', message: 'Class scheduled successfully' })
    }
    
    await fetchClasses()
    showDialog.value = false
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Error saving class' })
  } finally {
    submitting.value = false
  }
}

function confirmDelete(cls) {
  classToDelete.value = cls
  showDeleteDialog.value = true
}

async function deleteClass() {
  if (!classToDelete.value) return
  deleting.value = true
  try {
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', classToDelete.value.id)
      
    if (error) throw error
    $q.notify({ type: 'positive', message: 'Class deleted' })
    await fetchClasses()
    showDeleteDialog.value = false
  } catch (error) {
     console.error(error)
    $q.notify({ type: 'negative', message: 'Error deleting class' })
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchClasses()
})
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.my-card { border-radius: 12px; border: 1px solid #f0f0f0; }
.rounded-borders-lg { border-radius: 16px; }
.hover-bg-grey-1:hover { background-color: #fafafa; }
.hover-lift { transition: transform 0.2s, box-shadow 0.2s; }
.hover-lift:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.border-bottom { border-bottom: 1px solid #f0f0f0; }

/* Grade Color Codes */
.grade-primary { border-left: 4px solid #4caf50; } /* Green */
.grade-junior { border-left: 4px solid #2196f3; } /* Blue */
.grade-ol { border-left: 4px solid #ff9800; } /* Orange */
.grade-al { border-left: 4px solid #e91e63; } /* Pink */
</style>
