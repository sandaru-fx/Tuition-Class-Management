<template>
  <q-page class="q-pa-lg bg-slate-50">
     <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold text-slate-800 font-outfit">Assignments</div>
        <div class="text-subtitle1 text-slate-500">Upload materials and set deadlines</div>
      </div>
      <q-btn unelevated color="blue-600" icon="upload" label="Upload Material" no-caps class="rounded-borders" @click="openDialog" />
    </div>

    <!-- Assignments List -->
    <q-list separator class="bg-white rounded-xl shadow-sm border-slate">
        <q-item v-if="assignments.length === 0" class="q-pa-xl text-center block">
             <div class="text-grey-6">No assignments found. create one!</div>
        </q-item>

        <q-item v-for="dummy in assignments" :key="dummy.id" clickable v-ripple>
            <q-item-section avatar>
                <q-avatar color="blue-1" text-color="blue" icon="assignment" />
            </q-item-section>
            <q-item-section>
                <q-item-label class="text-weight-bold">{{ dummy.title }}</q-item-label>
                <q-item-label caption>{{ dummy.course?.title }} • Deadline: {{ new Date(dummy.deadline).toLocaleDateString() }}</q-item-label>
            </q-item-section>
            <q-item-section side>
                <q-btn flat round icon="more_vert" color="grey" />
            </q-item-section>
        </q-item>
    </q-list>

    <!-- Upload Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Create Assignment</div>
        </q-card-section>

        <q-card-section class="q-pt-none q-gutter-md">
           <!-- Course Selector -->
           <q-select 
                v-model="selectedCourse" 
                :options="myCourses" 
                option-label="title"
                label="Select Course" 
                outlined 
                emit-value
                map-options
           />

           <q-input v-model="form.title" label="Title" outlined />
           <q-input v-model="form.instruction" label="Instructions" type="textarea" outlined />
           <q-input v-model="form.deadline" label="Deadline" type="date" outlined />
           <q-input v-model="form.resource_url" label="Resource Link (PDF/Drive)" outlined />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Upload" @click="saveAssignment" :disable="!selectedCourse" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { supabase } from 'boot/supabase'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const assignments = ref([])
const myCourses = ref([])
const showDialog = ref(false)
const selectedCourse = ref(null)

const form = reactive({
    title: '',
    instruction: '',
    deadline: '',
    resource_url: ''
})

function openDialog() {
    form.title = ''
    form.instruction = ''
    form.deadline = ''
    form.resource_url = ''
    selectedCourse.value = null
    showDialog.value = true
}

async function fetchMyCourses() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('courses').select('id, title').eq('teacher_id', user.id)
    myCourses.value = data || []
}

async function fetchAssignments() {
     const { data: { user } } = await supabase.auth.getUser()
     if (!user) return

     // Fetch assignments for courses owned by this teacher
     // Supabase join query to filter by course.teacher_id is complex, doing 2 steps for simplicity
     const { data: courses } = await supabase.from('courses').select('id').eq('teacher_id', user.id)
     const courseIds = courses.map(c => c.id)

     if (courseIds.length > 0) {
        const { data } = await supabase
            .from('assignments')
            .select('*, course:courses(title)')
            .in('course_id', courseIds)
        
        assignments.value = data || []
     }
}

async function saveAssignment() {
    try {
        const payload = {
            course_id: selectedCourse.value.id,
            title: form.title,
            instruction: form.instruction,
            deadline: form.deadline,
            resource_url: form.resource_url
        }

        const { error } = await supabase.from('assignments').insert(payload)
        if (error) throw error

        $q.notify({ type: 'positive', message: 'Assignment Created!' })
        showDialog.value = false
        fetchAssignments()

    } catch (err) {
        console.error(err)
        $q.notify({ type: 'negative', message: 'Failed to create assignment' })
    }
}

onMounted(() => {
    fetchMyCourses()
    fetchAssignments()
})
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.rounded-xl { border-radius: 16px; }
.border-slate { border: 1px solid #e2e8f0; }
</style>
