<template>
  <q-page class="q-pa-lg">
    <!-- Header -->
    <div class="row items-center q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold text-dark q-mb-xs font-outfit">
          Student Management
          <q-badge color="grey-3" text-color="grey-7" label="v2.2" class="q-ml-sm" />
        </h1>
        <p class="text-grey-7 q-mb-none text-subtitle1">Manage student enrollments, profiles, and status.</p>
      </div>
      <q-space />
      <div class="row q-gutter-sm">
           <q-btn-dropdown unelevated color="white" text-color="grey-9" label="Bulk Actions" icon="layers" class="border-grey">
                <q-list>
                    <q-item clickable v-close-popup @click="showPromoteDialog = true">
                    <q-item-section avatar>
                        <q-icon name="keyboard_double_arrow_up" color="purple" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Batch Promote</q-item-label>
                        <q-item-label caption>Move grades up</q-item-label>
                    </q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup @click="showImportDialog = true">
                    <q-item-section avatar>
                        <q-icon name="upload_file" color="green" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Import CSV</q-item-label>
                        <q-item-label caption>Bulk registration</q-item-label>
                    </q-item-section>
                    </q-item>
                </q-list>
            </q-btn-dropdown>
            <q-btn unelevated color="black" text-color="white" label="Register Student" icon="add" no-caps @click="openAddDialog" />
      </div>
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
                Grade {{ student.grade || 'N/A' }}
                <span v-if="student.stream" class="q-ml-xs text-weight-medium">({{ student.stream }})</span>
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
                     <q-select 
                        outlined 
                        v-model="form.grade" 
                        :options="gradeOptions" 
                        label="Grade/Year *" 
                        dense 
                        :rules="[val => !!val || 'Required']" 
                    />
                </div>
                 <div class="col-6">
                      <q-select 
                        v-if="['12', '13'].includes(form.grade)"
                        outlined 
                        v-model="form.stream" 
                        :options="streamOptions" 
                        label="Stream *" 
                        dense 
                        :rules="[val => !!val || 'Required']"
                        class="animate-fade"
                      />
                      <q-select v-else outlined v-model="form.gender" :options="['Male', 'Female']" label="Gender" dense />
                 </div>
            </div>

            <div v-if="['12', '13'].includes(form.grade)" class="row q-col-gutter-sm">
                 <div class="col-12">
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
    <!-- Promote Dialog -->
    <q-dialog v-model="showPromoteDialog">
        <q-card style="min-width: 400px" class="q-pa-md rounded-borders-lg">
             <q-card-section>
                <div class="text-h6 font-outfit text-primary">Batch Promotion</div>
                <div class="text-caption text-grey-6">Move all students from one grade to another.</div>
            </q-card-section>

             <q-card-section class="q-gutter-y-md">
                 <div class="row items-center justify-between">
                     <div class="col-5">
                         <q-select outlined v-model="promoteForm.from" :options="gradeOptions" label="From Grade" dense />
                     </div>
                     <div class="col-2 text-center">
                         <q-icon name="arrow_forward" color="grey" size="sm" />
                     </div>
                      <div class="col-5">
                         <q-select outlined v-model="promoteForm.to" :options="gradeOptions" label="To Grade" dense />
                     </div>
                 </div>
                 <div class="bg-amber-1 q-pa-sm text-caption rounded-borders text-amber-9">
                     <q-icon name="warning" /> This will update all active students in the selected class.
                 </div>
             </q-card-section>

             <q-card-actions align="right">
                 <q-btn flat label="Cancel" color="grey" v-close-popup no-caps />
                 <q-btn unelevated label="Promote Students" color="purple" @click="promoteStudents" :loading="promoting" no-caps />
             </q-card-actions>
        </q-card>
    </q-dialog>

    <!-- Import CSV Dialog -->
    <q-dialog v-model="showImportDialog">
        <q-card style="min-width: 600px" class="q-pa-md rounded-borders-lg">
            <q-card-section>
                <div class="text-h6 font-outfit text-green-8">Import Students</div>
                <div class="text-caption text-grey-6">Upload a CSV with columns: FirstName, LastName, WhatsApp, Grade</div>
            </q-card-section>

            <q-card-section>
                 <q-file outlined v-model="csvFile" label="Select CSV File" accept=".csv" @update:model-value="handleFile">
                    <template v-slot:prepend>
                        <q-icon name="attach_file" />
                    </template>
                 </q-file>

                 <div v-if="previewData.length > 0" class="q-mt-md">
                     <div class="text-subtitle2 q-mb-xs">Preview ({{ previewData.length }} students)</div>
                     <q-scroll-area style="height: 200px;" class="border-grey rounded-borders">
                         <q-markup-table dense flat separator="cell">
                             <thead>
                                 <tr>
                                     <th>First Name</th>
                                     <th>Last Name</th>
                                     <th>Grade</th>
                                 </tr>
                             </thead>
                             <tbody>
                                 <tr v-for="(row, i) in previewData" :key="i">
                                     <td>{{ row.first_name }}</td>
                                     <td>{{ row.last_name }}</td>
                                     <td>{{ row.grade }}</td>
                                 </tr>
                             </tbody>
                         </q-markup-table>
                     </q-scroll-area>
                 </div>
            </q-card-section>

             <q-card-actions align="right">
                 <q-btn flat label="Cancel" color="grey" v-close-popup no-caps />
                 <q-btn unelevated label="Start Import" color="green-7" @click="importStudents" :loading="importing" :disable="previewData.length === 0" no-caps />
             </q-card-actions>
        </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { studentService } from 'src/services/studentService'
import { supabase } from 'boot/supabase'
import { useAppStore } from 'src/stores/app'
import { storeToRefs } from 'pinia'

const $q = useQuasar()
const appStore = useAppStore()
const { selectedGrade } = storeToRefs(appStore)

const search = ref('')
const users = ref([]) 
const loading = ref(false)
const submitting = ref(false)
const deleting = ref(false)

const showDialog = ref(false)
const showDeleteDialog = ref(false)
const isEditing = ref(false)
const studentToDelete = ref(null)

// Bulk Action States
const showPromoteDialog = ref(false)
const showImportDialog = ref(false)
const promoteForm = ref({ from: '', to: '' })
const promoting = ref(false)
const importing = ref(false)
const csvFile = ref(null)
const previewData = ref([])

const gradeOptions = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'
]

const streamOptions = [
  'Science', 'Commerce', 'Arts', 'Technology'
]

const form = ref({
  id: null,
  first_name: '',
  last_name: '',
  whatsapp_number: '',
  parent_phone: '',
  school: '',
  grade: '',
  stream: '',
  address: '',
  gender: '',
  is_active: true,
  create_account: false,
  email: '',
  password: ''
})

const filteredStudents = computed(() => {
  let result = users.value

  if (search.value) {
    const query = search.value.toLowerCase()
    result = result.filter(s => 
      s.first_name?.toLowerCase().includes(query) || 
      s.last_name?.toLowerCase().includes(query) || 
      (s.full_name && s.full_name.toLowerCase().includes(query)) ||
      s.whatsapp_number?.includes(query)
    )
  }

  if (selectedGrade.value && selectedGrade.value !== 'all') {
    const grade = selectedGrade.value
    if (grade === 'primary') {
      result = result.filter(s => ['1', '2', '3', '4', '5'].includes(s.grade))
    } else if (grade === 'junior') {
      result = result.filter(s => ['6', '7', '8', '9'].includes(s.grade))
    } else if (grade === 'ol') {
      result = result.filter(s => ['10', '11'].includes(s.grade))
    } else if (grade === 'al') {
      result = result.filter(s => ['12', '13'].includes(s.grade))
    } else if (grade.startsWith('al_')) {
      result = result.filter(s => ['12', '13'].includes(s.grade))
    } else {
      result = result.filter(s => s.grade === grade)
    }
  }

  return result
})

async function fetchStudents() {
  loading.value = true
  try {
    users.value = await studentService.getAll()
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Failed to load students' })
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
    
    studentData.full_name = `${studentData.first_name} ${studentData.last_name}`.trim()
    
    let studentId = form.value.id

    if (isEditing.value) {
      await studentService.update(form.value.id, studentData)
      $q.notify({ type: 'positive', message: 'Student updated' })
    } else {
      const data = await studentService.create(studentData)
      studentId = data.id
      $q.notify({ type: 'positive', message: 'Student registered' })

      if (form.value.create_account) {
          const { error: rpcError } = await supabase.rpc('create_student_user', {
              student_email: form.value.email,
              student_password: form.value.password,
              student_first_name: form.value.first_name,
              student_db_id: studentId
          })
          
          if (rpcError) {
              console.error('RPC Error:', rpcError)
              $q.notify({ type: 'warning', message: 'Login creation failed' })
          } else {
              $q.notify({ type: 'positive', message: 'Login account created!' })
          }
      }
    }
    
    await fetchStudents()
    showDialog.value = false
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Error saving student' })
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

// Bulk Promote Logic
async function promoteStudents() {
    if (promoteForm.value.from === promoteForm.value.to) {
        $q.notify({ type: 'warning', message: 'Grades must be different' })
        return
    }
    promoting.value = true
    try {
        const count = await studentService.promoteStudents(promoteForm.value.from, promoteForm.value.to)
        $q.notify({ type: 'positive', message: `Promoted ${count} students successfully!` })
        await fetchStudents()
        showPromoteDialog.value = false
    } catch (e) {
        console.error(e)
        $q.notify({ type: 'negative', message: 'Promotion failed' })
    } finally {
        promoting.value = false
    }
}

// CSV Logic
function parseCSV(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            const text = e.target.result
            const lines = text.split('\n')
            lines[0].split(',').map(h => h.trim().toLowerCase()) // Parse headers (unused currently)
            const result = []
            
            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue
                const currentline = lines[i].split(',')
                const obj = {}
                
                // Simple mapping: 0: first_name, 1: last_name, 2: whatsapp, 3: grade
                // In production, match headers dynamically
                if (currentline.length >= 3) {
                    obj.first_name = currentline[0]?.trim()
                    obj.last_name = currentline[1]?.trim()
                    obj.whatsapp_number = currentline[2]?.trim()
                    obj.grade = currentline[3]?.trim() || '1' // default
                    obj.full_name = `${obj.first_name} ${obj.last_name}`
                    obj.is_active = true
                    result.push(obj)
                }
            }
            resolve(result)
        }
        reader.onerror = reject
        reader.readAsText(file)
    })
}

async function handleFile(file) {
    if (!file) return
    try {
        const data = await parseCSV(file)
        previewData.value = data
    } catch (error) {
        console.error(error)
        $q.notify({ type: 'negative', message: 'Error parsing CSV' })
    }
}

async function importStudents() {
    importing.value = true
    try {
        await studentService.bulkCreate(previewData.value)
         $q.notify({ type: 'positive', message: `Imported ${previewData.value.length} students` })
         await fetchStudents()
         showImportDialog.value = false
         previewData.value = []
         csvFile.value = null
    } catch (e) {
        console.error(e)
        $q.notify({ type: 'negative', message: 'Import failed' })
    } finally {
        importing.value = false
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
