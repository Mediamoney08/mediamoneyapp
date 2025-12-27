import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Shield, Lock, Mail, Eye, EyeOff, Zap, Copy, AlertTriangle, Check } from 'lucide-react';
import { getProfile } from '@/db/api';
import { supabase } from '@/db/supabase';

// TEST CREDENTIALS - FOR PREVIEW/TESTING ONLY
const TEST_ADMIN_EMAIL = 'admin@preview.test';
const TEST_ADMIN_PASSWORD = 'Admin123!Preview';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Quick login with test credentials
  const handleQuickLogin = async () => {
    setEmail(TEST_ADMIN_EMAIL);
    setPassword(TEST_ADMIN_PASSWORD);
    
    // Wait a moment for state to update, then submit
    setTimeout(() => {
      handleLogin(TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD);
    }, 100);
  };

  // Copy credentials to clipboard
  const copyCredentials = () => {
    const credentials = `Email: ${TEST_ADMIN_EMAIL}\nPassword: ${TEST_ADMIN_PASSWORD}`;
    navigator.clipboard.writeText(credentials);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Copied!',
      description: 'Test credentials copied to clipboard',
    });
  };

  const handleLogin = async (loginEmail: string, loginPassword: string) => {
    if (!loginEmail || !loginPassword) {
      toast({
        title: 'Error',
        description: 'Please enter both email and password',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Sign in
      const { error: signInError } = await signIn(loginEmail, loginPassword);
      
      if (signInError) {
        throw signInError;
      }

      // Wait a moment for auth state to update
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user is admin
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        throw new Error('Failed to get user information');
      }

      const profile = await getProfile(currentUser.id);
      
      if (!profile || profile.role !== 'admin') {
        // Sign out non-admin user
        await supabase.auth.signOut();
        
        toast({
          title: 'Access Denied',
          description: 'This account does not have admin privileges. Please use an admin account.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Success - redirect to admin dashboard
      toast({
        title: 'Welcome Admin',
        description: 'Successfully logged in to admin dashboard',
      });
      
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error('Admin login error:', error);
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid email or password',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md border-2">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
            <CardDescription className="text-base mt-2">
              Enter your admin credentials to access the dashboard
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Sign in as Admin
                </>
              )}
            </Button>
          </form>

          {/* PREVIEW MODE - Test Credentials */}
          <div className="mt-6">
            <Alert className="border-2 border-primary/50 bg-primary/5">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <AlertDescription className="ml-2">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default" className="bg-primary">
                        <Zap className="h-3 w-3 mr-1" />
                        PREVIEW MODE
                      </Badge>
                      <span className="text-xs text-muted-foreground">For Testing Only</span>
                    </div>
                    <p className="text-sm font-medium text-foreground mb-2">
                      Test Admin Credentials:
                    </p>
                  </div>
                  
                  <div className="bg-background/50 rounded-md p-3 space-y-2 text-sm font-mono">
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <div className="text-foreground break-all">{TEST_ADMIN_EMAIL}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Password:</span>
                      <div className="text-foreground">{TEST_ADMIN_PASSWORD}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleQuickLogin}
                      disabled={loading}
                      className="flex-1"
                      variant="default"
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Quick Login
                    </Button>
                    <Button
                      onClick={copyCredentials}
                      disabled={loading}
                      variant="outline"
                      size="icon"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    ⚠️ This is a test account for preview purposes. Remove before production deployment.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Security Notice</p>
                <p>This is a secure admin area. Only authorized administrators can access this dashboard. All login attempts are logged and monitored.</p>
              </div>
            </div>
          </div>

          {/* Back to Site */}
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              disabled={loading}
              className="text-sm"
            >
              ← Back to main site
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
