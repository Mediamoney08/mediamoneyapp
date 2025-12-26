import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getWalletTransactions } from '@/db/api';
import type { WalletTransaction } from '@/types/types';
import { ArrowUpRight, ArrowDownRight, Plus, Wallet as WalletIcon } from 'lucide-react';

export default function WalletPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getWalletTransactions(user.id);
      setTransactions(data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Wallet Balance Card */}
        <Card className="gradient-bg text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <CardHeader className="relative z-10">
            <CardDescription className="text-white/80">Total Balance</CardDescription>
            <CardTitle className="font-bold text-[32px]">
              ${profile?.wallet_balance?.toFixed(2) || '0.00'}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/add-balance')}
              className="w-full xl:w-auto"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Balance
            </Button>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>View all your wallet transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full bg-muted" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32 bg-muted" />
                        <Skeleton className="h-3 w-24 bg-muted" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-20 bg-muted" />
                  </div>
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12">
                <WalletIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No transactions yet</p>
                <Button
                  variant="outline"
                  className="mt-4 bg-[#8824c1] bg-none text-[12px]"
                  onClick={() => navigate('/add-balance')}
                >
                  Add Balance
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => {
                  const isDeposit = transaction.type === 'deposit' || Number(transaction.amount) > 0;
                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${isDeposit ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                          {isDeposit ? (
                            <ArrowDownRight className="h-5 w-5 text-green-500" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description || transaction.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${isDeposit ? 'text-green-500' : 'text-red-500'}`}>
                          {isDeposit ? '+' : '-'}${Math.abs(Number(transaction.amount)).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Balance: ${Number(transaction.balance_after).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
