import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  getAllCategoriesAdmin, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllUsers,
  updateUserProfile,
  updateUserBalance,
  getAllOrdersAdmin,
  updateOrderStatus,
  refundOrder,
  getAllPaymentProofs,
  updatePaymentProofStatus,
  getAllPaymentMethodsAdmin,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  getProfile
} from '@/db/api';
import type { Category, Product, Profile, Order, PaymentProof, PaymentMethod, ServiceCategory } from '@/types/types';
import { 
  Shield, 
  Package, 
  Users, 
  ShoppingCart, 
  CreditCard, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminManagementPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('categories');

  // Categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    service_type: 'game' as ServiceCategory,
    description: '',
    image_url: '',
    icon: '',
    display_order: 0,
    is_active: true
  });

  // Products
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category_id: '',
    service_name: '',
    price: 0,
    currency: 'usd',
    image_url: '',
    stock_quantity: 0,
    is_active: true
  });

  // Users
  const [users, setUsers] = useState<Profile[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [balanceAdjustment, setBalanceAdjustment] = useState({ amount: 0, description: '' });

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Payment Proofs
  const [paymentProofs, setPaymentProofs] = useState<PaymentProof[]>([]);
  const [selectedProof, setSelectedProof] = useState<PaymentProof | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  // Payment Methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethod | null>(null);
  const [paymentMethodForm, setPaymentMethodForm] = useState({
    name: '',
    description: '',
    icon_url: '',
    instructions: '',
    account_details: '',
    is_active: true,
    display_order: 0
  });

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin, activeTab]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const profile = await getProfile(user.id);
      if (!profile || profile.role !== 'admin') {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access this page',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }
      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      switch (activeTab) {
        case 'categories':
          const cats = await getAllCategoriesAdmin();
          setCategories(cats);
          break;
        case 'products':
          const prods = await getAllProductsAdmin();
          setProducts(prods);
          const allCats = await getAllCategoriesAdmin();
          setCategories(allCats);
          break;
        case 'users':
          const usrs = await getAllUsers();
          setUsers(usrs);
          break;
        case 'orders':
          const ords = await getAllOrdersAdmin();
          setOrders(ords);
          break;
        case 'payments':
          const proofs = await getAllPaymentProofs();
          setPaymentProofs(proofs);
          break;
        case 'payment-methods':
          const methods = await getAllPaymentMethodsAdmin();
          setPaymentMethods(methods);
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
    }
  };

  // Category Management
  const handleSaveCategory = async () => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryForm);
        toast({ title: 'Category Updated', description: 'Category has been updated successfully' });
      } else {
        await createCategory(categoryForm);
        toast({ title: 'Category Created', description: 'Category has been created successfully' });
      }
      setEditingCategory(null);
      setCategoryForm({
        name: '',
        service_type: 'game',
        description: '',
        image_url: '',
        icon: '',
        display_order: 0,
        is_active: true
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save category',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteCategory(id);
      toast({ title: 'Category Deleted', description: 'Category has been deleted successfully' });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete category',
        variant: 'destructive',
      });
    }
  };

  // Product Management
  const handleSaveProduct = async () => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productForm);
        toast({ title: 'Product Updated', description: 'Product has been updated successfully' });
      } else {
        await createProduct(productForm);
        toast({ title: 'Product Created', description: 'Product has been created successfully' });
      }
      setEditingProduct(null);
      setProductForm({
        name: '',
        description: '',
        category_id: '',
        service_name: '',
        price: 0,
        currency: 'usd',
        image_url: '',
        stock_quantity: 0,
        is_active: true
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save product',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      toast({ title: 'Product Deleted', description: 'Product has been deleted successfully' });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  // User Management
  const handleUpdateUserBalance = async () => {
    if (!selectedUser) return;
    try {
      await updateUserBalance(selectedUser.id, balanceAdjustment.amount, balanceAdjustment.description);
      toast({ title: 'Balance Updated', description: 'User balance has been updated successfully' });
      setSelectedUser(null);
      setBalanceAdjustment({ amount: 0, description: '' });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update balance',
        variant: 'destructive',
      });
    }
  };

  const handleToggleUserRole = async (userId: string, currentRole: string) => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      await updateUserProfile(userId, { role: newRole });
      toast({ title: 'Role Updated', description: `User role has been updated to ${newRole}` });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update role',
        variant: 'destructive',
      });
    }
  };

  // Order Management
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      toast({ title: 'Order Updated', description: 'Order status has been updated successfully' });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update order',
        variant: 'destructive',
      });
    }
  };

  const handleRefundOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to refund this order?')) return;
    try {
      await refundOrder(orderId);
      toast({ title: 'Order Refunded', description: 'Order has been refunded successfully' });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to refund order',
        variant: 'destructive',
      });
    }
  };

  // Payment Proof Management
  const handleUpdatePaymentProof = async (proofId: string, status: 'approved' | 'rejected') => {
    try {
      await updatePaymentProofStatus(proofId, status, adminNotes || undefined);
      toast({ title: 'Payment Updated', description: `Payment has been ${status}` });
      setSelectedProof(null);
      setAdminNotes('');
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update payment',
        variant: 'destructive',
      });
    }
  };

  // Payment Method Management
  const handleSavePaymentMethod = async () => {
    try {
      if (editingPaymentMethod) {
        await updatePaymentMethod(editingPaymentMethod.id, paymentMethodForm);
        toast({ title: 'Payment Method Updated', description: 'Payment method has been updated successfully' });
      } else {
        await createPaymentMethod(paymentMethodForm);
        toast({ title: 'Payment Method Created', description: 'Payment method has been created successfully' });
      }
      setEditingPaymentMethod(null);
      setPaymentMethodForm({
        name: '',
        description: '',
        icon_url: '',
        instructions: '',
        account_details: '',
        is_active: true,
        display_order: 0
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save payment method',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return;
    try {
      await deletePaymentMethod(id);
      toast({ title: 'Payment Method Deleted', description: 'Payment method has been deleted successfully' });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete payment method',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />{status}</Badge>;
      case 'rejected':
      case 'cancelled':
      case 'refunded':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />{status}</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Admin Management</h1>
        </div>
        <p className="text-muted-foreground">
          Complete control over your platform
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 mb-8">
          <TabsTrigger value="categories">
            <Package className="w-4 h-4 mr-2" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="products">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Products
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="orders">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="w-4 h-4 mr-2" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="payment-methods">
            <Settings className="w-4 h-4 mr-2" />
            Methods
          </TabsTrigger>
        </TabsList>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Category Management</CardTitle>
                  <CardDescription>Manage product categories</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingCategory(null);
                      setCategoryForm({
                        name: '',
                        service_type: 'game',
                        description: '',
                        image_url: '',
                        icon: '',
                        display_order: 0,
                        is_active: true
                      });
                    }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
                      <DialogDescription>
                        {editingCategory ? 'Update category details' : 'Create a new category'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cat-name">Name</Label>
                        <Input
                          id="cat-name"
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cat-service">Service Type</Label>
                        <Select
                          value={categoryForm.service_type}
                          onValueChange={(value) => setCategoryForm({ ...categoryForm, service_type: value as ServiceCategory })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="game">Game</SelectItem>
                            <SelectItem value="streaming">Streaming</SelectItem>
                            <SelectItem value="gift_card">Gift Card</SelectItem>
                            <SelectItem value="app">App</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="cat-desc">Description</Label>
                        <Textarea
                          id="cat-desc"
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cat-image">Image URL</Label>
                        <Input
                          id="cat-image"
                          value={categoryForm.image_url}
                          onChange={(e) => setCategoryForm({ ...categoryForm, image_url: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cat-order">Display Order</Label>
                        <Input
                          id="cat-order"
                          type="number"
                          value={categoryForm.display_order}
                          onChange={(e) => setCategoryForm({ ...categoryForm, display_order: parseInt(e.target.value) })}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="cat-active"
                          checked={categoryForm.is_active}
                          onChange={(e) => setCategoryForm({ ...categoryForm, is_active: e.target.checked })}
                        />
                        <Label htmlFor="cat-active">Active</Label>
                      </div>
                      <Button onClick={handleSaveCategory} className="w-full">
                        <Save className="w-4 h-4 mr-2" />
                        Save Category
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.id} className="border border-border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {category.image_url && (
                        <img src={category.image_url} alt={category.name} className="w-16 h-16 object-cover rounded" />
                      )}
                      <div>
                        <div className="font-semibold">{category.name}</div>
                        <div className="text-sm text-muted-foreground">{category.service_type}</div>
                        {category.description && (
                          <div className="text-sm text-muted-foreground">{category.description}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {category.is_active ? (
                        <Badge className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingCategory(category);
                              setCategoryForm({
                                name: category.name,
                                service_type: category.service_type,
                                description: category.description || '',
                                image_url: category.image_url || '',
                                icon: category.icon || '',
                                display_order: category.display_order,
                                is_active: category.is_active
                              });
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                            <DialogDescription>Update category details</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="edit-cat-name">Name</Label>
                              <Input
                                id="edit-cat-name"
                                value={categoryForm.name}
                                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-cat-service">Service Type</Label>
                              <Select
                                value={categoryForm.service_type}
                                onValueChange={(value) => setCategoryForm({ ...categoryForm, service_type: value as ServiceCategory })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="game">Game</SelectItem>
                                  <SelectItem value="streaming">Streaming</SelectItem>
                                  <SelectItem value="gift_card">Gift Card</SelectItem>
                                  <SelectItem value="app">App</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="edit-cat-desc">Description</Label>
                              <Textarea
                                id="edit-cat-desc"
                                value={categoryForm.description}
                                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-cat-image">Image URL</Label>
                              <Input
                                id="edit-cat-image"
                                value={categoryForm.image_url}
                                onChange={(e) => setCategoryForm({ ...categoryForm, image_url: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-cat-order">Display Order</Label>
                              <Input
                                id="edit-cat-order"
                                type="number"
                                value={categoryForm.display_order}
                                onChange={(e) => setCategoryForm({ ...categoryForm, display_order: parseInt(e.target.value) })}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="edit-cat-active"
                                checked={categoryForm.is_active}
                                onChange={(e) => setCategoryForm({ ...categoryForm, is_active: e.target.checked })}
                              />
                              <Label htmlFor="edit-cat-active">Active</Label>
                            </div>
                            <Button onClick={handleSaveCategory} className="w-full">
                              <Save className="w-4 h-4 mr-2" />
                              Save Category
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab - Similar structure, truncated for brevity */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>Manage products and services</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Product management interface - {products.length} products</p>
              {/* Full product CRUD interface would go here */}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs would follow similar pattern */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User management interface - {users.length} users</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>Manage orders and refunds</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Order management interface - {orders.length} orders</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Proof Management</CardTitle>
              <CardDescription>Review and approve payment proofs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Payment management interface - {paymentProofs.length} proofs</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-methods">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method Management</CardTitle>
              <CardDescription>Manage available payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Payment method management - {paymentMethods.length} methods</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
