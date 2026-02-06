<template>
  <q-page class="notifications-viewer-page">
    <div class="q-pa-lg">
      <!-- Page Header -->
      <div class="row items-center q-mb-lg">
        <div class="col">
          <h4 class="text-h4 text-weight-bold q-my-none">My Notifications</h4>
          <p class="text-subtitle1 text-grey-7 q-mb-none">
            {{ unreadCount }} unread notification{{ unreadCount !== 1 ? 's' : '' }}
          </p>
        </div>
        <div class="col-auto">
          <q-btn
            flat
            color="primary"
            icon="refresh"
            label="Refresh"
            @click="fetchNotifications"
            :loading="loading"
          />
        </div>
      </div>

      <!-- Filter Tabs -->
      <q-tabs
        v-model="activeFilter"
        class="text-primary q-mb-md"
        active-color="primary"
        indicator-color="primary"
        align="left"
      >
        <q-tab name="all" label="All" />
        <q-tab name="unread" label="Unread" />
        <q-tab name="announcement" label="Announcements" />
        <q-tab name="academic" label="Academic" />
        <q-tab name="payment" label="Payment" />
        <q-tab name="emergency" label="Emergency" />
      </q-tabs>

      <!-- Notifications List -->
      <div v-if="loading && notifications.length === 0" class="text-center q-py-xl">
        <q-spinner color="primary" size="50px" />
      </div>

      <div v-else-if="filteredNotifications.length === 0" class="text-center q-py-xl">
        <q-icon name="notifications_none" size="80px" color="grey-5" />
        <p class="text-h6 text-grey-6 q-mt-md">No notifications</p>
      </div>

      <div v-else class="notifications-list">
        <q-card
          v-for="notification in filteredNotifications"
          :key="notification.id"
          flat
          bordered
          class="notification-card q-mb-md"
          :class="{ 'unread-card': !notification.readAt }"
        >
          <q-card-section>
            <div class="row items-start">
              <!-- Icon -->
              <div class="col-auto q-mr-md">
                <q-avatar
                  :color="getNotificationColor(notification.type)"
                  text-color="white"
                  size="50px"
                >
                  <q-icon :name="getNotificationIcon(notification.type)" size="sm" />
                </q-avatar>
              </div>

              <!-- Content -->
              <div class="col">
                <div class="row items-center q-mb-xs">
                  <div class="col">
                    <div class="text-h6 text-weight-medium">
                      {{ notification.title }}
                    </div>
                  </div>
                  <div class="col-auto">
                    <q-badge
                      v-if="notification.priority === 'urgent'"
                      color="red"
                      label="URGENT"
                      class="q-mr-sm"
                    />
                    <q-badge
                      :color="getNotificationColor(notification.type)"
                      :label="notification.type"
                    />
                  </div>
                </div>

                <div class="text-body1 q-mb-sm">
                  {{ notification.message }}
                </div>

                <!-- Attachments -->
                <div
                  v-if="notification.attachment_urls && notification.attachment_urls.length > 0"
                  class="q-mb-sm"
                >
                  <q-chip
                    v-for="(url, index) in notification.attachment_urls"
                    :key="index"
                    icon="attach_file"
                    color="blue-grey-2"
                    clickable
                    @click="openAttachment(url)"
                  >
                    Attachment {{ index + 1 }}
                  </q-chip>
                </div>

                <!-- Metadata -->
                <div class="row items-center text-caption text-grey-6">
                  <div class="col">
                    <q-icon name="schedule" size="xs" class="q-mr-xs" />
                    {{ formatDate(notification.created_at) }}
                  </div>
                  <div class="col-auto">
                    <q-icon name="person" size="xs" class="q-mr-xs" />
                    {{ notification.creator?.full_name || 'System' }}
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="col-auto q-ml-md">
                <q-btn
                  v-if="!notification.readAt"
                  flat
                  dense
                  round
                  icon="check_circle"
                  color="green"
                  @click="markAsRead(notification)"
                >
                  <q-tooltip>Mark as read</q-tooltip>
                </q-btn>
                <q-btn
                  v-else
                  flat
                  dense
                  round
                  icon="radio_button_unchecked"
                  color="grey"
                  @click="markAsUnread(notification)"
                >
                  <q-tooltip>Mark as unread</q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Load More Button -->
      <div v-if="hasMore && !loading" class="text-center q-mt-lg">
        <q-btn
          flat
          color="primary"
          label="Load More"
          @click="loadMore"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/auth'
import notificationService from '../services/notificationService'

export default {
  name: 'NotificationsViewerPage',

  setup() {
    const route = useRoute()
    const $q = useQuasar()
    const authStore = useAuthStore()

    const notifications = ref([])
    const unreadCount = ref(0)
    const activeFilter = ref('all')
    const loading = ref(false)
    const hasMore = ref(true)
    const offset = ref(0)
    const limit = 20

    const filteredNotifications = computed(() => {
      let filtered = notifications.value

      if (activeFilter.value === 'unread') {
        filtered = filtered.filter((n) => !n.readAt)
      } else if (activeFilter.value !== 'all') {
        filtered = filtered.filter((n) => n.type === activeFilter.value)
      }

      return filtered
    })

    const fetchNotifications = async (append = false) => {
      try {
        loading.value = true

        const userId = authStore.user?.id
        if (!userId) return

        const data = await notificationService.getUserNotifications(userId, {
          limit,
          offset: append ? offset.value : 0,
        })

        if (append) {
          notifications.value.push(...data)
        } else {
          notifications.value = data
          offset.value = 0
        }

        offset.value += data.length
        hasMore.value = data.length === limit

        // Fetch unread count
        const count = await notificationService.getUnreadCount(userId)
        unreadCount.value = count
      } catch (error) {
        console.error('Error fetching notifications:', error)
        $q.notify({
          type: 'negative',
          message: 'Failed to load notifications',
        })
      } finally {
        loading.value = false
      }
    }

    const loadMore = () => {
      fetchNotifications(true)
    }

    const markAsRead = async (notification) => {
      try {
        await notificationService.markAsRead(
          notification.id,
          authStore.user.id
        )
        notification.readAt = new Date().toISOString()
        unreadCount.value = Math.max(0, unreadCount.value - 1)

        $q.notify({
          type: 'positive',
          message: 'Marked as read',
        })
      } catch (error) {
        console.error('Error marking as read:', error)
        $q.notify({
          type: 'negative',
          message: 'Failed to mark as read',
        })
      }
    }

    const markAsUnread = async (notification) => {
      try {
        await notificationService.markAsUnread(
          notification.id,
          authStore.user.id
        )
        notification.readAt = null
        unreadCount.value += 1

        $q.notify({
          type: 'positive',
          message: 'Marked as unread',
        })
      } catch (error) {
        console.error('Error marking as unread:', error)
        $q.notify({
          type: 'negative',
          message: 'Failed to mark as unread',
        })
      }
    }

    const openAttachment = (url) => {
      window.open(url, '_blank')
    }

    const getNotificationIcon = (type) => {
      const icons = {
        announcement: 'campaign',
        academic: 'school',
        payment: 'account_balance_wallet',
        emergency: 'warning',
      }
      return icons[type] || 'notifications'
    }

    const getNotificationColor = (type) => {
      const colors = {
        announcement: 'blue',
        academic: 'purple',
        payment: 'orange',
        emergency: 'red',
      }
      return colors[type] || 'grey'
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
    onMounted(async () => {
      await fetchNotifications()

      // Scroll to specific notification if provided in query
      if (route.query.id) {
        setTimeout(() => {
          const notificationCard = document.getElementById(route.query.id)
          if (notificationCard) {
            notificationCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }, 500)
      }
    })

    return {
      notifications,
      unreadCount,
      activeFilter,
      loading,
      hasMore,
      filteredNotifications,
      fetchNotifications,
      loadMore,
      markAsRead,
      markAsUnread,
      openAttachment,
      getNotificationIcon,
      getNotificationColor,
      formatDate,
    }
  },
}
</script>

<style scoped>
.notifications-viewer-page {
  max-width: 900px;
  margin: 0 auto;
}

.notification-card {
  transition: all 0.2s ease;
}

.notification-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.unread-card {
  border-left: 4px solid var(--q-primary);
  background: rgba(var(--q-primary-rgb), 0.02);
}
</style>
