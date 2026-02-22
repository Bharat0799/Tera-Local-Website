import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();

  const deliveryThreshold = 999;
  const deliveryFee = totalPrice >= deliveryThreshold ? 0 : 50;
  const finalTotal = totalPrice + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground" />
          <h2 className="text-3xl font-bold">Your Harvest Basket is Empty</h2>
          <p className="text-muted-foreground">
            Start adding fresh, organic produce to your cart
          </p>
          <Link to="/products">
            <Button size="lg">Explore Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="section-spacing">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Your Harvest Basket</h1>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              {items.map(item => (
                <Card key={item.product.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <img
                        src={item.product.image_url || ''}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link
                              to={`/products/${item.product.slug}`}
                              className="font-semibold text-lg hover:text-primary"
                            >
                              {item.product.name}
                            </Link>
                            {item.product.origin && (
                              <p className="text-sm text-muted-foreground">
                                {item.product.origin}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.product.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-semibold w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-primary">
                              ₹{(item.product.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ₹{item.product.price} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold">Order Summary</h2>
                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Subtotal ({totalItems} items)
                      </span>
                      <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span className="font-semibold">
                        {deliveryFee === 0 ? (
                          <span className="text-primary">FREE</span>
                        ) : (
                          `₹${deliveryFee}`
                        )}
                      </span>
                    </div>

                    {totalPrice < deliveryThreshold && (
                      <div className="bg-accent p-3 rounded-lg text-sm">
                        Add ₹{(deliveryThreshold - totalPrice).toFixed(2)} more for free delivery
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-between text-lg">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-primary">₹{finalTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <Link to="/checkout">
                    <Button size="lg" className="w-full">
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <Link to="/products">
                    <Button variant="outline" size="lg" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
