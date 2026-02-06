import { supabase } from 'boot/supabase'

/**
 * Notification Service
 * Handles all notification-related operations including creation,
 * fetching, filtering, and read/unread tracking.
 */

const notificationService = {
  /**
   * Resolves target filters to specific user IDs
   * @param {Object} filters - { roles: [], grades: [], userIds: [] }
   * @param {String} creatorRole - Role of the creator (admin/teacher)
   * @returns {Array} Array of user IDs matching the criteria
   */
  async getTargetUsers(filters = {}, creatorRole = 'admin') {
    try {
      const { roles = [], grades = [], userIds = [] } = filters

      // Start building query
      let query = supabase.from('users').select('id')

      // If specific user IDs provided, use them directly
      if (userIds && userIds.length > 0) {
        query = query.in('id', userIds)
      } else {
        // Apply role filter
        if (roles && roles.length > 0) {
          // Teachers can only target students
          if (creatorRole === 'teacher') {
            query = query.eq('role', 'student')
          } else {
            query = query.in('role', roles)
          }
        } else if (creatorRole === 'teacher') {
          // Default for teachers: students only
          query = query.eq('role', 'student')
        }

        // Apply grade filter (only relevant for students)
        if (grades && grades.length > 0) {
          query = query.in('grade', grades)
        }
      }

      const { data, error } = await query

      if (error) throw error

      return data.map((user) => user.id)
    } catch (error) {
      console.error('Error getting target users:', error)
      throw error
    }
  },

  /**
   * Creates a new notification and delivers to target users
   * @param {Object} notificationData - Notification details
   * @param {Object} targetFilters - Filter criteria for recipients
   * @returns {Object} Created notification with recipient count
   */
  async createNotification(notificationData, targetFilters = {}) {
    try {
      const currentUser = await this.getCurrentUser()
      if (!currentUser) throw new Error('User not authenticated')

      // Validate teacher permissions (can only send to students)
      if (currentUser.role === 'teacher') {
        if (targetFilters.roles && targetFilters.roles.length > 0) {
          const hasNonStudent = targetFilters.roles.some(
            (role) => role !== 'student'
          )
          if (hasNonStudent) {
            throw new Error('Teachers can only send notifications to students')
          }
        }
      }

      // Get target user IDs
      const targetUserIds = await this.getTargetUsers(
        targetFilters,
        currentUser.role
      )

      if (targetUserIds.length === 0) {
        throw new Error('No users match the specified filters')
      }

      // Create the notification
      const { data: notification, error: notificationError } = await supabase
        .from('notifications')
        .insert({
          created_by: currentUser.id,
          title: notificationData.title,
          message: notificationData.message,
          type: notificationData.type || 'announcement',
          priority: notificationData.priority || 'normal',
          attachment_urls: notificationData.attachmentUrls || [],
          target_filters: targetFilters,
          expires_at: notificationData.expiresAt || null,
        })
        .select()
        .single()

      if (notificationError) throw notificationError

      // Create notification recipient records
      const recipients = targetUserIds.map((userId) => ({
        notification_id: notification.id,
        user_id: userId,
      }))

      const { error: recipientsError } = await supabase
        .from('notification_recipients')
        .insert(recipients)

      if (recipientsError) throw recipientsError

      return {
        ...notification,
        recipientCount: targetUserIds.length,
      }
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  },

  /**
   * Fetches notifications for a specific user
   * @param {String} userId - User ID
   * @param {Object} options - { unreadOnly, limit, offset, type }
   * @returns {Array} Array of notifications with read status
   */
  async getUserNotifications(userId, options = {}) {
    try {
      const {
        unreadOnly = false,
        limit = 50,
        offset = 0,
        type = null,
      } = options

      // Build query
      let query = supabase
        .from('notification_recipients')
        .select(
          `
          id,
          read_at,
          created_at,
          notification:notifications (
            id,
            title,
            message,
            type,
            priority,
            attachment_urls,
            expires_at,
            created_at,
            created_by,
            creator:users!notifications_created_by_fkey (
              id,
              full_name,
              role
            )
          )
        `
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      // Filter unread only
      if (unreadOnly) {
        query = query.is('read_at', null)
      }

      const { data, error } = await query

      if (error) throw error

      // Process and filter results
      let notifications = data
        .map((item) => ({
          recipientId: item.id,
          readAt: item.read_at,
          deliveredAt: item.created_at,
          ...item.notification,
        }))
        .filter((notif) => {
          // Filter out expired notifications
          if (notif.expires_at && new Date(notif.expires_at) < new Date()) {
            return false
          }
          // Filter by type if specified
          if (type && notif.type !== type) {
            return false
          }
          return true
        })

      return notifications
    } catch (error) {
      console.error('Error fetching user notifications:', error)
      throw error
    }
  },

  /**
   * Get unread notification count for a user
   * @param {String} userId - User ID
   * @returns {Number} Count of unread notifications
   */
  async getUnreadCount(userId) {
    try {
      const { count, error } = await supabase
        .from('notification_recipients')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .is('read_at', null)

      if (error) throw error

      return count || 0
    } catch (error) {
      console.error('Error getting unread count:', error)
      throw error
    }
  },

  /**
   * Marks a notification as read for a specific user
   * @param {String} notificationId - Notification ID
   * @param {String} userId - User ID
   * @returns {Object} Updated notification recipient record
   */
  async markAsRead(notificationId, userId) {
    try {
      const { data, error } = await supabase
        .from('notification_recipients')
        .update({ read_at: new Date().toISOString() })
        .eq('notification_id', notificationId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  },

  /**
   * Marks a notification as unread for a specific user
   * @param {String} notificationId - Notification ID
   * @param {String} userId - User ID
   * @returns {Object} Updated notification recipient record
   */
  async markAsUnread(notificationId, userId) {
    try {
      const { data, error } = await supabase
        .from('notification_recipients')
        .update({ read_at: null })
        .eq('notification_id', notificationId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Error marking notification as unread:', error)
      throw error
    }
  },

  /**
   * Get statistics for a specific notification (admin/teacher view)
   * @param {String} notificationId - Notification ID
   * @returns {Object} Stats object with total, read, and unread counts
   */
  async getNotificationStats(notificationId) {
    try {
      // Get total recipients
      const { count: totalCount, error: totalError } = await supabase
        .from('notification_recipients')
        .select('*', { count: 'exact', head: true })
        .eq('notification_id', notificationId)

      if (totalError) throw totalError

      // Get read count
      const { count: readCount, error: readError } = await supabase
        .from('notification_recipients')
        .select('*', { count: 'exact', head: true })
        .eq('notification_id', notificationId)
        .not('read_at', 'is', null)

      if (readError) throw readError

      return {
        total: totalCount || 0,
        read: readCount || 0,
        unread: (totalCount || 0) - (readCount || 0),
        readPercentage:
          totalCount > 0 ? ((readCount / totalCount) * 100).toFixed(1) : 0,
      }
    } catch (error) {
      console.error('Error getting notification stats:', error)
      throw error
    }
  },

  /**
   * Get all notifications created by a specific user (admin/teacher view)
   * @param {String} creatorId - Creator user ID
   * @param {Object} options - { limit, offset }
   * @returns {Array} Array of created notifications with stats
   */
  async getCreatedNotifications(creatorId, options = {}) {
    try {
      const { limit = 50, offset = 0 } = options

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('created_by', creatorId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error

      // Get stats for each notification
      const notificationsWithStats = await Promise.all(
        data.map(async (notification) => {
          const stats = await this.getNotificationStats(notification.id)
          return {
            ...notification,
            stats,
          }
        })
      )

      return notificationsWithStats
    } catch (error) {
      console.error('Error fetching created notifications:', error)
      throw error
    }
  },

  /**
   * Delete a notification (admin/creator only)
   * @param {String} notificationId - Notification ID
   * @returns {Boolean} Success status
   */
  async deleteNotification(notificationId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (error) throw error

      return true
    } catch (error) {
      console.error('Error deleting notification:', error)
      throw error
    }
  },

  /**
   * Helper: Get current authenticated user with role
   * @returns {Object} User object with role
   */
  async getCurrentUser() {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()
      if (authError) throw authError

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, role, full_name, email')
        .eq('id', user.id)
        .single()

      if (userError) throw userError

      return userData
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  },
}

export default notificationService
