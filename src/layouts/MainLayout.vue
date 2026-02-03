<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-transparent q-py-md transition-all" style="backdrop-filter: blur(10px); z-index: 9999; pointer-events: auto; transform: translateZ(0);">
      <q-toolbar class="q-px-xl">
        
        <!-- Left: Logo -->
        <q-toolbar-title class="text-weight-bolder text-h5 col-shrink q-pl-none" style="min-width: 150px">
          Class<span class="text-grey-5">Master</span>.
        </q-toolbar-title>

        <!-- Center: Navigation -->
        <div class="row q-gutter-md absolute-center gt-xs">
          <q-btn flat no-caps label="Solutions" class="text-white text-weight-regular opacity-80 hover-opacity-100" />
          <q-btn flat no-caps label="Why Us" class="text-white text-weight-regular opacity-80 hover-opacity-100" />
          <q-btn flat no-caps label="Community" class="text-white text-weight-regular opacity-80 hover-opacity-100" />
        </div>

        <q-space />

        <!-- Right: Actions -->
        <div class="row q-gutter-sm items-center col-shrink justify-end" style="min-width: 150px">
          <q-btn flat no-caps label="Login" class="text-white text-weight-bold" to="/login" />
          <q-btn 
            unelevated 
            rounded 
            no-caps 
            label="Get Started" 
            class="bg-white text-black text-weight-bold q-px-lg hover-scale"
            to="/register"
          />
        </div>
        
        <q-btn flat round icon="menu" class="lt-sm text-white q-ml-sm" @click="leftDrawerOpen = !leftDrawerOpen" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="right"
      overlay
      behavior="mobile"
      class="bg-dark text-white"
    >
      <q-list padding class="text-center q-pt-xl">
        <q-item clickable v-ripple @click="leftDrawerOpen = false">
          <q-item-section>Solutions</q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="leftDrawerOpen = false">
          <q-item-section>Why Us</q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="leftDrawerOpen = false">
          <q-item-section>Community</q-item-section>
        </q-item>
        <q-separator dark class="q-my-md" />
        <q-item clickable v-ripple to="/login" @click="leftDrawerOpen = false">
          <q-item-section class="text-weight-bold">Login</q-item-section>
        </q-item>
        <q-item>
          <q-btn block unelevated rounded color="white" text-color="black" label="Get Started" class="full-width text-weight-bold" to="/register" @click="leftDrawerOpen = false" />
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)
</script>
