import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getProduct, purchaseWithWallet, getProfile } from '@/db/api';
import type { Product, Profile } from '@/types/types';
import { Wallet, ShoppingCart, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [playerId, setPlayerId] = useState('');
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const productId = searchParams.get('product');
    if (!productId) {
      navigate('/');
      return;
    }
    loadData(productId);
  }, [searchParams, user]);

  const loadData = async (productId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const [productData, profileData] = await Promise.all([
        getProduct(productId),
        getProfile(user.id),
      ]);

      if (!productData) {
        toast({
          title: 'Product Not Found',
          description: 'The requested product could not be found',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }

      setProduct(productData);
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load product information',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!product || !user) return;

    const totalAmount = product.price * quantity;

    if (!profile || profile.wallet_balance < totalAmount) {
      toast({
        title: 'Insufficient Balance',
        description: 'Please add funds to your wallet first',
        variant: 'destructive',
      });
      return;
    }

    if (product.stock_quantity < quantity) {
      toast({
        title: 'Insufficient Stock',
        description: 'Not enough items in stock',
        variant: 'destructive',
      });
      return;
    }

    setPurchasing(true);
    try {
      await purchaseWithWallet(product.id, quantity, playerId || undefined);

      toast({
        title: 'Purchase Successful',
        description: 'Your order has been completed successfully',
      });

      navigate('/orders');
    } catch (error: any) {
      console.error('Error purchasing:', error);
      toast({
        title: 'Purchase Failed',
        description: error.message || 'Failed to complete purchase',
        variant: 'destructive',
      });
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const totalAmount = product.price * quantity;
  const hasInsufficientBalance = !profile || profile.wallet_balance < totalAmount;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground">
          Complete your purchase using wallet balance
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  {product.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {product.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-4">
                    <span className="text-lg font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Stock: {product.stock_quantity}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={product.stock_quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>

                {product.category === 'game' && (
                  <div className="space-y-2">
                    <Label htmlFor="player-id">Player ID (Optional)</Label>
                    <Input
                      id="player-id"
                      placeholder="Enter your player ID"
                      value={playerId}
                      onChange={(e) => setPlayerId(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter your in-game player ID for automatic delivery
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Wallet Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Available Balance</div>
                <div className="text-2xl font-bold">
                  ${profile?.wallet_balance.toFixed(2) || '0.00'}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${(product.price * quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">${totalAmount.toFixed(2)}</span>
                </div>
                {profile && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Balance After</span>
                    <span>${(profile.wallet_balance - totalAmount).toFixed(2)}</span>
                  </div>
                )}
              </div>

              {hasInsufficientBalance && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Insufficient balance. Please add funds to your wallet.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Button
                  onClick={handlePurchase}
                  disabled={purchasing || hasInsufficientBalance || product.stock_quantity < quantity}
                  className="w-full"
                  size="lg"
                >
                  {purchasing ? 'Processing...' : 'Complete Purchase'}
                </Button>

                {hasInsufficientBalance && (
                  <Button
                    variant="outline"
                    onClick={() => navigate('/add-balance')}
                    className="w-full"
                  >
                    Add Balance
                  </Button>
                )}

                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-sm">Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm">
                <Wallet className="w-4 h-4 text-primary" />
                <span>Wallet Balance Only</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                All purchases must be made using your wallet balance. Add funds to your wallet to continue.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
