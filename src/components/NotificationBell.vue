<template>
  <q-btn-dropdown
    flat
    dense
    round
    icon="notifications"
    class="notification-bell"
  >
    <!-- Unread badge -->
    <q-badge
      v-if="unreadCount > 0"
      color="red"
      floating
      rounded
    >
      {{ unreadCount > 99 ? '99+' : unreadCount }}
    </q-badge>

    <q-list style="min-width: 350px; max-height: 500px" class="notification-dropdown">
      <!-- Header -->
      <q-item class="bg-primary text-white">
        <q-item-section>
          <q-item-label class="text-weight-bold">Notifications</q-item-label>
          <q-item-label caption class="text-white">
            {{ unreadCount }} unread
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            flat
            dense
            round
            icon="settings"
            color="white"
            size="sm"
            @click="goToNotifications"
          >
            <q-tooltip>View All</q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>

      <q-separator />

      <!-- Filter Tabs -->
      <q-tabs
        v-model="filterTab"
        class="text-grey-7 bg-grey-2"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        dense
      >
        <q-tab name="all" label="All" />
        <q-tab name="unread" label="Unread" />
      </q-tabs>

      <q-separator />

      <!-- Notifications List -->
      <q-scroll-area style="max-height: 350px">
        <q-item
          v-for="notification in filteredNotifications"
          :key="notification.id"
          clickable
          @click="handleNotificationClick(notification)"
          :class="{ 'bg-blue-1': !notification.readAt }"
        >
          <q-item-section avatar>
            <q-icon
              :name="getNotificationIcon(notification.type)"
              :color="getNotificationColor(notification.type)"
              size="md"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-medium">
              {{ notification.title }}
            </q-item-label>
            <q-item-label caption lines="2">
              {{ notification.message }}
            </q-item-label>
            <q-item-label caption class="text-grey-6 q-mt-xs">
              {{ formatTimeAgo(notification.created_at) }}
            </q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-badge
              v-if="notification.priority === 'urgent'"
              color="red"
              label="URGENT"
            />
            <q-icon
              v-if="!notification.readAt"
              name="circle"
              color="primary"
              size="xs"
            />
          </q-item-section>
        </q-item>

        <!-- Empty State -->
        <q-item v-if="filteredNotifications.length === 0">
          <q-item-section class="text-center text-grey-6">
            <q-icon name="notifications_none" size="lg" class="q-mb-sm" />
            <div>No notifications</div>
          </q-item-section>
        </q-item>
      </q-scroll-area>

      <q-separator />

      <!-- Footer -->
      <q-item clickable @click="goToNotifications" class="text-center bg-grey-2">
        <q-item-section>
          <q-item-label class="text-primary text-weight-medium">
            View All Notifications
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import notificationService from 'src/services/notificationService'

export default {
  name: 'NotificationBell',

  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const notifications = ref([])
    const unreadCount = ref(0)
    const filterTab = ref('all')

    const filteredNotifications = computed(() => {
      if (filterTab.value === 'unread') {
        return notifications.value.filter((n) => !n.readAt)
      }
      return notifications.value
    })

    const fetchNotifications = async () => {
      try {
        const userId = authStore.user?.id
        if (!userId) return

        // Fetch recent notifications (limit 10 for dropdown)
        const data = await notificationService.getUserNotifications(userId, {
          limit: 10,
        })
        notifications.value = data

        // Fetch unread count
        const count = await notificationService.getUnreadCount(userId)
        unreadCount.value = count
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    }

    const handleNotificationClick = async (notification) => {
      try {
        // Mark as read if unread
        if (!notification.readAt) {
          await notificationService.markAsRead(
            notification.id,
            authStore.user.id
          )
          notification.readAt = new Date().toISOString()
          unreadCount.value = Math.max(0, unreadCount.value - 1)
        }

        // Navigate to full notifications page with selected notification
        router.push({
          name: 'NotificationsViewer',
          query: { id: notification.id },
        })
      } catch (error) {
        console.error('Error marking notification as read:', error)
      }
    }

    const goToNotifications = () => {
      router.push({ name: 'NotificationsViewer' })
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

    const formatTimeAgo = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      const now = new Date()
      const seconds = Math.floor((now - date) / 1000)

      const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
      }

      for (const [unit, value] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / value)
        if (interval >= 1) {
          return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`
        }
      }

      return 'Just now'
    }

    // Lifecycle
    onMounted(() => {
      fetchNotifications()

      // Poll for new notifications every 30 seconds
      setInterval(() => {
        fetchNotifications()
      }, 30000)
    })

    return {
      notifications,
      unreadCount,
      filterTab,
      filteredNotifications,
      handleNotificationClick,
      goToNotifications,
      getNotificationIcon,
      getNotificationColor,
      formatTimeAgo,
    }
  },
}
</script>

<style scoped>
.notification-bell {
  position: relative;
}

.notification-dropdown {
  overflow: hidden;
}
</style>
