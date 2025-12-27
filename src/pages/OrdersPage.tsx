import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getOrders, verifyPayment, getOrderStockCodes } from '@/db/api';
import type { Order, StockItem } from '@/types/types';
import { Package, RefreshCw, Key, Copy, Check, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import InvoiceDialog from '@/components/InvoiceDialog';

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
  const [stockCodes, setStockCodes] = useState<Record<string, StockItem[]>>({});
  const [loadingCodes, setLoadingCodes] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedReply, setCopiedReply] = useState<string | null>(null);

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

  const loadStockCodes = async (orderId: string) => {
    if (!user || stockCodes[orderId]) return;
    
    try {
      setLoadingCodes(orderId);
      const codes = await getOrderStockCodes(orderId, user.id);
      setStockCodes(prev => ({ ...prev, [orderId]: codes }));
    } catch (error) {
      console.error('Failed to load stock codes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load codes',
        variant: 'destructive',
      });
    } finally {
      setLoadingCodes(null);
    }
  };

  const copyCode = async (code: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(itemId);
      toast({
        title: 'Copied!',
        description: 'Code copied to clipboard',
      });
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy code',
        variant: 'destructive',
      });
    }
  };

  const copyReply = async (reply: string, orderId: string) => {
    try {
      await navigator.clipboard.writeText(reply);
      setCopiedReply(orderId);
      toast({
        title: 'Copied!',
        description: 'Provider reply copied to clipboard',
      });
      setTimeout(() => setCopiedReply(null), 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy reply',
        variant: 'destructive',
      });
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
            <h1 className="font-bold text-[18px]">My Orders</h1>
            <p className="text-muted-foreground text-[12px]">View and manage your order history</p>
          </div>
          <Button
            variant="outline"
            onClick={loadOrders}
            disabled={loading}
            className="bg-[#bb41ff] bg-none text-[10px] font-['BlinkMacSystemFont'] font-['SF Pro SC']">
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

                  {/* Provider Reply */}
                  {order.provider_reply && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-sm">Provider Response</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyReply(order.provider_reply!, order.id)}
                          className="h-7 px-2"
                        >
                          {copiedReply === order.id ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {order.provider_reply}
                      </p>
                      {order.provider_reply_at && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(order.provider_reply_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      )}
                    </div>
                  )}

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
                    <>
                      <div className="text-sm text-muted-foreground">
                        Completed on {new Date(order.completed_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      
                      <div className="flex gap-2 mt-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => loadStockCodes(order.id)}
                            >
                              <Key className="mr-2 h-4 w-4" />
                              View Codes
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Order Codes</DialogTitle>
                              <DialogDescription>
                                Your purchased codes for order #{order.id.slice(0, 8)}
                              </DialogDescription>
                            </DialogHeader>
                          
                          {loadingCodes === order.id ? (
                            <div className="space-y-2">
                              <Skeleton className="h-20 w-full bg-muted" />
                              <Skeleton className="h-20 w-full bg-muted" />
                            </div>
                          ) : stockCodes[order.id]?.length > 0 ? (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                              {stockCodes[order.id].map((item) => (
                                <Card key={item.id}>
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex-1">
                                        <div className="font-mono text-sm bg-muted p-3 rounded break-all">
                                          {item.code}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-2">
                                          Product ID: {item.product_id}
                                        </div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyCode(item.code, item.id)}
                                      >
                                        {copiedCode === item.id ? (
                                          <Check className="h-4 w-4 text-green-500" />
                                        ) : (
                                          <Copy className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              No codes available for this order
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <InvoiceDialog order={order} />
                    </div>
                    </>
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
