<template>
  <q-layout view="lHh LpR fFf" class="bg-gray-soft">
    <!-- Accessibility: Skip Link -->
    <a href="#main-content" class="skip-to-main">Skip to main content</a>

    <!-- Top Bar: Clean & Minimal -->
    <q-header class="header-light text-slate-900" height-hint="72" elevated>
      <q-toolbar class="q-py-md q-px-xl">
        <q-btn flat round dense icon="menu" class="lt-md q-mr-sm" @click="toggleLeftDrawer" />
        
        <div class="row items-center gt-sm">
             <div class="text-h6 font-outfit text-weight-black tracking-tighter">
                ELEVATE<span class="text-blue-600">.</span>
             </div>
        </div>

        <q-space />

        <!-- Search bar: SaaS Styled -->
        <div class="gt-xs relative-position q-mr-md" style="width: 350px">
            <q-input 
                dense 
                borderless
                v-model="search" 
                placeholder="Search courses, lessons..." 
                class="bg-slate-50 rounded-xl q-px-md overflow-hidden" 
                input-class="text-weight-medium"
            >
                <template v-slot:prepend>
                    <q-icon name="search" size="20px" class="text-slate-400" />
                </template>
            </q-input>
        </div>

        <div class="row items-center q-gutter-md">
            <!-- Theme Toggle -->
            <q-btn flat round :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'" size="12px" class="text-slate-500 hover:bg-slate-50" @click="toggleDark" />

            <!-- Notifications Component -->
            <NotificationBell />

            <q-separator vertical inset class="q-mx-sm bg-slate-100" />

            <!-- Profile Dropdown -->
            <q-btn flat no-caps no-wrap class="q-pl-sm hover:bg-slate-50 rounded-lg">
                 <div class="row items-center no-wrap">
                    <div class="text-right q-mr-sm gt-xs">
                        <div class="text-weight-bold text-caption text-slate-900 line-height-1">{{ authStore.profile?.full_name || 'Student' }}</div>
                        <div class="text-grey-6 text-caption text-weight-medium text-capitalize" style="font-size: 10px">{{ authStore.profile?.role || 'Member' }}</div>
                    </div>
                    <q-avatar size="36px" class="shadow-sm border-white border-2">
                        <img :src="`https://ui-avatars.com/api/?name=${authStore.profile?.full_name || 'User'}&background=3b82f6&color=fff`">
                    </q-avatar>
                 </div>
                 <q-icon name="keyboard_arrow_down" size="16px" class="text-slate-400 q-ml-xs" />

                 <q-menu transition-show="jump-down" transition-hide="jump-up" class="rounded-xl shadow-xl border-slate-50">
                    <q-list style="min-width: 200px" class="q-pa-sm">
                        <q-item clickable v-close-popup class="rounded-lg">
                            <q-item-section avatar><q-icon name="person_outline" size="20px" /></q-item-section>
                            <q-item-section class="text-weight-medium">My Profile</q-item-section>
                        </q-item>
                         <q-item clickable v-close-popup class="rounded-lg">
                            <q-item-section avatar><q-icon name="settings" size="20px" /></q-item-section>
                            <q-item-section class="text-weight-medium">Account Settings</q-item-section>
                        </q-item>
                        <q-separator class="q-my-sm" />
                         <q-item clickable v-close-popup @click="logout" class="text-red rounded-lg">
                            <q-item-section avatar><q-icon name="logout" size="20px" /></q-item-section>
                            <q-item-section class="text-weight-bold">Sign Out</q-item-section>
                        </q-item>
                    </q-list>
                 </q-menu>
            </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Sidebar: Modern SaaS Style -->
    <q-drawer v-model="leftDrawerOpen" side="left" bordered :width="280" class="bg-white border-r border-slate-100">
      <div class="column full-height q-pa-lg">
        
        <!-- Logo for Sidebar -->
        <div class="row items-center q-mb-xl q-px-sm justify-between">
             <div class="text-h5 font-outfit text-weight-black tracking-tighter">
                ELEVATE<span class="text-blue-600">.</span>
             </div>
             <q-btn flat round dense icon="chevron_left" class="lt-md" @click="toggleLeftDrawer" />
        </div>

        <!-- Navigation Menu -->
        <q-list class="q-gutter-y-sm">
            <q-item clickable v-ripple to="/student" class="nav-item" active-class="nav-item--active">
                <q-item-section avatar>
                    <q-icon name="grid_view" />
                </q-item-section>
                <q-item-section class="text-weight-bold">Overview</q-item-section>
            </q-item>

             <q-item clickable v-ripple to="/student/courses" class="nav-item" active-class="nav-item--active">
                <q-item-section avatar>
                    <q-icon name="auto_stories" />
                </q-item-section>
                <q-item-section class="text-weight-bold">Courses</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/student/assignments" class="nav-item" active-class="nav-item--active">
                <q-item-section avatar>
                    <q-icon name="assignment_turned_in" />
                </q-item-section>
                <q-item-section class="text-weight-bold">Assignments</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/student/grades" class="nav-item" active-class="nav-item--active">
                <q-item-section avatar>
                    <q-icon name="bar_chart" />
                </q-item-section>
                <q-item-section class="text-weight-bold">Performance</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/student/schedule" class="nav-item" active-class="nav-item--active">
                <q-item-section avatar>
                    <q-icon name="calendar_today" />
                </q-item-section>
                <q-item-section class="text-weight-bold">Calendar</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/student/payments" class="nav-item" active-class="nav-item--active">
                <q-item-section avatar>
                    <q-icon name="payments" />
                </q-item-section>
                <q-item-section class="text-weight-bold">Payments</q-item-section>
            </q-item>
        </q-list>

        <q-space />

         <!-- Bottom Navigation -->
         <q-list class="q-gutter-y-sm q-mb-md">
             <q-item clickable v-ripple to="/student/settings" class="nav-item" active-class="nav-item--active">
                <q-item-section avatar>
                    <q-icon name="tune" />
                </q-item-section>
                <q-item-section class="text-weight-bold">Settings</q-item-section>
            </q-item>
            
            <q-item clickable v-ripple @click="logout" class="nav-item text-red-5">
                <q-item-section avatar>
                    <q-icon name="logout" />
                </q-item-section>
                <q-item-section class="text-weight-bold">Logout</q-item-section>
            </q-item>
         </q-list>

         <!-- Sidebar Footer: Upgrade Promo -->
         <div class="bg-blue-600 rounded-2xl q-pa-md text-white q-mt-md relative-position overflow-hidden shadow-2xl">
             <q-icon name="auto_awesome" class="absolute shadow-none opacity-20" size="60px" style="top: -10px; right: -10px" />
             <div class="text-weight-bold q-mb-xs">Unlock Pro!</div>
             <div class="text-caption opacity-80 q-mb-sm">Get AI tutoring and deep analytics.</div>
             <q-btn unelevated color="white" text-color="blue-600" label="Go Pro" no-caps class="full-width rounded-lg text-weight-black" size="sm" />
         </div>
      </div>
    </q-drawer>

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
            <q-route-tab to="/student" icon="grid_view" label="One" class="q-px-none" no-caps>
                <div class="text-caption" style="font-size: 10px; line-height: 1;">Home</div>
            </q-route-tab>
            <q-route-tab to="/student/courses" icon="auto_stories" class="q-px-none" no-caps>
                <div class="text-caption" style="font-size: 10px; line-height: 1;">Courses</div>
            </q-route-tab>
            <q-route-tab to="/student/assignments" icon="assignment_turned_in" class="q-px-none" no-caps>
                <div class="text-caption" style="font-size: 10px; line-height: 1;">Tasks</div>
            </q-route-tab>
            <q-route-tab to="/student/schedule" icon="calendar_today" class="q-px-none" no-caps>
                <div class="text-caption" style="font-size: 10px; line-height: 1;">Date</div>
            </q-route-tab>
            <q-route-tab to="/student/settings" icon="person" class="q-px-none" no-caps>
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
import NotificationBell from 'src/components/NotificationBell.vue'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const authStore = useAuthStore()
const appStore = useAppStore()

const leftDrawerOpen = ref(true)
const search = ref('')
const loading = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function toggleDark() {
    $q.dark.toggle()
}

async function logout() {
  try {
    console.log('Starting logout...')
    loading.value = true
    
    await authStore.signOut()
    console.log('Sign out successful')
    
    // Clear any local storage
    localStorage.clear()
    sessionStorage.clear()
    
    $q.notify({ 
      type: 'positive', 
      message: 'Logged out successfully',
      position: 'top'
    })
    
    // Force navigation to login
    await router.push('/login')
    console.log('Redirected to login')
    
    // Force page reload to clear all state
    window.location.reload()
  } catch (error) {
    console.error('Logout error:', error)
    $q.notify({ 
      type: 'negative', 
      message: 'Logout failed. Please try again.',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
    appStore.initData()
})
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Inter:wght@100..900&display=swap');

.font-outfit {
  font-family: 'Outfit', sans-serif;
}

body {
    font-family: 'Inter', sans-serif;
}

.bg-gray-soft {
    background-color: #F8FAFC; // bg-slate-50
}

.line-height-1 {
    line-height: 1.2;
}

.tracking-tighter {
    letter-spacing: -0.05em;
}

// Modern Light Mode Header
.header-light {
    background: rgba(255, 255, 255, 0.85) !important;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(226, 232, 240, 0.8);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
}

// SaaS Navigation Item Styles
.nav-item {
    border-radius: 12px;
    color: #64748B; // text-slate-500
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 12px 16px;
    margin: 4px 0;
    position: relative;
    overflow: hidden;
    
    .q-icon {
        font-size: 22px;
        transition: all 0.3s ease;
    }

    &:hover:not(&--active) {
        background: #F8FAFC; // bg-slate-50
        color: #0F172A; // text-slate-900
        transform: translateX(6px);
        
        .q-icon {
            color: #2563EB;
            transform: scale(1.1);
        }
    }

    &--active {
        background: #EFF6FF !important; // bg-blue-50 (Light Mode Rule)
        color: #2563EB !important;
        font-weight: 700;
        
        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 15%;
            height: 70%;
            width: 4px;
            background: #2563EB;
            border-radius: 0 4px 4px 0;
            box-shadow: 2px 0 8px rgba(37, 99, 235, 0.4);
        }

        .q-icon {
            color: #2563EB !important;
        }
    }
}

// Dark Mode Overrides: SaaS Refinement
.body--dark {
    .bg-gray-soft {
        background-color: #0f172a !important; // slate-900
    }
    .q-layout {
        background-color: #0f172a !important;
    }
    .q-header, .header-light {
        background: rgba(30, 41, 59, 0.9) !important; // slate-800 with opacity
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-bottom: 1px solid #334155;
        color: #f1f5f9 !important;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
    }
    .q-drawer {
        background-color: #1e293b !important; // slate-800
        border-right-color: #334155;
            
        .text-slate-900, .text-dark {
            color: #f1f5f9 !important;
        }

        .nav-item {
            color: #94a3b8;
            &:hover:not(&--active) {
                background: #334155;
                color: white;
            }
        }
    }
    
    .bg-white {
        background-color: #1e293b !important;
    }
    
    .bg-slate-50 {
        background-color: #0f172a !important;
    }
}
</style>
