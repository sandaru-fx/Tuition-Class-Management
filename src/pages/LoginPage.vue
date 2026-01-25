<template>
  <q-page class="flex flex-center bg-black overflow-hidden relative-position">
    <!-- Background Elements -->
    <div class="absolute-full">
      <q-img src="~assets/hero-abstract.png" class="absolute-full" style="opacity: 0.2; filter: blur(5px);" />
      <div class="absolute-full bg-radial-gradient"></div>
    </div>

    <!-- Login Card -->
    <div class="glass-card q-pa-xl column items-center text-center relative-position z-top" style="max-width: 400px; width: 90%;">
      <h1 class="text-h4 text-weight-bolder q-mb-xs">Welcome Back</h1>
      <p class="text-grey-5 q-mb-lg">Sign in to manage your institute.</p>

      <q-form @submit.prevent="handleLogin" class="full-width q-gutter-y-md">
        <q-input
          v-model="email"
          dark
          outlined
          label="Email Address"
          type="email"
          color="white"
          bg-color="transparent"
          class="full-width"
          :rules="[val => !!val || 'Email is required']"
        >
          <template v-slot:prepend>
            <q-icon name="email" color="grey-5" />
          </template>
        </q-input>

        <q-input
          v-model="password"
          dark
          outlined
          label="Password"
          type="password"
          color="white"
          bg-color="transparent"
          class="full-width"
          :rules="[val => !!val || 'Password is required']"
        >
          <template v-slot:prepend>
            <q-icon name="lock" color="grey-5" />
          </template>
        </q-input>

        <q-btn
          unelevated
          type="submit"
          label="Login"
          color="white"
          text-color="black"
          class="full-width text-weight-bold q-py-sm"
          :loading="loading"
          rounded
        />
      </q-form>

      <div class="q-mt-lg text-grey-5">
        Don't have an account? 
        <router-link to="/register" class="text-white text-weight-bold" style="text-decoration: none">Sign Up</router-link>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { supabase } from 'boot/supabase'

const $q = useQuasar()
const router = useRouter()
const email = ref('')
const password = ref('')
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

    // Check Profile Role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
    
    $q.notify({
      type: 'positive',
      message: 'Login successful!',
      position: 'top'
    })

    // Redirect based on role
    if (profile && profile.role === 'student') {
        router.push('/student')
    } else if (profile && profile.role === 'teacher') {
        router.push('/teacher')
    } else {
        router.push('/dashboard')
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'Login failed',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bg-radial-gradient {
  background: radial-gradient(circle at center, rgba(0,0,0,0) 0%, #000000 100%);
}
.z-top {
  z-index: 10;
}
</style>
