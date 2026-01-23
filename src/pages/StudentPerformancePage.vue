<template>
  <q-page class="q-pa-lg q-pa-xl-xl bg-gray-soft transition-all">
    
    <!-- Header Section -->
    <div class="row items-center justify-between q-mb-xl">
        <div class="col-12 col-md-auto">
            <h1 class="text-h3 text-weight-black font-outfit text-slate-900 q-my-none tracking-tighter">
                Performance
            </h1>
            <p class="text-subtitle1 text-slate-500 q-mt-sm q-mb-none font-medium">
                Review your academic standing and grade history.
            </p>
        </div>
        <div class="col-12 col-md-auto q-mt-md q-mt-md-none">
             <q-btn unelevated color="slate-900" label="Download Report" no-caps class="rounded-xl q-px-lg text-weight-bold shadow-soft" icon="download" />
        </div>
    </div>

    <div class="row q-col-gutter-xl">
        <!-- Main Stats Column -->
        <div class="col-12 col-lg-8">
            <!-- GPA Card -->
            <q-card flat class="bg-slate-900 text-white rounded-3xl q-mb-xl overflow-hidden shadow-2xl relative-position">
                 <div class="absolute-right" style="top: -40px; right: -40px; opacity: 0.1">
                    <q-icon name="trending_up" size="280px" />
                </div>
                <q-card-section class="q-pa-xl">
                    <div class="row items-center justify-between">
                        <div class="col">
                            <div class="text-subtitle1 text-blue-3 font-bold uppercase tracking-widest q-mb-sm">Current Average</div>
                            <div class="text-h1 text-weight-black font-outfit line-height-1">3.82</div>
                            <div class="row items-center q-mt-md">
                                <q-badge color="green-6" class="rounded-lg q-mr-sm">+0.15</q-badge>
                                <span class="text-caption text-blue-1 opacity-70 font-medium whitespace-nowrap">vs last semester</span>
                            </div>
                        </div>
                        <div class="col-auto gt-sm row q-gutter-x-md items-end">
                            <div v-for="h in [40, 60, 50, 80, 70, 95]" :key="h" class="bg-blue-600 rounded-t-lg transition-all hover-bg-blue-400" :style="`width: 20px; height: ${h}px`" />
                        </div>
                    </div>
                </q-card-section>
            </q-card>

            <!-- Subject Breakdown -->
            <div class="text-h5 font-outfit text-weight-black text-slate-900 q-mb-lg tracking-tight">Subject Breakdown</div>
            <div class="column q-gutter-y-md">
                <q-card v-for="subject in grades" :key="subject.name" flat class="bg-white q-pa-lg rounded-2xl border-slate shadow-soft hover-lift transition-all">
                    <div class="row items-center">
                        <div :class="`icon-box bg-${subject.color}-soft text-${subject.color}-600 q-mr-md`">
                            <q-icon :name="subject.icon" size="24px" />
                        </div>
                        <div class="col">
                            <div class="text-weight-black text-slate-900 text-subtitle1">{{ subject.name }}</div>
                            <div class="text-caption text-slate-400 font-bold uppercase tracking-widest">{{ subject.code }}</div>
                        </div>
                        <div class="col-auto text-right">
                            <div class="text-h5 text-weight-black text-slate-900">{{ subject.score }}%</div>
                            <div class="text-caption text-weight-bold" :class="`text-${subject.statusColor}-600`">{{ subject.status }}</div>
                        </div>
                    </div>
                </q-card>
            </div>
        </div>

        <!-- Sidebar Column -->
        <div class="col-12 col-lg-4">
             <!-- Performance Insights -->
             <q-card flat class="bg-white rounded-3xl q-pa-xl border-slate shadow-soft q-mb-xl">
                  <div class="text-h6 text-weight-black text-slate-900 font-outfit q-mb-md">Insights</div>
                  <div class="column q-gutter-y-lg">
                      <div class="row no-wrap items-start">
                          <q-icon name="lightbulb" color="orange-6" size="24px" class="q-mr-md q-mt-xs" />
                          <div>
                              <div class="text-weight-black text-slate-900">Strengthen Calculus</div>
                              <p class="text-caption text-slate-500 font-medium q-mb-none">Your recent test shows high mastery in Integration but needs work on Derivatives.</p>
                          </div>
                      </div>
                      <q-separator class="opacity-10" />
                      <div class="row no-wrap items-start">
                          <q-icon name="schedule" color="blue-6" size="24px" class="q-mr-md q-mt-xs" />
                          <div>
                              <div class="text-weight-black text-slate-900">Consistency is Key</div>
                              <p class="text-caption text-slate-500 font-medium q-mb-none">You've maintained a 100% attendance rate for the past 4 weeks. Impressive!</p>
                          </div>
                      </div>
                  </div>
             </q-card>

             <!-- Upcoming Tests -->
             <q-card flat class="bg-white rounded-3xl q-pa-xl border-slate shadow-soft">
                  <div class="text-h6 text-weight-black text-slate-900 font-outfit q-mb-md">Mock Tests</div>
                   <div class="column q-gutter-y-md">
                       <div v-for="test in upcomingTests" :key="test.title" class="row items-center no-wrap bg-slate-50 q-pa-md rounded-2xl">
                           <div class="col">
                               <div class="text-weight-black text-slate-900 line-height-1 q-mb-xs">{{ test.title }}</div>
                               <div class="text-caption text-slate-500 font-bold">{{ test.date }}</div>
                           </div>
                           <q-btn unelevated color="white" text-color="slate-900" label="Prep" no-caps class="rounded-xl q-px-md text-weight-bold border-slate" size="sm" />
                       </div>
                   </div>
             </q-card>
        </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const grades = ref([
    { name: 'Advanced Mathematics', code: 'MAT-401', score: 92, status: 'Outstanding', statusColor: 'green', icon: 'functions', color: 'blue' },
    { name: 'Quantum Physics', code: 'PHY-302', score: 84, status: 'Above Average', statusColor: 'blue', icon: 'lightbulb', color: 'orange' },
    { name: 'Organic Chemistry', code: 'CHE-205', score: 78, status: 'Good Progress', statusColor: 'blue', icon: 'science', color: 'green' },
    { name: 'Cell Biology', code: 'BIO-101', score: 95, status: 'Outstanding', statusColor: 'green', icon: 'biotech', color: 'purple' },
])

const upcomingTests = ref([
    { title: 'Algebra Midterm', date: 'Feb 02, 2026' },
    { title: 'Physics Lab Exam', date: 'Feb 10, 2026' },
])
</script>

<style lang="scss" scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.tracking-tighter { letter-spacing: -2px; }
.bg-gray-soft { background-color: #F8FAFC; }

.icon-box {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.bg-blue-soft { background: #eff6ff; }
.bg-green-soft { background: #f0fdf4; }
.bg-orange-soft { background: #fff7ed; }
.bg-purple-soft { background: #faf5ff; }

.border-slate { border: 1px solid #E2E8F0; }
.shadow-soft { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02); }

.transition-all { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.hover-lift:hover { 
    transform: translateY(-8px); 
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);
}

.text-slate-900 { color: #0F172A; }
.text-slate-500 { color: #64748B; }

// Dark Mode
.body--dark {
    .bg-gray-soft { background-color: #0f172a !important; }
    .bg-white { background-color: #1e293b !important; }
    .border-slate { border-color: #334155 !important; }
    .bg-slate-50 { background-color: #334155 !important; }
    .text-slate-900 { color: #f1f5f9 !important; }
    .text-slate-500 { color: #94a3b8 !important; }
}
</style>
