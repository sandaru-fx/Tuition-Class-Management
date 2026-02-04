<template>
  <q-page class="q-pa-lg q-pa-xl-xl bg-slate-50 transition-all">
    
    <!-- Header Section -->
    <div class="row items-center justify-between q-mb-xl">
        <div class="col-12 col-md-auto">
            <h1 class="text-h3 text-weight-black font-outfit text-slate-900 q-my-none tracking-tighter">
                {{ isPrimary ? 'My Homework 🎨' : 'Assignments' }}
            </h1>
            <p class="text-subtitle1 text-slate-500 q-mt-sm q-mb-none font-medium">
                {{ isPrimary ? 'Complete your fun tasks!' : 'Track deadlines and manage submissions.' }}
            </p>
        </div>
        
        <!-- Grade Badge (Debug/Info) -->
         <q-badge color="blue-1" text-color="blue-9" class="q-pa-sm text-weight-bold" v-if="studentGrade">
            Grade {{ studentGrade }}
        </q-badge>
    </div>

    <!-- PRIMARY MODE (Grade 1-5) -->
    <div v-if="isPrimary" class="row q-col-gutter-lg">
        <div class="col-12 col-sm-6 col-md-4" v-for="task in assignments" :key="task.id">
            <q-card class="rounded-3xl shadow-soft hover-pop border-4 border-white bg-white">
                <q-img src="https://cdn.quasar.dev/img/geometry.png" height="120px" class="rounded-t-3xl">
                    <div class="absolute-bottom text-subtitle2 text-weight-bolder">
                        {{ task.classes?.subject?.name }}
                    </div>
                </q-img>
                
                <q-card-section class="q-pt-md">
                     <div class="text-h5 text-weight-black text-slate-900 font-outfit q-mb-sm">{{ task.title }}</div>
                     <div class="text-caption text-slate-500">{{ task.description }}</div>
                     
                     <!-- Status / Stars -->
                     <div class="row items-center justify-center q-mt-md bg-yellow-50 rounded-xl q-pa-sm" v-if="task.submission?.status === 'graded'">
                         <q-icon name="star" color="orange" size="md" v-for="n in task.submission.score" :key="n" />
                         <span v-if="!task.submission.score" class="text-grey text-caption">Pending Review</span>
                     </div>
                </q-card-section>

                <q-card-actions align="center" class="q-pb-md">
                    <q-btn 
                        v-if="!task.submission"
                        push 
                        color="purple" 
                        icon="photo_camera" 
                        label="Take Photo" 
                        size="lg" 
                        rounded 
                        class="full-width font-outfit text-weight-bold"
                        @click="openUploadDialog(task)"
                    />
                    <q-btn 
                        v-else
                        flat
                        color="green"
                        icon="check_circle"
                        label="Done!"
                        disable
                        class="text-weight-bold"
                    />
                </q-card-actions>
            </q-card>
        </div>
        
        <!-- Empty State Primary -->
         <div v-if="assignments.length === 0" class="col-12 text-center q-pa-xl opacity-50">
             <q-icon name="sentiment_very_satisfied" size="100px" color="blue-2" />
             <div class="text-h4 text-blue-3 q-mt-md font-outfit">All Done! Play Time!</div>
         </div>
    </div>

    <!-- SENIOR MODE (Grade 6-13) -->
    <div v-else class="column q-gutter-y-lg">
         <q-card v-for="task in assignments" :key="task.id" flat class="bg-white q-pa-lg rounded-2xl border-slate shadow-sm hover-lift">
             <div class="row items-center">
                 <!-- Date Box -->
                 <div class="col-auto q-mr-lg">
                    <div class="date-box bg-slate-50 text-slate-700">
                        <div class="text-weight-black text-h6">{{ new Date(task.due_date).getDate() }}</div>
                        <div class="text-uppercase text-caption text-weight-bold">{{ new Date(task.due_date).toLocaleString('default', { month: 'short' }) }}</div>
                    </div>
                 </div>
                 
                 <div class="col">
                     <div class="row items-center q-mb-xs">
                         <q-badge color="blue-50" text-color="blue-9" class="text-weight-bold q-mr-sm">
                             {{ task.classes?.subject?.name }}
                         </q-badge>
                         <q-badge v-if="task.type === 'paper'" color="purple-50" text-color="purple-9" label="Paper" />
                     </div>
                     <div class="text-h6 text-weight-bold text-slate-900">{{ task.title }}</div>
                     <div class="text-body2 text-slate-500">{{ task.description }}</div>
                 </div>
                 
                 <!-- Status & Action -->
                 <div class="col-auto text-right row items-center q-gutter-x-md">
                      <div v-if="task.submission">
                          <div v-if="task.submission.status === 'graded'" class="text-center">
                              <div class="text-caption text-slate-400">Score</div>
                              <div class="text-h5 text-weight-black text-green-600">{{ task.submission.score }}/{{ task.max_score }}</div>
                          </div>
                          <q-badge v-else color="orange-1" text-color="orange-8" label="Pending Review" />
                      </div>
                      
                      <q-btn 
                        v-if="!task.submission"
                        unelevated 
                        color="black" 
                        label="Submit PDF" 
                        no-caps 
                        icon="upload_file"
                        class="rounded-lg"
                        @click="openUploadDialog(task)"
                      />
                 </div>
             </div>
         </q-card>
         
          <!-- Empty State Senior -->
         <div v-if="assignments.length === 0" class="text-center q-pa-xl text-slate-400">
             <q-icon name="assignment_turned_in" size="64px" class="q-mb-md opacity-20" />
             <div class="text-h6">No pending assignments. Great job!</div>
         </div>
    </div>

    <!-- Upload Dialog -->
    <q-dialog v-model="showUploadDialog">
        <q-card style="min-width: 400px" class="rounded-2xl">
            <q-card-section class="row items-center">
                <div class="text-h6 font-outfit">{{ isPrimary ? 'Take a Picture! 📸' : 'Upload Submission' }}</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>
            
            <q-card-section class="q-pa-lg text-center">
                 <q-file
                    v-model="uploadFile"
                    outlined
                    :label="isPrimary ? 'Choose Photo' : 'Select PDF/Image'"
                    accept="image/*,application/pdf"
                    class="q-mb-md"
                 >
                    <template v-slot:prepend><q-icon name="cloud_upload" /></template>
                 </q-file>
                 
                 <q-btn 
                    unelevated 
                    :color="isPrimary ? 'purple' : 'primary'" 
                    label="Submit Assignment" 
                    class="full-width q-py-md rounded-xl text-weight-bold"
                    :loading="uploading"
                    @click="submitFile"
                    :disable="!uploadFile"
                 />
            </q-card-section>
        </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { assignmentService } from 'src/services/assignmentService'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const authStore = useAuthStore()
const assignments = ref([])
const studentGrade = ref(null) // Fetch from profile

const showUploadDialog = ref(false)
const uploadFile = ref(null)
const selectedTask = ref(null)
const uploading = ref(false)

// Determine Mode
const isPrimary = computed(() => {
    if (!studentGrade.value) return false // Default to Senior if unknown
    const grade = parseInt(studentGrade.value)
    return grade >= 1 && grade <= 5
})

async function init() {
    if (authStore.profile) {
        // Assume 'grade' is in profile, or default to 12 for demo
        studentGrade.value = authStore.profile.grade || '12' 
        
        try {
            // 1. Fetch Assignments
            const tasks = await assignmentService.getAssignmentsByGrade(studentGrade.value)
            
            // 2. Fetch Submissions for each task (or specific to student)
            // Ideally we do a join, but MVP: iterate
            const tasksWithSub = await Promise.all(tasks.map(async (t) => {
                const sub = await assignmentService.getMySubmission(t.id, authStore.profile.id)
                return { ...t, submission: sub }
            }))
            
            assignments.value = tasksWithSub
        } catch (e) {
            console.error(e)
        }
    }
}

function openUploadDialog(task) {
    selectedTask.value = task
    uploadFile.value = null
    showUploadDialog.value = true
}

async function submitFile() {
    if (!uploadFile.value) return
    uploading.value = true
    try {
        const fileUrl = await assignmentService.uploadFile(uploadFile.value)
        
        await assignmentService.submit({
            assignment_id: selectedTask.value.id,
            student_id: authStore.profile.id,
            file_url: fileUrl,
            status: 'submitted',
            submitted_at: new Date().toISOString()
        })
        
        $q.notify({ type: 'positive', message: isPrimary.value ? 'Great Job! ⭐' : 'Submitted successfully' })
        showUploadDialog.value = false
        init() // Refresh
    } catch (e) {
        console.error(e)
        $q.notify({ type: 'negative', message: 'Upload failed' })
    } finally {
        uploading.value = false
    }
}

onMounted(() => {
    init()
})
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.bg-slate-50 { background-color: #f8fafc; }
.text-slate-900 { color: #0f172a; }
.text-slate-500 { color: #64748b; }

.rounded-3xl { border-radius: 24px; }
.rounded-2xl { border-radius: 16px; }
.shadow-soft { box-shadow: 0 4px 20px rgba(0,0,0,0.05); }

.date-box {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid #e2e8f0;
}

.hover-pop { transition: transform 0.2s; }
.hover-pop:hover { transform: scale(1.02); }

.hover-lift { transition: transform 0.2s, box-shadow 0.2s; }
.hover-lift:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
</style>
