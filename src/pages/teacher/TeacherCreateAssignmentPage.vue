<template>
  <q-page class="q-pa-lg bg-slate-50">
    <!-- Header -->
    <div class="row items-center q-mb-lg">
        <q-btn flat round icon="arrow_back" color="slate-600" to="/teacher/assignments" />
        <div class="q-ml-sm">
          <div class="text-h4 text-weight-bold text-slate-800 font-outfit">{{ isEditing ? 'Edit Assignment' : 'Create Assignment' }}</div>
          <div class="text-subtitle1 text-slate-500">{{ isEditing ? 'Update assignment details' : 'Follow the steps to publish a new assignment' }}</div>
        </div>
    </div>

    <!-- Stepper Wizard -->
    <q-stepper
      v-model="step"
      ref="stepper"
      color="blue-600"
      animated
      class="shadow-sm rounded-xl overflow-hidden"
    >
      <!-- Step 1: Select Class & Type -->
      <q-step
        :name="1"
        title="Class & Type"
        icon="school"
        :done="step > 1"
      >
        <div class="row q-col-gutter-lg q-pt-md">
          <div class="col-12 col-md-6">
            <div class="text-subtitle2 q-mb-sm text-slate-700">Select Class *</div>
            <q-select
              outlined
              v-model="form.class"
              :options="classOptions"
              label="Choose a class"
              option-label="label"
              option-value="id"
              emit-value
              map-options
              :rules="[val => !!val || 'Required']"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                    <q-item-label caption>Grade {{ scope.opt.grade }} • {{ scope.opt.student_count }} Students</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2 q-mb-sm text-slate-700">Assignment Type *</div>
            <div class="row q-gutter-md">
              <q-card 
                v-for="type in types" 
                :key="type.value"
                class="col cursor-pointer transition-all"
                :class="form.type === type.value ? 'bg-blue-50 border-blue' : 'bg-grey-1'"
                @click="form.type = type.value"
                flat
                bordered
              >
                <q-card-section class="text-center q-pa-lg">
                  <q-icon :name="type.icon" size="32px" :color="form.type === type.value ? 'blue-600' : 'grey-5'" />
                  <div class="text-weight-bold q-mt-sm" :class="form.type === type.value ? 'text-blue-9' : 'text-grey-7'">{{ type.label }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </q-step>

      <!-- Step 2: Basic Details -->
      <q-step
        :name="2"
        title="Details"
        icon="description"
        :done="step > 2"
      >
        <div class="q-gutter-y-md q-pt-md" style="max-width: 800px">
          <q-input 
            outlined 
            v-model="form.title" 
            label="Assignment Title *" 
            placeholder="e.g. Organic Chemistry Periodic Table Quiz"
            :rules="[val => !!val || 'Required']"
          />
          
          <q-input 
            outlined 
            v-model="form.description" 
            label="Instructions / Description" 
            type="textarea" 
            rows="4" 
          />

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input outlined v-model="form.due_date" label="Due Date *" type="datetime-local" :rules="[val => !!val || 'Required']" />
            </div>
            <div class="col-12 col-md-6">
              <q-input outlined v-model.number="form.max_score" label="Max Score" type="number" />
            </div>
          </div>
        </div>
      </q-step>

      <!-- Step 3: Content (File or Questions) -->
      <q-step
        :name="3"
        title="Content"
        icon="upload_file"
        :done="step > 3"
      >
        <div class="q-pt-md">
          <!-- File Upload Mode -->
          <div v-if="form.type === 'homework' || form.type === 'paper'">
            <div class="text-h6 text-slate-800 q-mb-md">Upload Materials</div>
            <q-file 
              outlined 
              v-model="fileToUpload" 
              label="Attach PDF / Image / Doc" 
              bottom-slots
              counter
            >
              <template v-slot:prepend>
                <q-icon name="cloud_upload" />
              </template>
              <template v-slot:append>
                <q-icon name="close" @click.stop.prevent="fileToUpload = null" class="cursor-pointer" />
              </template>
              <template v-slot:hint>
                Supported formats: PDF, JPG, PNG, DOCX
              </template>
            </q-file>
          </div>

          <!-- Placeholder for MCQ Builder -->
          <div v-else class="text-center q-pa-xl text-grey-5 border-dashed rounded-borders">
             <q-icon name="quiz" size="48px" />
             <div class="text-h6 q-mt-sm">MCQ Builder Coming Soon</div>
             <p>For now, please upload a question paper instead.</p>
          </div>
        </div>
      </q-step>

      <!-- Step 4: Review -->
      <q-step
        :name="4"
        title="Review"
        icon="check_circle"
      >
        <div class="q-pt-md">
           <div class="text-h6 text-slate-800 q-mb-md">Summary</div>
           
           <q-list bordered separator class="rounded-borders">
             <q-item>
               <q-item-section>
                 <q-item-label caption>Target Class</q-item-label>
                 <q-item-label class="text-weight-bold">{{ getClassName(form.class) }}</q-item-label>
               </q-item-section>
             </q-item>
             
             <q-item>
               <q-item-section>
                 <q-item-label caption>Title</q-item-label>
                 <q-item-label class="text-weight-bold">{{ form.title }}</q-item-label>
               </q-item-section>
             </q-item>

             <q-item>
                <q-item-section>
                  <q-item-label caption>Type</q-item-label>
                  <q-item-label class="text-capitalize">{{ form.type }}</q-item-label>
                </q-item-section>
             </q-item>

             <q-item>
                <q-item-section>
                  <q-item-label caption>Attachment</q-item-label>
                  <q-item-label v-if="fileToUpload" class="text-green-7 row items-center">
                    <q-icon name="attach_file" size="sm" /> {{ fileToUpload.name }}
                  </q-item-label>
                  <q-item-label v-else class="text-grey-5">No attachment</q-item-label>
                </q-item-section>
             </q-item>
           </q-list>
        </div>
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation class="q-mt-lg row justify-end q-gutter-sm">
          <q-btn v-if="step > 1" flat color="slate-600" @click="$refs.stepper.previous()" label="Back" no-caps class="q-px-lg" />
          <q-btn 
            unelevated 
            color="blue-600" 
            :label="step === 4 ? (isEditing ? 'Update Assignment' : 'Publish Assignment') : 'Continue'" 
            @click="handleNext"
            :loading="submitting"
            no-caps
            class="q-px-xl rounded-borders"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { teacherService } from 'src/services/teacherService'
import { assignmentService } from 'src/services/assignmentService'
import { useAuthStore } from 'src/stores/auth'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const authStore = useAuthStore()

const step = ref(1)
const submitting = ref(false)
const classOptions = ref([])
const fileToUpload = ref(null)

const isEditing = computed(() => !!route.params.id)
const assignmentId = route.params.id

const types = [
    { label: 'Paper / Tute', value: 'paper', icon: 'description' },
    { label: 'Homework', value: 'homework', icon: 'home_work' }
]

const form = ref({
    title: '',
    description: '',
    class: null,
    type: 'paper',
    due_date: '',
    max_score: 100,
    attachment_url: ''
})

async function fetchClasses() {
    if (!authStore.profile?.id) return
    try {
        const classes = await teacherService.getMyClasses(authStore.profile.id)
        classOptions.value = classes.map(c => ({
            label: `${c.subject?.name} - Grade ${c.grade}`,
            id: c.id,
            grade: c.grade,
            student_count: c.student_count
        }))
    } catch (e) {
        console.error(e)
        $q.notify({ type: 'negative', message: 'Failed to load classes' })
    }
}

async function fetchAssignmentData() {
    if (!isEditing.value) return
    
    try {
        const data = await assignmentService.getById(assignmentId)
        form.value = {
            title: data.title,
            description: data.description,
            class: data.class_id,
            type: data.type,
            due_date: data.due_date ? data.due_date.slice(0, 16) : '', // Format for datetime-local
            max_score: data.max_score,
            attachment_url: data.attachment_url
        }
        // In edit mode, we can default to step 2 or 4 to preview, but step 1 is fine to verify class
    } catch (e) {
        console.error(e)
        $q.notify({ type: 'negative', message: 'Failed to load assignment details' })
    }
}

function getClassName(id) {
    const cls = classOptions.value.find(c => c.id === id)
    return cls ? cls.label : 'Unknown'
}

async function handleNext() {
    if (step.value === 1) {
        if (!form.value.class) return $q.notify({ type: 'warning', message: 'Please select a class' })
        step.value = 2
    } else if (step.value === 2) {
        if (!form.value.title || !form.value.due_date) return $q.notify({ type: 'warning', message: 'Please fill required fields' })
        step.value = 3
    } else if (step.value === 3) {
        step.value = 4
    } else if (step.value === 4) {
        await saveAssignment()
    }
}

async function saveAssignment() {
    submitting.value = true
    try {
        // 1. Upload file if new file selected
        if (fileToUpload.value) {
            form.value.attachment_url = await assignmentService.uploadFile(fileToUpload.value)
        }

        // 2. Prepare payload
        const payload = {
            title: form.value.title,
            description: form.value.description,
            class_id: form.value.class,
            type: form.value.type,
            due_date: new Date(form.value.due_date).toISOString(),
            max_score: form.value.max_score,
            attachment_url: form.value.attachment_url,
            // Only add teacher_id on creation
            ...(isEditing.value ? {} : { teacher_id: authStore.profile.id })
        }

        // 3. Save or Update
        if (isEditing.value) {
            await assignmentService.update(assignmentId, payload)
            $q.notify({ type: 'positive', message: 'Assignment updated successfully!' })
        } else {
            await assignmentService.create(payload)
            $q.notify({ type: 'positive', message: 'Assignment published successfully!' })
        }

        router.push('/teacher/assignments')
    } catch (e) {
        console.error(e)
        $q.notify({ type: 'negative', message: 'Failed to save assignment' })
    } finally {
        submitting.value = false
    }
}

onMounted(async () => {
    await fetchClasses()
    if (isEditing.value) {
        await fetchAssignmentData()
    }
})
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.rounded-xl { border-radius: 16px; }
.rounded-borders { border-radius: 8px; }
.border-blue { border: 2px solid #2563EB; }
.border-dashed { border: 2px dashed #CBD5E1; }
.bg-slate-50 { background-color: #F8FAFC; }
.transition-all { transition: all 0.3s ease; }
</style>
