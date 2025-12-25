import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
  uploadStockItems, 
  getStockItems, 
  getAvailableStockCount,
  deleteStockItem,
  getAllProductsAdmin 
} from '@/db/api';
import type { StockItem, Product } from '@/types/types';
import { Package, Upload, Trash2, Filter } from 'lucide-react';
import { format } from 'date-fns';

export default function StockManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  // Upload form state
  const [uploadProductId, setUploadProductId] = useState('');
  const [uploadCodes, setUploadCodes] = useState('');
  const [uploadNotes, setUploadNotes] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      loadStockItems();
    }
  }, [selectedProduct, statusFilter]);

  const loadProducts = async () => {
    try {
      const data = await getAllProductsAdmin();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive',
      });
    }
  };

  const loadStockItems = async () => {
    if (!selectedProduct) return;
    
    setLoading(true);
    try {
      const status = statusFilter === 'all' ? undefined : statusFilter as any;
      const data = await getStockItems(selectedProduct, status);
      setStockItems(data);
    } catch (error) {
      console.error('Error loading stock items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load stock items',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadStock = async () => {
    if (!uploadProductId || !uploadCodes.trim() || !user) {
      toast({
        title: 'Error',
        description: 'Please select a product and enter codes',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const codes = uploadCodes.split('\n').filter(code => code.trim());
      const result = await uploadStockItems(uploadProductId, codes, user.id, uploadNotes);

      toast({
        title: 'Upload Complete',
        description: `Successfully uploaded ${result.success} items. Failed: ${result.failed}`,
      });

      setUploadDialogOpen(false);
      setUploadCodes('');
      setUploadNotes('');
      setUploadProductId('');
      
      if (selectedProduct === uploadProductId) {
        loadStockItems();
      }
    } catch (error) {
      console.error('Error uploading stock:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload stock items',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteStock = async (stockId: string) => {
    if (!confirm('Are you sure you want to delete this stock item?')) return;

    try {
      await deleteStockItem(stockId);
      toast({
        title: 'Success',
        description: 'Stock item deleted successfully',
      });
      loadStockItems();
    } catch (error) {
      console.error('Error deleting stock:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete stock item',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      available: 'default',
      reserved: 'secondary',
      sold: 'destructive',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Stock Management</h2>
          <p className="text-muted-foreground">Manage gift cards, codes, and digital products</p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload Stock
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Stock Items</DialogTitle>
              <DialogDescription>
                Upload gift card codes, Netflix accounts, or other digital products
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="upload-product">Product</Label>
                <Select value={uploadProductId} onValueChange={setUploadProductId}>
                  <SelectTrigger id="upload-product">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="upload-codes">Codes (one per line)</Label>
                <Textarea
                  id="upload-codes"
                  value={uploadCodes}
                  onChange={(e) => setUploadCodes(e.target.value)}
                  placeholder="CODE1&#10;CODE2&#10;CODE3"
                  rows={10}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {uploadCodes.split('\n').filter(c => c.trim()).length} codes entered
                </p>
              </div>
              <div>
                <Label htmlFor="upload-notes">Notes (optional)</Label>
                <Input
                  id="upload-notes"
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  placeholder="Batch description or notes"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUploadStock} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="product-filter">Product</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger id="product-filter">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stock Items Table */}
      {selectedProduct ? (
        <Card>
          <CardHeader>
            <CardTitle>Stock Items</CardTitle>
            <CardDescription>
              {stockItems.length} items found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : stockItems.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No stock items found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockItems.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-sm">
                          {item.code.substring(0, 20)}
                          {item.code.length > 20 && '...'}
                        </TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {item.order_id ? item.order_id.substring(0, 8) : '-'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {format(new Date(item.created_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          {item.status === 'available' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteStock(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Select a product to view stock items</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
