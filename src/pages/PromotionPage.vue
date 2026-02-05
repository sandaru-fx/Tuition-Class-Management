<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold text-dark q-mb-xs font-outfit">Student Promotions</h1>
        <p class="text-grey-7 q-mb-none text-subtitle1">Bulk promote students to the next grade level.</p>
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- Configuration Card -->
      <div class="col-12 col-md-5">
        <q-card class="rounded-borders-lg shadow-1 h-100">
          <q-card-section>
            <div class="text-h6 font-outfit q-mb-md">Promotion Settings</div>
            
            <div class="q-gutter-y-md">
                <q-select 
                    outlined 
                    v-model="sourceGrade" 
                    :options="gradeOptions" 
                    label="Current Grade (Source)" 
                    emit-value
                    map-options
                    @update:model-value="checkEligibleStudents"
                />

                <div class="text-center text-grey-6">
                    <q-icon name="arrow_downward" size="md" />
                </div>

                <q-select 
                    outlined 
                    v-model="targetGrade" 
                    :options="gradeOptions" 
                    label="Target Grade (Destination)" 
                    emit-value
                    map-options
                    readonly
                />

                <q-banner v-if="sourceGrade" class="bg-blue-1 text-blue-9 rounded-borders">
                    <template v-slot:avatar>
                        <q-icon name="info" color="blue" />
                    </template>
                    Promoting <b>Grade {{ sourceGrade }}</b> to <b>Grade {{ targetGrade }}</b>.
                </q-banner>

                <q-separator />
                
                <div class="text-subtitle2 q-mb-sm">Options</div>
                
                <q-checkbox v-model="options.resetSubjects" label="Reset Assigned Subjects (Recommended)" color="primary" disable>
                    <q-tooltip>Not available (Enrollment system not implemented)</q-tooltip>
                </q-checkbox>
                <q-checkbox v-model="options.updateFees" label="Update Fees based on new Grade" color="primary" :disable="true" :model-value="true" />
            </div>
          </q-card-section>

          <q-card-actions class="q-pa-md">
            <q-btn 
                unelevated 
                color="primary" 
                class="full-width q-py-sm" 
                label="Preview Promotion" 
                :disable="!sourceGrade || eligibleCount === 0"
                @click="previewPromotion"
            />
          </q-card-actions>
        </q-card>
      </div>

      <!-- Preview / Results Card -->
      <div class="col-12 col-md-7">
         <q-card class="rounded-borders-lg shadow-1 h-100 bg-grey-1" v-if="!summary">
             <div class="absolute-center text-center text-grey-5">
                 <q-icon name="school" size="4rem" />
                 <div class="text-subtitle1 q-mt-md">Select a grade to start</div>
             </div>
         </q-card>

         <q-card v-else class="rounded-borders-lg shadow-1 h-100">
            <q-card-section class="bg-primary text-white">
                <div class="text-h6">Promotion Summary</div>
                <div class="text-subtitle2">Grade {{ sourceGrade }} <q-icon name="arrow_forward" /> Grade {{ targetGrade }}</div>
            </q-card-section>

            <q-card-section class="q-pa-lg">
                <div class="row q-col-gutter-md text-center">
                    <div class="col-6">
                        <div class="text-h3 text-weight-bold text-primary">{{ eligibleCount }}</div>
                        <div class="text-caption text-grey-7 uppercase">Eligible Students</div>
                    </div>
                </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
                <div class="text-subtitle2 q-mb-sm text-grey-8">Changes to be applied:</div>
                <ul class="text-grey-7 q-pl-md">
                    <li>Update <b>{{ eligibleCount }} students</b> grade from {{ sourceGrade }} to {{ targetGrade }}.</li>
                    <li>Verify monthly fee structure for Grade {{ targetGrade }}.</li>
                </ul>
                <q-banner v-if="eligibleCount === 0" class="bg-warning text-white rounded-borders q-mt-md">
                    No students found in Grade {{ sourceGrade }}.
                </q-banner>
            </q-card-section>

            <q-card-actions align="right" class="q-pa-md">
                <q-btn flat label="Cancel" color="grey" @click="summary = null" />
                <q-btn 
                    unelevated 
                    color="positive" 
                    label="Confirm & Promote" 
                    icon="check_circle"
                    :loading="promoting"
                    :disable="eligibleCount === 0"
                    @click="executePromotion" 
                />
            </q-card-actions>
         </q-card>
      </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { studentService } from 'src/services/studentService'

const $q = useQuasar()
const sourceGrade = ref(null)
const targetGrade = ref(null)

const summary = ref(null)
const promoting = ref(false)
const eligibleCount = ref(0)
const eligibleStudents = ref([])

const options = ref({
    resetSubjects: true,
    updateFees: true
})

const gradeOptions = [
    { label: 'Grade 1', value: '1' },
    { label: 'Grade 2', value: '2' },
    { label: 'Grade 3', value: '3' },
    { label: 'Grade 4', value: '4' },
    { label: 'Grade 5', value: '5' },
    { label: 'Grade 6', value: '6' },
    { label: 'Grade 7', value: '7' },
    { label: 'Grade 8', value: '8' },
    { label: 'Grade 9', value: '9' },
    { label: 'Grade 10', value: '10' },
    { label: 'Grade 11', value: '11' },
    { label: 'Grade 12', value: '12' },
    { label: 'Grade 13', value: '13' }, // Final
    { label: 'Completed', value: 'completed' }
]

watch(sourceGrade, (val) => {
    if (!val) {
        targetGrade.value = null
        return
    }
    const num = parseInt(val)
    if (num >= 13) targetGrade.value = 'completed'
    else targetGrade.value = (num + 1).toString()
    
    summary.value = null // Reset preview
})

async function checkEligibleStudents() {
    if (!sourceGrade.value) return
    try {
        const students = await studentService.getAll() // Ideally filter by grade in query
        eligibleStudents.value = students.filter(s => s.grade === sourceGrade.value)
        eligibleCount.value = eligibleStudents.value.length
    } catch (error) {
        console.error(error)
        $q.notify({ type: 'negative', message: 'Error checking students' })
    }
}

function previewPromotion() {
    summary.value = true
}

async function executePromotion() {
    if(!confirm(`Are you sure you want to promote ${eligibleCount.value} students? This action cannot be easily undone.`)) return

    promoting.value = true
    try {
        await studentService.promoteStudents(sourceGrade.value, targetGrade.value)
        
        $q.notify({
            type: 'positive',
            message: `Successfully promoted ${eligibleCount.value} students!`,
            icon: 'celebration'
        })
        
        // Reset
        summary.value = null
        sourceGrade.value = null
        eligibleCount.value = 0
    } catch (error) {
        console.error(error)
        $q.notify({ type: 'negative', message: 'Promotion failed: ' + error.message })
    } finally {
        promoting.value = false
    }
}
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.rounded-borders-lg { border-radius: 12px; }
.h-100 { height: 100%; }
</style>
