import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Eye, Clock } from 'lucide-react';
import { getAllPaymentProofs, updatePaymentProofStatus } from '@/db/api';
import type { PaymentProof } from '@/types/types';

export default function PaymentVerification() {
  const { toast } = useToast();
  const [paymentProofs, setPaymentProofs] = useState<PaymentProof[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState<PaymentProof | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadPaymentProofs();
  }, []);

  const loadPaymentProofs = async () => {
    try {
      const data = await getAllPaymentProofs();
      setPaymentProofs(data);
    } catch (error) {
      console.error('Error loading payment proofs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payment proofs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (proofId: string, status: 'approved' | 'rejected') => {
    if (!adminNotes && status === 'rejected') {
      toast({
        title: 'Validation Error',
        description: 'Please provide a reason for rejection',
        variant: 'destructive',
      });
      return;
    }

    setProcessing(true);
    try {
      await updatePaymentProofStatus(proofId, status, adminNotes);
      toast({
        title: 'Success',
        description: `Payment ${status} successfully`,
      });
      setSelectedProof(null);
      setAdminNotes('');
      loadPaymentProofs();
    } catch (error) {
      console.error('Error updating payment proof:', error);
      toast({
        title: 'Error',
        description: 'Failed to update payment proof',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const pendingCount = paymentProofs.filter(p => p.status === 'pending').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Payment Verification</CardTitle>
            <CardDescription>
              Review and verify payment proofs from users
            </CardDescription>
          </div>
          {pendingCount > 0 && (
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {pendingCount} Pending
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentProofs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No payment proofs found
                  </TableCell>
                </TableRow>
              ) : (
                paymentProofs.map((proof) => (
                  <TableRow key={proof.id}>
                    <TableCell className="font-mono text-xs">
                      {proof.user_id.substring(0, 8)}...
                    </TableCell>
                    <TableCell className="font-medium">
                      ${proof.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {typeof proof.payment_method === 'object' && proof.payment_method?.name 
                        ? proof.payment_method.name 
                        : proof.payment_method_id || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(proof.status)}>
                        {proof.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(proof.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedProof(proof);
                              setAdminNotes(proof.admin_notes || '');
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Payment Proof Details</DialogTitle>
                            <DialogDescription>
                              Review and verify payment information
                            </DialogDescription>
                          </DialogHeader>
                          {selectedProof && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>User ID</Label>
                                  <p className="text-sm text-muted-foreground font-mono">
                                    {selectedProof.user_id}
                                  </p>
                                </div>
                                <div>
                                  <Label>Amount</Label>
                                  <p className="text-sm text-muted-foreground">
                                    ${selectedProof.amount.toFixed(2)}
                                  </p>
                                </div>
                                <div>
                                  <Label>Payment Method</Label>
                                  <p className="text-sm text-muted-foreground">
                                    {typeof selectedProof.payment_method === 'object' && selectedProof.payment_method?.name 
                                      ? selectedProof.payment_method.name 
                                      : selectedProof.payment_method_id || 'N/A'}
                                  </p>
                                </div>
                                <div>
                                  <Label>Status</Label>
                                  <Badge variant={getStatusColor(selectedProof.status)}>
                                    {selectedProof.status}
                                  </Badge>
                                </div>
                              </div>

                              {selectedProof.proof_image_url && (
                                <div>
                                  <Label>Payment Proof Image</Label>
                                  <div className="mt-2 border rounded-lg overflow-hidden">
                                    <img
                                      src={selectedProof.proof_image_url}
                                      alt="Payment Proof"
                                      className="w-full h-auto"
                                    />
                                  </div>
                                </div>
                              )}

                              {selectedProof.transaction_id && (
                                <div>
                                  <Label>Transaction ID</Label>
                                  <p className="text-sm text-muted-foreground font-mono">
                                    {selectedProof.transaction_id}
                                  </p>
                                </div>
                              )}

                              {selectedProof.transaction_details && (
                                <div>
                                  <Label>Transaction Details</Label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedProof.transaction_details}
                                  </p>
                                </div>
                              )}

                              <div className="space-y-2">
                                <Label htmlFor="admin_notes">Admin Notes</Label>
                                <Textarea
                                  id="admin_notes"
                                  value={adminNotes}
                                  onChange={(e) => setAdminNotes(e.target.value)}
                                  placeholder="Add notes about this payment..."
                                  rows={3}
                                  disabled={selectedProof.status !== 'pending'}
                                />
                              </div>

                              {selectedProof.status === 'pending' && (
                                <DialogFooter className="gap-2">
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleVerify(selectedProof.id, 'rejected')}
                                    disabled={processing}
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                  </Button>
                                  <Button
                                    onClick={() => handleVerify(selectedProof.id, 'approved')}
                                    disabled={processing}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                </DialogFooter>
                              )}

                              {selectedProof.status !== 'pending' && (
                                <div className="text-sm text-muted-foreground">
                                  This payment has already been {selectedProof.status}
                                  {selectedProof.reviewed_at && (
                                    <span> on {new Date(selectedProof.reviewed_at).toLocaleString()}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
