import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  getAllProviders, 
  createProvider, 
  updateProvider, 
  deleteProvider 
} from '@/db/api';
import type { Provider, ApiType } from '@/types/types';
import { Server, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function ProviderManagement() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    api_endpoint: '',
    api_key: '',
    api_type: 'rest' as ApiType,
    is_active: true,
  });

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const data = await getAllProviders();
      setProviders(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load providers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProvider) {
        await updateProvider(editingProvider.id, formData);
        toast({
          title: 'Success',
          description: 'Provider updated successfully',
        });
      } else {
        await createProvider(formData);
        toast({
          title: 'Success',
          description: 'Provider created successfully',
        });
      }
      setDialogOpen(false);
      resetForm();
      loadProviders();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save provider',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (provider: Provider) => {
    setEditingProvider(provider);
    setFormData({
      name: provider.name,
      description: provider.description || '',
      api_endpoint: provider.api_endpoint,
      api_key: provider.api_key || '',
      api_type: provider.api_type,
      is_active: provider.is_active,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this provider?')) return;
    
    try {
      await deleteProvider(id);
      toast({
        title: 'Success',
        description: 'Provider deleted successfully',
      });
      loadProviders();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete provider',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      api_endpoint: '',
      api_key: '',
      api_type: 'rest',
      is_active: true,
    });
    setEditingProvider(null);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Provider Management</h2>
          <p className="text-muted-foreground">Manage API providers for product imports</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Provider
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingProvider ? 'Edit Provider' : 'Add Provider'}</DialogTitle>
              <DialogDescription>
                Configure API provider settings for importing products
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Provider Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api_type">API Type *</Label>
                    <Select
                      value={formData.api_type}
                      onValueChange={(value: ApiType) => setFormData({ ...formData, api_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rest">REST API</SelectItem>
                        <SelectItem value="graphql">GraphQL</SelectItem>
                        <SelectItem value="soap">SOAP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api_endpoint">API Endpoint *</Label>
                  <Input
                    id="api_endpoint"
                    type="url"
                    placeholder="https://api.provider.com/v1"
                    value={formData.api_endpoint}
                    onChange={(e) => setFormData({ ...formData, api_endpoint: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api_key">API Key</Label>
                  <Input
                    id="api_key"
                    type="password"
                    placeholder="Enter API key (optional)"
                    value={formData.api_key}
                    onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provider description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProvider ? 'Update' : 'Create'} Provider
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Providers
          </CardTitle>
          <CardDescription>
            {providers.length} provider{providers.length !== 1 ? 's' : ''} configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading providers...</div>
          ) : providers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No providers configured. Add your first provider to start importing products.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>API Type</TableHead>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {providers.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell className="font-medium">{provider.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{provider.api_type.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{provider.api_endpoint}</TableCell>
                    <TableCell>
                      {provider.is_active ? (
                        <Badge className="bg-green-500">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="mr-1 h-3 w-3" />
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{format(new Date(provider.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(provider)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(provider.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
