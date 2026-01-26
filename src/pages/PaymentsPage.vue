<template>
  <q-page class="q-pa-lg">
    <div class="row items-center q-mb-xl no-print">
      <div>
        <h1 class="text-h4 text-weight-bold text-dark q-mb-xs font-outfit">Fees & Payments</h1>
        <p class="text-grey-7 q-mb-none text-subtitle1">Collect fees, print receipts, and track revenue.</p>
      </div>
    </div>

    <q-tabs
      v-model="tab"
      dense
      class="text-grey no-print"
      active-color="primary"
      indicator-color="primary"
      align="left"
      narrow-indicator
    >
      <q-tab name="collect" label="Collect Fees" icon="payments" no-caps />
      <q-tab name="history" label="Payment History" icon="history" no-caps />
      <q-tab name="due" label="Due Reports" icon="assignment_late" no-caps />
    </q-tabs>

    <q-separator class="q-mb-md no-print" />

    <q-tab-panels v-model="tab" animated class="bg-transparent no-print">
      
      <!-- Collect Fees -->
      <q-tab-panel name="collect" class="q-pa-none">
          <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-5">
                  <q-card class="my-card shadow-1">
                      <q-card-section>
                          <div class="text-h6 font-outfit q-mb-md">New Transaction</div>
                          <q-form @submit="processPayment" class="q-gutter-md">
                              
                               <!-- Search Student -->
                               <q-select
                                    outlined
                                    v-model="selectedStudent"
                                    use-input
                                    input-debounce="300"
                                    label="Search Student"
                                    :options="studentOptions"
                                    @filter="filterStudents"
                                    dense
                                    option-label="label"
                                    option-value="id"
                                    hint="Type name or phone number"
                                    :rules="[val => !!val || 'Required']"
                              >
                                <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">No results</q-item-section>
                                    </q-item>
                                </template>
                              </q-select>
                              
                              <q-select 
                                outlined 
                                v-model="form.payment_type" 
                                :options="['Monthly Fee', 'Admission Fee', 'Paper Fee']" 
                                label="Payment Type" 
                                dense 
                                :rules="[val => !!val || 'Required']"
                              />
                              
                              <div v-if="form.payment_type === 'Monthly Fee'">
                                  <q-select 
                                    outlined 
                                    v-model="form.class_id" 
                                    :options="classOptions" 
                                    label="Select Class" 
                                    dense 
                                    emit-value
                                    map-options
                                    :rules="[val => !!val || 'Required']"
                                  />
                                   <q-input outlined v-model="form.month" label="Month (e.g. Jan 2026)" dense :rules="[val => !!val || 'Required']" />
                              </div>

                              <q-input 
                                outlined 
                                v-model="form.amount" 
                                label="Amount (LKR)" 
                                type="number" 
                                dense 
                                class="text-weight-bold"
                                prefix="Rs."
                                :rules="[val => !!val || 'Required']"
                              />

                              <q-btn unelevated color="green-7" size="lg" class="full-width q-mt-md" type="submit" :loading="submitting" no-caps>
                                  <div class="row items-center no-wrap">
                                      <q-icon left name="print" />
                                      <div>Pay & Print Receipt</div>
                                  </div>
                              </q-btn>
                          </q-form>
                      </q-card-section>
                  </q-card>
              </div>
          </div>
      </q-tab-panel>

      <!-- History -->
      <q-tab-panel name="history" class="q-pa-none">
          <q-card class="my-card shadow-1">
               <q-markup-table flat>
                  <thead>
                    <tr class="bg-grey-1">
                      <th class="text-left">Date</th>
                      <th class="text-left">Student</th>
                      <th class="text-left">Type</th>
                      <th class="text-right">Amount</th>
                      <th class="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="pay in payments" :key="pay.id">
                        <td>{{ formatDate(pay.created_at) }}</td>
                        <td>{{ pay.students?.first_name }} {{ pay.students?.last_name }}</td>
                        <td>
                            <div>{{ pay.payment_type }}</div>
                            <div class="text-caption text-grey" v-if="pay.month">{{ pay.month }}</div>
                        </td>
                        <td class="text-right text-weight-bold">Rs. {{ pay.amount }}</td>
                        <td class="text-right">
                            <q-btn flat round dense icon="print" size="sm" color="grey-7" @click="reprint(pay)" />
                        </td>
                    </tr>
                  </tbody>
               </q-markup-table>
          </q-card>
      </q-tab-panel>

      <!-- Due Reports -->
      <q-tab-panel name="due" class="q-pa-none">
           <q-card class="my-card q-pa-lg text-center text-grey-6">
               <q-icon name="build" size="48px" class="q-mb-md" />
               <div class="text-h6">Due Report Generator</div>
               <p>Select a class and month to generate a list of students who haven't paid yet.</p>
               <q-btn outline color="primary" label="Coming Soon in Phase 2" no-caps />
           </q-card>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Hidden Receipt for Printing -->
    <div id="receipt-print" class="print-only">
        <div class="receipt-container" v-if="lastPayment">
            <div class="header">
                <h2>CLASS MASTER</h2>
                <p>No. 123, Main Street, Colombo</p>
                <p>Tel: 077-1234567</p>
            </div>
            <hr class="dashed">
            <div class="details">
                <div class="row"><span>Date:</span> <span>{{ formatDate(lastPayment.created_at) }}</span></div>
                <div class="row"><span>Rcpt No:</span> <span>#{{ lastPayment.id.slice(0, 8) }}</span></div>
                <div class="row"><span>Student:</span> <span>{{ lastPayment.studentName }}</span></div>
            </div>
            <hr class="dashed">
            <div class="item-list">
                <div class="item">
                    <span>{{ lastPayment.payment_type }}</span>
                </div>
                <div class="item-sub" v-if="lastPayment.class_name">
                   {{ lastPayment.class_name }} - {{ lastPayment.month }}
                </div>
                <div class="total">
                    <span>TOTAL</span>
                    <span>Rs. {{ lastPayment.amount }}/=</span>
                </div>
            </div>
            <hr class="solid">
            <div class="footer">
                <p>Thank you!</p>
                <p>System by ClassMaster</p>
            </div>
        </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { paymentService } from 'src/services/paymentService'
import { classService } from 'src/services/classService'
import { studentService } from 'src/services/studentService'

import { useAppStore } from 'src/stores/app'

const $q = useQuasar()
const appStore = useAppStore()
const tab = ref('collect')
const submitting = ref(false)
const payments = ref([])

// Computed Options from Store
const classOptions = computed(() => appStore.classes)

// Search state
const selectedStudent = ref(null)
const studentOptions = ref([])
const allStudents = ref([]) // Cache for filtering

const form = ref({
    payment_type: 'Monthly Fee',
    class_id: null,
    amount: '',
    month: 'Jan 2026'
})

const lastPayment = ref(null)

async function fetchInitialData() {
    try {
        // Fetch Payments
        await fetchPayments()

        // Fetch Students Cache
        const students = await studentService.getAll()
        allStudents.value = students.map(s => ({
            label: `${s.first_name} ${s.last_name} (${s.whatsapp_number})`,
            value: s.id,
            ...s
        }))
    } catch (error) {
        console.error(error)
    }
}

async function fetchPayments() {
    try {
        payments.value = await paymentService.getRecentPayments()
    } catch (error) {
        console.error(error)
    }
}

function filterStudents (val, update) {
  if (val === '') {
    update(() => {
      studentOptions.value = allStudents.value
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    studentOptions.value = allStudents.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
}

async function processPayment() {
    submitting.value = true
    try {
        const payload = {
            student_id: selectedStudent.value.value,
            payment_type: form.value.payment_type,
            amount: form.value.amount,
            class_id: form.value.class_id,
            month: form.value.month,
            is_printed: true
        }

        const data = await paymentService.processPayment(payload)
        $q.notify({ type: 'positive', message: 'Payment recorded!' })
        
        // Prepare Receipt Data
        const cls = classOptions.value.find(c => c.value === payload.class_id)
        lastPayment.value = {
            ...data,
            studentName: selectedStudent.value.label.split('(')[0].trim(),
            class_name: cls ? cls.label : ''
        }
        
        // Trigger Print
        setTimeout(() => {
            window.print()
        }, 500)

        // Reset
        form.value.amount = ''
        fetchPayments()

    } catch (e) {
        console.error(e)
        $q.notify({ type: 'negative', message: 'Payment failed' })
    } finally {
        submitting.value = false
    }
}

function reprint(pay) {
    lastPayment.value = {
        ...pay,
        studentName: pay.students ? `${pay.students.first_name} ${pay.students.last_name}` : 'Unknown',
        class_name: '', // Ideally fetch class name too, but simplify for reprint
        class_id: pay.class_id
    }
    setTimeout(() => {
        window.print()
    }, 500)
}

function formatDate(dateStr) {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
    fetchInitialData()
})
</script>

<style scoped>
.font-outfit {
  font-family: 'Outfit', sans-serif;
}
.my-card {
  border-radius: 12px;
  border: 1px solid #f0f0f0;
}

/* Print Styles */
.print-only {
    display: none;
}

@media print {
    body * {
        visibility: hidden;
    }
    .no-print {
        display: none !important;
    }
    #receipt-print, #receipt-print * {
        visibility: visible;
    }
    #receipt-print {
        position: absolute;
        left: 0;
        top: 0;
        width: 80mm; /* Thermal paper width */
        display: block;
    }
    
    .receipt-container {
        width: 100%;
        padding: 10px;
        font-family: 'Courier New', Courier, monospace;
        font-size: 12px;
        text-align: center;
    }
    .header h2 { font-size: 16px; margin: 0; font-weight: bold; }
    .header p { margin: 2px 0; font-size: 10px; }
    
    .dashed { border-top: 1px dashed #000; margin: 10px 0; }
    .solid { border-top: 1px solid #000; margin: 10px 0; }
    
    .details { text-align: left; margin-bottom: 10px; }
    .details .row { display: flex; justify-content: space-between; }
    
    .item-list { text-align: left; }
    .item { font-weight: bold; margin-top: 5px; }
    .item-sub { font-size: 10px; margin-left: 10px; }
    
    .total { 
        display: flex; 
        justify-content: space-between; 
        font-size: 14px; 
        font-weight: bold; 
        margin-top: 15px;
    }
    
    .footer { margin-top: 20px; font-size: 10px; }
}
</style>
