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

        <!-- Search Filter -->
        <div class="q-px-md q-pt-sm q-pb-md">
          <q-input 
            v-model="searchQuery" 
            dense 
            outlined 
            placeholder="Search menu..." 
            class="bg-white"
          >
            <template v-slot:prepend>
              <q-icon name="search" size="xs" class="text-grey-5"/>
            </template>
            <template v-slot:append v-if="searchQuery">
              <q-icon name="close" size="xs" class="cursor-pointer" @click="searchQuery = ''" />
            </template>
          </q-input>
        </div>

        <div class="q-pa-md">
          <!-- Dynamic Menu Sections -->
          <SidebarSection 
            v-for="section in filteredMenuSections" 
            :key="section.title" 
            :title="section.title" 
            :icon="section.icon"
          >
            <q-item 
              v-for="item in section.items" 
              :key="item.path"
              clickable 
              v-ripple 
              active-class="bg-grey-2 text-primary" 
              :active="route.path === item.path" 
              :to="item.path" 
              class="rounded-borders q-mb-xs"
            >
              <q-item-section avatar>
                <q-icon :name="item.icon" size="20px" />
              </q-item-section>
              <q-item-section class="text-weight-medium">
                {{ item.label }}
              </q-item-section>
              <q-item-section side v-if="item.badge && stats[item.badge] > 0">
                <q-badge :color="item.badgeColor" :label="stats[item.badge]" rounded />
              </q-item-section>
            </q-item>
          </SidebarSection>
          
          <!-- Show when no results -->
          <div v-if="searchQuery && filteredMenuSections.length === 0" class="text-center text-grey-6 q-pa-md">
             <q-icon name="search_off" size="sm" />
             <div class="text-caption q-mt-xs">No menu items found</div>
          </div>

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
        
        <!-- Mini Stats Panel (Bottom) -->
        <QuickStats :stats="{
          monthlyIncome: '125K',
          attendanceRate: '85',
          totalDue: '45K', 
          activeStudents: stats.totalStudents // Using real count here
        }"/>
        
      </q-scroll-area>
    </q-drawer>

    <!-- Page Content -->
    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import { useAppStore } from 'src/stores/app'
import { storeToRefs } from 'pinia'
import GradeFilter from 'src/components/Sidebar/GradeFilter.vue'
import SidebarSection from 'src/components/Sidebar/SidebarSection.vue'
import QuickStats from 'src/components/Sidebar/QuickStats.vue'

const authStore = useAuthStore()
const appStore = useAppStore()
const { selectedGrade } = storeToRefs(appStore)

const leftDrawerOpen = ref(false)
const searchQuery = ref('')
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

// Define Menu Structure
const groupedMenuItems = [
  {
    title: 'OVERVIEW',
    icon: 'dashboard',
    items: [
      { label: 'Dashboard', icon: 'dashboard', path: '/dashboard', badge: 'newStudents', badgeColor: 'blue' }
    ]
  },
  {
    title: 'STUDENT MANAGEMENT',
    icon: 'groups',
    items: [
      { label: 'Students', icon: 'school', path: '/dashboard/students', badge: 'totalStudents', badgeColor: 'blue-grey' },
      { label: 'Attendance', icon: 'fact_check', path: '/dashboard/attendance', badge: 'pendingAttendance', badgeColor: 'orange' }
    ]
  },
  {
    title: 'ACADEMICS',
    icon: 'menu_book',
    items: [
      { label: 'Classes', icon: 'calendar_month', path: '/dashboard/classes', badge: 'activeClasses', badgeColor: 'green' },
      { label: 'Subjects', icon: 'library_books', path: '/dashboard/subjects' },
      { label: 'Resources', icon: 'folder', path: '/dashboard/resources' },
      { label: 'Exams', icon: 'assignment_turned_in', path: '/dashboard/exams', badge: 'upcomingExams', badgeColor: 'red' },
      { label: 'Assignments', icon: 'assignment', path: '/dashboard/assignments' },
      { label: 'Communication', icon: 'campaign', path: '/dashboard/communication' }
    ]
  },
  {
    title: 'FINANCIAL',
    icon: 'account_balance_wallet',
    items: [
      { label: 'Payments', icon: 'payments', path: '/dashboard/payments', badge: 'pendingPayments', badgeColor: 'orange' }
    ]
  },
  {
    title: 'ADMINISTRATION',
    icon: 'admin_panel_settings',
    items: [
      { label: 'Users', icon: 'group', path: '/dashboard/users' },
      { label: 'Roles', icon: 'admin_panel_settings', path: '/dashboard/roles' }
    ]
  }
]

// Computed property for Search
const filteredMenuSections = computed(() => {
  if (!searchQuery.value) return groupedMenuItems

  const query = searchQuery.value.toLowerCase()
  
  return groupedMenuItems.map(section => {
    // Check if section title matches
    const titleMatch = section.title.toLowerCase().includes(query)
    
    // Filter items
    const filteredItems = section.items.filter(item => 
      item.label.toLowerCase().includes(query)
    )

    // Return section if title matches or has matching items
    if (titleMatch || filteredItems.length > 0) {
      return {
        ...section,
        // If title matched, show all items. If only items matched, show only them.
        items: titleMatch ? section.items : filteredItems
      }
    }
    return null
  }).filter(Boolean) // Remove null sections
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
