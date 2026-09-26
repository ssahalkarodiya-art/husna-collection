import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const wishlistService = {
  async getWishlist(userId: string): Promise<string[]> {
    if (!isSupabaseConfigured() || !userId) {
      try {
        const stored = localStorage.getItem('husna_wishlist');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }

    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('product_id')
        .eq('user_id', userId);

      if (error) throw error;
      return (data || []).map((row) => row.product_id);
    } catch (err) {
      console.warn('Error fetching Supabase wishlist:', err);
      try {
        const stored = localStorage.getItem('husna_wishlist');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
  },

  async add(userId: string, productId: string): Promise<boolean> {
    if (!isSupabaseConfigured() || !userId) return true;

    try {
      const { error } = await supabase
        .from('wishlist_items')
        .upsert({ user_id: userId, product_id: productId });
      return !error;
    } catch {
      return false;
    }
  },

  async remove(userId: string, productId: string): Promise<boolean> {
    if (!isSupabaseConfigured() || !userId) return true;

    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);
      return !error;
    } catch {
      return false;
    }
  },
};
