<template>
  <q-page class="q-pa-lg">
    <!-- Header -->
    <div class="row items-center q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold text-dark q-mb-xs font-outfit">Attendance Marking</h1>
        <p class="text-grey-7 q-mb-none text-subtitle1">Track student participation for your classes.</p>
      </div>
      <q-space />
      <div class="row q-gutter-sm">
          <q-btn flat color="grey-8" label="View Reports" icon="bar_chart" no-caps />
      </div>
    </div>

    <!-- Controls -->
    <q-card class="shadow-1 rounded-borders-lg q-mb-lg border-grey-1">
        <q-card-section class="row q-col-gutter-md items-center">
            <div class="col-12 col-md-4">
                <div class="text-caption text-weight-bold text-grey-7 q-mb-xs">SELECT CLASS</div>
                <q-select 
                    outlined 
                    v-model="selectedClass" 
                    :options="classOptions" 
                    label="Choose Class" 
                    dense 
                    emit-value
                    map-options
                    class="font-weight-medium"
                    popup-content-class="text-black"
                />
            </div>
            <div class="col-12 col-md-4">
                <div class="text-caption text-weight-bold text-grey-7 q-mb-xs">SELECT DATE</div>
                <q-input outlined v-model="selectedDate" type="date" dense />
            </div>
            <div class="col-12 col-md-4 text-right">
                <q-btn unelevated color="black" label="Load Students" icon="group" class="full-width" @click="fetchAttendanceList" :loading="loading" no-caps />
            </div>
        </q-card-section>
    </q-card>

    <!-- Student Grid -->
    <div v-if="students.length > 0">
        <div class="row items-center justify-between q-mb-md">
            <div class="text-h6 font-outfit">
                Students ({{ students.length }})
                <q-badge color="grey-2" text-color="black" class="q-ml-sm">{{ presentCount }} Present</q-badge>
            </div>
            
            <div class="row q-gutter-sm">
                <q-btn outline color="green-7" label="Mark All Present" size="sm" icon="check_circle" @click="markAll('Present')" no-caps />
                <q-btn unelevated color="primary" label="Save Attendance" icon="save" @click="saveAttendance" :loading="saving" no-caps />
            </div>
        </div>

        <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6 col-md-4 col-lg-3" v-for="student in students" :key="student.id">
                <q-card 
                    class="cursor-pointer transition-all border-left-indicator shadow-1 hover-lift"
                    :class="{'bg-green-1 border-green': student.status === 'Present', 'bg-red-1 border-red': student.status === 'Absent'}"
                    @click="toggleStatus(student)"
                >
                    <q-card-section class="row items-center">
                        <q-avatar size="42px" :color="student.status === 'Present' ? 'green-2' : 'red-2'" :text-color="student.status === 'Present' ? 'green-9' : 'red-9'" class="text-weight-bold q-mr-md">
                            {{ student.first_name ? student.first_name.charAt(0) : '?' }}
                        </q-avatar>
                        <div class="col">
                            <div class="text-weight-bold text-dark">{{ student.first_name }} {{ student.last_name }}</div>
                            <div class="text-caption text-grey-7">{{ student.whatsapp_number }}</div>
                        </div>
                        <div class="col-auto">
                            <q-icon 
                                :name="student.status === 'Present' ? 'check_circle' : 'cancel'" 
                                :color="student.status === 'Present' ? 'green' : 'red'" 
                                size="24px" 
                            />
                        </div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="searched && !loading" class="text-center q-pa-xl text-grey-6">
        <q-icon name="school" size="64px" class="q-mb-md" />
        <div class="text-h6">No students found</div>
        <p>Please select a valid class to see the student list.</p>
    </div>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { supabase } from 'boot/supabase'
import { date } from 'quasar'

const $q = useQuasar()
const loading = ref(false)
const saving = ref(false)
const searched = ref(false)

const selectedClass = ref(null)
const selectedDate = ref(date.formatDate(Date.now(), 'YYYY-MM-DD'))
const classOptions = ref([])
const students = ref([])

// Computed Stats
const presentCount = computed(() => students.value.filter(s => s.status === 'Present').length)

async function fetchClasses() {
    const { data } = await supabase.from('classes').select('id, subject, grade')
    if (data) {
        classOptions.value = data.map(c => ({
            label: `${c.subject} - ${c.grade}`,
            value: c.id
        }))
    }
}

async function fetchAttendanceList() {
    if (!selectedClass.value) {
        $q.notify({ type: 'warning', message: 'Please select a class first' })
        return
    }

    loading.value = true
    searched.value = true
    students.value = []

    try {
        // 1. Fetch all students (In future: filter by class enrollment)
        // For now, assuming all students can attend any class
        const { data: allStudents, error: studentError } = await supabase
            .from('students')
            .select('id, first_name, last_name, whatsapp_number')
            .eq('is_active', true)
            .order('first_name')
        
        if (studentError) throw studentError

        // 2. Fetch existing attendance for this date
        const { data: logs, error: logError } = await supabase
            .from('attendance_logs')
            .select('student_id, status')
            .eq('class_id', selectedClass.value)
            .eq('date', selectedDate.value)
        
        if (logError) throw logError

        // 3. Merge data
        // If log exists, use that status. Else default to 'Absent' (Safer default for marking) or 'Present'
        // Let's default to 'Absent' so user has to explicitly mark them Present? 
        // Or default 'Present' if it's easier. Let's do 'Absent' initially for clarity.
        const logMap = new Map()
        logs.forEach(l => logMap.set(l.student_id, l.status))

        students.value = allStudents.map(s => ({
            ...s,
            status: logMap.get(s.id) || 'Absent' // Default Absent until marked
        }))

    } catch (e) {
        console.error(e)
        $q.notify({ type: 'negative', message: 'Failed to load list' })
    } finally {
        loading.value = false
    }
}

function toggleStatus(student) {
    student.status = student.status === 'Present' ? 'Absent' : 'Present'
}

function markAll(status) {
    students.value.forEach(s => s.status = status)
}

async function saveAttendance() {
    saving.value = true
    try {
        const upsertData = students.value.map(s => ({
            student_id: s.id,
            class_id: selectedClass.value,
            date: selectedDate.value,
            status: s.status,
            marked_by: null // Auth uid will be handled by DB default if using Supabase Auth, else null
        }))

        // We use upsert to handle updates
        const { error } = await supabase
            .from('attendance_logs')
            .upsert(upsertData, { onConflict: 'student_id, class_id, date' })

        if (error) throw error
        
        $q.notify({ type: 'positive', message: 'Attendance saved successfully!' })
    } catch (e) {
        console.error(e)
        $q.notify({ type: 'negative', message: 'Failed to save attendance' })
    } finally {
        saving.value = false
    }
}

onMounted(() => {
    fetchClasses()
})
</script>

<style scoped>
.font-outfit {
  font-family: 'Outfit', sans-serif;
}
.shadow-1 {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.rounded-borders-lg {
    border-radius: 12px;
}
.border-grey-1 {
    border: 1px solid #f0f0f0;
}
.border-left-indicator {
    border-left: 4px solid transparent;
}
.border-green {
    border-left-color: #4caf50;
    border-color: #e8f5e9;
}
.border-red {
    border-left-color: #ef5350;
    border-color: #ffebee;
}

.hover-lift {
    transition: transform 0.2s, box-shadow 0.2s;
}
.hover-lift:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}
.transition-all {
    transition: all 0.3s ease;
}
</style>
