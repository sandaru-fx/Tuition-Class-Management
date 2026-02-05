<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold text-dark q-mb-xs font-outfit">Advanced Analytics</h1>
        <p class="text-grey-7 q-mb-none text-subtitle1">Deep dive into academic performance and teacher metrics.</p>
      </div>
      <q-btn flat color="grey-7" icon="print" label="Print Report" no-caps @click="printPage" />
    </div>

    <!-- Charts Row -->
    <div class="row q-col-gutter-lg q-mb-xl">
        <div class="col-12 col-md-8">
            <q-card class="shadow-1 rounded-borders-lg">
                <q-card-section>
                    <div class="text-h6 text-weight-bold font-outfit">Average Student Performance by Grade</div>
                    <div class="text-caption text-grey-6">Based on assignment and exam scores</div>
                </q-card-section>
                <q-card-section>
                    <div style="height: 350px">
                         <Bar 
                            v-if="passRateData.datasets[0].data.length > 0"
                            :data="passRateData"
                            :options="chartOptions"
                        />
                         <div v-else class="flex flex-center h-100 text-grey-5">
                            <q-spinner color="primary" size="2rem" />
                            <div class="q-ml-sm">Loading Performance Data...</div>
                        </div>
                    </div>
                </q-card-section>
            </q-card>
        </div>

         <div class="col-12 col-md-4">
            <q-card class="bg-gradient-purple text-white shadow-2 rounded-borders-lg h-100">
                <q-card-section>
                    <div class="text-h6 text-weight-bold">Insights</div>
                </q-card-section>
                
                <q-card-section class="q-pt-none">
                    <div class="row q-col-gutter-md">
                        <div class="col-12">
                            <div class="bg-white-translucent q-pa-md rounded-borders">
                                <div class="text-caption text-uppercase text-weight-bold opacity-80">Top Performing Subject</div>
                                <div class="text-h5 text-weight-bolder q-mt-xs">Biology</div>
                                <div class="text-caption opacity-80">Avg. 88% Score</div>
                            </div>
                        </div>
                        <div class="col-12">
                             <div class="bg-white-translucent q-pa-md rounded-borders">
                                <div class="text-caption text-uppercase text-weight-bold opacity-80">Needs Attention</div>
                                <div class="text-h5 text-weight-bolder q-mt-xs">Combined Maths</div>
                                <div class="text-caption opacity-80">Avg. 65% Score</div>
                            </div>
                        </div>
                    </div>
                </q-card-section>
            </q-card>
        </div>
    </div>

    <!-- Teacher Performance Table -->
    <q-card class="shadow-1 rounded-borders-lg">
        <q-card-section class="q-px-lg q-pt-lg">
            <div class="text-h6 text-weight-bold font-outfit">Teacher Performance Matrix</div>
        </q-card-section>
        <q-card-section class="q-px-none">
             <q-markup-table flat class="text-left">
              <thead class="bg-grey-1">
                <tr>
                  <th class="text-left text-grey-7 text-weight-bold q-pl-lg">Teacher Name</th>
                  <th class="text-left text-grey-7 text-weight-bold">Subject</th>
                  <th class="text-center text-grey-7 text-weight-bold">Total Students</th>
                  <th class="text-center text-grey-7 text-weight-bold">Avg. Attendance</th>
                  <th class="text-center text-grey-7 text-weight-bold">Avg. Score</th>
                  <th class="text-right text-grey-7 text-weight-bold q-pr-lg">Rating</th>
                </tr>
              </thead>
              <tbody>
                  <tr v-for="teacher in teachers" :key="teacher.id" class="hover-bg-grey-1">
                      <td class="q-pl-lg text-weight-bold">{{ teacher.name }}</td>
                      <td class="text-grey-8">{{ teacher.subject }}</td>
                      <td class="text-center">{{ teacher.students }}</td>
                      <td class="text-center">
                          <q-chip size="sm" :color="getColor(teacher.avgAttendance)" text-color="white" class="text-weight-bold">
                              {{ teacher.avgAttendance }}%
                          </q-chip>
                      </td>
                       <td class="text-center">
                          <span class="text-weight-bold">{{ teacher.avgScore }}</span> / 100
                      </td>
                      <td class="text-right q-pr-lg">
                          <q-rating :model-value="(teacher.avgScore / 20)" size="1.5em" color="amber" readonly icon="star" icon-half="star_half" />
                      </td>
                  </tr>
              </tbody>
            </q-markup-table>
        </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { analyticsService } from 'src/services/analyticsService'
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

const loading = ref(true)
const teachers = ref([])

const passRateData = reactive({
  labels: [],
  datasets: [{
    label: 'Average Score',
    backgroundColor: '#673ab7',
    borderRadius: 6,
    data: []
  }]
})

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false }
    },
    scales: {
        y: { beginAtZero: true, max: 100 }
    }
}

function getColor(val) {
    if (val >= 90) return 'green'
    if (val >= 75) return 'blue'
    if (val >= 50) return 'orange'
    return 'red'
}

function printPage() {
    window.print()
}

async function fetchAnalytics() {
    try {
        const [passRates, teacherData] = await Promise.all([
            analyticsService.getPassRateByGrade(),
            analyticsService.getTeacherPerformance()
        ])

        passRateData.labels = passRates.map(p => `Grade ${p.grade}`)
        passRateData.datasets[0].data = passRates.map(p => p.passRate)
        
        teachers.value = teacherData
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchAnalytics()
})
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.shadow-1 { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); }
.rounded-borders-lg { border-radius: 12px; }
.bg-gradient-purple { background: linear-gradient(135deg, #673ab7 0%, #512da8 100%); }
.bg-white-translucent { background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); }
.opacity-80 { opacity: 0.8; }
.h-100 { height: 100%; }
.hover-bg-grey-1:hover { background-color: #fafafa; }
</style>
