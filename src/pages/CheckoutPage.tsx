import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Banknote, CheckCircle2, CreditCard, ShieldCheck, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { getStoredOrders } from '@/lib/demo-orders';
import { User, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import type { CheckoutFormData, PaymentMethod } from '@/types';
import { resolveImageUrl } from '@/lib/image';
import { createDemoOrder } from '@/lib/demo-orders';

const paymentLabels: Record<PaymentMethod, string> = {
  card: 'Credit / Debit Card',
  cod: 'Cash on Delivery',
  upi: 'UPI',
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    full_name: '',
    email: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    payment_method: 'card',
  });
  const [showOrders, setShowOrders] = useState(false);
  const recentDemoOrders = getStoredOrders().slice(0, 5);
  const handleLogout = () => {
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      payment_method: 'card',
    });
    setShowOrders(false);
    toast.success('Demo checkout details cleared.');
  };

  const deliveryThreshold = 999;
  const deliveryFee = totalPrice >= deliveryThreshold ? 0 : 50;
  const finalTotal = totalPrice + deliveryFee;

  const estimatedDelivery = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      weekday: 'short',
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const simulateProcessingMessage = () => {
    return 'Saving your demo order in this browser...';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    toast.loading(simulateProcessingMessage(), { id: 'checkout-demo' });

    try {
      await new Promise(resolve => setTimeout(resolve, 1800));

      const order = createDemoOrder({
        cartItems: items,
        checkoutData: formData,
        deliveryFee,
      });

      toast.success(`Order ${order.id} placed successfully`, { id: 'checkout-demo' });
      navigate(`/payment-success?order_id=${order.id}`, { replace: true });
      clearCart();
    } catch (error) {
      console.error('Demo checkout error:', error);
      toast.error('Unable to place your order right now.', { id: 'checkout-demo' });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <section className="section-spacing">
          <div className="container-custom max-w-2xl">
            <Card>
              <CardContent className="p-8 text-center space-y-5">
                <h1 className="text-3xl font-bold">No Items Ready for Checkout</h1>
                <p className="text-muted-foreground">
                  Add products to your cart first, then come back here to place a demo order.
                </p>
                <div className="flex flex-col gap-3 md:flex-row md:justify-center">
                  <Link to="/products">
                    <Button>Browse Products</Button>
                  </Link>
                  <Link to="/cart">
                    <Button variant="outline">Go to Cart</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="section-spacing">
        <div className="container-custom">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Demo Checkout</h1>
              <p className="text-muted-foreground text-lg">
                This demo stores your order in this browser only. No payment is collected.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-lg border bg-accent px-4 py-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-sm">Demo checkout only</p>
                <p className="text-xs text-muted-foreground">
                  Do not enter payment credentials. No payment will be processed.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">Delivery Address</h2>
                      <Badge variant="secondary">Estimated by {estimatedDelivery}</Badge>
                    </div>
                    <Separator />

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="full_name">Full Name *</Label>
                        <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleInputChange} required />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                    </div>

                    <div>
                      <Label htmlFor="address_line1">Address Line 1 *</Label>
                      <Input id="address_line1" name="address_line1" value={formData.address_line1} onChange={handleInputChange} required />
                    </div>

                    <div>
                      <Label htmlFor="address_line2">Address Line 2</Label>
                      <Input id="address_line2" name="address_line2" value={formData.address_line2} onChange={handleInputChange} />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input id="state" name="state" value={formData.state} onChange={handleInputChange} required />
                      </div>
                      <div>
                        <Label htmlFor="postal_code">Postal Code *</Label>
                        <Input id="postal_code" name="postal_code" value={formData.postal_code} onChange={handleInputChange} required />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">Demo Payment Method</h2>
                      <Badge variant="outline">100% demo-safe</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Choose a display option only. This static demo does not collect payment details or process payments.
                    </p>
                    <Separator />

                    <RadioGroup
                      value={formData.payment_method}
                      onValueChange={value =>
                        setFormData(prev => ({ ...prev, payment_method: value as PaymentMethod }))
                      }
                    >
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 rounded-lg border p-4">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex flex-1 items-center gap-3 cursor-pointer">
                            <CreditCard className="h-5 w-5" />
                            <div>
                              <p className="font-semibold">Credit / Debit Card</p>
                              <p className="text-sm text-muted-foreground">Demo option only; no payment will be made</p>
                            </div>
                          </Label>
                          <Badge>Instant</Badge>
                        </div>

                        {formData.payment_method === 'card' && (
                          <div className="rounded-lg border bg-accent/50 p-4 text-sm text-muted-foreground">
                            Demo only. No card number, expiry date, or security code is requested or processed.
                          </div>
                        )}

                        <div className="flex items-center space-x-3 rounded-lg border p-4">
                          <RadioGroupItem value="upi" id="upi" />
                          <Label htmlFor="upi" className="flex flex-1 items-center gap-3 cursor-pointer">
                            <Smartphone className="h-5 w-5" />
                            <div>
                              <p className="font-semibold">UPI</p>
                              <p className="text-sm text-muted-foreground">Demo option only; no payment will be made</p>
                            </div>
                          </Label>
                          <Badge variant="secondary">Fastest</Badge>
                        </div>

                        {formData.payment_method === 'upi' && (
                          <div className="rounded-lg border bg-accent/50 p-4 text-sm text-muted-foreground">
                            Demo only. No UPI ID is requested and no payment is processed.
                          </div>
                        )}

                        <div className="flex items-center space-x-3 rounded-lg border p-4">
                          <RadioGroupItem value="cod" id="cod" />
                          <Label htmlFor="cod" className="flex flex-1 items-center gap-3 cursor-pointer">
                            <Banknote className="h-5 w-5" />
                            <div>
                              <p className="font-semibold">Cash on Delivery</p>
                              <p className="text-sm text-muted-foreground">Demo selection only; no real delivery is arranged</p>
                            </div>
                          </Label>
                          <Badge variant="outline">Popular</Badge>
                        </div>

                        {formData.payment_method === 'cod' && (
                          <div className="rounded-lg border bg-accent/50 p-4">
                            <p className="text-sm text-muted-foreground">
                              This demo does not place a real order or collect payment on delivery.
                            </p>
                          </div>
                        )}
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="sticky top-24">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{formData.email || 'demo@local.test'}</p>
                          <p className="text-xs text-muted-foreground">{formData.full_name || 'Demo Customer'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setShowOrders(prev => !prev)}>
                          My Orders
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleLogout}>
                          <LogOut className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {showOrders && (
                      <div className="mb-3 border-t pt-3">
                        {recentDemoOrders.length ? (
                          recentDemoOrders.map(o => (
                            <Link key={o.id} to={`/track-order?order_id=${o.id}`} className="block rounded p-2 hover:bg-accent transition-colors">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-sm">{o.id}</p>
                                  <p className="text-xs text-muted-foreground">Rs. {o.total_amount.toFixed(2)}</p>
                                </div>
                                <Badge variant="outline">{o.status.replace(/_/g, ' ')}</Badge>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No previous orders</p>
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">Order Summary</h2>
                      <Badge variant="secondary">{items.length} items</Badge>
                    </div>
                    <Separator />

                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                      {items.map(item => (
                        <div key={item.product.id} className="flex gap-3">
                          <img
                            src={resolveImageUrl(item.product.image_url)}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm line-clamp-2">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} x Rs. {item.product.price}
                            </p>
                          </div>
                          <p className="font-semibold text-sm">
                            Rs. {(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="rounded-lg border bg-accent/50 p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-semibold">Rs. {totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery</span>
                        <span className="font-semibold">
                          {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment</span>
                        <span className="font-semibold">{paymentLabels[formData.payment_method]}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-primary">Rs. {finalTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="rounded-lg border bg-card p-4 space-y-2">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Tracking included</p>
                          <p className="text-sm text-muted-foreground">
                            A demo order ID and simulated delivery timeline are saved in this browser.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      {loading ? 'Saving Demo Order...' : 'Place Demo Order'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
