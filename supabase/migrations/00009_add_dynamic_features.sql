-- Create product_fields table for dynamic custom fields
CREATE TABLE IF NOT EXISTS product_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  field_value TEXT NOT NULL,
  field_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_product_fields_product_id ON product_fields(product_id);

-- Create site_settings table for logo and other site configurations
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  setting_type TEXT DEFAULT 'text',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default logo setting
INSERT INTO site_settings (setting_key, setting_value, setting_type)
VALUES ('site_logo', 'https://via.placeholder.com/150x50?text=MediaMoney', 'image')
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO site_settings (setting_key, setting_value, setting_type)
VALUES ('site_logo_type', 'image', 'text')
ON CONFLICT (setting_key) DO NOTHING;

-- Create ads/banners table
CREATE TABLE IF NOT EXISTS site_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  media_url TEXT NOT NULL,
  media_type TEXT DEFAULT 'image',
  link_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for active banners
CREATE INDEX IF NOT EXISTS idx_site_banners_active ON site_banners(is_active, display_order);

-- Insert sample banners
INSERT INTO site_banners (title, media_url, media_type, display_order, is_active)
VALUES 
  ('Welcome Banner', 'https://via.placeholder.com/1200x100?text=Welcome+to+MediaMoney', 'image', 1, true),
  ('Special Offer', 'https://via.placeholder.com/1200x100?text=Special+Offers+Available', 'image', 2, true)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE product_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_banners ENABLE ROW LEVEL SECURITY;

-- RLS Policies for product_fields
CREATE POLICY "Anyone can view product fields"
  ON product_fields FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage product fields"
  ON product_fields FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for site_settings
CREATE POLICY "Anyone can view site settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage site settings"
  ON site_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for site_banners
CREATE POLICY "Anyone can view active banners"
  ON site_banners FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all banners"
  ON site_banners FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage banners"
  ON site_banners FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );