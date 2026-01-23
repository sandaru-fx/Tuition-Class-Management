<template>
  <q-page class="q-pa-md q-pa-lg-xl bg-grey-1">
    
    <!-- Hero Section: Resume Learning -->
    <div class="row q-mb-lg">
        <div class="col-12">
            <q-card class="bg-dark text-white rounded-borders-lg shadow-2 overflow-hidden relative-position hover-scale">
                <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" class="absolute-full opacity-30" style="filter: grayscale(100%) brightness(0.4);" />
                
                <q-card-section class="q-pa-lg q-pa-md-xl relative-position z-top row items-center">
                    <div class="col-12 col-md-8">
                        <div class="text-subtitle1 text-blue-3 text-weight-bold text-uppercase letter-spacing-1 q-mb-sm">
                            <q-icon name="waving_hand" /> Welcome Back, {{ studentProfile?.full_name?.split(' ')[0] || 'Student' }}!
                        </div>
                        <h1 class="text-h3 text-weight-bolder q-mb-md font-outfit leading-tight">
                            Ready to master <br/> <span class="text-blue-4">Quadratic Equations?</span>
                        </h1>
                        <p class="text-grey-4 text-body1 q-mb-lg" style="max-width: 600px;">
                            You left off at <strong>Chapter 3: Algebra</strong>. Continue where you stopped to keep your streak alive!
                        </p>
                        <q-btn 
                            unelevated 
                            color="blue-6" 
                            text-color="white" 
                            class="q-px-xl q-py-sm text-weight-bold shadow-blue"
                            rounded
                            icon-right="play_circle"
                            label="Resume Learning" 
                        />
                    </div>
                    <!-- Circular Progress (Visual Candy) -->
                    <div class="col-12 col-md-4 row justify-center gt-sm">
                         <q-circular-progress
                            show-value
                            :value="65"
                            size="160px"
                            :thickness="0.15"
                            color="blue-4"
                            track-color="grey-8"
                            class="text-blue-2 text-weight-bold text-h4"
                            reverse
                        >
                            65%
                        </q-circular-progress>
                    </div>
                </q-card-section>
            </q-card>
        </div>
    </div>

    <div class="row q-col-gutter-xl">
        
        <!-- Left Column: Main Content -->
        <div class="col-12 col-lg-8">
            
            <!-- Quick Stats -->
            <div class="row q-col-gutter-md q-mb-xl">
                <div class="col-12 col-sm-6">
                    <q-card flat class="bg-white rounded-borders-lg border-light q-pa-md row items-center no-wrap">
                        <q-avatar color="green-1" text-color="green-7" icon="check_circle" size="50px" font-size="28px" />
                         <div class="q-ml-md">
                            <div class="text-h5 text-weight-bolder font-outfit text-dark">92%</div>
                            <div class="text-caption text-grey-6 text-uppercase text-weight-bold">Attendance</div>
                        </div>
                    </q-card>
                </div>
                 <div class="col-12 col-sm-6">
                    <q-card flat class="bg-white rounded-borders-lg border-light q-pa-md row items-center no-wrap">
                        <q-avatar color="orange-1" text-color="orange-8" icon="emoji_events" size="50px" font-size="28px" />
                         <div class="q-ml-md">
                            <div class="text-h5 text-weight-bolder font-outfit text-dark">78/100</div>
                            <div class="text-caption text-grey-6 text-uppercase text-weight-bold">Last Result</div>
                        </div>
                    </q-card>
                </div>
            </div>

            <!-- My Courses -->
            <div class="row items-center justify-between q-mb-md">
                <div class="text-h5 font-outfit text-weight-bold text-dark">My Courses</div>
                <q-btn flat dense no-caps color="primary" label="View All" icon-right="arrow_forward" />
            </div>

            <div class="row q-col-gutter-lg q-mb-xl">
                <div class="col-12" v-for="course in courses" :key="course.id">
                    <q-card flat bordered class="rounded-borders-lg hover-border-primary transition-all">
                        <q-card-section class="row items-center cursor-pointer">
                            <q-avatar rounded size="60px" :color="course.color" text-color="white" class="q-mr-md shadow-2">
                                <span class="text-h6 text-weight-bold">{{ course.code }}</span>
                            </q-avatar>
                            
                            <div class="col">
                                <div class="text-h6 text-weight-bold text-dark line-clamp-1">{{ course.name }}</div>
                                <div class="text-caption text-grey-7 q-mb-sm">{{ course.lessons_completed }} / {{ course.total_lessons }} Lessons Completed</div>
                                <q-linear-progress :value="course.progress" size="6px" :color="course.progress_color" rounded track-color="grey-2" />
                            </div>

                             <div class="col-auto q-ml-md">
                                <q-btn round flat icon="chevron_right" color="grey-5" />
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
            </div>

        </div>

        <!-- Right Column: Sidebar Widgets -->
        <div class="col-12 col-lg-4">
            
            <!-- Deadline Widget -->
            <q-card flat bordered class="rounded-borders-lg bg-white q-mb-lg border-light">
                <q-card-section class="row items-center justify-between q-pb-xs">
                    <div class="text-h6 font-outfit text-weight-bold">Due This Week</div>
                    <q-badge color="red-1" text-color="red-8" rounded label="2 Pending" />
                </q-card-section>

                <q-list separator>
                    <q-item v-for="task in deadlines" :key="task.id" class="q-py-md">
                        <q-item-section avatar top>
                           <q-checkbox v-model="task.completed" color="grey-4" keep-color />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label class="text-weight-bold text-dark">{{ task.title }}</q-item-label>
                            <q-item-label caption class="text-red-5 text-weight-medium">
                                <q-icon name="schedule" size="12px" class="q-mr-xs" />Due {{ task.due_date }}
                            </q-item-label>
                        </q-item-section>
                        <q-item-section side>
                            <q-btn flat round dense icon="upload_file" color="primary" size="sm" />
                        </q-item-section>
                    </q-item>
                </q-list>
                 <q-card-actions align="center" class="q-pt-none q-pb-md">
                    <q-btn flat no-caps color="grey-7" label="View Calendar" size="sm" />
                </q-card-actions>
            </q-card>

            <!-- AI Recommendation Mock -->
            <q-card class="bg-gradient-purple text-white rounded-borders-lg shadow-2 relative-position overflow-hidden">
                <div class="absolute-right" style="top: -20px; right: -20px; opacity: 0.2">
                    <q-icon name="auto_awesome" size="120px" />
                </div>
                <q-card-section class="relative-position z-top">
                     <div class="row items-center q-mb-sm">
                        <q-icon name="psychology" size="sm" class="q-mr-sm" />
                        <div class="text-subtitle2 text-weight-bold text-uppercase opacity-80">AI Insight</div>
                     </div>
                     <div class="text-h6 text-weight-bold q-mb-xs">Weak in Algebra?</div>
                     <p class="text-body2 opacity-90 q-mb-md">Your last quiz score was 55%. We recommend a quick review session.</p>
                     <q-btn unelevated color="white" text-color="purple-9" label="Start Review" no-caps class="full-width text-weight-bold" />
                </q-card-section>
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

// Mock Data for Portfolio Showcase
const courses = ref([
    { id: 1, name: 'Mathematics - Grade 11', code: 'MA', progress: 0.65, progress_color: 'blue', color: 'blue-5', lessons_completed: 13, total_lessons: 20 },
    { id: 2, name: 'Science - Grade 11', code: 'SC', progress: 0.40, progress_color: 'orange', color: 'orange-5', lessons_completed: 8, total_lessons: 20 },
    { id: 3, name: 'English Literature', code: 'EN', progress: 0.90, progress_color: 'green', color: 'green-5', lessons_completed: 18, total_lessons: 20 },
])

const deadlines = ref([
    { id: 1, title: 'Algebra Worksheet 3.2', due_date: 'Tomorrow, 5:00 PM', completed: false },
    { id: 2, title: 'Science Lab Report', due_date: 'Friday, 10:00 AM', completed: false },
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
.font-outfit {
  font-family: 'Outfit', sans-serif;
}
.leading-tight {
    line-height: 1.1;
}
.rounded-borders-lg {
    border-radius: 20px;
}
.border-light {
    border: 1px solid #f3f4f6;
}
.opacity-30 {
    opacity: 0.3;
}
.opacity-80 {
    opacity: 0.8;
}
.opacity-90 {
    opacity: 0.9;
}
.shadow-blue {
    box-shadow: 0 4px 14px 0 rgba(0, 118, 255, 0.39);
}
.hover-scale {
    transition: transform 0.3s ease;
    &:hover {
        transform: scale(1.01);
    }
}
.hover-border-primary {
    transition: all 0.2s ease;
    border: 1px solid transparent;
    &:hover {
        border-color: #3b82f6; // Tailwind blue-500
        background: #fdfdfd;
        transform: translateY(-2px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
}
.bg-gradient-purple {
    background: linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%);
}
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
