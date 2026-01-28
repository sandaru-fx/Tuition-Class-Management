<template>
  <q-page class="q-pa-lg bg-slate-50">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold text-slate-800 font-outfit">My Classes</div>
        <div class="text-subtitle1 text-slate-500">Manage your ongoing classes and schedules</div>
      </div>
      <q-btn unelevated color="blue-600" icon="add" label="Create Course" no-caps class="rounded-borders" @click="openCreateDialog" />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="row justify-center q-pa-xl">
        <q-spinner color="primary" size="3em" />
    </div>

    <!-- Empty State -->
    <div v-else-if="classes.length === 0" class="text-center text-grey q-pa-xl">
        <q-icon name="class" size="4rem" />
        <div class="text-h6 q-mt-md">You haven't created any courses yet.</div>
    </div>

    <!-- Classes Grid -->
    <div v-else class="row q-col-gutter-lg">
       <div v-for="cls in classes" :key="cls.id" class="col-12 col-md-6 col-lg-4">
          <q-card class="bg-white shadow-sm rounded-xl hover-lift cursor-pointer transition-all border-bottom-blue">
             <q-card-section>
                <div class="row justify-between items-start">
                   <div>
                      <q-badge color="blue-1" text-color="blue-8" :label="'Semester ' + (cls.price > 400 ? '1' : '2')" class="q-mb-sm font-weight-bold" />
                      <div class="text-h6 text-weight-bold text-slate-800">{{ cls.title }}</div>
                      <div class="text-caption text-slate-500 q-mt-xs flex items-center">
                         <q-icon name="payments" class="q-mr-xs" size="14px"/>
                         ${{ cls.price }} Fee
                      </div>
                   </div>
                   <q-avatar size="40px" font-size="20px" color="blue-50" text-color="blue-600" icon="school" rounded />
                </div>
             </q-card-section>

             <q-separator color="grey-2" />

             <q-card-actions align="between" class="q-px-md q-py-md bg-grey-1-light">
                <div class="text-caption text-slate-600">
                   <q-icon name="groups" class="q-mr-xs" />
                   <strong>{{ cls.enrollments?.count || 0 }}</strong> Students
                </div>
                <div class="text-caption text-slate-600">
                    <q-btn flat dense size="sm" icon="edit" color="grey-7" @click.stop="editCourse(cls)" />
                </div>
             </q-card-actions>
          </q-card>
       </div>
    </div>

    <!-- Create/Edit Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ isEdit ? 'Edit Course' : 'New Course' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input density="compact" v-model="form.title" label="Course Title" autofocus />
          <q-input density="compact" v-model="form.description" label="Description" type="textarea" />
          <q-input density="compact" v-model="form.price" label="Price ($)" type="number" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Save" @click="saveCourse" />
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
const classes = ref([])
const loading = ref(false)
const showDialog = ref(false)
const isEdit = ref(false)
const editingId = ref(null)

const form = reactive({
    title: '',
    description: '',
    price: 0
})

function openCreateDialog() {
    isEdit.value = false
    form.title = ''
    form.description = ''
    form.price = 0
    showDialog.value = true
}

function editCourse(course) {
    isEdit.value = true
    editingId.value = course.id
    form.title = course.title
    form.description = course.description
    form.price = course.price
    showDialog.value = true
}

async function fetchMyClasses() {
    loading.value = true
    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('courses')
            .select('*, enrollments(count)')
            .eq('teacher_id', user.id)

        if (error) throw error
        classes.value = data
    } catch (error) {
        console.error(error)
        $q.notify({ type: 'negative', message: 'Failed to load classes' })
    } finally {
        loading.value = false
    }
}

async function saveCourse() {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
             $q.notify({ type: 'negative', message: 'You must be logged in' })
             return
        }

        const payload = {
            title: form.title,
            description: form.description,
            price: form.price,
            teacher_id: user.id
        }

        let error
        if (isEdit.value) {
            const res = await supabase.from('courses').update(payload).eq('id', editingId.value)
            error = res.error
        } else {
             const res = await supabase.from('courses').insert(payload)
             error = res.error
        }

        if (error) throw error

        $q.notify({ type: 'positive', message: 'Course saved successfully' })
        showDialog.value = false
        fetchMyClasses()

    } catch (err) {
        console.error(err)
        $q.notify({ type: 'negative', message: 'Failed to save course' })
    }
}

onMounted(() => {
    fetchMyClasses()
})
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.rounded-xl { border-radius: 16px; }
.rounded-borders { border-radius: 8px; }
.border-bottom-blue { border-bottom: 3px solid #2563EB; }
.bg-grey-1-light { background-color: #F8FAFC; }

.hover-lift:hover { 
    transform: translateY(-5px); 
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
.transition-all { transition: all 0.3s ease; }
</style>
