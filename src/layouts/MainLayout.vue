<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          LMS Portal
        </q-toolbar-title>

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat icon="notifications">
            <q-badge color="red" text-color="white" floating>2</q-badge>
          </q-btn>
          <q-btn round flat>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item clickable v-close-popup @click="logout">
                  <q-item-section>Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Sidebar -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <div class="q-pa-md text-center">
        <q-avatar size="80px" class="q-mb-sm">
          <img src="https://cdn.quasar.dev/img/boy-avatar.png">
        </q-avatar>
        <div class="text-weight-bold">{{ userProfile?.name || 'User' }}</div>
        <div class="text-caption text-grey">{{ userProfile?.role?.toUpperCase() || 'GUEST' }}</div>
      </div>

      <q-separator />

      <q-list class="q-mt-md">
        <!-- Student Links -->
        <template v-if="isStudent">
            <q-item to="/student/dashboard" active-class="text-primary bg-blue-1" clickable v-ripple>
                <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
                <q-item-section>Dashboard</q-item-section>
            </q-item>
            <q-item to="/student/courses" active-class="text-primary bg-blue-1" clickable v-ripple>
                <q-item-section avatar><q-icon name="library_books" /></q-item-section>
                <q-item-section>My Courses</q-item-section>
            </q-item>
            <q-item to="/student/catalog" active-class="text-primary bg-blue-1" clickable v-ripple>
                <q-item-section avatar><q-icon name="shopping_cart" /></q-item-section>
                <q-item-section>Course Catalog</q-item-section>
            </q-item>
        </template>

        <!-- Teacher Links -->
        <template v-if="isTeacher">
            <q-item to="/teacher/dashboard" active-class="text-primary bg-blue-1" clickable v-ripple>
                <q-item-section avatar><q-icon name="analytics" /></q-item-section>
                <q-item-section>Dashboard</q-item-section>
            </q-item>
            <q-item to="/teacher/classes" active-class="text-primary bg-blue-1" clickable v-ripple>
                <q-item-section avatar><q-icon name="class" /></q-item-section>
                <q-item-section>My Classes</q-item-section>
            </q-item>
        </template>

        <!-- Admin Links -->
        <template v-if="isAdmin">
            <q-item to="/admin/dashboard" active-class="text-primary bg-blue-1" clickable v-ripple>
                <q-item-section avatar><q-icon name="admin_panel_settings" /></q-item-section>
                <q-item-section>Admin Overview</q-item-section>
            </q-item>
            <q-item to="/admin/users" active-class="text-primary bg-blue-1" clickable v-ripple>
                <q-item-section avatar><q-icon name="people" /></q-item-section>
                <q-item-section>Users</q-item-section>
            </q-item>
             <q-item to="/admin/courses" active-class="text-primary bg-blue-1" clickable v-ripple>
                <q-item-section avatar><q-icon name="school" /></q-item-section>
                <q-item-section>Manage Courses</q-item-section>
            </q-item>
        </template>
      </q-list>
    </q-drawer>

    <!-- Page Content -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth' // Assuming you have this

const router = useRouter()
const authStore = useAuthStore()

const leftDrawerOpen = ref(false)

const userProfile = computed(() => authStore.profile)
const isStudent = computed(() => userProfile.value?.role === 'student' || true) // fallback for dev
const isTeacher = computed(() => userProfile.value?.role === 'teacher')
const isAdmin = computed(() => userProfile.value?.role === 'admin')

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

async function logout() {
  await authStore.signOut()
  router.push('/login')
}
</script>
