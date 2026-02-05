<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <!-- Accessibility: Skip Link -->
    <a href="#main-content" class="skip-to-main">Skip to main content</a>
    
    <!-- Top Bar -->
    <q-header class="bg-white text-dark" style="border-bottom: 1px solid rgba(0,0,0,0.05)">
      <q-toolbar class="q-py-sm">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" class="text-grey-8" />

        <q-toolbar-title class="text-weight-bold text-h6 font-outfit">
          <span class="text-primary">Class</span>Master <span class="text-grey-5 font-size-14 q-ml-sm">TEACHER PORTAL</span>
        </q-toolbar-title>

        <q-space />

        <!-- Notification Bell -->
        <q-btn flat round dense icon="notifications_none" class="q-mr-sm text-grey-7">
          <q-badge color="red" floating rounded dot />
        </q-btn>
        
        <!-- Profile Dropdown -->
        <q-btn flat no-caps no-wrap>
           <q-avatar size="32px" class="q-mr-sm">
             <img src="https://cdn.quasar.dev/img/avatar2.jpg">
           </q-avatar>
           <div class="column text-left display-xs-hide">
             <span class="text-weight-bold text-body2 line-height-tight">{{ authStore.profile?.full_name || 'Teacher' }}</span>
             <span class="text-caption text-grey-6 text-capitalize line-height-tight">{{ authStore.profile?.role || 'Member' }}</span>
           </div>
           <q-menu auto-close class="q-mt-md">
             <q-list style="min-width: 150px">
               <q-item clickable to="/teacher/profile">
                 <q-item-section>Profile</q-item-section>
               </q-item>
               <q-item clickable>
                 <q-item-section>Settings</q-item-section>
               </q-item>
               <q-separator />
               <q-item clickable class="text-red" @click="handleLogout">
                 <q-item-section>Logout</q-item-section>
               </q-item>
             </q-list>
           </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Sidebar -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-white"
      :width="260"
    >
      <q-scroll-area class="fit">
        <div class="q-pa-md q-mb-md">
           <div class="text-overline text-grey-6 q-mb-sm q-pl-sm">MENU</div>
           
           <q-list padding class="menu-list">
             <q-item clickable v-ripple active-class="bg-blue-50 text-blue-600" :active="route.path === '/teacher'" to="/teacher" class="rounded-borders q-mb-xs">
               <q-item-section avatar>
                 <q-icon name="dashboard" />
               </q-item-section>
               <q-item-section class="text-weight-medium">Dashboard</q-item-section>
             </q-item>

             <q-item clickable v-ripple active-class="bg-blue-50 text-blue-600" :active="route.path === '/teacher/classes'" to="/teacher/classes" class="rounded-borders q-mb-xs">
               <q-item-section avatar>
                 <q-icon name="class" />
               </q-item-section>
               <q-item-section class="text-weight-medium">My Classes</q-item-section>
             </q-item>

              <q-item clickable v-ripple active-class="bg-blue-50 text-blue-600" :active="route.path === '/teacher/assignments'" to="/teacher/assignments" class="rounded-borders q-mb-xs">
                <q-item-section avatar>
                  <q-icon name="assignment" />
                </q-item-section>
                <q-item-section class="text-weight-medium">Assignments</q-item-section>
              </q-item>

              <q-item clickable v-ripple active-class="bg-blue-50 text-blue-600" :active="route.path === '/teacher/exams'" to="/teacher/exams" class="rounded-borders q-mb-xs">
                <q-item-section avatar>
                  <q-icon name="event" />
                </q-item-section>
                <q-item-section class="text-weight-medium">Exam Calendar</q-item-section>
              </q-item>

             <q-item clickable v-ripple active-class="bg-blue-50 text-blue-600" :active="route.path === '/teacher/students'" to="/teacher/students" class="rounded-borders q-mb-xs">
               <q-item-section avatar>
                 <q-icon name="people" />
               </q-item-section>
               <q-item-section class="text-weight-medium">My Students</q-item-section>
             </q-item>

             <q-item clickable v-ripple active-class="bg-blue-50 text-blue-600" :active="route.path === '/teacher/announcements'" to="/teacher/announcements" class="rounded-borders q-mb-xs">
               <q-item-section avatar>
                 <q-icon name="campaign" />
               </q-item-section>
               <q-item-section class="text-weight-medium">Announcements</q-item-section>
             </q-item>
             
             <q-item clickable v-ripple active-class="bg-blue-50 text-blue-600" :active="route.path === '/teacher/reports'" to="/teacher/reports" class="rounded-borders q-mb-xs">
               <q-item-section avatar>
                 <q-icon name="assessment" />
               </q-item-section>
               <q-item-section class="text-weight-medium">Reports</q-item-section>
             </q-item>
           </q-list>

           <div class="text-overline text-grey-6 q-mt-xl q-mb-sm q-pl-sm">SETTINGS</div>
           
           <q-list padding class="menu-list">
             <q-item clickable v-ripple active-class="bg-blue-50 text-blue-600" :active="route.path === '/teacher/profile'" to="/teacher/profile" class="rounded-borders q-mb-xs">
               <q-item-section avatar>
                 <q-icon name="person" />
               </q-item-section>
               <q-item-section class="text-weight-medium">Profile</q-item-section>
             </q-item>

             <q-item clickable v-ripple @click="handleLogout" class="rounded-borders q-mb-xs text-red-7">
               <q-item-section avatar>
                 <q-icon name="logout" />
               </q-item-section>
               <q-item-section class="text-weight-medium">Logout</q-item-section>
             </q-item>
           </q-list>

        </div>
      </q-scroll-area>
    </q-drawer>

    <!-- Page Content -->
    <q-page-container>
      <main id="main-content" tabindex="-1">
        <router-view />
      </main>
    </q-page-container>

    <!-- Mobile Bottom Navigation -->
    <q-footer bordered class="lt-md bg-white text-primary">
        <q-tabs
            :model-value="route.path"
            active-color="primary"
            indicator-color="transparent"
            class="text-grey-7"
            no-caps
            align="justify"
        >
            <q-route-tab to="/teacher" icon="dashboard" label="" class="q-px-none">
                <div class="text-caption" style="font-size: 10px; line-height: 1;">Home</div>
            </q-route-tab>
            <q-route-tab to="/teacher/classes" icon="class" class="q-px-none">
                <div class="text-caption" style="font-size: 10px; line-height: 1;">Classes</div>
            </q-route-tab>
             <q-route-tab to="/teacher/exams" icon="event" class="q-px-none">
                <div class="text-caption" style="font-size: 10px; line-height: 1;">Exams</div>
            </q-route-tab>
            <q-route-tab to="/teacher/assignments" icon="assignment" class="q-px-none">
                <div class="text-caption" style="font-size: 10px; line-height: 1;">Tasks</div>
            </q-route-tab>
            <q-route-tab to="/teacher/profile" icon="person" class="q-px-none">
                <div class="text-caption" style="font-size: 10px; line-height: 1;">Profile</div>
            </q-route-tab>
        </q-tabs>
    </q-footer>

  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import { useAppStore } from 'src/stores/app'

const authStore = useAuthStore()
const appStore = useAppStore()

const leftDrawerOpen = ref(false)
const router = useRouter()
const route = useRoute()
const $q = useQuasar()

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

onMounted(() => {
  appStore.initData()
})

async function handleLogout() {
  try {
    await authStore.signOut()
    router.push('/login')
    $q.notify({
      type: 'positive',
      message: 'Logged out successfully',
      position: 'top'
    })
  } catch (error) {
    console.error('Logout error:', error)
    router.push('/login')
  }
}
</script>

<style lang="scss" scoped>
.font-outfit {
  font-family: 'Outfit', sans-serif;
}
.menu-list .q-item {
  border-radius: 8px;
  color: #555;
  transition: all 0.2s ease;
}
.menu-list .q-item:hover {
  background: #EFF6FF; // Blue 50
  color: #2563EB; // Blue 600
}
.line-height-tight {
  line-height: 1.2;
}
.font-size-14 {
  font-size: 14px;
}
</style>
