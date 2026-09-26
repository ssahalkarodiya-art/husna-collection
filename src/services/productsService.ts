import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Product } from '../types';
import { PRODUCTS as FALLBACK_PRODUCTS } from '../data/products';

export const productsService = {
  async getAll(): Promise<Product[]> {
    if (!isSupabaseConfigured()) {
      return FALLBACK_PRODUCTS;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        if (error) console.warn('Supabase products fetch note:', error.message);
        return FALLBACK_PRODUCTS;
      }

      // Map Supabase snake_case columns to Product interface
      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        subtitle: item.subtitle || '',
        price: Number(item.price),
        originalPrice: item.original_price ? Number(item.original_price) : undefined,
        rating: Number(item.rating || 5.0),
        reviewsCount: Number(item.reviews_count || 0),
        category: item.category,
        categoryLabel: item.category_label || item.category,
        fabric: item.fabric,
        images: item.images || {},
        alt: item.alt || item.name,
        badge: item.badge,
        colors: item.colors || [],
        sizes: item.sizes || [],
        description: item.description || '',
        details: item.details || [],
        fabricCare: item.fabric_care || {
          material: item.fabric,
          careTips: ['Professional dry clean recommended', 'Steam inside-out'],
        },
        isNewArrival: item.is_new_arrival,
      }));
    } catch (err) {
      console.warn('Fallback to local products due to:', err);
      return FALLBACK_PRODUCTS;
    }
  },

  async getById(id: string): Promise<Product | null> {
    const all = await this.getAll();
    return all.find((p) => p.id === id) || null;
  },

  async create(product: Partial<Product>): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase is not configured with credentials.' };
    }

    try {
      const { error } = await supabase.from('products').insert([
        {
          id: product.id || product.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: product.name,
          subtitle: product.subtitle,
          price: product.price,
          original_price: product.originalPrice,
          category: product.category,
          category_label: product.categoryLabel,
          fabric: product.fabric,
          badge: product.badge,
          alt: product.alt,
          description: product.description,
          details: product.details,
          images: product.images,
          colors: product.colors,
          sizes: product.sizes,
          is_new_arrival: product.isNewArrival,
        },
      ]);

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
};
