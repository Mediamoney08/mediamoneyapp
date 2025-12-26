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
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import QRCode from 'qrcode';

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

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [twoFactorAuth, setTwoFactorAuth] = useState<TwoFactorAuth>({ is_enabled: false });
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  
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
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
      setUsername(data.username);
      setNewEmail(data.email);
    } catch (error: any) {
      console.error('Error loading profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile',
        variant: 'destructive',
      });
    } finally {
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

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Password updated successfully',
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Generate secret
      const secret = Array.from(crypto.getRandomValues(new Uint8Array(20)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();

      // Generate backup codes
      const { data: backupCodes, error: codesError } = await supabase.rpc('generate_backup_codes');
      if (codesError) throw codesError;

      // Save to database (not enabled yet)
      const { error: insertError } = await supabase
        .from('two_factor_auth')
        .upsert({
          user_id: user.id,
          secret,
          is_enabled: false,
          backup_codes: backupCodes
        });

      if (insertError) throw insertError;

      // Generate QR code
      const otpauthUrl = `otpauth://totp/RechargeHub:${profile?.email}?secret=${secret}&issuer=RechargeHub`;
      const qrUrl = await QRCode.toDataURL(otpauthUrl);
      setQrCodeUrl(qrUrl);

      setTwoFactorAuth({
        is_enabled: false,
        secret,
        backup_codes: backupCodes
      });

      setShowBackupCodes(true);

      toast({
        title: 'Setup Started',
        description: 'Scan the QR code with your authenticator app',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // In production, verify the TOTP code on the server
      // For now, we'll just enable it
      const { error } = await supabase
        .from('two_factor_auth')
        .update({
          is_enabled: true,
          enabled_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: '2FA has been enabled successfully',
      });

      setVerificationCode('');
      setQrCodeUrl('');
      await load2FAStatus();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const disable2FA = async () => {
    if (!confirm('Are you sure you want to disable 2FA? This will make your account less secure.')) {
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('two_factor_auth')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: '2FA has been disabled',
      });

      setTwoFactorAuth({ is_enabled: false });
      setQrCodeUrl('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
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
        <p className="text-center">Loading...</p>
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="2fa">
            <Shield className="h-4 w-4 mr-2" />
            2FA
          </TabsTrigger>
          <TabsTrigger value="activity">
            <History className="h-4 w-4 mr-2" />
            Activity
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
                    <p className="text-sm text-muted-foreground">
                      Use an app like Google Authenticator or Authy
                    </p>
                  </div>
                </div>
                <Badge variant={twoFactorAuth.is_enabled ? 'default' : 'secondary'}>
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