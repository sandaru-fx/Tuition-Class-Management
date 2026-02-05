<template>
  <q-page class="q-pa-lg bg-slate-50">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold text-slate-800 font-outfit">Resource Library</div>
        <div class="text-subtitle1 text-slate-500">Upload and manage study materials</div>
      </div>
      <q-btn 
        unelevated 
        color="blue-600" 
        icon="cloud_upload" 
        label="Upload Resource" 
        no-caps
        @click="showUploadDialog = true"
      />
    </div>

    <!-- Filters -->
    <q-card class="shadow-sm rounded-xl q-mb-lg">
      <q-card-section class="q-pa-md">
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-md-4">
            <q-input outlined dense v-model="search" placeholder="Search resources..." clearable>
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-3">
            <q-select
              outlined
              dense
              v-model="filterCategory"
              :options="['All', 'Notes', 'Past Papers', 'Worksheets', 'Other']"
              label="Category"
            />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              outlined
              dense
              v-model="filterClass"
              :options="classOptions"
              option-label="label"
              option-value="id"
              emit-value
              map-options
              label="Class"
              clearable
            />
          </div>
          <div class="col-12 col-md-2">
            <q-btn outline color="blue-600" icon="refresh" label="Refresh" no-caps @click="fetchResources" class="full-width" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Loading -->
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner color="blue-600" size="3em" />
    </div>

    <!-- Resources Grid -->
    <div v-else-if="filteredResources.length > 0" class="row q-col-gutter-md">
      <div v-for="resource in filteredResources" :key="resource.id" class="col-12 col-md-6 col-lg-4">
        <q-card class="shadow-sm rounded-xl full-height column">
          <q-card-section class="col q-pa-md">
            <div class="row items-start justify-between q-mb-sm">
              <q-icon :name="getFileIcon(resource.file_type)" size="32px" :color="getFileColor(resource.file_type)" />
              <q-chip 
                size="sm" 
                :color="getCategoryColor(resource.category)" 
                :text-color="getCategoryTextColor(resource.category)"
              >
                {{ resource.category }}
              </q-chip>
            </div>

            <div class="text-h6 text-weight-bold text-slate-800 q-mb-xs ellipsis-2-lines">
              {{ resource.title }}
            </div>
            
            <div v-if="resource.description" class="text-caption text-grey-7 q-mb-sm ellipsis-2-lines">
              {{ resource.description }}
            </div>
            
            <div class="text-caption text-slate-500">
              {{ resource.classes?.subject?.name || 'General' }} 
              <span v-if="resource.classes">- Grade {{ resource.classes.grade }}</span>
            </div>

            <q-separator class="q-my-sm" />

            <div class="row items-center justify-between text-caption text-slate-400">
              <div>
                <q-icon name="insert_drive_file" size="xs" /> {{ formatFileSize(resource.file_size) }}
              </div>
              <div>
                <q-icon name="schedule" size="xs" /> {{ formatDate(resource.created_at) }}
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions class="q-pa-sm">
            <q-btn 
              flat 
              dense 
              color="blue-600" 
              icon="download" 
              label="Download" 
              no-caps 
              size="sm"
              type="a"
              :href="resource.file_url"
              target="_blank"
            />
            <q-space />
            <q-btn flat dense round icon="more_vert" color="grey-6" size="sm">
              <q-menu>
                <q-list style="min-width: 150px">
                  <q-item clickable v-close-popup @click="viewResource(resource)">
                    <q-item-section avatar><q-icon name="visibility" /></q-item-section>
                    <q-item-section>View</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="editResource(resource)">
                    <q-item-section avatar><q-icon name="edit" /></q-item-section>
                    <q-item-section>Edit</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable v-close-popup @click="confirmDelete(resource)">
                    <q-item-section avatar><q-icon name="delete" color="red" /></q-item-section>
                    <q-item-section class="text-red">Delete</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center q-pa-xl text-grey-5">
      <q-icon name="folder_open" size="64px" />
      <div class="text-h6 q-mt-md">No resources found</div>
      <div class="text-caption q-mb-md">Upload your first study material</div>
      <q-btn unelevated color="blue-600" label="Upload Now" icon="cloud_upload" no-caps @click="showUploadDialog = true" />
    </div>

    <!-- Upload Dialog -->
    <q-dialog v-model="showUploadDialog">
      <q-card style="min-width: 500px" class="rounded-xl">
        <q-card-section class="bg-blue-600 text-white">
          <div class="text-h6">Upload Resource</div>
        </q-card-section>

        <q-card-section class="q-gutter-y-md">
          <q-input outlined v-model="uploadForm.title" label="Title *" autofocus />
          
          <q-input outlined v-model="uploadForm.description" label="Description" type="textarea" rows="2" />

          <q-select
            outlined
            v-model="uploadForm.category"
            :options="['notes', 'past_papers', 'worksheets', 'other']"
            label="Category *"
          />

          <q-select
            outlined
            v-model="uploadForm.class_id"
            :options="classOptions"
            option-label="label"
            option-value="id"
            emit-value
            map-options
            label="Share with Class (Optional)"
            clearable
          />

          <q-toggle v-model="uploadForm.is_public" label="Make public (visible to all teachers)" color="blue-600" />

          <q-file
            outlined
            v-model="uploadForm.file"
            label="Choose file *"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
            max-file-size="10485760"
            @rejected="onFileRejected"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>

          <div class="text-caption text-grey-6">
            Supported: PDF, DOC, DOCX, PPT, PPTX, JPG, PNG (Max 10MB)
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" color="grey" v-close-popup no-caps />
          <q-btn unelevated label="Upload" color="blue-600" @click="uploadResource" :loading="uploading" no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Confirm -->
    <q-dialog v-model="showDeleteDialog">
      <q-card class="rounded-xl">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="red-1" text-color="red" />
          <span class="q-ml-md text-h6">Delete Resource?</span>
        </q-card-section>
        <q-card-section>
          This action cannot be undone.
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup no-caps />
          <q-btn flat label="Delete" color="red" @click="deleteResource" :loading="deleting" no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from 'boot/supabase'
import { useAuthStore } from 'src/stores/auth'
import { teacherService } from 'src/services/teacherService'
import { useQuasar, date } from 'quasar'
import { v4 as uuidv4 } from 'uuid'

const $q = useQuasar()
const authStore = useAuthStore()

const loading = ref(true)
const uploading = ref(false)
const deleting = ref(false)
const showUploadDialog = ref(false)
const showDeleteDialog = ref(false)

const resources = ref([])
const classOptions = ref([{ label: 'All Classes', id: null }])
const selectedResource = ref(null)

const search = ref('')
const filterCategory = ref('All')
const filterClass = ref(null)

const uploadForm = ref({
  title: '',
  description: '',
  category: 'notes',
  class_id: null,
  is_public: false,
  file: null
})

const filteredResources = computed(() => {
  let filtered = resources.value

  // Search filter
  if (search.value) {
    const query = search.value.toLowerCase()
    filtered = filtered.filter(r => 
      r.title.toLowerCase().includes(query) || 
      r.description?.toLowerCase().includes(query)
    )
  }

  // Category filter
  if (filterCategory.value !== 'All') {
    filtered = filtered.filter(r => r.category === filterCategory.value.toLowerCase().replace(' ', '_'))
  }

  // Class filter
  if (filterClass.value) {
    filtered = filtered.filter(r => r.class_id === filterClass.value)
  }

  return filtered
})

async function fetchResources() {
  loading.value = true
  try {
    // Fetch teacher's resources
    const { data, error } = await supabase
      .from('resources')
      .select(`
        *,
        classes (
          id,
          grade,
          subject: subjects(name)
        )
      `)
      .eq('teacher_id', authStore.profile.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    resources.value = data || []

    // Fetch classes for filter
    const classes = await teacherService.getMyClasses(authStore.profile.id)
    classOptions.value = [
      { label: 'All Classes', id: null },
      ...classes.map(c => ({
        label: `${c.subject?.name} - Grade ${c.grade}`,
        id: c.id
      }))
    ]

  } catch (e) {
    console.error(e)
    if (e.code !== 'PGRST116') {
      $q.notify({ type: 'negative', message: 'Failed to load resources' })
    }
  } finally {
    loading.value = false
  }
}

async function uploadResource() {
  if (!uploadForm.value.title || !uploadForm.value.file) {
    $q.notify({ type: 'warning', message: 'Please fill required fields' })
    return
  }

  uploading.value = true
  try {
    // Upload file to Supabase Storage
    const fileName = `resources/${uuidv4()}-${uploadForm.value.file.name}`
    const { error: uploadError } = await supabase.storage
      .from('resources')
      .upload(fileName, uploadForm.value.file)

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('resources')
      .getPublicUrl(fileName)

    // Save to database
    const { error: dbError } = await supabase
      .from('resources')
      .insert({
        teacher_id: authStore.profile.id,
        title: uploadForm.value.title,
        description: uploadForm.value.description,
        category: uploadForm.value.category,
        class_id: uploadForm.value.class_id,
        is_public: uploadForm.value.is_public,
        file_url: publicUrl,
        file_name: uploadForm.value.file.name,
        file_type: uploadForm.value.file.type,
        file_size: uploadForm.value.file.size
      })

    if (dbError) throw dbError

    $q.notify({ type: 'positive', message: 'Resource uploaded successfully' })
    showUploadDialog.value = false
    uploadForm.value = { title: '', description: '', category: 'notes', class_id: null, is_public: false, file: null }
    fetchResources()

  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: e.message || 'Failed to upload resource' })
  } finally {
    uploading.value = false
  }
}

function viewResource(resource) {
  window.open(resource.file_url, '_blank')
}

function editResource() {
  $q.notify({ type: 'info', message: 'Edit feature coming soon' })
}

function confirmDelete(resource) {
  selectedResource.value = resource
  showDeleteDialog.value = true
}

async function deleteResource() {
  deleting.value = true
  try {
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', selectedResource.value.id)

    if (error) throw error

    $q.notify({ type: 'positive', message: 'Resource deleted' })
    showDeleteDialog.value = false
    fetchResources()
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: 'Failed to delete resource' })
  } finally {
    deleting.value = false
  }
}

function onFileRejected() {
  $q.notify({ type: 'warning', message: 'File too large or invalid type' })
}

function getFileIcon(fileType) {
  if (!fileType) return 'insert_drive_file'
  if (fileType.includes('pdf')) return 'picture_as_pdf'
  if (fileType.includes('word') || fileType.includes('document')) return 'description'
  if (fileType.includes('presentation') || fileType.includes('powerpoint')) return 'slideshow'
  if (fileType.includes('image')) return 'image'
  return 'insert_drive_file'
}

function getFileColor(fileType) {
  if (!fileType) return 'grey-6'
  if (fileType.includes('pdf')) return 'red-6'
  if (fileType.includes('word')) return 'blue-6'
  if (fileType.includes('presentation')) return 'orange-6'
  if (fileType.includes('image')) return 'green-6'
  return 'grey-6'
}

function getCategoryColor(category) {
  switch(category) {
    case 'notes': return 'blue-1'
    case 'past_papers': return 'purple-1'
    case 'worksheets': return 'green-1'
    default: return 'grey-1'
  }
}

function getCategoryTextColor(category) {
  switch(category) {
    case 'notes': return 'blue-9'
    case 'past_papers': return 'purple-9'
    case 'worksheets': return 'green-9'
    default: return 'grey-8'
  }
}

function formatFileSize(bytes) {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

function formatDate(val) {
  return date.formatDate(val, 'MMM D, YYYY')
}

onMounted(() => {
  fetchResources()
})
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.rounded-xl { border-radius: 16px; }
.bg-slate-50 { background-color: #F8FAFC; }
.text-slate-800 { color: #1E293B; }
.text-slate-500 { color: #64748B; }
.full-height { height: 100%; }
.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
