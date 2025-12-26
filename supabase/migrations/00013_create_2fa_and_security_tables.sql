-- Create 2FA secrets table
CREATE TABLE IF NOT EXISTS two_factor_auth (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  secret TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT false,
  backup_codes TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  enabled_at TIMESTAMP,
  last_used_at TIMESTAMP
);

-- Create login history table
CREATE TABLE IF NOT EXISTS login_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  location TEXT,
  device_type TEXT,
  success BOOLEAN DEFAULT true,
  failure_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create security events table
CREATE TABLE IF NOT EXISTS security_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  description TEXT,
  ip_address TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create email change requests table
CREATE TABLE IF NOT EXISTS email_change_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  old_email TEXT NOT NULL,
  new_email TEXT NOT NULL,
  verification_token TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending',
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  verified_at TIMESTAMP
);

-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  used_at TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_two_factor_auth_user_id ON two_factor_auth(user_id);
CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_login_history_created_at ON login_history(created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);
CREATE INDEX IF NOT EXISTS idx_email_change_requests_user_id ON email_change_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_email_change_requests_token ON email_change_requests(verification_token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);

-- Enable RLS
ALTER TABLE two_factor_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for two_factor_auth
CREATE POLICY "Users can view own 2FA settings" ON two_factor_auth FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own 2FA settings" ON two_factor_auth FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all 2FA settings" ON two_factor_auth FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for login_history
CREATE POLICY "Users can view own login history" ON login_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert login history" ON login_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all login history" ON login_history FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for security_events
CREATE POLICY "Users can view own security events" ON security_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert security events" ON security_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all security events" ON security_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for email_change_requests
CREATE POLICY "Users can view own email change requests" ON email_change_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own email change requests" ON email_change_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own email change requests" ON email_change_requests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all email change requests" ON email_change_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for password_reset_tokens
CREATE POLICY "Users can view own password reset tokens" ON password_reset_tokens FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage password reset tokens" ON password_reset_tokens FOR ALL WITH CHECK (true);

-- Function to generate backup codes
CREATE OR REPLACE FUNCTION generate_backup_codes()
RETURNS TEXT[] AS $$
DECLARE
  codes TEXT[];
  i INTEGER;
BEGIN
  codes := ARRAY[]::TEXT[];
  FOR i IN 1..10 LOOP
    codes := array_append(codes, upper(substring(md5(random()::text) from 1 for 8)));
  END LOOP;
  RETURN codes;
END;
$$ LANGUAGE plpgsql;

-- Function to log security event
CREATE OR REPLACE FUNCTION log_security_event(
  p_user_id UUID,
  p_event_type TEXT,
  p_description TEXT,
  p_ip_address TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  v_event_id UUID;
BEGIN
  INSERT INTO security_events (user_id, event_type, description, ip_address, metadata)
  VALUES (p_user_id, p_event_type, p_description, p_ip_address, p_metadata)
  RETURNING id INTO v_event_id;
  
  RETURN v_event_id;
END;
$$ LANGUAGE plpgsql;

-- Function to log login attempt
CREATE OR REPLACE FUNCTION log_login_attempt(
  p_user_id UUID,
  p_ip_address TEXT,
  p_user_agent TEXT,
  p_success BOOLEAN,
  p_failure_reason TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_login_id UUID;
BEGIN
  INSERT INTO login_history (user_id, ip_address, user_agent, success, failure_reason)
  VALUES (p_user_id, p_ip_address, p_user_agent, p_success, p_failure_reason)
  RETURNING id INTO v_login_id;
  
  RETURN v_login_id;
END;
$$ LANGUAGE plpgsql;