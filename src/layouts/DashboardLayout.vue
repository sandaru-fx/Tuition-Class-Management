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
             <span class="text-weight-bold text-body2 line-height-tight">{{ authStore.profile?.full_name || 'User' }}</span>
             <span class="text-caption text-grey-6 text-capitalize line-height-tight">{{ authStore.profile?.role || 'Member' }}</span>
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
        <!-- Grade Filter -->
        <GradeFilter />

        <div class="q-pa-md">
          <!-- Overview Section -->
          <SidebarSection title="OVERVIEW" icon="dashboard">
            <q-item clickable v-ripple active-class="bg-grey-2 text-primary" :active="route.path === '/dashboard'" to="/dashboard" class="rounded-borders q-mb-xs">
              <q-item-section avatar>
                <q-icon name="dashboard" size="20px" />
              </q-item-section>
              <q-item-section class="text-weight-medium">Dashboard</q-item-section>
              <q-item-section side v-if="stats.newStudents > 0">
                <q-badge color="blue" :label="stats.newStudents" rounded />
              </q-item-section>
            </q-item>
          </SidebarSection>

          <!-- Student Management Section -->
          <SidebarSection title="STUDENT MANAGEMENT" icon="groups">
            <q-item clickable v-ripple active-class="bg-grey-2 text-primary" :active="route.path === '/dashboard/students'" to="/dashboard/students" class="rounded-borders q-mb-xs">
              <q-item-section avatar>
                <q-icon name="school" size="20px" />
              </q-item-section>
              <q-item-section class="text-weight-medium">Students</q-item-section>
              <q-item-section side v-if="stats.totalStudents > 0">
                <q-badge color="blue-grey" :label="stats.totalStudents" rounded />
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple active-class="bg-grey-2 text-primary" :active="route.path === '/dashboard/attendance'" to="/dashboard/attendance" class="rounded-borders q-mb-xs">
              <q-item-section avatar>
                <q-icon name="fact_check" size="20px" />
              </q-item-section>
              <q-item-section class="text-weight-medium">Attendance</q-item-section>
              <q-item-section side v-if="stats.pendingAttendance > 0">
                <q-badge color="orange" :label="stats.pendingAttendance" rounded />
              </q-item-section>
            </q-item>
          </SidebarSection>

          <!-- Academics Section -->
          <SidebarSection title="ACADEMICS" icon="menu_book">
            <q-item clickable v-ripple active-class="bg-grey-2 text-primary" :active="route.path === '/dashboard/classes'" to="/dashboard/classes" class="rounded-borders q-mb-xs">
              <q-item-section avatar>
                <q-icon name="calendar_month" size="20px" />
              </q-item-section>
              <q-item-section class="text-weight-medium">Classes</q-item-section>
              <q-item-section side v-if="stats.activeClasses > 0">
                <q-badge color="green" :label="stats.activeClasses" rounded />
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple active-class="bg-grey-2 text-primary" :active="route.path === '/dashboard/exams'" to="/dashboard/exams" class="rounded-borders q-mb-xs">
              <q-item-section avatar>
                <q-icon name="assignment_turned_in" size="20px" />
              </q-item-section>
              <q-item-section class="text-weight-medium">Exams</q-item-section>
              <q-item-section side v-if="stats.upcomingExams > 0">
                <q-badge color="red" :label="stats.upcomingExams" rounded />
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple active-class="bg-grey-2 text-primary" :active="route.path === '/dashboard/communication'" to="/dashboard/communication" class="rounded-borders q-mb-xs">
              <q-item-section avatar>
                <q-icon name="campaign" size="20px" />
              </q-item-section>
              <q-item-section class="text-weight-medium">Communication</q-item-section>
            </q-item>
          </SidebarSection>

          <!-- Financial Section -->
          <SidebarSection title="FINANCIAL" icon="account_balance_wallet">
            <q-item clickable v-ripple active-class="bg-grey-2 text-primary" :active="route.path === '/dashboard/payments'" to="/dashboard/payments" class="rounded-borders q-mb-xs">
              <q-item-section avatar>
                <q-icon name="payments" size="20px" />
              </q-item-section>
              <q-item-section class="text-weight-medium">Payments</q-item-section>
              <q-item-section side v-if="stats.pendingPayments > 0">
                <q-badge color="orange" :label="stats.pendingPayments" rounded />
              </q-item-section>
            </q-item>
          </SidebarSection>

          <!-- Administration Section -->
          <SidebarSection title="ADMINISTRATION" icon="admin_panel_settings">
            <q-item clickable v-ripple active-class="bg-grey-2 text-primary" :active="route.path === '/dashboard/users'" to="/dashboard/users" class="rounded-borders q-mb-xs">
              <q-item-section avatar>
                <q-icon name="group" size="20px" />
              </q-item-section>
              <q-item-section class="text-weight-medium">Users</q-item-section>
            </q-item>

            <q-item clickable v-ripple active-class="bg-grey-2 text-primary" :active="route.path === '/dashboard/roles'" to="/dashboard/roles" class="rounded-borders q-mb-xs">
              <q-item-section avatar>
                <q-icon name="admin_panel_settings" size="20px" />
              </q-item-section>
              <q-item-section class="text-weight-medium">Roles</q-item-section>
            </q-item>
          </SidebarSection>

          <!-- Settings Section -->
          <div class="q-mt-xl">
            <div class="text-overline text-grey-6 q-mb-sm q-pl-sm" style="font-size: 11px; letter-spacing: 0.5px;">SETTINGS</div>
            <q-list padding class="menu-list">
              <q-item clickable v-ripple to="/dashboard/profile" class="rounded-borders q-mb-xs">
                <q-item-section avatar>
                  <q-icon name="person" size="20px" />
                </q-item-section>
                <q-item-section class="text-weight-medium">Profile</q-item-section>
              </q-item>

              <q-item clickable v-ripple @click="handleLogout" class="rounded-borders q-mb-xs text-red-7">
                <q-item-section avatar>
                  <q-icon name="logout" size="20px" />
                </q-item-section>
                <q-item-section class="text-weight-medium">Logout</q-item-section>
              </q-item>
            </q-list>
          </div>
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
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import { useAppStore } from 'src/stores/app'
import { storeToRefs } from 'pinia'
import GradeFilter from 'src/components/Sidebar/GradeFilter.vue'
import SidebarSection from 'src/components/Sidebar/SidebarSection.vue'

const authStore = useAuthStore()
const appStore = useAppStore()
const { selectedGrade } = storeToRefs(appStore)

const leftDrawerOpen = ref(false)
const router = useRouter()
const route = useRoute()
const $q = useQuasar()

// Mock stats for sidebar badges
const stats = ref({
  newStudents: 0,
  totalStudents: 0,
  activeClasses: 0,
  upcomingExams: 0,
  pendingAttendance: 0,
  pendingPayments: 0
})

// Simulate fetching stats based on filter
function fetchStats() {
    // In production, this would be an API call passing 'selectedGrade'
    // simulating different data for different grades
    if (selectedGrade.value === 'all') {
        stats.value = { newStudents: 15, totalStudents: 142, activeClasses: 12, upcomingExams: 3, pendingAttendance: 5, pendingPayments: 23 }
    } else if (selectedGrade.value === 'primary') {
        stats.value = { newStudents: 4, totalStudents: 45, activeClasses: 4, upcomingExams: 0, pendingAttendance: 1, pendingPayments: 5 }
    } else if (['10', '11', 'ol'].includes(selectedGrade.value)) {
        stats.value = { newStudents: 2, totalStudents: 62, activeClasses: 5, upcomingExams: 2, pendingAttendance: 3, pendingPayments: 12 }
    } else {
        // Random variations for specific grades
        stats.value = { 
            newStudents: Math.floor(Math.random() * 5), 
            totalStudents: Math.floor(Math.random() * 30), 
            activeClasses: Math.floor(Math.random() * 4), 
            upcomingExams: Math.floor(Math.random() * 2), 
            pendingAttendance: Math.floor(Math.random() * 2), 
            pendingPayments: Math.floor(Math.random() * 8) 
        }
    }
}

watch(selectedGrade, () => {
    fetchStats()
})

onMounted(() => {
  appStore.initData()
  fetchStats()
})

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}



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
  background: #f5f5f5;
  color: #000;
}
.line-height-tight {
  line-height: 1.2;
}
</style>
