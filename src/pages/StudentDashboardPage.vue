<template>
  <q-page class="q-pa-md q-pa-lg-xl">
    
    <!-- Hero Section -->
    <div class="row q-mb-xl">
        <div class="col-12">
            <q-card class="bg-gradient-primary text-white rounded-borders-lg shadow-2 overflow-hidden relative-position">
                <div class="absolute-right full-height">
                    <q-icon name="school" size="200px" color="white" style="opacity: 0.1; margin-right: -50px;" />
                </div>
                <q-card-section class="q-pa-lg q-pa-md-xl relative-position z-top">
                    <div class="text-subtitle1 text-blue-2 text-weight-bold text-uppercase letter-spacing-1">Welcome Back</div>
                    <h1 class="text-h3 text-weight-bolder q-my-sm font-outfit">Student Dashboard</h1>
                    <p class="text-blue-1 text-h6 q-mb-none" style="opacity: 0.9; max-width: 600px;">
                        Track your progress, check your attendance, and stay updated with your class notices.
                    </p>
                </q-card-section>
            </q-card>
        </div>
    </div>

    <!-- Stats Row -->
    <div class="row q-col-gutter-lg q-mb-xl">
        <!-- Attendance Card -->
        <div class="col-12 col-md-4">
            <q-card class="my-card shadow-1 hover-lift h-100">
                <q-card-section>
                    <div class="row items-center no-wrap">
                        <div class="col">
                            <div class="text-caption text-grey-6 text-weight-bold text-uppercase">My Attendance</div>
                            <div class="text-h4 text-weight-bolder text-dark q-mt-sm font-outfit">{{ attendancePercentage }}%</div>
                        </div>
                        <div class="col-auto">
                            <q-circular-progress
                                show-value
                                :value="attendancePercentage"
                                size="60px"
                                :thickness="0.2"
                                color="green"
                                track-color="grey-2"
                                class="text-green text-weight-bold"
                            >
                                <q-icon name="check" size="20px" />
                            </q-circular-progress>
                        </div>
                    </div>
                    <div class="q-mt-md">
                        <q-badge color="green-1" text-color="green-9" label="Good Standing" class="text-weight-bold" />
                        <span class="text-grey-6 q-ml-sm text-caption">Based on last 30 days</span>
                    </div>
                </q-card-section>
            </q-card>
        </div>

        <!-- Last Exam Result -->
        <div class="col-12 col-md-4">
            <q-card class="my-card shadow-1 hover-lift h-100">
                <q-card-section>
                    <div class="row items-center no-wrap">
                        <div class="col">
                            <div class="text-caption text-grey-6 text-weight-bold text-uppercase">Latest Result</div>
                            <div class="text-h4 text-weight-bolder text-dark q-mt-sm font-outfit">
                                {{ latestMark ? latestMark + '/100' : 'N/A' }}
                            </div>
                        </div>
                        <div class="col-auto">
                            <div class="bg-orange-1 padding-md rounded-borders">
                                <q-icon name="emoji_events" color="orange" size="32px" />
                            </div>
                        </div>
                    </div>
                    <div class="q-mt-md">
                        <div class="text-subtitle2 text-dark">{{ latestExamName }}</div>
                        <div class="text-caption text-grey-6">released 2 days ago</div>
                    </div>
                </q-card-section>
            </q-card>
        </div>

        <!-- Upcoming Class -->
        <div class="col-12 col-md-4">
             <q-card class="my-card shadow-1 hover-lift h-100 bg-dark text-white">
                <q-card-section>
                    <div class="row items-center no-wrap">
                        <div class="col">
                            <div class="text-caption text-grey-5 text-weight-bold text-uppercase">Next Class</div>
                            <div class="text-h5 text-weight-bolder q-mt-md font-outfit">Science - Grade 10</div>
                            <div class="text-subtitle2 text-grey-4 q-mt-xs">Tomorrow @ 4:00 PM</div>
                        </div>
                        <div class="col-auto">
                            <q-btn round color="white" text-color="black" icon="arrow_forward" />
                        </div>
                    </div>
                </q-card-section>
            </q-card>
        </div>
    </div>

    <!-- Notices Section -->
    <div class="row q-col-gutter-lg">
        <div class="col-12">
            <div class="text-h5 font-outfit q-mb-md text-weight-bold">Latest Notices</div>
            
            <q-list separator class="bg-white shadow-1 rounded-borders-lg">
                <q-item v-if="notices.length === 0" class="q-pa-lg text-center">
                    <q-item-section class="text-grey">No active notices.</q-item-section>
                </q-item>

                <q-item v-for="notice in notices" :key="notice.id" class="q-py-md hover-bg-grey-1 transition-all">
                    <q-item-section avatar top>
                        <q-avatar icon="campaign" color="blue-1" text-color="primary" />
                    </q-item-section>
                    
                    <q-item-section>
                        <q-item-label class="text-weight-bold text-subtitle1">{{ notice.title }}</q-item-label>
                        <q-item-label caption lines="2" class="text-grey-8">{{ notice.message }}</q-item-label>
                        <q-item-label caption class="q-mt-xs text-primary">{{ formatDate(notice.created_at) }}</q-item-label>
                    </q-item-section>
                    
                     <q-item-section side top>
                        <q-badge v-if="notice.is_pinned" color="orange" label="Important" rounded />
                    </q-item-section>
                </q-item>
            </q-list>
        </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from 'boot/supabase'

const attendancePercentage = ref(85) // Mock
const latestMark = ref(78) // Mock
const latestExamName = ref('Term 1 - Mathematics') // Mock
const notices = ref([])

async function fetchNotices() {
    const { data } = await supabase.from('notices').select('*').order('created_at', { ascending: false }).limit(5)
    notices.value = data || []
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString()
}

onMounted(() => {
    fetchNotices()
})
</script>

<style scoped>
.font-outfit {
  font-family: 'Outfit', sans-serif;
}
.bg-gradient-primary {
    background: linear-gradient(135deg, #1565C0 0%, #0D47A1 100%);
}
.rounded-borders-lg {
    border-radius: 16px;
}
.my-card {
  border-radius: 16px;
  border: 1px solid #f0f0f0;
}
.hover-lift {
    transition: transform 0.2s, box-shadow 0.2s;
}
.hover-lift:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}
.letter-spacing-1 {
    letter-spacing: 1px;
}
.hover-bg-grey-1:hover {
    background-color: #fafafa;
}
.transition-all {
    transition: all 0.2s ease;
}
.padding-md {
    padding: 12px;
}
</style>
