import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Lock, 
  AlertTriangle, 
  CheckCircle, 
  Key,
  Globe,
  Clock,
  UserCheck
} from 'lucide-react';
import { supabase } from '@/db/supabase';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface SecuritySettings {
  two_factor_required: boolean;
  session_timeout: number;
  max_login_attempts: number;
  ip_whitelist_enabled: boolean;
  password_min_length: number;
  password_require_special: boolean;
  password_require_numbers: boolean;
  password_require_uppercase: boolean;
}

interface LoginAttempt {
  id: string;
  email: string;
  ip_address: string;
  success: boolean;
  created_at: string;
}

export default function SecurityDashboard() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<SecuritySettings>({
    two_factor_required: false,
    session_timeout: 30,
    max_login_attempts: 5,
    ip_whitelist_enabled: false,
    password_min_length: 8,
    password_require_special: true,
    password_require_numbers: true,
    password_require_uppercase: true,
  });
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [whitelistedIPs, setWhitelistedIPs] = useState<string[]>([]);
  const [newIP, setNewIP] = useState('');

  useEffect(() => {
    loadSecuritySettings();
    loadLoginAttempts();
    loadWhitelistedIPs();
  }, []);

  const loadSecuritySettings = async () => {
    try {
      const { data, error } = await supabase
        .from('security_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading security settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLoginAttempts = async () => {
    try {
      const { data, error } = await supabase
        .from('login_attempts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLoginAttempts(data || []);
    } catch (error) {
      console.error('Error loading login attempts:', error);
    }
  };

  const loadWhitelistedIPs = async () => {
    try {
      const { data, error } = await supabase
        .from('ip_whitelist')
        .select('ip_address');

      if (error) throw error;
      setWhitelistedIPs((data || []).map(item => item.ip_address));
    } catch (error) {
      console.error('Error loading whitelisted IPs:', error);
    }
  };

  const saveSettings = async () => {
    try {
      const { error } = await supabase
        .from('security_settings')
        .upsert(settings);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Security settings updated successfully',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save security settings',
        variant: 'destructive',
      });
    }
  };

  const addWhitelistedIP = async () => {
    if (!newIP) return;

    // Basic IP validation
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(newIP)) {
      toast({
        title: 'Invalid IP',
        description: 'Please enter a valid IP address',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('ip_whitelist')
        .insert({ ip_address: newIP });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'IP address added to whitelist',
      });
      setNewIP('');
      loadWhitelistedIPs();
    } catch (error) {
      console.error('Error adding IP:', error);
      toast({
        title: 'Error',
        description: 'Failed to add IP address',
        variant: 'destructive',
      });
    }
  };

  const removeWhitelistedIP = async (ip: string) => {
    try {
      const { error } = await supabase
        .from('ip_whitelist')
        .delete()
        .eq('ip_address', ip);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'IP address removed from whitelist',
      });
      loadWhitelistedIPs();
    } catch (error) {
      console.error('Error removing IP:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove IP address',
        variant: 'destructive',
      });
    }
  };

  const failedAttempts = loginAttempts.filter(a => !a.success).length;
  const successfulLogins = loginAttempts.filter(a => a.success).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">2FA Status</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {settings.two_factor_required ? 'Required' : 'Optional'}
            </div>
            <p className="text-xs text-muted-foreground">
              Two-factor authentication
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failedAttempts}</div>
            <p className="text-xs text-muted-foreground">
              Last 50 attempts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Logins</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successfulLogins}</div>
            <p className="text-xs text-muted-foreground">
              Last 50 attempts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Whitelisted IPs</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{whitelistedIPs.length}</div>
            <p className="text-xs text-muted-foreground">
              Allowed IP addresses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Configure security policies and authentication requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="authentication" className="space-y-4">
            <TabsList>
              <TabsTrigger value="authentication">Authentication</TabsTrigger>
              <TabsTrigger value="password">Password Policy</TabsTrigger>
              <TabsTrigger value="ip-whitelist">IP Whitelist</TabsTrigger>
              <TabsTrigger value="login-history">Login History</TabsTrigger>
            </TabsList>

            <TabsContent value="authentication" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Force all admins to enable 2FA
                    </p>
                  </div>
                  <Switch
                    checked={settings.two_factor_required}
                    onCheckedChange={(checked) => setSettings({ ...settings, two_factor_required: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session_timeout"
                    type="number"
                    value={settings.session_timeout}
                    onChange={(e) => setSettings({ ...settings, session_timeout: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_attempts">Max Login Attempts</Label>
                  <Input
                    id="max_attempts"
                    type="number"
                    value={settings.max_login_attempts}
                    onChange={(e) => setSettings({ ...settings, max_login_attempts: parseInt(e.target.value) })}
                  />
                </div>

                <Button onClick={saveSettings}>Save Settings</Button>
              </div>
            </TabsContent>

            <TabsContent value="password" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="min_length">Minimum Password Length</Label>
                  <Input
                    id="min_length"
                    type="number"
                    value={settings.password_min_length}
                    onChange={(e) => setSettings({ ...settings, password_min_length: parseInt(e.target.value) })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Require Special Characters</Label>
                  <Switch
                    checked={settings.password_require_special}
                    onCheckedChange={(checked) => setSettings({ ...settings, password_require_special: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Require Numbers</Label>
                  <Switch
                    checked={settings.password_require_numbers}
                    onCheckedChange={(checked) => setSettings({ ...settings, password_require_numbers: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Require Uppercase Letters</Label>
                  <Switch
                    checked={settings.password_require_uppercase}
                    onCheckedChange={(checked) => setSettings({ ...settings, password_require_uppercase: checked })}
                  />
                </div>

                <Button onClick={saveSettings}>Save Settings</Button>
              </div>
            </TabsContent>

            <TabsContent value="ip-whitelist" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable IP Whitelist</Label>
                    <p className="text-sm text-muted-foreground">
                      Only allow access from whitelisted IPs
                    </p>
                  </div>
                  <Switch
                    checked={settings.ip_whitelist_enabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, ip_whitelist_enabled: checked })}
                  />
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Enter IP address (e.g., 192.168.1.1)"
                    value={newIP}
                    onChange={(e) => setNewIP(e.target.value)}
                  />
                  <Button onClick={addWhitelistedIP}>Add IP</Button>
                </div>

                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>IP Address</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {whitelistedIPs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                            No whitelisted IPs
                          </TableCell>
                        </TableRow>
                      ) : (
                        whitelistedIPs.map((ip) => (
                          <TableRow key={ip}>
                            <TableCell className="font-mono">{ip}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeWhitelistedIP(ip)}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="login-history" className="space-y-4">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loginAttempts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No login attempts recorded
                        </TableCell>
                      </TableRow>
                    ) : (
                      loginAttempts.map((attempt) => (
                        <TableRow key={attempt.id}>
                          <TableCell>{attempt.email}</TableCell>
                          <TableCell className="font-mono text-xs">{attempt.ip_address}</TableCell>
                          <TableCell>
                            <Badge variant={attempt.success ? 'default' : 'destructive'}>
                              {attempt.success ? 'Success' : 'Failed'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(attempt.created_at).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}