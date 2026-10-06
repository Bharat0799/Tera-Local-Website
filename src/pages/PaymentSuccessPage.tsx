import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, PackageCheck, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getStoredOrderById } from '@/lib/demo-orders';

const paymentMethodLabels = {
  card: 'Card demo (not charged)',
  cod: 'COD demo (not charged)',
  upi: 'UPI demo (not charged)',
};

const paymentStatusLabels = {
  cod_pending: 'No payment collected (demo)',
  failed: 'No real payment attempted',
  paid: 'Demo only; no payment processed',
  pending: 'No payment collected (demo)',
};

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const order = orderId ? getStoredOrderById(orderId) : null;

  const progressValue = useMemo(() => {
    if (!order || order.tracking_events.length === 0) {
      return 0;
    }

    const completed = order.tracking_events.filter(event => event.completed).length;
    return Math.max(20, Math.round((completed / order.tracking_events.length) * 100));
  }, [order]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-6">
            <PackageCheck className="h-16 w-16 mx-auto text-primary" />
            <h1 className="text-3xl font-bold">Demo Order Not Found</h1>
            <p className="text-muted-foreground">
              Demo orders are stored in this browser only. Place a new demo order or track an order saved here.
            </p>
            <div className="flex gap-4">
              <Link to="/checkout" className="flex-1">
                <Button variant="outline" className="w-full">Back to Checkout</Button>
              </Link>
              <Link to="/track-order" className="flex-1">
                <Button className="w-full">Track Order</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="section-spacing">
        <div className="container-custom max-w-4xl">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-primary text-primary-foreground p-8 text-center space-y-4">
                <CheckCircle className="h-16 w-16 mx-auto" />
                <div>
                  <h1 className="text-4xl font-bold">Demo Order Saved</h1>
                  <p className="text-lg opacity-90 mt-2">
                    This order is stored in this browser only. No payment or real delivery is arranged.
                  </p>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-bold text-lg">{order.id}</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Tracking No.</p>
                    <p className="font-bold text-lg">{order.tracking_number}</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-bold text-lg text-primary">Rs. {order.total_amount.toFixed(2)}</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Payment</p>
                    <p className="font-bold text-lg">{paymentMethodLabels[order.payment_method]}</p>
                  </div>
                </div>

                <div className="rounded-xl border bg-accent/40 p-6 space-y-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">Demo Delivery Timeline</h2>
                      <p className="text-muted-foreground">
                        Estimated delivery by{' '}
                        {order.estimated_delivery
                          ? new Date(order.estimated_delivery).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              weekday: 'long',
                            })
                          : 'Soon'}
                      </p>
                    </div>
                    <Badge variant="secondary">{order.status.replace(/_/g, ' ')}</Badge>
                  </div>

                  <Progress value={progressValue} />

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="rounded-lg bg-background p-4">
                      <p className="text-sm text-muted-foreground">Payment Status</p>
                      <p className="font-semibold">{paymentStatusLabels[order.payment_status]}</p>
                    </div>
                    <div className="rounded-lg bg-background p-4">
                      <p className="text-sm text-muted-foreground">Customer</p>
                      <p className="font-semibold">{order.customer_name}</p>
                    </div>
                    <div className="rounded-lg bg-background p-4">
                      <p className="text-sm text-muted-foreground">Delivery Address</p>
                      <p className="font-semibold">
                        {order.shipping_address?.city}, {order.shipping_address?.state}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-bold">What happens next</h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="rounded-lg border p-4">
                      <p className="font-semibold">1. Packed fresh</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        This is a simulated timeline; no real order is sent to a warehouse.
                      </p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <p className="font-semibold">2. Tracking updates</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Demo tracking data is stored locally so you can revisit it in this browser.
                      </p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <p className="font-semibold">3. Delivery complete</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Payment options are display-only. No card, UPI, or delivery payment is collected.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 md:flex-row">
                  <Link to={`/track-order?order_id=${order.id}`} className="flex-1">
                    <Button className="w-full">Track This Order</Button>
                  </Link>
                  <Link to="/products" className="flex-1">
                    <Button variant="outline" className="w-full">Continue Shopping</Button>
                  </Link>
                  <Link to="/" className="flex-1">
                    <Button variant="outline" className="w-full">Go Home</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
