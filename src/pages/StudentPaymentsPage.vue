<template>
  <q-page class="q-pa-lg bg-slate-50">
    <!-- Header -->
    <div class="row items-center q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold text-slate-900 q-mb-xs font-outfit">My Payments</h1>
        <p class="text-slate-500 q-mb-none text-subtitle1">Manage your tuition fees and payment history.</p>
      </div>
      <q-space />
      <q-btn 
        unelevated 
        color="blue-6" 
        label="Make a Payment" 
        icon="add" 
        no-caps 
        class="rounded-lg q-px-md"
        @click="showPaymentDialog = true" 
      />
    </div>

    <!-- Quick Overview Stats -->
    <div class="row q-col-gutter-md q-mb-xl">
        <div class="col-12 col-md-4">
            <q-card class="bg-white shadow-sm border border-slate-100 rounded-2xl overflow-hidden">
                <q-card-section class="q-pa-lg">
                    <div class="row items-center">
                        <q-avatar color="blue-50" text-color="blue-600" icon="payments" size="48px" />
                        <div class="q-ml-md">
                            <div class="text-slate-500 text-caption text-weight-bold">TOTAL PAID</div>
                            <div class="text-h5 text-weight-bolder text-slate-900 font-outfit">LKR {{ totalPaid }}</div>
                        </div>
                    </div>
                </q-card-section>
            </q-card>
        </div>
        <div class="col-12 col-md-4">
            <q-card class="bg-white shadow-sm border border-slate-100 rounded-2xl overflow-hidden">
                <q-card-section class="q-pa-lg">
                    <div class="row items-center">
                        <q-avatar color="orange-50" text-color="orange-600" icon="hourglass_empty" size="48px" />
                        <div class="q-ml-md">
                            <div class="text-slate-500 text-caption text-weight-bold">PENDING VERIFICATION</div>
                            <div class="text-h5 text-weight-bolder text-slate-900 font-outfit">{{ pendingCount }}</div>
                        </div>
                    </div>
                </q-card-section>
            </q-card>
        </div>
    </div>

    <!-- Payment History Table -->
    <q-card class="bg-white shadow-sm border border-slate-100 rounded-2xl overflow-hidden">
        <q-card-section class="q-pa-md bg-slate-50 row items-center border-b border-slate-100">
            <div class="text-subtitle1 text-weight-bold text-slate-900">Transaction History</div>
            <q-space />
            <q-btn flat round color="slate-400" icon="refresh" @click="fetchHistory" :loading="loading" />
        </q-card-section>

        <q-markup-table flat class="text-left">
            <thead>
                <tr class="text-slate-400">
                    <th class="text-left q-pl-lg">Date</th>
                    <th class="text-left">Class / Subject</th>
                    <th class="text-left">Method</th>
                    <th class="text-right">Amount</th>
                    <th class="text-center">Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="loading">
                    <td colspan="5" class="text-center q-pa-xl">
                        <q-spinner-dots color="blue-6" size="40px" />
                    </td>
                </tr>
                <tr v-else-if="history.length === 0">
                    <td colspan="5" class="text-center q-pa-xl text-slate-400">
                        <q-icon name="history" size="48px" class="q-mb-md opacity-20" />
                        <div>No transactions found.</div>
                    </td>
                </tr>
                <tr v-for="txn in history" :key="txn.id" class="hover:bg-slate-50 transition-colors">
                    <td class="q-pl-lg">
                        <div class="text-weight-medium text-slate-900">{{ formatDate(txn.created_at) }}</div>
                        <div class="text-caption text-slate-400">{{ formatTime(txn.created_at) }}</div>
                    </td>
                    <td>
                        <div class="text-weight-bold text-slate-900">{{ txn.class?.subject?.name || 'Class Fee' }}</div>
                        <div class="text-caption text-slate-500">Grade {{ txn.class?.grade }}</div>
                    </td>
                    <td>
                         <q-chip dense size="sm" class="bg-slate-100 text-slate-700 text-weight-bold">
                            {{ formatMethod(txn.payment_method) }}
                         </q-chip>
                    </td>
                    <td class="text-right text-weight-black text-slate-900">
                        {{ txn.currency }} {{ txn.amount }}
                    </td>
                    <td class="text-center">
                        <q-chip 
                            size="sm" 
                            :color="getStatusColor(txn.status)" 
                            :text-color="getStatusTextColor(txn.status)"
                            class="text-weight-bold"
                        >
                            {{ txn.status.toUpperCase() }}
                        </q-chip>
                    </td>
                </tr>
            </tbody>
        </q-markup-table>
    </q-card>

    <!-- Make Payment Dialog -->
    <q-dialog v-model="showPaymentDialog" position="right" maximized transition-show="slide-left" transition-hide="slide-right">
        <q-card style="width: 450px; max-width: 90vw;" class="column full-height rounded-l-3xl shadow-2xl">
            <q-card-section class="row items-center q-pa-lg">
                <div class="text-h6 font-outfit text-weight-bold">Submit Payment</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-separator />

            <q-card-section class="col scroll q-pa-lg q-gutter-y-lg">
                <!-- Step 1: Select Class -->
                <div>
                    <label class="text-caption text-weight-bold text-slate-500 uppercase q-mb-xs block">1. Select Class</label>
                    <q-select 
                        outlined 
                        v-model="paymentForm.class_id" 
                        :options="classOptions" 
                        label="Choose your class" 
                        dense 
                        emit-value
                        map-options
                        bg-color="slate-50"
                        class="rounded-lg"
                    />
                </div>

                <!-- Step 2: Amount -->
                <div>
                    <label class="text-caption text-weight-bold text-slate-500 uppercase q-mb-xs block">2. Amount (LKR)</label>
                    <q-input 
                        outlined 
                        v-model.number="paymentForm.amount" 
                        type="number"
                        prefix="LKR"
                        dense
                        readonly
                        bg-color="slate-50"
                        class="rounded-lg"
                    />
                    <div class="text-caption text-blue-600 q-mt-xs text-weight-medium">Monthly fee auto-filled based on selected class.</div>
                </div>

                <!-- Step 3: Payment Type -->
                <div class="q-gutter-y-sm">
                    <label class="text-caption text-weight-bold text-slate-500 uppercase q-mb-xs block">3. Payment Method</label>
                    <div class="row q-col-gutter-sm">
                        <div class="col-6">
                            <q-btn 
                                flat 
                                no-caps 
                                class="full-width rounded-xl border-2" 
                                :class="paymentForm.method === 'bank_slip' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-500'"
                                @click="paymentForm.method = 'bank_slip'"
                            >
                                <q-icon name="receipt_long" size="sm" class="q-mb-xs" />
                                <div class="text-weight-bold">Bank Slip</div>
                            </q-btn>
                        </div>
                        <div class="col-6">
                            <q-btn 
                                flat 
                                no-caps 
                                class="full-width rounded-xl border-2" 
                                :class="paymentForm.method === 'online_card' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-500'"
                                @click="paymentForm.method = 'online_card'"
                            >
                                <q-icon name="credit_card" size="sm" class="q-mb-xs" />
                                <div class="text-weight-bold">Online Card</div>
                                <q-badge color="orange" floating rounded transparent label="Soon" style="right: -4px; top: -4px" />
                            </q-btn>
                        </div>
                    </div>
                </div>

                <!-- Step 4: Conditional Logic -->
                <div v-if="paymentForm.method === 'bank_slip'" class="animate-fade">
                    <label class="text-caption text-weight-bold text-slate-500 uppercase q-mb-xs block">4. Upload Bank Slip</label>
                    <q-file 
                        outlined 
                        v-model="slipFile" 
                        label="Select Slip Image (JPG/PNG)" 
                        dense
                        accept="image/*"
                        bg-color="slate-50"
                        class="rounded-lg"
                    >
                        <template v-slot:prepend>
                            <q-icon name="cloud_upload" color="blue-6" />
                        </template>
                    </q-file>
                    <div class="q-mt-md bg-blue-50 q-pa-md rounded-xl text-blue-8 text-caption">
                         <div class="text-weight-bold q-mb-xs">Bank Details:</div>
                         <div>Bank: Bank of Ceylon (BOC)</div>
                         <div>Account Name: SYZYGY LMS</div>
                         <div>Account Number: 1234 5678 9012</div>
                    </div>
                </div>

            </q-card-section>

            <q-separator />

            <q-card-section class="q-pa-lg">
                <q-btn 
                    unelevated 
                    color="blue-600" 
                    label="Confirm & Submit" 
                    class="full-width rounded-xl q-py-md text-weight-bold" 
                    no-caps
                    :loading="submitting"
                    @click="submitPayment"
                    :disabled="!isFormValid"
                />
            </q-card-section>
        </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import { paymentService } from 'src/services/paymentService'
import { classService } from 'src/services/classService'

const $q = useQuasar()
const authStore = useAuthStore()

const loading = ref(false)
const submitting = ref(false)
const history = ref([])
const showPaymentDialog = ref(false)
const slipFile = ref(null)

const classOptions = ref([])
const fullClasses = ref([]) // To store meta-data for auto-filling fee

const paymentForm = ref({
    class_id: null,
    amount: 0,
    method: 'bank_slip'
})

// Validation
const isFormValid = computed(() => {
    if (!paymentForm.value.class_id || !paymentForm.value.amount) return false
    if (paymentForm.value.method === 'bank_slip' && !slipFile.value) return false
    return true
})

// Stats
const totalPaid = computed(() => {
    return history.value
        .filter(t => t.status === 'verified')
        .reduce((sum, t) => sum + Number(t.amount), 0)
        .toLocaleString()
})

const pendingCount = computed(() => {
    return history.value.filter(t => t.status === 'pending').length
})

// Logic
async function fetchHistory() {
    if (!authStore.profile?.id) return
    loading.value = true
    try {
        history.value = await paymentService.getMyTransactions(authStore.profile.id)
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

async function fetchClasses() {
    try {
        const data = await classService.getAll()
        fullClasses.value = data
        classOptions.value = data.map(c => ({
            label: `${c.subject?.name} - Grade ${c.grade}`,
            value: c.id
        }))
    } catch (e) { console.error(e) }
}

// Auto-fill fee when class changes
watch(() => paymentForm.value.class_id, (newId) => {
    const cls = fullClasses.value.find(c => c.id === newId)
    if (cls) {
        paymentForm.value.amount = cls.monthly_fee || 3500 // Fallback to 3500 if DB column is empty
    }
})

async function submitPayment() {
    submitting.value = true
    try {
        let slipUrl = null
        
        // 1. If Bank Slip, Upload Image First
        if (paymentForm.value.method === 'bank_slip' && slipFile.value) {
            slipUrl = await paymentService.uploadSlip(slipFile.value, authStore.profile.id)
        }

        // 2. Create Transaction Record
        const txnData = {
            student_id: authStore.profile.id,
            class_id: paymentForm.value.class_id,
            amount: paymentForm.value.amount,
            payment_method: paymentForm.value.method,
            status: 'pending',
            slip_url: slipUrl
        }

        await paymentService.createTransaction(txnData)
        
        $q.notify({
            type: 'positive',
            message: 'Payment submitted successfully!',
            caption: 'Admin will verify your slip soon.',
            position: 'top'
        })

        showPaymentDialog.value = false
        slipFile.value = null
        paymentForm.value = { class_id: null, amount: 0, method: 'bank_slip' }
        fetchHistory()

    } catch (e) {
        console.error(e)
        $q.notify({ type: 'negative', message: 'Payment failed to submit.' })
    } finally {
        submitting.value = false
    }
}

// Formatting
const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const formatTime = (date) => new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
const formatMethod = (m) => m === 'bank_slip' ? 'Bank Transfer' : 'Online Card'

const getStatusColor = (s) => {
    if (s === 'verified') return 'green-50'
    if (s === 'pending') return 'blue-50'
    return 'red-50'
}

const getStatusTextColor = (s) => {
    if (s === 'verified') return 'green-700'
    if (s === 'pending') return 'blue-700'
    return 'red-700'
}

onMounted(() => {
    if (authStore.profile?.id) {
        fetchHistory()
        fetchClasses()
    }
})
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.rounded-2xl { border-radius: 16px; }
.rounded-3xl { border-radius: 24px; }
.rounded-xl { border-radius: 12px; }
.border-slate-100 { border-color: #f1f5f9; }
.text-slate-900 { color: #0f172a; }
.text-slate-500 { color: #64748b; }
.bg-slate-50 { background-color: #f8fafc; }
.animate-fade {
    animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
