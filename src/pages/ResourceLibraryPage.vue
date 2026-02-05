<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold text-dark q-mb-xs font-outfit">Resource Library</h1>
        <p class="text-grey-7 q-mb-none text-subtitle1">Manage study materials, PDFs, and links for students.</p>
      </div>
      <q-space />
      <q-btn unelevated color="black" text-color="white" label="Add Resource" icon="add" no-caps @click="openAddDialog" />
    </div>

    <!-- Filters -->
    <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12 col-sm-3">
             <q-select 
                outlined 
                v-model="filterGrade" 
                :options="['all', ...gradeOptions]" 
                label="Filter by Grade" 
                dense 
                emit-value
                map-options
            />
        </div>
        <div class="col-12 col-sm-6">
            <q-input outlined v-model="search" placeholder="Search resources..." dense>
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
            </q-input>
        </div>
    </div>

    <!-- Resource Grid -->
    <div class="row q-col-gutter-lg">
        <div v-if="loading" class="col-12 text-center q-pa-xl">
            <q-spinner color="primary" size="3rem" />
        </div>
        <div v-else-if="filteredResources.length === 0" class="col-12 text-center q-pa-xl text-grey-5">
            <q-icon name="folder_open" size="4rem" />
            <div class="text-h6 q-mt-md">No resources found</div>
        </div>
        <div v-for="res in filteredResources" :key="res.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
            <q-card class="resource-card shadow-1 hover-lift transition-all">
                <q-card-section class="q-pa-md">
                    <div class="row no-wrap items-center q-mb-sm">
                        <q-icon 
                            :name="getFileIcon(res.file_type)" 
                            :color="getFileColor(res.file_type)" 
                            size="md" 
                            class="q-mr-sm" 
                        />
                        <div class="column overflow-hidden">
                            <div class="text-weight-bold text-subtitle1 ellipsis">{{ res.title }}</div>
                            <div class="text-caption text-grey-7">{{ res.subject?.name || 'General' }} • Grade {{ res.grade }}</div>
                        </div>
                    </div>
                </q-card-section>

                <q-separator />

                <q-card-section class="q-pa-sm text-center">
                    <q-btn flat dense color="primary" label="View" icon="visibility" @click="viewResource(res)" class="q-mr-sm" />
                    <q-btn flat dense color="grey-7" label="Edit" icon="edit" @click="openEditDialog(res)" class="q-mr-sm" />
                    <q-btn flat dense color="red-4" icon="delete" @click="confirmDelete(res)" />
                </q-card-section>
            </q-card>
        </div>
    </div>

    <!-- Add/Edit Dialog -->
    <q-dialog v-model="showDialog">
        <q-card style="min-width: 450px" class="q-pa-md rounded-borders-lg">
            <q-card-section>
                <div class="text-h6 font-outfit">{{ isEditing ? 'Edit Resource' : 'Add New Resource' }}</div>
            </q-card-section>

            <q-form @submit="saveResource" class="q-gutter-md">
                <q-input outlined v-model="form.title" label="Title *" dense :rules="[val => !!val || 'Required']" />
                
                <div class="row q-col-gutter-sm">
                     <div class="col-6">
                        <q-select outlined v-model="form.grade" :options="gradeOptions" label="Grade *" dense :rules="[val => !!val || 'Required']" />
                     </div>
                     <div class="col-6">
                        <q-select 
                            outlined 
                            v-model="form.subject_id" 
                            :options="subjects" 
                            option-label="name"
                            option-value="id"
                            emit-value
                            map-options
                            label="Subject" 
                            dense 
                        />
                     </div>
                </div>

                <div class="row q-col-gutter-sm">
                     <div class="col-6">
                        <q-select 
                            outlined 
                            v-model="form.file_type" 
                            :options="['pdf', 'video', 'link', 'other']" 
                            label="Type *" 
                            dense 
                            :rules="[val => !!val || 'Required']" 
                        />
                     </div>
                     <div class="col-6">
                         <q-input outlined v-model="form.file_url" label="URL (or upload below)" dense />
                     </div>
                </div>

                <q-file outlined v-model="fileToUpload" label="Upload File" dense v-if="!isEditing">
                    <template v-slot:append>
                        <q-icon name="attach_file" />
                    </template>
                </q-file>

                <div class="row justify-end q-mt-lg">
                    <q-btn flat label="Cancel" color="grey-7" v-close-popup no-caps class="q-mr-sm" />
                    <q-btn unelevated :label="isEditing ? 'Update' : 'Add'" color="black" type="submit" :loading="submitting" no-caps />
                </div>
            </q-form>
        </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { supabase } from 'boot/supabase'
import { resourceService } from 'src/services/resourceService'

const $q = useQuasar()
const resources = ref([])
const subjects = ref([])
const loading = ref(false)
const filterGrade = ref('all')
const search = ref('')

const showDialog = ref(false)
const isEditing = ref(false)
const submitting = ref(false)
const fileToUpload = ref(null)

const gradeOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']

const form = ref({
    id: null,
    title: '',
    grade: '',
    subject_id: null,
    file_url: '',
    file_type: 'pdf',
    description: ''
})

const filteredResources = computed(() => {
    let result = resources.value
    if (filterGrade.value !== 'all') {
        result = result.filter(r => r.grade === filterGrade.value)
    }
    if (search.value) {
        const q = search.value.toLowerCase()
        result = result.filter(r => r.title.toLowerCase().includes(q))
    }
    return result
})

async function fetchResources() {
    loading.value = true
    try {
        resources.value = await resourceService.getAll()
        const { data } = await supabase.from('subjects').select('*').order('name')
        subjects.value = data || []
    } catch (e) { 
        console.error(e) 
        $q.notify({ type: 'negative', message: 'Failed to fetch resources' })
    }
    finally { loading.value = false }
}

function openAddDialog() {
    isEditing.value = false
    form.value = { id: null, title: '', grade: '', subject_id: null, file_url: '', file_type: 'pdf', description: '' }
    fileToUpload.value = null
    showDialog.value = true
}

function openEditDialog(res) {
    isEditing.value = true
    form.value = { ...res }
    showDialog.value = true
}

async function saveResource() {
    submitting.value = true
    try {
        if (fileToUpload.value) {
            form.value.file_url = await resourceService.uploadFile(fileToUpload.value)
        }
        
        if (isEditing.value) {
            // Update logic here
        } else {
            await resourceService.create(form.value)
        }
        
        $q.notify({ type: 'positive', message: 'Resource saved successfully' })
        showDialog.value = false
        fetchResources()
    } catch (e) {
        console.error(e)
        $q.notify({ type: 'negative', message: 'Error saving resource: ' + e.message })
    } finally { submitting.value = false }
}

async function confirmDelete(res) {
    if (confirm(`Delete ${res.title}?`)) {
        try {
            await resourceService.delete(res.id)
            $q.notify({ type: 'positive', message: 'Resource deleted' })
            fetchResources()
        } catch (e) { console.error(e) }
    }
}

function viewResource(res) {
    if (res.file_url) window.open(res.file_url, '_blank')
}

function getFileIcon(type) {
    switch (type) {
        case 'pdf': return 'picture_as_pdf'
        case 'video': return 'play_circle'
        case 'link': return 'link'
        default: return 'insert_drive_file'
    }
}

function getFileColor(type) {
    switch (type) {
        case 'pdf': return 'red'
        case 'video': return 'blue'
        case 'link': return 'green'
        default: return 'grey-7'
    }
}

onMounted(fetchResources)
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.rounded-borders-lg { border-radius: 12px; }
.resource-card { border-radius: 12px; transition: all 0.3s ease; }
.hover-lift:hover { transform: translateY(-4px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
</style>
