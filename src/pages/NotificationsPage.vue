<template>
  <q-page class="notifications-page">
    <div class="q-pa-lg">
      <!-- Page Header -->
      <div class="row items-center q-mb-lg">
        <div class="col">
          <h4 class="text-h4 text-weight-bold q-my-none">Notifications</h4>
          <p class="text-subtitle1 text-grey-7 q-mb-none">
            {{ isAdmin ? 'Create and manage notifications for students and teachers' : 'Send notifications to your students' }}
          </p>
        </div>
      </div>

      <!-- Tabs -->
      <q-tabs
        v-model="activeTab"
        class="text-primary q-mb-md"
        active-color="primary"
        indicator-color="primary"
        align="left"
      >
        <q-tab name="create" label="Create Notification" icon="add_circle" />
        <q-tab name="manage" label="Sent Notifications" icon="history" />
      </q-tabs>

      <q-tab-panels v-model="activeTab" animated>
        <!-- CREATE NOTIFICATION TAB -->
        <q-tab-panel name="create">
          <q-card flat bordered class="q-pa-md">
            <q-card-section>
              <div class="text-h6 q-mb-md">📢 New Notification</div>

              <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
                <!-- Title -->
                <q-input
                  v-model="form.title"
                  label="Notification Title *"
                  outlined
                  dense
                  :rules="[(val) => !!val || 'Title is required']"
                  placeholder="e.g., Important Exam Announcement"
                />

                <!-- Message -->
                <q-input
                  v-model="form.message"
                  label="Message *"
                  outlined
                  type="textarea"
                  rows="5"
                  :rules="[(val) => !!val || 'Message is required']"
                  placeholder="Type your notification message here..."
                />

                <!-- Type and Priority -->
                <div class="row q-col-gutter-md">
                  <div class="col-6">
                    <q-select
                      v-model="form.type"
                      label="Type"
                      outlined
                      dense
                      :options="notificationTypes"
                      emit-value
                      map-options
                    />
                  </div>
                  <div class="col-6">
                    <q-select
                      v-model="form.priority"
                      label="Priority"
                      outlined
                      dense
                      :options="priorityOptions"
                      emit-value
                      map-options
                    />
                  </div>
                </div>

                <!-- Expiry Date (Optional) -->
                <q-input
                  v-model="form.expiresAt"
                  label="Expiry Date (Optional)"
                  outlined
                  dense
                  type="date"
                  hint="Notification will auto-hide after this date"
                />

                <!-- File Upload -->
                <div>
                  <div class="text-subtitle2 q-mb-sm">Attachments (Optional)</div>
                  <q-file
                    v-model="form.attachments"
                    outlined
                    dense
                    multiple
                    append
                    max-files="5"
                    accept="image/*,application/pdf,.doc,.docx"
                    hint="Max 5 files (Images, PDFs, Documents)"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                </div>

                <!-- TARGET SELECTION -->
                <q-separator class="q-my-lg" />

                <div class="text-h6 q-mb-md">🎯 Target Recipients</div>

                <!-- Role Filter -->
                <div v-if="isAdmin">
                  <div class="text-subtitle2 q-mb-sm">User Roles</div>
                  <div class="row q-gutter-sm">
                    <q-checkbox v-model="filters.roles" val="student" label="Students" />
                    <q-checkbox v-model="filters.roles" val="teacher" label="Teachers" />
                    <q-checkbox v-model="filters.roles" val="admin" label="Admins" />
                  </div>
                </div>
                <div v-else>
                  <q-banner rounded class="bg-blue-1 text-blue-9 q-mb-md">
                    <template v-slot:avatar>
                      <q-icon name="info" />
                    </template>
                    You can send notifications to <strong>students only</strong>
                  </q-banner>
                </div>

                <!-- Grade Filter -->
                <div>
                  <div class="text-subtitle2 q-mb-sm">Target Grades</div>
                  <q-checkbox
                    v-model="selectAllGrades"
                    label="All Grades (1-13)"
                    @update:model-value="toggleAllGrades"
                    class="q-mb-sm"
                  />
                  <div class="row q-gutter-sm">
                    <q-checkbox
                      v-for="grade in grades"
                      :key="grade"
                      v-model="filters.grades"
                      :val="grade"
                      :label="`Grade ${grade}`"
                      :disable="selectAllGrades"
                    />
                  </div>
                </div>

                <!-- Preview Recipients Button -->
                <q-btn
                  flat
                  color="primary"
                  icon="preview"
                  label="Preview Recipients"
                  @click="previewRecipients"
                  :loading="previewLoading"
                />

                <!-- Recipient Count Display -->
                <div v-if="recipientCount !== null" class="q-mt-md">
                  <q-banner rounded class="bg-green-1 text-green-9">
                    <template v-slot:avatar>
                      <q-icon name="people" color="green" />
                    </template>
                    This notification will be sent to <strong>{{ recipientCount }}</strong> user(s)
                  </q-banner>
                </div>

                <!-- Action Buttons -->
                <div class="row q-gutter-sm q-mt-lg">
                  <q-btn
                    type="submit"
                    color="primary"
                    icon="send"
                    label="Send Notification"
                    :loading="loading"
                    :disable="recipientCount === 0"
                  />
                  <q-btn
                    type="reset"
                    flat
                    color="grey-7"
                    label="Clear Form"
                  />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </q-tab-panel>

        <!-- SENT NOTIFICATIONS TAB -->
        <q-tab-panel name="manage">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-h6 q-mb-md">📋 Sent Notifications</div>

              <!-- Notifications Table -->
              <q-table
                :rows="sentNotifications"
                :columns="tableColumns"
                row-key="id"
                :loading="tableLoading"
                flat
                bordered
                :pagination="{ rowsPerPage: 10 }"
              >
                <!-- Type Badge -->
                <template v-slot:body-cell-type="props">
                  <q-td :props="props">
                    <q-badge :color="getTypeColor(props.value)">
                      {{ props.value }}
                    </q-badge>
                  </q-td>
                </template>

                <!-- Priority Badge -->
                <template v-slot:body-cell-priority="props">
                  <q-td :props="props">
                    <q-badge :color="getPriorityColor(props.value)">
                      {{ props.value }}
                    </q-badge>
                  </q-td>
                </template>

                <!-- Stats -->
                <template v-slot:body-cell-stats="props">
                  <q-td :props="props">
                    <div class="text-caption">
                      {{ props.row.stats.read }} / {{ props.row.stats.total }}
                      <q-tooltip>{{ props.row.stats.readPercentage }}% read</q-tooltip>
                    </div>
                    <q-linear-progress
                      :value="props.row.stats.read / props.row.stats.total"
                      color="green"
                      size="4px"
                      class="q-mt-xs"
                    />
                  </q-td>
                </template>

                <!-- Actions -->
                <template v-slot:body-cell-actions="props">
                  <q-td :props="props">
                    <q-btn
                      flat
                      dense
                      round
                      icon="visibility"
                      color="primary"
                      size="sm"
                      @click="viewNotificationDetails(props.row)"
                    >
                      <q-tooltip>View Details</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      dense
                      round
                      icon="delete"
                      color="negative"
                      size="sm"
                      @click="confirmDelete(props.row)"
                    >
                      <q-tooltip>Delete</q-tooltip>
                    </q-btn>
                  </q-td>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <!-- Preview Recipients Dialog -->
    <q-dialog v-model="showPreviewDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Preview Recipients</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p class="text-body2 text-grey-7">
            This notification will be sent to <strong>{{ recipientCount }}</strong> user(s).
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Notification Details Dialog -->
    <q-dialog v-model="showDetailsDialog">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">{{ selectedNotification?.title }}</div>
          <div class="text-subtitle2 text-grey-7">
            Sent on {{ formatDate(selectedNotification?.created_at) }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="q-mb-md">
            <strong>Message:</strong>
            <p class="q-mt-sm">{{ selectedNotification?.message }}</p>
          </div>

          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-6">
              <q-badge :color="getTypeColor(selectedNotification?.type)">
                {{ selectedNotification?.type }}
              </q-badge>
            </div>
            <div class="col-6">
              <q-badge :color="getPriorityColor(selectedNotification?.priority)">
                {{ selectedNotification?.priority }}
              </q-badge>
            </div>
          </div>

          <div v-if="selectedNotification?.stats">
            <strong>Delivery Stats:</strong>
            <div class="q-mt-sm">
              <div>Total Recipients: {{ selectedNotification.stats.total }}</div>
              <div>Read: {{ selectedNotification.stats.read }}</div>
              <div>Unread: {{ selectedNotification.stats.unread }}</div>
              <div>Read Rate: {{ selectedNotification.stats.readPercentage }}%</div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/auth'
import notificationService from '../services/notificationService'

export default {
  name: 'NotificationsPage',

  setup() {
    const $q = useQuasar()
    const authStore = useAuthStore()

    // User role checks
    const isAdmin = computed(() => authStore.user?.role === 'admin')
    const isTeacher = computed(() => authStore.user?.role === 'teacher')

    // Tab state
    const activeTab = ref('create')

    // Form data
    const form = ref({
      title: '',
      message: '',
      type: 'announcement',
      priority: 'normal',
      expiresAt: null,
      attachments: null,
    })

    // Filters
    const filters = ref({
      roles: [],
      grades: [],
    })

    const selectAllGrades = ref(false)
    const grades = Array.from({ length: 13 }, (_, i) => i + 1)

    const notificationTypes = [
      { label: '📢 Announcement', value: 'announcement' },
      { label: '📚 Academic', value: 'academic' },
      { label: '💰 Payment', value: 'payment' },
      { label: '🚨 Emergency', value: 'emergency' },
    ]

    const priorityOptions = [
      { label: 'Low', value: 'low' },
      { label: 'Normal', value: 'normal' },
      { label: 'High', value: 'high' },
      { label: '🔴 Urgent', value: 'urgent' },
    ]

    // State
    const loading = ref(false)
    const previewLoading = ref(false)
    const tableLoading = ref(false)
    const recipientCount = ref(null)
    const sentNotifications = ref([])
    const showPreviewDialog = ref(false)
    const showDetailsDialog = ref(false)
    const selectedNotification = ref(null)

    // Table columns
    const tableColumns = [
      { name: 'title', label: 'Title', field: 'title', align: 'left', sortable: true },
      { name: 'type', label: 'Type', field: 'type', align: 'center', sortable: true },
      { name: 'priority', label: 'Priority', field: 'priority', align: 'center', sortable: true },
      { name: 'stats', label: 'Read/Total', field: 'stats', align: 'center' },
      { name: 'created_at', label: 'Date', field: 'created_at', align: 'center', sortable: true, format: (val) => formatDate(val) },
      { name: 'actions', label: 'Actions', field: 'actions', align: 'center' },
    ]

    // Methods
    const toggleAllGrades = (value) => {
      if (value) {
        filters.value.grades = [...grades]
      } else {
        filters.value.grades = []
      }
    }

    const previewRecipients = async () => {
      try {
        previewLoading.value = true

        // Build filter object
        const targetFilters = {
          roles: isTeacher.value ? ['student'] : filters.value.roles,
          grades: selectAllGrades.value ? grades : filters.value.grades,
        }

        const userIds = await notificationService.getTargetUsers(
          targetFilters,
          authStore.user.role
        )

        recipientCount.value = userIds.length
        showPreviewDialog.value = true
      } catch (error) {
        console.error('Error previewing recipients:', error)
        $q.notify({
          type: 'negative',
          message: 'Failed to preview recipients',
          caption: error.message,
        })
      } finally {
        previewLoading.value = false
      }
    }

    const onSubmit = async () => {
      try {
        loading.value = true

        // Validate filters
        if (!isTeacher.value && filters.value.roles.length === 0) {
          $q.notify({
            type: 'warning',
            message: 'Please select at least one user role',
          })
          return
        }

        if (filters.value.grades.length === 0 && !selectAllGrades.value) {
          $q.notify({
            type: 'warning',
            message: 'Please select at least one grade',
          })
          return
        }

        // Build notification data
        const notificationData = {
          title: form.value.title,
          message: form.value.message,
          type: form.value.type,
          priority: form.value.priority,
          expiresAt: form.value.expiresAt || null,
          attachmentUrls: [], // TODO: Upload files and get URLs
        }

        const targetFilters = {
          roles: isTeacher.value ? ['student'] : filters.value.roles,
          grades: selectAllGrades.value ? grades : filters.value.grades,
        }

        const result = await notificationService.createNotification(
          notificationData,
          targetFilters
        )

        $q.notify({
          type: 'positive',
          message: 'Notification sent successfully!',
          caption: `Delivered to ${result.recipientCount} user(s)`,
        })

        // Reset form and switch to manage tab
        onReset()
        activeTab.value = 'manage'
        fetchSentNotifications()
      } catch (error) {
        console.error('Error sending notification:', error)
        $q.notify({
          type: 'negative',
          message: 'Failed to send notification',
          caption: error.message,
        })
      } finally {
        loading.value = false
      }
    }

    const onReset = () => {
      form.value = {
        title: '',
        message: '',
        type: 'announcement',
        priority: 'normal',
        expiresAt: null,
        attachments: null,
      }
      filters.value = {
        roles: [],
        grades: [],
      }
      selectAllGrades.value = false
      recipientCount.value = null
    }

    const fetchSentNotifications = async () => {
      try {
        tableLoading.value = true
        const notifications = await notificationService.getCreatedNotifications(
          authStore.user.id
        )
        sentNotifications.value = notifications
      } catch (error) {
        console.error('Error fetching sent notifications:', error)
        $q.notify({
          type: 'negative',
          message: 'Failed to load sent notifications',
        })
      } finally {
        tableLoading.value = false
      }
    }

    const viewNotificationDetails = (notification) => {
      selectedNotification.value = notification
      showDetailsDialog.value = true
    }

    const confirmDelete = (notification) => {
      $q.dialog({
        title: 'Confirm Delete',
        message: `Are you sure you want to delete "${notification.title}"?`,
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        try {
          await notificationService.deleteNotification(notification.id)
          $q.notify({
            type: 'positive',
            message: 'Notification deleted successfully',
          })
          fetchSentNotifications()
        } catch (error) {
          console.error('Error deleting notification:', error)
          $q.notify({
            type: 'negative',
            message: 'Failed to delete notification',
          })
        }
      })
    }

    const getTypeColor = (type) => {
      const colors = {
        announcement: 'blue',
        academic: 'purple',
        payment: 'orange',
        emergency: 'red',
      }
      return colors[type] || 'grey'
    }

    const getPriorityColor = (priority) => {
      const colors = {
        low: 'grey',
        normal: 'blue',
        high: 'orange',
        urgent: 'red',
      }
      return colors[priority] || 'grey'
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    // Lifecycle
    onMounted(() => {
      fetchSentNotifications()
    })

    return {
      activeTab,
      form,
      filters,
      selectAllGrades,
      grades,
      notificationTypes,
      priorityOptions,
      loading,
      previewLoading,
      tableLoading,
      recipientCount,
      sentNotifications,
      showPreviewDialog,
      showDetailsDialog,
      selectedNotification,
      tableColumns,
      isAdmin,
      isTeacher,
      toggleAllGrades,
      previewRecipients,
      onSubmit,
      onReset,
      viewNotificationDetails,
      confirmDelete,
      getTypeColor,
      getPriorityColor,
      formatDate,
    }
  },
}
</script>

<style scoped>
.notifications-page {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
