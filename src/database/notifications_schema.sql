-- ============================================
-- NOTIFICATIONS SYSTEM SCHEMA
-- ============================================
-- This schema enables admin and teachers to send 
-- targeted notifications to students and staff
-- with flexible filtering by grade and role.
-- ============================================

-- Main notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('announcement', 'academic', 'payment', 'emergency')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  attachment_urls JSONB DEFAULT '[]'::jsonb,
  target_filters JSONB NOT NULL DEFAULT '{}'::jsonb,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Junction table tracking who received each notification
CREATE TABLE IF NOT EXISTS notification_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(notification_id, user_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Index for fetching user's notifications quickly
CREATE INDEX IF NOT EXISTS idx_notification_recipients_user_id 
  ON notification_recipients(user_id);

-- Index for getting recipients of a notification
CREATE INDEX IF NOT EXISTS idx_notification_recipients_notification_id 
  ON notification_recipients(notification_id);

-- Index for chronological sorting
CREATE INDEX IF NOT EXISTS idx_notifications_created_at 
  ON notifications(created_at DESC);

-- Index for filtering by creator
CREATE INDEX IF NOT EXISTS idx_notifications_created_by 
  ON notifications(created_by);

-- Index for cleanup of expired notifications
CREATE INDEX IF NOT EXISTS idx_notifications_expires_at 
  ON notifications(expires_at) WHERE expires_at IS NOT NULL;

-- Composite index for unread notifications query
CREATE INDEX IF NOT EXISTS idx_notification_recipients_user_unread 
  ON notification_recipients(user_id, read_at) WHERE read_at IS NULL;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_recipients ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Admins can do everything with notifications" ON notifications;
DROP POLICY IF EXISTS "Teachers can create notifications" ON notifications;
DROP POLICY IF EXISTS "Teachers can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can view notifications they created" ON notifications;
DROP POLICY IF EXISTS "Users can view their notification recipients" ON notification_recipients;
DROP POLICY IF EXISTS "Users can update their own read status" ON notification_recipients;

-- NOTIFICATIONS TABLE POLICIES

-- Admins can do everything
CREATE POLICY "Admins can do everything with notifications"
  ON notifications
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Teachers can create notifications
CREATE POLICY "Teachers can create notifications"
  ON notifications
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'teacher'
    )
  );

-- Teachers and admins can view notifications they created
CREATE POLICY "Users can view notifications they created"
  ON notifications
  FOR SELECT
  USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- NOTIFICATION_RECIPIENTS TABLE POLICIES

-- Users can view their own notification recipients
CREATE POLICY "Users can view their notification recipients"
  ON notification_recipients
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM notifications 
      WHERE notifications.id = notification_recipients.notification_id 
      AND notifications.created_by = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Users can mark their own notifications as read
CREATE POLICY "Users can update their own read status"
  ON notification_recipients
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admins and teachers can insert notification recipients (when creating notifications)
CREATE POLICY "Creators can insert notification recipients"
  ON notification_recipients
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM notifications 
      WHERE notifications.id = notification_recipients.notification_id 
      AND notifications.created_by = auth.uid()
    )
  );

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_notification_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update timestamp
DROP TRIGGER IF EXISTS set_notification_updated_at ON notifications;
CREATE TRIGGER set_notification_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_timestamp();

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE notifications IS 'Stores all system notifications created by admins and teachers';
COMMENT ON TABLE notification_recipients IS 'Junction table tracking notification delivery and read status per user';
COMMENT ON COLUMN notifications.target_filters IS 'JSON object storing filter criteria: {role: [], grades: [], user_ids: []}';
COMMENT ON COLUMN notifications.attachment_urls IS 'JSON array of file URLs attached to notification';
COMMENT ON COLUMN notification_recipients.read_at IS 'Timestamp when user read the notification (NULL = unread)';
