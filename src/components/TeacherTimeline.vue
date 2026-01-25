<template>
  <div class="timeline-widget q-mb-xl">
    <div class="row items-center">
      <!-- Date Column -->
      <div class="col-12 col-md-3 q-pr-md q-mb-md-none q-mb-sm">
        <div class="text-h4 text-weight-bolder text-slate-800 font-outfit">{{ currentDate }}</div>
        <div class="text-subtitle1 text-slate-500">{{ currentDay }}</div>
      </div>

      <!-- Timeline Scroll -->
      <div class="col-12 col-md-9">
         <div class="row no-wrap q-gutter-md overflow-auto hide-scrollbar q-pb-sm">
            
            <!-- Empty State if no classes -->
            <div v-if="classes.length === 0" class="col-12 flex items-center bg-white rounded-xl shadow-sm q-pa-md">
                 <div class="text-h2 q-mr-md">☕</div>
                 <div>
                    <div class="text-weight-bold text-slate-800">No classes today!</div>
                    <div class="text-caption text-slate-500">Enjoy your coffee.</div>
                 </div>
            </div>

            <div v-for="cls in classes" :key="cls.id" 
                 class="class-card q-pa-md rounded-xl shadow-sm cursor-pointer transition-all"
                 :class="{ 
                    'bg-white border-blue-pulsing': cls.status === 'active',
                    'bg-slate-50 opacity-60 grayscale': cls.status === 'past',
                    'bg-white hover-lift': cls.status === 'future'
                 }"
                 style="min-width: 200px; border: 1px solid transparent;"
            >
               <div class="row items-center justify-between q-mb-sm">
                  <q-badge :color="getStatusColor(cls.status)" rounded class="q-px-sm">
                    {{ cls.time }}
                  </q-badge>
                  <q-icon v-if="cls.status === 'active'" name="fiber_manual_record" color="red" class="blinking" />
               </div>
               <div class="text-weight-bold text-slate-800 text-body1">{{ cls.subject }}</div>
               <div class="text-caption text-slate-500">{{ cls.grade }} • {{ cls.hall }}</div>
            </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>


const date = new Date()
const currentDate = date.getDate()
const currentDay = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long' })

const classes = [
  { id: 1, time: '08:00 AM', subject: 'Inorganic Chem', grade: 'Grade 12', hall: 'Hall A', status: 'past' },
  { id: 2, time: '10:00 AM', subject: 'Physics Tute', grade: 'Grade 11', hall: 'Hall B', status: 'active' }, // Pulsing
  { id: 3, time: '02:00 PM', subject: 'Revision', grade: 'Grade 13', hall: 'Main Hall', status: 'future' },
  { id: 4, time: '04:30 PM', subject: 'Paper Class', grade: 'Grade 10', hall: 'Hall A', status: 'future' }
]

function getStatusColor(status) {
    if (status === 'active') return 'blue-600'
    if (status === 'past') return 'grey'
    return 'blue-grey'
}
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.grayscale { filter: grayscale(1); }
.border-blue-pulsing {
    border-color: #2563EB !important;
    box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7);
    animation: pulse-blue 2s infinite;
}

@keyframes pulse-blue {
    0% {
        transform: scale(0.98);
        box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7);
    }
    70% {
        transform: scale(1);
        box-shadow: 0 0 0 10px rgba(37, 99, 235, 0);
    }
    100% {
        transform: scale(0.98);
        box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
    }
}

.blinking {
    animation: blinker 1s linear infinite;
}
@keyframes blinker {
    50% { opacity: 0; }
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none; 
}
</style>
