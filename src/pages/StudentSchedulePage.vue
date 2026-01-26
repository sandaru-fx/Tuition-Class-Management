<template>
  <q-page class="q-pa-lg q-pa-xl-xl bg-gray-soft transition-all">
    
    <!-- Header Section -->
    <div class="row items-center justify-between q-mb-xl">
        <div class="col-12 col-md-auto">
            <h1 class="text-h3 text-weight-black font-outfit text-slate-900 q-my-none tracking-tighter">
                Calendar
            </h1>
            <p class="text-subtitle1 text-slate-500 q-mt-sm q-mb-none font-medium">
                Your schedule for <span class="text-slate-900 text-weight-bold">Saturday, 24 Jan</span>.
            </p>
        </div>
        <div class="col-12 col-md-auto q-mt-md q-mt-md-none row q-gutter-sm">
             <q-btn flat dense icon="chevron_left" color="slate-400" />
             <q-btn flat dense label="Today" color="blue-6" class="text-weight-bold" no-caps />
             <q-btn flat dense icon="chevron_right" color="slate-400" />
        </div>
    </div>

    <div class="row q-col-gutter-xl">
        <!-- Main Agenda Column -->
        <div class="col-12 col-lg-8">
            <div class="column q-gutter-y-lg">
                <div v-for="item in schedule" :key="item.time" class="row no-wrap items-start">
                    <!-- Time Column -->
                    <div class="col-auto text-right q-mr-xl" style="width: 80px">
                        <div class="text-h6 text-weight-black text-slate-900 line-height-1">{{ item.time }}</div>
                        <div class="text-caption text-slate-400 text-weight-bold uppercase">{{ item.period }}</div>
                    </div>

                    <!-- Event Card -->
                    <div class="col">
                        <q-card flat :class="`bg-white q-pa-xl rounded-3xl border-slate shadow-soft transition-all relative-position overflow-hidden ${item.active ? 'active-event' : ''}`">
                            <div v-if="item.active" class="absolute-left bg-blue-600" style="width: 6px"></div>
                            
                            <div class="row items-center no-wrap">
                                <div class="col">
                                    <div class="row items-center q-gutter-x-sm q-mb-sm">
                                        <q-badge :color="item.active ? 'blue-6' : 'slate-50'" :text-color="item.active ? 'white' : 'slate-500'" class="rounded-lg q-px-sm text-weight-bold">
                                            {{ item.type }}
                                        </q-badge>
                                        <span class="text-caption text-slate-400 font-bold">• Room {{ item.room }}</span>
                                    </div>
                                    <div class="text-h6 text-weight-black text-slate-900 font-outfit line-height-1">{{ item.title }}</div>
                                    <div class="text-body2 text-slate-500 font-medium q-mt-xs">{{ item.instructor }}</div>
                                </div>
                                <div class="col-auto gt-sm" v-if="item.active">
                                    <q-btn unelevated color="blue-6" label="Join Class" icon="videocam" no-caps class="rounded-xl q-px-lg text-weight-bold" />
                                </div>
                            </div>
                        </q-card>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sidebar Widgets -->
        <div class="col-12 col-lg-4">
             <!-- Quick Calendar Widget -->
             <q-card flat class="bg-white rounded-3xl q-pa-lg border-slate shadow-soft q-mb-xl">
                  <q-date
                    v-model="date"
                    flat
                    minimal
                    class="full-width no-shadow bg-transparent text-slate-900"
                    color="blue-6"
                />
             </q-card>

             <!-- Notification -->
             <q-card flat class="bg-blue-600 text-white rounded-3xl q-pa-xl shadow-2xl">
                  <q-icon name="info" size="32px" class="q-mb-md opacity-20" />
                  <div class="text-h6 text-weight-black font-outfit q-mb-sm">Exam Week Approaching</div>
                  <p class="text-blue-1 font-medium q-mb-none opacity-80">Start planning your revision sessions. The mock exams start from Feb 15th.</p>
             </q-card>
        </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const date = ref('2026/01/24')

const schedule = ref([
    { 
        time: '08:30', 
        period: 'AM', 
        title: 'Physics & Relativity', 
        instructor: 'Prof. Perera', 
        type: 'Lecture', 
        room: 'B-201',
        active: false 
    },
    { 
        time: '10:45', 
        period: 'AM', 
        title: 'Advanced Mathematics', 
        instructor: 'Dr. Wickramasinghe', 
        type: 'Onsite', 
        room: 'Main Hall',
        active: true 
    },
    { 
        time: '02:00', 
        period: 'PM', 
        title: 'Modern Biology', 
        instructor: 'Prof. Silva', 
        type: 'Onsite', 
        room: 'Lab 4',
        active: false 
    },
    { 
        time: '03:45', 
        period: 'PM', 
        title: 'History of Art', 
        instructor: 'Ms. Perera', 
        type: 'Virtual', 
        room: 'Online',
        active: false 
    },
    { 
        time: '05:30', 
        period: 'PM', 
        title: 'Chemistry Quiz', 
        instructor: 'Dr. Fernando', 
        type: 'Exam', 
        room: 'Hall A',
        active: false 
    },
])
</script>

<style lang="scss" scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.tracking-tighter { letter-spacing: -2px; }
.bg-gray-soft { background-color: #F8FAFC; }

.border-slate { border: 1px solid #E2E8F0; }
.shadow-soft { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02); }

.active-event {
    border-color: #3B82F6 !important;
    background: #F8FAFF !important;
}

.transition-all { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }

.text-slate-900 { color: #0F172A; }
.text-slate-500 { color: #64748B; }

// Dark Mode
.body--dark {
    .bg-gray-soft { background-color: #0f172a !important; }
    .bg-white { background-color: #1e293b !important; }
    .border-slate { border-color: #334155 !important; }
    .bg-slate-50 { background-color: #334155 !important; }
    .active-event { background: #0F172A !important; }
    .text-slate-900 { color: #f1f5f9 !important; }
    .text-slate-500 { color: #94a3b8 !important; }
    .q-date { color: white; background: transparent !important; }
}
</style>
