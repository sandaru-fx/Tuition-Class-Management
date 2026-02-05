<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold text-dark q-mb-xs font-outfit">Fee Structures</h1>
        <p class="text-grey-7 q-mb-none text-subtitle1">Manage default tuition fees for each grade category.</p>
      </div>
      <q-space />
      <q-btn 
        unelevated 
        color="primary" 
        icon="add" 
        label="Add Template" 
        class="rounded-borders-lg" 
        no-caps
        @click="openDialog()" 
      />
    </div>

    <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6 col-lg-3" v-for="template in templates" :key="template.id">
            <q-card class="shadow-1 rounded-borders-lg hover-lift h-100">
                <q-card-section class="bg-grey-1 row items-center justify-between">
                    <div class="text-subtitle1 text-weight-bold uppercase">{{ getCategoryLabel(template.grade_category) }}</div>
                    <q-chip dense color="blue-1" text-color="blue-9" size="sm" class="text-weight-bold">
                        Default
                    </q-chip>
                </q-card-section>
                
                <q-card-section class="text-center q-py-lg">
                    <div class="text-h3 text-weight-bolder text-primary font-outfit">
                        <span class="text-h6 text-grey-6 text-weight-regular align-top">Rs.</span>
                        {{ template.amount }}
                    </div>
                </q-card-section>

                <q-card-section>
                    <p class="text-grey-7 text-center q-mb-none text-caption">
                        {{ template.description || 'No description' }}
                    </p>
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                    <q-btn flat round color="grey-7" icon="edit" @click="openDialog(template)" />
                    <q-btn flat round color="red-4" icon="delete" @click="confirmDelete(template)" />
                </q-card-actions>
            </q-card>
        </div>
    </div>

    <!-- Dialog -->
    <q-dialog v-model="showDialog" persistent>
        <q-card style="min-width: 400px" class="rounded-borders-lg">
            <q-card-section class="row items-center">
                <div class="text-h6 font-outfit">Fee Template</div>
                <q-space />
                <q-btn flat round icon="close" v-close-popup />
            </q-card-section>

            <q-card-section class="q-pt-none q-gutter-y-md">
                <q-select 
                    outlined 
                    v-model="form.grade_category" 
                    :options="categoryOptions" 
                    label="Grade Category" 
                    emit-value
                    map-options
                    :readonly="isEdit"
                />
                
                <q-input 
                    outlined 
                    v-model.number="form.amount" 
                    label="Monthly Fee (LKR)" 
                    type="number" 
                    prefix="Rs." 
                    :rules="[val => val > 0 || 'Invalid amount']"
                />

                <q-input 
                    outlined 
                    v-model="form.description" 
                    label="Description details" 
                    type="textarea"
                    rows="2"
                />
            </q-card-section>

            <q-card-actions align="right" class="q-pa-md">
                <q-btn flat label="Cancel" color="grey" v-close-popup no-caps />
                <q-btn unelevated label="Save Template" color="primary" @click="saveTemplate" :loading="submitting" no-caps />
            </q-card-actions>
        </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { feeService } from 'src/services/feeService'

const $q = useQuasar()
const templates = ref([])
const showDialog = ref(false)
const submitting = ref(false)
const isEdit = ref(false)

const form = ref({
    id: null,
    grade_category: 'primary',
    amount: 1500,
    description: ''
})

const categoryOptions = [
    { label: 'Primary (1-5)', value: 'primary' },
    { label: 'Junior (6-9)', value: 'junior' },
    { label: 'O/L (10-11)', value: 'ol' },
    { label: 'A/L (12-13)', value: 'al' }
]

function getCategoryLabel(val) {
    return categoryOptions.find(o => o.value === val)?.label || val
}

async function fetchTemplates() {
    try {
        templates.value = await feeService.getAll()
    } catch (e) {
        console.error(e)
    }
}

function openDialog(item = null) {
    if (item) {
        isEdit.value = true
        form.value = { ...item }
    } else {
        isEdit.value = false
        form.value = { id: null, grade_category: 'primary', amount: 0, description: '' }
    }
    showDialog.value = true
}

async function saveTemplate() {
    submitting.value = true
    try {
        if (isEdit.value) {
            await feeService.update(form.value.id, {
                amount: form.value.amount,
                description: form.value.description
            })
        } else {
            await feeService.create({
                grade_category: form.value.grade_category,
                amount: form.value.amount,
                description: form.value.description
            })
        }
        $q.notify({ type: 'positive', message: 'Saved successfully' })
        showDialog.value = false
        fetchTemplates()
    } catch {
        $q.notify({ type: 'negative', message: 'Error saving template' })
    } finally {
        submitting.value = false
    }
}

async function confirmDelete(item) {
    if(!confirm('Delete this template?')) return
    try {
        await feeService.delete(item.id)
        fetchTemplates()
    } catch(e) { console.error(e) }
}

onMounted(() => {
    fetchTemplates()
})
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.rounded-borders-lg { border-radius: 12px; }
.hover-lift { transition: transform 0.2s; }
.hover-lift:hover { transform: translateY(-4px); box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
.uppercase { text-transform: uppercase; }
.align-top { vertical-align: top; }
</style>
