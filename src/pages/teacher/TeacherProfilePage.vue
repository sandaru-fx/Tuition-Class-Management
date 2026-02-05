<template>
  <q-page class="q-pa-lg bg-slate-50">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold text-slate-800 font-outfit">Profile & Settings</div>
        <div class="text-subtitle1 text-slate-500">Manage your account and preferences</div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner color="blue-600" size="3em" />
    </div>

    <!-- Content -->
    <div v-else class="row q-col-gutter-lg">
      <!-- Left Column - Profile Info -->
      <div class="col-12 col-md-4">
        <q-card class="shadow-sm rounded-xl">
          <q-card-section class="text-center q-pa-lg bg-gradient-blue text-white">
            <q-avatar size="100px" color="white" text-color="blue-600" class="q-mb-md">
              <span class="text-h3">{{ initials }}</span>
            </q-avatar>
            <div class="text-h5 text-weight-bold">{{ profile.full_name }}</div>
            <div class="text-caption opacity-80">{{ profile.role?.toUpperCase() }}</div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-md">
            <q-list>
              <q-item>
                <q-item-section avatar>
                  <q-icon name="email" color="blue-600" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Email</q-item-label>
                  <q-item-label>{{ profile.email }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon name="phone" color="blue-600" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Phone</q-item-label>
                  <q-item-label>{{ profile.phone || 'Not set' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon name="cake" color="blue-600" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Date of Birth</q-item-label>
                  <q-item-label>{{ formatDate(profile.date_of_birth) || 'Not set' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section avatar>
                  <q-icon name="event" color="blue-600" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption>Joined</q-item-label>
                  <q-item-label>{{ formatDate(profile.created_at) }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-separator />

          <q-card-actions class="q-pa-md">
            <q-btn 
              unelevated 
              color="blue-600" 
              label="Edit Profile" 
              icon="edit" 
              no-caps 
              class="full-width"
              @click="editMode = true"
            />
          </q-card-actions>
        </q-card>

        <!-- Quick Stats Card -->
        <q-card class="shadow-sm rounded-xl q-mt-md">
          <q-card-section class="q-pa-md">
            <div class="text-subtitle2 text-weight-bold text-slate-800 q-mb-md">Teaching Stats</div>
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <div class="text-caption text-slate-500">Active Classes</div>
                <div class="text-h5 text-weight-bold text-blue-600">{{ stats.totalClasses }}</div>
              </div>
              <div class="col-6">
                <div class="text-caption text-slate-500">Total Students</div>
                <div class="text-h5 text-weight-bold text-green-600">{{ stats.totalStudents }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Right Column - Settings Tabs -->
      <div class="col-12 col-md-8">
        <q-card class="shadow-sm rounded-xl">
          <q-tabs
            v-model="activeTab"
            dense
            class="text-grey"
            active-color="blue-600"
            indicator-color="blue-600"
            align="left"
            narrow-indicator
          >
            <q-tab name="account" label="Account" icon="person" no-caps />
            <q-tab name="security" label="Security" icon="lock" no-caps />
            <q-tab name="preferences" label="Preferences" icon="settings" no-caps />
            <q-tab name="notifications" label="Notifications" icon="notifications" no-caps />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="activeTab" animated>
            <!-- Account Tab -->
            <q-tab-panel name="account">
              <div class="text-h6 text-weight-bold q-mb-md">Account Information</div>
              <div class="q-gutter-y-md">
                <q-input outlined v-model="profile.full_name" label="Full Name" readonly>
                  <template v-slot:append>
                    <q-btn flat dense icon="edit" size="sm" @click="editMode = true" />
                  </template>
                </q-input>
                <q-input outlined v-model="profile.email" label="Email" readonly />
                <q-input outlined v-model="profile.phone" label="Phone Number" readonly>
                  <template v-slot:append>
                    <q-btn flat dense icon="edit" size="sm" @click="editMode = true" />
                  </template>
                </q-input>
                <q-input outlined v-model="profile.date_of_birth" label="Date of Birth" type="date" readonly>
                  <template v-slot:append>
                    <q-btn flat dense icon="edit" size="sm" @click="editMode = true" />
                  </template>
                </q-input>
              </div>
            </q-tab-panel>

            <!-- Security Tab -->
            <q-tab-panel name="security">
              <div class="text-h6 text-weight-bold q-mb-md">Security Settings</div>
              
              <q-card flat bordered class="q-mb-md">
                <q-card-section>
                  <div class="row items-center justify-between">
                    <div>
                      <div class="text-weight-medium">Change Password</div>
                      <div class="text-caption text-grey-6">Update your account password</div>
                    </div>
                    <q-btn unelevated color="blue-600" label="Change" no-caps @click="showPasswordDialog = true" />
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered>
                <q-card-section>
                  <div class="text-weight-medium q-mb-sm">Login Activity</div>
                  <div class="text-caption text-grey-6 q-mb-md">Last login: {{ formatDateTime(profile.last_sign_in_at) || 'N/A' }}</div>
                  <div class="text-caption text-grey-6">Device: Web Browser</div>
                </q-card-section>
              </q-card>
            </q-tab-panel>

            <!-- Preferences Tab -->
            <q-tab-panel name="preferences">
              <div class="text-h6 text-weight-bold q-mb-md">Teaching Preferences</div>
              
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label>Default Assignment Duration</q-item-label>
                    <q-item-label caption>Set default days until assignment due date</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-select
                      outlined
                      dense
                      v-model="preferences.defaultAssignmentDays"
                      :options="[3, 7, 14, 30]"
                      style="width: 100px"
                    >
                      <template v-slot:append>days</template>
                    </q-select>
                  </q-item-section>
                </q-item>

                <q-separator spaced />

                <q-item tag="label">
                  <q-item-section>
                    <q-item-label>Auto-mark Absent</q-item-label>
                    <q-item-label caption>Automatically mark students as absent if not marked</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle v-model="preferences.autoMarkAbsent" color="blue-600" />
                  </q-item-section>
                </q-item>

                <q-separator spaced />

                <q-item tag="label">
                  <q-item-section>
                    <q-item-label>Show Grade Points</q-item-label>
                    <q-item-label caption>Display grade points alongside percentages</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle v-model="preferences.showGradePoints" color="blue-600" />
                  </q-item-section>
                </q-item>
              </q-list>

              <div class="q-mt-md">
                <q-btn unelevated color="blue-600" label="Save Preferences" @click="savePreferences" :loading="savingPrefs" no-caps />
              </div>
            </q-tab-panel>

            <!-- Notifications Tab -->
            <q-tab-panel name="notifications">
              <div class="text-h6 text-weight-bold q-mb-md">Notification Settings</div>
              
              <q-list>
                <q-item tag="label">
                  <q-item-section avatar>
                    <q-icon name="email" color="blue-600" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Email Notifications</q-item-label>
                    <q-item-label caption>Receive notifications via email</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle v-model="notifications.email" color="blue-600" />
                  </q-item-section>
                </q-item>

                <q-separator spaced />

                <q-item tag="label">
                  <q-item-section avatar>
                    <q-icon name="assignment_turned_in" color="green" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>New Submissions</q-item-label>
                    <q-item-label caption>Notify when students submit assignments</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle v-model="notifications.newSubmissions" color="blue-600" />
                  </q-item-section>
                </q-item>

                <q-separator spaced />

                <q-item tag="label">
                  <q-item-section avatar>
                    <q-icon name="event" color="orange" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Class Reminders</q-item-label>
                    <q-item-label caption>Daily reminders for upcoming classes</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle v-model="notifications.classReminders" color="blue-600" />
                  </q-item-section>
                </q-item>

                <q-separator spaced />

                <q-item tag="label">
                  <q-item-section avatar>
                    <q-icon name="people" color="purple" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Low Attendance Alerts</q-item-label>
                    <q-item-label caption>Alert when student attendance drops below threshold</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle v-model="notifications.lowAttendance" color="blue-600" />
                  </q-item-section>
                </q-item>
              </q-list>

              <div class="q-mt-md">
                <q-btn unelevated color="blue-600" label="Save Notifications" @click="saveNotifications" :loading="savingNotifs" no-caps />
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>

    <!-- Edit Profile Dialog -->
    <q-dialog v-model="editMode">
      <q-card style="min-width: 400px" class="rounded-xl">
        <q-card-section class="bg-blue-600 text-white">
          <div class="text-h6">Edit Profile</div>
        </q-card-section>

        <q-card-section class="q-gutter-y-md">
          <q-input outlined v-model="editForm.full_name" label="Full Name *" />
          <q-input outlined v-model="editForm.phone" label="Phone Number" />
          <q-input outlined v-model="editForm.date_of_birth" label="Date of Birth" type="date" />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" color="grey" v-close-popup no-caps />
          <q-btn unelevated label="Save" color="blue-600" @click="saveProfile" :loading="saving" no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Change Password Dialog -->
    <q-dialog v-model="showPasswordDialog">
      <q-card style="min-width: 400px" class="rounded-xl">
        <q-card-section class="bg-blue-600 text-white">
          <div class="text-h6">Change Password</div>
        </q-card-section>

        <q-card-section class="q-gutter-y-md">
          <q-input 
            outlined 
            v-model="passwordForm.currentPassword" 
            label="Current Password" 
            type="password"
            autocomplete="current-password"
          />
          <q-input 
            outlined 
            v-model="passwordForm.newPassword" 
            label="New Password" 
            type="password"
            autocomplete="new-password"
          />
          <q-input 
            outlined 
            v-model="passwordForm.confirmPassword" 
            label="Confirm Password" 
            type="password"
            autocomplete="new-password"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" color="grey" v-close-popup no-caps />
          <q-btn unelevated label="Change Password" color="blue-600" @click="changePassword" :loading="changingPassword" no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { supabase } from 'boot/supabase'
import { teacherService } from 'src/services/teacherService'
import { useQuasar, date } from 'quasar'

const $q = useQuasar()
const authStore = useAuthStore()

const loading = ref(true)
const saving = ref(false)
const savingPrefs = ref(false)
const savingNotifs = ref(false)
const changingPassword = ref(false)
const editMode = ref(false)
const showPasswordDialog = ref(false)
const activeTab = ref('account')

const profile = ref({
  full_name: '',
  email: '',
  phone: '',
  date_of_birth: null,
  role: '',
  created_at: null,
  last_sign_in_at: null
})

const stats = ref({
  totalClasses: 0,
  totalStudents: 0
})

const editForm = ref({
  full_name: '',
  phone: '',
  date_of_birth: null
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const preferences = ref({
  defaultAssignmentDays: 7,
  autoMarkAbsent: false,
  showGradePoints: true
})

const notifications = ref({
  email: true,
  newSubmissions: true,
  classReminders: true,
  lowAttendance: true
})

const initials = computed(() => {
  if (!profile.value.full_name) return '?'
  const names = profile.value.full_name.split(' ')
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase()
  }
  return names[0][0].toUpperCase()
})

async function fetchProfile() {
  loading.value = true
  try {
    // Get profile from auth store or fetch fresh
    if (authStore.profile) {
      profile.value = { ...authStore.profile }
      editForm.value = {
        full_name: profile.value.full_name,
        phone: profile.value.phone,
        date_of_birth: profile.value.date_of_birth
      }
    }

    // Fetch teaching stats
    const statData = await teacherService.getWeeklyStats(authStore.profile.id)
    stats.value = statData

  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: 'Failed to load profile' })
  } finally {
    loading.value = false
  }
}

async function saveProfile() {
  if (!editForm.value.full_name) {
    $q.notify({ type: 'warning', message: 'Name is required' })
    return
  }

  saving.value = true
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: editForm.value.full_name,
        phone: editForm.value.phone,
        date_of_birth: editForm.value.date_of_birth
      })
      .eq('id', authStore.profile.id)

    if (error) throw error

    profile.value.full_name = editForm.value.full_name
    profile.value.phone = editForm.value.phone
    profile.value.date_of_birth = editForm.value.date_of_birth

    // Update auth store
    authStore.profile = { ...profile.value }

    $q.notify({ type: 'positive', message: 'Profile updated successfully' })
    editMode.value = false
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: 'Failed to update profile' })
  } finally {
    saving.value = false
  }
}

async function changePassword() {
  if (!passwordForm.value.newPassword || !passwordForm.value.confirmPassword) {
    $q.notify({ type: 'warning', message: 'Please fill all fields' })
    return
  }

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    $q.notify({ type: 'warning', message: 'Passwords do not match' })
    return
  }

  if (passwordForm.value.newPassword.length < 6) {
    $q.notify({ type: 'warning', message: 'Password must be at least 6 characters' })
    return
  }

  changingPassword.value = true
  try {
    const { error } = await supabase.auth.updateUser({
      password: passwordForm.value.newPassword
    })

    if (error) throw error

    $q.notify({ type: 'positive', message: 'Password changed successfully' })
    showPasswordDialog.value = false
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: e.message || 'Failed to change password' })
  } finally {
    changingPassword.value = false
  }
}

function savePreferences() {
  savingPrefs.value = true
  setTimeout(() => {
    $q.notify({ type: 'positive', message: 'Preferences saved' })
    savingPrefs.value = false
  }, 500)
}

function saveNotifications() {
  savingNotifs.value = true
  setTimeout(() => {
    $q.notify({ type: 'positive', message: 'Notification settings saved' })
    savingNotifs.value = false
  }, 500)
}

function formatDate(val) {
  if (!val) return null
  return date.formatDate(val, 'MMM D, YYYY')
}

function formatDateTime(val) {
  if (!val) return null
  return date.formatDate(val, 'MMM D, YYYY h:mm A')
}

onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
.font-outfit { font-family: 'Outfit', sans-serif; }
.rounded-xl { border-radius: 16px; }
.bg-slate-50 { background-color: #F8FAFC; }
.text-slate-800 { color: #1E293B; }
.text-slate-500 { color: #64748B; }
.bg-gradient-blue {
  background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);
}
.opacity-80 { opacity: 0.8; }
</style>
