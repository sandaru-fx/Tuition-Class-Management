<template>
  <q-page class="q-pa-md">
    <div v-if="loading" class="flex flex-center window-height">
        <q-spinner color="indigo" size="3em" />
    </div>

    <div v-else class="q-mx-auto" style="max-width: 800px;">
        <!-- Header -->
        <div class="row items-center q-mb-lg">
            <div>
                <div class="text-h5 text-weight-bold font-outfit">My Children</div>
                <div class="text-caption text-grey-7">Viewing progress for: {{ parentName }}</div>
            </div>
        </div>

        <!-- No Children Linked -->
        <div v-if="children.length === 0" class="text-center q-pa-xl bg-white rounded-borders shadow-1">
             <q-icon name="person_off" size="4em" color="grey-4" />
             <div class="text-h6 q-mt-md text-grey-6">No students linked to this number.</div>
             <div class="text-caption text-grey-5">Please contact the institute to update your record.</div>
        </div>

        <!-- Children Tabs/Cards -->
        <div v-else>
            <q-tabs
                v-model="selectedChildId"
                dense
                class="text-grey"
                active-color="indigo"
                indicator-color="indigo"
                align="justify"
                narrow-indicator
            >
                <q-tab 
                    v-for="child in children" 
                    :key="child.id" 
                    :name="child.id" 
                    :label="child.first_name" 
                    icon="face" 
                />
            </q-tabs>

            <q-separator class="q-mb-md" />

            <!-- Selected Child View -->
            <q-tab-panels v-model="selectedChildId" animated class="bg-transparent">
                <q-tab-panel v-for="child in children" :key="child.id" :name="child.id" class="q-px-none">
                    
                    <!-- Child Profile Card -->
                    <q-card class="bg-indigo-1 text-indigo-9 q-mb-md flat-bordered">
                        <q-card-section class="row items-center">
                            <q-avatar size="60px" font-size="30px" color="white" text-color="indigo" class="q-mr-md font-outfit shadow-1">
                                {{ child.first_name.charAt(0) }}
                            </q-avatar>
                            <div>
                                <div class="text-h6 text-weight-bold">{{ child.first_name }} {{ child.last_name }}</div>
                                <div class="text-caption">Grade {{ child.grade }} • {{ child.school }}</div>
                            </div>
                            <q-space />
                            <q-chip :color="child.is_active ? 'green-2' : 'red-2'" :text-color="child.is_active ? 'green-9' : 'red-9'" :label="child.is_active ? 'Active' : 'Inactive'" />
                        </q-card-section>
                    </q-card>

                    <div class="row q-col-gutter-md">
                        <!-- Attendance Stats -->
                        <div class="col-12 col-md-6">
                            <q-card class="shadow-1 rounded-borders h-100">
                                <q-card-section>
                                    <div class="text-subtitle1 text-weight-bold q-mb-sm flex items-center">
                                        <q-icon name="calendar_month" class="q-mr-sm text-indigo" />
                                        Attendance History
                                    </div>
                                    <q-list separator dense>
                                        <q-item v-if="attendanceLogs[child.id]?.length === 0" class="text-grey-5 text-center">
                                            <q-item-section>No attendance records</q-item-section>
                                        </q-item>
                                        <q-item v-for="log in attendanceLogs[child.id]" :key="log.id">
                                            <q-item-section>
                                                <q-item-label>{{ formatDate(log.date) }}</q-item-label>
                                                <q-item-label caption>{{ log.status }}</q-item-label>
                                            </q-item-section>
                                            <q-item-section side>
                                                <q-badge :color="getAttendanceColor(log.status)" rounded />
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </q-card-section>
                            </q-card>
                        </div>

                        <!-- Exam Results -->
                        <div class="col-12 col-md-6">
                            <q-card class="shadow-1 rounded-borders h-100">
                                <q-card-section>
                                    <div class="text-subtitle1 text-weight-bold q-mb-sm flex items-center">
                                        <q-icon name="assignment_turned_in" class="q-mr-sm text-indigo" />
                                        Exam Results
                                    </div>
                                    <q-list separator dense>
                                        <q-item v-if="examResults[child.id]?.length === 0" class="text-grey-5 text-center">
                                            <q-item-section>No exam results found</q-item-section>
                                        </q-item>
                                        <q-item v-for="res in examResults[child.id]" :key="res.id">
                                            <q-item-section>
                                                <q-item-label class="text-weight-medium">{{ res.exam?.name || 'Exam' }}</q-item-label>
                                                <q-item-label caption>{{ formatDate(res.created_at) }}</q-item-label>
                                            </q-item-section>
                                            <q-item-section side>
                                                <div class="text-h6 text-indigo font-outfit">{{ res.marks_obtained }}</div>
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </q-card-section>
                            </q-card>
                        </div>
                    </div>

                </q-tab-panel>
            </q-tab-panels>
        </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { parentService } from 'src/services/parentService'

const router = useRouter()
const $q = useQuasar()
const loading = ref(true)

const parentId = localStorage.getItem('parent_session_id')
const parentName = localStorage.getItem('parent_name')

const children = ref([])
const selectedChildId = ref(null)

// Data keyed by student ID
const attendanceLogs = ref({})
const examResults = ref({})

async function init() {
    if (!parentId) {
        router.push('/parent/login')
        return
    }

    try {
        // 1. Fetch children
        children.value = await parentService.getChildrenDetails(parentId)
        
        if (children.value.length > 0) {
            selectedChildId.value = children.value[0].id
            
            // 2. Fetch Data for ALL children (to avoid re-fetching on tab switch for now)
            // const ids = children.value.map(c => c.id)
            
            // Parallel fetch could be better but let's loop or bulk fetch. 
            // Service supports array, let's update service or just loop here.
            
            // Current service approach needs improvement for "All children" or we call per child.
            // Let's call per child for simplicity in MVP.
            for (const child of children.value) {
                const logs = await parentService.getStudentAttendance([child.id])
                attendanceLogs.value[child.id] = logs || []

                const results = await parentService.getStudentResults([child.id])
                examResults.value[child.id] = results || []
            }
        }
    } catch (e) {
        console.error(e)
        $q.notify({ type: 'negative', message: 'Failed to load data.' })
    } finally {
        loading.value = false
    }
}

onMounted(init)

function formatDate(dateStr) {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-UK', { day: 'numeric', month: 'short' })
}

function getAttendanceColor(status) {
    if (status === 'Present') return 'green'
    if (status === 'Absent') return 'red'
    if (status === 'Late') return 'orange'
    return 'grey'
}

</script>

<style scoped>
.font-outfit {
  font-family: 'Outfit', sans-serif;
}
.flat-bordered {
    border: 1px solid rgba(0,0,0,0.05);
}
.h-100 {
    height: 100%;
}
</style>
