-- Create currencies table
CREATE TABLE IF NOT EXISTS currencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  exchange_rate DECIMAL(10, 6) DEFAULT 1.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create exchange rates history table
CREATE TABLE IF NOT EXISTS exchange_rates_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  currency_code TEXT NOT NULL,
  rate DECIMAL(10, 6) NOT NULL,
  source TEXT DEFAULT 'manual',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create user preferences table for language and currency
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  language TEXT DEFAULT 'en',
  currency TEXT DEFAULT 'USD',
  timezone TEXT DEFAULT 'UTC',
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default currencies
INSERT INTO currencies (code, name, symbol, exchange_rate, is_active) VALUES
  ('USD', 'US Dollar', '$', 1.0, true),
  ('EUR', 'Euro', '€', 0.92, true),
  ('GBP', 'British Pound', '£', 0.79, true),
  ('JPY', 'Japanese Yen', '¥', 149.50, true),
  ('CNY', 'Chinese Yuan', '¥', 7.24, true),
  ('AUD', 'Australian Dollar', 'A$', 1.52, true),
  ('CAD', 'Canadian Dollar', 'C$', 1.35, true),
  ('CHF', 'Swiss Franc', 'CHF', 0.88, true),
  ('INR', 'Indian Rupee', '₹', 83.12, true),
  ('KRW', 'South Korean Won', '₩', 1320.50, true),
  ('BRL', 'Brazilian Real', 'R$', 4.97, true),
  ('RUB', 'Russian Ruble', '₽', 92.50, true),
  ('MXN', 'Mexican Peso', '$', 17.15, true),
  ('SAR', 'Saudi Riyal', '﷼', 3.75, true),
  ('AED', 'UAE Dirham', 'د.إ', 3.67, true),
  ('TRY', 'Turkish Lira', '₺', 32.15, true),
  ('SGD', 'Singapore Dollar', 'S$', 1.34, true),
  ('HKD', 'Hong Kong Dollar', 'HK$', 7.82, true),
  ('SEK', 'Swedish Krona', 'kr', 10.35, true),
  ('NOK', 'Norwegian Krone', 'kr', 10.75, true)
ON CONFLICT (code) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_currencies_code ON currencies(code);
CREATE INDEX IF NOT EXISTS idx_currencies_active ON currencies(is_active);
CREATE INDEX IF NOT EXISTS idx_exchange_rates_history_currency ON exchange_rates_history(currency_code);
CREATE INDEX IF NOT EXISTS idx_exchange_rates_history_created ON exchange_rates_history(created_at);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Enable RLS
ALTER TABLE currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_rates_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for currencies (public read)
CREATE POLICY "Anyone can view active currencies" ON currencies FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage currencies" ON currencies FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for exchange_rates_history (public read)
CREATE POLICY "Anyone can view exchange rates history" ON exchange_rates_history FOR SELECT USING (true);
CREATE POLICY "Admins can manage exchange rates" ON exchange_rates_history FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for user_preferences
CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all preferences" ON user_preferences FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Function to convert currency
CREATE OR REPLACE FUNCTION convert_currency(
  p_amount DECIMAL,
  p_from_currency TEXT,
  p_to_currency TEXT
)
RETURNS DECIMAL AS $$
DECLARE
  v_from_rate DECIMAL;
  v_to_rate DECIMAL;
  v_result DECIMAL;
BEGIN
  -- Get exchange rates
  SELECT exchange_rate INTO v_from_rate FROM currencies WHERE code = p_from_currency AND is_active = true;
  SELECT exchange_rate INTO v_to_rate FROM currencies WHERE code = p_to_currency AND is_active = true;
  
  IF v_from_rate IS NULL OR v_to_rate IS NULL THEN
    RAISE EXCEPTION 'Invalid currency code';
  END IF;
  
  -- Convert to USD first, then to target currency
  v_result := (p_amount / v_from_rate) * v_to_rate;
  
  RETURN ROUND(v_result, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get user's preferred currency
CREATE OR REPLACE FUNCTION get_user_currency(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_currency TEXT;
BEGIN
  SELECT currency INTO v_currency FROM user_preferences WHERE user_id = p_user_id;
  RETURN COALESCE(v_currency, 'USD');
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get user's preferred language
CREATE OR REPLACE FUNCTION get_user_language(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_language TEXT;
BEGIN
  SELECT language INTO v_language FROM user_preferences WHERE user_id = p_user_id;
  RETURN COALESCE(v_language, 'en');
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to update exchange rates
CREATE OR REPLACE FUNCTION update_exchange_rate(
  p_currency_code TEXT,
  p_new_rate DECIMAL,
  p_source TEXT DEFAULT 'manual'
)
RETURNS void AS $$
BEGIN
  -- Update currency table
  UPDATE currencies 
  SET exchange_rate = p_new_rate, updated_at = NOW()
  WHERE code = p_currency_code;
  
  -- Log to history
  INSERT INTO exchange_rates_history (currency_code, rate, source)
  VALUES (p_currency_code, p_new_rate, p_source);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create default preferences on user creation
CREATE OR REPLACE FUNCTION create_default_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_preferences (user_id, language, currency)
  VALUES (NEW.id, 'en', 'USD')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_create_user_preferences
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_user_preferences();

-- Update profiles table to support currency
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_currency TEXT DEFAULT 'USD';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en';

-- Function to format currency
CREATE OR REPLACE FUNCTION format_currency(
  p_amount DECIMAL,
  p_currency_code TEXT
)
RETURNS TEXT AS $$
DECLARE
  v_symbol TEXT;
  v_formatted TEXT;
BEGIN
  SELECT symbol INTO v_symbol FROM currencies WHERE code = p_currency_code;
  
  IF v_symbol IS NULL THEN
    v_symbol := p_currency_code;
  END IF;
  
  v_formatted := v_symbol || ' ' || TO_CHAR(p_amount, 'FM999,999,999.00');
  
  RETURN v_formatted;
END;
$$ LANGUAGE plpgsql IMMUTABLE;