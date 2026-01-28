<template>
  <q-page class="q-pa-lg">
    
    <!-- Welcome Section -->
    <div class="row items-center q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold text-dark q-mb-xs font-outfit">Admin Dashboard</h1>
        <p class="text-grey-7 q-mb-none text-subtitle1">Financials and System Overview</p>
      </div>
      <q-space />
      <div class="row q-gutter-sm">
        <q-btn unelevated color="white" text-color="black" label="Refresh Data" icon="refresh" class="border-grey" no-caps @click="fetchDashboardData" :loading="loading" />
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row q-col-gutter-lg q-mb-xl">
      <!-- Total Income -->
      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="my-card shadow-1 hover-shadow transition-all bg-gradient-green text-white">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-caption text-green-1 text-uppercase text-weight-bold letter-spacing-1">Total Revenue</div>
                <div class="text-h4 text-weight-bolder q-mt-sm font-outfit">{{ formatCurrency(totalRevenue) }}</div>
              </div>
              <div class="col-auto">
                <q-icon name="monetization_on" size="48px" class="text-green-2" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

       <!-- Total Enrollments (Paid) -->
      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="my-card shadow-1 hover-shadow transition-all bg-gradient-blue text-white">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-caption text-blue-1 text-uppercase text-weight-bold letter-spacing-1">Active Enrollments</div>
                <div class="text-h4 text-weight-bolder q-mt-sm font-outfit">{{ totalEnrollments }}</div>
              </div>
              <div class="col-auto">
                <q-icon name="school" size="48px" class="text-blue-2" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

       <!-- Total Users -->
      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="my-card shadow-1 hover-shadow transition-all bg-gradient-purple text-white">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-caption text-purple-1 text-uppercase text-weight-bold letter-spacing-1">Total Users</div>
                <div class="text-h4 text-weight-bolder q-mt-sm font-outfit">{{ totalUsers }}</div>
              </div>
              <div class="col-auto">
                <q-icon name="group" size="48px" class="text-purple-2" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- Recent Enrollments -->
      <div class="col-12">
        <q-card class="shadow-1 rounded-borders-lg">
          <q-card-section class="row items-center justify-between q-pb-none q-px-lg q-pt-lg">
            <div class="text-h6 text-weight-bold font-outfit">Recent Enrollments</div>
          </q-card-section>

          <q-card-section class="q-px-none">
            <q-markup-table flat class="text-left">
              <thead class="bg-grey-1">
                <tr>
                  <th class="text-left text-grey-7 text-weight-bold q-pl-lg">Student</th>
                  <th class="text-left text-grey-7 text-weight-bold">Course</th>
                   <th class="text-left text-grey-7 text-weight-bold">Amount</th>
                  <th class="text-center text-grey-7 text-weight-bold q-pr-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="recentEnrollments.length === 0">
                    <td colspan="4" class="text-center text-grey-6 q-py-md">No enrollments found.</td>
                </tr>
                <tr v-else v-for="(enr, index) in recentEnrollments" :key="index" class="hover-bg-grey-1 transition-all">
                  <td class="q-pl-lg">
                    <div class="row items-center">
                      <q-avatar size="32px" color="blue-1" text-color="blue-8" class="q-mr-md text-weight-bold">
                        {{ enr.student?.name?.charAt(0) || 'U' }}
                      </q-avatar>
                      <span class="text-weight-bold">{{ enr.student?.name || 'Unknown' }}</span>
                    </div>
                  </td>
                  <td class="text-grey-8">{{ enr.course?.title }}</td>
                  <td class="text-grey-8">{{ formatCurrency(enr.course?.price) }}</td>
                  <td class="text-center q-pr-lg">
                    <q-chip 
                        size="sm" 
                        :color="enr.status === 'completed' ? 'green-1' : 'orange-1'" 
                        :text-color="enr.status === 'completed' ? 'green-8' : 'orange-8'" 
                        :label="enr.status" 
                        class="text-weight-bold text-uppercase" 
                    />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>
        </q-card>
      </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from 'boot/supabase'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const loading = ref(false)

// Reactive State
const totalRevenue = ref(0)
const totalEnrollments = ref(0)
const totalUsers = ref(0)
const recentEnrollments = ref([])

async function fetchDashboardData() {
  loading.value = true
  try {
    // 1. Fetch Total Users
    const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
    totalUsers.value = usersCount || 0

    // 2. Fetch Enrollments & Revenue
    // Note: Supabase doesn't support complex SUM aggregation easily in SDK without RCP or Functions.
    // We will fetch enrollments and sum locally (assuming scale is small for now)
    const { data: enrollments } = await supabase
        .from('enrollments')
        .select(`
            *,
            course:courses(title, price),
            student:profiles(name)
        `)
        .order('enrolled_date', { ascending: false })
    
    if (enrollments) {
        recentEnrollments.value = enrollments.slice(0, 10)
        totalEnrollments.value = enrollments.length
        
        // Sum revenue (mock status logic: consider all for now, or filter by 'completed')
        totalRevenue.value = enrollments.reduce((sum, enr) => {
            return sum + (enr.course?.price || 0)
        }, 0)
    }

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to load dashboard data'
    })
  } finally {
      loading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.border-grey { border: 1px solid #e0e0e0; }
.my-card { border-radius: 12px; border: 1px solid #f0f0f0; }
.rounded-borders-lg { border-radius: 16px; }
.letter-spacing-1 { letter-spacing: 1px; }
.hover-shadow:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
.transition-all { transition: all 0.3s ease; }
.bg-gradient-blue { background: linear-gradient(135deg, #3B82F6, #1D4ED8); }
.bg-gradient-green { background: linear-gradient(135deg, #10B981, #047857); }
.bg-gradient-purple { background: linear-gradient(135deg, #8B5CF6, #6D28D9); }
</style>
