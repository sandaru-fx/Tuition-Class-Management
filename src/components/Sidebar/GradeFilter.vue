<template>
  <div class="grade-filter q-pa-md q-pb-lg">
    <q-select
      v-model="selectedGrade"
      :options="gradeOptions"
      outlined
      dense
      class="grade-select"
      @update:model-value="handleGradeChange"
    >
      <template v-slot:prepend>
        <q-icon name="school" color="primary" />
      </template>
      <template v-slot:selected>
        <div class="text-weight-medium text-body2">
          {{ selectedGrade?.label || 'All Grades' }}
        </div>
      </template>
    </q-select>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from 'src/stores/app'

const appStore = useAppStore()

const selectedGrade = ref(null)

const gradeOptions = computed(() => [
  { label: 'All Grades', value: 'all', icon: 'apps' },
  { label: '── Primary Level ──', disable: true },
  { label: 'Grade 1-5 (Primary)', value: 'primary', icon: 'child_care' },
  { label: 'Grade 1', value: '1', icon: 'looks_one' },
  { label: 'Grade 2', value: '2', icon: 'looks_two' },
  { label: 'Grade 3', value: '3', icon: 'looks_3' },
  { label: 'Grade 4', value: '4', icon: 'looks_4' },
  { label: 'Grade 5', value: '5', icon: 'looks_5' },
  { label: '── Secondary Level ──', disable: true },
  { label: 'Grade 6-9 (Junior)', value: 'junior', icon: 'groups' },
  { label: 'Grade 6', value: '6', icon: 'filter_6' },
  { label: 'Grade 7', value: '7', icon: 'filter_7' },
  { label: 'Grade 8', value: '8', icon: 'filter_8' },
  { label: 'Grade 9', value: '9', icon: 'filter_9' },
  { label: '── O/L Level ──', disable: true },
  { label: 'Grade 10-11 (O/L)', value: 'ol', icon: 'military_tech' },
  { label: 'Grade 10', value: '10', icon: 'star' },
  { label: 'Grade 11', value: '11', icon: 'star' },
  { label: '── A/L Level ──', disable: true },
  { label: 'Grade 12-13 (A/L)', value: 'al', icon: 'school' },
  { label: 'Grade 12', value: '12', icon: 'workspace_premium' },
  { label: 'Grade 13', value: '13', icon: 'workspace_premium' },
  { label: '── By Stream ──', disable: true },
  { label: 'A/L Science', value: 'al_science', icon: 'science' },
  { label: 'A/L Commerce', value: 'al_commerce', icon: 'business_center' },
  { label: 'A/L Arts', value: 'al_arts', icon: 'palette' },
])

function handleGradeChange(newGrade) {
  appStore.setSelectedGrade(newGrade?.value || 'all')
}

onMounted(() => {
  // Initialize with "All Grades"
  selectedGrade.value = gradeOptions.value[0]
  appStore.setSelectedGrade('all')
})
</script>

<style lang="scss" scoped>
.grade-filter {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.grade-select {
  background: white;
  border-radius: 8px;
  
  :deep(.q-field__control) {
    border-radius: 8px;
  }
  
  :deep(.q-field__native) {
    font-weight: 500;
  }
}
</style>
