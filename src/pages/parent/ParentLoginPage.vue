<template>
  <q-page class="flex flex-center">
    <q-card class="shadow-2 rounded-borders-lg" style="width: 100%; max-width: 400px;">
      <q-card-section class="bg-indigo-9 text-white q-pa-lg text-center">
        <div class="text-h5 text-weight-bold font-outfit q-mb-xs">Parent Access</div>
        <div class="text-caption text-indigo-2">Enter your registered phone number</div>
      </q-card-section>

      <q-card-section class="q-pa-lg">
        <q-form @submit="handleLogin" class="q-gutter-md">
           <q-input 
              outlined 
              v-model="phone" 
              label="Phone Number" 
              mask="###-#######"
              hint="Format: 07X-XXXXXXX"
              :rules="[val => !!val || 'Required']"
              dense
            >
                <template v-slot:prepend>
                    <q-icon name="smartphone" />
                </template>
            </q-input>

            <q-btn 
                unelevated 
                rounded 
                color="indigo-9" 
                label="Access Dashboard" 
                class="full-width q-py-sm text-weight-bold" 
                type="submit" 
                :loading="loading" 
            />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { parentService } from 'src/services/parentService'

const phone = ref('')
const loading = ref(false)
const router = useRouter()
const $q = useQuasar()

async function handleLogin() {
    loading.value = true
    try {
        // Clean phone number format if needed (removing dashes for DB check if stored raw)
        // For now assuming DB matches input or we strip non-digits
        const cleanPhone = phone.value // .replace(/\D/g, '') 
        
        // 1. Verify existence
        const parent = await parentService.getParentByPhone(cleanPhone)
        
        if (parent) {
            // For MVP: Simple access, storing parent ID in session/local storage
            // In production: OTP verification required here.
            localStorage.setItem('parent_session_id', parent.id)
            localStorage.setItem('parent_name', parent.full_name)
            
            $q.notify({ type: 'positive', message: `Welcome back, ${parent.full_name}` })
            router.push('/parent/dashboard')
        } else {
            $q.notify({ type: 'warning', message: 'Phone number not found. Please contact administration.' })
        }
    } catch (e) {
        console.error(e)
        // For testing/demo purposes, if table is empty, allow bypass or specific mock
        // $q.notify({ type: 'negative', message: 'Access failed' }) 
        
        // Fallback for demo if no data exists yet:
        // router.push('/parent/dashboard') 
        $q.notify({ type: 'negative', message: 'Access failed: ' + e.message })
    } finally {
        loading.value = false
    }
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
