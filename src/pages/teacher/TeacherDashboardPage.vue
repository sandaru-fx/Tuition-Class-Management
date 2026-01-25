<template>
  <q-page class="q-pa-lg bg-slate-50">
    <!-- Header / Timeline Widget -->
    <TeacherTimeline />

    <!-- Stats & Charts Widget -->
    <TeacherStatsRow />

    <!-- Main Content Grid -->
    <div class="row q-col-gutter-lg">
      <!-- Active Classes Grid -->
      <div class="col-12 col-md-8">
        <div class="row items-center justify-between q-mb-md">
            <div class="text-h6 text-weight-bold text-slate-800 font-outfit">Active Classes</div>
            <q-btn flat dense color="blue-600" label="View All" no-caps class="text-weight-bold" to="/teacher/classes" />
        </div>
        
        <div class="row q-col-gutter-md">
             <div v-if="activeClasses.length === 0" class="col-12 text-center text-slate-500 q-py-xl">
                <div class="text-h2">📭</div>
                <div>No active classes found.</div>
             </div>

             <div v-for="cls in activeClasses" :key="cls.id" class="col-12 col-lg-6">
                 <q-card class="active-class-card bg-white shadow-sm rounded-xl q-pa-sm hover-lift cursor-pointer h-100 column justify-between border-transparent transition-all">
                     <q-card-section>
                         <div class="row justify-between items-start">
                             <div>
                                 <div class="text-h6 text-weight-bold text-slate-800 line-clamp-1">{{ cls.name }}</div>
                                 <div class="text-caption text-slate-500">{{ cls.grade }} • {{ cls.hall }}</div>
                             </div>
                             <!-- Optional Status Dot -->
                             <!-- <q-badge rounded color="green" class="q-mt-xs" /> -->
                         </div>
                         
                         <div class="q-mt-lg bg-slate-50 q-pa-sm rounded-borders">
                             <div class="text-caption text-slate-400 text-uppercase text-weight-bold" style="font-size: 10px; letter-spacing: 0.5px;">Next Topic</div>
                             <div class="text-subtitle2 text-slate-700 line-clamp-2">{{ cls.nextTopic }}</div>
                         </div>
                     </q-card-section>

                     <q-card-actions align="between" class="q-px-md q-pb-md">
                         <div class="text-caption text-slate-500 flex items-center">
                             <q-icon name="groups" class="q-mr-xs text-blue-600" /> 
                             <span class="text-weight-medium">{{ cls.students }} Students</span>
                         </div>
                         <q-btn unelevated color="blue-600" label="View" class="rounded-borders q-px-md" size="sm" :to="'/teacher/classes/' + cls.id" no-caps />
                     </q-card-actions>
                 </q-card>
             </div>
        </div>

        <!-- Pending Grading (Secondary) -->
        <div class="q-mt-xl">
             <div class="text-h6 text-weight-bold text-slate-800 font-outfit q-mb-md">Recent Grading Tasks</div>
             <q-card class="bg-white shadow-sm rounded-xl border-none">
                <q-list separator>
                    <q-item v-for="task in pendingGrading" :key="task.id" class="q-py-md">
                        <q-item-section>
                            <q-item-label class="text-weight-bold text-slate-800">{{ task.assignment }}</q-item-label>
                            <q-item-label caption class="text-slate-500">Class: {{ task.class }} • <span class="text-amber-500 text-weight-bold">{{ task.count }} submissions</span></q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-btn unelevated color="amber-500" text-color="white" label="Grade Now" size="sm" class="rounded-borders" no-caps />
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card>
        </div>
      </div>

      <!-- Quick Actions Sidebar -->
      <div class="col-12 col-md-4">
        <div class="text-h6 text-weight-bold text-slate-800 font-outfit q-mb-md">Quick Actions</div>
        
        <q-card class="bg-white shadow-sm rounded-xl q-pa-md q-mb-lg">
             <q-btn unelevated color="blue-600" class="full-width q-mb-md rounded-borders shadow-1" label="Create Assignment" size="md" no-caps icon="add_task" padding="10px" align="left" />
             <q-btn outline color="blue-600" class="full-width q-mb-sm rounded-borders" label="Post Announcement" size="md" no-caps icon="campaign" padding="10px" align="left" />
             <q-btn outline color="blue-600" class="full-width rounded-borders" label="Message Parent" size="md" no-caps icon="chat" padding="10px" align="left" />
        </q-card>

        <!-- Calendar Widget -->
        <q-card class="bg-white shadow-sm rounded-xl overflow-hidden">
             <div class="q-pa-md text-weight-bold text-slate-700">Schedule</div>
             <q-date v-model="date" flat minimal class="full-width" color="blue-600" :events="events" event-color="blue-600" />
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import TeacherStatsRow from 'components/TeacherStatsRow.vue'
import TeacherTimeline from 'components/TeacherTimeline.vue'

const date = ref('2026/01/25')
const events = ['2026/01/25', '2026/01/28']

const activeClasses = ref([
    { id: 1, name: 'Inorganic Chem', grade: 'Grade 12', hall: 'Hall A', students: 45, nextTopic: 'Self-Cheming, Mathemat dietary' },
    { id: 2, name: 'Physics 101', grade: 'Grade 12', hall: 'Hall A', students: 28, nextTopic: 'Physical fibrations Computer science' },
    { id: 3, name: 'Combined Maths', grade: 'Grade 12', hall: 'Hall B', students: 50, nextTopic: 'Integration & Derivatives' },
    { id: 4, name: 'Biology', grade: 'Grade 13', hall: 'Lab 1', students: 35, nextTopic: 'Plant Physiology' }
])

const pendingGrading = ref([
    { id: 1, assignment: 'Thermodynamics Quiz 1', class: 'AL Physics', count: 12 },
    { id: 2, assignment: 'Algebra Homework', class: 'Grade 11 Math', count: 5 }
])
</script>

<style scoped>
.font-outfit {
  font-family: 'Outfit', sans-serif;
}
.rounded-xl {
  border-radius: 16px;
}
.rounded-borders {
    border-radius: 8px;
}
.h-100 { height: 100%; }
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
