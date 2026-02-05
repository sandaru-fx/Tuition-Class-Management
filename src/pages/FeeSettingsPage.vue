<template>
  <q-page class="q-pa-lg">
    <!-- Header -->
    <div class="row items-center q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold text-dark q-mb-xs font-outfit">Fee Settings</h1>
        <p class="text-grey-7 q-mb-none text-subtitle1">Manage tuition fees and bulk pricing templates.</p>
      </div>
    </div>

    <!-- Bulk Update Card -->
    <div class="row items-start justify-center">
        <div class="col-12 col-md-8">
            <q-card class="shadow-1 rounded-borders-lg">
                <q-card-section class="q-pa-lg">
                     <div class="row items-center q-mb-md">
                        <q-avatar icon="payments" color="green-1" text-color="green" size="md" />
                        <span class="text-h6 font-outfit q-ml-md">Bulk Fee Update</span>
                    </div>
                    <p class="text-grey-7">Update the monthly fee for ALL classes in a specific grade. This will overwrite existing class fees.</p>
                    
                    <q-form @submit="applyFeeUpdate" class="q-gutter-md q-mt-lg">
                        <div class="row q-col-gutter-md">
                            <div class="col-12 col-md-6">
                                <q-select 
                                    outlined 
                                    v-model="targetGrade" 
                                    :options="gradeOptions" 
                                    label="Select Grade" 
                                    :rules="[val => !!val || 'Required']"
                                />
                            </div>
                            <div class="col-12 col-md-6">
                                <q-input 
                                    outlined 
                                    v-model="newAmount" 
                                    label="New Monthly Fee (Rs.)" 
                                    type="number" 
                                    :rules="[val => !!val || 'Required']"
                                    prefix="Rs."
                                />
                            </div>
                        </div>

                        <div class="bg-yellow-1 text-orange-9 q-pa-sm rounded-borders text-caption q-mt-sm">
                            <q-icon name="warning" /> Warning: This will update {{ affectedCount }} classes immediately.
                        </div>

                        <div class="row justify-end q-mt-lg">
                            <q-btn unelevated label="Apply Bulk Update" color="black" type="submit" :loading="updating" />
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { supabase } from 'boot/supabase'

const $q = useQuasar()
const targetGrade = ref(null)
const newAmount = ref('')
const updating = ref(false)
const affectedCount = ref(0) // Mock count for now, real implementation would query count

const gradeOptions = ['1','2','3','4','5','6','7','8','9','10','11','12','13']

// Determine affected count (Mock/Est)
watch(targetGrade, async (grade) => {
    if (!grade) {
        affectedCount.value = 0
        return
    }
    // Fetch real count
    const { count } = await supabase.from('classes').select('*', { count: 'exact' }).eq('grade', grade)
    affectedCount.value = count || 0
})

async function applyFeeUpdate() {
    if(!targetGrade.value || !newAmount.value) return
    
    updating.value = true
    try {
        const { error } = await supabase
            .from('classes')
            .update({ monthly_fee: newAmount.value })
            .eq('grade', targetGrade.value)
        
        if (error) throw error
        
        $q.notify({ type: 'positive', message: `Fees updated for Grade ${targetGrade.value}!` })
        targetGrade.value = null
        newAmount.value = ''
    } catch (e) {
        console.error(e)
        $q.notify({ type: 'negative', message: 'Update failed' })
    } finally {
        updating.value = false
    }
}
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.rounded-borders-lg { border-radius: 12px; }
</style>
