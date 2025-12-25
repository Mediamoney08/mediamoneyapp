import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createCheckoutSession } from '@/db/api';
import { CreditCard, DollarSign } from 'lucide-react';

const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500];

export default function AddBalancePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePresetAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleAddBalance = async () => {
    const amountNum = parseFloat(amount);
    
    if (!amountNum || amountNum <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }

    if (amountNum < 1) {
      toast({
        title: 'Minimum Amount',
        description: 'Minimum top-up amount is $1.00',
        variant: 'destructive',
      });
      return;
    }

    if (amountNum > 10000) {
      toast({
        title: 'Maximum Amount',
        description: 'Maximum top-up amount is $10,000.00',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await createCheckoutSession({
        items: [
          {
            product_id: 'balance-topup',
            name: 'Wallet Balance Top-up',
            price: amountNum,
            quantity: 1,
          },
        ],
        currency: 'usd',
      });

      window.open(response.url, '_blank');
      
      toast({
        title: 'Redirecting to Payment',
        description: 'Please complete your payment in the new window',
      });
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: error.message || 'Failed to initiate payment. Please ensure STRIPE_SECRET_KEY is configured.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Add Balance</h1>
          <p className="text-muted-foreground">Top up your wallet to make purchases</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Amount</CardTitle>
            <CardDescription>Choose a preset amount or enter a custom value</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preset Amounts */}
            <div className="grid grid-cols-3 gap-4">
              {PRESET_AMOUNTS.map((preset) => (
                <Button
                  key={preset}
                  variant={amount === preset.toString() ? 'default' : 'outline'}
                  className={amount === preset.toString() ? 'gradient-bg' : ''}
                  onClick={() => handlePresetAmount(preset)}
                >
                  ${preset}
                </Button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="space-y-2">
              <Label htmlFor="custom-amount">Custom Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="custom-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10"
                  min="1"
                  max="10000"
                  step="0.01"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum: $1.00 | Maximum: $10,000.00
              </p>
            </div>

            {/* Payment Button */}
            <Button
              className="w-full gradient-bg"
              size="lg"
              onClick={handleAddBalance}
              disabled={loading || !amount}
            >
              <CreditCard className="mr-2 h-5 w-5" />
              {loading ? 'Processing...' : `Add $${amount || '0.00'} to Wallet`}
            </Button>

            {/* Payment Info */}
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-sm">Payment Information</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Secure payment powered by Stripe</li>
                <li>• Instant balance update after payment</li>
                <li>• All major credit cards accepted</li>
                <li>• 100% secure and encrypted</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
