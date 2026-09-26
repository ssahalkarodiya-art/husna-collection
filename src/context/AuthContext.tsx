import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, getSupabaseConfig } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: 'customer' | 'atelier_member' | 'admin';
  tier: string;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  tailoringPreferences: {
    preferredLength: string;
    height: string;
    notes: string;
  };
}

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  session: any | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (val: boolean) => void;
  isConfigModalOpen: boolean;
  setIsConfigModalOpen: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_PROFILE: UserProfile = {
  id: 'guest-ayesha-khan',
  email: 'ayesha.khan@example.com',
  fullName: 'Ayesha Khan',
  phone: '+44 7911 123456',
  avatarUrl:
    'https://lh3.googleusercontent.com/aida/AEtjO1Ux23IGuynH5ZcLb4uVoCukSBEluEJxpwvfTnK6NBSec2WGxdN_P1wojon05seuTyDRnL4gjWMWQtQ3mJy2bhXnnwjpljapOskl98UQuYqGzF3_FlnYZaOjKED0cL2Mf8lszKJfobxaVDFTG2v2EhJCTH9kI-2Mxgr-uWJ5tvmZYX0jJxiygotG8T5zC1BxwBoS091fzmUzI5JoFefQ-9ufyaVDKcHwCpFc71fe3EFyAnfmg5oHLy1XAoc',
  role: 'atelier_member',
  tier: 'VIP Atelier Member',
  shippingAddress: {
    street: '14 Mayfair Gardens',
    city: 'London',
    postalCode: 'W1J 8AQ',
    country: 'United Kingdom',
  },
  tailoringPreferences: {
    preferredLength: '56',
    height: "5'6\"",
    notes: 'Prefer slight puddle drape when wearing 2-inch block heels.',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('husna_active_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const isConfigured = isSupabaseConfigured();

  // Load profile from Supabase profiles table
  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        // Fallback default from user metadata
        const fallback: UserProfile = {
          id: userId,
          email,
          fullName: user?.user_metadata?.full_name || email.split('@')[0],
          phone: '',
          role: 'customer',
          tier: 'Atelier Patron',
          shippingAddress: {
            street: '',
            city: 'London',
            postalCode: '',
            country: 'United Kingdom',
          },
          tailoringPreferences: {
            preferredLength: '56',
            height: "5'6\"",
            notes: '',
          },
        };
        setProfile(fallback);
        localStorage.setItem('husna_active_profile', JSON.stringify(fallback));
        return;
      }

      const mapped: UserProfile = {
        id: data.id,
        email: data.email,
        fullName: data.full_name || email.split('@')[0],
        phone: data.phone || '',
        avatarUrl: data.avatar_url || DEFAULT_PROFILE.avatarUrl,
        role: data.role || 'customer',
        tier: data.tier || 'VIP Atelier Member',
        shippingAddress: data.shipping_address || DEFAULT_PROFILE.shippingAddress,
        tailoringPreferences: data.tailoring_preferences || DEFAULT_PROFILE.tailoringPreferences,
      };

      setProfile(mapped);
      localStorage.setItem('husna_active_profile', JSON.stringify(mapped));
    } catch (err) {
      console.warn('Profile fetch warning:', err);
    }
  };

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    // 1. Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email || '');
      }
      setLoading(false);
    });

    // 2. Auth state subscription
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email || '');
      } else {
        // Keep default guest profile
        setProfile(DEFAULT_PROFILE);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isConfigured]);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!isConfigured) {
      // Simulate local sign in
      const simProfile: UserProfile = {
        ...DEFAULT_PROFILE,
        email,
        fullName: email.split('@')[0].toUpperCase(),
      };
      setProfile(simProfile);
      setUser({ id: 'sim-user-1', email });
      localStorage.setItem('husna_active_profile', JSON.stringify(simProfile));
      return { success: true };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        await fetchProfile(data.user.id, data.user.email || email);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to sign in.' };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isConfigured) {
      // Simulate local sign up
      const simProfile: UserProfile = {
        ...DEFAULT_PROFILE,
        id: `user-${Date.now()}`,
        email,
        fullName,
      };
      setProfile(simProfile);
      setUser({ id: simProfile.id, email });
      localStorage.setItem('husna_active_profile', JSON.stringify(simProfile));
      return { success: true };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        await fetchProfile(data.user.id, data.user.email || email);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to sign up.' };
    }
  };

  const signOut = async () => {
    if (isConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Sign out warning:', err);
      }
    }
    setUser(null);
    setSession(null);
    setProfile(DEFAULT_PROFILE);
    localStorage.removeItem('husna_active_profile');
  };

  const updateProfile = async (
    updates: Partial<UserProfile>
  ): Promise<{ success: boolean; error?: string }> => {
    const updated = { ...profile, ...updates } as UserProfile;
    setProfile(updated);
    localStorage.setItem('husna_active_profile', JSON.stringify(updated));

    if (isConfigured && user?.id) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: updated.fullName,
            phone: updated.phone,
            avatar_url: updated.avatarUrl,
            shipping_address: updated.shippingAddress,
            tailoring_preferences: updated.tailoringPreferences,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (error) throw error;
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isConfigured,
        signIn,
        signUp,
        signOut,
        updateProfile,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isConfigModalOpen,
        setIsConfigModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
