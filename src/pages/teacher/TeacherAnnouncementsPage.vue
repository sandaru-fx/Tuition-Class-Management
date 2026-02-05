<template>
  <q-page class="q-pa-lg bg-slate-50">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold text-slate-800 font-outfit">Announcements</div>
        <div class="text-subtitle1 text-slate-500">Communicate with your classes</div>
      </div>
      <q-btn 
        unelevated 
        color="blue-600" 
        icon="add" 
        label="New Announcement" 
        no-caps 
        class="rounded-borders" 
        @click="openCreateDialog"
      />
    </div>

    <!-- Announcements List -->
    <div v-if="loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="2em" />
    </div>

    <div v-else-if="announcements.length === 0" class="text-center q-pa-xl text-grey-5">
      <q-icon name="campaign" size="4em" />
      <div class="text-h6 q-mt-md">No announcements yet</div>
      <p>Send your first message to a class!</p>
    </div>

    <div v-else class="row q-col-gutter-md">
      <div v-for="ann in announcements" :key="ann.id" class="col-12 col-md-6 col-lg-4">
        <q-card class="shadow-sm rounded-xl full-height column">
          <q-card-section class="bg-blue-50 row items-center justify-between">
            <div class="text-subtitle2 text-blue-9 font-weight-bold row items-center">
               <q-icon name="school" size="xs" class="q-mr-xs" />
               {{ ann.classes?.subject?.name || 'Subject' }} - Grade {{ ann.classes?.grade }}
            </div>
            <q-chip 
                v-if="ann.priority === 'high'" 
                size="xs" 
                color="red-1" 
                text-color="red-9" 
                icon="priority_high"
                label="High Priority"
            />
          </q-card-section>
          
          <q-card-section class="col q-pt-md">
            <div class="text-h6 text-slate-800 q-mb-xs">{{ ann.title }}</div>
            <div class="text-body2 text-grey-7" style="white-space: pre-wrap;">{{ ann.message }}</div>
          </q-card-section>

          <q-separator />

          <q-card-actions class="q-px-md q-py-sm row justify-between items-center text-grey-6 text-caption">
            <div>
               <q-icon name="schedule" size="xs" class="q-mr-xs" />
               {{ formatDate(ann.created_at) }}
            </div>
            <q-btn flat dense icon="delete" color="grey-5" size="sm" @click="confirmDelete(ann)" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- Create Dialog -->
    <q-dialog v-model="showDialog">
      <q-card style="min-width: 500px" class="rounded-borders-lg">
        <q-card-section class="row items-center">
          <div class="text-h6 font-outfit">New Announcement</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        
        <q-separator />

        <q-card-section class="q-gutter-y-md">
           <!-- Class Selection -->
           <q-select
              outlined
              v-model="form.class"
              :options="classOptions"
              label="Select Class *"
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
                    <q-item-label caption>Grade {{ scope.opt.grade }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-input outlined v-model="form.title" label="Title/Subject *" :rules="[val => !!val || 'Required']" />
            
            <q-input 
              outlined 
              v-model="form.message" 
              label="Message *" 
              type="textarea" 
              rows="4" 
              placeholder="Write your message here..."
              :rules="[val => !!val || 'Required']" 
            />

            <q-toggle v-model="form.highPriority" label="Mark as High Priority" color="red" left-label />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" color="grey" v-close-popup no-caps />
          <q-btn unelevated label="Send Announcement" color="blue-600" @click="sendAnnouncement" :loading="sending" no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Confirm -->
    <q-dialog v-model="showDeleteDialog">
        <q-card class="q-pa-sm rounded-borders-lg">
            <q-card-section class="row items-center">
                <q-avatar icon="warning" color="red-1" text-color="red" />
                <span class="q-ml-md text-h6">Delete Announcement?</span>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn flat label="Cancel" v-close-popup />
                <q-btn flat label="Delete" color="red" @click="deleteAnnouncement" />
            </q-card-actions>
        </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar, date } from 'quasar'
import { announcementService } from 'src/services/announcementService'
import { teacherService } from 'src/services/teacherService'
import { useAuthStore } from 'src/stores/auth'

const $q = useQuasar()
const authStore = useAuthStore()

const loading = ref(false)
const sending = ref(false)
const announcements = ref([])
const classOptions = ref([])

const showDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedItem = ref(null)

const form = ref({
    class: null,
    title: '',
    message: '',
    highPriority: false
})

async function fetchData() {
    if (!authStore.profile?.id) return
    loading.value = true
    try {
        const [anns, classes] = await Promise.all([
            announcementService.getByTeacher(authStore.profile.id),
            teacherService.getMyClasses(authStore.profile.id)
        ])
        announcements.value = anns || []
        
        classOptions.value = classes.map(c => ({
            label: `${c.subject?.name} - Grade ${c.grade}`,
            id: c.id,
            grade: c.grade
        }))

    } catch (e) {
        console.error(e)
        // Table likely doesn't exist yet if error - silently fail or show empty
    } finally {
        loading.value = false
    }
}

function openCreateDialog() {
    form.value = { class: null, title: '', message: '', highPriority: false }
    showDialog.value = true
}

async function sendAnnouncement() {
    if (!form.value.class || !form.value.title || !form.value.message) {
        $q.notify({ type: 'warning', message: 'Please fill all required fields' })
        return
    }

    sending.value = true
    try {
        await announcementService.create({
            teacher_id: authStore.profile.id,
            class_id: form.value.class,
            title: form.value.title,
            message: form.value.message,
            priority: form.value.highPriority ? 'high' : 'normal'
        })
        $q.notify({ type: 'positive', message: 'Announcement sent successfully!' })
        showDialog.value = false
        fetchData()
    } catch (e) {
        console.error(e)
        $q.notify({ type: 'negative', message: 'Failed to send announcement' })
    } finally {
        sending.value = false
    }
}

function confirmDelete(ann) {
    selectedItem.value = ann
    showDeleteDialog.value = true
}

async function deleteAnnouncement() {
    if (!selectedItem.value) return
    try {
        await announcementService.delete(selectedItem.value.id)
        $q.notify({ type: 'positive', message: 'Deleted' })
        showDeleteDialog.value = false
        fetchData()
    } catch {
        $q.notify({ type: 'negative', message: 'Error deleting' })
    }
}

function formatDate(val) {
    return date.formatDate(val, 'MMM D, YYYY h:mm A')
}

onMounted(() => {
    fetchData()
})
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.rounded-xl { border-radius: 16px; }
.rounded-borders { border-radius: 8px; }
.bg-slate-50 { background-color: #F8FAFC; }
.font-weight-bold { font-weight: 600; }
</style>
