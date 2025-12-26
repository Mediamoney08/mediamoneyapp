import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Smartphone, 
  Key, 
  History,
  AlertTriangle,
  Check,
  Copy,
  Download,
  Globe,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import QRCode from 'qrcode';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Profile {
  id: string;
  username: string;
  email: string;
  wallet_balance: number;
  currency: string;
  role: string;
  created_at: string;
}

interface TwoFactorAuth {
  is_enabled: boolean;
  secret?: string;
  backup_codes?: string[];
}

interface LoginHistory {
  id: string;
  ip_address: string;
  user_agent: string;
  success: boolean;
  created_at: string;
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
  exchange_rate: number;
}

const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
];

export default function ProfileSettingsPage() {
  const { i18n } = useTranslation();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [twoFactorAuth, setTwoFactorAuth] = useState<TwoFactorAuth>({ is_enabled: false });
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  
  // Preferences
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  
  // Form states
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
    load2FAStatus();
    loadLoginHistory();
    loadCurrencies();
    loadUserPreferences();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
      }
      
      if (data) {
        setProfile(data);
        setUsername(data.username || '');
        setNewEmail(data.email || '');
        setLoading(false);
      } else {
        // Profile doesn't exist, create one
        console.log('Profile not found, creating one...');
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            username: user.email?.split('@')[0] || 'user',
            role: 'user',
            wallet_balance: 0,
            currency: 'USD'
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          // Try one more time after a short delay
          setTimeout(async () => {
            const { data: retryData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .maybeSingle();
            
            if (retryData) {
              setProfile(retryData);
              setUsername(retryData.username || '');
              setNewEmail(retryData.email || '');
            }
            setLoading(false);
          }, 1000);
        } else if (newProfile) {
          setProfile(newProfile);
          setUsername(newProfile.username || '');
          setNewEmail(newProfile.email || '');
          setLoading(false);
        } else {
          setLoading(false);
        }
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
      setLoading(false);
    }
  };

  const load2FAStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('two_factor_auth')
        .select('is_enabled, backup_codes')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setTwoFactorAuth({
          is_enabled: data.is_enabled,
          backup_codes: data.backup_codes
        });
      }
    } catch (error: any) {
      console.error('Error loading 2FA status:', error);
    }
  };

  const loadLoginHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('login_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setLoginHistory(data || []);
    } catch (error: any) {
      console.error('Error loading login history:', error);
    }
  };

  const loadCurrencies = async () => {
    try {
      const { data, error } = await supabase
        .from('currencies')
        .select('*')
        .eq('is_active', true)
        .order('code');

      if (error) throw error;
      setCurrencies(data || []);
    } catch (error: any) {
      console.error('Error loading currencies:', error);
    }
  };

  const loadUserPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_preferences')
        .select('language, currency')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && data) {
        setSelectedLanguage(data.language || 'en');
        setSelectedCurrency(data.currency || 'USD');
        
        // Apply language
        if (data.language && i18n) {
          i18n.changeLanguage(data.language).catch(err => {
            console.error('Error changing language:', err);
          });
          document.documentElement.dir = ['ar', 'he'].includes(data.language) ? 'rtl' : 'ltr';
        }
        
        // Apply currency
        if (data.currency) {
          localStorage.setItem('preferred_currency', data.currency);
        }
      }
    } catch (error: any) {
      console.error('Error loading user preferences:', error);
    }
  };

  const updateLanguage = async (languageCode: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update i18n
      if (i18n) {
        await i18n.changeLanguage(languageCode);
      }
      setSelectedLanguage(languageCode);
      
      // Update HTML dir for RTL
      document.documentElement.dir = ['ar', 'he'].includes(languageCode) ? 'rtl' : 'ltr';

      // Save to database
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          language: languageCode
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Language updated successfully',
      });
    } catch (error: any) {
      console.error('Error updating language:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update language',
        variant: 'destructive',
      });
    }
  };

  const updateCurrency = async (currencyCode: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setSelectedCurrency(currencyCode);
      
      // Save to localStorage
      localStorage.setItem('preferred_currency', currencyCode);

      // Save to database
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          currency: currencyCode
        });

      if (error) throw error;

      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('currencyChanged', { detail: currencyCode }));

      toast({
        title: 'Success',
        description: 'Currency updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateUsername = async () => {
    if (!username.trim()) {
      toast({
        title: 'Error',
        description: 'Username cannot be empty',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ username: username.trim() })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Username updated successfully',
      });

      await loadProfile();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: 'Error',
        description: 'All password fields are required',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: 'Error',
        description: 'Password must be at least 8 characters',
        variant: 'destructive',
      });
      return;
    }

    // Password strength validation
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      toast({
        title: 'Error',
        description: 'Password must contain uppercase, lowercase, and numbers',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: 'Error',
          description: 'You must be logged in',
          variant: 'destructive',
        });
        return;
      }

      // Call secure Edge Function to change password
      const { data, error } = await supabase.functions.invoke('change-password', {
        body: {
          current_password: currentPassword,
          new_password: newPassword
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to change password');
      }

      toast({
        title: 'Success',
        description: 'Password updated successfully',
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Password change error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update password',
        variant: 'destructive',
      });
    }
  };

  const requestEmailChange = async () => {
    if (!newEmail || newEmail === profile?.email) {
      toast({
        title: 'Error',
        description: 'Please enter a new email address',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (error) throw error;

      toast({
        title: 'Verification Email Sent',
        description: 'Please check your new email address to confirm the change',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const setup2FA = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: 'Error',
          description: 'You must be logged in',
          variant: 'destructive',
        });
        return;
      }

      // Call secure Edge Function to generate 2FA secret
      const { data, error } = await supabase.functions.invoke('two-factor-auth', {
        body: { action: 'setup' },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to setup 2FA');
      }

      // Generate QR code from the URL
      const qrUrl = await QRCode.toDataURL(data.data.qr_url);
      setQrCodeUrl(qrUrl);

      setTwoFactorAuth({
        is_enabled: false,
        secret: data.data.secret,
        backup_codes: data.data.backup_codes
      });

      setShowBackupCodes(true);

      toast({
        title: 'Setup Started',
        description: 'Scan the QR code with your authenticator app',
      });
    } catch (error: any) {
      console.error('2FA setup error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to setup 2FA',
        variant: 'destructive',
      });
    }
  };

  const verify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: 'Error',
        description: 'Please enter a valid 6-digit code',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: 'Error',
          description: 'You must be logged in',
          variant: 'destructive',
        });
        return;
      }

      // Call secure Edge Function to verify code
      const { data, error } = await supabase.functions.invoke('two-factor-auth', {
        body: { 
          action: 'verify',
          code: verificationCode
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Verification failed');
      }

      toast({
        title: 'Success',
        description: '2FA has been enabled successfully',
      });

      setVerificationCode('');
      setQrCodeUrl('');
      await load2FAStatus();
    } catch (error: any) {
      console.error('2FA verification error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Invalid verification code',
        variant: 'destructive',
      });
    }
  };

  const disable2FA = async () => {
    if (!confirm('Are you sure you want to disable 2FA? This will make your account less secure.')) {
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: 'Error',
          description: 'You must be logged in',
          variant: 'destructive',
        });
        return;
      }

      // Call secure Edge Function to disable 2FA
      const { data, error } = await supabase.functions.invoke('two-factor-auth', {
        body: { action: 'disable' },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Failed to disable 2FA');
      }

      toast({
        title: 'Success',
        description: '2FA has been disabled',
      });

      setTwoFactorAuth({ is_enabled: false });
      setQrCodeUrl('');
    } catch (error: any) {
      console.error('2FA disable error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to disable 2FA',
        variant: 'destructive',
      });
    }
  };

  const downloadBackupCodes = () => {
    if (!twoFactorAuth.backup_codes) return;

    const content = `Recharge Hub - Backup Codes\n\nGenerated: ${new Date().toLocaleString()}\n\nBackup Codes:\n${twoFactorAuth.backup_codes.join('\n')}\n\nKeep these codes safe. Each code can only be used once.`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rechargehub-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Downloaded',
      description: 'Backup codes saved to file',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Setting up your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and security preferences
        </p>
      </div>
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="px-3">
            <User className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger value="preferences" className="px-3">
            <Globe className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger value="security" className="px-3">
            <Lock className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger value="2fa" className="px-3">
            <Shield className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger value="activity" className="px-3">
            <History className="h-5 w-5" />
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="flex gap-2">
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                  />
                  <Button onClick={updateUsername}>
                    Update
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Email</Label>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
              </div>

              <div className="space-y-2">
                <Label>Account Type</Label>
                <Badge variant={profile?.role === 'admin' ? 'default' : 'secondary'}>
                  {profile?.role}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label>Member Since</Label>
                <p className="text-sm text-muted-foreground">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Language & Currency
              </CardTitle>
              <CardDescription>
                Choose your preferred language and currency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language Selection */}
              <div className="space-y-3">
                <Label htmlFor="language" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Language
                </Label>
                <Select value={selectedLanguage} onValueChange={updateLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.nativeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Select your preferred language for the interface
                </p>
              </div>

              <Separator />

              {/* Currency Selection */}
              <div className="space-y-3">
                <Label htmlFor="currency" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Currency
                </Label>
                <Select value={selectedCurrency} onValueChange={updateCurrency}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.code} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  All prices will be displayed in your selected currency
                </p>
              </div>

              {/* Current Settings Display */}
              <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-2">
                <h4 className="text-sm font-medium">Current Settings</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Language</p>
                    <p className="font-medium">
                      {LANGUAGES.find(l => l.code === selectedLanguage)?.nativeName || 'English'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Currency</p>
                    <p className="font-medium">
                      {currencies.find(c => c.code === selectedCurrency)?.symbol || '$'} {selectedCurrency}
                    </p>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Your language and currency preferences are saved automatically and will be applied across all your devices.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Password must be at least 8 characters long
                </AlertDescription>
              </Alert>

              <Button onClick={updatePassword} className="w-full">
                <Lock className="h-4 w-4 mr-2" />
                Update Password
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Email</CardTitle>
              <CardDescription>
                Update your email address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-email">New Email Address</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email"
                />
              </div>

              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  You will receive a verification email at your new address
                </AlertDescription>
              </Alert>

              <Button onClick={requestEmailChange} className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Request Email Change
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2FA Tab */}
        <TabsContent value="2fa" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Authenticator App</p>
                    <p className="text-muted-foreground text-[12px]">
                      Use an app like Google Authenticator or Authy
                    </p>
                  </div>
                </div>
                <Badge
                  variant={twoFactorAuth.is_enabled ? 'default' : 'secondary'}
                  className="bg-[#f80003] bg-none">
                  {twoFactorAuth.is_enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>

              {!twoFactorAuth.is_enabled && !qrCodeUrl && (
                <Button onClick={setup2FA} className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Enable 2FA
                </Button>
              )}

              {qrCodeUrl && !twoFactorAuth.is_enabled && (
                <div className="space-y-4">
                  <Alert>
                    <AlertDescription>
                      <strong>Step 1:</strong> Scan this QR code with your authenticator app
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-center p-4 bg-white rounded-lg">
                    <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
                  </div>

                  <Alert>
                    <AlertDescription>
                      <strong>Step 2:</strong> Enter the 6-digit code from your app
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="verification-code">Verification Code</Label>
                    <Input
                      id="verification-code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      maxLength={6}
                      className="text-center text-2xl tracking-widest"
                    />
                  </div>

                  <Button onClick={verify2FA} className="w-full">
                    <Check className="h-4 w-4 mr-2" />
                    Verify and Enable
                  </Button>
                </div>
              )}

              {twoFactorAuth.is_enabled && (
                <div className="space-y-4">
                  <Alert>
                    <Check className="h-4 w-4" />
                    <AlertDescription>
                      Two-factor authentication is currently enabled
                    </AlertDescription>
                  </Alert>

                  <Button onClick={disable2FA} variant="destructive" className="w-full">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Disable 2FA
                  </Button>
                </div>
              )}

              {showBackupCodes && twoFactorAuth.backup_codes && (
                <Card className="border-2 border-primary">
                  <CardHeader>
                    <CardTitle className="text-lg">Backup Codes</CardTitle>
                    <CardDescription>
                      Save these codes in a safe place. Each can be used once if you lose access to your authenticator.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 p-4 bg-muted rounded font-mono text-sm">
                      {twoFactorAuth.backup_codes.map((code, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Key className="h-3 w-3" />
                          {code}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(twoFactorAuth.backup_codes!.join('\n'));
                          toast({ title: 'Copied', description: 'Backup codes copied to clipboard' });
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        onClick={downloadBackupCodes}
                        variant="outline"
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Login History</CardTitle>
              <CardDescription>
                Recent login activity on your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loginHistory.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No login history available
                  </p>
                ) : (
                  loginHistory.map((login) => (
                    <div
                      key={login.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {login.success ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium">
                            {login.success ? 'Successful Login' : 'Failed Login'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {login.ip_address} • {new Date(login.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={login.success ? 'default' : 'destructive'}>
                        {login.success ? 'Success' : 'Failed'}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}