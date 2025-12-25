# Security Best Practices Guide

## For Developers Working on Recharge Hub

This document outlines security best practices that must be followed when developing or maintaining the Recharge Hub application.

---

## 1. Authentication & Authorization

### ✅ DO:
- Always use Supabase Auth for authentication
- Validate user permissions before sensitive operations
- Use RLS policies for database access control
- Implement proper session management
- Log out users after inactivity

### ❌ DON'T:
- Store passwords in plaintext
- Implement custom authentication without security review
- Skip permission checks
- Store auth tokens in localStorage (use Supabase client)
- Trust client-side validation alone

### Example:
```typescript
// ✅ GOOD: Using Supabase Auth
const { error } = await supabase.auth.signInWithPassword({
  email,
  password,
});

// ❌ BAD: Custom auth without proper security
const user = users.find(u => u.password === password);
```

---

## 2. Database Security

### ✅ DO:
- Always use parameterized queries (Supabase client)
- Enable RLS on all tables
- Use `.maybeSingle()` instead of `.single()` to avoid errors
- Validate all input data
- Use TypeScript for type safety

### ❌ DON'T:
- Execute raw SQL from user input
- Disable RLS without security review
- Trust user-provided IDs without validation
- Expose sensitive data in queries

### Example:
```typescript
// ✅ GOOD: Parameterized query with RLS
const { data } = await supabase
  .from('orders')
  .select('*')
  .eq('user_id', userId)
  .maybeSingle();

// ❌ BAD: Raw SQL with user input
const query = `SELECT * FROM orders WHERE id = ${orderId}`;
```

---

## 3. API Security

### ✅ DO:
- Validate API keys before processing requests
- Check permissions for each operation
- Rate limit API endpoints
- Log all API access for audit trails
- Use HTTPS for all communications
- Validate and sanitize all input

### ❌ DON'T:
- Expose service role keys in client code
- Skip API key validation
- Return detailed error messages to clients
- Allow unlimited API requests

### Example:
```typescript
// ✅ GOOD: API key validation
const { data: keyData } = await supabase
  .from('api_keys')
  .select('*')
  .eq('key', apiKey)
  .eq('status', 'active')
  .single();

if (!keyData) {
  return fail('Invalid API key', 401);
}

// Check permissions
if (!keyData.permissions.orders_read) {
  return fail('Permission denied', 403);
}
```

---

## 4. Frontend Security

### ✅ DO:
- Sanitize all user input
- Use React's built-in XSS protection
- Validate forms on both client and server
- Use TypeScript for type safety
- Implement proper error handling

### ❌ DON'T:
- Use `dangerouslySetInnerHTML` with user content
- Trust client-side validation alone
- Expose sensitive data in client code
- Store secrets in frontend code

### Example:
```typescript
// ✅ GOOD: React auto-escapes content
<div>{userInput}</div>

// ❌ BAD: Dangerous HTML injection
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ GOOD: Validate input
if (!/^[a-zA-Z0-9_]+$/.test(username)) {
  return toast({ title: 'Invalid username format' });
}
```

---

## 5. Environment Variables

### ✅ DO:
- Use `.env` files for configuration
- Add `.env` to `.gitignore`
- Use `import.meta.env` for Vite projects
- Document required environment variables
- Use different keys for dev/staging/production

### ❌ DON'T:
- Commit `.env` files to git
- Hardcode API keys or secrets
- Share production credentials
- Use production keys in development

### Example:
```typescript
// ✅ GOOD: Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ❌ BAD: Hardcoded credentials
const supabaseUrl = 'https://example.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

---

## 6. Password Security

### ✅ DO:
- Enforce strong password requirements (8+ chars, mixed case, numbers)
- Use Supabase Auth for password hashing
- Implement password confirmation
- Validate password strength on client and server
- Allow password reset functionality

### ❌ DON'T:
- Store passwords in plaintext
- Use weak password requirements
- Skip password confirmation
- Log passwords in error messages

### Password Requirements:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Optional: Special characters

### Example:
```typescript
// ✅ GOOD: Strong password validation
if (password.length < 8) {
  return toast({ title: 'Password must be at least 8 characters' });
}

const hasUpperCase = /[A-Z]/.test(password);
const hasLowerCase = /[a-z]/.test(password);
const hasNumber = /[0-9]/.test(password);

if (!hasUpperCase || !hasLowerCase || !hasNumber) {
  return toast({ title: 'Password must contain uppercase, lowercase, and numbers' });
}
```

---

## 7. File Upload Security

### ✅ DO:
- Validate file types before upload
- Limit file sizes (e.g., 1MB for images)
- Use Supabase Storage with proper policies
- Scan uploaded files for malware (if possible)
- Generate unique filenames

### ❌ DON'T:
- Allow unlimited file sizes
- Trust client-provided file types
- Store files without validation
- Allow executable file uploads

### Example:
```typescript
// ✅ GOOD: File validation
const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

if (file.size > MAX_FILE_SIZE) {
  return toast({ title: 'File too large (max 1MB)' });
}

if (!ALLOWED_TYPES.includes(file.type)) {
  return toast({ title: 'Invalid file type' });
}
```

---

## 8. Error Handling

### ✅ DO:
- Log errors for debugging
- Show user-friendly error messages
- Handle all promise rejections
- Use try-catch blocks
- Implement error boundaries in React

### ❌ DON'T:
- Expose stack traces to users
- Log sensitive data in errors
- Ignore errors silently
- Show technical details to users

### Example:
```typescript
// ✅ GOOD: Proper error handling
try {
  const { data, error } = await supabase.from('orders').select('*');
  if (error) throw error;
  return data;
} catch (error) {
  console.error('Database error:', error);
  toast({ title: 'Failed to load orders', variant: 'destructive' });
  return [];
}

// ❌ BAD: Exposing error details
catch (error) {
  alert(`Error: ${error.message}\n${error.stack}`);
}
```

---

## 9. Data Validation

### ✅ DO:
- Validate all user input
- Use TypeScript types
- Implement server-side validation
- Sanitize data before storage
- Use schema validation (e.g., Zod)

### ❌ DON'T:
- Trust client-side validation alone
- Skip input validation
- Allow arbitrary data formats
- Store unsanitized user input

### Example:
```typescript
// ✅ GOOD: Input validation
const validateUsername = (username: string): boolean => {
  if (username.length < 3 || username.length > 20) return false;
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return false;
  return true;
};

if (!validateUsername(username)) {
  return toast({ title: 'Invalid username format' });
}
```

---

## 10. API Keys & Secrets

### ✅ DO:
- Store API keys in database with RLS
- Use environment variables for secrets
- Rotate keys regularly
- Track API key usage
- Implement key expiration

### ❌ DON'T:
- Hardcode API keys in code
- Share API keys publicly
- Use the same key for all environments
- Store keys in version control

### Example:
```typescript
// ✅ GOOD: API key from database
const { data: keyData } = await supabase
  .from('api_keys')
  .select('*')
  .eq('key', apiKey)
  .eq('status', 'active')
  .single();

// Update last used
await supabase
  .from('api_keys')
  .update({ last_used_at: new Date().toISOString() })
  .eq('id', keyData.id);
```

---

## 11. CORS Configuration

### ✅ DO:
- Configure CORS properly for APIs
- Restrict origins in production
- Allow necessary headers only
- Document CORS requirements

### ❌ DON'T:
- Use `Access-Control-Allow-Origin: *` in production
- Allow all headers
- Skip CORS configuration

### Example:
```typescript
// ✅ GOOD: Proper CORS for development
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // OK for development
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ✅ BETTER: Restricted CORS for production
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://yourdomain.com',
  'Access-Control-Allow-Headers': 'authorization, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
};
```

---

## 12. Logging & Monitoring

### ✅ DO:
- Log all authentication attempts
- Track API usage
- Monitor for suspicious activity
- Log errors for debugging
- Implement audit trails

### ❌ DON'T:
- Log sensitive data (passwords, tokens)
- Ignore security events
- Skip error logging
- Log personally identifiable information

### Example:
```typescript
// ✅ GOOD: Safe logging
console.log('User login attempt:', { userId: user.id, timestamp: new Date() });

// ❌ BAD: Logging sensitive data
console.log('User login:', { email, password, token });
```

---

## 13. Rate Limiting

### ✅ DO:
- Implement rate limiting on APIs
- Limit login attempts
- Track request frequency
- Return 429 status for rate limits

### ❌ DON'T:
- Allow unlimited requests
- Skip rate limiting on public endpoints
- Ignore brute force attempts

### Example:
```typescript
// ✅ GOOD: Rate limiting (conceptual)
const attempts = await getLoginAttempts(username);
if (attempts > 5) {
  return fail('Too many login attempts. Try again later.', 429);
}
```

---

## 14. Security Headers

### ✅ DO:
- Set Content-Security-Policy
- Use X-Frame-Options
- Enable HSTS
- Set X-Content-Type-Options

### Example Headers:
```
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000
```

---

## 15. Code Review Checklist

Before merging code, verify:

- [ ] No hardcoded secrets or API keys
- [ ] All user input is validated
- [ ] RLS policies are in place
- [ ] Error handling is implemented
- [ ] Authentication is required where needed
- [ ] Permissions are checked
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] CORS is properly configured
- [ ] Environment variables are used
- [ ] TypeScript types are defined
- [ ] Tests cover security scenarios

---

## 16. Incident Response

If a security issue is discovered:

1. **Immediate Actions**:
   - Assess the severity
   - Contain the issue
   - Notify the team

2. **Investigation**:
   - Review logs
   - Identify affected users
   - Determine the scope

3. **Remediation**:
   - Fix the vulnerability
   - Deploy the fix
   - Verify the fix

4. **Communication**:
   - Notify affected users
   - Document the incident
   - Update security procedures

5. **Prevention**:
   - Conduct security review
   - Update documentation
   - Implement additional controls

---

## 17. Regular Security Tasks

### Daily:
- Monitor error logs
- Check for suspicious activity
- Review API usage

### Weekly:
- Review access logs
- Check for failed login attempts
- Update dependencies

### Monthly:
- Rotate API keys
- Review RLS policies
- Conduct security audit
- Update documentation

### Quarterly:
- Full security assessment
- Penetration testing
- Update security procedures
- Team security training

---

## 18. Resources

### Documentation:
- [Supabase Security](https://supabase.com/docs/guides/auth)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security](https://react.dev/learn/security)

### Tools:
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Snyk](https://snyk.io/)
- [OWASP ZAP](https://www.zaproxy.org/)

---

## Contact

For security concerns or to report vulnerabilities:
- Email: security@rechargehub.com
- Create a private security advisory on GitHub

**Remember: Security is everyone's responsibility!**
