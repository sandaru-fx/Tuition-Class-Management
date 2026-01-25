<template>
  <q-page class="q-pa-lg bg-slate-50">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold text-slate-800 font-outfit">Assignments</div>
        <div class="text-subtitle1 text-slate-500">Track and grade student submissions</div>
      </div>
      <q-btn unelevated color="blue-600" icon="add" label="Create Assignment" no-caps class="rounded-borders" />
    </div>

    <q-card class="bg-white shadow-sm rounded-xl">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="blue-600"
        indicator-color="blue-600"
        align="left"
        narrow-indicator
      >
        <q-tab name="active" label="Active Assignments" />
        <q-tab name="completed" label="Completed & Graded" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="active" class="q-pa-none">
           <q-list separator>
             <q-item v-for="assign in activeAssignments" :key="assign.id" class="q-py-md q-px-lg hover-bg-slate-50">
               <q-item-section>
                 <q-item-label class="text-h6 text-weight-bold text-slate-800">{{ assign.title }}</q-item-label>
                 <q-item-label caption class="text-slate-500 q-mt-xs">
                   {{ assign.class }} • Due: <span class="text-red-5">{{ assign.dueDate }}</span>
                 </q-item-label>
               </q-item-section>
               
               <q-item-section side top>
                 <div class="column items-end">
                    <q-chip size="sm" color="amber-100" text-color="amber-9" icon="pending">
                       {{ assign.submitted }} / {{ assign.totalStudents }} Submitted
                    </q-chip>
                    <q-btn flat dense color="blue-600" label="Grade Now" no-caps size="sm" class="q-mt-sm" />
                 </div>
               </q-item-section>
             </q-item>
           </q-list>
        </q-tab-panel>

        <q-tab-panel name="completed" class="q-pa-none">
           <q-list separator>
             <q-item v-for="assign in completedAssignments" :key="assign.id" class="q-py-md q-px-lg">
               <q-item-section>
                 <q-item-label class="text-body1 text-weight-bold text-slate-700">{{ assign.title }}</q-item-label>
                 <q-item-label caption class="text-slate-500">
                   {{ assign.class }} • Graded on {{ assign.gradedDate }}
                 </q-item-label>
               </q-item-section>
               
               <q-item-section side>
                  <q-chip size="sm" color="green-100" text-color="green-8" icon="check_circle">
                       All Graded
                  </q-chip>
               </q-item-section>
             </q-item>
           </q-list>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const tab = ref('active')

const activeAssignments = ref([
    { id: 1, title: 'Thermodynamics Quiz 1', class: 'AL Physics', dueDate: 'Tomorrow, 11:59 PM', submitted: 12, totalStudents: 45 },
    { id: 2, title: 'Organic Chemistry Structure', class: 'General Chemistry', dueDate: 'Jan 28, 2026', submitted: 5, totalStudents: 32 },
    { id: 3, title: 'Essay: Biological Systems', class: 'Biology', dueDate: 'Feb 01, 2026', submitted: 0, totalStudents: 35 }
])

const completedAssignments = ref([
    { id: 4, title: 'Mechanics Mid-Term', class: 'AL Physics', gradedDate: 'Jan 15, 2026' },
    { id: 5, title: 'Algebra Foundation', class: 'Pure Mathematics', gradedDate: 'Jan 10, 2026' }
])
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.rounded-xl { border-radius: 16px; }
.rounded-borders { border-radius: 8px; }
.hover-bg-slate-50:hover { background-color: #F8FAFC; }
</style>
