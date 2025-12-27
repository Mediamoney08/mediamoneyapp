
-- Add provider reply fields to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS provider_reply TEXT,
ADD COLUMN IF NOT EXISTS provider_reply_at TIMESTAMPTZ;

-- Add provider_reply notification type
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'provider_reply' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'notification_type')) THEN
    ALTER TYPE notification_type ADD VALUE 'provider_reply';
  END IF;
END $$;

-- Create trigger function for provider reply notifications
CREATE OR REPLACE FUNCTION notify_provider_reply()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only notify when provider_reply is added or updated
  IF (TG_OP = 'UPDATE' AND NEW.provider_reply IS NOT NULL AND (OLD.provider_reply IS NULL OR OLD.provider_reply != NEW.provider_reply)) THEN
    INSERT INTO notifications (user_id, type, title, message, metadata)
    VALUES (
      NEW.user_id,
      'provider_reply',
      'Provider Response Received',
      'Your order has a new response from the provider. Check your order details.',
      jsonb_build_object(
        'order_id', NEW.id,
        'provider_reply', NEW.provider_reply,
        'replied_at', NEW.provider_reply_at
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for provider reply notifications
DROP TRIGGER IF EXISTS trigger_provider_reply_notifications ON orders;
CREATE TRIGGER trigger_provider_reply_notifications
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_provider_reply();

COMMENT ON COLUMN orders.provider_reply IS 'Response/reply from the service provider about the order';
COMMENT ON COLUMN orders.provider_reply_at IS 'Timestamp when provider added the reply';
COMMENT ON FUNCTION notify_provider_reply IS 'Automatically creates notifications when provider adds a reply to an order';
