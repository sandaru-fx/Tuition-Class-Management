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
        
        <div class="column">
            <label class="text-weight-bold text-grey-9 text-subtitle2 q-mb-xs">Email</label>
            <q-input
            v-model="email"
            borderless
            dense
            placeholder="name@company.com"
            type="email"
            autocomplete="username"
            class="field-clean"
            :rules="[val => !!val || 'Email is required']"
            hide-bottom-space
            no-error-icon
            >
            <template v-slot:prepend>
                <div class="row flex-center" style="width: 24px">
                    <q-icon name="mail_outline" color="grey-6" size="20px" />
                </div>
            </template>
            </q-input>
        </div>

        <div class="column">
            <label class="text-weight-bold text-grey-9 text-subtitle2 q-mb-xs">Password</label>
            <q-input
            v-model="password"
            borderless
            dense
            placeholder="••••••••"
            type="password"
            autocomplete="current-password"
            class="field-clean"
            :rules="[val => !!val || 'Password is required']"
            hide-bottom-space
            no-error-icon
            >
            <template v-slot:prepend>
                 <div class="row flex-center" style="width: 24px">
                    <q-icon name="lock_outline" color="grey-6" size="20px" />
                 </div>
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
            <router-link to="/register" class="text-primary text-weight-bold hover-underline" style="text-decoration: none">Sign up</router-link>
        </div>

        <!-- Demo Access Section -->
        <div class="q-mt-none">
            <div class="relative-position text-center q-my-md">
                <q-separator color="grey-3" />
                <span class="absolute-center bg-white q-px-md text-caption text-grey-5 text-weight-medium">DEMO ACCESS</span>
            </div>
            
            <div class="row q-gutter-sm justify-center">
                <q-btn 
                    flat 
                    dense 
                    no-caps 
                    class="demo-chip"
                    @click="fillDemo('admin')"
                >
                    <div class="row items-center no-wrap">
                        <q-avatar size="24px" color="purple-1" text-color="purple-9" font-size="12px" class="q-mr-sm">A</q-avatar>
                        <span class="text-grey-9 text-caption text-weight-bold">Admin</span>
                    </div>
                </q-btn>

                <q-btn 
                    flat 
                    dense 
                    no-caps 
                    class="demo-chip"
                    @click="fillDemo('teacher')"
                >
                     <div class="row items-center no-wrap">
                        <q-avatar size="24px" color="blue-1" text-color="blue-9" font-size="12px" class="q-mr-sm">T</q-avatar>
                        <span class="text-grey-9 text-caption text-weight-bold">Teacher</span>
                    </div>
                </q-btn>

                 <q-btn 
                    flat 
                    dense 
                    no-caps 
                    class="demo-chip"
                    @click="fillDemo('student')"
                >
                     <div class="row items-center no-wrap">
                        <q-avatar size="24px" color="green-1" text-color="green-9" font-size="12px" class="q-mr-sm">S</q-avatar>
                        <span class="text-grey-9 text-caption text-weight-bold">Student</span>
                    </div>
                </q-btn>
            </div>
            
            <!-- Setup Demo Data Button (Hidden by default, useful for first time setup) -->
            <div class="q-mt-md">
                 <q-btn flat dense no-caps label="Setup Demo Data" color="grey-5" size="sm" @click="createDemoUsers" :loading="loading" />
            </div>
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

const demoCredentials = {
    admin: { email: 'admin@syzygy.lk', password: 'password' },
    teacher: { email: 'teacher@syzygy.lk', password: 'password' },
    student: { email: 'student@syzygy.lk', password: 'password' }
}

function fillDemo(role) {
    if (demoCredentials[role]) {
        email.value = demoCredentials[role].email
        password.value = demoCredentials[role].password
    }
}

async function createDemoUsers() {
    loading.value = true
    try {
        const users = [
            { email: demoCredentials.admin.email, password: demoCredentials.admin.password, role: 'admin', name: 'Demo Admin' },
            { email: demoCredentials.teacher.email, password: demoCredentials.teacher.password, role: 'teacher', name: 'Demo Teacher' },
            { email: demoCredentials.student.email, password: demoCredentials.student.password, role: 'student', name: 'Demo Student' }
        ]

        let createdCount = 0;

        for (const u of users) {
             const { data } = await supabase.auth.signUp({
                email: u.email,
                password: u.password,
                options: {
                    data: { role: u.role, name: u.name }
                }
            })
            
            if (data?.user) {
                // Ensure profile exists
                const { error: profileError } = await supabase.from('profiles').upsert({
                    id: data.user.id,
                    email: u.email,
                    role: u.role,
                    name: u.name
                })
                if (!profileError) createdCount++;
            }
        }
        
        $q.notify({
            type: 'positive',
            message: `Process complete. Created/Updated ${createdCount} demo users.`,
            position: 'top'
        })

    } catch (err) {
        $q.notify({
            type: 'negative',
            message: 'Error creating demo users: ' + err.message,
            position: 'top'
        })
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
   border-radius: 12px;
   background: #f9fafb; /* Slightly lighter gray background */
   border: 1px solid #1f2937 !important; /* Black border */
   padding-left: 12px;
   padding-right: 12px;
   height: 48px; 
   transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
   display: flex;
   align-items: center;
   outline: none !important;
   box-shadow: none !important;
}

.field-clean :deep(.q-field__control:hover) {
    border-color: #9ca3af !important;
    background: #f3f4f6;
    box-shadow: none !important;
}

/* Focus State - NO BLUE! */
.field-clean :deep(.q-field--focused .q-field__control) {
   border-color: #1f2937 !important; /* Black border on focus */
   background: white !important;
   box-shadow: none !important; /* Remove ALL shadows */
   outline: none !important; /* Remove ALL outlines */
}

/* Aggressive removal of Quasar blue focus */
.field-clean :deep(.q-field--focused) {
   box-shadow: none !important;
   outline: none !important;
}

.field-clean :deep(input:focus) {
   outline: none !important;
   box-shadow: none !important;
}

/* Remove default Quasar borders and shadows */
.field-clean :deep(.q-field__control:before),
.field-clean :deep(.q-field__control:after) {
    display: none !important;
}

.field-clean :deep(.q-field__prepend) {
    padding-right: 8px;
    height: 100%;
    margin-right: 0;
}

.field-clean :deep(.q-field__native) {
    font-size: 0.95rem; 
    font-weight: 500;
    color: #111827;
    padding-top: 0;
    padding-bottom: 0;
    line-height: normal;
}

.field-clean :deep(.q-field__native::placeholder) {
    color: #9ca3af;
    font-weight: 400;
}

/* Error State adjustments - ensure spacing is handled */
.field-clean.q-field--error :deep(.q-field__control) {
    border-color: #ef4444 !important;
}

.field-clean :deep(.q-field__bottom) {
    padding-top: 6px;
    font-size: 13px;
    font-weight: 500;
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

.demo-chip {
    border: 1px solid #f3f4f6;
    border-radius: 8px;
    padding: 4px 12px;
    background: #f9fafb;
    transition: all 0.2s ease;
}

.demo-chip:hover {
    background: #f3f4f6;
    border-color: #e5e7eb;
    transform: translateY(-1px);
}

</style>
