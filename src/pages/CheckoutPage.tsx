import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { createCheckoutSession } from '@/db/api';
import type { Product } from '@/types/types';
import { CreditCard, Wallet, ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('card');
  const [playerId, setPlayerId] = useState('');

  const product = location.state?.product as Product | undefined;

  if (!product) {
    navigate('/');
    return null;
  }

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (paymentMethod === 'wallet') {
      if (!profile || profile.wallet_balance < product.price) {
        toast({
          title: 'Insufficient Balance',
          description: 'Please add balance to your wallet',
          variant: 'destructive',
        });
        return;
      }
      // TODO: Implement wallet payment
      toast({
        title: 'Coming Soon',
        description: 'Wallet payment will be available soon',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await createCheckoutSession({
        items: [
          {
            product_id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image_url: product.image_url,
          },
        ],
        currency: product.currency,
        player_id: playerId || undefined,
      });

      window.open(response.url, '_blank');
      
      toast({
        title: 'Redirecting to Payment',
        description: 'Please complete your payment in the new window',
      });

      // Navigate to orders page after a delay
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: error.message || 'Failed to initiate payment',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative h-48 rounded-lg overflow-hidden bg-muted">
                <img
                  src={product.image_url || 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=400'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-muted-foreground">Price</span>
                <span className="text-2xl font-bold text-primary">
                  ${product.price.toFixed(2)} {product.currency.toUpperCase()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Choose how you want to pay</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'wallet' | 'card')}>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Credit/Debit Card</p>
                          <p className="text-xs text-muted-foreground">Pay securely with Stripe</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 rounded-lg border border-border cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Label htmlFor="wallet" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Wallet className="h-5 w-5" />
                          <div>
                            <p className="font-medium">Wallet Balance</p>
                            <p className="text-xs text-muted-foreground">
                              Available: ${profile?.wallet_balance?.toFixed(2) || '0.00'}
                            </p>
                          </div>
                        </div>
                        {profile && profile.wallet_balance < product.price && (
                          <span className="text-xs text-red-500">Insufficient</span>
                        )}
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {(product.category === 'game' || product.category === 'app') && (
              <Card>
                <CardHeader>
                  <CardTitle>Player Information</CardTitle>
                  <CardDescription>Enter your player ID for delivery</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="player-id">Player ID (Optional)</Label>
                    <Input
                      id="player-id"
                      placeholder="Enter your player ID"
                      value={playerId}
                      onChange={(e) => setPlayerId(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      If provided, the product will be delivered directly to this ID
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardFooter className="pt-6">
                <Button
                  className="w-full gradient-bg"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : `Pay $${product.price.toFixed(2)}`}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
