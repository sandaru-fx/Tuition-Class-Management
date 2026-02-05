<template>
  <q-page class="q-pa-lg">
    <!-- Header -->
    <div class="row items-center q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold text-dark q-mb-xs font-outfit">Communication & Alerts</h1>
        <p class="text-grey-7 q-mb-none text-subtitle1">Send notifications to students and parents.</p>
      </div>
    </div>

    <div class="row q-col-gutter-lg">
        
        <!-- Send Message Form -->
        <div class="col-12 col-md-5">
            <q-card class="shadow-1 rounded-borders-lg q-pa-md">
                <q-card-section>
                    <div class="text-h6 font-outfit q-mb-md">Send New Alert</div>
                    <q-form @submit="sendMessage" class="q-gutter-md">
                        <q-select 
                            outlined 
                            v-model="form.target" 
                            :options="targetOptions" 
                            label="Recipient Group" 
                            hint="Select who receives this message"
                        />
                        
                        <q-select 
                            v-if="form.target === 'Grade'"
                            outlined 
                            v-model="form.grade" 
                            :options="gradeOptions" 
                            label="Select Grade" 
                        />
                        
                        <q-input 
                            outlined 
                            v-model="form.message" 
                            label="Message" 
                            type="textarea" 
                            rows="4" 
                            :rules="[val => !!val || 'Message is required']"
                        />
                        
                        <q-checkbox v-model="form.sendSMS" label="Send via SMS Gateway (Simulated)" />
                        <q-checkbox v-model="form.sendEmail" label="Send via Email" />

                        <div class="row justify-end q-mt-md">
                            <q-btn unelevated label="Send Blast" color="primary" icon="send" type="submit" :loading="sending" />
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </div>

        <!-- History Log -->
        <div class="col-12 col-md-7">
            <q-card class="shadow-1 rounded-borders-lg bg-grey-1" style="min-height: 400px;">
                <q-card-section>
                    <div class="text-h6 font-outfit q-mb-sm">Sent History (Logs)</div>
                     
                    <q-list separator class="bg-white rounded-borders shadow-sm">
                        <q-item v-for="log in logs" :key="log.id" clickable v-ripple>
                            <q-item-section avatar>
                                <q-avatar :color="log.type === 'SMS' ? 'green-1' : 'blue-1'" :text-color="log.type === 'SMS' ? 'green-9' : 'blue-9'" icon="notifications" />
                            </q-item-section>
                            
                            <q-item-section>
                                <q-item-label class="text-weight-bold">{{ log.title }}</q-item-label>
                                <q-item-label caption lines="2">{{ log.message }}</q-item-label>
                            </q-item-section>
                            
                            <q-item-section side top>
                                <q-item-label caption>{{ log.time }}</q-item-label>
                                <q-chip size="sm" :color="log.status === 'Sent' ? 'green' : 'orange'" text-color="white" dense>{{ log.status }}</q-chip>
                            </q-item-section>
                        </q-item>
                        
                        <div v-if="logs.length === 0" class="text-center q-pa-xl text-grey">
                            No messages sent yet.
                        </div>
                    </q-list>
                </q-card-section>
            </q-card>
        </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const sending = ref(false)

const targetOptions = ['All Students', 'All Parents', 'Grade', 'Teachers']
const gradeOptions = ['1','2','3','4','5','6','7','8','9','10','11','12','13']

const form = ref({
    target: 'All Students',
    grade: null,
    message: '',
    sendSMS: true,
    sendEmail: false
})

// Mock Logs
const logs = ref([
    { id: 1, type: 'SMS', title: 'Payment Reminder', message: 'Dear Parents, monthly fees for May are due.', time: 'Yesterday 10:00 AM', status: 'Sent' },
    { id: 2, type: 'Email', title: 'Holiday Notice', message: 'Classes will be closed on Poya day.', time: '2 days ago', status: 'Sent' }
])

function sendMessage() {
    sending.value = true
    
    // Simulate API delay
    setTimeout(() => {
        const newLog = {
            id: Date.now(),
            type: form.value.sendSMS ? 'SMS' : 'Email',
            title: `Blast to ${form.value.target} ${form.value.grade ? '(Grade ' + form.value.grade + ')' : ''}`,
            message: form.value.message,
            time: 'Just Now',
            status: 'Sent'
        }
        
        logs.value.unshift(newLog)
        
        $q.notify({ type: 'positive', message: 'Messages queued for delivery!' })
        form.value.message = ''
        sending.value = false
    }, 1500)
}
</script>

<style scoped>
.font-outfit {
  font-family: 'Outfit', sans-serif;
}
.rounded-borders-lg {
  border-radius: 16px;
}
</style>
