<template>
  <q-page class="q-pa-lg q-pa-xl-xl bg-gray-soft">
    
    <!-- Hero Section: Premium SaaS Banner -->
    <div class="row q-mb-xl">
        <div class="col-12">
            <q-card flat class="hero-card text-white overflow-hidden relative-position shadow-2xl">
                <!-- Glowing Background Elements -->
                <div class="glow-1"></div>
                <div class="glow-2"></div>
                
                <q-card-section class="q-pa-xl relative-position z-top row items-center no-wrap">
                    <div class="col-12 col-md-7">
                        <div class="badge-glass q-mb-lg inline-block">
                             <q-icon name="sparkles" size="14px" class="q-mr-xs text-blue-3" />
                             <span class="text-caption text-weight-bold tracking-widest text-uppercase">Recommended for you</span>
                        </div>
                        
                        <h1 class="text-h2 text-weight-black q-my-sm font-outfit leading-none tracking-tighter">
                            Welcome Back, <br/>
                            <span class="text-gradient">{{ studentProfile?.full_name?.split(' ')[0] || 'Sandaru' }}</span>
                        </h1>
                        
                        <p class="text-h6 text-blue-1 q-mt-md q-mb-xl font-medium opacity-80" style="max-width: 500px; line-height: 1.6">
                            You're doing great! Last session you completed <span class="text-white text-weight-bold">Chapter 3: Linear Equations</span>. Ready for more?
                        </p>
                        
                        <div class="row q-gutter-md">
                            <q-btn 
                                unelevated 
                                color="white" 
                                text-color="blue-7" 
                                class="q-px-xl q-py-md text-weight-black rounded-xl hover-scale transition-all"
                                icon-right="play_arrow"
                                label="Continue Learning" 
                                no-caps
                            />
                             <q-btn 
                                flat 
                                class="q-px-lg text-white white-glass rounded-xl text-weight-bold"
                                icon="calendar_today"
                                label="My Schedule" 
                                no-caps
                            />
                        </div>
                    </div>

                    <!-- Visual Representation: 3D Elements Placeholder or Chart -->
                    <div class="col-md-5 gt-sm row justify-center perspective">
                         <div class="stats-glass q-pa-lg text-center floating">
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
                            <div class="q-mt-lg text-weight-bold text-subtitle1 opacity-90">Weekly Completion</div>
                         </div>
                    </div>
                </q-card-section>
            </q-card>
        </div>
    </div>

    <div class="row q-col-gutter-xl">
        
        <!-- Main Content Area -->
        <div class="col-12 col-lg-8">
            
            <!-- Quick Insights Header -->
            <div class="row items-center justify-between q-mb-lg">
                <div class="text-h5 font-outfit text-weight-black text-slate-900 tracking-tight">Current Progress</div>
                <q-btn flat dense no-caps color="blue-6" label="Manage all courses" icon-right="chevron_right" class="text-weight-bold" />
            </div>

            <!-- Enhanced Course Grid -->
            <div class="row q-col-gutter-lg q-mb-xl">
                <div class="col-12 col-md-6" v-for="course in courses" :key="course.id">
                    <q-card flat class="course-card q-pa-md transition-all">
                        <div class="row items-start no-wrap">
                            <div :class="`icon-box bg-${course.color}-soft text-${course.color}-600 q-mr-md`">
                                <q-icon :name="course.icon" size="24px" />
                            </div>
                            <div class="col">
                                <div class="text-weight-black text-slate-900 text-subtitle1 q-mb-xs line-height-1">{{ course.name }}</div>
                                <div class="text-caption text-slate-400 text-weight-medium q-mb-md">Standard Level • Grade 11</div>
                                
                                <div class="row items-center justify-between q-mb-xs">
                                    <span class="text-caption text-weight-bold text-slate-900">{{ Math.round(course.progress * 100) }}% Completed</span>
                                    <span class="text-caption text-slate-400">{{ course.lessons_completed }}/{{ course.total_lessons }}</span>
                                </div>
                                <q-linear-progress :value="course.progress" size="8px" :color="course.progress_color" rounded track-color="slate-50" />
                            </div>
                        </div>
                    </q-card>
                </div>
            </div>

            <!-- Activity / Performance (Optional visual) -->
            <div class="bg-white rounded-3xl q-pa-xl border-dashed border-2 border-slate-100 text-center q-mb-xl">
                <q-icon name="insights" size="48px" color="slate-200" class="q-mb-md" />
                <div class="text-h6 text-slate-900 text-weight-black">Learning Activity</div>
                <p class="text-slate-400 q-mb-lg">Your study hours have increased by 15% this week. Keep it up!</p>
                <!-- Placeholder for a Small Chart if needed -->
                <div class="row justify-center q-gutter-x-sm">
                    <div v-for="n in 7" :key="n" class="bg-slate-50 rounded-lg" :style="`width: 30px; height: ${30 + (Math.random() * 50)}px`" />
                </div>
            </div>
        </div>

        <!-- Sidebar Widgets -->
        <div class="col-12 col-lg-4">
            
            <!-- Deadline Card -->
            <q-card flat class="bg-white rounded-3xl q-mb-xl overflow-hidden border border-slate-50">
                <q-card-section class="q-pa-lg">
                    <div class="row items-center justify-between q-mb-lg">
                        <div class="text-h6 text-weight-black text-slate-900 font-outfit">Upcoming</div>
                        <q-btn round flat icon="more_horiz" color="slate-300" />
                    </div>

                    <q-list class="q-gutter-y-md">
                        <q-item v-for="task in deadlines" :key="task.id" class="deadline-item q-pa-md transition-all">
                            <q-item-section avatar>
                                <div :class="`day-box ${task.urgent ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500'}`">
                                    <div class="text-weight-black">{{ task.day }}</div>
                                    <div class="text-caption text-weight-bold" style="font-size: 10px">{{ task.month }}</div>
                                </div>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label class="text-weight-black text-slate-900">{{ task.title }}</q-item-label>
                                <q-item-label caption class="text-weight-bold text-slate-400">{{ task.time }}</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-btn flat round icon="chevron_right" color="slate-300" size="sm" />
                            </q-item-section>
                        </q-item>
                    </q-list>

                    <q-btn flat no-caps color="blue-6" label="View full calendar" class="full-width q-mt-lg text-weight-bold" />
                </q-card-section>
            </q-card>

            <!-- AI Insight Widget -->
            <q-card flat class="bg-slate-900 text-white rounded-3xl q-pa-lg relative-position overflow-hidden shadow-xl">
                 <div class="absolute-right" style="top: -20px; right: -20px; opacity: 0.1">
                    <q-icon name="psychology" size="180px" />
                </div>
                <div class="badge-glass-dark q-mb-md inline-block">
                    <span class="text-weight-bold tracking-widest text-uppercase" style="font-size: 10px">AI Assistant</span>
                </div>
                <div class="text-h6 text-weight-black q-mb-xs line-height-1">You're doing great in Science!</div>
                <p class="text-body2 text-slate-400 q-mb-xl">Based on your recent tests, you might want to spend 15 more minutes on Organic Chemistry tonight.</p>
                <q-btn unelevated color="blue-6" label="Start Review" no-caps class="full-width rounded-xl text-weight-black q-py-sm" />
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

// Refined Mock Data
const courses = ref([
    { id: 1, name: 'Advanced Mathematics', code: 'MA', progress: 0.72, progress_color: 'blue-6', color: 'blue', icon: 'functions', lessons_completed: 18, total_lessons: 25 },
    { id: 2, name: 'Physics & Relativity', code: 'PH', progress: 0.45, progress_color: 'orange-6', color: 'orange', icon: 'lightbulb', lessons_completed: 9, total_lessons: 20 },
    { id: 3, name: 'Modern Biology', code: 'BI', progress: 0.88, progress_color: 'green-6', color: 'green', icon: 'biotech', lessons_completed: 22, total_lessons: 25 },
    { id: 4, name: 'Global History', code: 'HI', progress: 0.30, progress_color: 'purple-6', color: 'purple', icon: 'public', lessons_completed: 6, total_lessons: 20 },
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
.leading-none { line-height: 1; }
.tracking-tighter { letter-spacing: -3px; }

.bg-gray-soft { background-color: #F8FAFC; }

// Hero Card Styling
.hero-card {
    background: #1e293b;
    border-radius: 40px;
    z-index: 1;
    
    .glow-1 {
        position: absolute;
        top: -100px;
        right: -100px;
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(37, 99, 235, 0.4) 0%, transparent 70%);
        z-index: 0;
    }
    .glow-2 {
        position: absolute;
        bottom: -150px;
        left: -100px;
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 70%);
        z-index: 0;
    }
}

.text-gradient {
    background: linear-gradient(to right, #60a5fa, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.badge-glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 6px 14px;
    border-radius: 100px;
    color: rgba(255, 255, 255, 0.9);
}

.badge-glass-dark {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 6px 14px;
    border-radius: 100px;
    color: rgba(255, 255, 255, 0.6);
}

.white-glass {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    &:hover { background: rgba(255, 255, 255, 0.1); }
}

.stats-glass {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 30px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

// Stats & Cards
.course-card {
    border-radius: 24px;
    background: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    border: 1px solid #f1f5f9;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        border-color: #3b82f6;
    }
}

.icon-box {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.bg-blue-soft { background: #eff6ff; }
.bg-orange-soft { background: #fff7ed; }
.bg-green-soft { background: #f0fdf4; }
.bg-purple-soft { background: #faf5ff; }

.deadline-item {
    border-radius: 16px;
    &:hover { background: #f8fafc; }
}

.day-box {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.floating {
    animation: floating 3s ease-in-out infinite;
}

@keyframes floating {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
    100% { transform: translateY(0px); }
}

.transition-all { transition: all 0.3s ease; }
.hover-scale:hover { transform: scale(1.05); }

// Dark Mode
.body--dark {
    .bg-gray-soft { background-color: #0f172a !important; }
    .course-card, .bg-white { 
        background-color: #1e293b !important;
        border-color: #334155;
    }
    .text-slate-900 { color: #f1f5f9 !important; }
    .text-slate-400 { color: #94a3b8 !important; }
    .bg-slate-50, .deadline-item:hover { background: #334155 !important; }
}
</style>
