import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getOrders, verifyPayment } from '@/db/api';
import type { Order } from '@/types/types';
import { Package, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const statusColors = {
  pending: 'bg-yellow-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500',
  refunded: 'bg-blue-500',
};

const statusLabels = {
  pending: 'Pending',
  completed: 'Completed',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export default function OrdersPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getOrders(user.id);
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (order: Order) => {
    if (!order.stripe_session_id) return;

    setVerifying(order.id);
    try {
      const result = await verifyPayment(order.stripe_session_id);
      
      if (result.verified) {
        toast({
          title: 'Payment Verified',
          description: 'Your payment has been confirmed',
        });
        await loadOrders();
      } else {
        toast({
          title: 'Payment Not Completed',
          description: 'Payment is still pending',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setVerifying(null);
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-muted-foreground">View and manage your order history</p>
          </div>
          <Button variant="outline" onClick={loadOrders} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48 bg-muted" />
                  <Skeleton className="h-4 w-32 bg-muted" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No orders yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                      <CardDescription>
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </CardDescription>
                    </div>
                    <Badge className={statusColors[order.status]}>
                      {statusLabels[order.status]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{item.name} x {item.quantity}</span>
                        <span className="font-medium">${((item.price / 100) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="font-semibold">Total</span>
                    <span className="text-lg font-bold text-primary">
                      ${order.total_amount.toFixed(2)} {order.currency.toUpperCase()}
                    </span>
                  </div>

                  {/* Actions */}
                  {order.status === 'pending' && order.stripe_session_id && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleVerifyPayment(order)}
                      disabled={verifying === order.id}
                    >
                      {verifying === order.id ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Check Payment Status'
                      )}
                    </Button>
                  )}

                  {order.status === 'completed' && order.completed_at && (
                    <div className="text-sm text-muted-foreground">
                      Completed on {new Date(order.completed_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
