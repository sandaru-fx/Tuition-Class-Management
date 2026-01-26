<template>
  <q-page class="q-pa-lg">
    <!-- Header -->
    <div class="row items-center q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold text-dark q-mb-xs font-outfit">
          Student Management
          <q-badge color="grey-3" text-color="grey-7" label="v2.1" class="q-ml-sm" />
        </h1>
        <p class="text-grey-7 q-mb-none text-subtitle1">Manage student enrollments, profiles, and status.</p>
      </div>
      <q-space />
      <q-btn unelevated color="black" text-color="white" label="Register Student" icon="add" no-caps @click="openAddDialog" />
    </div>

    <!-- Students Table -->
    <q-card class="my-card shadow-1 rounded-borders-lg overflow-hidden">
      <q-card-section class="q-pa-md bg-grey-1 row items-center">
        <q-input dense outlined bg-color="white" v-model="search" placeholder="Search students..." class="col-12 col-sm-4" debounce="300">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-space />
        <q-btn flat round color="grey-7" icon="refresh" @click="fetchStudents" :loading="loading" />
      </q-card-section>

      <q-markup-table flat class="text-left">
        <thead>
          <tr class="bg-grey-1">
            <th class="text-left text-grey-7 text-weight-bold q-pl-lg">Student Name</th>
            <th class="text-left text-grey-7 text-weight-bold">Grade</th>
            <th class="text-left text-grey-7 text-weight-bold">School</th>
            <th class="text-left text-grey-7 text-weight-bold">Mobile</th>
            <th class="text-left text-grey-7 text-weight-bold">Status</th>
            <th class="text-right text-grey-7 text-weight-bold q-pr-lg">Actions</th>
          </tr>
        </thead>
        <tbody v-if="loading">
             <tr>
                <td colspan="6" class="text-center q-pa-lg">
                    <q-spinner color="primary" size="3em" />
                    <div class="text-grey q-mt-sm">Loading students...</div>
                </td>
             </tr>
        </tbody>
        <tbody v-else>
          <tr v-if="filteredStudents.length === 0">
            <td colspan="6" class="text-center q-pa-xl text-grey-6">
              <q-icon name="school" size="48px" class="q-mb-md" />
              <div>No students found. Add one to get started!</div>
            </td>
          </tr>
          <tr v-for="student in filteredStudents" :key="student.id" class="hover-bg-grey-1 transition-all">
            <td class="q-pl-lg">
              <div class="row items-center">
                <q-avatar size="36px" color="blue-1" text-color="blue-8" class="q-mr-md text-weight-bold">
                  {{ (student.first_name || student.full_name || '?').charAt(0) }}
                </q-avatar>
                <div class="column">
                  <span class="text-weight-bold text-dark">{{ student.first_name || student.full_name }} {{ student.last_name || '' }}</span>
                  <span class="text-caption text-grey-6">{{ student.address }}</span>
                </div>
              </div>
            </td>
            <td>
              <q-badge color="purple-1" text-color="purple-9" class="q-px-sm text-weight-bold">
                {{ student.grade || 'N/A' }}
              </q-badge>
            </td>
            <td class="text-grey-8">{{ student.school || '-' }}</td>
             <td class="text-grey-8">
                <div class="column">
                    <span class="text-caption"><q-icon name="smartphone" class="q-mr-xs"/>{{ student.whatsapp_number || 'N/A' }}</span>
                    <span v-if="student.parent_phone" class="text-caption text-grey-6"><q-icon name="phone" class="q-mr-xs"/>{{ student.parent_phone }}</span>
                </div>
            </td>
             <td>
              <q-chip size="sm" :color="student.is_active ? 'green-1' : 'red-1'" :text-color="student.is_active ? 'green-9' : 'red-9'" class="text-weight-bold">
                {{ student.is_active ? 'Active' : 'Inactive' }}
              </q-chip>
            </td>
            <td class="text-right q-pr-lg">
              <q-btn flat round dense color="grey-7" icon="edit" class="q-mr-xs" @click="openEditDialog(student)" />
              <q-btn flat round dense color="red-4" icon="delete" @click="confirmDelete(student)" />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
      
       <q-card-section class="row items-center justify-between bg-grey-1 text-grey-7 text-caption" v-if="!loading">
        <span>Showing {{ filteredStudents.length }} students</span>
      </q-card-section>
    </q-card>

    <!-- Student Dialog (Add / Edit) -->
    <q-dialog v-model="showDialog">
      <q-card style="min-width: 500px" class="q-pa-md rounded-borders-lg">
        <q-card-section>
          <div class="text-h6 font-outfit">{{ isEditing ? 'Edit Student' : 'Register New Student' }}</div>
          <div class="text-caption text-grey-6">Fill in the details below.</div>
        </q-card-section>

        <q-form @submit="saveStudent" class="q-gutter-md q-px-sm">
            <div class="row q-col-gutter-sm">
                <div class="col-6">
                    <q-input outlined v-model="form.first_name" label="First Name *" dense :rules="[val => !!val || 'Required']" />
                </div>
                <div class="col-6">
                     <q-input outlined v-model="form.last_name" label="Last Name *" dense :rules="[val => !!val || 'Required']" />
                </div>
            </div>

            <div class="row q-col-gutter-sm">
                <div class="col-6">
                     <q-input outlined v-model="form.whatsapp_number" label="WhatsApp Number *" dense hint="Format: 07XXXXXXXX" :rules="[val => !!val || 'Required']" />
                </div>
                 <div class="col-6">
                     <q-input outlined v-model="form.parent_phone" label="Parent Phone" dense />
                 </div>
            </div>

             <div class="row q-col-gutter-sm">
                <div class="col-6">
                     <q-input outlined v-model="form.grade" label="Grade/Year *" dense :rules="[val => !!val || 'Required']" />
                </div>
                 <div class="col-6">
                      <q-select outlined v-model="form.gender" :options="['Male', 'Female']" label="Gender" dense />
                 </div>
            </div>

             <q-input outlined v-model="form.school" label="School" dense />
             <q-input outlined v-model="form.address" label="Address" dense type="textarea" rows="2" />
             
             <q-toggle v-model="form.is_active" label="Active Student" />

             <div class="q-mt-md q-pt-md border-top bg-blue-grey-1 q-pa-sm rounded-borders">
                <div class="row items-center justify-between q-pa-xs">
                    <div class="text-subtitle1 text-weight-bolder font-outfit text-primary">
                        <q-icon name="key" class="q-mr-xs" /> Login Access
                    </div>
                    <q-checkbox v-model="form.create_account" label="Enable Student Login" color="primary" />
                </div>

                <div v-show="form.create_account" class="q-mt-sm q-pa-md bg-white rounded-borders shadow-1">
                    <div class="text-caption text-grey-7 q-mb-md">Enter an email and initial password for the student.</div>
                    <div class="q-gutter-y-md">
                        <q-input outlined v-model="form.email" label="Student Email *" dense :rules="[val => !!val || 'Required']" />
                        <q-input outlined v-model="form.password" label="Initial Password *" dense type="password" :rules="[val => !!val || 'Required']" />
                    </div>
                </div>
             </div>

            <div class="row justify-end q-mt-lg">
                 <q-btn flat label="Cancel" color="grey-7" v-close-popup no-caps class="q-mr-sm" />
                 <q-btn unelevated :label="isEditing ? 'Update Student' : 'Register Student'" color="black" type="submit" :loading="submitting" no-caps />
            </div>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteDialog">
      <q-card style="min-width: 350px" class="q-pa-sm rounded-borders-lg">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="red-1" text-color="red" size="md" />
          <span class="q-ml-md text-h6 font-outfit">Confirm Delete</span>
        </q-card-section>

        <q-card-section class="q-pt-none text-grey-8">
          Are you sure you want to delete <strong>{{ studentToDelete?.first_name || studentToDelete?.full_name }}</strong>?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey-7" v-close-popup no-caps />
          <q-btn unelevated label="Delete" color="red" @click="deleteStudent" :loading="deleting" no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { studentService } from 'src/services/studentService'
import { supabase } from 'boot/supabase' // Still needed for RPC account creation until moved to service

const $q = useQuasar()
const search = ref('')
const users = ref([]) // Actually students
const loading = ref(false)
const submitting = ref(false)
const deleting = ref(false)

const showDialog = ref(false)
const showDeleteDialog = ref(false)
const isEditing = ref(false)
const studentToDelete = ref(null)

const form = ref({
  id: null,
  first_name: '',
  last_name: '',
  whatsapp_number: '',
  parent_phone: '',
  school: '',
  grade: '',
  address: '',
  gender: '',
  is_active: true,
  create_account: false,
  email: '',
  password: ''
})

const filteredStudents = computed(() => {
  const query = search.value.toLowerCase()
  if (!query) return users.value
  return users.value.filter(s => 
    s.first_name?.toLowerCase().includes(query) || 
    s.last_name?.toLowerCase().includes(query) || 
    (s.full_name && s.full_name.toLowerCase().includes(query)) ||
    s.whatsapp_number?.includes(query)
  )
})

async function fetchStudents() {
  loading.value = true
  try {
    users.value = await studentService.getAll()
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Failed to load students: ' + error.message })
  } finally {
    loading.value = false
  }
}

function openAddDialog() {
  isEditing.value = false
  form.value = {
    id: null,
    first_name: '',
    last_name: '',
    whatsapp_number: '',
    parent_phone: '',
    school: '',
    grade: '',
    address: '',
    gender: '',
    is_active: true,
    create_account: false,
    email: '',
    password: ''
  }
  showDialog.value = true
}

function openEditDialog(student) {
  isEditing.value = true
  form.value = { ...student }
  showDialog.value = true
}

async function saveStudent() {
  submitting.value = true
  try {
    const studentData = { ...form.value }
    delete studentData.id 
    delete studentData.create_account
    delete studentData.email
    delete studentData.password
    
    // Maintain compatibility with old full_name column
    studentData.full_name = `${studentData.first_name} ${studentData.last_name}`.trim()
    
    let studentId = form.value.id

    if (isEditing.value) {
      await studentService.update(form.value.id, studentData)
      $q.notify({ type: 'positive', message: 'Student updated successfully' })
    } else {
      // 1. Create Student Record
      const data = await studentService.create(studentData)
      studentId = data.id
      $q.notify({ type: 'positive', message: 'Student registered successfully' })

      // 2. Create Login Account (If checked)
      if (form.value.create_account) {
          const { error: rpcError } = await supabase.rpc('create_student_user', {
              student_email: form.value.email,
              student_password: form.value.password,
              student_first_name: form.value.first_name,
              student_db_id: studentId
          })
          
          if (rpcError) {
              console.error('RPC Error:', rpcError)
              $q.notify({ type: 'warning', message: 'Student created, but Login creation failed: ' + rpcError.message })
          } else {
              $q.notify({ type: 'positive', message: 'Login account created successfully!' })
          }
      }
    }
    
    await fetchStudents()
    showDialog.value = false
  } catch (error) {
    console.error('Final Save Error:', error)
    $q.notify({ 
        type: 'negative', 
        message: 'Error saving student: ' + (error.message || 'Unknown error'),
        caption: error.details || ''
    })
  } finally {
    submitting.value = false
  }
}

function confirmDelete(student) {
  studentToDelete.value = student
  showDeleteDialog.value = true
}

async function deleteStudent() {
  if (!studentToDelete.value) return
  deleting.value = true
  try {
    await studentService.delete(studentToDelete.value.id)
    $q.notify({ type: 'positive', message: 'Student deleted' })
    await fetchStudents()
    showDeleteDialog.value = false
  } catch (error) {
     console.error(error)
    $q.notify({ type: 'negative', message: 'Error deleting student' })
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchStudents()
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
.hover-bg-grey-1:hover {
  background-color: #fafafa;
}
.transition-all {
  transition: all 0.3s ease;
}
.border-top {
  border-top: 1px solid rgba(0,0,0,0.1);
}
</style>
