<template>
  <q-page class="q-pa-lg">
    <!-- Header -->
    <div class="row items-center q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold text-dark q-mb-xs font-outfit">Communication Center</h1>
        <p class="text-grey-7 q-mb-none text-subtitle1">Send SMS alerts and manage digital notices.</p>
      </div>
    </div>

    <!-- Tabs -->
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="left"
      narrow-indicator
    >
      <q-tab name="sms" label="SMS Blaster" icon="sms" no-caps />
      <q-tab name="notices" label="Digital Notice Board" icon="campaign" no-caps />
    </q-tabs>

    <q-separator class="q-mb-md" />

    <q-tab-panels v-model="tab" animated class="bg-transparent">
      
      <!-- SMS Center -->
      <q-tab-panel name="sms" class="q-pa-none">
         <div class="row q-col-gutter-lg">
             <!-- Compose Box -->
             <div class="col-12 col-md-6">
                 <q-card class="my-card shadow-1">
                     <q-card-section>
                         <div class="text-h6 font-outfit q-mb-md">Compose Message</div>
                         <q-form @submit="sendSMS">
                             <div class="q-gutter-md">
                                 <q-select 
                                    outlined 
                                    v-model="smsAudience" 
                                    :options="audienceOptions" 
                                    label="Select Audience" 
                                    dense 
                                    hint="Who should receive this message?"
                                 />
                                 
                                 <q-input 
                                    outlined 
                                    v-model="smsMessage" 
                                    type="textarea" 
                                    label="Message Body" 
                                    rows="4" 
                                    counter 
                                    maxlength="160"
                                    hint="Standard SMS limit: 160 chars"
                                 />
                                 
                                 <div class="row items-center justify-between q-mt-lg">
                                     <div class="text-caption text-grey-6">
                                         Estimated Cost: <span class="text-weight-bold text-dark">LKR 0.00</span> (Demo)
                                     </div>
                                     <q-btn unelevated color="black" label="Send Broadcast" icon="send" type="submit" :loading="sendingSMS" no-caps />
                                 </div>
                             </div>
                         </q-form>
                     </q-card-section>
                 </q-card>
             </div>
             
             <!-- Recent Logs -->
             <div class="col-12 col-md-6">
                 <q-card class="my-card shadow-1 bg-grey-1 h-100">
                     <q-card-section>
                         <div class="text-h6 font-outfit q-mb-sm">Recent Logs</div>
                         <q-scroll-area style="height: 300px;">
                             <q-list separator>
                                 <q-item v-if="smsLogs.length === 0" class="text-center text-grey-6">
                                     <q-item-section>No messages sent yet.</q-item-section>
                                 </q-item>
                                 <q-item v-for="log in smsLogs" :key="log.id">
                                     <q-item-section>
                                         <q-item-label class="text-weight-bold">{{ log.audience }}</q-item-label>
                                         <q-item-label caption lines="2">{{ log.message_body }}</q-item-label>
                                     </q-item-section>
                                     <q-item-section side top>
                                         <q-item-label caption>{{ formatDate(log.sent_at) }}</q-item-label>
                                         <q-badge color="green-1" text-color="green-9" label="Sent" size="sm" />
                                     </q-item-section>
                                 </q-item>
                             </q-list>
                         </q-scroll-area>
                     </q-card-section>
                 </q-card>
             </div>
         </div>
      </q-tab-panel>

      <!-- Notice Board -->
      <q-tab-panel name="notices" class="q-pa-none">
          <div class="row justify-between items-center q-mb-md">
               <div class="text-h6 font-outfit">Active Notices</div>
               <q-btn flat color="primary" label="Post New Notice" icon="add_alert" no-caps @click="showNoticeDialog = true" />
          </div>

          <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6 col-md-4" v-for="notice in notices" :key="notice.id">
                  <q-card class="my-card shadow-1 hover-lift border-left-primary">
                      <q-card-section>
                          <div class="row items-center justify-between">
                              <q-badge v-if="notice.is_pinned" color="orange-1" text-color="orange-9" icon="push_pin" label="Pinned" />
                              <div class="text-caption text-grey-6">{{ formatDate(notice.created_at) }}</div>
                          </div>
                          <div class="text-h6 text-weight-bold q-mt-sm">{{ notice.title }}</div>
                          <div class="text-body2 text-grey-8 q-mt-xs">{{ notice.message }}</div>
                          <div class="text-caption text-primary q-mt-md text-weight-medium">To: {{ notice.audience }}</div>
                      </q-card-section>
                      <q-card-actions align="right">
                          <q-btn flat round dense color="grey-5" icon="delete" @click="deleteNotice(notice.id)" />
                      </q-card-actions>
                  </q-card>
              </div>
          </div>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Post Notice Dialog -->
    <q-dialog v-model="showNoticeDialog">
      <q-card style="min-width: 400px" class="q-pa-md rounded-borders-lg">
        <q-card-section>
          <div class="text-h6 font-outfit">Post New Notice</div>
        </q-card-section>

        <q-form @submit="postNotice" class="q-gutter-md">
            <q-input outlined v-model="noticeForm.title" label="Title (e.g. Holiday Alert)" dense :rules="[val => !!val || 'Required']" />
            <q-input outlined v-model="noticeForm.message" type="textarea" label="Details" dense :rules="[val => !!val || 'Required']" />
            
            <q-select 
                outlined 
                v-model="noticeForm.audience" 
                :options="['All Students', 'Parents', 'Teachers', 'Grade 10 Only']" 
                label="Audience" 
                dense 
            />
            
            <q-toggle v-model="noticeForm.is_pinned" label="Pin to Dashboard" />

            <div class="row justify-end q-mt-lg">
                 <q-btn flat label="Cancel" color="grey-7" v-close-popup no-caps class="q-mr-sm" />
                 <q-btn unelevated label="Post Notice" color="black" type="submit" :loading="postingNotice" no-caps />
            </div>
        </q-form>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { supabase } from 'boot/supabase'

const $q = useQuasar()
const tab = ref('sms')
const smsAudience = ref('All Active Students')
const smsMessage = ref('')
const sendingSMS = ref(false)
const postingNotice = ref(false)
const showNoticeDialog = ref(false)

const smsLogs = ref([])
const notices = ref([])

const audienceOptions = ['All Active Students', 'Grade 9', 'Grade 10', 'Grade 11', 'Parents', 'Teachers']

const noticeForm = ref({
    title: '',
    message: '',
    audience: 'All Students',
    is_pinned: false
})

async function fetchLogs() {
    const { data } = await supabase.from('sms_logs').select('*').order('sent_at', { ascending: false }).limit(20)
    smsLogs.value = data || []
}

async function fetchNotices() {
    const { data } = await supabase.from('notices').select('*').order('created_at', { ascending: false })
    notices.value = data || []
}

async function sendSMS() {
    if (!smsMessage.value) return 
    sendingSMS.value = true
    
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1500))

    try {
        const { error } = await supabase.from('sms_logs').insert([{
            message_body: smsMessage.value,
            audience: smsAudience.value,
            status: 'Sent',
            recipient_count: Math.floor(Math.random() * 50) + 10 // Mock count
        }])
        
        if (error) throw error
        
        $q.notify({ type: 'positive', message: 'Message broadcast sent successfully!' })
        smsMessage.value = ''
        fetchLogs()
    } catch (e) {
        $q.notify({ type: 'negative', message: 'Failed to send SMS' })
    } finally {
        sendingSMS.value = false
    }
}

async function postNotice() {
    postingNotice.value = true
    try {
        const { error } = await supabase.from('notices').insert([noticeForm.value])
        if (error) throw error
        
        $q.notify({ type: 'positive', message: 'Notice posted!' })
        fetchNotices()
        showNoticeDialog.value = false
        noticeForm.value = { title: '', message: '', audience: 'All Students', is_pinned: false }
    } catch (e) {
        $q.notify({ type: 'negative', message: 'Failed to post notice' })
    } finally {
        postingNotice.value = false
    }
}

async function deleteNotice(id) {
    if(confirm('Delete this notice?')) {
        await supabase.from('notices').delete().eq('id', id)
        fetchNotices()
    }
}

function formatDate(dateStr) {
    if (!dateStr) return 'Just now'
    return new Date(dateStr).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
    fetchLogs()
    fetchNotices()
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
.hover-lift {
    transition: transform 0.2s, box-shadow 0.2s;
}
.hover-lift:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.border-left-primary {
    border-left: 4px solid #1976d2;
}
</style>
