import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/db/supabase';
import { toast } from 'sonner';
import type { CheckoutFormData } from '@/types';

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

  const deliveryThreshold = 999;
  const deliveryFee = totalPrice >= deliveryThreshold ? 0 : 50;
  const finalTotal = totalPrice + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderItems = items.map(item => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image_url: item.product.image_url || '',
        product_id: item.product.id,
      }));

      const shippingAddress = {
        full_name: formData.full_name,
        phone: formData.phone,
        address_line1: formData.address_line1,
        address_line2: formData.address_line2,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
      };

      // Call Stripe checkout Edge Function
      const { data, error } = await supabase.functions.invoke('create_stripe_checkout', {
        body: {
          items: orderItems,
          currency: 'inr',
          payment_method_types: ['card'],
          customer_email: formData.email,
          customer_name: formData.full_name,
          customer_phone: formData.phone,
          shipping_address: shippingAddress,
        },
      });

      if (error) {
        const errorMsg = await error?.context?.text();
        console.error('Checkout error:', errorMsg || error?.message);
        throw new Error(errorMsg || 'Failed to create checkout session');
      }

      if (data?.url) {
        // Clear cart and redirect to Stripe
        clearCart();
        window.open(data.url, '_blank');
        navigate('/');
        toast.success('Redirecting to payment...');
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process checkout. Please ensure STRIPE_SECRET_KEY is configured.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen">
      <section className="section-spacing">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="md:col-span-2 space-y-6">
                {/* Shipping Information */}
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-2xl font-bold">Shipping Information</h2>
                    <Separator />

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="full_name">Full Name *</Label>
                        <Input
                          id="full_name"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="address_line1">Address Line 1 *</Label>
                      <Input
                        id="address_line1"
                        name="address_line1"
                        value={formData.address_line1}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="address_line2">Address Line 2</Label>
                      <Input
                        id="address_line2"
                        name="address_line2"
                        value={formData.address_line2}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="postal_code">Postal Code *</Label>
                        <Input
                          id="postal_code"
                          name="postal_code"
                          value={formData.postal_code}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-2xl font-bold">Payment Method</h2>
                    <Separator />

                    <RadioGroup
                      value={formData.payment_method}
                      onValueChange={value => setFormData(prev => ({ ...prev, payment_method: value as any }))}
                    >
                      <div className="flex items-center space-x-3 p-4 border rounded-lg">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                          <CreditCard className="h-5 w-5" />
                          <span>Credit/Debit Card</span>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 p-4 border rounded-lg opacity-50">
                        <RadioGroupItem value="upi" id="upi" disabled />
                        <Label htmlFor="upi" className="flex items-center gap-3 cursor-not-allowed flex-1">
                          <Smartphone className="h-5 w-5" />
                          <span>UPI (Coming Soon)</span>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 p-4 border rounded-lg opacity-50">
                        <RadioGroupItem value="cod" id="cod" disabled />
                        <Label htmlFor="cod" className="flex items-center gap-3 cursor-not-allowed flex-1">
                          <Banknote className="h-5 w-5" />
                          <span>Cash on Delivery (Coming Soon)</span>
                        </Label>
                      </div>
                    </RadioGroup>

                    <p className="text-sm text-muted-foreground">
                      You will be redirected to Stripe's secure payment page to complete your purchase.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="sticky top-24">
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-2xl font-bold">Order Summary</h2>
                    <Separator />

                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {items.map(item => (
                        <div key={item.product.id} className="flex gap-3">
                          <img
                            src={item.product.image_url || ''}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} × ₹{item.product.price}
                            </p>
                          </div>
                          <p className="font-semibold">
                            ₹{(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery</span>
                        <span className="font-semibold">
                          {deliveryFee === 0 ? (
                            <span className="text-primary">FREE</span>
                          ) : (
                            `₹${deliveryFee}`
                          )}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-primary">₹{finalTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      {loading ? 'Processing...' : 'Place Order'}
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
