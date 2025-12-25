import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { getProducts, getProductFields, createProductField, updateProductField, deleteProductField } from '@/db/api';
import type { Product, ProductField } from '@/types/types';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProductFieldsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [fields, setFields] = useState<ProductField[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<ProductField | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    field_name: '',
    field_value: '',
    field_order: 0,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      loadFields(selectedProduct.id);
    }
  }, [selectedProduct]);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
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

  const loadFields = async (productId: string) => {
    setLoading(true);
    try {
      const data = await getProductFields(productId);
      setFields(data);
    } catch (error) {
      console.error('Error loading fields:', error);
      toast({
        title: 'Error',
        description: 'Failed to load product fields',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      if (editingField) {
        await updateProductField(editingField.id, formData);
        toast({
          title: 'Success',
          description: 'Field updated successfully',
        });
      } else {
        await createProductField({
          product_id: selectedProduct.id,
          ...formData,
        });
        toast({
          title: 'Success',
          description: 'Field added successfully',
        });
      }
      
      setDialogOpen(false);
      resetForm();
      loadFields(selectedProduct.id);
    } catch (error) {
      console.error('Error saving field:', error);
      toast({
        title: 'Error',
        description: 'Failed to save field',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (fieldId: string) => {
    if (!confirm('Are you sure you want to delete this field?')) return;

    try {
      await deleteProductField(fieldId);
      toast({
        title: 'Success',
        description: 'Field deleted successfully',
      });
      if (selectedProduct) {
        loadFields(selectedProduct.id);
      }
    } catch (error) {
      console.error('Error deleting field:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete field',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (field: ProductField) => {
    setEditingField(field);
    setFormData({
      field_name: field.field_name,
      field_value: field.field_value,
      field_order: field.field_order,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      field_name: '',
      field_value: '',
      field_order: 0,
    });
    setEditingField(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Fields Management</CardTitle>
          <CardDescription>
            Add unlimited custom fields to products (e.g., Player ID, Region, Platform)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Product Selection */}
          <div className="space-y-2">
            <Label>Select Product</Label>
            <Select
              value={selectedProduct?.id || ''}
              onValueChange={(value) => {
                const product = products.find((p) => p.id === value);
                setSelectedProduct(product || null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} - {product.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fields List */}
          {selectedProduct && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Custom Fields ({fields.length})
                </h3>
                <Dialog open={dialogOpen} onOpenChange={(open) => {
                  setDialogOpen(open);
                  if (!open) resetForm();
                }}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Field
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingField ? 'Edit Field' : 'Add New Field'}
                      </DialogTitle>
                      <DialogDescription>
                        Add custom information fields for this product
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="field_name">Field Name</Label>
                        <Input
                          id="field_name"
                          value={formData.field_name}
                          onChange={(e) =>
                            setFormData({ ...formData, field_name: e.target.value })
                          }
                          placeholder="e.g., Player ID, Region, Platform"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="field_value">Field Value</Label>
                        <Input
                          id="field_value"
                          value={formData.field_value}
                          onChange={(e) =>
                            setFormData({ ...formData, field_value: e.target.value })
                          }
                          placeholder="e.g., Required, Global, PC/Mobile"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="field_order">Display Order</Label>
                        <Input
                          id="field_order"
                          type="number"
                          value={formData.field_order}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              field_order: parseInt(e.target.value) || 0,
                            })
                          }
                          min="0"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1">
                          {editingField ? 'Update' : 'Add'} Field
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setDialogOpen(false);
                            resetForm();
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading fields...
                </div>
              ) : fields.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No custom fields added yet. Click "Add Field" to create one.
                </div>
              ) : (
                <div className="space-y-2">
                  {fields.map((field) => (
                    <Card key={field.id}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{field.field_name}:</span>
                            <span className="text-muted-foreground">{field.field_value}</span>
                            <Badge variant="outline">Order: {field.field_order}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(field)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(field.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
