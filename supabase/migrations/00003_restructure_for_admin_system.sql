
-- Add service_name to products (e.g., "Global", "Prime", "Prime Plus")
ALTER TABLE products ADD COLUMN IF NOT EXISTS service_name TEXT;

-- Remove subcategory_id (not needed in new structure)
ALTER TABLE products DROP COLUMN IF EXISTS subcategory_id;

-- Update categories table to ensure image_url exists
ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create admin_settings table for site configuration
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on admin_settings
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Admin can manage settings
CREATE POLICY "Admins can manage settings"
ON admin_settings FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Everyone can read settings
CREATE POLICY "Everyone can read settings"
ON admin_settings FOR SELECT
USING (true);

-- Insert default site settings
INSERT INTO admin_settings (key, value) VALUES
  ('site_name', '"Recharge Hub"'::jsonb),
  ('site_description', '"Your one-stop destination for game top-ups, streaming subscriptions, and digital gift cards"'::jsonb),
  ('contact_phone', '"+961 81 330 930"'::jsonb),
  ('contact_phone_2', '"+961 70 388 557"'::jsonb),
  ('contact_email', '"support@rechargehub.com"'::jsonb),
  ('currency', '"USD"'::jsonb),
  ('currency_symbol', '"$"'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Update existing products with service names based on their names
UPDATE products 
SET service_name = CASE
  WHEN name LIKE '%Global%' THEN 'Global'
  WHEN name LIKE '%Prime%' THEN 'Prime'
  WHEN name LIKE '%Premium%' THEN 'Premium'
  WHEN name LIKE '%Basic%' THEN 'Basic'
  WHEN name LIKE '%Standard%' THEN 'Standard'
  ELSE 'Standard'
END
WHERE service_name IS NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_service_name ON products(service_name);
CREATE INDEX IF NOT EXISTS idx_categories_service_type ON categories(service_type);

SELECT 'Migration completed successfully' as status;
