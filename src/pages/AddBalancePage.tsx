import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getPaymentMethods, createPaymentProof, getPaymentProofs } from '@/db/api';
import { supabase } from '@/db/supabase';
import type { PaymentMethod, PaymentProof } from '@/types/types';
import { Upload, DollarSign, CheckCircle, Clock, XCircle, Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500];

export default function AddBalancePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [transactionId, setTransactionId] = useState('');
  const [transactionDetails, setTransactionDetails] = useState('');
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [paymentProofs, setPaymentProofs] = useState<PaymentProof[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadPaymentMethods();
    loadPaymentProofs();
  }, [user]);

  const loadPaymentMethods = async () => {
    try {
      const methods = await getPaymentMethods();
      setPaymentMethods(methods);
      if (methods.length > 0) {
        setSelectedMethod(methods[0].id);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  const loadPaymentProofs = async () => {
    if (!user) return;
    try {
      const proofs = await getPaymentProofs(user.id);
      setPaymentProofs(proofs);
    } catch (error) {
      console.error('Error loading payment proofs:', error);
    }
  };

  const handlePresetAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 1MB)
    if (file.size > 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Please upload an image smaller than 1MB',
        variant: 'destructive',
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    setProofImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadProofImage = async (): Promise<string | null> => {
    if (!proofImage || !user) return null;

    setUploading(true);
    try {
      // Create a unique filename
      const fileExt = proofImage.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}_payment_proof.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('app-8herke1wtngh_payment_proofs')
        .upload(fileName, proofImage);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('app-8herke1wtngh_payment_proofs')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload payment proof image',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitProof = async () => {
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

    if (!selectedMethod) {
      toast({
        title: 'Payment Method Required',
        description: 'Please select a payment method',
        variant: 'destructive',
      });
      return;
    }

    if (!proofImage) {
      toast({
        title: 'Payment Proof Required',
        description: 'Please upload a payment proof image',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Upload image first
      const imageUrl = await uploadProofImage();
      if (!imageUrl) {
        setLoading(false);
        return;
      }

      // Create payment proof
      await createPaymentProof({
        payment_method_id: selectedMethod,
        amount: amountNum,
        currency: 'usd',
        transaction_id: transactionId || undefined,
        transaction_details: transactionDetails || undefined,
        proof_image_url: imageUrl,
      });

      toast({
        title: 'Payment Proof Submitted',
        description: 'Your payment proof has been submitted for review. You will be notified once approved.',
      });

      // Reset form
      setAmount('');
      setTransactionId('');
      setTransactionDetails('');
      setProofImage(null);
      setImagePreview('');
      
      // Reload payment proofs
      await loadPaymentProofs();
    } catch (error: any) {
      console.error('Error submitting payment proof:', error);
      toast({
        title: 'Submission Failed',
        description: error.message || 'Failed to submit payment proof',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };

  const selectedMethodInfo = paymentMethods.find(m => m.id === selectedMethod);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Add Balance</h1>
        <p className="text-muted-foreground">
          Top up your wallet by submitting payment proof
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Submit Payment Proof
            </CardTitle>
            <CardDescription>
              Complete your payment and upload proof for verification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Amount Selection */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="0.01"
              />
              <div className="grid grid-cols-3 gap-2 mt-2">
                {PRESET_AMOUNTS.map((preset) => (
                  <Button
                    key={preset}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresetAmount(preset)}
                    className="w-full"
                  >
                    ${preset}
                  </Button>
                ))}
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <select
                id="payment-method"
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md"
              >
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
              {selectedMethodInfo?.instructions && (
                <p className="text-sm text-muted-foreground mt-2">
                  {selectedMethodInfo.instructions}
                </p>
              )}
            </div>

            {/* Transaction ID */}
            <div className="space-y-2">
              <Label htmlFor="transaction-id">Transaction ID (Optional)</Label>
              <Input
                id="transaction-id"
                placeholder="Enter transaction ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
            </div>

            {/* Transaction Details */}
            <div className="space-y-2">
              <Label htmlFor="transaction-details">Transaction Details (Optional)</Label>
              <Textarea
                id="transaction-details"
                placeholder="Add any additional details about your payment"
                value={transactionDetails}
                onChange={(e) => setTransactionDetails(e.target.value)}
                rows={3}
              />
            </div>

            {/* Payment Proof Upload */}
            <div className="space-y-2">
              <Label htmlFor="proof-image">Payment Proof Image *</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Payment proof preview"
                      className="max-h-48 mx-auto rounded-lg"
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
                  <div className="space-y-2">
                    <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground" />
                    <div>
                      <Label htmlFor="proof-image" className="cursor-pointer text-primary hover:underline">
                        Click to upload
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG up to 1MB
                      </p>
                    </div>
                  </div>
                )}
                <Input
                  id="proof-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            <Button
              onClick={handleSubmitProof}
              disabled={loading || uploading}
              className="w-full bg-[#c744eee6] bg-none"
              size="lg"
            >
              {loading || uploading ? (
                <>Processing...</>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Payment Proof
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>
              Track your submitted payment proofs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {paymentProofs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No payment proofs submitted yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentProofs.map((proof) => (
                  <div
                    key={proof.id}
                    className="border border-border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">
                        ${proof.amount.toFixed(2)} {proof.currency.toUpperCase()}
                      </div>
                      {getStatusBadge(proof.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {proof.payment_method?.name || 'Payment Method'}
                    </div>
                    {proof.transaction_id && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Transaction ID:</span>{' '}
                        {proof.transaction_id}
                      </div>
                    )}
                    {proof.admin_notes && (
                      <div className="text-sm bg-muted p-2 rounded">
                        <span className="font-medium">Admin Note:</span> {proof.admin_notes}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {new Date(proof.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
