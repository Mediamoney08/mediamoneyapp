import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/db/supabase';
import type { PaymentMethod } from '@/types/types';
import { Upload, DollarSign, CheckCircle, Clock, XCircle, Wallet, CreditCard, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function AddBalancePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  // Payment requests history
  const [paymentRequests, setPaymentRequests] = useState<any[]>([]);

  useEffect(() => {
    loadPaymentMethods();
    loadPaymentRequests();
  }, [user]);

  const loadPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_active_payment_methods');
      
      if (error) {
        console.error('RPC error:', error);
        throw error;
      }
      
      console.log('Payment methods loaded:', data);
      setPaymentMethods(data || []);
    } catch (error) {
      console.error('Error loading payment methods:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payment methods',
        variant: 'destructive',
      });
    }
  };

  const loadPaymentRequests = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('payment_proofs')
        .select(`
          *,
          payment_methods (name, description)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      setPaymentRequests(data || []);
    } catch (error) {
      console.error('Error loading payment requests:', error);
    }
  };

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setShowRequestDialog(true);
    // Reset form
    setAmount('');
    setTransactionId('');
    setNotes('');
    setProofImage(null);
    setImagePreview('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'Image size must be less than 5MB',
          variant: 'destructive',
        });
        return;
      }
      setProofImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProofImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user!.id}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('app-8herke1wtngh_payment_proofs')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('app-8herke1wtngh_payment_proofs')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmitRequest = async () => {
    if (!user || !selectedMethod) return;

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: 'Error',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }

    const minAmount = selectedMethod.account_details?.min_amount || 1;
    const maxAmount = selectedMethod.account_details?.max_amount || 100000;

    if (amountNum < minAmount) {
      toast({
        title: 'Error',
        description: `Minimum amount is $${minAmount}`,
        variant: 'destructive',
      });
      return;
    }

    if (amountNum > maxAmount) {
      toast({
        title: 'Error',
        description: `Maximum amount is $${maxAmount}`,
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      let proofUrl = '';
      if (proofImage) {
        proofUrl = await uploadProofImage(proofImage);
      }

      const { error } = await supabase
        .from('payment_proofs')
        .insert({
          user_id: user.id,
          payment_method_id: selectedMethod.id,
          amount: amountNum,
          currency: 'USD',
          transaction_id: transactionId || null,
          proof_image_url: proofUrl || null,
          transaction_details: notes || null,
          status: 'pending',
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Payment request submitted successfully',
      });

      setShowRequestDialog(false);
      loadPaymentRequests();
    } catch (error: any) {
      console.error('Error submitting payment request:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit payment request',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500"><Clock className="w-3 h-3 mr-1" /> Processing</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Add Balance</h1>
        <p className="text-muted-foreground">
          Choose a payment method to add funds to your wallet
        </p>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {paymentMethods.map((method) => (
          <Card
            key={method.id}
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary"
            onClick={() => handleMethodSelect(method)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CreditCard className="w-8 h-8 text-primary" />
                {method.account_details?.commission > 0 && (
                  <Badge variant="secondary">{method.account_details.commission}% fee</Badge>
                )}
              </div>
              <CardTitle className="text-xl mt-2">{method.name}</CardTitle>
              <CardDescription className="text-sm">
                {method.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>Min: ${method.account_details?.min_amount || 1}</p>
                <p>Max: ${method.account_details?.max_amount || 10000}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Request Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              {selectedMethod?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedMethod?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Instructions */}
            {selectedMethod?.instructions && (
              <Card className="bg-muted">
                <CardContent className="pt-6">
                  <pre className="whitespace-pre-wrap text-sm font-sans">
                    {selectedMethod.instructions}
                  </pre>
                </CardContent>
              </Card>
            )}

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-9"
                  min={selectedMethod?.account_details?.min_amount || 1}
                  max={selectedMethod?.account_details?.max_amount || 100000}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Min: ${selectedMethod?.account_details?.min_amount || 1} - Max: ${selectedMethod?.account_details?.max_amount || 10000}
              </p>
            </div>

            {/* Transaction ID */}
            <div className="space-y-2">
              <Label htmlFor="transactionId">Transaction ID (Optional)</Label>
              <Input
                id="transactionId"
                placeholder="Enter transaction ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
            </div>

            {/* Payment Proof */}
            <div className="space-y-2">
              <Label htmlFor="proof">Payment Proof (Optional)</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Payment proof"
                      className="max-h-64 mx-auto rounded"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setProofImage(null);
                        setImagePreview('');
                      }}
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="proof" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload payment proof
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG up to 5MB
                    </p>
                    <input
                      id="proof"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowRequestDialog(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmitRequest}
                disabled={loading || !amount}
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Requests History */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Requests</h2>
        <div className="space-y-4">
          {paymentRequests.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Wallet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No payment requests yet</p>
              </CardContent>
            </Card>
          ) : (
            paymentRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">
                          {request.payment_methods?.name || 'Unknown Method'}
                        </h3>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Amount: ${request.amount}</p>
                        {request.transaction_id && (
                          <p>Transaction ID: {request.transaction_id}</p>
                        )}
                        <p>Date: {new Date(request.created_at).toLocaleString()}</p>
                        {request.admin_notes && (
                          <p className="text-red-500">Admin Note: {request.admin_notes}</p>
                        )}
                      </div>
                    </div>
                    {request.proof_image_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(request.proof_image_url, '_blank')}
                      >
                        View Proof
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
