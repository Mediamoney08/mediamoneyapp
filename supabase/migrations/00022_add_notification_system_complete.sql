
-- Add new notification types
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'order_created' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'notification_type')) THEN
    ALTER TYPE notification_type ADD VALUE 'order_created';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'order_processing' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'notification_type')) THEN
    ALTER TYPE notification_type ADD VALUE 'order_processing';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'order_rejected' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'notification_type')) THEN
    ALTER TYPE notification_type ADD VALUE 'order_rejected';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'balance_added' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'notification_type')) THEN
    ALTER TYPE notification_type ADD VALUE 'balance_added';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'payment_approved' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'notification_type')) THEN
    ALTER TYPE notification_type ADD VALUE 'payment_approved';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'payment_rejected' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'notification_type')) THEN
    ALTER TYPE notification_type ADD VALUE 'payment_rejected';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'service_added' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'notification_type')) THEN
    ALTER TYPE notification_type ADD VALUE 'service_added';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'service_unavailable' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'notification_type')) THEN
    ALTER TYPE notification_type ADD VALUE 'service_unavailable';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'service_available' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'notification_type')) THEN
    ALTER TYPE notification_type ADD VALUE 'service_available';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'price_increased' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'notification_type')) THEN
    ALTER TYPE notification_type ADD VALUE 'price_increased';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'price_decreased' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'notification_type')) THEN
    ALTER TYPE notification_type ADD VALUE 'price_decreased';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'website_update' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'notification_type')) THEN
    ALTER TYPE notification_type ADD VALUE 'website_update';
  END IF;
END $$;

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS create_notification CASCADE;
DROP FUNCTION IF EXISTS create_broadcast_notification CASCADE;
DROP FUNCTION IF EXISTS notify_order_status_change CASCADE;
DROP FUNCTION IF EXISTS notify_payment_status_change CASCADE;
DROP FUNCTION IF EXISTS notify_balance_added CASCADE;
DROP FUNCTION IF EXISTS notify_product_changes CASCADE;

-- Function to create notification
CREATE FUNCTION create_notification(
  p_user_id UUID,
  p_type notification_type,
  p_title TEXT,
  p_message TEXT,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, metadata)
  VALUES (p_user_id, p_type, p_title, p_message, p_metadata)
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$;

-- Function to create broadcast notification (to all users)
CREATE FUNCTION create_broadcast_notification(
  p_type notification_type,
  p_title TEXT,
  p_message TEXT,
  p_metadata JSONB DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INTEGER := 0;
  v_user RECORD;
BEGIN
  -- Create notification for each user
  FOR v_user IN SELECT id FROM profiles WHERE role = 'user'
  LOOP
    INSERT INTO notifications (user_id, type, title, message, metadata)
    VALUES (v_user.id, p_type, p_title, p_message, p_metadata);
    v_count := v_count + 1;
  END LOOP;
  
  RETURN v_count;
END;
$$;

-- Trigger function for order notifications
CREATE FUNCTION notify_order_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_title TEXT;
  v_message TEXT;
  v_type notification_type;
BEGIN
  -- Only notify on status changes or new orders
  IF (TG_OP = 'INSERT') THEN
    v_type := 'order_created';
    v_title := 'Order Created';
    v_message := 'Your order has been created successfully and is being processed.';
  ELSIF (TG_OP = 'UPDATE' AND OLD.status != NEW.status) THEN
    CASE NEW.status
      WHEN 'completed' THEN
        v_type := 'order_completed';
        v_title := 'Order Completed';
        v_message := 'Your order has been completed successfully!';
      WHEN 'failed' THEN
        v_type := 'order_failed';
        v_title := 'Order Failed';
        v_message := 'Your order has failed. Please contact support if you need assistance.';
      WHEN 'rejected' THEN
        v_type := 'order_rejected';
        v_title := 'Order Rejected';
        v_message := 'Your order has been rejected. Your wallet balance has been refunded.';
      WHEN 'processing' THEN
        v_type := 'order_processing';
        v_title := 'Order Processing';
        v_message := 'Your order is now being processed.';
      ELSE
        RETURN NEW;
    END CASE;
  ELSE
    RETURN NEW;
  END IF;
  
  -- Create the notification
  INSERT INTO notifications (user_id, type, title, message, metadata)
  VALUES (
    NEW.user_id,
    v_type,
    v_title,
    v_message,
    jsonb_build_object(
      'order_id', NEW.id,
      'amount', NEW.amount,
      'status', NEW.status
    )
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for order notifications
DROP TRIGGER IF EXISTS trigger_order_notifications ON orders;
CREATE TRIGGER trigger_order_notifications
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_order_status_change();

-- Trigger function for payment notifications
CREATE FUNCTION notify_payment_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_title TEXT;
  v_message TEXT;
  v_type notification_type;
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.status != NEW.status) THEN
    CASE NEW.status
      WHEN 'approved' THEN
        v_type := 'payment_approved';
        v_title := 'Payment Approved';
        v_message := 'Your payment has been approved and added to your wallet.';
      WHEN 'rejected' THEN
        v_type := 'payment_rejected';
        v_title := 'Payment Rejected';
        v_message := 'Your payment has been rejected. Reason: ' || COALESCE(NEW.admin_notes, 'Not specified');
      ELSE
        RETURN NEW;
    END CASE;
    
    INSERT INTO notifications (user_id, type, title, message, metadata)
    VALUES (
      NEW.user_id,
      v_type,
      v_title,
      v_message,
      jsonb_build_object(
        'payment_id', NEW.id,
        'amount', NEW.amount,
        'currency', NEW.currency,
        'status', NEW.status
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for payment notifications
DROP TRIGGER IF EXISTS trigger_payment_notifications ON payment_proofs;
CREATE TRIGGER trigger_payment_notifications
  AFTER UPDATE ON payment_proofs
  FOR EACH ROW
  EXECUTE FUNCTION notify_payment_status_change();

-- Trigger function for wallet balance notifications
CREATE FUNCTION notify_balance_added()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.amount > 0 AND NEW.type = 'credit' THEN
    INSERT INTO notifications (user_id, type, title, message, metadata)
    VALUES (
      NEW.user_id,
      'balance_added',
      'Balance Added',
      'Your wallet has been credited with ' || NEW.amount || '.',
      jsonb_build_object(
        'transaction_id', NEW.id,
        'amount', NEW.amount,
        'description', NEW.description
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for wallet balance notifications
DROP TRIGGER IF EXISTS trigger_balance_notifications ON wallet_transactions;
CREATE TRIGGER trigger_balance_notifications
  AFTER INSERT ON wallet_transactions
  FOR EACH ROW
  EXECUTE FUNCTION notify_balance_added();

-- Trigger function for product/service notifications
CREATE FUNCTION notify_product_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_title TEXT;
  v_message TEXT;
  v_type notification_type;
BEGIN
  IF (TG_OP = 'INSERT') THEN
    v_type := 'service_added';
    v_title := 'New Service Available';
    v_message := 'New service "' || NEW.name || '" is now available!';
    
    PERFORM create_broadcast_notification(v_type, v_title, v_message, 
      jsonb_build_object('product_id', NEW.id, 'product_name', NEW.name)
    );
    
  ELSIF (TG_OP = 'UPDATE' AND OLD.is_active != NEW.is_active) THEN
    IF NEW.is_active THEN
      v_type := 'service_available';
      v_title := 'Service Now Available';
      v_message := 'Service "' || NEW.name || '" is now available again!';
    ELSE
      v_type := 'service_unavailable';
      v_title := 'Service Unavailable';
      v_message := 'Service "' || NEW.name || '" is temporarily unavailable.';
    END IF;
    
    PERFORM create_broadcast_notification(v_type, v_title, v_message,
      jsonb_build_object('product_id', NEW.id, 'product_name', NEW.name)
    );
    
  ELSIF (TG_OP = 'UPDATE' AND OLD.price != NEW.price) THEN
    IF NEW.price > OLD.price THEN
      v_type := 'price_increased';
      v_title := 'Price Update';
      v_message := 'Price for "' || NEW.name || '" has increased from ' || OLD.price || ' to ' || NEW.price;
    ELSE
      v_type := 'price_decreased';
      v_title := 'Price Drop!';
      v_message := 'Great news! Price for "' || NEW.name || '" has decreased from ' || OLD.price || ' to ' || NEW.price;
    END IF;
    
    PERFORM create_broadcast_notification(v_type, v_title, v_message,
      jsonb_build_object(
        'product_id', NEW.id,
        'product_name', NEW.name,
        'old_price', OLD.price,
        'new_price', NEW.price
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for product notifications
DROP TRIGGER IF EXISTS trigger_product_notifications ON products;
CREATE TRIGGER trigger_product_notifications
  AFTER INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION notify_product_changes();
