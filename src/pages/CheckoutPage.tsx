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
  const [cardData, setCardData] = useState({
    card_name: '',
    card_number: '',
    expiry: '',
    cvv: '',
  });
  const [upiId, setUpiId] = useState('');
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
    setCardData({ card_name: '', card_number: '', expiry: '', cvv: '' });
    setUpiId('');
    setShowOrders(false);
    toast.success('Logged out of demo profile');
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

  const validatePayment = () => {
    if (formData.payment_method === 'card') {
      const digits = cardData.card_number.replace(/\D/g, '');
      if (cardData.card_name.trim().length < 3) {
        toast.error('Enter the name on card');
        return false;
      }
      if (digits.length < 16) {
        toast.error('Enter a valid 16-digit card number');
        return false;
      }
      if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
        toast.error('Use expiry in MM/YY format');
        return false;
      }
      if (!/^\d{3}$/.test(cardData.cvv)) {
        toast.error('Enter a valid 3-digit CVV');
        return false;
      }
    }

    if (formData.payment_method === 'upi') {
      if (!/^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(upiId.trim())) {
        toast.error('Enter a valid UPI ID');
        return false;
      }
    }

    return true;
  };

  const simulateProcessingMessage = () => {
    if (formData.payment_method === 'card') {
      return 'Authorizing your card and placing the order...';
    }

    if (formData.payment_method === 'upi') {
      return 'Waiting for UPI approval and confirming your order...';
    }

    return 'Reserving your order for cash on delivery...';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePayment()) {
      return;
    }

    setLoading(true);
    toast.loading(simulateProcessingMessage(), { id: 'checkout-demo' });

    try {
      await new Promise(resolve => setTimeout(resolve, 1800));

      const order = createDemoOrder({
        cartItems: items,
        checkoutData: formData,
        deliveryFee,
        paymentDetails: {
          cardNumber: cardData.card_number,
          upiId,
        },
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
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Secure Checkout</h1>
              <p className="text-muted-foreground text-lg">
                Shipping, payment, and order confirmation in one smooth flow.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-lg border bg-accent px-4 py-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-sm">Demo payment enabled</p>
                <p className="text-xs text-muted-foreground">
                  Card, UPI, and COD will all complete like a live store.
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
                      <h2 className="text-2xl font-bold">Choose Payment</h2>
                      <Badge variant="outline">100% demo-safe</Badge>
                    </div>
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
                              <p className="text-sm text-muted-foreground">Visa, Mastercard, RuPay, Amex</p>
                            </div>
                          </Label>
                          <Badge>Instant</Badge>
                        </div>

                        {formData.payment_method === 'card' && (
                          <div className="grid md:grid-cols-2 gap-4 rounded-lg border bg-accent/50 p-4">
                            <div className="md:col-span-2">
                              <Label htmlFor="card_name">Name on Card *</Label>
                              <Input
                                id="card_name"
                                value={cardData.card_name}
                                onChange={e => setCardData(prev => ({ ...prev, card_name: e.target.value }))}
                                placeholder="Bharat Kumar"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Label htmlFor="card_number">Card Number *</Label>
                              <Input
                                id="card_number"
                                value={cardData.card_number}
                                onChange={e => setCardData(prev => ({ ...prev, card_number: e.target.value }))}
                                placeholder="4111 1111 1111 1111"
                                maxLength={19}
                              />
                            </div>
                            <div>
                              <Label htmlFor="expiry">Expiry *</Label>
                              <Input
                                id="expiry"
                                value={cardData.expiry}
                                onChange={e => setCardData(prev => ({ ...prev, expiry: e.target.value }))}
                                placeholder="08/28"
                                maxLength={5}
                              />
                            </div>
                            <div>
                              <Label htmlFor="cvv">CVV *</Label>
                              <Input
                                id="cvv"
                                value={cardData.cvv}
                                onChange={e => setCardData(prev => ({ ...prev, cvv: e.target.value }))}
                                placeholder="123"
                                maxLength={3}
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center space-x-3 rounded-lg border p-4">
                          <RadioGroupItem value="upi" id="upi" />
                          <Label htmlFor="upi" className="flex flex-1 items-center gap-3 cursor-pointer">
                            <Smartphone className="h-5 w-5" />
                            <div>
                              <p className="font-semibold">UPI</p>
                              <p className="text-sm text-muted-foreground">Google Pay, PhonePe, Paytm, BHIM</p>
                            </div>
                          </Label>
                          <Badge variant="secondary">Fastest</Badge>
                        </div>

                        {formData.payment_method === 'upi' && (
                          <div className="rounded-lg border bg-accent/50 p-4 space-y-3">
                            <div>
                              <Label htmlFor="upi_id">UPI ID *</Label>
                              <Input
                                id="upi_id"
                                value={upiId}
                                onChange={e => setUpiId(e.target.value)}
                                placeholder="bharat@oksbi"
                              />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              We simulate a real payment app approval and then confirm the order instantly.
                            </p>
                          </div>
                        )}

                        <div className="flex items-center space-x-3 rounded-lg border p-4">
                          <RadioGroupItem value="cod" id="cod" />
                          <Label htmlFor="cod" className="flex flex-1 items-center gap-3 cursor-pointer">
                            <Banknote className="h-5 w-5" />
                            <div>
                              <p className="font-semibold">Cash on Delivery</p>
                              <p className="text-sm text-muted-foreground">Pay when your order reaches your doorstep</p>
                            </div>
                          </Label>
                          <Badge variant="outline">Popular</Badge>
                        </div>

                        {formData.payment_method === 'cod' && (
                          <div className="rounded-lg border bg-accent/50 p-4">
                            <p className="text-sm text-muted-foreground">
                              Your order will be confirmed now and payment will be collected at delivery.
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
                                <Badge variant="outline">{o.status.replaceAll('_', ' ')}</Badge>
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
                            After payment, you will get an order ID and live-style delivery timeline.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      {loading ? 'Processing Order...' : 'Place Order Securely'}
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
