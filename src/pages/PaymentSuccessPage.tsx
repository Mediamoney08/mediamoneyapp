import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { verifyPayment } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      setStatus('failed');
      setMessage('No payment session found');
      return;
    }

    verifyPaymentStatus(sessionId);
  }, [searchParams]);

  const verifyPaymentStatus = async (sessionId: string) => {
    try {
      const result = await verifyPayment(sessionId);
      
      if (result.verified && result.status === 'paid') {
        setStatus('success');
        setMessage('Payment completed successfully!');
        await refreshProfile();
      } else {
        setStatus('failed');
        setMessage('Payment verification failed. Please contact support.');
      }
    } catch (error: any) {
      console.error('Payment verification error:', error);
      setStatus('failed');
      setMessage(error.message || 'Failed to verify payment');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === 'loading' && (
            <div className="mx-auto mb-4">
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
            </div>
          )}
          {status === 'success' && (
            <div className="mx-auto mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
          )}
          {status === 'failed' && (
            <div className="mx-auto mb-4">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
          )}
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Processing Payment'}
            {status === 'success' && 'Payment Successful!'}
            {status === 'failed' && 'Payment Failed'}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'success' && (
            <>
              <p className="text-center text-sm text-muted-foreground">
                Your wallet balance has been updated. You can now use your funds to make purchases.
              </p>
              <div className="flex flex-col space-y-2">
                <Button onClick={() => navigate('/wallet')} className="gradient-bg">
                  View Wallet
                </Button>
                <Button variant="outline" onClick={() => navigate('/')}>
                  Continue Shopping
                </Button>
              </div>
            </>
          )}
          {status === 'failed' && (
            <>
              <p className="text-center text-sm text-muted-foreground">
                If you believe this is an error, please contact our support team.
              </p>
              <div className="flex flex-col space-y-2">
                <Button onClick={() => navigate('/support')} variant="outline">
                  Contact Support
                </Button>
                <Button onClick={() => navigate('/')}>
                  Return Home
                </Button>
              </div>
            </>
          )}
          {status === 'loading' && (
            <p className="text-center text-sm text-muted-foreground">
              Please wait while we verify your payment...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
