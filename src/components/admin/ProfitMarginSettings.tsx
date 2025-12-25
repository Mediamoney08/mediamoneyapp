import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  getGlobalProfitMargin, 
  updateGlobalProfitMargin,
  getAllProductsAdmin,
  updateProduct
} from '@/db/api';
import type { Product } from '@/types/types';
import { TrendingUp, Save, RefreshCw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function ProfitMarginSettings() {
  const [globalMargin, setGlobalMargin] = useState(10);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [margin, productsData] = await Promise.all([
        getGlobalProfitMargin(),
        getAllProductsAdmin(),
      ]);
      setGlobalMargin(margin);
      setProducts(productsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load profit margin settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGlobalMargin = async () => {
    try {
      setSaving(true);
      await updateGlobalProfitMargin(globalMargin);
      toast({
        title: 'Success',
        description: 'Global profit margin updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update global profit margin',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProductMargin = async (productId: string, margin: number, useGlobal: boolean) => {
    try {
      await updateProduct(productId, {
        profit_margin: margin,
        use_global_margin: useGlobal,
      } as any);
      toast({
        title: 'Success',
        description: 'Product profit margin updated',
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update product margin',
        variant: 'destructive',
      });
    }
  };

  const calculateFinalPrice = (basePrice: number, margin: number) => {
    return basePrice * (1 + margin / 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Profit Margin Settings</h2>
        <p className="text-muted-foreground">Configure markup percentages for products</p>
      </div>

      {/* Global Profit Margin */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Global Profit Margin
          </CardTitle>
          <CardDescription>
            Default profit margin applied to all products using global settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="flex-1 max-w-xs space-y-2">
              <Label htmlFor="global_margin">Profit Margin (%)</Label>
              <Input
                id="global_margin"
                type="number"
                min="0"
                max="1000"
                step="0.01"
                value={globalMargin}
                onChange={(e) => setGlobalMargin(parseFloat(e.target.value))}
              />
            </div>
            <Button onClick={handleSaveGlobalMargin} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Global Margin'}
            </Button>
          </div>
          <div className="mt-4 p-4 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">
              Example: With {globalMargin}% margin, a $100 product will be sold for ${calculateFinalPrice(100, globalMargin).toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Product-Specific Margins */}
      <Card>
        <CardHeader>
          <CardTitle>Product-Specific Margins</CardTitle>
          <CardDescription>
            Override global margin for individual products
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No products available
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Margin Type</TableHead>
                  <TableHead>Margin %</TableHead>
                  <TableHead>Final Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const basePrice = (product as any).base_price || product.price;
                  const useGlobal = (product as any).use_global_margin !== false;
                  const margin = useGlobal ? globalMargin : ((product as any).profit_margin || 10);
                  const finalPrice = calculateFinalPrice(basePrice, margin);

                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>${basePrice.toFixed(2)}</TableCell>
                      <TableCell>
                        {useGlobal ? (
                          <Badge variant="secondary">Global</Badge>
                        ) : (
                          <Badge>Custom</Badge>
                        )}
                      </TableCell>
                      <TableCell>{margin.toFixed(2)}%</TableCell>
                      <TableCell className="font-medium">${finalPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newMargin = prompt(`Enter custom margin for ${product.name} (%)`, margin.toString());
                            if (newMargin !== null) {
                              handleUpdateProductMargin(product.id, parseFloat(newMargin), false);
                            }
                          }}
                        >
                          Set Custom
                        </Button>
                        {!useGlobal && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateProductMargin(product.id, globalMargin, true)}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
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
