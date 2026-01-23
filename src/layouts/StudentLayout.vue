<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">

    <q-header class="bg-white text-dark shadow-1" height-hint="98">
      <q-toolbar class="q-py-sm q-px-md">
        <q-btn flat round dense icon="school" class="text-primary" size="lg" to="/student" />
        
        <q-toolbar-title class="text-weight-bold font-outfit text-primary">
            Student<span class="text-dark">Portal</span>
        </q-toolbar-title>

        <q-space />

        <div class="row items-center q-gutter-sm">
            <q-chip outline color="primary" icon="account_circle">
                {{ userInitials }}
            </q-chip>
            <q-btn flat round color="red-4" icon="logout" @click="logout" />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from 'boot/supabase'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

const userInitials = computed(() => 'ST') // Mock until we fetch profile

async function logout() {
  await supabase.auth.signOut()
  router.push('/login')
  $q.notify({ type: 'positive', message: 'Logged out' })
}
</script>

<style scoped>
.font-outfit {
  font-family: 'Outfit', sans-serif;
}
</style>
