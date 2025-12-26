-- Create rate limiting table for security operations
CREATE TABLE IF NOT EXISTS security_rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT,
  operation_type TEXT NOT NULL,
  attempt_count INTEGER DEFAULT 1,
  window_start TIMESTAMP DEFAULT NOW(),
  blocked_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, operation_type, window_start)
);

-- Create index for rate limiting
CREATE INDEX IF NOT EXISTS idx_security_rate_limits_user_op ON security_rate_limits(user_id, operation_type);
CREATE INDEX IF NOT EXISTS idx_security_rate_limits_ip_op ON security_rate_limits(ip_address, operation_type);
CREATE INDEX IF NOT EXISTS idx_security_rate_limits_window ON security_rate_limits(window_start);

-- Enable RLS
ALTER TABLE security_rate_limits ENABLE ROW LEVEL SECURITY;

-- RLS Policy for rate limits (system only)
CREATE POLICY "System can manage rate limits" ON security_rate_limits FOR ALL WITH CHECK (true);

-- Function to check rate limit
CREATE OR REPLACE FUNCTION check_security_rate_limit(
  p_user_id UUID,
  p_ip_address TEXT,
  p_operation_type TEXT,
  p_max_attempts INTEGER DEFAULT 5,
  p_window_minutes INTEGER DEFAULT 15
)
RETURNS BOOLEAN AS $$
DECLARE
  v_attempt_count INTEGER;
  v_blocked_until TIMESTAMP;
  v_window_start TIMESTAMP;
BEGIN
  v_window_start := NOW() - (p_window_minutes || ' minutes')::INTERVAL;
  
  -- Check if user is currently blocked
  SELECT blocked_until INTO v_blocked_until
  FROM security_rate_limits
  WHERE user_id = p_user_id
    AND operation_type = p_operation_type
    AND blocked_until > NOW()
  ORDER BY blocked_until DESC
  LIMIT 1;
  
  IF v_blocked_until IS NOT NULL THEN
    RETURN false;
  END IF;
  
  -- Get attempt count in current window
  SELECT COALESCE(SUM(attempt_count), 0) INTO v_attempt_count
  FROM security_rate_limits
  WHERE user_id = p_user_id
    AND operation_type = p_operation_type
    AND window_start > v_window_start;
  
  -- If exceeded, block user
  IF v_attempt_count >= p_max_attempts THEN
    INSERT INTO security_rate_limits (user_id, ip_address, operation_type, attempt_count, blocked_until)
    VALUES (p_user_id, p_ip_address, p_operation_type, 1, NOW() + (p_window_minutes || ' minutes')::INTERVAL);
    RETURN false;
  END IF;
  
  -- Record attempt
  INSERT INTO security_rate_limits (user_id, ip_address, operation_type, attempt_count)
  VALUES (p_user_id, p_ip_address, p_operation_type, 1)
  ON CONFLICT (user_id, operation_type, window_start) 
  DO UPDATE SET attempt_count = security_rate_limits.attempt_count + 1;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify backup code
CREATE OR REPLACE FUNCTION verify_backup_code(
  p_user_id UUID,
  p_code TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_stored_codes TEXT[];
  v_code_hash TEXT;
  v_code_exists BOOLEAN;
BEGIN
  -- Hash the provided code
  v_code_hash := encode(digest(p_code, 'sha256'), 'hex');
  
  -- Get stored backup codes
  SELECT backup_codes INTO v_stored_codes
  FROM two_factor_auth
  WHERE user_id = p_user_id
    AND is_enabled = true;
  
  IF v_stored_codes IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if code exists
  v_code_exists := v_code_hash = ANY(v_stored_codes);
  
  IF v_code_exists THEN
    -- Remove used code
    UPDATE two_factor_auth
    SET backup_codes = array_remove(backup_codes, v_code_hash),
        last_used_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Log usage
    PERFORM log_security_event(
      p_user_id,
      'backup_code_used',
      'Backup code used for authentication',
      NULL
    );
    
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add password history table
CREATE TABLE IF NOT EXISTS password_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_password_history_user_id ON password_history(user_id);
CREATE INDEX IF NOT EXISTS idx_password_history_created_at ON password_history(created_at);

-- Enable RLS
ALTER TABLE password_history ENABLE ROW LEVEL SECURITY;

-- RLS Policy (system only)
CREATE POLICY "System can manage password history" ON password_history FOR ALL WITH CHECK (true);

-- Function to add password to history
CREATE OR REPLACE FUNCTION add_password_to_history()
RETURNS TRIGGER AS $$
BEGIN
  -- Store password hash in history
  INSERT INTO password_history (user_id, password_hash)
  VALUES (NEW.id, NEW.encrypted_password);
  
  -- Keep only last 5 passwords
  DELETE FROM password_history
  WHERE user_id = NEW.id
    AND id NOT IN (
      SELECT id FROM password_history
      WHERE user_id = NEW.id
      ORDER BY created_at DESC
      LIMIT 5
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for password history (if auth.users table is accessible)
-- Note: This may not work with Supabase Auth, but included for completeness

-- Add session tracking table
CREATE TABLE IF NOT EXISTS active_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_token TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  last_activity TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_active_sessions_user_id ON active_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_active_sessions_token ON active_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_active_sessions_expires ON active_sessions(expires_at);

-- Enable RLS
ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sessions
CREATE POLICY "Users can view own sessions" ON active_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sessions" ON active_sessions FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "System can manage sessions" ON active_sessions FOR ALL WITH CHECK (true);

-- Function to clean expired sessions
CREATE OR REPLACE FUNCTION clean_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM active_sessions WHERE expires_at < NOW();
  DELETE FROM security_rate_limits WHERE window_start < NOW() - INTERVAL '24 hours';
  DELETE FROM password_reset_tokens WHERE expires_at < NOW();
  DELETE FROM email_change_requests WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add input validation function
CREATE OR REPLACE FUNCTION validate_email(p_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN p_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add username validation function
CREATE OR REPLACE FUNCTION validate_username(p_username TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Username must be 3-30 characters, alphanumeric and underscores only
  RETURN p_username ~* '^[A-Za-z0-9_]{3,30}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update profiles table with validation
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_username_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_username_check 
  CHECK (validate_username(username));

-- Add constraint for email format (if not already exists)
-- Note: Supabase Auth handles email validation, but we add it for profiles table
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_email_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_email_check 
  CHECK (email IS NULL OR validate_email(email));

-- Create function to log login attempt with rate limiting
CREATE OR REPLACE FUNCTION log_login_with_rate_limit(
  p_user_id UUID,
  p_ip_address TEXT,
  p_user_agent TEXT,
  p_success BOOLEAN,
  p_failure_reason TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_login_id UUID;
  v_rate_limit_ok BOOLEAN;
  v_failed_attempts INTEGER;
BEGIN
  -- Log the attempt
  INSERT INTO login_history (user_id, ip_address, user_agent, success, failure_reason)
  VALUES (p_user_id, p_ip_address, p_user_agent, p_success, p_failure_reason)
  RETURNING id INTO v_login_id;
  
  -- If failed, check rate limit
  IF NOT p_success THEN
    -- Count recent failed attempts
    SELECT COUNT(*) INTO v_failed_attempts
    FROM login_history
    WHERE user_id = p_user_id
      AND success = false
      AND created_at > NOW() - INTERVAL '15 minutes';
    
    -- Check rate limit
    v_rate_limit_ok := check_security_rate_limit(
      p_user_id,
      p_ip_address,
      'login_attempt',
      5,
      15
    );
    
    IF NOT v_rate_limit_ok THEN
      -- Log security event
      PERFORM log_security_event(
        p_user_id,
        'account_locked',
        'Account temporarily locked due to multiple failed login attempts',
        p_ip_address
      );
      
      RETURN jsonb_build_object(
        'success', false,
        'locked', true,
        'message', 'Account temporarily locked due to multiple failed attempts'
      );
    END IF;
    
    IF v_failed_attempts >= 3 THEN
      RETURN jsonb_build_object(
        'success', false,
        'locked', false,
        'warning', true,
        'message', 'Multiple failed attempts detected. Account will be locked after 5 attempts.'
      );
    END IF;
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'login_id', v_login_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;