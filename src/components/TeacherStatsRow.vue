<template>
  <div class="row q-col-gutter-md q-mb-xl">
    <!-- Total Students -->
    <div class="col-12 col-sm-6 col-md-3">
      <q-card class="stats-card bg-white shadow-sm rounded-xl cursor-pointer hover-lift">
        <q-card-section>
          <div class="row items-center justify-between no-wrap">
            <div class="row items-center">
               <div class="icon-box bg-blue-50 q-pa-sm rounded-borders text-blue-600 q-mr-md">
                 <q-icon name="groups" size="24px" />
               </div>
               <div>
                 <div class="text-caption text-slate-500 text-weight-medium">Total Students</div>
                 <div class="text-h5 text-weight-bold text-slate-800">{{ totalStudents }}</div>
               </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Avg Attendance (With Sparkline) -->
    <div class="col-12 col-sm-6 col-md-3">
      <q-card class="stats-card bg-white shadow-sm rounded-xl cursor-pointer hover-lift">
        <q-card-section>
          <div class="row items-center justify-between no-wrap">
             <div>
               <div class="text-caption text-slate-500 text-weight-medium">Avg. Attendance</div>
               <div class="text-h5 text-weight-bold text-slate-800">{{ avgAttendance }}%</div>
               <div class="text-caption text-blue-600 flex items-center q-mt-xs" v-if="avgAttendance >= 75">
                 <q-icon name="trending_up" size="14px" class="q-mr-xs" />
                 <span>Good rate</span>
               </div>
               <div class="text-caption text-red-600 flex items-center q-mt-xs" v-else>
                 <q-icon name="trending_down" size="14px" class="q-mr-xs" />
                 <span>Needs attention</span>
               </div>
             </div>
             <!-- SVG Sparkline -->
             <div style="width: 80px; height: 40px">
                <svg viewBox="0 0 80 40" class="full-width full-height">
                   <path d="M0 30 Q 10 25, 20 28 T 40 15 T 60 20 T 80 5" 
                         fill="none" 
                         stroke="#2563EB" 
                         stroke-width="2" 
                         stroke-linecap="round" />
                </svg>
             </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Pending Assignments -->
    <div class="col-12 col-sm-6 col-md-3">
      <q-card class="stats-card bg-white shadow-sm rounded-xl cursor-pointer hover-lift relative-position overflow-hidden">
        <!-- Amber indicator line -->
        <div class="absolute-left full-height bg-amber-500" style="width: 4px;"></div>
        <q-card-section class="q-pl-lg">
           <div class="row items-center justify-between">
              <div>
                <div class="text-caption text-slate-500 text-weight-medium">Pending Review</div>
                <div class="text-h5 text-weight-bold text-amber-500">{{ pendingCount }}</div>
              </div>
              <div class="icon-box bg-amber-50 q-pa-sm rounded-borders text-amber-500">
                <q-icon name="assignment_late" size="24px" />
              </div>
           </div>
           <div class="text-caption text-grey-6 q-mt-sm">Requires grading</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Active Classes -->
    <div class="col-12 col-sm-6 col-md-3">
      <q-card class="stats-card bg-white shadow-sm rounded-xl cursor-pointer hover-lift">
        <q-card-section>
           <div class="row items-center justify-between">
              <div>
                <div class="text-caption text-slate-500 text-weight-medium">Active Classes</div>
                <div class="text-h5 text-weight-bold text-slate-800">{{ String(totalClasses).padStart(2, '0') }}</div>
              </div>
              <div class="icon-box bg-blue-50 q-pa-sm rounded-borders text-blue-600">
                <q-icon name="class" size="24px" />
              </div>
           </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  totalStudents: {
    type: Number,
    default: 0
  },
  totalClasses: {
    type: Number,
    default: 0
  },
  avgAttendance: {
    type: Number,
    default: 0
  },
  pendingCount: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped>
.icon-box {
  border-radius: 12px;
}
.rounded-borders {
  border-radius: 12px;
}
</style>
