import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getAllPaymentProofs, updatePaymentProofStatus, getProfile } from '@/db/api';
import type { PaymentProof } from '@/types/types';
import { CheckCircle, XCircle, Clock, Eye, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentProofs, setPaymentProofs] = useState<PaymentProof[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState<PaymentProof | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const profile = await getProfile(user.id);
      if (!profile || profile.role !== 'admin') {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access this page',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }
      setIsAdmin(true);
      loadPaymentProofs();
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/');
    }
  };

  const loadPaymentProofs = async () => {
    try {
      const proofs = await getAllPaymentProofs();
      setPaymentProofs(proofs);
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

  const handleUpdateStatus = async (proofId: string, status: 'approved' | 'rejected') => {
    setProcessing(true);
    try {
      await updatePaymentProofStatus(proofId, status, adminNotes || undefined);

      toast({
        title: 'Status Updated',
        description: `Payment proof has been ${status}`,
      });

      setSelectedProof(null);
      setAdminNotes('');
      await loadPaymentProofs();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update payment proof status',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
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

  const filterProofs = (status?: string) => {
    if (!status) return paymentProofs;
    return paymentProofs.filter(p => p.status === status);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const pendingCount = filterProofs('pending').length;
  const approvedCount = filterProofs('approved').length;
  const rejectedCount = filterProofs('rejected').length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <p className="text-muted-foreground">
          Manage payment proofs and user transactions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{approvedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{rejectedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Proofs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Proofs</CardTitle>
          <CardDescription>
            Review and approve user payment submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({approvedCount})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({rejectedCount})</TabsTrigger>
              <TabsTrigger value="all">All ({paymentProofs.length})</TabsTrigger>
            </TabsList>

            {['pending', 'approved', 'rejected', 'all'].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="space-y-4">
                  {filterProofs(tab === 'all' ? undefined : tab).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No {tab} payment proofs
                    </div>
                  ) : (
                    filterProofs(tab === 'all' ? undefined : tab).map((proof) => (
                      <div
                        key={proof.id}
                        className="border border-border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="font-semibold text-lg">
                              ${proof.amount.toFixed(2)} {proof.currency.toUpperCase()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {proof.payment_method?.name || 'Payment Method'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(proof.created_at).toLocaleString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(proof.status)}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedProof(proof);
                                    setAdminNotes(proof.admin_notes || '');
                                  }}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Review
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Payment Proof Details</DialogTitle>
                                  <DialogDescription>
                                    Review and approve or reject this payment
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-muted-foreground">Amount</Label>
                                      <div className="font-semibold">
                                        ${proof.amount.toFixed(2)} {proof.currency.toUpperCase()}
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Status</Label>
                                      <div>{getStatusBadge(proof.status)}</div>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Payment Method</Label>
                                      <div>{proof.payment_method?.name}</div>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Date</Label>
                                      <div className="text-sm">
                                        {new Date(proof.created_at).toLocaleString()}
                                      </div>
                                    </div>
                                  </div>

                                  {proof.transaction_id && (
                                    <div>
                                      <Label className="text-muted-foreground">Transaction ID</Label>
                                      <div className="font-mono text-sm">{proof.transaction_id}</div>
                                    </div>
                                  )}

                                  {proof.transaction_details && (
                                    <div>
                                      <Label className="text-muted-foreground">Transaction Details</Label>
                                      <div className="text-sm">{proof.transaction_details}</div>
                                    </div>
                                  )}

                                  {proof.proof_image_url && (
                                    <div>
                                      <Label className="text-muted-foreground">Payment Proof</Label>
                                      <img
                                        src={proof.proof_image_url}
                                        alt="Payment proof"
                                        className="mt-2 max-h-96 rounded-lg border"
                                      />
                                    </div>
                                  )}

                                  <div>
                                    <Label htmlFor="admin-notes">Admin Notes</Label>
                                    <Textarea
                                      id="admin-notes"
                                      placeholder="Add notes about this payment"
                                      value={adminNotes}
                                      onChange={(e) => setAdminNotes(e.target.value)}
                                      rows={3}
                                    />
                                  </div>

                                  {proof.status === 'pending' && (
                                    <div className="flex gap-2">
                                      <Button
                                        onClick={() => handleUpdateStatus(proof.id, 'approved')}
                                        disabled={processing}
                                        className="flex-1 bg-green-500 hover:bg-green-600"
                                      >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve
                                      </Button>
                                      <Button
                                        onClick={() => handleUpdateStatus(proof.id, 'rejected')}
                                        disabled={processing}
                                        variant="destructive"
                                        className="flex-1"
                                      >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Reject
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>

                        {proof.transaction_id && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Transaction ID:</span>{' '}
                            <span className="font-mono">{proof.transaction_id}</span>
                          </div>
                        )}

                        {proof.admin_notes && (
                          <div className="text-sm bg-muted p-2 rounded">
                            <span className="font-medium">Admin Note:</span> {proof.admin_notes}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
