'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ExternalLink, CreditCard, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import type { PaddleSubscription } from '@/lib/paddle-api';

interface SubscriptionManagementProps {
  subscriptionId: string;
  category?: string; // Optional: to label which plan this is for
}

export function SubscriptionManagement({ subscriptionId, category }: SubscriptionManagementProps) {
  const [subscription, setSubscription] = useState<PaddleSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    if (!subscriptionId) return;

    const fetchSubscription = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/paddle/subscription/${subscriptionId}`);
        if (!res.ok) {
          if (res.status === 404) {
             // Automatically cleanup invalid subscription ID if not found in Paddle
             await fetch(`/api/paddle/subscription/${subscriptionId}`, { method: 'DELETE' });
             window.location.reload();
             return;
          }
          throw new Error('Failed to fetch subscription');
        }
        const data = await res.json();
        setSubscription(data.subscription);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Nuk mund të ngarkoheshin detajet e abonimit';
        
        // Only log unexpected errors. 404 'Subscription not found' is expected in some cases.
        if (message !== 'Subscription not found') {
          console.error(err);
        }
        
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [subscriptionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div className="p-4 text-sm text-red-400 bg-red-500/10 rounded-lg border border-red-500/20 flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        {error || 'Abonimi nuk është i disponueshëm'}
      </div>
    );
  }

  const statusColors = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    paused: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    canceled: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    past_due: 'bg-red-500/10 text-red-400 border-red-500/20',
    trialing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  const statusLabels: Record<string, string> = {
    active: 'Aktiv',
    paused: 'I pezulluar',
    canceled: 'I anuluar',
    past_due: 'Vonesë pagese',
    trialing: 'Periudhë provë',
  };

  const isCanceled = subscription.status === 'canceled' || !!subscription.canceled_at;
  const nextBillDate = subscription.next_billed_at ? new Date(subscription.next_billed_at) : null;
  const endDate = subscription.current_billing_period?.ends_at ? new Date(subscription.current_billing_period.ends_at) : null;
  const cancelUrl = subscription.management_urls?.cancel;
  const updatePaymentUrl = subscription.management_urls?.update_payment_method;

  const handleCancel = async () => {
    if (!confirm('Jeni i sigurt që doni të fikni rinovimin automatik? Do të mbani qasje deri në fund të periudhës aktuale të faturimit.')) {
      return;
    }

    setCanceling(true);
    try {
      const res = await fetch(`/api/paddle/subscription/${subscriptionId}`, {
        method: 'POST',
      });

      if (!res.ok) {
         const errData = await res.json();
         throw new Error(errData.error || 'Anulimi dështoi');
      }

      toast.success('Rinovimi automatik u fik', {
        description: 'Abonimi juaj do të përfundojë në fund të periudhës aktuale të faturimit.'
      });

      // Reload subscription to update UI
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error('Anulimi i abonimit dështoi', {
         description: err instanceof Error ? err.message : 'Ju lutem provoni përsëri'
      });
    } finally {
      setCanceling(false);
    }
  };

  return (
    <Card className="bg-black/40 border-white/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-orange-400" />
            Abonimi {category && `(${category})`}
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`capitalize border ${statusColors[subscription.status] || 'bg-zinc-500/10 text-zinc-400'}`}
          >
            {statusLabels[subscription.status] || subscription.status.replace('_', ' ')}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          ID: <span className="font-mono text-muted-foreground/70">{subscription.id}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        
        {/* Status Info */}
        <div className="space-y-2">
          {isCanceled ? (
             <div className="rounded-md bg-zinc-900/50 p-3 border border-zinc-800">
                <div className="flex items-center gap-2 text-amber-400 mb-1">
                   <AlertCircle className="h-4 w-4" />
                   <span className="font-medium">Rinovimi automatik është i çaktivizuar</span>
                </div>
                <p className="text-muted-foreground text-xs">
                   Qasja juaj mbetet aktive deri më {endDate ? endDate.toLocaleDateString() : 'përfundimin e periudhës'}. Nuk do të tarifoheni sërish.
                </p>
             </div>
          ) : (
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <p className="text-xs text-muted-foreground mb-0.5">Data e faturimit të radhës</p>
                   <p className="font-medium text-foreground">
                      {nextBillDate ? nextBillDate.toLocaleDateString() : 'N/A'}
                   </p>
                </div>
                <div>
                   <p className="text-xs text-muted-foreground mb-0.5">Shuma</p>
                   <p className="font-medium text-foreground">
                      {/* Assuming single item for simplicity, loop if needed */}
                      {subscription.items[0]?.price.unit_price.amount} {subscription.currency_code}
                   </p>
                </div>
             </div>
          )}
        </div>

      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
        {!isCanceled && (
          <Button 
             variant="outline" 
             size="sm" 
             onClick={handleCancel}
             disabled={canceling}
             className="w-full sm:w-auto border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
             {canceling ? (
                <>
                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                  Duke përditësuar...
                </>
             ) : (
                <>
                  Fik rinovimin automatik
                  <ExternalLink className="h-3 w-3 ml-2" />
                </>
             )}
          </Button>
        )}
        
        {!isCanceled && updatePaymentUrl && (
          <Button 
             variant="outline" 
             size="sm" 
             className="w-full sm:w-auto border-white/10 hover:bg-white/5"
             asChild
          >
             <a href={updatePaymentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                Përditëso mënyrën e pagesës
                <ExternalLink className="h-3 w-3" />
             </a>
          </Button>
        )}

        {isCanceled && (
           <div className="w-full text-center sm:text-left">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                 <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                 Nuk ka tarifime të tjera të planifikuara.
              </p>
           </div>
        )}
      </CardFooter>
    </Card>
  );
}
