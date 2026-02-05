<template>
  <q-page class="q-pa-lg bg-grey-1">
    
    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bold text-dark q-mb-xs font-outfit">Assignments & Homework</h1>
        <p class="text-grey-7 q-mb-none text-subtitle1">Manage daily homework and exam papers.</p>
      </div>
      <q-space />
      <q-btn 
        unelevated 
        color="black" 
        text-color="white" 
        label="Create Assignment" 
        icon="add" 
        no-caps 
        class="rounded-borders-lg"
        @click="openCreateDialog" 
      />
    </div>

    <!-- Filter & Tabs -->
    <q-card class="shadow-1 rounded-borders-lg q-mb-md">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="left"
          narrow-indicator
        >
          <q-tab name="active" label="Active Tasks" icon="task_alt" no-caps />
          <q-tab name="past" label="Past Due" icon="history" no-caps />
        </q-tabs>
    </q-card>

    <!-- Content -->
    <q-tab-panels v-model="tab" animated class="bg-transparent">
        <q-tab-panel name="active" class="q-pa-none">
            
            <div v-if="loading" class="row justify-center q-py-lg">
                <q-spinner-dots color="primary" size="40px" />
            </div>

            <div v-else-if="assignments.length === 0" class="column items-center justify-center q-py-xl text-grey-5">
                <q-icon name="assignment_add" size="64px" class="q-mb-md" />
                <div class="text-h6">No active assignments</div>
                <p>Create one to get started!</p>
            </div>

            <div v-else class="row q-col-gutter-md">
                <div class="col-12 col-md-4" v-for="task in assignments" :key="task.id">
                    <q-card class="my-card shadow-1 hover-lift column full-height">
                        <q-card-section>
                            <div class="row items-start justify-between no-wrap">
                                <div>
                                    <q-badge :color="getTypeColor(task.type)" :text-color="getTypeTextColor(task.type)" class="q-mb-sm text-weight-bold uppercase">
                                        {{ task.type }}
                                    </q-badge>
                                    <div class="text-h6 font-outfit line-clamp-1">{{ task.title }}</div>
                                </div>
                                <q-btn flat round dense icon="more_vert" color="grey-7">
                                     <q-menu>
                                        <q-list style="min-width: 100px">
                                          <q-item clickable v-close-popup @click="viewSubmissions(task)">
                                            <q-item-section>View Submissions</q-item-section>
                                          </q-item>
                                          <q-separator />
                                          <q-item clickable v-close-popup class="text-red" @click="deleteAssignment(task)">
                                            <q-item-section>Delete</q-item-section>
                                          </q-item>
                                        </q-list>
                                      </q-menu>
                                </q-btn>
                            </div>
                            
                            <div class="text-subtitle2 text-grey-8 q-mt-xs text-weight-medium">
                                {{ task.classes?.subject?.name }} - Grade {{ task.classes?.grade }}
                            </div>
                            
                            <div class="text-caption text-grey-6 q-mt-sm line-clamp-2">
                                {{ task.description || 'No description provided.' }}
                            </div>
                        </q-card-section>

                        <q-space />

                        <q-separator />

                        <q-card-section class="bg-grey-1">
                            <div class="row items-center justify-between text-caption">
                                <div class="row items-center text-grey-7">
                                    <q-icon name="event" size="xs" class="q-mr-xs" />
                                    Due {{ formatDate(task.due_date) }}
                                </div>
                                <div class="text-weight-bold text-primary">
                                    Max: {{ task.max_score }} {{ task.type === 'homework' ? 'Stars' : 'Marks' }}
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
            </div>
        </q-tab-panel>

        <q-tab-panel name="past" class="q-pa-none">
            <!-- Reuse or similar structure for past assignments -->
             <div class="text-center text-grey-5 q-py-xl">Past assignments will appear here (Not implemented in demo)</div>
        </q-tab-panel>
    </q-tab-panels>

    <!-- Create Wizard Dialog -->
    <q-dialog v-model="showCreateDialog" persistent>
        <q-card style="width: 600px; max-width: 90vw;" class="rounded-borders-lg">
            <q-toolbar class="bg-white text-dark">
                <q-toolbar-title class="font-outfit text-weight-bold">Create New Assignment</q-toolbar-title>
                <q-btn flat round dense icon="close" v-close-popup />
            </q-toolbar>

            <q-separator />

            <q-card-section class="q-pa-lg">
                <q-stepper
                    v-model="step"
                    ref="stepper"
                    color="primary"
                    animated
                    flat
                    class="no-shadow"
                >
                    <q-step :name="1" title="Target Class" icon="school" :done="step > 1">
                        <div class="q-gutter-md">
                            <q-select 
                                outlined 
                                v-model="form.class_id" 
                                :options="classOptions" 
                                label="Select Class" 
                                emit-value
                                map-options
                                :rules="[val => !!val || 'Required']"
                            />
                            
                            <div class="text-subtitle2 q-mb-sm">Assignment Type</div>
                            <div class="row q-gutter-md">
                                <div class="col cursor-pointer" @click="form.type = 'homework'">
                                    <q-card flat bordered :class="form.type === 'homework' ? 'bg-blue-1 border-primary' : 'bg-grey-1'">
                                        <q-card-section class="text-center">
                                            <q-icon name="stars" size="md" :color="form.type === 'homework' ? 'primary' : 'grey'" />
                                            <div class="text-weight-bold q-mt-sm">Homework</div>
                                            <div class="text-caption">For Grade 1-5 (Star Rating)</div>
                                        </q-card-section>
                                    </q-card>
                                </div>
                                <div class="col cursor-pointer" @click="form.type = 'paper'">
                                    <q-card flat bordered :class="form.type === 'paper' ? 'bg-blue-1 border-primary' : 'bg-grey-1'">
                                        <q-card-section class="text-center">
                                            <q-icon name="description" size="md" :color="form.type === 'paper' ? 'primary' : 'grey'" />
                                            <div class="text-weight-bold q-mt-sm">Paper/Tute</div>
                                            <div class="text-caption">For Grade 6-13 (Marks 0-100)</div>
                                        </q-card-section>
                                    </q-card>
                                </div>
                            </div>
                        </div>
                    </q-step>

                    <q-step :name="2" title="Details" icon="edit" :done="step > 2">
                        <div class="q-gutter-md">
                            <q-input outlined v-model="form.title" label="Title" :rules="[val => !!val || 'Required']" />
                            <q-input outlined v-model="form.description" label="Instructions" type="textarea" rows="3" />
                            
                            <div class="row q-col-gutter-md">
                                <q-input class="col-6" outlined v-model="form.date" type="date" label="Due Date" />
                                <q-input class="col-6" outlined v-model="form.time" type="time" label="Due Time" />
                            </div>

                            <q-input 
                                outlined 
                                v-model.number="form.max_score" 
                                :label="form.type === 'homework' ? 'Max Stars (Default: 5)' : 'Max Marks (Default: 100)'" 
                                type="number" 
                            />
                        </div>
                    </q-step>

                    <q-step :name="3" title="Review" icon="summarize">
                         <div class="bg-grey-1 q-pa-md rounded-borders">
                             <div class="text-subtitle2 text-grey-7">Summary</div>
                             <div class="text-h6">{{ form.title }}</div>
                             <div class="text-body2">{{ form.description }}</div>
                             <q-separator class="q-my-md" />
                             <div>Type: <b>{{ form.type }}</b></div>
                             <div>Due: <b>{{ form.date }} at {{ form.time }}</b></div>
                         </div>
                    </q-step>

                    <template v-slot:navigation>
                        <q-stepper-navigation class="row justify-end q-mt-lg">
                            <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-mr-sm" />
                            <q-btn 
                                @click="nextStep" 
                                color="black" 
                                :label="step === 3 ? 'Publish Assignment' : 'Continue'" 
                                unelevated
                                :loading="submitting"
                            />
                        </q-stepper-navigation>
                    </template>
                </q-stepper>
            </q-card-section>
        </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar, date } from 'quasar'
import { assignmentService } from 'src/services/assignmentService'
import { classService } from 'src/services/classService'

const $q = useQuasar()
const tab = ref('active')
const step = ref(1)
const showCreateDialog = ref(false)
const loading = ref(false)
const submitting = ref(false)
const assignments = ref([])
const classOptions = ref([])

const form = ref({
    title: '',
    description: '',
    class_id: null,
    type: 'homework',
    date: '',
    time: '23:59',
    max_score: 5
})

// --- Data Fetching ---
async function fetchAssignments() {
    loading.value = true
    try {
        assignments.value = await assignmentService.getAll()
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

async function fetchClasses() {
    try {
        const data = await classService.getAll()
        classOptions.value = data.map(c => ({
            label: `${c.subject?.name} - Grade ${c.grade}`,
            value: c.id
        }))
    } catch (e) { console.error(e) }
}

onMounted(() => {
    fetchAssignments()
    fetchClasses()
})

// --- Logic ---
function openCreateDialog() {
    form.value = {
        title: '',
        description: '',
        class_id: null,
        type: 'homework',
        date: date.formatDate(Date.now(), 'YYYY-MM-DD'),
        time: '23:59',
        max_score: 5
    }
    step.value = 1
    showCreateDialog.value = true
}

function nextStep() {
    if (step.value === 1) {
        if (!form.value.class_id) {
            $q.notify({ type: 'warning', message: 'Please select a class' })
            return
        }
        // Auto-set max score defaults
        if (form.value.type === 'homework') form.value.max_score = 5
        else form.value.max_score = 100
    }
    
    if (step.value === 3) {
        submitAssignment()
    } else {
        step.value++
    }
}

async function submitAssignment() {
    submitting.value = true
    try {
        const dueDate = new Date(`${form.value.date}T${form.value.time}`)
        
        const payload = {
            title: form.value.title,
            description: form.value.description,
            class_id: form.value.class_id,
            type: form.value.type,
            due_date: dueDate.toISOString(),
            max_score: form.value.max_score,
            attachment_url: null // TODO: Add file upload in Wizard if needed
        }

        await assignmentService.create(payload)
        
        $q.notify({ type: 'positive', message: 'Assignment Published!' })
        fetchAssignments()
        showCreateDialog.value = false
    } catch (e) {
        console.error(e)
        $q.notify({ type: 'negative', message: 'Failed to create assignment' })
    } finally {
        submitting.value = false
    }
}

async function deleteAssignment(task) {
    if(!confirm('Are you sure?')) return
    try {
        await assignmentService.delete(task.id)
        fetchAssignments()
        $q.notify({ type: 'positive', message: 'Deleted' })
    } catch {
        $q.notify({ type: 'negative', message: 'Error deleting' })
    }
}

function viewSubmissions() {
    $q.notify({ message: 'Submission view coming soon!', color: 'info' })
}

// --- Helpers ---
const formatDate = (d) => {
    return date.isValid(d) ? date.formatDate(d, 'MMM D, h:mm a') : 'Invalid Date'
}

const getTypeColor = (t) => t === 'homework' ? 'purple-1' : 'orange-1'
const getTypeTextColor = (t) => t === 'homework' ? 'purple-8' : 'orange-9'

</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.rounded-borders-lg { border-radius: 12px; }
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;  
    overflow: hidden;
}
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;  
    overflow: hidden;
}
.hover-lift {
    transition: transform 0.2s, box-shadow 0.2s;
}
.hover-lift:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.border-primary { border: 2px solid #1976d2; }
</style>
