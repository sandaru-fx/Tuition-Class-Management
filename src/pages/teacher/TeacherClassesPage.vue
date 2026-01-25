<template>
  <q-page class="q-pa-lg bg-slate-50">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold text-slate-800 font-outfit">My Classes</div>
        <div class="text-subtitle1 text-slate-500">Manage your ongoing classes and schedules</div>
      </div>
      <q-btn unelevated color="blue-600" icon="add" label="New Class" no-caps class="rounded-borders" />
    </div>

    <!-- Classes Grid -->
    <div class="row q-col-gutter-lg">
       <div v-for="cls in classes" :key="cls.id" class="col-12 col-md-6 col-lg-4">
          <q-card class="bg-white shadow-sm rounded-xl hover-lift cursor-pointer transition-all border-bottom-blue">
             <q-card-section>
                <div class="row justify-between items-start">
                   <div>
                      <q-badge color="blue-1" text-color="blue-8" :label="cls.grade" class="q-mb-sm font-weight-bold" />
                      <div class="text-h6 text-weight-bold text-slate-800">{{ cls.name }}</div>
                      <div class="text-caption text-slate-500 q-mt-xs flex items-center">
                         <q-icon name="schedule" class="q-mr-xs" size="14px"/>
                         {{ cls.days }} • {{ cls.time }}
                      </div>
                   </div>
                   <q-avatar size="40px" font-size="20px" color="blue-50" text-color="blue-600" icon="class" rounded />
                </div>
             </q-card-section>

             <q-separator color="grey-2" />

             <q-card-actions align="between" class="q-px-md q-py-md bg-grey-1-light">
                <div class="text-caption text-slate-600">
                   <q-icon name="groups" class="q-mr-xs" />
                   <strong>{{ cls.students }}</strong> Students
                </div>
                <div class="text-caption text-slate-600">
                   <q-icon name="meeting_room" class="q-mr-xs" />
                   {{ cls.hall }}
                </div>
             </q-card-actions>
          </q-card>
       </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const classes = ref([
    { id: 1, name: 'Advanced Level Physics', grade: 'Grade 12', days: 'Mon, Wed', time: '02:00 PM - 04:00 PM', students: 45, hall: 'Main Hall' },
    { id: 2, name: 'General Chemistry', grade: 'Grade 11', days: 'Tue, Thu', time: '04:00 PM - 06:00 PM', students: 32, hall: 'Lab A' },
    { id: 3, name: 'Pure Mathematics', grade: 'Grade 13', days: 'Sat', time: '08:00 AM - 12:00 PM', students: 50, hall: 'Lecture Room 1' },
    { id: 4, name: 'Biology Revision', grade: 'Grade 13', days: 'Fri', time: '03:00 PM - 06:00 PM', students: 35, hall: 'Main Hall' },
    { id: 5, name: 'Physics Theory', grade: 'Grade 12', days: 'Sun', time: '08:00 AM - 11:00 AM', students: 42, hall: 'Hall B' },
    { id: 6, name: 'O/L Science Support', grade: 'Grade 10', days: 'Wed', time: '04:30 PM - 06:30 PM', students: 18, hall: 'Lab B' }
])
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.rounded-xl { border-radius: 16px; }
.rounded-borders { border-radius: 8px; }
.border-bottom-blue { border-bottom: 3px solid #2563EB; }
.bg-grey-1-light { background-color: #F8FAFC; }
</style>
