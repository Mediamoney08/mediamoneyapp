import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/db/supabase';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AdminUser {
  id: string;
  email: string;
  username: string;
  role: string;
  is_active: boolean;
  two_factor_enabled: boolean;
  last_login: string;
  created_at: string;
  permissions: string[];
}

export default function AdminUserManagement() {
  const { toast } = useToast();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    role: 'admin',
    is_active: true,
    two_factor_enabled: false,
    permissions: [] as string[],
  });

  const availablePermissions = [
    'users.view',
    'users.edit',
    'users.delete',
    'orders.view',
    'orders.edit',
    'orders.refund',
    'orders.cancel',
    'payments.view',
    'payments.approve',
    'services.view',
    'services.edit',
    'services.delete',
    'tickets.view',
    'tickets.respond',
    'reports.view',
    'settings.view',
    'settings.edit',
    'admins.view',
    'admins.edit',
    'admins.delete',
  ];

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'admin')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const adminsData: AdminUser[] = (data || []).map(profile => ({
        id: profile.id,
        email: profile.email || '',
        username: profile.username || '',
        role: profile.role,
        is_active: profile.is_active !== false,
        two_factor_enabled: profile.two_factor_enabled || false,
        last_login: profile.last_login || profile.created_at,
        created_at: profile.created_at,
        permissions: profile.permissions || [],
      }));

      setAdmins(adminsData);
    } catch (error) {
      console.error('Error loading admins:', error);
      toast({
        title: 'Error',
        description: 'Failed to load admin users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.username) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (!editingAdmin && !formData.password) {
      toast({
        title: 'Validation Error',
        description: 'Password is required for new admin users',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingAdmin) {
        // Update existing admin
        const { error } = await supabase
          .from('profiles')
          .update({
            username: formData.username,
            is_active: formData.is_active,
            two_factor_enabled: formData.two_factor_enabled,
            permissions: formData.permissions,
          })
          .eq('id', editingAdmin.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Admin user updated successfully',
        });
      } else {
        // Create new admin
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (authError) throw authError;

        if (authData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              username: formData.username,
              role: 'admin',
              is_active: formData.is_active,
              two_factor_enabled: formData.two_factor_enabled,
              permissions: formData.permissions,
            })
            .eq('id', authData.user.id);

          if (profileError) throw profileError;
        }

        toast({
          title: 'Success',
          description: 'Admin user created successfully',
        });
      }

      setIsDialogOpen(false);
      resetForm();
      loadAdmins();
    } catch (error: any) {
      console.error('Error saving admin:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save admin user',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setFormData({
      email: admin.email,
      username: admin.username,
      password: '',
      role: admin.role,
      is_active: admin.is_active,
      two_factor_enabled: admin.two_factor_enabled,
      permissions: admin.permissions,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (adminId: string) => {
    if (!confirm('Are you sure you want to delete this admin user? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'user', is_active: false })
        .eq('id', adminId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Admin user removed successfully',
      });
      loadAdmins();
    } catch (error) {
      console.error('Error deleting admin:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete admin user',
        variant: 'destructive',
      });
    }
  };

  const togglePermission = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const resetForm = () => {
    setEditingAdmin(null);
    setFormData({
      email: '',
      username: '',
      password: '',
      role: 'admin',
      is_active: true,
      two_factor_enabled: false,
      permissions: [],
    });
    setShowPassword(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin User Management
            </CardTitle>
            <CardDescription>
              Manage administrator accounts and permissions
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAdmin ? 'Edit Admin User' : 'Create Admin User'}
                </DialogTitle>
                <DialogDescription>
                  {editingAdmin ? 'Update admin user information and permissions' : 'Create a new administrator account'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="permissions">Permissions</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="admin@example.com"
                          disabled={!!editingAdmin}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username *</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          placeholder="Enter username"
                          required
                        />
                      </div>
                    </div>

                    {!editingAdmin && (
                      <div className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Enter secure password"
                            required={!editingAdmin}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="is_active">Active Status</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow this admin to access the dashboard
                          </p>
                        </div>
                        <Switch
                          id="is_active"
                          checked={formData.is_active}
                          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="two_factor">Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">
                            Require 2FA for enhanced security
                          </p>
                        </div>
                        <Switch
                          id="two_factor"
                          checked={formData.two_factor_enabled}
                          onCheckedChange={(checked) => setFormData({ ...formData, two_factor_enabled: checked })}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="permissions" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Permissions</Label>
                      <p className="text-sm text-muted-foreground">
                        Select the permissions for this admin user
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {availablePermissions.map((permission) => (
                          <div key={permission} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={permission}
                              checked={formData.permissions.includes(permission)}
                              onChange={() => togglePermission(permission)}
                              className="rounded border-gray-300"
                            />
                            <Label htmlFor={permission} className="text-sm font-normal cursor-pointer">
                              {permission}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingAdmin ? 'Update Admin' : 'Create Admin'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>2FA</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No admin users found
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">{admin.username}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <Badge variant={admin.is_active ? 'default' : 'secondary'}>
                        {admin.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {admin.two_factor_enabled ? (
                        <Badge variant="default" className="gap-1">
                          <Lock className="h-3 w-3" />
                          Enabled
                        </Badge>
                      ) : (
                        <Badge variant="outline">Disabled</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {admin.permissions.length} permissions
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(admin.last_login).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(admin)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(admin.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}