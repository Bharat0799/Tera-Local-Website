import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/db/supabase';
import type { Order } from '@/types';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided');
      setLoading(false);
      return;
    }

    verifyPayment();
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      const { data, error: verifyError } = await supabase.functions.invoke('verify_stripe_payment', {
        body: { sessionId },
      });

      if (verifyError) {
        const errorMsg = await verifyError?.context?.text();
        throw new Error(errorMsg || 'Failed to verify payment');
      }

      if (data?.verified) {
        setVerified(true);
        // Fetch order details
        if (sessionId) {
          const { data: orderData } = await supabase
            .from('orders')
            .select('*')
            .eq('stripe_session_id', sessionId)
            .maybeSingle();
          
          setOrder(orderData);
        }
      } else {
        setError('Payment not completed');
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      setError(err instanceof Error ? err.message : 'Failed to verify payment');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-16 w-16 animate-spin mx-auto text-primary" />
          <p className="text-xl font-semibold">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error || !verified) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-6">
            <XCircle className="h-16 w-16 mx-auto text-destructive" />
            <h1 className="text-3xl font-bold">Payment Failed</h1>
            <p className="text-muted-foreground">
              {error || 'We could not verify your payment. Please contact support if you were charged.'}
            </p>
            <div className="flex gap-4">
              <Link to="/cart" className="flex-1">
                <Button variant="outline" className="w-full">Back to Cart</Button>
              </Link>
              <Link to="/" className="flex-1">
                <Button className="w-full">Go Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-2xl w-full">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 mx-auto text-primary" />
            <h1 className="text-4xl font-bold">Order Confirmed!</h1>
            <p className="text-xl text-muted-foreground">
              Thank you for your purchase. Your order has been received.
            </p>
          </div>

          {order && (
            <div className="space-y-4 bg-accent p-6 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-semibold">{order.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-semibold text-primary">
                    ₹{(order.total_amount / 100).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold">{order.customer_email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold text-primary">Confirmed</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-semibold">What's Next?</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <span>You'll receive an order confirmation email shortly</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <span>Your fresh produce will be harvested and packed</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <span>Delivery within 48 hours to your doorstep</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4 pt-4">
            <Link to="/products" className="flex-1">
              <Button variant="outline" className="w-full">Continue Shopping</Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button className="w-full">Go Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
