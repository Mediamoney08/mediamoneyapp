import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  User,
  Mail,
  Lock,
  Shield,
  Smartphone,
  Key,
  AlertTriangle,
  Check,
  Copy,
  Download,
  RefreshCw,
  Camera,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import QRCode from 'qrcode';
import {
  updateUserProfile,
  enable2FA,
  disable2FA,
  get2FAStatus,
  generate2FASecret,
  regenerateBackupCodes,
} from '@/db/api';
import type { Profile } from '@/types/types';

export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Profile form states
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // 2FA states
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [twoFactorSecret, setTwoFactorSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [enabling2FA, setEnabling2FA] = useState(false);
  const [disabling2FA, setDisabling2FA] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
      load2FAStatus();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data as Profile);
        setFullName(data.full_name || '');
        setUsername(data.username || '');
        setPhone(data.phone || '');
        setCountry(data.country || '');
        setCity(data.city || '');
        setDateOfBirth(data.date_of_birth || '');
        setAvatarUrl(data.avatar_url || '');
      }
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
      const status = await get2FAStatus();
      setTwoFactorEnabled(status.is_enabled);
      if (status.backup_codes) {
        setBackupCodes(status.backup_codes);
      }
    } catch (error: any) {
      console.error('Error loading 2FA status:', error);
    }
  };

  const handleUpdateProfile = async () => {
    setSavingProfile(true);
    try {
      const updatedProfile = await updateUserProfile({
        full_name: fullName || undefined,
        country: country || undefined,
        city: city || undefined,
        date_of_birth: dateOfBirth || undefined,
        avatar_url: avatarUrl || undefined,
      });

      setProfile(updatedProfile);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
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
        description: 'Password must be at least 8 characters long',
        variant: 'destructive',
      });
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Password changed successfully',
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to change password',
        variant: 'destructive',
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSetup2FA = async () => {
    try {
      // Generate secret
      const secret = generate2FASecret();
      setTwoFactorSecret(secret);

      // Generate QR code
      const email = user?.email || 'user@rechargehub.com';
      const otpauthUrl = `otpauth://totp/RechargeHub:${email}?secret=${secret}&issuer=RechargeHub`;

      const qrUrl = await QRCode.toDataURL(otpauthUrl);
      setQrCodeUrl(qrUrl);
    } catch (error: any) {
      console.error('Error setting up 2FA:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate 2FA QR code',
        variant: 'destructive',
      });
    }
  };

  const handleEnable2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: 'Error',
        description: 'Please enter a valid 6-digit code',
        variant: 'destructive',
      });
      return;
    }

    setEnabling2FA(true);
    try {
      const result = await enable2FA(twoFactorSecret, verificationCode);

      if (result.success) {
        setBackupCodes(result.backup_codes);
        setShowBackupCodes(true);
        setTwoFactorEnabled(true);
        setQrCodeUrl('');
        setVerificationCode('');

        toast({
          title: 'Success',
          description: '2FA enabled successfully. Please save your backup codes!',
        });
      }
    } catch (error: any) {
      console.error('Error enabling 2FA:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to enable 2FA',
        variant: 'destructive',
      });
    } finally {
      setEnabling2FA(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!confirm('Are you sure you want to disable 2FA? This will make your account less secure.')) {
      return;
    }

    setDisabling2FA(true);
    try {
      const result = await disable2FA('');

      if (result.success) {
        setTwoFactorEnabled(false);
        setBackupCodes([]);

        toast({
          title: 'Success',
          description: '2FA disabled successfully',
        });
      }
    } catch (error: any) {
      console.error('Error disabling 2FA:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to disable 2FA',
        variant: 'destructive',
      });
    } finally {
      setDisabling2FA(false);
    }
  };

  const handleRegenerateBackupCodes = async () => {
    if (!confirm('Are you sure? This will invalidate all existing backup codes.')) {
      return;
    }

    try {
      const result = await regenerateBackupCodes();

      if (result.success) {
        setBackupCodes(result.backup_codes);
        setShowBackupCodes(true);

        toast({
          title: 'Success',
          description: 'Backup codes regenerated successfully',
        });
      }
    } catch (error: any) {
      console.error('Error regenerating backup codes:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to regenerate backup codes',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      toast({
        title: 'Copied!',
        description: 'Code copied to clipboard',
      });
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy code',
        variant: 'destructive',
      });
    }
  };

  const downloadBackupCodes = () => {
    const text = backupCodes.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rechargehub-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Downloaded',
      description: 'Backup codes saved to file',
    });
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-12 w-64 bg-muted" />
          <Skeleton className="h-96 w-full bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and security</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
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
              Two-Factor Auth
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 xl:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      <User className="h-4 w-4 inline mr-2" />
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">
                      <User className="h-4 w-4 inline mr-2" />
                      Username
                    </Label>
                    <Input
                      id="username"
                      value={username}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Username cannot be changed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email
                    </Label>
                    <Input 
                      id="email" 
                      value={profile?.email || ''} 
                      disabled 
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={phone}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Phone number cannot be changed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Date of Birth
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">
                      <MapPin className="h-4 w-4 inline mr-2" />
                      Country
                    </Label>
                    <Input
                      id="country"
                      placeholder="Enter your country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">
                      <MapPin className="h-4 w-4 inline mr-2" />
                      City
                    </Label>
                    <Input
                      id="city"
                      placeholder="Enter your city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                <Button onClick={handleUpdateProfile} disabled={savingProfile} className="w-full">
                  {savingProfile ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Password must be at least 8 characters long and include uppercase, lowercase, and numbers.
                  </AlertDescription>
                </Alert>

                <Button onClick={handleChangePassword} disabled={changingPassword} className="w-full">
                  {changingPassword ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Changing Password...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 2FA Tab */}
          <TabsContent value="2fa" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>Add an extra layer of security to your account</CardDescription>
                  </div>
                  {twoFactorEnabled && (
                    <Badge className="bg-green-500">
                      <Check className="h-3 w-3 mr-1" />
                      Enabled
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {!twoFactorEnabled ? (
                  <>
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        Two-factor authentication adds an extra layer of security to your account. You'll need to enter a code from your authenticator app when signing in.
                      </AlertDescription>
                    </Alert>

                    {!qrCodeUrl ? (
                      <Button onClick={handleSetup2FA} className="w-full">
                        <Smartphone className="mr-2 h-4 w-4" />
                        Setup Two-Factor Authentication
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-center space-y-4">
                          <p className="text-sm font-medium">Scan this QR code with your authenticator app:</p>
                          <div className="flex justify-center">
                            <img src={qrCodeUrl} alt="2FA QR Code" className="border border-border rounded-lg p-4 bg-white" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">Or enter this code manually:</p>
                            <div className="flex items-center justify-center gap-2">
                              <code className="px-3 py-2 bg-muted rounded text-sm font-mono">{twoFactorSecret}</code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(twoFactorSecret, 'secret')}
                              >
                                {copiedCode === 'secret' ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label htmlFor="verificationCode">Enter 6-digit code from your app:</Label>
                          <Input
                            id="verificationCode"
                            placeholder="000000"
                            maxLength={6}
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                          />
                        </div>

                        <Button onClick={handleEnable2FA} disabled={enabling2FA} className="w-full">
                          {enabling2FA ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            'Verify and Enable 2FA'
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    <Alert>
                      <Check className="h-4 w-4" />
                      <AlertDescription>
                        Two-factor authentication is currently enabled on your account. Your account is more secure!
                      </AlertDescription>
                    </Alert>

                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex-1">
                            <Key className="mr-2 h-4 w-4" />
                            View Backup Codes
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Backup Codes</DialogTitle>
                            <DialogDescription>
                              Use these codes if you lose access to your authenticator app. Each code can only be used once.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            {backupCodes.length > 0 ? (
                              <>
                                <div className="grid grid-cols-2 gap-2">
                                  {backupCodes.map((code, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between p-2 bg-muted rounded font-mono text-sm"
                                    >
                                      <span>{code}</span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(code, `backup-${index}`)}
                                      >
                                        {copiedCode === `backup-${index}` ? (
                                          <Check className="h-3 w-3 text-green-500" />
                                        ) : (
                                          <Copy className="h-3 w-3" />
                                        )}
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex gap-2">
                                  <Button onClick={downloadBackupCodes} variant="outline" className="flex-1">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                  </Button>
                                  <Button onClick={handleRegenerateBackupCodes} variant="outline" className="flex-1">
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Regenerate
                                  </Button>
                                </div>
                              </>
                            ) : (
                              <p className="text-sm text-muted-foreground text-center py-4">
                                No backup codes available
                              </p>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button variant="destructive" onClick={handleDisable2FA} disabled={disabling2FA}>
                        {disabling2FA ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Disabling...
                          </>
                        ) : (
                          'Disable 2FA'
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Backup Codes Display Dialog */}
                {showBackupCodes && backupCodes.length > 0 && (
                  <Dialog open={showBackupCodes} onOpenChange={setShowBackupCodes}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Save Your Backup Codes</DialogTitle>
                        <DialogDescription>
                          Store these codes in a safe place. You'll need them if you lose access to your authenticator app.
                        </DialogDescription>
                      </DialogHeader>
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          These codes will only be shown once. Make sure to save them now!
                        </AlertDescription>
                      </Alert>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          {backupCodes.map((code, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-muted rounded font-mono text-sm"
                            >
                              <span>{code}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(code, `new-backup-${index}`)}
                              >
                                {copiedCode === `new-backup-${index}` ? (
                                  <Check className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          ))}
                        </div>
                        <Button onClick={downloadBackupCodes} variant="outline" className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Download Backup Codes
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
