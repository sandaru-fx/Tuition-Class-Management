<template>
  <q-page class="q-pa-lg bg-slate-50">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold text-slate-800 font-outfit">Assignments</div>
        <div class="text-subtitle1 text-slate-500">Track and grade student submissions</div>
      </div>
      <q-btn 
        unelevated 
        color="blue-600" 
        icon="add" 
        label="Create Assignment" 
        no-caps 
        class="rounded-borders" 
        to="/teacher/assignments/create"
      />
    </div>

    <q-card class="bg-white shadow-sm rounded-xl">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="blue-600"
        indicator-color="blue-600"
        align="left"
        narrow-indicator
      >
        <q-tab name="active" label="Active Assignments" />
        <q-tab name="completed" label="Past / Completed" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <!-- Active Assignments -->
        <q-tab-panel name="active" class="q-pa-none">
            
           <div v-if="loading" class="text-center q-pa-lg">
               <q-spinner color="primary" size="2em" />
           </div>

           <div v-else-if="activeAssignments.length === 0" class="text-center q-pa-xl text-grey-5">
               <q-icon name="assignment" size="3em" />
               <div class="q-mt-sm">No active assignments</div>
               <div class="text-caption">Create your first assignment!</div>
           </div>

           <q-list separator v-else>
             <q-item v-for="assign in activeAssignments" :key="assign.id" class="q-py-md q-px-lg hover-bg-slate-50">
               <q-item-section>
                 <q-item-label class="text-h6 text-weight-bold text-slate-800">{{ assign.title }}</q-item-label>
                 <q-item-label caption class="text-slate-500 q-mt-xs">
                   {{ getClassName(assign.class_id) }} • Due: <span class="text-red-5">{{ formatDateDisplay(assign.due_date) }}</span>
                 </q-item-label>
                 <div class="row q-gutter-sm q-mt-xs">
                    <q-chip v-if="assign.type === 'paper'" size="xs" color="purple-1" text-color="purple-8">Paper/Exam</q-chip>
                    <q-chip size="xs" color="blue-1" text-color="blue-8">{{ assign.max_score }} Marks</q-chip>
                 </div>
               </q-item-section>
               
               <q-item-section side top>
                 <div class="column items-end">
                    <!-- Placeholder for submission stats -->
                    <q-chip size="sm" color="amber-100" text-color="amber-9" icon="pending">
                       Pending Count: {{ getPendingCount(assign) }}
                    </q-chip>
                    <div class="row q-gutter-xs q-mt-sm">
                        <q-btn flat dense icon="edit" color="grey-7" size="sm" :to="`/teacher/assignments/edit/${assign.id}`" />
                        <q-btn flat dense icon="delete" color="red-4" size="sm" @click="confirmDelete(assign)" />
                        <q-btn unelevated color="blue-600" label="Grade" no-caps size="sm" :to="`/teacher/assignments/grade/${assign.id}`" />
                    </div>
                 </div>
               </q-item-section>
             </q-item>
           </q-list>
        </q-tab-panel>

        <!-- Completed Assignments -->
        <q-tab-panel name="completed" class="q-pa-none">
             <div v-if="completedAssignments.length === 0" class="text-center q-pa-xl text-grey-5">
               <div>No past assignments</div>
           </div>
           <q-list separator v-else>
             <q-item v-for="assign in completedAssignments" :key="assign.id" class="q-py-md q-px-lg">
               <q-item-section>
                 <q-item-label class="text-body1 text-weight-bold text-slate-700">{{ assign.title }}</q-item-label>
                 <q-item-label caption class="text-slate-500">
                   {{ getClassName(assign.class_id) }} • Due {{ formatDateDisplay(assign.due_date) }}
                 </q-item-label>
               </q-item-section>
               
               <q-item-section side>
                   <div class="row q-gutter-xs">
                        <q-btn flat dense icon="visibility" color="grey-7" size="sm" />
                   </div>
               </q-item-section>
             </q-item>
           </q-list>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <!-- Delete Dialog -->
    <q-dialog v-model="showDeleteDialog">
      <q-card style="min-width: 350px" class="q-pa-sm rounded-borders-lg">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="red-1" text-color="red" size="md" />
          <span class="q-ml-md text-h6 font-outfit">Confirm Delete</span>
        </q-card-section>
        <q-card-section class="q-pt-none text-grey-8">
          Delete assignment <strong>{{ assignmentToDelete?.title }}</strong>?<br>
          <span class="text-caption text-red">This will ask delete all student submissions!</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey-7" v-close-popup no-caps />
          <q-btn unelevated label="Delete" color="red" @click="deleteAssignment" :loading="deleting" no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar, date } from 'quasar'
import { assignmentService } from 'src/services/assignmentService'
import { teacherService } from 'src/services/teacherService'
import { useAuthStore } from 'src/stores/auth'

const $q = useQuasar()
const authStore = useAuthStore()
const tab = ref('active')
const loading = ref(false)
const deleting = ref(false)

const assignments = ref([])
const myClasses = ref([])

// Dialog States
const showDeleteDialog = ref(false)
const assignmentToDelete = ref(null)

// Computed
const activeAssignments = computed(() => {
    return assignments.value.filter(a => {
        return new Date(a.due_date) >= new Date()
    })
})

const completedAssignments = computed(() => {
     return assignments.value.filter(a => {
        return new Date(a.due_date) < new Date()
    })
})

const pendingCountsMap = ref({})

async function fetchData() {
    if (!authStore.profile?.id) return

    loading.value = true
    try {
        const [assignData, clsData, pendingData] = await Promise.all([
            assignmentService.getByTeacher(authStore.profile.id),
            teacherService.getMyClasses(authStore.profile.id),
            teacherService.getPendingGrading(authStore.profile.id)
        ])
        assignments.value = assignData || []
        myClasses.value = clsData || []
        
        // Map pending counts: { assignment_id: count }
        if (pendingData) {
            const map = {}
            pendingData.forEach(item => {
                map[item.id] = item.count
            })
            pendingCountsMap.value = map
        }
        
    } catch (e) {
        console.error(e)
        $q.notify({ type: 'negative', message: 'Failed to load assignments' })
    } finally {
        loading.value = false
    }
}

function confirmDelete(assign) {
    assignmentToDelete.value = assign
    showDeleteDialog.value = true
}

async function deleteAssignment() {
    if (!assignmentToDelete.value) return
    deleting.value = true
    try {
        await assignmentService.delete(assignmentToDelete.value.id)
        $q.notify({ type: 'positive', message: 'Assignment deleted' })
        fetchData()
        showDeleteDialog.value = false
    } catch (e) {
         console.error(e)
        $q.notify({ type: 'negative', message: 'Failed to delete' })
    } finally {
        deleting.value = false
    }
}

function formatDateDisplay(dateStr) {
    return date.formatDate(dateStr, 'MMM D, YYYY h:mm A')
}

// Get class name helper
function getClassName(id) {
    const cls = myClasses.value.find(c => c.id === id)
    return cls ? `${cls.subject?.name} - Grade ${cls.grade}` : 'Unknown Class'
}

// Get pending submission count for assignment
function getPendingCount(assign) {
    return pendingCountsMap.value[assign.id] || 0
}

onMounted(() => {
    fetchData()
})
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.rounded-xl { border-radius: 16px; }
.rounded-borders { border-radius: 8px; }
.hover-bg-slate-50:hover { background-color: #F8FAFC; }
</style>
