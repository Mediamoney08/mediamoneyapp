-- Providers table: Store API provider information
CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  api_endpoint TEXT NOT NULL,
  api_key TEXT,
  api_type TEXT NOT NULL DEFAULT 'rest',
  is_active BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User levels table: Define user tiers with benefits
CREATE TABLE IF NOT EXISTS user_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_percentage DECIMAL(5,2) DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  min_spent DECIMAL(10,2) DEFAULT 0,
  color TEXT DEFAULT '#gray',
  priority INTEGER DEFAULT 0,
  benefits JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Custom rates table: User-specific pricing overrides
CREATE TABLE IF NOT EXISTS custom_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  custom_price DECIMAL(10,2) NOT NULL CHECK (custom_price >= 0),
  discount_percentage DECIMAL(5,2),
  note TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Add fields to products table
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS provider_product_id TEXT,
  ADD COLUMN IF NOT EXISTS base_price DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS profit_margin DECIMAL(5,2) DEFAULT 10 CHECK (profit_margin >= 0),
  ADD COLUMN IF NOT EXISTS use_global_margin BOOLEAN DEFAULT true;

-- Add user_level_id to profiles table
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS user_level_id UUID REFERENCES user_levels(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS total_spent DECIMAL(10,2) DEFAULT 0;

-- Global settings table for profit margin
CREATE TABLE IF NOT EXISTS global_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default global profit margin
INSERT INTO global_settings (key, value, description)
VALUES ('global_profit_margin', '10', 'Default profit margin percentage for all products')
ON CONFLICT (key) DO NOTHING;

-- Insert default user levels
INSERT INTO user_levels (name, description, discount_percentage, min_spent, color, priority) VALUES
  ('Bronze', 'Entry level - No discount', 0, 0, '#CD7F32', 1),
  ('Silver', 'Silver level - 5% discount', 5, 100, '#C0C0C0', 2),
  ('Gold', 'Gold level - 10% discount', 10, 500, '#FFD700', 3),
  ('Platinum', 'Platinum level - 15% discount', 15, 1000, '#E5E4E2', 4),
  ('Diamond', 'Diamond level - 20% discount', 20, 5000, '#B9F2FF', 5)
ON CONFLICT (name) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_providers_active ON providers(is_active);
CREATE INDEX IF NOT EXISTS idx_user_levels_priority ON user_levels(priority DESC);
CREATE INDEX IF NOT EXISTS idx_custom_rates_user ON custom_rates(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_rates_product ON custom_rates(product_id);
CREATE INDEX IF NOT EXISTS idx_products_provider ON products(provider_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_level ON profiles(user_level_id);

-- RLS Policies
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage providers"
  ON providers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

ALTER TABLE user_levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active user levels"
  ON user_levels
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage user levels"
  ON user_levels
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

ALTER TABLE custom_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own custom rates"
  ON custom_rates
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all custom rates"
  ON custom_rates
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

ALTER TABLE global_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view global settings"
  ON global_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage global settings"
  ON global_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to calculate user's final price for a product
CREATE OR REPLACE FUNCTION calculate_user_price(
  p_user_id UUID,
  p_product_id UUID
)
RETURNS DECIMAL(10,2) AS $$
DECLARE
  v_base_price DECIMAL(10,2);
  v_profit_margin DECIMAL(5,2);
  v_use_global_margin BOOLEAN;
  v_global_margin DECIMAL(5,2);
  v_price_with_margin DECIMAL(10,2);
  v_custom_rate DECIMAL(10,2);
  v_user_level_discount DECIMAL(5,2);
  v_final_price DECIMAL(10,2);
BEGIN
  SELECT 
    COALESCE(base_price, price) as base,
    profit_margin,
    use_global_margin
  INTO v_base_price, v_profit_margin, v_use_global_margin
  FROM products
  WHERE id = p_product_id;

  IF v_use_global_margin THEN
    SELECT value::DECIMAL INTO v_global_margin
    FROM global_settings
    WHERE key = 'global_profit_margin';
    v_profit_margin := COALESCE(v_global_margin, 10);
  END IF;

  v_price_with_margin := v_base_price * (1 + v_profit_margin / 100);

  SELECT custom_price INTO v_custom_rate
  FROM custom_rates
  WHERE user_id = p_user_id
    AND product_id = p_product_id
    AND is_active = true;

  IF v_custom_rate IS NOT NULL THEN
    RETURN v_custom_rate;
  END IF;

  SELECT ul.discount_percentage INTO v_user_level_discount
  FROM profiles p
  JOIN user_levels ul ON p.user_level_id = ul.id
  WHERE p.id = p_user_id
    AND ul.is_active = true;

  IF v_user_level_discount IS NOT NULL AND v_user_level_discount > 0 THEN
    v_final_price := v_price_with_margin * (1 - v_user_level_discount / 100);
  ELSE
    v_final_price := v_price_with_margin;
  END IF;

  RETURN ROUND(v_final_price, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to auto-upgrade user level based on spending
CREATE OR REPLACE FUNCTION auto_upgrade_user_level()
RETURNS TRIGGER AS $$
DECLARE
  v_new_level_id UUID;
BEGIN
  SELECT id INTO v_new_level_id
  FROM user_levels
  WHERE min_spent <= NEW.total_spent
    AND is_active = true
  ORDER BY priority DESC
  LIMIT 1;

  IF v_new_level_id IS NOT NULL AND v_new_level_id != COALESCE(NEW.user_level_id, '00000000-0000-0000-0000-000000000000'::UUID) THEN
    NEW.user_level_id := v_new_level_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_upgrade_user_level ON profiles;
CREATE TRIGGER trigger_auto_upgrade_user_level
  BEFORE UPDATE OF total_spent ON profiles
  FOR EACH ROW
  WHEN (NEW.total_spent IS DISTINCT FROM OLD.total_spent)
  EXECUTE FUNCTION auto_upgrade_user_level();

-- Function to update total_spent when order is completed
CREATE OR REPLACE FUNCTION update_user_spending()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE profiles
    SET total_spent = COALESCE(total_spent, 0) + NEW.total_amount
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_user_spending ON orders;
CREATE TRIGGER trigger_update_user_spending
  AFTER UPDATE ON orders
  FOR EACH ROW
  WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
  EXECUTE FUNCTION update_user_spending();