<template>
  <q-page class="q-pa-lg bg-slate-50">
    <!-- Header -->
    <div v-if="assignment" class="row items-center justify-between q-mb-lg">
      <div class="row items-center">
        <q-btn flat round icon="arrow_back" color="slate-600" to="/teacher/assignments" />
        <div class="q-ml-sm">
           <div class="text-h4 text-weight-bold text-slate-800 font-outfit">{{ assignment.title }}</div>
           <div class="text-subtitle1 text-slate-500">
             {{ assignment.classes?.subject?.name }} - Grade {{ assignment.classes?.grade }} • Max Score: {{ assignment.max_score }}
           </div>
        </div>
      </div>
      <div class="row q-gutter-sm">
         <q-btn outline color="primary" icon="refresh" label="Refresh" @click="fetchData" />
         <q-btn unelevated color="blue-600" icon="cloud_download" label="Export Marks" disable />
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-3">
        <q-card class="bg-blue-50 text-blue-9 shadow-sm rounded-xl">
          <q-card-section>
            <div class="text-caption text-uppercase text-weight-bold opacity-60">Total Students</div>
            <div class="text-h4 text-weight-bold">{{ stats.total }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card class="bg-green-50 text-green-9 shadow-sm rounded-xl">
          <q-card-section>
             <div class="text-caption text-uppercase text-weight-bold opacity-60">Submitted</div>
             <div class="text-h4 text-weight-bold">{{ stats.submitted }}</div>
          </q-card-section>
        </q-card>
      </div>
       <div class="col-12 col-md-3">
        <q-card class="bg-amber-50 text-amber-9 shadow-sm rounded-xl">
          <q-card-section>
             <div class="text-caption text-uppercase text-weight-bold opacity-60">Pending Grade</div>
             <div class="text-h4 text-weight-bold">{{ stats.pendingGrading }}</div>
          </q-card-section>
        </q-card>
      </div>
       <div class="col-12 col-md-3">
        <q-card class="bg-grey-50 text-grey-8 shadow-sm rounded-xl">
          <q-card-section>
             <div class="text-caption text-uppercase text-weight-bold opacity-60">Average Score</div>
             <div class="text-h4 text-weight-bold">{{ stats.avgScore }}%</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Submissions Table -->
    <q-card class="shadow-sm rounded-xl">
      <q-table
        :rows="submissions"
        :columns="columns"
        row-key="id"
        :loading="loading"
        flat
      >
        <template v-slot:body-cell-student="props">
          <q-td :props="props">
            <div class="row items-center">
              <q-avatar size="sm" color="blue-100" text-color="blue-8" icon="person" class="q-mr-sm" />
              <div>
                <div class="text-weight-medium">{{ props.row.student?.full_name }}</div>
                <div class="text-caption text-grey-6">{{ props.row.student?.whatsapp_number }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
            <q-td :props="props">
                <q-chip 
                  size="sm" 
                  :color="getStatusColor(props.row.status)" 
                  :text-color="getStatusTextColor(props.row.status)"
                  class="text-capitalize"
                >
                    {{ props.row.status }}
                </q-chip>
            </q-td>
        </template>

        <template v-slot:body-cell-file="props">
            <q-td :props="props">
                <q-btn 
                    v-if="props.row.file_url" 
                    flat 
                    dense 
                    color="blue" 
                    icon="description" 
                    label="View File" 
                    no-caps 
                    size="sm" 
                    type="a" 
                    :href="props.row.file_url" 
                    target="_blank" 
                />
                <span v-else class="text-grey-5">-</span>
            </q-td>
        </template>

        <template v-slot:body-cell-score="props">
            <q-td :props="props">
                <div v-if="props.row.status === 'graded'" class="text-weight-bold text-blue-9">
                    {{ props.row.score }} / {{ assignment?.max_score }}
                </div>
                <div v-else class="text-grey-5">-</div>
            </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
            <q-td :props="props" align="right">
                <q-btn 
                    unelevated 
                    size="sm" 
                    :color="props.row.status === 'graded' ? 'grey-3' : 'blue-600'" 
                    :text-color="props.row.status === 'graded' ? 'black' : 'white'"
                    :label="props.row.status === 'graded' ? 'Edit Grade' : 'Grade'" 
                    no-caps 
                    @click="openGradeDialog(props.row)" 
                />
            </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Grading Dialog -->
    <q-dialog v-model="showGradeDialog">
        <q-card style="min-width: 400px" class="rounded-xl">
            <q-card-section class="bg-blue-600 text-white q-py-sm">
                <div class="text-h6 font-outfit">Grade Submission</div>
                <div class="text-caption opacity-90">{{ selectedSubmission?.student?.full_name }}</div>
            </q-card-section>

            <q-card-section class="q-pt-md q-gutter-y-md">
                <div v-if="selectedSubmission?.file_url" class="q-pa-sm bg-grey-1 rounded-borders row items-center justify-between">
                    <div class="row items-center">
                        <q-icon name="description" color="primary" class="q-mr-sm" />
                        <span class="text-caption text-grey-8">Student's Submission File</span>
                    </div>
                    <q-btn flat dense color="primary" label="Open" size="sm" type="a" :href="selectedSubmission.file_url" target="_blank" />
                </div>

                <div class="row items-center q-col-gutter-md">
                    <div class="col-6">
                        <q-input 
                            outlined 
                            v-model.number="gradingForm.score" 
                            label="Score" 
                            type="number" 
                            :max="assignment?.max_score"
                            min="0"
                            autofocus
                        >
                            <template v-slot:append>
                                <span class="text-caption">/ {{ assignment?.max_score }}</span>
                            </template>
                        </q-input>
                    </div>
                </div>

                <q-input 
                    outlined 
                    v-model="gradingForm.feedback" 
                    label="Feedback / Remarks" 
                    type="textarea" 
                    rows="3" 
                />
            </q-card-section>

            <q-card-actions align="right" class="q-pa-md">
                <q-btn flat label="Cancel" color="grey" v-close-popup no-caps />
                <q-btn unelevated label="Save Grade" color="blue-600" @click="saveGrade" :loading="savingGrade" no-caps />
            </q-card-actions>
        </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { assignmentService } from 'src/services/assignmentService'
import { teacherService } from 'src/services/teacherService'

const route = useRoute()
const $q = useQuasar()

const assignmentId = route.params.id
const assignment = ref(null)
const submissions = ref([])
const enrolledStudents = ref([]) // To calculate missing submissions
const loading = ref(true)

// Grading State
const showGradeDialog = ref(false)
const selectedSubmission = ref(null)
const gradingForm = ref({ score: 0, feedback: '' })
const savingGrade = ref(false)

const columns = [
  { name: 'student', label: 'Student', align: 'left', field: row => row.student?.full_name },
  { name: 'submitted_at', label: 'Submitted On', align: 'left', field: 'submitted_at', format: val => val ? new Date(val).toLocaleDateString() : '-' },
  { name: 'status', label: 'Status', align: 'center', field: 'status' },
  { name: 'file', label: 'Attachment', align: 'center', field: 'file_url' },
  { name: 'score', label: 'Score', align: 'center', field: 'score' },
  { name: 'actions', label: 'Actions', align: 'right' }
]

const stats = computed(() => {
    const total = enrolledStudents.value.length || 0
    const sub = submissions.value.length
    const pendingGrading = submissions.value.filter(s => s.status === 'submitted' || s.status === 'late').length
    
    // Avg Score of graded
    const graded = submissions.value.filter(s => s.status === 'graded')
    const totalScore = graded.reduce((sum, s) => sum + (s.score || 0), 0)
    const avgScore = graded.length ? Math.round(totalScore / graded.length) : 0
    
    // Normalize to percentage
    const max = assignment.value?.max_score || 100
    const avgPercent = max ? Math.round((avgScore / max) * 100) : 0

    return { total, submitted: sub, pendingGrading, avgScore: avgPercent }
})

async function fetchData() {
    loading.value = true
    try {
        // 1. Get Assignment Details
        assignment.value = await assignmentService.getById(assignmentId)

        // 2. Get Submissions
        const subs = await assignmentService.getSubmissionsForAssignment(assignmentId)
        submissions.value = subs || []

        // 3. Get Student Roster (to know total students)
        if (assignment.value?.class_id) {
            const classDetails = await teacherService.getClassDetails(assignment.value.class_id)
            enrolledStudents.value = classDetails.students || []
        }

    } catch (e) {
        console.error(e)
        $q.notify({ type: 'negative', message: 'Failed to load data' })
    } finally {
        loading.value = false
    }
}

function openGradeDialog(submission) {
    selectedSubmission.value = submission
    gradingForm.value = {
        score: submission.score || 0,
        feedback: submission.feedback || ''
    }
    showGradeDialog.value = true
}

async function saveGrade() {
    savingGrade.value = true
    try {
        await assignmentService.grade(
            selectedSubmission.value.id, 
            gradingForm.value.score, 
            gradingForm.value.feedback
        )
        $q.notify({ type: 'positive', message: 'Grade saved successfully' })
        showGradeDialog.value = false
        fetchData() // Refresh
    } catch (e) {
        console.error(e)
        $q.notify({ type: 'negative', message: 'Failed to save grade' })
    } finally {
        savingGrade.value = false
    }
}

function getStatusColor(status) {
    switch(status) {
        case 'submitted': return 'blue-1';
        case 'graded': return 'green-1';
        case 'late': return 'orange-1';
        case 'missing': return 'red-1';
        default: return 'grey-1';
    }
}

function getStatusTextColor(status) {
    switch(status) {
        case 'submitted': return 'blue-9';
        case 'graded': return 'green-9';
        case 'late': return 'orange-9';
        case 'missing': return 'red-9';
        default: return 'grey-8';
    }
}

onMounted(() => {
    fetchData()
})
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.rounded-xl { border-radius: 16px; }
.rounded-borders { border-radius: 8px; }
.bg-slate-50 { background-color: #F8FAFC; }
.opacity-60 { opacity: 0.6; }
.opacity-90 { opacity: 0.9; }
</style>
