<template>
  <q-page class="q-pa-lg q-pa-xl-xl bg-gray-soft transition-all">
    
    <!-- Hero Section: Premium SaaS Banner -->
    <div class="row q-mb-xl">
        <div class="col-12" v-if="loading">
             <q-skeleton height="380px" square class="rounded-borders-40" />
        </div>
        <div class="col-12" v-else>
            <q-card flat class="hero-card text-white overflow-hidden relative-position shadow-soft hover-lift transition-all">
                <!-- Glowing Background Elements -->
                <div class="glow-1"></div>
                <div class="glow-2"></div>
                
                <q-card-section class="q-pa-xl relative-position z-top row items-center no-wrap">
                    <div class="col-12 col-md-7">
                        <div class="badge-glass q-mb-lg inline-block">
                             <q-icon name="auto_awesome" size="14px" class="q-mr-xs text-blue-2" />
                             <span class="text-caption text-weight-bold tracking-widest text-uppercase">Recommended Goal</span>
                        </div>
                        
                        <h1 class="text-h2 text-weight-black q-my-sm font-outfit leading-none tracking-tighter">
                            Welcome Back, <br/>
                            <span class="text-white">{{ studentProfile?.full_name?.split(' ')[0] || 'Sandaru' }}</span>
                        </h1>
                        
                        <p class="text-h6 text-blue-1 q-mt-md q-mb-xl font-medium opacity-90" style="max-width: 500px; line-height: 1.6">
                            You're doing great! Last session you completed <span class="text-white text-weight-bold underline decoration-blue-3 underline-offset-4">Chapter 3: Linear Equations</span>. Ready for more?
                        </p>
                        
                        <div class="row q-gutter-md">
                            <q-btn 
                                unelevated 
                                color="white" 
                                text-color="blue-7" 
                                class="q-px-xl q-py-md text-weight-black rounded-xl hover-scale transition-all shadow-md"
                                icon-right="arrow_forward"
                                label="Continue Learning" 
                                no-caps
                            />
                             <q-btn 
                                outline
                                class="q-px-lg text-white rounded-xl text-weight-bold hover-bg-white-opacity-10 transition-all border-2"
                                icon="calendar_today"
                                label="My Schedule" 
                                no-caps
                            />
                        </div>
                    </div>

                    <!-- Visual Progress: 3D-ish Glass Effect -->
                    <div class="col-md-5 gt-sm row justify-center perspective">
                         <div class="stats-glass q-pa-lg text-center floating shadow-2xl">
                             <q-circular-progress
                                show-value
                                :value="72"
                                size="180px"
                                :thickness="0.12"
                                color="white"
                                track-color="white-opacity-10"
                                class="text-white text-weight-black text-h3"
                            >
                                72<span style="font-size: 16px; opacity: 0.7">%</span>
                            </q-circular-progress>
                            <div class="q-mt-lg text-weight-bold text-subtitle1 opacity-90">Course Progress</div>
                         </div>
                    </div>
                </q-card-section>
            </q-card>
        </div>
    </div>

    <div class="row q-col-gutter-xl" v-if="loading">
        <div class="col-12 col-lg-8">
            <div class="row q-col-gutter-lg">
                <div class="col-6" v-for="n in 4" :key="n">
                    <q-skeleton height="140px" class="rounded-3xl" />
                </div>
            </div>
        </div>
        <div class="col-12 col-lg-4">
             <q-skeleton height="300px" class="rounded-3xl q-mb-lg" />
             <q-skeleton height="200px" class="rounded-3xl" />
        </div>
    </div>

    <div class="row q-col-gutter-xl" v-else>
        <!-- Main Content Area -->
        <div class="col-12 col-lg-8">
            
            <!-- Quick Insights Header -->
            <div class="row items-center justify-between q-mb-lg">
                <div class="text-h5 font-outfit text-weight-black text-slate-900 tracking-tight">Active Courses</div>
                <q-btn flat dense no-caps color="blue-6" label="Manage all courses" icon-right="chevron_right" class="text-weight-bold hover-translate-x transition-all" />
            </div>

            <!-- Enhanced Course Grid (No Purple) -->
            <div class="row q-col-gutter-lg q-mb-xl">
                <div class="col-12 col-md-6" v-for="course in courses" :key="course.id">
                    <q-card flat class="course-card q-pa-md transition-all border-slate shadow-soft hover-lift">
                        <div class="row items-start no-wrap">
                            <div :class="`icon-box bg-${course.color}-soft text-${course.color}-600 q-mr-md`">
                                <q-icon :name="course.icon" size="24px" />
                            </div>
                            <div class="col">
                                <div class="text-weight-black text-slate-900 text-subtitle1 q-mb-xs line-height-1">{{ course.name }}</div>
                                <div class="text-caption text-slate-500 text-weight-medium q-mb-md">Intermediate • Grade 11</div>
                                
                                <div class="row items-center justify-between q-mb-xs">
                                    <span class="text-caption text-weight-bold text-slate-900">{{ Math.round(course.progress * 100) }}% Complete</span>
                                    <span class="text-caption text-slate-400 font-medium">{{ course.lessons_completed }}/{{ course.total_lessons }}</span>
                                </div>
                                <q-linear-progress :value="course.progress" size="8px" :color="course.progress_color" rounded track-color="slate-100" />
                            </div>
                        </div>
                    </q-card>
                </div>
            </div>

            <!-- Empty State / Activity Refinement -->
            <div class="bg-white rounded-3xl q-pa-xl border-slate text-center q-mb-xl shadow-soft interactive-card transition-all">
                <div class="row justify-center q-mb-md">
                     <div class="bg-blue-50 rounded-full q-pa-md shadow-inner pulse-slow">
                        <q-icon name="auto_awesome_motion" size="48px" color="blue-4" />
                     </div>
                </div>
                <div class="text-h6 text-slate-900 text-weight-black font-outfit">Learning Activity</div>
                <p class="text-slate-500 q-mb-lg max-w-sm q-mx-auto">You're all caught up! No recent alerts or missed assignments for this week. Keep maintaining your streak.</p>
                <!-- Placeholder for a Small Chart -->
                <div class="row justify-center q-gutter-x-sm items-end h-x-32 q-pt-md">
                    <div v-for="n in 7" :key="n" class="bg-blue-100 rounded-t-lg transition-all hover-bg-blue-600 cursor-pointer bar-anim" :style="`width: 32px; height: ${20 + (Math.random() * 60)}px`" />
                </div>
            </div>
        </div>

        <!-- Sidebar Widgets -->
        <div class="col-12 col-lg-4">
            
            <!-- Deadline Card -->
            <q-card flat class="bg-white rounded-3xl q-mb-xl overflow-hidden border-slate shadow-soft">
                <q-card-section class="q-pa-lg">
                    <div class="row items-center justify-between q-mb-lg">
                        <div class="text-h6 text-weight-black text-slate-900 font-outfit">Upcoming Events</div>
                        <q-btn round flat icon="more_horiz" color="slate-300" />
                    </div>

                    <q-list class="q-gutter-y-md">
                        <q-item v-for="task in deadlines" :key="task.id" class="deadline-item q-pa-md transition-all rounded-2xl hover-bg-slate-50 cursor-pointer">
                            <q-item-section avatar>
                                <div :class="`day-box ${task.urgent ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`">
                                    <div class="text-weight-black uppercase" style="font-size: 14px">{{ task.day }}</div>
                                    <div class="text-caption text-weight-bold" style="font-size: 10px">{{ task.month }}</div>
                                </div>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label class="text-weight-black text-slate-900">{{ task.title }}</q-item-label>
                                <q-item-label caption class="text-weight-bold text-slate-400">{{ task.time }}</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-btn flat round icon="keyboard_arrow_right" color="slate-300" size="sm" />
                            </q-item-section>
                        </q-item>
                    </q-list>

                    <q-btn flat no-caps color="blue-6" label="View calendar" class="full-width q-mt-lg text-weight-black rounded-xl hover-bg-blue-50 transition-all" />
                </q-card-section>
            </q-card>

            <!-- AI Insight Widget (Refined Blue) -->
            <q-card flat class="bg-slate-900 text-white rounded-3xl q-pa-lg relative-position overflow-hidden shadow-2xl hover-lift transition-all cursor-pointer">
                 <div class="absolute-right" style="top: -20px; right: -20px; opacity: 0.15">
                    <q-icon name="rocket_launch" size="180px" />
                </div>
                <div class="badge-glass-dark q-mb-md inline-block">
                    <span class="text-weight-bold tracking-widest text-uppercase" style="font-size: 10px">AI Learning Insight</span>
                </div>
                <div class="text-h6 text-weight-black q-mb-xs line-height-1">Speed up your Science progress!</div>
                <p class="text-body2 text-slate-400 q-mb-xl opacity-80 font-medium">You've mastered Physics concepts 20% faster than average. Keep going with Biology!</p>
                <q-btn unelevated color="blue-600" label="Start Review Session" no-caps class="full-width rounded-xl text-weight-black q-py-md hover-scale transition-all" />
            </q-card>

        </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from 'boot/supabase'

const studentProfile = ref(null)
const loading = ref(true)

// Refined Mock Data (Removed Purple)
const courses = ref([
    { id: 1, name: 'Advanced Mathematics', code: 'MA', progress: 0.72, progress_color: 'blue-6', color: 'blue', icon: 'functions', lessons_completed: 18, total_lessons: 25 },
    { id: 2, name: 'Physics & Relativity', code: 'PH', progress: 0.45, progress_color: 'orange-6', color: 'orange', icon: 'lightbulb', lessons_completed: 9, total_lessons: 20 },
    { id: 3, name: 'Modern Biology', code: 'BI', progress: 0.88, progress_color: 'green-6', color: 'green', icon: 'biotech', lessons_completed: 22, total_lessons: 25 },
    { id: 4, name: 'Global History', code: 'HI', progress: 0.30, progress_color: 'blue-grey-6', color: 'blue-grey', icon: 'public', lessons_completed: 6, total_lessons: 20 },
])

const deadlines = ref([
    { id: 1, title: 'Calculus Assignment', time: '05:00 PM', day: '24', month: 'JAN', urgent: true },
    { id: 2, title: 'Physics Lab Viva', time: '10:00 AM', day: '26', month: 'JAN', urgent: false },
    { id: 3, title: 'Biology Report', time: '02:00 PM', day: '28', month: 'JAN', urgent: false },
])

async function fetchProfile() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      studentProfile.value = profile
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<style lang="scss" scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.leading-none { line-height: 1.1; }
.tracking-tighter { letter-spacing: -2px; }

.bg-gray-soft { background-color: #F8FAFC; }

// Hero Card Professional Blue Gradient
.hero-card {
    background: linear-gradient(135deg, #2563EB 0%, #3B82F6 50%, #60A5FA 100%);
    border-radius: 40px;
    z-index: 1;
    
    .glow-1 {
        position: absolute;
        top: -100px;
        right: -100px;
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
        z-index: 0;
    }
    .glow-2 {
        position: absolute;
        bottom: -150px;
        left: -100px;
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
        z-index: 0;
    }
}

.badge-glass {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 8px 16px;
    border-radius: 100px;
    color: white;
}

.badge-glass-dark {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 6px 14px;
    border-radius: 100px;
    color: rgba(255, 255, 255, 0.7);
}

.stats-glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 32px;
}

// Stats & Cards: Professional Light Mode Rules
.border-slate {
    border: 1px solid #E2E8F0;
}

.shadow-soft {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01);
}

.course-card {
    border-radius: 28px;
    background: white;
    
    &:hover {
        border-color: #3b82f6;
        background: #F8FAFF;
    }
}

.icon-box {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.bg-blue-soft { background: #eff6ff; }
.bg-orange-soft { background: #fff7ed; }
.bg-green-soft { background: #f0fdf4; }
.bg-blue-grey-soft { background: #f1f5f9; }

.day-box {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

// Micro-interactions
@keyframes floating {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(2deg); }
    100% { transform: translateY(0px) rotate(0deg); }
}

@keyframes pulse-slow {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
}

.pulse-slow {
    animation: pulse-slow 3s ease-in-out infinite;
}

.bar-anim {
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    &:hover {
        height: 100px !important;
        background-color: #2563EB !important;
    }
}

.interactive-card:hover {
    border-color: #CBD5E1;
    transform: translateY(-4px);
}

.transition-all { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.hover-scale:hover { 
    transform: scale(1.05);
    .q-icon {
        transform: translateX(4px);
    }
}
.hover-lift:hover { 
    transform: translateY(-8px); 
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
.hover-translate-x:hover { transform: translateX(8px); }
.hover-bg-white-opacity-10:hover { background: rgba(255, 255, 255, 0.1); }

.text-slate-900 { color: #0F172A; }
.text-slate-500 { color: #64748B; }

// Dark Mode Compliance
.body--dark {
    .bg-gray-soft { background-color: #0f172a !important; }
    .course-card, .bg-white { 
        background-color: #1e293b !important;
        border-color: #334155 !important;
        color: white !important;
    }
    .text-slate-900 { color: #f1f5f9 !important; }
    .text-slate-500 { color: #94a3b8 !important; }
    .bg-slate-50, .deadline-item:hover, .bg-blue-50 { background: #334155 !important; }
    .border-slate { border-color: #334155 !important; }
    
    .hero-card {
        background: #1e293b !important;
    }
}
</style>
