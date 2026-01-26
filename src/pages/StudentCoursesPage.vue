<template>
  <q-page class="q-pa-lg q-pa-xl-xl bg-gray-soft transition-all">
    
    <!-- Header Section -->
    <div class="row items-center justify-between q-mb-xl">
        <div class="col-12 col-md-auto">
            <h1 class="text-h3 text-weight-black font-outfit text-slate-900 q-my-none tracking-tighter">
                My Courses
            </h1>
            <p class="text-subtitle1 text-slate-500 q-mt-sm q-mb-none font-medium">
                Manage your learning journey and track your progress.
            </p>
        </div>
        <div class="col-12 col-md-auto q-mt-md q-mt-md-none row q-gutter-sm">
             <q-btn unelevated color="blue-6" label="Browse Catalog" no-caps class="rounded-xl q-px-lg text-weight-bold shadow-soft" icon="explore" />
             <q-btn outline color="slate-300" text-color="slate-600" label="Filter" no-caps class="rounded-xl q-px-lg text-weight-bold" icon="tune" />
        </div>
    </div>

    <!-- Stats Row -->
    <div class="row q-col-gutter-lg q-mb-xl">
        <div class="col-12 col-sm-6 col-md-3" v-for="stat in stats" :key="stat.label">
            <q-card flat class="bg-white rounded-2xl q-pa-lg border-slate shadow-soft hover-lift transition-all">
                <div class="row items-center no-wrap">
                    <div :class="`icon-box bg-${stat.color}-soft text-${stat.color}-600 q-mr-md`">
                        <q-icon :name="stat.icon" size="24px" />
                    </div>
                    <div>
                        <div class="text-h5 text-weight-black text-slate-900">{{ stat.value }}</div>
                        <div class="text-caption text-slate-500 text-weight-bold uppercase tracking-wider">{{ stat.label }}</div>
                    </div>
                </div>
            </q-card>
        </div>
    </div>

    <!-- Courses Grid -->
    <div class="row q-col-gutter-xl">
        <div class="col-12 col-md-6 col-lg-4" v-for="course in courses" :key="course.id">
            <q-card flat class="course-card-full bg-white overflow-hidden shadow-soft hover-lift transition-all border-slate">
                <!-- Thumbnail Placeholder with Gradient -->
                <div :class="`course-thumbnail bg-gradient-${course.color} relative-position`">
                    <div class="absolute-center">
                        <q-icon :name="course.icon" size="64px" class="text-white opacity-40 pulse-slow" />
                    </div>
                    <div class="absolute-bottom-left q-pa-md">
                        <q-badge :color="course.progress === 1 ? 'green' : 'blue-6'" class="rounded-lg q-pa-sm text-weight-bold shadow-md">
                            {{ course.progress === 1 ? 'Completed' : 'In Progress' }}
                        </q-badge>
                    </div>
                </div>

                <q-card-section class="q-pa-lg">
                    <div class="row items-center justify-between q-mb-sm">
                         <div class="text-caption text-blue-600 text-weight-black uppercase tracking-widest">{{ course.code }}</div>
                         <div class="text-caption text-slate-400 font-bold">{{ course.instructor }}</div>
                    </div>
                    
                    <div class="text-h6 text-weight-black text-slate-900 q-mb-md line-height-1 font-outfit">
                        {{ course.name }}
                    </div>

                    <div class="row items-center q-gutter-x-md q-mb-lg text-slate-500 text-caption font-bold">
                        <div class="row items-center"><q-icon name="schedule" size="14px" class="q-mr-xs" /> {{ course.duration }}</div>
                        <div class="row items-center"><q-icon name="menu_book" size="14px" class="q-mr-xs" /> {{ course.lessons }} Lessons</div>
                    </div>

                    <q-separator class="q-mb-lg opacity-10" />

                    <div class="row items-center justify-between q-mb-xs">
                        <span class="text-caption text-weight-black text-slate-900">{{ Math.round(course.progress * 100) }}% Progress</span>
                        <q-icon name="trending_up" color="green-6" size="16px" v-if="course.progress > 0" />
                    </div>
                    <q-linear-progress :value="course.progress" size="8px" :color="course.progress_color" rounded track-color="slate-50" />
                    
                    <div class="q-mt-xl">
                        <q-btn 
                            unelevated 
                            :color="course.progress === 1 ? 'blue-grey-1' : 'blue-6'" 
                            :text-color="course.progress === 1 ? 'blue-grey-6' : 'white'"
                            class="full-width rounded-xl q-py-md text-weight-black hover-scale transition-all"
                            :label="course.progress === 1 ? 'Review Course' : 'Continue Learning'" 
                            no-caps
                        />
                    </div>
                </q-card-section>
            </q-card>
        </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const stats = ref([
    { label: 'Active Courses', value: '4', icon: 'auto_stories', color: 'blue' },
    { label: 'Completed', value: '12', icon: 'verified', color: 'green' },
    { label: 'Certificates', value: '3', icon: 'workspace_premium', color: 'orange' },
    { label: 'Study Hours', value: '48h', icon: 'timer', color: 'purple' },
])

const courses = ref([
    { 
        id: 1, 
        name: 'Advanced Quadratic Equations', 
        code: 'MAT-401', 
        instructor: 'Dr. Wickramasinghe',
        progress: 0.72, 
        progress_color: 'blue-6', 
        color: 'blue', 
        icon: 'functions', 
        lessons: 24,
        duration: '12 Weeks'
    },
    { 
        id: 2, 
        name: 'Quantum Physics Fundamentals', 
        code: 'PHY-302', 
        instructor: 'Prof. Perera',
        progress: 0.45, 
        progress_color: 'orange-6', 
        color: 'orange', 
        icon: 'lightbulb', 
        lessons: 18,
        duration: '10 Weeks'
    },
    { 
        id: 3, 
        name: 'Organic Chemistry II', 
        code: 'CHE-205', 
        instructor: 'Dr. Fernando',
        progress: 0.88, 
        progress_color: 'green-6', 
        color: 'green', 
        icon: 'science', 
        lessons: 20,
        duration: '8 Weeks'
    },
    { 
        id: 4, 
        name: 'Cell Biology & Genetics', 
        code: 'BIO-101', 
        instructor: 'Prof. Silva',
        progress: 1.0, 
        progress_color: 'green-6', 
        color: 'blue-grey', 
        icon: 'biotech', 
        lessons: 15,
        duration: '6 Weeks'
    },
    { 
        id: 5, 
        name: 'Applied Mechanics I', 
        code: 'PHY-405', 
        instructor: 'Dr. Karunaratne',
        progress: 0.25, 
        progress_color: 'red-6', 
        color: 'orange', 
        icon: 'settings_input_component', 
        lessons: 30,
        duration: '14 Weeks'
    },
    { 
        id: 6, 
        name: 'Microeconomics Theory', 
        code: 'ECO-201', 
        instructor: 'Mrs. Jayawardena',
        progress: 0.60, 
        progress_color: 'blue-6', 
        color: 'blue', 
        icon: 'trending_up', 
        lessons: 22,
        duration: '10 Weeks'
    },
    { 
        id: 7, 
        name: 'British Literature', 
        code: 'ENG-304', 
        instructor: 'Ms. Perera',
        progress: 0.15, 
        progress_color: 'purple-6', 
        color: 'purple', 
        icon: 'menu_book', 
        lessons: 12,
        duration: '8 Weeks'
    }
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

.course-card-full {
    border-radius: 32px;
}

.course-thumbnail {
    height: 180px;
    width: 100%;
}

.bg-gradient-blue { background: linear-gradient(135deg, #3B82F6, #1D4ED8); }
.bg-gradient-orange { background: linear-gradient(135deg, #F59E0B, #D97706); }
.bg-gradient-green { background: linear-gradient(135deg, #10B981, #047857); }
.bg-gradient-blue-grey { background: linear-gradient(135deg, #64748B, #334155); }

@keyframes floating {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
}

.pulse-slow {
    animation: floating 3s ease-in-out infinite;
}

.transition-all { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.hover-lift:hover { 
    transform: translateY(-8px); 
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
.hover-scale:hover { transform: scale(1.02); }

.text-slate-900 { color: #0F172A; }
.text-slate-500 { color: #64748B; }

// Dark Mode
.body--dark {
    .bg-gray-soft { background-color: #0f172a !important; }
    .bg-white { background-color: #1e293b !important; }
    .border-slate { border-color: #334155 !important; }
    .text-slate-900 { color: #f1f5f9 !important; }
    .text-slate-500 { color: #94a3b8 !important; }
    .text-blue-grey-6 { color: #94a3b8 !important; }
}
</style>
