<template>
  <q-page class="q-pa-lg q-pa-xl-xl bg-gray-soft transition-all">
    
    <!-- Header Section -->
    <div class="row items-center justify-between q-mb-xl">
        <div class="col-12 col-md-auto">
            <h1 class="text-h3 text-weight-black font-outfit text-slate-900 q-my-none tracking-tighter">
                Assignments
            </h1>
            <p class="text-subtitle1 text-slate-500 q-mt-sm q-mb-none font-medium">
                Track your deadlines and submit your work on time.
            </p>
        </div>
        <div class="col-12 col-md-auto q-mt-md q-mt-md-none">
             <div class="bg-white rounded-2xl q-pa-sm border-slate shadow-soft row no-wrap">
                 <q-tabs
                    v-model="tab"
                    dense
                    class="text-slate-500"
                    active-color="blue-6"
                    indicator-color="blue-6"
                    align="justify"
                    narrow-indicator
                    no-caps
                >
                    <q-tab name="upcoming" label="Upcoming" class="q-px-lg rounded-xl" />
                    <q-tab name="submitted" label="Submitted" class="q-px-lg rounded-xl" />
                    <q-tab name="missed" label="Missed" class="q-px-lg rounded-xl" />
                </q-tabs>
             </div>
        </div>
    </div>

    <!-- Assignment Content -->
    <q-tab-panels v-model="tab" animated class="bg-transparent">
        <q-tab-panel name="upcoming" class="q-pa-none">
            <div class="column q-gutter-y-lg">
                <q-card v-for="task in upcomingAssignments" :key="task.id" flat class="bg-white q-pa-xl rounded-3xl border-slate shadow-soft hover-lift transition-all">
                    <div class="row items-center no-wrap">
                        <!-- Date Badge -->
                        <div class="col-auto q-mr-xl">
                            <div :class="`date-box ${task.urgent ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'} text-center`">
                                <div class="text-weight-black text-h5">{{ task.day }}</div>
                                <div class="text-weight-bold uppercase" style="font-size: 10px">{{ task.month }}</div>
                            </div>
                        </div>

                        <!-- Assignment Info -->
                        <div class="col">
                            <div class="row items-center q-gutter-x-sm q-mb-xs">
                                <q-badge :color="task.urgent ? 'red-1' : 'blue-50'" :text-color="task.urgent ? 'red-6' : 'blue-7'" class="rounded-lg q-px-sm text-weight-bold">
                                    {{ task.tag }}
                                </q-badge>
                                <span class="text-caption text-slate-400 font-bold">• Due at {{ task.time }}</span>
                            </div>
                            <div class="text-h6 text-weight-black text-slate-900 font-outfit">{{ task.title }}</div>
                            <div class="text-body2 text-slate-500 font-medium">{{ task.course }}</div>
                        </div>

                        <q-space />

                        <!-- Action -->
                        <div class="col-auto gt-sm q-ml-xl">
                            <q-btn unelevated color="blue-6" label="Start Task" no-caps class="rounded-xl q-px-xl q-py-md text-weight-black shadow-md hover-scale transition-all" />
                        </div>
                    </div>
                </q-card>
            </div>
        </q-tab-panel>

        <q-tab-panel name="submitted" class="q-pa-none text-center q-py-xl">
             <div class="column items-center q-py-xl">
                 <q-icon name="check_circle" size="84px" color="green-4" class="q-mb-lg opacity-20" />
                 <div class="text-h5 text-weight-black text-slate-900 font-outfit">Nothing here yet</div>
                 <p class="text-slate-500 font-medium">Your graded and submitted assignments will appear here.</p>
                 <q-btn flat color="blue-6" label="View Past Submissions" no-caps class="q-mt-md text-weight-bold" />
             </div>
        </q-tab-panel>

         <q-tab-panel name="missed" class="q-pa-none text-center q-py-xl">
             <div class="column items-center q-py-xl">
                 <q-icon name="history" size="84px" color="red-4" class="q-mb-lg opacity-20" />
                 <div class="text-h5 text-weight-black text-slate-900 font-outfit">Great Job!</div>
                 <p class="text-slate-500 font-medium">You haven't missed any assignments this semester. Keep it up!</p>
             </div>
        </q-tab-panel>
    </q-tab-panels>

  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const tab = ref('upcoming')

const upcomingAssignments = ref([
    { 
        id: 1, 
        title: 'Quantum Mechanics Problem Set 4', 
        course: 'Physics & Relativity', 
        day: '24', 
        month: 'JAN', 
        time: '11:59 PM', 
        tag: 'Critical',
        urgent: true 
    },
    { 
        id: 2, 
        title: 'DNA Replication Essay', 
        course: 'Modern Biology', 
        day: '26', 
        month: 'JAN', 
        time: '05:00 PM', 
        tag: 'Standard',
        urgent: false 
    },
    { 
        id: 3, 
        title: 'Calculus III Midterm Practice', 
        course: 'Advanced Mathematics', 
        day: '28', 
        month: 'JAN', 
        time: '08:00 AM', 
        tag: 'Optional',
        urgent: false 
    },
])
</script>

<style lang="scss" scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.tracking-tighter { letter-spacing: -2px; }
.bg-gray-soft { background-color: #F8FAFC; }

.border-slate { border: 1px solid #E2E8F0; }
.shadow-soft { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02); }

.date-box {
    width: 64px;
    height: 64px;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.transition-all { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.hover-lift:hover { 
    transform: translateY(-8px); 
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);
}
.hover-scale:hover { transform: scale(1.05); }

.text-slate-900 { color: #0F172A; }
.text-slate-500 { color: #64748B; }

// Dark Mode
.body--dark {
    .bg-gray-soft { background-color: #0f172a !important; }
    .bg-white { background-color: #1e293b !important; }
    .border-slate { border-color: #334155 !important; }
    .text-slate-900 { color: #f1f5f9 !important; }
    .text-slate-500 { color: #94a3b8 !important; }
    .q-tab-panel { color: white; }
}
</style>
