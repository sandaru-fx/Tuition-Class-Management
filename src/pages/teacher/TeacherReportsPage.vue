<template>
  <q-page class="q-pa-lg bg-slate-50">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold text-slate-800 font-outfit">Reports & Analytics</div>
        <div class="text-subtitle1 text-slate-500">Insights into your teaching performance</div>
      </div>
      <q-btn unelevated color="blue-600" icon="download" label="Export PDF" disable />
    </div>

    <!-- Stats Cards -->
    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-12 col-md-4">
        <q-card class="bg-white shadow-sm rounded-xl q-pa-md">
          <div class="row items-center">
            <q-avatar color="blue-50" text-color="blue" icon="school" size="lg" />
            <div class="q-ml-md">
              <div class="text-h5 text-weight-bold">{{ stats.totalClasses }}</div>
              <div class="text-caption text-grey">Active Classes</div>
            </div>
          </div>
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card class="bg-white shadow-sm rounded-xl q-pa-md">
          <div class="row items-center">
             <q-avatar color="green-50" text-color="green" icon="groups" size="lg" />
            <div class="q-ml-md">
              <div class="text-h5 text-weight-bold">{{ stats.totalStudents }}</div>
              <div class="text-caption text-grey">Total Students Enrolled</div>
            </div>
          </div>
        </q-card>
      </div>
       <div class="col-12 col-md-4">
        <q-card class="bg-white shadow-sm rounded-xl q-pa-md">
          <div class="row items-center">
             <q-avatar color="purple-50" text-color="purple" icon="fact_check" size="lg" />
            <div class="q-ml-md">
              <div class="text-h5 text-weight-bold">{{ stats.avgAttendance }}%</div>
              <div class="text-caption text-grey">Average Attendance</div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-8">
        <q-card class="shadow-sm rounded-xl q-pa-md full-height">
          <div class="text-h6 text-slate-800 q-mb-md">Student Distribution by Class</div>
          <div style="height: 300px; position: relative;">
            <Bar v-if="chartData.labels.length" :data="chartData" :options="chartOptions" />
            <div v-else class="flex flex-center full-height text-grey">No data to display</div>
          </div>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="shadow-sm rounded-xl q-pa-md full-height">
           <div class="text-h6 text-slate-800 q-mb-md">Subject Breakdown</div>
           <q-list separator>
             <q-item v-for="cls in classes" :key="cls.id">
               <q-item-section>
                 <q-item-label class="text-weight-bold">{{ cls.subject?.name }}</q-item-label>
                 <q-item-label caption>Grade {{ cls.grade }}</q-item-label>
               </q-item-section>
               <q-item-section side>
                 <q-chip size="sm" color="blue-1" text-color="blue-8">{{ cls.student_count }} Students</q-chip>
               </q-item-section>
             </q-item>
           </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { teacherService } from 'src/services/teacherService'
import { useAuthStore } from 'src/stores/auth'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const $q = useQuasar()
const authStore = useAuthStore()

const stats = ref({ totalClasses: 0, totalStudents: 0, avgAttendance: 0 })
const classes = ref([])

const chartData = computed(() => {
    return {
        labels: classes.value.map(c => `${c.subject?.name || 'Sub'} (Gr ${c.grade})`),
        datasets: [{
            label: 'Enrolled Students',
            backgroundColor: '#3B82F6',
            borderRadius: 6,
            data: classes.value.map(c => c.student_count)
        }]
    }
})

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false }
    },
    scales: {
        y: { beginAtZero: true, grid: { display: false } },
        x: { grid: { display: false } }
    }
}

async function fetchData() {
    if (!authStore.profile?.id) return
    try {
        const [statData, classData] = await Promise.all([
            teacherService.getWeeklyStats(authStore.profile.id),
            teacherService.getMyClasses(authStore.profile.id)
        ])
        
        stats.value = statData
        classes.value = classData || []

    } catch (e) {
        console.error(e)
        $q.notify({ type: 'negative', message: 'Failed to load report data' })
    }
}

onMounted(() => {
    fetchData()
})
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.rounded-xl { border-radius: 16px; }
.bg-slate-50 { background-color: #F8FAFC; }
</style>
