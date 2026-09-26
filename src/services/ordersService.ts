import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { CartItem } from '../types';

export interface CreateOrderParams {
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  promoCode?: string;
  paymentMethod: string;
  giftBoxIncluded: boolean;
  notes?: string;
  items: CartItem[];
}

export interface StoredOrder {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: string;
  tracking: string;
  courier: string;
  items: {
    name: string;
    qty: number;
    price: number;
    color?: string;
    size?: string;
    image?: string;
  }[];
}

const LOCAL_ORDERS_KEY = 'husna_saved_orders';

export const ordersService = {
  async createOrder(params: CreateOrderParams): Promise<{ success: boolean; orderNumber: string; error?: string }> {
    const orderNumber = `HUSNA-${Math.floor(10000 + Math.random() * 90000)}`;

    // Always keep a local copy for instant client feedback and guest viewing
    const localOrder: StoredOrder = {
      id: orderNumber,
      orderNumber,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      total: params.total,
      status: 'Order Confirmed • Atelier Tailoring',
      tracking: `DHL-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      courier: 'DHL Express',
      items: params.items.map((i) => ({
        name: `${i.name} (${i.size ? `Length ${i.size}` : ''}${i.color ? `, ${i.color}` : ''})`,
        qty: i.quantity,
        price: i.price,
        color: i.color,
        size: i.size,
        image: i.image,
      })),
    };

    try {
      const existingRaw = localStorage.getItem(LOCAL_ORDERS_KEY);
      const existing: StoredOrder[] = existingRaw ? JSON.parse(existingRaw) : [];
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify([localOrder, ...existing]));
    } catch {
      // ignore
    }

    if (!isSupabaseConfigured()) {
      return { success: true, orderNumber };
    }

    try {
      // 1. Insert into orders table
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            order_number: orderNumber,
            user_id: params.userId || null,
            customer_name: params.customerName,
            customer_email: params.customerEmail,
            customer_phone: params.customerPhone,
            shipping_address: params.shippingAddress,
            subtotal: params.subtotal,
            discount_amount: params.discountAmount,
            shipping_fee: params.shippingFee,
            total: params.total,
            promo_code: params.promoCode || null,
            payment_method: params.paymentMethod,
            payment_status: 'paid',
            fulfillment_status: 'processing',
            tracking_number: localOrder.tracking,
            tracking_courier: 'DHL Express',
            gift_box_included: params.giftBoxIncluded,
            custom_tailoring_notes: params.notes || null,
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert order items
      if (orderData?.id && params.items.length > 0) {
        const orderItemsToInsert = params.items.map((item) => ({
          order_id: orderData.id,
          product_id: item.productId,
          product_name: item.name,
          subtitle: item.subtitle,
          selected_color: item.color,
          selected_size: item.size,
          unit_price: item.price,
          quantity: item.quantity,
          total_price: item.price * item.quantity,
          image_url: item.image,
        }));

        const { error: itemsError } = await supabase.from('order_items').insert(orderItemsToInsert);
        if (itemsError) console.warn('Order items insert warning:', itemsError.message);
      }

      return { success: true, orderNumber };
    } catch (err: any) {
      console.warn('Supabase order creation note:', err.message);
      // We still return true because the order was logged locally
      return { success: true, orderNumber };
    }
  },

  async getUserOrders(userId?: string, userEmail?: string): Promise<StoredOrder[]> {
    // Check Supabase if configured and user is logged in
    if (isSupabaseConfigured() && (userId || userEmail)) {
      try {
        let query = supabase
          .from('orders')
          .select(`
            id,
            order_number,
            created_at,
            total,
            fulfillment_status,
            tracking_number,
            tracking_courier,
            order_items (
              product_name,
              quantity,
              unit_price,
              selected_color,
              selected_size,
              image_url
            )
          `)
          .order('created_at', { ascending: false });

        if (userId) {
          query = query.eq('user_id', userId);
        } else if (userEmail) {
          query = query.eq('customer_email', userEmail);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((o: any) => ({
            id: o.order_number,
            orderNumber: o.order_number,
            date: new Date(o.created_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }),
            total: Number(o.total),
            status:
              o.fulfillment_status === 'shipped'
                ? `Shipped via ${o.tracking_courier || 'DHL'}`
                : o.fulfillment_status === 'delivered'
                ? 'Delivered'
                : 'Processing • Atelier Tailoring',
            tracking: o.tracking_number || 'Awaiting assignment',
            courier: o.tracking_courier || 'DHL Express',
            items: (o.order_items || []).map((item: any) => ({
              name: item.product_name,
              qty: item.quantity,
              price: Number(item.unit_price),
              color: item.selected_color,
              size: item.selected_size,
              image: item.image_url,
            })),
          }));
        }
      } catch (err) {
        console.warn('Failed to fetch orders from Supabase:', err);
      }
    }

    // Fallback to local stored orders
    try {
      const stored = localStorage.getItem(LOCAL_ORDERS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }

    // Default simulated starter orders for showroom demo
    return [
      {
        id: 'HUSNA-92841',
        orderNumber: 'HUSNA-92841',
        date: 'March 14, 2026',
        total: 135.6,
        status: 'Shipped via DHL Express',
        tracking: 'DHL-9482710398',
        courier: 'DHL Express',
        items: [
          { name: 'Classic Black Abaya (Length 56, Deep Onyx)', qty: 1, price: 85.0 },
          { name: 'Modest Co-ord Set (Size M, Warm Taupe)', qty: 1, price: 72.0 },
          { name: 'Matching Silk Chiffon Hijab (Gift)', qty: 1, price: 0.0 },
        ],
      },
    ];
  },
};
