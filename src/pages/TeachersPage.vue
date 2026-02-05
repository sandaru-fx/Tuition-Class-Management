<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-mb-xl">
        <div>
            <h1 class="text-h4 text-weight-bold text-dark q-mb-xs font-outfit">Teacher Management</h1>
            <p class="text-grey-7 q-mb-none text-subtitle1">Manage teacher profiles and specializations.</p>
        </div>
        <q-space />
        <q-btn unelevated color="black" icon="add" label="Add Teacher" no-caps @click="openDialog()" />
    </div>

    <!-- Teacher Grid -->
    <div v-if="loading" class="row justify-center q-py-lg">
        <q-spinner color="primary" size="3em" />
    </div>
    
    <div v-else class="row q-col-gutter-md">
        <div class="col-12 col-md-6 col-lg-4" v-for="teacher in teachers" :key="teacher.id">
            <q-card class="shadow-1 rounded-borders-lg hover-lift">
                <q-card-section class="row items-start no-wrap">
                    <q-avatar size="56px" color="blue-1" text-color="blue-8" class="q-mr-md font-outfit text-weight-bold">
                        {{ teacher.full_name?.charAt(0) }}
                    </q-avatar>
                    <div>
                        <div class="text-h6 text-weight-bold line-clamp-1">{{ teacher.full_name }}</div>
                        <div class="text-caption text-grey-7">
                            <q-icon name="phone" size="xs"/> {{ teacher.phone || 'No phone' }}
                        </div>
                        <div class="q-mt-sm">
                            <q-badge v-for="sub in teacher.subject_specialization" :key="sub" color="purple-1" text-color="purple-9" class="q-mr-xs">
                                {{ sub }}
                            </q-badge>
                        </div>
                    </div>
                </q-card-section>
                
                <q-separator />
                
                <q-card-actions align="right">
                    <q-btn flat round color="grey-7" icon="edit" @click="openDialog(teacher)" />
                    <q-btn flat round color="red-4" icon="delete" @click="confirmDelete(teacher)" />
                </q-card-actions>
            </q-card>
        </div>
        
        <!-- Empty State -->
        <div v-if="teachers.length === 0" class="col-12 text-center text-grey-5 q-py-xl">
             <q-icon name="person_off" size="4rem" />
             <div class="text-h6 q-mt-md">No teachers found</div>
        </div>
    </div>

    <!-- Dialog -->
    <q-dialog v-model="showDialog" persistent>
        <q-card style="min-width: 500px" class="rounded-borders-lg">
            <q-card-section>
                <div class="text-h6 font-outfit">{{ isEdit ? 'Edit Teacher' : 'Add New Teacher' }}</div>
            </q-card-section>

            <q-card-section class="q-pt-none q-gutter-y-md">
                <q-input outlined v-model="form.full_name" label="Full Name *" :rules="[val => !!val || 'Required']" />
                
                <div class="row q-col-gutter-md">
                    <div class="col-6">
                         <q-input outlined v-model="form.phone" label="Phone Number" />
                    </div>
                    <div class="col-6">
                        <q-input outlined v-model="form.email" label="Email Address" />
                    </div>
                </div>

                <q-select 
                    outlined 
                    v-model="form.subject_specialization" 
                    label="Specializations" 
                    use-input
                    use-chips
                    multiple
                    hide-dropdown-icon
                    input-debounce="0"
                    new-value-mode="add-unique"
                    hint="Type and press Enter to add subjects"
                />
                
                <q-input outlined v-model="form.bio" label="Bio / Notes" type="textarea" rows="2" />
            </q-card-section>

            <q-card-actions align="right" class="q-pa-md">
                <q-btn flat label="Cancel" color="grey" v-close-popup no-caps />
                <q-btn unelevated :label="isEdit ? 'Update' : 'Create'" color="primary" @click="saveTeacher" :loading="submitting" no-caps />
            </q-card-actions>
        </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { teacherService } from 'src/services/teacherService'

const $q = useQuasar()
const teachers = ref([])
const loading = ref(false)
const submitting = ref(false)
const showDialog = ref(false)
const isEdit = ref(false)

const form = ref({
    id: null,
    full_name: '',
    phone: '',
    email: '',
    subject_specialization: [],
    bio: ''
})

async function fetchTeachers() {
    loading.value = true
    try {
        teachers.value = await teacherService.getAll()
    } catch (e) {
        console.error(e)
        $q.notify({ type: 'negative', message: 'Failed to load teachers' })
    } finally {
        loading.value = false
    }
}

function openDialog(teacher = null) {
    if (teacher) {
        isEdit.value = true
        form.value = { ...teacher }
         // Handle null array
        if (!form.value.subject_specialization) form.value.subject_specialization = []
    } else {
        isEdit.value = false
        form.value = { id: null, full_name: '', phone: '', email: '', subject_specialization: [], bio: '' }
    }
    showDialog.value = true
}

async function saveTeacher() {
    submitting.value = true
    try {
        if (isEdit.value) {
            await teacherService.update(form.value.id, {
                full_name: form.value.full_name,
                phone: form.value.phone,
                email: form.value.email,
                subject_specialization: form.value.subject_specialization,
                bio: form.value.bio
            })
        } else {
            await teacherService.create({
                full_name: form.value.full_name,
                phone: form.value.phone,
                email: form.value.email,
                subject_specialization: form.value.subject_specialization,
                bio: form.value.bio
            })
        }
        $q.notify({ type: 'positive', message: 'Teacher saved successfully' })
        showDialog.value = false
        fetchTeachers()
    } catch (e) {
        console.error(e)
        $q.notify({ type: 'negative', message: 'Error saving teacher' })
    } finally {
        submitting.value = false
    }
}

function confirmDelete(teacher) {
    if (!confirm(`Delete ${teacher.full_name}?`)) return
    
    teacherService.delete(teacher.id)
        .then(() => {
            $q.notify({ type: 'positive', message: 'Deleted' })
            fetchTeachers()
        })
        .catch(() => $q.notify({ type: 'negative', message: 'Failed to delete' }))
}

onMounted(() => {
    fetchTeachers()
})
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.rounded-borders-lg { border-radius: 12px; }
.hover-lift { transition: transform 0.2s; }
.hover-lift:hover { transform: translateY(-4px); box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
.line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
</style>
