<template>
  <q-page class="flex flex-center font-inter bg-grey-2 relative-position">
    
    <!-- Top-Left Branding -->
    <div class="absolute-top-left q-ma-lg row items-center">
        <div class="logo-symbol flex flex-center q-mr-md shadow-3">
             <q-icon name="auto_awesome" color="white" size="28px" />
        </div>
        <div class="column justify-center">
            <h1 class="text-h4 text-weight-bolder text-dark q-my-none tracking-tight leading-none">SYZYGY.</h1>
            <div class="text-subtitle2 text-grey-7 text-uppercase tracking-widest text-weight-bold" style="font-size: 0.75rem;">Education Center</div>
        </div>
    </div>

    <!-- Top-Right Navigation -->
    <div class="absolute-top-right q-ma-lg">
        <q-btn
            flat
            rounded
            no-caps
            label="Back to Website"
            icon-right="arrow_forward"
            color="grey-8"
            to="/"
            class="text-weight-bold hover-scale"
        />
    </div>

    <!-- Centered Login Card -->
    <div class="card-auth q-pa-xl column items-center shadow-2">
      
      <div class="full-width q-mb-xl text-center">
        <h2 class="text-h4 text-weight-bold text-grey-9 q-mb-sm">Welcome Back</h2>
        <p class="text-grey-6 text-body1">Please enter your details to sign in.</p>
      </div>

      <q-form @submit.prevent="handleLogin" class="full-width q-gutter-y-lg">
        
        <div class="column q-gutter-y-sm">
            <label class="text-weight-bold text-grey-8 text-subtitle2 q-ml-xs">Email</label>
            <q-input
            v-model="email"
            borderless
            dense
            placeholder="Enter your email address"
            type="email"
            class="field-clean"
            :rules="[val => !!val || 'Email is required']"
            hide-bottom-space
            no-error-icon
            >
            <template v-slot:prepend>
                <q-icon name="mail" color="grey-6" size="22px" class="q-ml-sm" />
            </template>
            </q-input>
        </div>

        <div class="column q-gutter-y-sm">
            <label class="text-weight-bold text-grey-8 text-subtitle2 q-ml-xs">Password</label>
            <q-input
            v-model="password"
            borderless
            dense
            placeholder="Enter your password"
            type="password"
            class="field-clean"
            :rules="[val => !!val || 'Password is required']"
            hide-bottom-space
            no-error-icon
            >
            <template v-slot:prepend>
                <q-icon name="lock" color="grey-6" size="22px" class="q-ml-sm" />
            </template>
            </q-input>
        </div>

        <div class="row justify-between items-center full-width">
             <q-checkbox v-model="rememberMe" label="Remember me" color="primary" size="sm" class="text-grey-7 text-body2" />
             <a href="#" class="text-primary text-weight-bold hover-underline text-body2 transition-colors">Forgot password?</a>
        </div>

        <q-btn
          unelevated
          type="submit"
          label="Sign in"
          color="dark"
          text-color="white"
          class="full-width text-weight-bold q-py-md btn-pill shadow-soft hover-lift text-body1"
          :loading="loading"
          no-caps
        />

        <div class="text-center text-grey-8 text-body2 q-mt-md">
            Don't have an account? 
            <router-link to="/register" class="text-primary text-weight-bold hover-underline" style="text-decoration: none">Sign up</router-link>
        </div>

      </q-form>
      
       <!-- Mobile Back Button (only visible on small screens to avoid duplication) -->
       <div class="absolute-bottom-left q-pa-lg lt-sm">
          <q-btn 
            flat 
            dense
            no-caps 
            color="grey-7" 
            icon="arrow_back" 
            label="Back" 
            to="/" 
            class="text-body2"
          />
        </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { supabase } from 'boot/supabase'
import { useAuthStore } from 'src/stores/auth'

const authStore = useAuthStore()
const $q = useQuasar()
const router = useRouter()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  try {
    if (!supabase) {
      throw new Error('System configuration error: Supabase not configured.')
    }

    const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    
    if (signInError) throw signInError

    const profile = await authStore.fetchProfile(user.id)
    
    $q.notify({
      type: 'positive',
      message: 'Successfully logged in',
      position: 'top',
      timeout: 1000
    })

    setTimeout(() => {
        if (profile && profile.role === 'student') {
            router.push('/student')
        } else if (profile && profile.role === 'teacher') {
            router.push('/teacher')
        } else {
            router.push('/dashboard')
        }
    }, 500)
    
  } catch (error) {
    if (error.message.includes('Email not confirmed')) {
       $q.notify({
        type: 'warning',
        message: 'Please verify your email address.',
        position: 'top'
      })
    } else {
      $q.notify({
        type: 'negative',
        message: error.message || 'Login failed',
        position: 'top'
      })
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

.font-inter {
  font-family: 'Inter', sans-serif;
}

.tracking-tight { letter-spacing: -0.025em; }
.tracking-widest { letter-spacing: 0.15em; }
.leading-none { line-height: 1; }

/* Logo Styles */
.logo-symbol {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
    border-radius: 14px;
}

.card-auth {
    background: white;
    width: 100%;
    max-width: 480px; /* Slight increase for fuller look */
    border-radius: 24px;
    border: 1px solid #e5e7eb;
}

/* Custom Input Styles */
.field-clean :deep(.q-field__control) {
   border-radius: 10px;
   background: white;
   border: 1px solid #d1d5db; 
   padding-left: 8px;
   padding-right: 8px;
   height: 48px; /* Taller inputs */
   transition: all 0.2s ease;
}

.field-clean :deep(.q-field__control:hover) {
    border-color: #6b7280;
}

/* Focus State */
.field-clean :deep(.q-field--focused .q-field__control) {
   border-color: #3b82f6; 
   box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
}

/* Remove default Quasar borders */
.field-clean :deep(.q-field__control:before),
.field-clean :deep(.q-field__control:after) {
    display: none;
}

.field-clean :deep(.q-field__native) {
    font-size: 1rem; /* Larger input text */
    font-weight: 500;
    color: #1f2937;
    padding-left: 4px;
}

.field-clean :deep(.q-field__native::placeholder) {
    color: #9ca3af;
    font-weight: 400;
}

/* Button Styles */
.btn-pill {
    border-radius: 9999px;
}

.shadow-soft {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.hover-lift {
    transition: all 0.2s ease;
}
.hover-lift:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.hover-scale {
    transition: transform 0.2s ease;
}
.hover-scale:hover {
    transform: translateX(-3px);
}

.hover-underline:hover {
    text-decoration: underline !important;
}

.transition-colors {
    transition: color 0.2s;
}

.opacity-70 { opacity: 0.7; }
.hover\:opacity-100:hover { opacity: 1; }

</style>
