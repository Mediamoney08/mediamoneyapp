-- Create banners table
CREATE TABLE public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  link_url TEXT,
  background_color TEXT DEFAULT '#3b82f6',
  text_color TEXT DEFAULT '#ffffff',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_banners_active ON public.banners(is_active);
CREATE INDEX idx_banners_order ON public.banners(display_order);

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active banners"
  ON public.banners FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all banners"
  ON public.banners FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert banners"
  ON public.banners FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update banners"
  ON public.banners FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete banners"
  ON public.banners FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

INSERT INTO public.banners (title, content, background_color, text_color, display_order, is_active) VALUES
  ('Welcome to Recharge Hub', '🎉 Get 10% bonus on your first recharge! Use code: WELCOME10', '#8b5cf6', '#ffffff', 1, true),
  ('New Games Added', '🎮 PUBG Mobile, Free Fire, and Mobile Legends now available!', '#3b82f6', '#ffffff', 2, true),
  ('24/7 Support', '💬 Need help? Our support team is available 24/7 via ticket system', '#10b981', '#ffffff', 3, true);

CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type notification_type,
  p_title TEXT,
  p_message TEXT,
  p_data JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, metadata)
  VALUES (p_user_id, p_type, p_title, p_message, p_data)
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION notify_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.status != NEW.status) THEN
    IF NEW.status = 'completed' THEN
      PERFORM create_notification(
        NEW.user_id,
        'order_completed',
        'Order Completed',
        'Your order #' || SUBSTRING(NEW.id::TEXT, 1, 8) || ' has been completed successfully!',
        jsonb_build_object('order_id', NEW.id, 'amount', NEW.total_amount)
      );
    ELSIF NEW.status = 'cancelled' THEN
      PERFORM create_notification(
        NEW.user_id,
        'order_canceled',
        'Order Canceled',
        'Your order #' || SUBSTRING(NEW.id::TEXT, 1, 8) || ' has been canceled.',
        jsonb_build_object('order_id', NEW.id, 'amount', NEW.total_amount)
      );
    ELSIF NEW.status = 'refunded' THEN
      PERFORM create_notification(
        NEW.user_id,
        'order_refunded',
        'Order Refunded',
        'Your order #' || SUBSTRING(NEW.id::TEXT, 1, 8) || ' has been refunded. Amount credited to your wallet.',
        jsonb_build_object('order_id', NEW.id, 'amount', NEW.total_amount)
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_notify_order_status ON public.orders;
CREATE TRIGGER trigger_notify_order_status
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_order_status_change();

CREATE OR REPLACE FUNCTION notify_payment_proof_status()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.status != NEW.status) THEN
    IF NEW.status = 'approved' THEN
      PERFORM create_notification(
        NEW.user_id,
        'payment_approved',
        'Payment Approved',
        'Your payment of $' || NEW.amount || ' has been approved and credited to your wallet!',
        jsonb_build_object('payment_proof_id', NEW.id, 'amount', NEW.amount)
      );
    ELSIF NEW.status = 'rejected' THEN
      PERFORM create_notification(
        NEW.user_id,
        'payment_rejected',
        'Payment Rejected',
        'Your payment submission has been rejected. Please check admin notes and try again.',
        jsonb_build_object('payment_proof_id', NEW.id, 'amount', NEW.amount, 'admin_notes', NEW.admin_notes)
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_notify_payment_proof ON public.payment_proofs;
CREATE TRIGGER trigger_notify_payment_proof
  AFTER UPDATE ON public.payment_proofs
  FOR EACH ROW
  EXECUTE FUNCTION notify_payment_proof_status();