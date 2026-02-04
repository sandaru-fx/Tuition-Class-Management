<template>
  <q-page class="q-pa-lg">
    <!-- Header -->
    <div class="row items-center q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold text-dark q-mb-xs font-outfit">Payment Management</h1>
        <p class="text-grey-7 q-mb-none text-subtitle1">Verify bank slips and track payment history.</p>
      </div>
      <q-space />
       <!-- Future: Export Button -->
    </div>

    <!-- Stats Cards (Summary) -->
    <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12 col-md-4">
            <q-card class="bg-blue-1 text-blue-9 shadow-0 rounded-borders-lg">
                <q-card-section class="row items-center">
                    <div class="col">
                        <div class="text-subtitle2 text-weight-bold opacity-60">PENDING VERIFICATION</div>
                        <div class="text-h4 text-weight-bolder font-outfit">{{ pendingCount }}</div>
                    </div>
                    <q-icon name="pending_actions" size="3rem" class="opacity-40" />
                </q-card-section>
            </q-card>
        </div>
        <!-- More cards can be added -->
    </div>

    <!-- Tabs -->
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="left"
      narrow-indicator
    >
      <q-tab name="pending" label="Pending Verification" icon="verified_user" no-caps>
        <q-badge color="red" floating v-if="pendingCount > 0">{{ pendingCount }}</q-badge>
      </q-tab>
      <q-tab name="history" label="Transaction History" icon="history" no-caps />
      <q-tab name="analysis" label="Financial Analysis" icon="insights" no-caps />
    </q-tabs>

    <q-separator class="q-mb-md" />

    <q-tab-panels v-model="tab" animated class="bg-transparent">
      
      <!-- Inside q-tab-panels -->
      <q-tab-panel name="analysis" class="q-pa-none">
          <div v-if="loadingStats" class="text-center q-pa-xl">
              <q-spinner-grid color="primary" size="4em" />
              <div class="q-mt-md text-grey">Analyzing financial data...</div>
          </div>
          <div v-else class="row q-col-gutter-md">
              <!-- Revenue Summary Cards -->
              <div class="col-12 col-md-4">
                  <q-card class="rounded-borders-lg shadow-1 bg-white">
                      <q-card-section>
                          <div class="text-subtitle2 text-grey-7 uppercase font-outfit">Total Revenue (LKR)</div>
                          <div class="text-h3 text-weight-bolder text-primary q-my-sm">{{ totalRevenue.toLocaleString() }}</div>
                          <div class="row items-center text-green text-weight-bold">
                              <q-icon name="trending_up" class="q-mr-xs" />
                              <span>Verified Payments</span>
                          </div>
                      </q-card-section>
                  </q-card>
              </div>

              <!-- Revenue by Grade (Bar Chart View) -->
              <div class="col-12 col-md-8">
                  <q-card class="rounded-borders-lg shadow-1 bg-white">
                      <q-card-section>
                          <div class="text-subtitle1 text-weight-bold q-mb-md">Revenue by Grade Category</div>
                          <div v-for="(amount, grade) in analysisStats.byGrade" :key="grade" class="q-mb-sm">
                              <div class="row justify-between text-caption text-weight-bold">
                                  <span>Grade {{ grade }}</span>
                                  <span>LKR {{ amount.toLocaleString() }}</span>
                              </div>
                              <q-linear-progress 
                                  :value="totalRevenue > 0 ? amount / totalRevenue : 0" 
                                  color="primary" 
                                  size="10px" 
                                  rounded 
                                  class="q-mt-xs"
                                  track-color="grey-2"
                              />
                          </div>
                      </q-card-section>
                  </q-card>
              </div>

              <!-- Revenue by Subject -->
              <div class="col-12 col-md-6">
                   <q-card class="rounded-borders-lg shadow-1 bg-white">
                      <q-card-section>
                          <div class="text-subtitle1 text-weight-bold q-mb-md">Top Performing Subjects</div>
                          <q-list separator>
                              <q-item v-for="(amount, subject) in sortedSubjects" :key="subject">
                                  <q-item-section avatar>
                                      <q-avatar color="blue-1" text-color="blue-7" icon="book" size="sm" />
                                  </q-item-section>
                                  <q-item-section>
                                      <q-item-label class="text-weight-bold">{{ subject }}</q-item-label>
                                      <q-item-label caption>Verified Collections</q-item-label>
                                  </q-item-section>
                                  <q-item-section side>
                                      <div class="text-weight-bolder text-dark">LKR {{ amount.toLocaleString() }}</div>
                                  </q-item-section>
                              </q-item>
                          </q-list>
                      </q-card-section>
                  </q-card>
              </div>

              <!-- Payment Method Split -->
              <div class="col-12 col-md-6">
                  <q-card class="rounded-borders-lg shadow-1 bg-white border-left-blue">
                      <q-card-section>
                          <div class="text-subtitle1 text-weight-bold q-mb-md">Payment Method Distribution</div>
                          <div class="row q-col-gutter-sm text-center">
                              <div v-for="(amount, method) in analysisStats.byMethod" :key="method" class="col-4">
                                  <div class="q-pa-md bg-grey-1 rounded-borders full-height">
                                      <div class="text-caption text-grey-6 uppercase">{{ method.replace('_', ' ') }}</div>
                                      <div class="text-h6 text-weight-bold">{{ totalRevenue > 0 ? ((amount/totalRevenue)*100).toFixed(0) : 0 }}%</div>
                                      <div class="text-caption">LKR {{ (amount/1000).toFixed(1) }}K</div>
                                  </div>
                              </div>
                          </div>
                      </q-card-section>
                  </q-card>
              </div>

          </div>
      </q-tab-panel>

      <!-- Pending Tab -->
      <q-tab-panel name="pending" class="q-pa-none">
          <div v-if="loading" class="text-center q-pa-lg">
              <q-spinner color="primary" size="3em" />
              <div class="text-grey q-mt-sm">Loading pending payments...</div>
          </div>

          <div v-else-if="pendingTransactions.length === 0" class="text-center q-pa-xl text-grey-6 bg-white rounded-borders shadow-1">
              <q-icon name="check_circle" size="4rem" class="text-green-2 q-mb-md" />
              <div class="text-h6">All Caught Up!</div>
              <div class="text-subtitle2">No pending manual payments to verify.</div>
          </div>

          <div v-else class="row q-col-gutter-md">
              <div class="col-12 col-md-6 col-lg-4" v-for="txn in pendingTransactions" :key="txn.id">
                  <q-card class="shadow-1 rounded-borders-lg hover-lift">
                      <!-- Slip Preview Header -->
                      <q-img 
                        :src="txn.slip_url" 
                        :ratio="16/9"
                        class="cursor-pointer bg-grey-2"
                        @click="openImagePreview(txn.slip_url)"
                      >
                         <div class="absolute-bottom text-subtitle2 text-center bg-transparent-gradient">
                             Click to Expand Slip
                         </div>
                         <template v-slot:error>
                             <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">
                                 <q-icon name="broken_image" size="md" /> No Image
                             </div>
                         </template>
                      </q-img>

                      <q-card-section>
                          <div class="row items-center no-wrap">
                              <div class="col">
                                  <div class="text-subtitle1 text-weight-bold">{{ txn.student?.full_name || 'Unknown Student' }}</div>
                                  <div class="text-caption text-grey-7">
                                      {{ txn.student?.grade ? `Grade ${txn.student.grade}` : '' }} • {{ txn.student?.whatsapp_number }}
                                  </div>
                              </div>
                              <div class="col-auto">
                                  <q-chip dense color="blue-1" text-color="blue-9" class="text-weight-bold">
                                      {{ txn.currency }} {{ txn.amount }}
                                  </q-chip>
                              </div>
                          </div>
                      </q-card-section>

                      <q-separator />

                      <q-card-section class="q-py-sm bg-grey-1">
                          <div class="text-caption text-grey-8 row items-center">
                              <q-icon name="class" size="xs" class="q-mr-xs" />
                              Paying for: <span class="text-weight-medium q-ml-xs">{{ txn.class?.subject?.name }} (Grade {{ txn.class?.grade }})</span>
                          </div>
                          <div class="text-caption text-grey-6 q-mt-xs">
                              Submitted: {{ new Date(txn.created_at).toLocaleString() }}
                          </div>
                      </q-card-section>

                      <q-card-actions align="right" class="q-pa-md">
                          <q-btn flat color="red-7" label="Reject" no-caps @click="verifyPayment(txn, 'rejected')" :loading="txn.processing" />
                          <q-btn unelevated color="green-6" label="Verify & Approve" icon="check" no-caps @click="verifyPayment(txn, 'verified')" :loading="txn.processing" />
                      </q-card-actions>
                  </q-card>
              </div>
          </div>
      </q-tab-panel>

      <!-- History Tab -->
      <q-tab-panel name="history">
          <div class="text-center text-grey-5 q-pa-xl">
              <q-icon name="history" size="4rem" />
              <div class="q-mt-sm">Detailed transaction history coming soon...</div>
          </div>
      </q-tab-panel>

    </q-tab-panels>

    <!-- Image Preview Dialog -->
    <q-dialog v-model="showImageDialog" maximized>
        <q-card class="bg-black text-white">
            <q-bar class="bg-black">
                <q-space />
                <q-btn dense flat icon="close" v-close-popup>
                    <q-tooltip>Close</q-tooltip>
                </q-btn>
            </q-bar>
            <q-card-section class="flex flex-center scroll" style="height: calc(100vh - 50px)">
                <img :src="previewImageUrl" style="max-width: 100%; max-height: 100vh; object-fit: contain;" />
            </q-card-section>
        </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { paymentService } from 'src/services/paymentService'

const $q = useQuasar()
const tab = ref('pending')
const loading = ref(false)
const loadingStats = ref(false)
const pendingTransactions = ref([])
const showImageDialog = ref(false)
const previewImageUrl = ref('')

const analysisStats = ref({
    totalRevenue: 0,
    byGrade: {},
    byMethod: {},
    bySubject: {}
})

const pendingCount = computed(() => pendingTransactions.value.length)
const totalRevenue = computed(() => analysisStats.value.totalRevenue)

// Sort subjects by revenue
const sortedSubjects = computed(() => {
    return Object.entries(analysisStats.value.bySubject)
        .sort(([, a], [, b]) => b - a)
        .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
})

async function fetchPending() {
    loading.value = true
    try {
        const data = await paymentService.getPendingTransactions()
        pendingTransactions.value = data.map(txn => ({ ...txn, processing: false }))
    } catch (error) {
        console.error(error)
        $q.notify({ type: 'negative', message: 'Failed to load payments' })
    } finally {
        loading.value = false
    }
}

async function fetchStats() {
    loadingStats.value = true
    try {
        analysisStats.value = await paymentService.getPaymentStats()
    } catch (error) {
        console.error(error)
        $q.notify({ type: 'negative', message: 'Failed to load analytics' })
    } finally {
        loadingStats.value = false
    }
}

function openImagePreview(url) {
    if (!url) return
    previewImageUrl.value = url
    showImageDialog.value = true
}

async function verifyPayment(txn, status) {
    txn.processing = true
    try {
        await paymentService.verifyTransaction(txn.id, status)
        
        $q.notify({ 
            type: status === 'verified' ? 'positive' : 'warning', 
            message: status === 'verified' ? 'Payment Approved!' : 'Payment Rejected' 
        })
        
        // Remove from list
        pendingTransactions.value = pendingTransactions.value.filter(t => t.id !== txn.id)
        
        // Refresh stats if on analysis tab
        if (tab.value === 'analysis') fetchStats()
        
    } catch (error) {
        console.error(error)
        $q.notify({ type: 'negative', message: 'Action failed' })
    } finally {
        txn.processing = false
    }
}

// Watch tab changes to refresh data
watch(tab, (newTab) => {
    if (newTab === 'analysis') fetchStats()
    if (newTab === 'pending') fetchPending()
})

onMounted(() => {
    fetchPending()
})
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.rounded-borders-lg { border-radius: 12px; }
.opacity-60 { opacity: 0.6; }
.opacity-40 { opacity: 0.4; }
.bg-transparent-gradient {
    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
    color: white;
    padding: 10px;
}
.hover-lift { transition: transform 0.2s; }
.hover-lift:hover { transform: translateY(-4px); }
.border-left-blue { border-left: 5px solid var(--q-primary); }
</style>

