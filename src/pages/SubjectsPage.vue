<template>
  <q-page class="q-pa-lg">
    <!-- Header -->
    <div class="row items-center q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold text-dark q-mb-xs font-outfit">Subject Library</h1>
        <p class="text-grey-7 q-mb-none text-subtitle1">Manage subjects across all grades (1-13).</p>
      </div>
      <q-space />
      <q-btn 
        unelevated 
        color="primary" 
        icon="add" 
        label="Add New Subject" 
        class="border-radius-lg q-px-md" 
        no-caps
        @click="openDialog()" 
      />
    </div>

    <!-- Category Tabs -->
    <q-tabs
      v-model="activeTab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="left"
      narrow-indicator
    >
      <q-tab name="all" label="All Subjects" no-caps />
      <q-tab name="primary" label="Primary (1-5)" no-caps />
      <q-tab name="junior" label="Junior (6-9)" no-caps />
      <q-tab name="ol" label="O/L (10-11)" no-caps />
      <q-tab name="al" label="A/L (12-13)" no-caps />
    </q-tabs>
    <q-separator class="q-mb-md" />

    <!-- Subject Table -->
    <q-card class="shadow-1 rounded-borders-lg bg-white">
      <q-table
        :rows="filteredSubjects"
        :columns="columns"
        row-key="id"
        flat
        :loading="loading"
        :pagination="{ rowsPerPage: 10 }"
      >
        <!-- Stream Column Customization -->
        <template v-slot:body-cell-stream="props">
          <q-td :props="props">
            <q-chip v-if="props.value" dense color="purple-1" text-color="purple-8" class="text-weight-bold text-uppercase">
              {{ props.value }}
            </q-chip>
            <span v-else class="text-grey-4">-</span>
          </q-td>
        </template>

        <!-- Actions Column -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" align="right">
            <q-btn flat dense size="sm" icon="edit" color="grey-7" @click="openDialog(props.row)" />
            <q-btn flat dense size="sm" icon="delete" color="red-5" @click="confirmDelete(props.row)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Add/Edit Subject Dialog -->
    <q-dialog v-model="showDialog" persistent>
        <q-card style="min-width: 400px" class="rounded-borders-lg">
            <q-card-section class="row items-center q-pb-none">
                <div class="text-h6 font-outfit text-weight-bold">{{ isEdit ? 'Edit Subject' : 'Add New Subject' }}</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section class="q-pt-md q-gutter-y-md">
                <q-input 
                    outlined 
                    v-model="form.name" 
                    label="Subject Name" 
                    placeholder="e.g. Combined Mathematics" 
                    dense 
                    autofocus
                    :rules="[val => !!val || 'Name is required']"
                />

                <q-select
                    outlined
                    v-model="form.grade_category"
                    :options="gradeCategories"
                    label="Grade Category"
                    dense
                    emit-value
                    map-options
                    option-label="label"
                />

                <!-- Conditional Stream Selection for A/L -->
                <div v-if="form.grade_category === 'al'" class="bg-purple-50 q-pa-sm rounded-borders animate-fade">
                    <div class="text-caption text-purple-8 text-weight-bold q-mb-xs">A/L Stream (Optional)</div>
                    <q-select
                        outlined
                        v-model="form.stream"
                        :options="streamOptions"
                        label="Select Stream"
                        dense
                        bg-color="white"
                        clearable
                        hint="Leave empty for common subjects (e.g. General English)"
                    />
                </div>
            </q-card-section>

            <q-card-actions align="right" class="q-pa-md">
                <q-btn flat label="Cancel" color="grey" v-close-popup no-caps />
                <q-btn unelevated label="Save Subject" color="primary" @click="saveSubject" :loading="submitting" no-caps class="border-radius-md" />
            </q-card-actions>
        </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { subjectService } from 'src/services/subjectService'

const $q = useQuasar()
const loading = ref(false)
const submitting = ref(false)
const subjects = ref([])
const activeTab = ref('all')
const showDialog = ref(false)
const isEdit = ref(false)

const form = ref({
    id: null,
    name: '',
    grade_category: 'primary',
    stream: null
})

const gradeCategories = [
    { label: 'Primary (Grade 1-5)', value: 'primary' },
    { label: 'Junior (Grade 6-9)', value: 'junior' },
    { label: 'O/L (Grade 10-11)', value: 'ol' },
    { label: 'A/L (Grade 12-13)', value: 'al' }
]

const streamOptions = ['Science', 'Arts', 'Commerce', 'Technology']

const columns = [
    { name: 'name', label: 'Subject Name', field: 'name', align: 'left', sortable: true },
    { name: 'grade_category', label: 'Category', field: 'grade_category', align: 'left', format: val => val.toUpperCase() },
    { name: 'stream', label: 'Stream (A/L)', field: 'stream', align: 'left' },
    { name: 'actions', label: '', field: 'actions', align: 'right' }
]

// Filter Logic
const filteredSubjects = computed(() => {
    if (activeTab.value === 'all') return subjects.value
    return subjects.value.filter(s => s.grade_category === activeTab.value)
})

async function fetchSubjects() {
    loading.value = true
    try {
        subjects.value = await subjectService.getAll()
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

function openDialog(subject = null) {
    if (subject) {
        isEdit.value = true
        form.value = { ...subject }
    } else {
        isEdit.value = false
        form.value = { id: null, name: '', grade_category: activeTab.value === 'all' ? 'primary' : activeTab.value, stream: null }
    }
    showDialog.value = true
}

async function saveSubject() {
    if (!form.value.name) return
    submitting.value = true
    try {
        if (isEdit.value) {
            await subjectService.update(form.value.id, {
                name: form.value.name,
                grade_category: form.value.grade_category,
                stream: form.value.grade_category === 'al' ? form.value.stream : null
            })
            $q.notify({ type: 'positive', message: 'Subject updated' })
        } else {
            await subjectService.create({
                name: form.value.name,
                grade_category: form.value.grade_category,
                stream: form.value.grade_category === 'al' ? form.value.stream : null
            })
            $q.notify({ type: 'positive', message: 'Subject created' })
        }
        showDialog.value = false
        fetchSubjects()
    } catch (e) {
        console.error(e)
        $q.notify({ type: 'negative', message: 'Failed to save subject' })
    } finally {
        submitting.value = false
    }
}

function confirmDelete(subject) {
    $q.dialog({
        title: 'Confirm',
        message: `Delete subject "${subject.name}"? This might affect existing classes.`,
        cancel: true,
        persistent: true
    }).onOk(async () => {
        try {
            await subjectService.delete(subject.id)
            $q.notify({ type: 'positive', message: 'Subject deleted' })
            fetchSubjects()
        } catch {
             $q.notify({ type: 'negative', message: 'Failed to delete' })
        }
    })
}

onMounted(() => {
    fetchSubjects()
})
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.rounded-borders-lg { border-radius: 12px; }
.border-radius-md { border-radius: 8px; }
.animate-fade { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
