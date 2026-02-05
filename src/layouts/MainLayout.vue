<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white q-py-md transition-all shadow-sm" style="z-index: 9999;">
      <q-toolbar class="q-px-xl">
        
        <!-- Left: Logo -->
        <q-toolbar-title class="text-weight-bolder text-h4 col-shrink q-pl-none font-outfit text-primary" style="min-width: 150px; letter-spacing: -1px;">
          SYZYGY
        </q-toolbar-title>

        <!-- Center: Navigation -->
        <div class="row q-gutter-lg absolute-center gt-sm">
          <q-btn flat no-caps label="Home" class="text-dark text-weight-medium hover-text-primary" @click="scrollToSection('home')" />
          <q-btn flat no-caps label="About" class="text-dark text-weight-medium hover-text-primary" @click="scrollToSection('about')" />
          <q-btn flat no-caps label="Classes" class="text-dark text-weight-medium hover-text-primary" @click="scrollToSection('classes')" />
          <q-btn flat no-caps label="Facilities" class="text-dark text-weight-medium hover-text-primary" @click="scrollToSection('facilities')" />
          <q-btn flat no-caps label="Contact" class="text-dark text-weight-medium hover-text-primary" @click="scrollToSection('contact')" />
        </div>

        <q-space />

        <!-- Right: Actions -->
        <div class="row q-gutter-md items-center col-shrink justify-end" style="min-width: 250px">
          <q-btn 
            flat 
            rounded 
            no-caps 
            label="Login" 
            class="text-dark text-weight-bold hover-scale"
            to="/login"
          />
          <q-btn 
            unelevated 
            rounded 
            no-caps 
            label="Sign Up" 
            class="bg-primary text-white text-weight-bold q-px-lg hover-scale shadow-2"
            to="/register"
          />
        </div>
        
        <q-btn flat round icon="menu" class="lt-md text-dark q-ml-sm" @click="leftDrawerOpen = !leftDrawerOpen" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="right"
      overlay
      behavior="mobile"
      class="bg-white text-dark"
    >
      <q-list padding class="text-center q-pt-xl">
        <q-item clickable v-ripple @click="scrollToSection('home')">
          <q-item-section class="text-weight-bold">Home</q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="scrollToSection('about')">
          <q-item-section class="text-weight-bold">About</q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="scrollToSection('classes')">
          <q-item-section class="text-weight-bold">Classes</q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="scrollToSection('fees')">
          <q-item-section class="text-weight-bold">Fees</q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="scrollToSection('facilities')">
          <q-item-section class="text-weight-bold">Facilities</q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="scrollToSection('contact')">
          <q-item-section class="text-weight-bold">Contact</q-item-section>
        </q-item>
        <q-separator class="q-my-md" />
        
        <q-item clickable v-ripple to="/login" @click="leftDrawerOpen = false">
          <q-item-section class="text-weight-bold">Login</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/register" @click="leftDrawerOpen = false" class="bg-primary text-white rounded-borders q-mx-md">
          <q-item-section class="text-weight-bold">Sign Up</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'

const leftDrawerOpen = ref(false)
const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  if (!authStore.user && !authStore.loading) {
    await authStore.initialize()
  }
})

function scrollToSection(id) {
  leftDrawerOpen.value = false
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  } else {
    router.push('/').then(() => {
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    })
  }
}
</script>
