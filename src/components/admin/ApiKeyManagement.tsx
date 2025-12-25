import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { 
  createApiKey, 
  getApiKeys, 
  deleteApiKey, 
  toggleApiKeyStatus 
} from '@/db/api';
import type { ApiKey, ApiPermissions } from '@/types/types';
import { Key, Plus, Trash2, Eye, EyeOff, Copy } from 'lucide-react';
import { format } from 'date-fns';

export default function ApiKeyManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [permissions, setPermissions] = useState<ApiPermissions>({});
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    setLoading(true);
    try {
      const data = await getApiKeys();
      setApiKeys(data);
    } catch (error) {
      console.error('Error loading API keys:', error);
      toast({
        title: 'Error',
        description: 'Failed to load API keys',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateApiKey = async () => {
    if (!name.trim() || !user) {
      toast({
        title: 'Error',
        description: 'Please enter a name for the API key',
        variant: 'destructive',
      });
      return;
    }

    setCreating(true);
    try {
      const newKey = await createApiKey(name, note || null, permissions, user.id);
      toast({
        title: 'API Key Created',
        description: 'Your new API key has been created successfully',
      });
      setDialogOpen(false);
      setName('');
      setNote('');
      setPermissions({});
      loadApiKeys();
      
      // Show the key in a dialog
      alert(`Your API Key: ${newKey.key}\n\nPlease save this key securely. You won't be able to see it again.`);
    } catch (error) {
      console.error('Error creating API key:', error);
      toast({
        title: 'Error',
        description: 'Failed to create API key',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) return;

    try {
      await deleteApiKey(id);
      toast({
        title: 'Success',
        description: 'API key deleted successfully',
      });
      loadApiKeys();
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete API key',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await toggleApiKeyStatus(id, newStatus);
      toast({
        title: 'Success',
        description: `API key ${newStatus === 'active' ? 'activated' : 'deactivated'}`,
      });
      loadApiKeys();
    } catch (error) {
      console.error('Error toggling API key status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update API key status',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'API key copied to clipboard',
    });
  };

  const updatePermission = (category: keyof ApiPermissions, permission: string, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [permission]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">API Key Management</h2>
          <p className="text-muted-foreground">Manage API keys for external integrations</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Configure permissions for the new API key
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="key-name">Name *</Label>
                <Input
                  id="key-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Production API Key"
                />
              </div>
              <div>
                <Label htmlFor="key-note">Note</Label>
                <Textarea
                  id="key-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional description"
                  rows={2}
                />
              </div>

              {/* Permissions */}
              <div className="space-y-4">
                <h3 className="font-semibold">Permissions</h3>
                
                {/* Orders Permissions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Orders</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3 sm:grid-cols-2">
                    {[
                      { key: 'edit_link', label: 'Edit Link' },
                      { key: 'resend_order', label: 'Resend Order' },
                      { key: 'get_order_list', label: 'Get Order List' },
                      { key: 'view_provider_charge', label: 'View Provider Charge' },
                      { key: 'view_external_id', label: 'View External ID' },
                      { key: 'view_provider_response', label: 'View Provider Response' },
                      { key: 'view_provider_url', label: 'View Provider URL' },
                      { key: 'change_status', label: 'Change Status' },
                      { key: 'cancel_and_refund', label: 'Cancel and Refund' },
                      { key: 'set_partial', label: 'Set Partial' },
                      { key: 'pull_orders', label: 'Pull Orders' },
                      { key: 'update_orders', label: 'Update Orders' },
                      { key: 'request_cancel', label: 'Request Cancel' },
                      { key: 'pull_cancel_tasks', label: 'Pull Cancel Tasks' },
                      { key: 'reject_cancel', label: 'Reject Cancel' },
                    ].map(perm => (
                      <div key={perm.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={`orders-${perm.key}`}
                          checked={permissions.orders?.[perm.key as keyof typeof permissions.orders] || false}
                          onCheckedChange={(checked) => updatePermission('orders', perm.key, checked as boolean)}
                        />
                        <Label htmlFor={`orders-${perm.key}`} className="text-sm font-normal cursor-pointer">
                          {perm.label}
                        </Label>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Refill Permissions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Refill</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3 sm:grid-cols-2">
                    {[
                      { key: 'pull_refill_tasks', label: 'Pull Refill Tasks' },
                      { key: 'change_refill_status', label: 'Change Refill Status' },
                    ].map(perm => (
                      <div key={perm.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={`refill-${perm.key}`}
                          checked={permissions.refill?.[perm.key as keyof typeof permissions.refill] || false}
                          onCheckedChange={(checked) => updatePermission('refill', perm.key, checked as boolean)}
                        />
                        <Label htmlFor={`refill-${perm.key}`} className="text-sm font-normal cursor-pointer">
                          {perm.label}
                        </Label>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Payments Permissions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Payments</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3 sm:grid-cols-2">
                    {[
                      { key: 'add_payment', label: 'Add Payment' },
                      { key: 'get_payment_list', label: 'Get Payment List' },
                      { key: 'view_user_details', label: 'View User Details' },
                    ].map(perm => (
                      <div key={perm.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={`payments-${perm.key}`}
                          checked={permissions.payments?.[perm.key as keyof typeof permissions.payments] || false}
                          onCheckedChange={(checked) => updatePermission('payments', perm.key, checked as boolean)}
                        />
                        <Label htmlFor={`payments-${perm.key}`} className="text-sm font-normal cursor-pointer">
                          {perm.label}
                        </Label>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Users Permissions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Users</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3 sm:grid-cols-2">
                    {[
                      { key: 'add_user', label: 'Add User' },
                      { key: 'get_user_list', label: 'Get User List' },
                      { key: 'view_email', label: 'View Email' },
                      { key: 'view_balance', label: 'View Balance' },
                      { key: 'view_spent', label: 'View Spent' },
                      { key: 'view_user_details', label: 'View User Details' },
                    ].map(perm => (
                      <div key={perm.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={`users-${perm.key}`}
                          checked={permissions.users?.[perm.key as keyof typeof permissions.users] || false}
                          onCheckedChange={(checked) => updatePermission('users', perm.key, checked as boolean)}
                        />
                        <Label htmlFor={`users-${perm.key}`} className="text-sm font-normal cursor-pointer">
                          {perm.label}
                        </Label>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Tickets Permissions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Tickets</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3 sm:grid-cols-2">
                    {[
                      { key: 'get_ticket_list', label: 'Get Ticket List' },
                      { key: 'get_ticket', label: 'Get Ticket' },
                      { key: 'reply_to_ticket', label: 'Reply to Ticket' },
                      { key: 'add_ticket', label: 'Add Ticket' },
                    ].map(perm => (
                      <div key={perm.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tickets-${perm.key}`}
                          checked={permissions.tickets?.[perm.key as keyof typeof permissions.tickets] || false}
                          onCheckedChange={(checked) => updatePermission('tickets', perm.key, checked as boolean)}
                        />
                        <Label htmlFor={`tickets-${perm.key}`} className="text-sm font-normal cursor-pointer">
                          {perm.label}
                        </Label>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateApiKey} disabled={creating}>
                {creating ? 'Creating...' : 'Create API Key'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* API Keys Table */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>{apiKeys.length} API keys</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-8">
              <Key className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No API keys found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map(apiKey => (
                    <TableRow key={apiKey.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{apiKey.name}</div>
                          {apiKey.note && (
                            <div className="text-sm text-muted-foreground">{apiKey.note}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {apiKey.key.substring(0, 12)}...
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(apiKey.key)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={apiKey.status === 'active' ? 'default' : 'secondary'}>
                          {apiKey.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {apiKey.last_used_at 
                          ? format(new Date(apiKey.last_used_at), 'MMM d, yyyy')
                          : 'Never'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(apiKey.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(apiKey.id, apiKey.status)}
                          >
                            {apiKey.status === 'active' ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteApiKey(apiKey.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
