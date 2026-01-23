<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">

    <q-header class="bg-white text-dark shadow-1" height-hint="64">
      <q-toolbar class="q-py-sm q-px-md">
        <q-btn flat round dense icon="menu" class="lt-md" @click="toggleLeftDrawer" />

        <q-toolbar-title class="text-weight-bold font-outfit text-primary q-ml-md">
            Tuition<span class="text-dark">App</span>
        </q-toolbar-title>

        <!-- Search Bar (Hidden on small screens) -->
        <q-input 
            dense 
            outlined 
            v-model="search" 
            placeholder="Search for lessons..." 
            class="gt-sm q-ml-xl" 
            style="width: 300px" 
            bg-color="grey-1"
            rounded
        >
            <template v-slot:prepend>
                <q-icon name="search" color="grey-5" />
            </template>
        </q-input>

        <q-space />

        <div class="row items-center q-gutter-sm">
            <!-- Dark Mode Toggle -->
            <q-btn flat round :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'" color="grey-7" @click="toggleDark" />

            <!-- Notifications -->
            <q-btn flat round color="grey-7" icon="notifications">
                <q-badge color="red" floating>3</q-badge>
            </q-btn>

            <!-- Profile -->
            <q-btn flat no-caps no-wrap class="q-ml-sm">
                 <q-avatar size="32px">
                    <img src="https://cdn.quasar.dev/img/boy-avatar.png">
                 </q-avatar>
                 <q-icon name="arrow_drop_down" size="16px" />

                 <q-menu>
                    <q-list style="min-width: 150px">
                        <q-item clickable v-close-popup>
                            <q-item-section>Profile</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup>
                            <q-item-section>Settings</q-item-section>
                        </q-item>
                        <q-separator />
                         <q-item clickable v-close-popup @click="logout" class="text-red">
                            <q-item-section>Logout</q-item-section>
                        </q-item>
                    </q-list>
                 </q-menu>
            </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" bordered class="bg-white">
      <div class="column full-height">
        <div class="q-pa-md row items-center">
             <q-icon name="school" size="32px" color="primary" />
             <div class="text-h6 font-outfit q-ml-sm text-weight-bold">Student<span class="text-primary">Portal</span></div>
        </div>

        <q-list padding class="q-mt-md">
            <q-item clickable v-ripple to="/student" active-class="text-primary bg-blue-1">
                <q-item-section avatar>
                    <q-icon name="dashboard" />
                </q-item-section>
                <q-item-section class="text-weight-bold">Dashboard</q-item-section>
            </q-item>

             <q-item clickable v-ripple to="/student/courses" active-class="text-primary bg-blue-1">
                <q-item-section avatar>
                    <q-icon name="menu_book" />
                </q-item-section>
                <q-item-section class="text-weight-bold">My Courses</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/student/assignments" active-class="text-primary bg-blue-1">
                <q-item-section avatar>
                    <q-icon name="assignment" />
                </q-item-section>
                <q-item-section class="text-weight-bold">Assignments</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/student/grades" active-class="text-primary bg-blue-1">
                <q-item-section avatar>
                    <q-icon name="grade" />
                </q-item-section>
                <q-item-section class="text-weight-bold">Grades</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/student/schedule" active-class="text-primary bg-blue-1">
                <q-item-section avatar>
                    <q-icon name="event" />
                </q-item-section>
                <q-item-section class="text-weight-bold">Schedule</q-item-section>
            </q-item>
        </q-list>

        <q-space />

         <q-list padding class="q-mb-md">
             <q-item clickable v-ripple to="/student/settings" active-class="text-primary bg-blue-1">
                <q-item-section avatar>
                    <q-icon name="settings" />
                </q-item-section>
                <q-item-section class="text-weight-bold">Settings</q-item-section>
            </q-item>
            
            <q-item clickable v-ripple @click="logout" class="text-red-7">
                <q-item-section avatar>
                    <q-icon name="logout" />
                </q-item-section>
                <q-item-section class="text-weight-bold">Logout</q-item-section>
            </q-item>
         </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from 'boot/supabase'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

const studentProfile = ref(null)
const leftDrawerOpen = ref(true)
const search = ref('')

const userInitials = computed(() => {
    if (!studentProfile.value?.full_name) return 'ST'
    const parts = studentProfile.value.full_name.split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length-1][0]).toUpperCase()
    return parts[0][0].toUpperCase()
})

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function toggleDark() {
    $q.dark.toggle()
}

async function fetchProfile() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      studentProfile.value = profile
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
  }
}

async function logout() {
  await supabase.auth.signOut()
  router.push('/login')
  $q.notify({ type: 'positive', message: 'Logged out' })
}

onMounted(() => {
    fetchProfile()
})
</script>

<style lang="scss">
.font-outfit {
  font-family: 'Outfit', sans-serif;
}

// Dark Mode Overrides
.body--dark {
    .q-layout {
        background-color: #111827 !important; // Deep Dark Blue
    }
    .q-header {
        background-color: #1F2937 !important; // Slightly lighter
        color: #F9FAFB !important;
    }
    .q-drawer {
        background-color: #1F2937 !important;
        border-right: 1px solid #374151;
            
        .q-item {
             color: #D1D5DB;
             &.q-router-link--active {
                 color: #3B82F6 !important; // Brighter Blue
                 background-color: rgba(59, 130, 246, 0.15) !important;
             }
        }
    }
}
</style>
