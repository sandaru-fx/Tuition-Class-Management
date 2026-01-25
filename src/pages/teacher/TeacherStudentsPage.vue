<template>
  <q-page class="q-pa-lg bg-slate-50">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold text-slate-800 font-outfit">My Students</div>
        <div class="text-subtitle1 text-slate-500">View student performance and attendance</div>
      </div>
      <div class="row q-gutter-sm">
         <q-input dense outlined v-model="search" placeholder="Search students..." bg-color="white" class="rounded-borders">
            <template v-slot:prepend><q-icon name="search" /></template>
         </q-input>
         <q-btn outline color="blue-600" label="Filter" no-caps class="rounded-borders" icon="filter_list" />
      </div>
    </div>

    <q-card class="bg-white shadow-sm rounded-xl overflow-hidden">
       <q-table
          :rows="students"
          :columns="columns"
          row-key="id"
          flat
          :filter="search"
          :pagination="{ rowsPerPage: 10 }"
       >
          <template v-slot:header="props">
            <q-tr :props="props" class="bg-blue-50 text-blue-9">
              <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-weight-bold">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <div class="row items-center">
                 <q-avatar size="32px" color="grey-3" text-color="blue-9" class="q-mr-sm">
                    {{ props.row.name.charAt(0) }}
                 </q-avatar>
                 <div class="text-weight-medium">{{ props.row.name }}</div>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-attendance="props">
            <q-td :props="props">
               <q-badge :color="getAttendanceColor(props.row.attendance)" class="q-pa-xs">
                 {{ props.row.attendance }}%
               </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
             <q-td :props="props">
                <q-btn flat round dense color="grey-6" icon="more_vert" />
             </q-td>
          </template>

       </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const search = ref('')

const columns = [
  { name: 'id', label: 'ID', field: 'studentId', align: 'left', sortable: true },
  { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
  { name: 'class', label: 'Class', field: 'class', align: 'left', sortable: true },
  { name: 'attendance', label: 'Attendance', field: 'attendance', align: 'center', sortable: true },
  { name: 'grade', label: 'Avg. Grade', field: 'grade', align: 'center', sortable: true },
  { name: 'actions', label: '', field: 'actions', align: 'right' }
]

const students = ref([
    { id: 1, studentId: 'STUC-2025-001', name: 'Nimal Perera', class: 'AL Physics', attendance: 95, grade: 'A' },
    { id: 2, studentId: 'STUC-2025-002', name: 'Kasun Silva', class: 'AL Physics', attendance: 82, grade: 'B' },
    { id: 3, studentId: 'STUC-2025-005', name: 'Amaya Fernando', class: 'AL Physics', attendance: 98, grade: 'A+' },
    { id: 4, studentId: 'STUC-2025-012', name: 'Ruwan Dissanayake', class: 'General Chemistry', attendance: 75, grade: 'C' },
    { id: 5, studentId: 'STUC-2025-015', name: 'Dilshan Bandara', class: 'General Chemistry', attendance: 88, grade: 'B+' },
    { id: 6, studentId: 'STUC-2025-022', name: 'Sajith De Silva', class: 'Biology', attendance: 60, grade: 'S' },
    { id: 7, studentId: 'STUC-2025-030', name: 'Tharindu Jayasuriya', class: 'Pure Mathematics', attendance: 92, grade: 'A' }
])

function getAttendanceColor(val) {
    if (val >= 90) return 'green'
    if (val >= 75) return 'orange'
    return 'red'
}
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.rounded-xl { border-radius: 16px; }
.rounded-borders { border-radius: 8px; }
</style>
