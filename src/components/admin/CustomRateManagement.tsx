import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  getAllCustomRates, 
  createCustomRate, 
  updateCustomRate, 
  deleteCustomRate,
  getAllProfiles,
  getProducts
} from '@/db/api';
import type { CustomRate, Profile, Product } from '@/types/types';
import { DollarSign, Plus, Edit, Trash2, User, Package } from 'lucide-react';
import { format } from 'date-fns';

export default function CustomRateManagement() {
  const [rates, setRates] = useState<CustomRate[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<CustomRate | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    user_id: '',
    product_id: '',
    custom_price: 0,
    note: '',
    is_active: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ratesData, usersData, productsData] = await Promise.all([
        getAllCustomRates(),
        getAllProfiles(),
        getProducts(),
      ]);
      setRates(ratesData);
      setUsers(usersData);
      setProducts(productsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRate) {
        await updateCustomRate(editingRate.id, formData);
        toast({
          title: 'Success',
          description: 'Custom rate updated successfully',
        });
      } else {
        await createCustomRate(formData);
        toast({
          title: 'Success',
          description: 'Custom rate created successfully',
        });
      }
      setDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save custom rate',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (rate: CustomRate) => {
    setEditingRate(rate);
    setFormData({
      user_id: rate.user_id,
      product_id: rate.product_id,
      custom_price: rate.custom_price,
      note: rate.note || '',
      is_active: rate.is_active,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this custom rate?')) return;
    
    try {
      await deleteCustomRate(id);
      toast({
        title: 'Success',
        description: 'Custom rate deleted successfully',
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete custom rate',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      user_id: '',
      product_id: '',
      custom_price: 0,
      note: '',
      is_active: true,
    });
    setEditingRate(null);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.username || user?.email || 'Unknown User';
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  const getProductPrice = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.price || 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Custom Rate Management</h2>
          <p className="text-muted-foreground">Set special pricing for specific users</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Custom Rate
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingRate ? 'Edit Custom Rate' : 'Add Custom Rate'}</DialogTitle>
              <DialogDescription>
                Set a special price for a specific user and product
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user_id">User *</Label>
                  <Select
                    value={formData.user_id}
                    onValueChange={(value) => setFormData({ ...formData, user_id: value })}
                    disabled={!!editingRate}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.username || user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product_id">Product *</Label>
                  <Select
                    value={formData.product_id}
                    onValueChange={(value) => setFormData({ ...formData, product_id: value })}
                    disabled={!!editingRate}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} (${product.price})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.product_id && (
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm text-muted-foreground">
                      Regular Price: <span className="font-medium">${getProductPrice(formData.product_id).toFixed(2)}</span>
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="custom_price">Custom Price ($) *</Label>
                  <Input
                    id="custom_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.custom_price}
                    onChange={(e) => setFormData({ ...formData, custom_price: parseFloat(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Note</Label>
                  <Textarea
                    id="note"
                    placeholder="Reason for custom pricing..."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
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
                  {editingRate ? 'Update' : 'Create'} Custom Rate
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Custom Rates
          </CardTitle>
          <CardDescription>
            {rates.length} custom rate{rates.length !== 1 ? 's' : ''} configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading custom rates...</div>
          ) : rates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No custom rates configured. Add custom pricing for specific users.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Regular Price</TableHead>
                  <TableHead>Custom Price</TableHead>
                  <TableHead>Savings</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rates.map((rate) => {
                  const regularPrice = getProductPrice(rate.product_id);
                  const savings = regularPrice - rate.custom_price;
                  const savingsPercent = regularPrice > 0 ? (savings / regularPrice) * 100 : 0;

                  return (
                    <TableRow key={rate.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{getUserName(rate.user_id)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          {getProductName(rate.product_id)}
                        </div>
                      </TableCell>
                      <TableCell>${regularPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className="font-medium text-green-600">${rate.custom_price.toFixed(2)}</span>
                      </TableCell>
                      <TableCell>
                        {savings > 0 ? (
                          <Badge variant="secondary">
                            -${savings.toFixed(2)} ({savingsPercent.toFixed(0)}%)
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {rate.is_active ? (
                          <Badge className="bg-green-500">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(rate)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(rate.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
