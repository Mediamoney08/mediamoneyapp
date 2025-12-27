import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Wallet } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from || '/';

  const [signInForm, setSignInForm] = useState({
    username: '',
    password: '',
  });

  const [signUpForm, setSignUpForm] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(signInForm.username, signInForm.password);
      if (error) {
        toast({
          title: 'Sign In Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.',
        });
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate username
    if (signUpForm.username.length < 3) {
      toast({
        title: 'Invalid Username',
        description: 'Username must be at least 3 characters',
        variant: 'destructive',
      });
      return;
    }

    // Validate username format (alphanumeric and underscore only)
    if (!/^[a-zA-Z0-9_]+$/.test(signUpForm.username)) {
      toast({
        title: 'Invalid Username',
        description: 'Username can only contain letters, numbers, and underscores',
        variant: 'destructive',
      });
      return;
    }

    // Validate email
    if (!signUpForm.email || !signUpForm.email.includes('@')) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    // Validate phone (optional but if provided, should be valid)
    if (signUpForm.phone && signUpForm.phone.length < 10) {
      toast({
        title: 'Invalid Phone',
        description: 'Please enter a valid phone number',
        variant: 'destructive',
      });
      return;
    }

    if (signUpForm.password !== signUpForm.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    // Enhanced password validation
    if (signUpForm.password.length < 8) {
      toast({
        title: 'Weak Password',
        description: 'Password must be at least 8 characters',
        variant: 'destructive',
      });
      return;
    }

    // Check for password complexity
    const hasUpperCase = /[A-Z]/.test(signUpForm.password);
    const hasLowerCase = /[a-z]/.test(signUpForm.password);
    const hasNumber = /[0-9]/.test(signUpForm.password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      toast({
        title: 'Weak Password',
        description: 'Password must contain uppercase, lowercase, and numbers',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(
        signUpForm.username, 
        signUpForm.email,
        signUpForm.phone,
        signUpForm.password
      );
      if (error) {
        toast({
          title: 'Sign Up Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Account Created!',
          description: 'You have successfully signed up and logged in.',
        });
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md animate-fadeInUp">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="gradient-bg rounded-lg p-2">
              <Wallet className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Recharge Hub</span>
          </Link>
          <p className="text-muted-foreground">Sign in to your account or create a new one</p>
        </div>

        <Card>
          <Tabs defaultValue="signin" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </CardHeader>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-username">Email or Username</Label>
                    <Input
                      id="signin-username"
                      type="text"
                      placeholder="Enter your email or username"
                      value={signInForm.username}
                      onChange={(e) => setSignInForm({ ...signInForm, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={signInForm.password}
                      onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full gradient-bg" disabled={loading}>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">Username</Label>
                    <Input
                      id="signup-username"
                      type="text"
                      placeholder="Choose a username"
                      value={signUpForm.username}
                      onChange={(e) => setSignUpForm({ ...signUpForm, username: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Only letters, numbers, and underscores allowed
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email address"
                      value={signUpForm.email}
                      onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      We'll use this for account recovery and notifications
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone Number</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="Enter your phone number (optional)"
                      value={signUpForm.phone}
                      onChange={(e) => setSignUpForm({ ...signUpForm, phone: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional: For account security and support
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={signUpForm.password}
                      onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Must be 8+ characters with uppercase, lowercase, and numbers
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={signUpForm.confirmPassword}
                      onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full gradient-bg" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
