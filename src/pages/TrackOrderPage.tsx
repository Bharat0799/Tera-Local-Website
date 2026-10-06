import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, Package, Search, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getStoredOrderById, getStoredOrders } from '@/lib/demo-orders';
import type { Order } from '@/types';

const paymentStatusLabels = {
  cod_pending: 'Collect on delivery',
  failed: 'Payment failed',
  paid: 'Paid successfully',
  pending: 'Awaiting payment',
};

export default function TrackOrderPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialOrderId = searchParams.get('order_id') || '';
  const storedOrders = getStoredOrders();
  const mostRecentOrder = storedOrders.length ? storedOrders[0] : null;
  const fallbackOrder: Order | null = !mostRecentOrder
    ? {
        id: `TL${Date.now().toString().slice(-8)}`,
        user_id: null,
        items: [
          { name: 'Sample Item', price: 199.0, quantity: 1, product_id: 'demo-1', image_url: '' },
        ],
        total_amount: 199.0,
        currency: 'INR',
        status: 'confirmed',
        payment_method: 'card',
        payment_status: 'paid',
        stripe_session_id: null,
        stripe_payment_intent_id: null,
        customer_email: null,
        customer_name: 'Demo Customer',
        customer_phone: '9999999999',
        shipping_address: {
          full_name: 'Demo Customer',
          phone: '9999999999',
          address_line1: 'Demo Street 1',
          city: 'Demo City',
          state: 'Demo State',
          postal_code: '000000',
        },
        tracking_number: `TRK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        estimated_delivery: null,
        tracking_events: [
          {
            id: 'track-1',
            status: 'confirmed',
            label: 'Order confirmed',
            description: 'Your order was placed successfully.',
            timestamp: new Date().toISOString(),
            completed: true,
          },
        ],
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    : null;

  const [orderIdInput, setOrderIdInput] = useState(
    initialOrderId || (mostRecentOrder ? mostRecentOrder.id : fallbackOrder ? fallbackOrder.id : '')
  );
  const [order, setOrder] = useState<Order | null>(initialOrderId ? getStoredOrderById(initialOrderId) : mostRecentOrder || fallbackOrder);
  const [recentOrders, setRecentOrders] = useState<Order[]>(
    storedOrders.length ? storedOrders.slice(0, 5) : fallbackOrder ? [fallbackOrder] : []
  );
  const [searchAttempted, setSearchAttempted] = useState(
    Boolean(initialOrderId) || Boolean(mostRecentOrder) || Boolean(fallbackOrder)
  );
  const hasPreviousOrders = recentOrders.length > 0;

  useEffect(() => {
    const s = getStoredOrders().slice(0, 5);
    if (s.length) {
      setRecentOrders(s);
    }
  }, []);

  useEffect(() => {
    if (!initialOrderId) {
      return;
    }

    setOrder(getStoredOrderById(initialOrderId));
    setOrderIdInput(initialOrderId);
    setSearchAttempted(true);
  }, [initialOrderId]);

  const progressValue = useMemo(() => {
    if (!order || order.tracking_events.length === 0) {
      return 0;
    }

    return Math.round(
      (order.tracking_events.filter(event => event.completed).length / order.tracking_events.length) * 100
    );
  }, [order]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = orderIdInput.trim();
    if (!trimmed) {
      setOrder(null);
      setSearchAttempted(false);
      return;
    }

    const matchedOrder = getStoredOrderById(trimmed);
    setSearchParams({ order_id: trimmed.toUpperCase() });
    setOrder(matchedOrder);
    setRecentOrders(getStoredOrders().slice(0, 5));
    setSearchAttempted(true);
  };

  return (
    <div className="min-h-screen">
      <section className="section-spacing">
        <div className="container-custom max-w-5xl space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold">Track Your Order</h1>
            <p className="text-lg text-muted-foreground">
              Enter your order ID to see shipping progress, payment mode, and delivery milestones.
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleTrack} className="flex flex-col gap-3 md:flex-row">
                <Input
                  value={orderIdInput}
                  onChange={e => setOrderIdInput(e.target.value)}
                  placeholder="Enter order ID, for example TL12345678"
                  className="h-12"
                />
                <Button type="submit" className="h-12 md:px-8">
                  <Search className="h-4 w-4 mr-2" />
                  Track Order
                </Button>
              </form>
            </CardContent>
          </Card>

          {order ? (
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <h2 className="text-3xl font-bold">{order.id}</h2>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <Badge>{order.status.replaceAll('_', ' ')}</Badge>
                    <Badge variant="secondary">{paymentStatusLabels[order.payment_status]}</Badge>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Tracking Number</p>
                    <p className="font-semibold">{order.tracking_number}</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Placed On</p>
                    <p className="font-semibold">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                    <p className="font-semibold">
                      {order.estimated_delivery
                        ? new Date(order.estimated_delivery).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            weekday: 'short',
                          })
                        : 'Soon'}
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-semibold text-primary">Rs. {order.total_amount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Delivery Progress</h3>
                    <span className="text-sm text-muted-foreground">{progressValue}% completed</span>
                  </div>
                  <Progress value={progressValue} />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="rounded-xl border p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" />
                      <h3 className="font-bold">Tracking Timeline</h3>
                    </div>
                    <div className="space-y-4">
                      {order.tracking_events.map(event => (
                        <div key={event.id} className="flex gap-3">
                          <div className="mt-1">
                            <div className={`h-3 w-3 rounded-full ${event.completed ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold">{event.label}</p>
                              <Badge variant={event.completed ? 'secondary' : 'outline'}>
                                {event.completed ? 'Completed' : 'Upcoming'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(event.timestamp).toLocaleString('en-IN', {
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                month: 'short',
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-xl border p-5 space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <h3 className="font-bold">Shipping Address</h3>
                      </div>
                      <p className="font-medium">{order.shipping_address?.full_name}</p>
                      <p className="text-muted-foreground">
                        {order.shipping_address?.address_line1}
                        {order.shipping_address?.address_line2 ? `, ${order.shipping_address.address_line2}` : ''}
                      </p>
                      <p className="text-muted-foreground">
                        {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.postal_code}
                      </p>
                      <p className="text-muted-foreground">{order.shipping_address?.phone}</p>
                    </div>

                    <div className="rounded-xl border p-5 space-y-3">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        <h3 className="font-bold">Items in this order</h3>
                      </div>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={`${item.product_id || item.name}-${index}`} className="flex items-center justify-between gap-4">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Qty {item.quantity} x Rs. {item.price}
                              </p>
                            </div>
                            <p className="font-semibold">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center space-y-6">
                <Package className="h-14 w-14 mx-auto text-muted-foreground" />
                <div>
                  <h2 className="text-2xl font-bold">
                    {searchAttempted ? 'Order not found' : hasPreviousOrders ? 'Previous orders' : 'No orders yet'}
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    {searchAttempted
                      ? 'Try the exact order ID from the confirmation page, or paste the tracking number instead.'
                      : hasPreviousOrders
                        ? 'Choose one of your earlier demo orders below or enter an order ID / tracking number.'
                        : 'Place your first order from checkout and it will appear here automatically, just like an e-commerce order history.'}
                  </p>
                </div>

                {hasPreviousOrders && (
                  <div className="grid gap-3 text-left">
                    {recentOrders.map(recentOrder => (
                      <button
                        key={recentOrder.id}
                        type="button"
                        onClick={() => {
                          setOrderIdInput(recentOrder.id);
                          setOrder(recentOrder);
                          setSearchParams({ order_id: recentOrder.id });
                        }}
                        className="rounded-lg border p-4 hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold">{recentOrder.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {recentOrder.customer_name} • Rs. {recentOrder.total_amount.toFixed(2)}
                            </p>
                          </div>
                          <Badge variant="outline">{recentOrder.status.replaceAll('_', ' ')}</Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-3 md:flex-row md:justify-center">
                  <Link to="/products">
                    <Button>Continue Shopping</Button>
                  </Link>
                  {!hasPreviousOrders && (
                    <Link to="/checkout">
                      <Button variant="outline">Go to Checkout</Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
