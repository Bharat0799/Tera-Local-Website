import type {
  CartItem,
  CheckoutFormData,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  TrackingEvent,
} from "@/types";

const ORDER_STORAGE_KEY = "terra_local_orders";

type StoredOrderLike = Partial<Order> & {
  items?: OrderItem[];
  created_at?: string;
  customer_email?: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  estimated_delivery?: string | null;
  payment_method?: PaymentMethod;
  payment_status?: PaymentStatus;
  shipping_address?: Order["shipping_address"];
  status?: OrderStatus;
  total_amount?: number;
  tracking_events?: TrackingEvent[];
  tracking_number?: string | null;
  updated_at?: string;
};

function readOrders(): StoredOrderLike[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(ORDER_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as StoredOrderLike[];
  } catch {
    return [];
  }
}

function writeOrders(orders: Order[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
}

function randomCode(length: number) {
  return Math.random().toString(36).slice(2, 2 + length).toUpperCase();
}

function maskCardNumber(cardNumber: string) {
  const digits = cardNumber.replace(/\D/g, "");
  const last4 = digits.slice(-4).padStart(4, "0");
  return `**** **** **** ${last4}`;
}

function getPaymentStatus(paymentMethod: PaymentMethod): PaymentStatus {
  if (paymentMethod === "cod") {
    return "cod_pending";
  }

  return "paid";
}

function normalizePaymentMethod(paymentMethod?: PaymentMethod): PaymentMethod {
  if (paymentMethod === "upi" || paymentMethod === "cod" || paymentMethod === "card") {
    return paymentMethod;
  }

  return "card";
}

function buildTrackingEvents(createdAt: string, paymentMethod: PaymentMethod): TrackingEvent[] {
  const start = new Date(createdAt);

  const steps: Array<{
    dayOffset: number;
    description: string;
    label: string;
    status: OrderStatus;
  }> = [
    {
      dayOffset: 0,
      description:
        paymentMethod === "cod"
          ? "Your order was placed successfully. Payment will be collected on delivery."
          : "Your payment was authorized and your order is confirmed.",
      label: "Order placed",
      status: "confirmed",
    },
    {
      dayOffset: 0,
      description: "Our partner farm and warehouse teams are preparing your items.",
      label: "Processing",
      status: "processing",
    },
    {
      dayOffset: 1,
      description: "Your items have been packed and inspected for shipping.",
      label: "Packed",
      status: "packed",
    },
    {
      dayOffset: 1,
      description: "The shipment has been dispatched from the fulfillment center (shipping date).",
      label: "Shipped (Shipping date)",
      status: "shipped",
    },
    {
      dayOffset: 2,
      description: "Your package is out for delivery with the rider.",
      label: "Out for delivery",
      status: "out_for_delivery",
    },
    {
      dayOffset: 3,
      description: "The order has been handed over to the customer.",
      label: "Handed over to customer",
      status: "delivered",
    },
  ];

  return steps.map((step, index) => {
    const timestamp = new Date(start);
    timestamp.setDate(start.getDate() + step.dayOffset);
    timestamp.setHours(10 + index, 0, 0, 0);

    return {
      id: `track-${index + 1}`,
      status: step.status,
      label: step.label,
      description: step.description,
      timestamp: timestamp.toISOString(),
      completed: step.dayOffset === 0,
    };
  });
}

function deriveStatus(order: Order): OrderStatus {
  if (order.status === "cancelled" || order.status === "refunded") {
    return order.status;
  }

  const now = new Date();
  const currentEvent =
    [...order.tracking_events]
      .reverse()
      .find((event) => new Date(event.timestamp).getTime() <= now.getTime()) ??
    order.tracking_events[0];

  return currentEvent?.status ?? order.status;
}

function hydrateOrder(order: StoredOrderLike): Order {
  const createdAt = order.created_at || new Date().toISOString();
  const paymentMethod = normalizePaymentMethod(order.payment_method);
  const fallbackTrackingEvents = buildTrackingEvents(createdAt, paymentMethod);
  const sourceEvents =
    Array.isArray(order.tracking_events) && order.tracking_events.length > 0
      ? order.tracking_events
      : fallbackTrackingEvents;

  const hydratedEvents = sourceEvents.map((event, index) => {
    const timestamp = event.timestamp || createdAt;

    return {
      ...event,
      id: event.id || `track-${index + 1}`,
      description: event.description || event.label || "Order update",
      label: event.label || "Order update",
      status: event.status || "confirmed",
      timestamp,
      completed: new Date(timestamp).getTime() <= Date.now(),
    };
  });

  const estimatedDelivery =
    hydratedEvents.find((event) => event.status === "delivered")?.timestamp ??
    order.estimated_delivery;

  const normalizedOrder: Order = {
    ...order,
    id: order.id || `TL${Date.now().toString().slice(-8)}`,
    user_id: order.user_id || null,
    items: Array.isArray(order.items) ? order.items : [],
    total_amount: typeof order.total_amount === "number" ? order.total_amount : 0,
    currency: order.currency || "INR",
    payment_method: paymentMethod,
    payment_status: order.payment_status || getPaymentStatus(paymentMethod),
    stripe_session_id: order.stripe_session_id || null,
    stripe_payment_intent_id: order.stripe_payment_intent_id || null,
    customer_email: order.customer_email || null,
    customer_name: order.customer_name || null,
    customer_phone: order.customer_phone || null,
    shipping_address: order.shipping_address || null,
    tracking_number: order.tracking_number || `TRK-${randomCode(10)}`,
    created_at: createdAt,
    estimated_delivery,
    status: deriveStatus({
      ...(order as Order),
      created_at: createdAt,
      currency: order.currency || "INR",
      customer_email: order.customer_email || null,
      customer_name: order.customer_name || null,
      customer_phone: order.customer_phone || null,
      id: order.id || `TL${Date.now().toString().slice(-8)}`,
      items: Array.isArray(order.items) ? order.items : [],
      payment_method: paymentMethod,
      payment_status: order.payment_status || getPaymentStatus(paymentMethod),
      shipping_address: order.shipping_address || null,
      status: order.status || "confirmed",
      stripe_payment_intent_id: order.stripe_payment_intent_id || null,
      stripe_session_id: order.stripe_session_id || null,
      total_amount: typeof order.total_amount === "number" ? order.total_amount : 0,
      tracking_events: hydratedEvents,
      tracking_number: order.tracking_number || `TRK-${randomCode(10)}`,
      updated_at: order.updated_at || createdAt,
      user_id: order.user_id || null,
      completed_at: order.completed_at || null,
    }),
    tracking_events: hydratedEvents,
    completed_at: order.completed_at || null,
    updated_at: new Date().toISOString(),
  };

  return normalizedOrder;
}

export function getStoredOrders() {
  try {
    return readOrders()
      .map((order) => {
        try {
          return hydrateOrder(order);
        } catch (error) {
          console.warn("Skipping invalid stored order during hydration.", error, order);
          return null;
        }
      })
      .filter((order): order is Order => order !== null);
  } catch (error) {
    console.warn("Unable to read stored demo orders.", error);
    return [];
  }
}

export function getStoredOrderById(orderId: string) {
  const normalized = orderId.trim().toUpperCase();
  return (
    getStoredOrders().find(
      (order) =>
        order.id.toUpperCase() === normalized ||
        order.tracking_number?.toUpperCase() === normalized
    ) ?? null
  );
}

export function createDemoOrder(args: {
  cartItems: CartItem[];
  checkoutData: CheckoutFormData;
  deliveryFee: number;
  paymentDetails?: {
    cardNumber?: string;
    upiId?: string;
  };
}) {
  const createdAt = new Date().toISOString();
  const orderId = `TL${Date.now().toString().slice(-8)}`;
  const trackingEvents = buildTrackingEvents(createdAt, args.checkoutData.payment_method);
  const orderItems: OrderItem[] = args.cartItems.map((item) => ({
    image_url: item.product.image_url || "",
    name: item.product.name,
    price: item.product.price,
    product_id: item.product.id,
    quantity: item.quantity,
  }));
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + args.deliveryFee;
  const paymentLabel =
    args.checkoutData.payment_method === "card"
      ? maskCardNumber(args.paymentDetails?.cardNumber || "")
      : args.checkoutData.payment_method === "upi"
        ? args.paymentDetails?.upiId || "UPI"
        : "Cash on delivery";

  const order: Order = {
    id: orderId,
    user_id: null,
    items: orderItems,
    total_amount: total,
    currency: "INR",
    status: "confirmed",
    payment_method: args.checkoutData.payment_method,
    payment_status: getPaymentStatus(args.checkoutData.payment_method),
    stripe_session_id: null,
    stripe_payment_intent_id: paymentLabel,
    customer_email: args.checkoutData.email,
    customer_name: args.checkoutData.full_name,
    customer_phone: args.checkoutData.phone,
    shipping_address: {
      full_name: args.checkoutData.full_name,
      phone: args.checkoutData.phone,
      address_line1: args.checkoutData.address_line1,
      address_line2: args.checkoutData.address_line2,
      city: args.checkoutData.city,
      state: args.checkoutData.state,
      postal_code: args.checkoutData.postal_code,
    },
    tracking_number: `TRK-${randomCode(10)}`,
    estimated_delivery:
      trackingEvents.find((event) => event.status === "delivered")?.timestamp ?? null,
    tracking_events: trackingEvents,
    completed_at: null,
    created_at: createdAt,
    updated_at: createdAt,
  };

  const stored = getStoredOrders();
  writeOrders([order, ...stored]);
  return order;
}
