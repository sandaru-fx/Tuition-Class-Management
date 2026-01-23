<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    
    <!-- Top Bar -->
    <q-header class="bg-white text-dark" style="border-bottom: 1px solid rgba(0,0,0,0.05)">
      <q-toolbar class="q-py-sm">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" class="text-grey-8" />

        <q-toolbar-title class="text-weight-bold text-h6 font-outfit">
          <span class="text-primary">Class</span>Master
        </q-toolbar-title>

        <q-space />

        <!-- Notification Bell -->
        <q-btn flat round dense icon="notifications_none" class="q-mr-sm text-grey-7">
          <q-badge color="red" floating rounded dot />
        </q-btn>
        
        <!-- Profile Dropdown -->
        <q-btn flat no-caps no-wrap>
           <q-avatar size="32px" class="q-mr-sm">
             <img src="https://cdn.quasar.dev/img/boy-avatar.png">
           </q-avatar>
           <div class="column text-left display-xs-hide">
             <span class="text-weight-bold text-body2 line-height-tight">Admin User</span>
             <span class="text-caption text-grey-6 line-height-tight">Administrator</span>
           </div>
           <q-menu auto-close class="q-mt-md">
             <q-list style="min-width: 150px">
               <q-item clickable to="/dashboard/profile">
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
             <q-item clickable v-ripple active-class="bg-grey-2 text-primary" :active="route.path === '/dashboard'" to="/dashboard" class="rounded-borders q-mb-xs">
               <q-item-section avatar>
                 <q-icon name="dashboard" />
               </q-item-section>
               <q-item-section class="text-weight-medium">Overview</q-item-section>
             </q-item>

             <q-item clickable v-ripple active-class="bg-grey-2 text-primary" :active="route.path === '/dashboard/students'" to="/dashboard/students" class="rounded-borders q-mb-xs">
               <q-item-section avatar>
                 <q-icon name="school" />
               </q-item-section>
               <q-item-section class="text-weight-medium">Students</q-item-section>
             </q-item>

             <q-item clickable v-ripple active-class="bg-grey-2 text-primary" :active="route.path === '/dashboard/classes'" to="/dashboard/classes" class="rounded-borders q-mb-xs">
               <q-item-section avatar>
                 <q-icon name="calendar_month" />
               </q-item-section>
               <q-item-section class="text-weight-medium">Classes</q-item-section>
             </q-item>

             <q-item clickable v-ripple active-class="bg-grey-2 text-primary" :active="route.path === '/dashboard/exams'" to="/dashboard/exams" class="rounded-borders q-mb-xs">
               <q-item-section avatar>
                 <q-icon name="assignment_turned_in" />
               </q-item-section>
               <q-item-section class="text-weight-medium">Exams</q-item-section>
             </q-item>

             <q-item clickable v-ripple active-class="bg-grey-2 text-primary" :active="route.path === '/dashboard/communication'" to="/dashboard/communication" class="rounded-borders q-mb-xs">
               <q-item-section avatar>
                 <q-icon name="campaign" />
               </q-item-section>
               <q-item-section class="text-weight-medium">Communication</q-item-section>
             </q-item>

             <q-item clickable v-ripple active-class="bg-grey-2 text-primary" :active="route.path === '/dashboard/payments'" to="/dashboard/payments" class="rounded-borders q-mb-xs">
               <q-item-section avatar>
                 <q-icon name="payments" />
               </q-item-section>
               <q-item-section class="text-weight-medium">Payments</q-item-section>
             </q-item>

             <q-item clickable v-ripple active-class="bg-grey-2 text-primary" :active="route.path === '/dashboard/attendance'" to="/dashboard/attendance" class="rounded-borders q-mb-xs">
               <q-item-section avatar>
                 <q-icon name="fact_check" />
               </q-item-section>
               <q-item-section class="text-weight-medium">Attendance</q-item-section>
             </q-item>

             <q-item clickable v-ripple active-class="bg-grey-2 text-primary" :active="route.path === '/dashboard/users'" to="/dashboard/users" class="rounded-borders q-mb-xs">
               <q-item-section avatar>
                 <q-icon name="group" />
               </q-item-section>
               <q-item-section class="text-weight-medium">Users</q-item-section>
             </q-item>

             <q-item clickable v-ripple active-class="bg-grey-2 text-primary" :active="route.path === '/dashboard/roles'" to="/dashboard/roles" class="rounded-borders q-mb-xs">
               <q-item-section avatar>
                 <q-icon name="admin_panel_settings" />
               </q-item-section>
               <q-item-section class="text-weight-medium">Roles</q-item-section>
             </q-item>
           </q-list>

           <div class="text-overline text-grey-6 q-mt-xl q-mb-sm q-pl-sm">SETTINGS</div>
           
           <q-list padding class="menu-list">
             <q-item clickable v-ripple to="/dashboard/profile" class="rounded-borders q-mb-xs">
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
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { supabase } from 'boot/supabase'

const leftDrawerOpen = ref(false)
const router = useRouter()
const route = useRoute()
const $q = useQuasar()

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

async function handleLogout() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    router.push('/login')
    $q.notify({
      type: 'positive',
      message: 'Logged out successfully',
      position: 'top'
    })
  } catch (error) {
    if (error.message.includes('missing')) {
       // Graceful fallback for dev without net
       router.push('/login')
       return
    }
    $q.notify({
      type: 'negative',
      message: 'Error logging out',
      position: 'top'
    })
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
  background: #f5f5f5;
  color: #000;
}
.line-height-tight {
  line-height: 1.2;
}
</style>
