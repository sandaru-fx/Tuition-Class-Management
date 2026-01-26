<template>
  <q-page class="q-pa-lg">
    <!-- Header -->
    <div class="row items-center q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold text-dark q-mb-xs font-outfit">Exams & Results</h1>
        <p class="text-grey-7 q-mb-none text-subtitle1">Manage exams, enter marks, and analyze performance.</p>
      </div>
      <q-space />
      <q-btn unelevated color="black" text-color="white" label="Create New Exam" icon="add" no-caps @click="openCreateDialog" />
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
      <q-tab name="list" label="Exams List" icon="list" no-caps />
      <q-tab name="analysis" label="Performance Analysis" icon="bar_chart" no-caps />
    </q-tabs>

    <q-separator class="q-mb-md" />

    <q-tab-panels v-model="tab" animated class="bg-transparent">
      <!-- List View -->
      <q-tab-panel name="list" class="q-pa-none">
        
        <!-- Search & Filter -->
         <div class="row q-mb-md">
            <q-input dense outlined bg-color="white" v-model="search" placeholder="Search exams..." class="col-12 col-sm-4">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
        </div>

        <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4" v-for="exam in filteredExams" :key="exam.id">
                <q-card class="my-card shadow-1 hover-lift">
                    <q-card-section>
                        <div class="row items-center justify-between">
                            <div class="text-h6 font-outfit">{{ exam.name }}</div>
                            <q-badge color="blue-1" text-color="blue-9" class="q-px-sm">{{ exam.start_date || exam.date }}</q-badge>
                        </div>
                        <div class="text-subtitle2 text-grey-7 q-mt-xs">{{ exam.classes?.subject }} - {{ exam.classes?.grade }}</div>
                        <div class="text-caption text-grey-6">Total Marks: {{ exam.total_marks }}</div>
                    </q-card-section>

                    <q-separator />

                    <q-card-actions align="right">
                         <q-btn flat color="primary" label="Enter Marks" icon="edit_note" no-caps @click="openMarksDialog(exam)" />
                         <q-btn flat color="grey-7" icon="delete" round dense @click="confirmDelete(exam)" />
                    </q-card-actions>
                </q-card>
            </div>
             <div v-if="filteredExams.length === 0" class="col-12 text-center text-grey-6 q-pa-xl">
                 <q-icon name="assignment" size="48px" class="q-mb-sm"/>
                 <div>No exams found. Create one to get started.</div>
            </div>
        </div>
      </q-tab-panel>

      <!-- Analysis View -->
      <q-tab-panel name="analysis" class="q-pa-none">
          <q-card class="q-pa-md my-card">
              <div class="text-h6 q-mb-md">Recent Exam Performance</div>
              <div class="row items-end q-gutter-x-md" style="height: 300px; padding-bottom: 20px; border-bottom: 2px solid #eee;">
                   <!-- Simple CSS Bar Chart for Demo -->
                   <div v-for="stat in exampleStats" :key="stat.label" class="column items-center" style="width: 60px;">
                       <div class="text-caption text-weight-bold q-mb-xs">{{ stat.value }}%</div>
                       <div class="bg-primary rounded-borders" :style="{ height: (stat.value * 2) + 'px', width: '40px', opacity: 0.8 }"></div>
                       <div class="text-caption text-grey-8 q-mt-sm text-center" style="font-size: 10px; line-height: 1.1;">{{ stat.label }}</div>
                   </div>
              </div>
          </q-card>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Create Exam Dialog -->
    <q-dialog v-model="showCreateDialog">
      <q-card style="min-width: 400px" class="q-pa-md rounded-borders-lg">
        <q-card-section>
          <div class="text-h6 font-outfit">Create New Exam</div>
        </q-card-section>

        <q-form @submit="saveExam" class="q-gutter-md">
            <q-input outlined v-model="form.name" label="Exam Name (e.g. Term 1)" dense :rules="[val => !!val || 'Required']" />
            
            <q-select 
                outlined 
                v-model="form.class_id" 
                :options="classesOptions" 
                label="Select Class" 
                dense 
                emit-value
                map-options
                :rules="[val => !!val || 'Required']"
            />
            
            <q-input outlined v-model="form.date" label="Date" type="date" dense :rules="[val => !!val || 'Required']" />
            <q-input outlined v-model="form.total_marks" label="Total Marks" type="number" dense />

            <div class="row justify-end q-mt-lg">
                 <q-btn flat label="Cancel" color="grey-7" v-close-popup no-caps class="q-mr-sm" />
                 <q-btn unelevated label="Create Exam" color="black" type="submit" :loading="submitting" no-caps />
            </div>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- Marks Entry Dialog -->
    <q-dialog v-model="showMarksDialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="bg-grey-1">
        <q-toolbar class="bg-white text-dark shadow-1">
          <q-btn flat round dense icon="close" v-close-popup />
          <q-toolbar-title class="text-subtitle1 text-weight-bold">
            Marks Entry: {{ selectedExam?.name }} 
            <span class="text-grey-6 text-caption q-ml-sm">({{ selectedExam?.classes?.subject }} - {{ selectedExam?.classes?.grade }})</span>
          </q-toolbar-title>
          <q-btn flat label="Save All" color="primary" @click="saveMarks" :loading="savingMarks" />
        </q-toolbar>

        <q-card-section class="q-pa-md">
            <!-- Instructions -->
             <div class="row q-mb-md justify-center">
                 <div class="col-12 col-md-8 bg-blue-1 text-blue-9 q-pa-sm rounded-borders text-caption text-center">
                     <q-icon name="info" size="xs" /> Enter marks for each student. Leave empty if absent.
                 </div>
             </div>
             
             <!-- Marks Table -->
             <div class="row justify-center">
                 <div class="col-12 col-md-8">
                     <q-card class="shadow-1">
                         <q-markup-table flat dense separator="cell">
                            <thead>
                                <tr class="bg-grey-2">
                                    <th class="text-left">Student Name</th>
                                    <th class="text-left">Phone</th>
                                    <th class="text-center" style="width: 150px;">Marks (Out of {{ selectedExam?.total_marks }})</th>
                                    <th class="text-left">Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="student in studentsList" :key="student.id">
                                    <td>{{ student.first_name }} {{ student.last_name }}</td>
                                    <td class="text-caption text-grey">{{ student.whatsapp_number }}</td>
                                    <td class="text-center bg-grey-1">
                                        <q-input 
                                            dense 
                                            borderless 
                                            v-model.number="marksMap[student.id].marks" 
                                            type="number" 
                                            input-class="text-center text-weight-bold text-primary"
                                            placeholder="-"
                                        />
                                    </td>
                                    <td>
                                        <q-input dense borderless v-model="marksMap[student.id].remarks" placeholder="Optional..." />
                                    </td>
                                </tr>
                            </tbody>
                         </q-markup-table>
                     </q-card>
                 </div>
             </div>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { examService } from 'src/services/examService'
import { classService } from 'src/services/classService'

import { useAppStore } from 'src/stores/app'

const $q = useQuasar()
const appStore = useAppStore()
const tab = ref('list')
const search = ref('')
const exams = ref([])
const studentsList = ref([]) // Students in the selected class/exam
const marksMap = ref({}) // Dictionary keyed by student_id to store marks/remarks

// Computed Options from Store
const classesOptions = computed(() => appStore.classes)

const submitting = ref(false)
const savingMarks = ref(false)

const showCreateDialog = ref(false)
const showMarksDialog = ref(false)
const selectedExam = ref(null)

const form = ref({
  name: '',
  class_id: null,
  date: '',
  total_marks: 100
})

const exampleStats = ref([
    { label: 'Maths Term 1', value: 75 },
    { label: 'Science Test', value: 62 },
    { label: 'English Oral', value: 88 },
    { label: 'History Quiz', value: 54 },
    { label: 'Maths Term 2', value: 81 }
])

const filteredExams = computed(() => {
  const query = search.value.toLowerCase()
  if (!query) return exams.value
  return exams.value.filter(e => e.name.toLowerCase().includes(query))
})

async function fetchExams() {
  try {
    exams.value = await examService.getAll()
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Failed to load exams' })
  }
}

function openCreateDialog() {
    form.value = { name: '', class_id: null, date: new Date().toISOString().split('T')[0], total_marks: 100 }
    showCreateDialog.value = true
}

async function saveExam() {
    submitting.value = true
    try {
        await examService.create(form.value)
        $q.notify({ type: 'positive', message: 'Exam created!' })
        fetchExams()
        showCreateDialog.value = false
    } catch (e) {
        console.error(e)
        $q.notify({ type: 'negative', message: 'Error creating exam' })
    } finally {
        submitting.value = false
    }
}

async function openMarksDialog(exam) {
    selectedExam.value = exam
    showMarksDialog.value = true
    studentsList.value = []
    
    try {
        const { students, results } = await examService.getStudentMarks(exam.id)
        studentsList.value = students
        
        // 3. Initialize marks map
        marksMap.value = {}
        studentsList.value.forEach(s => {
            const existing = results?.find(r => r.student_id === s.id)
            marksMap.value[s.id] = {
                marks: existing ? existing.marks_obtained : null,
                remarks: existing ? existing.remarks : '',
                existing_id: existing ? existing.id : null
            }
        })
    } catch (error) {
        console.error(error)
        $q.notify({ type: 'negative', message: 'Failed to load students' })
    }
}

async function saveMarks() {
    savingMarks.value = true
    try {
        const upserts = []
        for (const student of studentsList.value) {
            const entry = marksMap.value[student.id]
            if (entry.marks !== null || entry.remarks) {
                upserts.push({
                    exam_id: selectedExam.value.id,
                    student_id: student.id,
                    marks_obtained: entry.marks,
                    remarks: entry.remarks
                })
            }
        }
        
        if (upserts.length > 0) {
            await examService.saveMarks(upserts)
        }
        
        $q.notify({ type: 'positive', message: 'Marks saved successfully!' })
        showMarksDialog.value = false
    } catch (e) {
        console.error(e)
        $q.notify({ type: 'negative', message: 'Failed to save marks' })
    } finally {
        savingMarks.value = false
    }
}

async function confirmDelete(exam) {
    if(confirm('Delete this exam?')) {
        try {
            await examService.delete(exam.id)
            fetchExams()
        } catch (error) {
            console.error(error)
            $q.notify({ type: 'negative', message: 'Failed to delete exam' })
        }
    }
}

onMounted(() => {
    fetchExams()
})
</script>

<style scoped>
.font-outfit {
  font-family: 'Outfit', sans-serif;
}
.my-card {
  border-radius: 12px;
  border: 1px solid #f0f0f0;
}
.rounded-borders-lg {
  border-radius: 16px;
}
.hover-lift {
    transition: transform 0.2s, box-shadow 0.2s;
}
.hover-lift:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>
