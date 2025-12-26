-- Create API usage tracking table
CREATE TABLE IF NOT EXISTS api_usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE NOT NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER,
  response_time INTEGER,
  ip_address TEXT,
  user_agent TEXT,
  request_body JSONB,
  response_body JSONB,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create API rate limiting table
CREATE TABLE IF NOT EXISTS api_rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE NOT NULL UNIQUE,
  requests_per_minute INTEGER DEFAULT 60,
  requests_per_hour INTEGER DEFAULT 1000,
  requests_per_day INTEGER DEFAULT 10000,
  current_minute_count INTEGER DEFAULT 0,
  current_hour_count INTEGER DEFAULT 0,
  current_day_count INTEGER DEFAULT 0,
  minute_reset_at TIMESTAMP DEFAULT NOW(),
  hour_reset_at TIMESTAMP DEFAULT NOW(),
  day_reset_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create webhooks table
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL,
  secret TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create webhook logs table
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  webhook_id UUID REFERENCES webhooks(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status_code INTEGER,
  response_body TEXT,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create API endpoints documentation table
CREATE TABLE IF NOT EXISTS api_endpoints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  endpoint TEXT NOT NULL UNIQUE,
  method TEXT NOT NULL,
  description TEXT,
  request_schema JSONB,
  response_schema JSONB,
  requires_auth BOOLEAN DEFAULT true,
  rate_limit INTEGER DEFAULT 60,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_api_key_id ON api_usage_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_created_at ON api_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_api_key_id ON api_rate_limits(api_key_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_user_id ON webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_is_active ON webhooks(is_active);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_webhook_id ON webhook_logs(webhook_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON webhook_logs(created_at);

-- Enable RLS
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_endpoints ENABLE ROW LEVEL SECURITY;

-- RLS Policies for API usage logs (users can view their own, admins can view all)
CREATE POLICY "Users can view own API usage" ON api_usage_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM api_keys WHERE api_keys.id = api_usage_logs.api_key_id AND api_keys.created_by = auth.uid())
);
CREATE POLICY "Admins can view all API usage" ON api_usage_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "System can insert API usage logs" ON api_usage_logs FOR INSERT WITH CHECK (true);

-- RLS Policies for API rate limits
CREATE POLICY "Users can view own rate limits" ON api_rate_limits FOR SELECT USING (
  EXISTS (SELECT 1 FROM api_keys WHERE api_keys.id = api_rate_limits.api_key_id AND api_keys.created_by = auth.uid())
);
CREATE POLICY "Admins can manage rate limits" ON api_rate_limits FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for webhooks
CREATE POLICY "Users can view own webhooks" ON webhooks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own webhooks" ON webhooks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all webhooks" ON webhooks FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for webhook logs
CREATE POLICY "Users can view own webhook logs" ON webhook_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM webhooks WHERE webhooks.id = webhook_logs.webhook_id AND webhooks.user_id = auth.uid())
);
CREATE POLICY "Admins can view all webhook logs" ON webhook_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "System can insert webhook logs" ON webhook_logs FOR INSERT WITH CHECK (true);

-- RLS Policies for API endpoints (public read, admin write)
CREATE POLICY "Anyone can view active API endpoints" ON api_endpoints FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage API endpoints" ON api_endpoints FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Function to generate API key
CREATE OR REPLACE FUNCTION generate_api_key()
RETURNS TEXT AS $$
DECLARE
  key TEXT;
BEGIN
  key := 'rh_' || encode(gen_random_bytes(32), 'hex');
  RETURN key;
END;
$$ LANGUAGE plpgsql;

-- Function to generate API secret
CREATE OR REPLACE FUNCTION generate_api_secret()
RETURNS TEXT AS $$
DECLARE
  secret TEXT;
BEGIN
  secret := encode(gen_random_bytes(48), 'hex');
  RETURN secret;
END;
$$ LANGUAGE plpgsql;

-- Function to check rate limit
CREATE OR REPLACE FUNCTION check_rate_limit(p_api_key_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_rate_limit RECORD;
  v_now TIMESTAMP := NOW();
BEGIN
  SELECT * INTO v_rate_limit FROM api_rate_limits WHERE api_key_id = p_api_key_id;
  
  IF NOT FOUND THEN
    -- Create default rate limit
    INSERT INTO api_rate_limits (api_key_id) VALUES (p_api_key_id);
    RETURN true;
  END IF;
  
  -- Reset counters if time windows have passed
  IF v_now > v_rate_limit.minute_reset_at THEN
    UPDATE api_rate_limits 
    SET current_minute_count = 0, minute_reset_at = v_now + INTERVAL '1 minute'
    WHERE api_key_id = p_api_key_id;
    v_rate_limit.current_minute_count := 0;
  END IF;
  
  IF v_now > v_rate_limit.hour_reset_at THEN
    UPDATE api_rate_limits 
    SET current_hour_count = 0, hour_reset_at = v_now + INTERVAL '1 hour'
    WHERE api_key_id = p_api_key_id;
    v_rate_limit.current_hour_count := 0;
  END IF;
  
  IF v_now > v_rate_limit.day_reset_at THEN
    UPDATE api_rate_limits 
    SET current_day_count = 0, day_reset_at = v_now + INTERVAL '1 day'
    WHERE api_key_id = p_api_key_id;
    v_rate_limit.current_day_count := 0;
  END IF;
  
  -- Check if limits are exceeded
  IF v_rate_limit.current_minute_count >= v_rate_limit.requests_per_minute THEN
    RETURN false;
  END IF;
  
  IF v_rate_limit.current_hour_count >= v_rate_limit.requests_per_hour THEN
    RETURN false;
  END IF;
  
  IF v_rate_limit.current_day_count >= v_rate_limit.requests_per_day THEN
    RETURN false;
  END IF;
  
  -- Increment counters
  UPDATE api_rate_limits 
  SET 
    current_minute_count = current_minute_count + 1,
    current_hour_count = current_hour_count + 1,
    current_day_count = current_day_count + 1
  WHERE api_key_id = p_api_key_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;