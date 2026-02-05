<template>
  <q-page class="q-pa-lg bg-slate-50">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold text-slate-800 font-outfit">My Classes</div>
        <div class="text-subtitle1 text-slate-500">Manage your ongoing classes and schedules</div>
      </div>
      <!-- Teachers cannot create classes, only Admin can -->
      <q-btn 
        flat 
        color="blue-600" 
        icon="calendar_view_week" 
        label="Timetable View" 
        no-caps 
        class="rounded-borders"
        @click="showTimetable = !showTimetable"
      />
    </div>

    <!-- Filters Section -->
    <q-card class="q-mb-lg shadow-sm rounded-xl">
      <q-card-section class="q-pa-md">
        <div class="row q-col-gutter-md items-center">
          <!-- Search -->
          <div class="col-12 col-md-4">
            <q-input
              v-model="filters.search"
              outlined
              dense
              placeholder="Search by subject or class name..."
              class="rounded-borders"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <!-- Grade Filter -->
          <div class="col-6 col-md-2">
            <q-select
              v-model="filters.grade"
              :options="gradeOptions"
              outlined
              dense
              label="Grade"
              clearable
              class="rounded-borders"
            />
          </div>

          <!-- Day Filter -->
          <div class="col-6 col-md-3">
            <q-select
              v-model="filters.day"
              :options="dayOptions"
              outlined
              dense
              label="Day of Week"
              clearable
              class="rounded-borders"
            />
          </div>

          <!-- View Toggle -->
          <div class="col-12 col-md-3 text-right">
            <q-btn-toggle
              v-model="viewMode"
              toggle-color="blue-600"
              :options="[
                { label: 'Grid', value: 'grid', icon: 'grid_view' },
                { label: 'List', value: 'list', icon: 'view_list' }
              ]"
              no-caps
              unelevated
              class="rounded-borders"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Loading State -->
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner color="blue-600" size="3em" />
      <div class="text-slate-500 q-mt-md">Loading your classes...</div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredClasses.length === 0" class="text-center q-pa-xl">
      <q-icon name="calendar_today" size="80px" color="grey-4" />
      <div class="text-h6 text-slate-600 q-mt-md">No classes found</div>
      <div class="text-caption text-slate-400" v-if="hasFilters">Try adjusting your filters</div>
      <div class="text-caption text-slate-400" v-else>Contact admin to assign classes</div>
    </div>

    <!-- Grid View -->
    <div v-else-if="viewMode === 'grid'" class="row q-col-gutter-lg">
      <div v-for="cls in filteredClasses" :key="cls.id" class="col-12 col-md-6 col-lg-4">
        <q-card 
          class="bg-white shadow-sm rounded-xl hover-lift cursor-pointer transition-all border-bottom-blue h-100"
          @click="openClassDetail(cls.id)"
        >
          <q-card-section>
            <div class="row justify-between items-start">
              <div class="col">
                <q-badge color="blue-1" text-color="blue-8" :label="`Grade ${cls.grade}`" class="q-mb-sm font-weight-bold" />
                <div class="text-h6 text-weight-bold text-slate-800 q-mb-xs">{{ cls.subject?.name }}</div>
                <div class="text-caption text-slate-500 q-mb-xs">{{ cls.name }}</div>
                <div class="text-caption text-slate-500 flex items-center">
                  <q-icon name="schedule" class="q-mr-xs" size="14px"/>
                  {{ cls.day_of_week }} • {{ formatTime(cls.start_time) }} - {{ formatTime(cls.end_time) }}
                </div>
              </div>
              <q-avatar size="48px" font-size="24px" color="blue-50" text-color="blue-600" icon="class" rounded />
            </div>
          </q-card-section>

          <q-separator color="grey-2" />

          <q-card-actions align="between" class="q-px-md q-py-md bg-grey-1-light">
            <div class="text-caption text-slate-600 flex items-center">
              <q-icon name="groups" class="q-mr-xs" />
              <strong>{{ cls.student_count || 0 }}</strong> Students
            </div>
            <div class="text-caption text-slate-600 flex items-center">
              <q-icon name="meeting_room" class="q-mr-xs" />
              {{ cls.hall?.name || 'TBA' }}
            </div>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="column q-gutter-md">
      <q-card 
        v-for="cls in filteredClasses" 
        :key="cls.id"
        flat
        class="bg-white shadow-sm rounded-xl hover-lift cursor-pointer transition-all"
        @click="openClassDetail(cls.id)"
      >
        <q-card-section class="row items-center q-pa-md">
          <!-- Icon -->
          <div class="col-auto q-mr-md">
            <q-avatar size="56px" color="blue-50" text-color="blue-600" icon="class" rounded />
          </div>

          <!-- Class Info -->
          <div class="col">
            <div class="row items-center q-mb-xs">
              <q-badge color="blue-1" text-color="blue-8" :label="`Grade ${cls.grade}`" class="q-mr-sm" />
              <div class="text-h6 text-weight-bold text-slate-800">{{ cls.subject?.name }}</div>
            </div>
            <div class="text-body2 text-slate-600 q-mb-xs">{{ cls.name }}</div>
            <div class="text-caption text-slate-500 flex items-center">
              <q-icon name="schedule" class="q-mr-xs" size="14px"/>
              {{ cls.day_of_week }} • {{ formatTime(cls.start_time) }} - {{ formatTime(cls.end_time) }}
              <q-separator vertical inset class="q-mx-sm" />
              <q-icon name="meeting_room" class="q-mr-xs" size="14px" />
              {{ cls.hall?.name || 'TBA' }}
            </div>
          </div>

          <!-- Stats -->
          <div class="col-auto text-right">
            <div class="text-h5 text-weight-bold text-blue-600">{{ cls.student_count || 0 }}</div>
            <div class="text-caption text-slate-400">Students</div>
          </div>

          <!-- Action -->
          <div class="col-auto q-ml-md">
            <q-btn
              flat
              round
              dense
              icon="chevron_right"
              color="slate-400"
              size="12px"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Timetable Dialog -->
    <q-dialog v-model="showTimetable" maximized>
      <q-card>
        <q-toolbar class="bg-blue-600 text-white">
          <q-toolbar-title class="font-outfit">My Weekly Timetable</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-pa-lg">
          <div class="text-center q-pa-xl text-grey-5">
            <q-icon name="calendar_view_week" size="64px" />
            <div class="text-h6 q-mt-md">Timetable View Coming Soon!</div>
            <div class="text-caption">Will show weekly grid with all your classes</div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { teacherService } from 'src/services/teacherService'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

const classes = ref([])
const loading = ref(true)
const viewMode = ref('grid')
const showTimetable = ref(false)

const filters = ref({
  search: '',
  grade: null,
  day: null
})

const gradeOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13']
const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Filtered classes based on search + filters
const filteredClasses = computed(() => {
  let result = classes.value

  // Search filter
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(cls => 
      cls.subject?.name?.toLowerCase().includes(search) ||
      cls.name?.toLowerCase().includes(search)
    )
  }

  // Grade filter
  if (filters.value.grade) {
    result = result.filter(cls => cls.grade === filters.value.grade)
  }

  // Day filter
  if (filters.value.day) {
    result = result.filter(cls => cls.day_of_week === filters.value.day)
  }

  return result
})

const hasFilters = computed(() => {
  return filters.value.search || filters.value.grade || filters.value.day
})

async function fetchMyClasses() {
  if (!authStore.profile?.id) {
    $q.notify({ type: 'warning', message: 'Please login to view classes' })
    loading.value = false
    return
  }

  loading.value = true
  try {
    classes.value = await teacherService.getMyClasses(authStore.profile.id)
  } catch (error) {
    console.error('Error fetching classes:', error)
    $q.notify({ type: 'negative', message: 'Failed to load classes' })
  } finally {
    loading.value = false
  }
}

function formatTime(time) {
  if (!time) return 'TBA'
  // Convert 24h to 12h format (e.g., "14:00" → "2:00 PM")
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${period}`
}

function openClassDetail(classId) {
  router.push(`/teacher/classes/${classId}`)
}

onMounted(() => {
  fetchMyClasses()
})
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.rounded-xl { border-radius: 16px; }
.rounded-borders { border-radius: 8px; }
.border-bottom-blue { border-bottom: 3px solid #2563EB; }
.bg-slate-50 { background-color: #F8FAFC; }
.bg-grey-1-light { background-color: #F8FAFC; }
.text-slate-800 { color: #1E293B; }
.text-slate-600 { color: #475569; }
.text-slate-500 { color: #64748B; }
.text-slate-400 { color: #94A3B8; }
.hover-lift {
  transition: transform 0.2s, box-shadow 0.2s;
}
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
.h-100 { height: 100%; }
</style>
