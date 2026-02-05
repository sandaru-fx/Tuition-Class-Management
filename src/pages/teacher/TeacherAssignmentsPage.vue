<template>
  <q-page class="q-pa-lg bg-slate-50">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold text-slate-800 font-outfit">Assignments</div>
        <div class="text-subtitle1 text-slate-500">Track and grade student submissions</div>
      </div>
      <q-btn unelevated color="blue-600" icon="add" label="Create Assignment" no-caps class="rounded-borders" @click="openAddDialog" />
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
           </div>

           <q-list separator v-else>
             <q-item v-for="assign in activeAssignments" :key="assign.id" class="q-py-md q-px-lg hover-bg-slate-50">
               <q-item-section>
                 <q-item-label class="text-h6 text-weight-bold text-slate-800">{{ assign.title }}</q-item-label>
                 <q-item-label caption class="text-slate-500 q-mt-xs">
                   {{ getClassName(assign.class_id) }} • Due: <span class="text-red-5">{{ formatDateDisplay(assign.due_date) }}</span>
                 </q-item-label>
                 <q-chip v-if="assign.type === 'paper'" size="xs" color="purple-1" text-color="purple-8" class="q-mt-xs">Paper/Exam</q-chip>
               </q-item-section>
               
               <q-item-section side top>
                 <div class="column items-end">
                    <!-- Placeholder for submission stats -->
                    <q-chip size="sm" color="amber-100" text-color="amber-9" icon="pending">
                       Pending
                    </q-chip>
                    <div class="row q-gutter-xs q-mt-sm">
                        <q-btn flat dense icon="edit" color="grey-7" size="sm" @click="openEditDialog(assign)" />
                        <q-btn flat dense icon="delete" color="red-4" size="sm" @click="confirmDelete(assign)" />
                        <q-btn unelevated color="blue-600" label="Grade" no-caps size="sm" />
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
                        <q-btn flat dense icon="edit" color="grey-7" size="sm" @click="openEditDialog(assign)" />
                        <q-btn flat dense icon="delete" color="red-4" size="sm" @click="confirmDelete(assign)" />
                   </div>
               </q-item-section>
             </q-item>
           </q-list>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <!-- Create/Edit Dialog -->
    <q-dialog v-model="showDialog" persistent>
        <q-card style="min-width: 550px" class="rounded-borders-lg">
            <q-card-section class="row items-center">
                <div class="text-h6 font-outfit">{{ isEditing ? 'Edit Assignment' : 'Create Assignment' }}</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section class="q-pt-none q-gutter-y-md">
                <q-input outlined v-model="form.title" label="Title *" :rules="[val => !!val || 'Required']" />
                
                <q-select 
                    outlined 
                    v-model="form.class_id" 
                    :options="classOptions" 
                    label="Class *" 
                    emit-value
                    map-options
                    :rules="[val => !!val || 'Required']" 
                />

                <div class="row q-col-gutter-sm">
                    <div class="col-6">
                        <q-input outlined v-model="form.due_date" label="Due Date *" type="datetime-local" :rules="[val => !!val || 'Required']" />
                    </div>
                    <div class="col-6">
                         <q-select outlined v-model="form.type" :options="typeOptions" label="Type *" emit-value map-options />
                    </div>
                </div>

                <q-input outlined v-model="form.description" label="Description / Instructions" type="textarea" rows="3" />

                 <q-file outlined v-model="fileToUpload" label="Attachment (PDF/Image)" dense>
                    <template v-slot:append>
                        <q-icon name="attach_file" />
                    </template>
                </q-file>
                 <div v-if="isEditing && form.attachment_url" class="text-caption text-blue cursor-pointer">
                    Current file: <a :href="form.attachment_url" target="_blank">View</a>
                </div>
            </q-card-section>

            <q-card-actions align="right" class="q-pa-md">
                <q-btn flat label="Cancel" color="grey" v-close-popup no-caps />
                <q-btn unelevated :label="isEditing ? 'Update' : 'Create'" color="blue-600" @click="saveAssignment" :loading="submitting" no-caps />
            </q-card-actions>
        </q-card>
    </q-dialog>

    <!-- Delete Dialog -->
    <q-dialog v-model="showDeleteDialog">
      <q-card style="min-width: 350px" class="q-pa-sm rounded-borders-lg">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="red-1" text-color="red" size="md" />
          <span class="q-ml-md text-h6 font-outfit">Confirm Delete</span>
        </q-card-section>
        <q-card-section class="q-pt-none text-grey-8">
          Delete assignment <strong>{{ assignmentToDelete?.title }}</strong>?
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
import { classService } from 'src/services/classService'

const $q = useQuasar()
const tab = ref('active')
const loading = ref(false)
const submitting = ref(false)
const deleting = ref(false)

const assignments = ref([])
const classOptions = ref([])

// Dialog States
const showDialog = ref(false)
const isEditing = ref(false)
const showDeleteDialog = ref(false)
const assignmentToDelete = ref(null)

// Form Data
const form = ref({
    id: null,
    title: '',
    description: '',
    class_id: null,
    due_date: '',
    type: 'homework', // 'homework' or 'paper'
    max_score: 100,
    attachment_url: ''
})

const fileToUpload = ref(null)

// Computed
const activeAssignments = computed(() => {
    return assignments.value.filter(a => {
        // Active if due date is future or no submission (logic varies, simplified here)
        return new Date(a.due_date) >= new Date()
    })
})

const completedAssignments = computed(() => {
     return assignments.value.filter(a => {
        return new Date(a.due_date) < new Date()
    })
})

const typeOptions = [
    { label: 'Homework', value: 'homework' },
    { label: 'Paper / Exam', value: 'paper' }
]

async function fetchData() {
    loading.value = true
    try {
        const [assignData, clsData] = await Promise.all([
            assignmentService.getAll(),
            classService.getAll()
        ])
        assignments.value = assignData || []
        
        // Format classes for dropdown
        classOptions.value = clsData.map(c => ({
            label: `${c.subject?.name || 'Unknown'} - ${c.grade} (${c.teacher_name})`,
            value: c.id
        }))
    } catch (e) {
        console.error(e)
        $q.notify({ type: 'negative', message: 'Failed to load data' })
    } finally {
        loading.value = false
    }
}

function openAddDialog() {
    isEditing.value = false
    form.value = {
        id: null,
        title: '',
        description: '',
        class_id: null,
        due_date: '',
        type: 'homework',
        max_score: 100,
        attachment_url: ''
    }
    fileToUpload.value = null
    showDialog.value = true
}

function openEditDialog(assign) {
    isEditing.value = true
    form.value = { ...assign }
    // Ensure dates are formatted for input if needed, Quasar handles specific formats usually
    showDialog.value = true
}

async function saveAssignment() {
    submitting.value = true
    try {
        // Upload file if present
        if (fileToUpload.value) {
            form.value.attachment_url = await assignmentService.uploadFile(fileToUpload.value)
        }

        if (isEditing.value) {
            await assignmentService.update(form.value.id, form.value) // Update method needs to be verified in service
            $q.notify({ type: 'positive', message: 'Assignment updated' })
        } else {
            await assignmentService.create(form.value)
            $q.notify({ type: 'positive', message: 'Assignment created' })
        }
        
        showDialog.value = false
        fetchData()
    } catch (e) {
        console.error(e)
        $q.notify({ type: 'negative', message: 'Error saving assignment' })
    } finally {
        submitting.value = false
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
    const cls = classOptions.value.find(c => c.value === id)
    return cls ? cls.label : 'Unknown Class'
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
