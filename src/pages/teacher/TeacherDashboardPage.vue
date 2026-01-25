<template>
  <q-page class="q-pa-lg">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold text-dark q-mb-xs font-outfit">Teacher Dashboard</h1>
        <p class="text-grey-7 q-mb-none text-subtitle1">Welcome back! Here's what's happening in your classes.</p>
      </div>
      <div>
        <q-btn unelevated color="primary" icon="add" label="Create New Assignment" class="q-px-md q-py-sm rounded-borders-md" no-caps />
      </div>
    </div>

    <!-- Quick Stats Row -->
    <div class="row q-col-gutter-md q-mb-xl">
      <div v-for="(stat, index) in stats" :key="index" class="col-12 col-sm-6 col-md-3">
        <q-card class="my-card shadow-1 rounded-borders-lg q-pa-md h-100">
          <div class="row items-center no-wrap">
            <q-avatar :color="stat.color + '-1'" :text-color="stat.color + '-9'" :icon="stat.icon" size="50px" class="q-mr-md" />
            <div>
              <div class="text-h5 text-weight-bold text-dark line-height-tight">{{ stat.value }}</div>
              <div class="text-caption text-grey-7">{{ stat.label }}</div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="row q-col-gutter-lg">
      <!-- Recent Activity / Classes -->
      <div class="col-12 col-md-8">
        <q-card class="my-card shadow-1 rounded-borders-lg q-mb-lg">
          <q-card-section class="row items-center justify-between q-pb-none">
            <div class="text-h6 text-weight-bold text-dark font-outfit">Active Classes</div>
            <q-btn flat dense color="primary" label="View All" no-caps />
          </q-card-section>
          
          <q-card-section>
            <q-list separator>
              <q-item v-for="cls in activeClasses" :key="cls.id" class="q-py-md">
                <q-item-section avatar>
                  <q-avatar rounded color="blue-1" text-color="blue" icon="class" />
                </q-item-section>
                
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ cls.name }}</q-item-label>
                  <q-item-label caption>{{ cls.time }} • {{ cls.students }} Students</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-btn flat round icon="chevron_right" color="grey-7" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>

        <q-card class="my-card shadow-1 rounded-borders-lg">
            <q-card-section class="row items-center justify-between q-pb-none">
              <div class="text-h6 text-weight-bold text-dark font-outfit">Pending Grading</div>
            </q-card-section>
            <q-card-section>
                <div v-if="pendingGrading.length === 0" class="text-grey-6 text-center q-pa-md">
                    All caught up! No assignments to grade.
                </div>
                <q-list v-else separator>
                    <q-item v-for="task in pendingGrading" :key="task.id" class="q-py-md">
                        <q-item-section>
                            <q-item-label class="text-weight-bold">{{ task.assignment }}</q-item-label>
                            <q-item-label caption>Class: {{ task.class }} • {{ task.count }} submissions pending</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-btn outline color="primary" label="Grade Now" size="sm" no-caps />
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
        </q-card>
      </div>

      <!-- Right Sidebar (Schedule) -->
      <div class="col-12 col-md-4">
        <q-card class="my-card shadow-1 rounded-borders-lg bg-blue-9 text-white">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold opacity-80">Next Class</div>
            <div class="text-h4 text-weight-bolder q-mt-sm">Physics 101</div>
            <div class="text-subtitle2 q-mt-xs opacity-90">Grade 11 - Hall A</div>
            
            <div class="q-mt-lg flex items-center">
               <q-icon name="schedule" size="xs" class="q-mr-sm" />
               <span class="text-weight-medium">Today, 2:00 PM - 4:00 PM</span>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="my-card shadow-1 rounded-borders-lg q-mt-lg">
            <q-card-section class="q-pb-sm">
                <div class="text-h6 text-weight-bold text-dark font-outfit">Notice Board</div>
            </q-card-section>
            <q-card-section>
                <q-list class="q-gutter-md">
                    <div class="bg-yellow-1 q-pa-sm rounded-borders border-yellow text-grey-9 text-caption">
                        <strong>Admin:</strong> Staff meeting on Friday at 9 AM.
                    </div>
                     <div class="bg-green-1 q-pa-sm rounded-borders border-green text-grey-9 text-caption">
                        <strong>System:</strong> Exam marks for Grade 10 uploaded successfully.
                    </div>
                </q-list>
            </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const stats = ref([
  { label: 'Total Students', value: 145, icon: 'groups', color: 'blue' },
  { label: 'Active Classes', value: 4, icon: 'class', color: 'purple' },
  { label: 'Assignments', value: 12, icon: 'assignment', color: 'orange' },
  { label: 'Avg Attendance', value: '92%', icon: 'fact_check', color: 'green' }
])

const activeClasses = ref([
    { id: 1, name: 'Advanced Level Physics - 2025', time: 'Mon/Wed 2:00 PM', students: 45 },
    { id: 2, name: 'Grade 11 Mathematics', time: 'Tue/Thu 4:00 PM', students: 32 },
    { id: 3, name: 'Revision Class - Chemistry', time: 'Sat 8:00 AM', students: 50 },
    { id: 4, name: 'Science for Beginners', time: 'Fri 3:00 PM', students: 18 }
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
.my-card {
  border-radius: 16px;
  border: 1px solid #f0f0f0;
}
.rounded-borders-md {
    border-radius: 8px;
}
.opacity-80 {
    opacity: 0.8;
}
.opacity-90 {
    opacity: 0.9;
}
.border-yellow {
    border: 1px solid #f9e79f;
}
.border-green {
    border: 1px solid #abebc6;
}
</style>
