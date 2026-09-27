import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { BRAND_INFO, PRODUCTS } from '../data/products';

interface ToastMessage {
  id: string;
  title: string;
  detail: string;
  type?: 'success' | 'info';
}

interface CartContextType {
  cart: CartItem[];
  wishlist: string[]; // product IDs
  addToCart: (product: Product, color?: string, size?: string, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCartFromWishlist: (productId: string) => void;
  
  // Promo and gift options
  promoCode: string;
  isPromoApplied: boolean;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  includeGiftBox: boolean;
  setIncludeGiftBox: (val: boolean) => void;

  // Financial calculations
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  freeShippingProgress: {
    needed: number;
    percent: number;
    isUnlocked: boolean;
  };
  hasUnlockedFreeHijab: boolean;

  // Modals & Drawers
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (val: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (val: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (val: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (val: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (val: boolean) => void;

  // Toast
  toast: ToastMessage | null;
  showToast: (title: string, detail: string) => void;

  // WhatsApp helper
  getWhatsAppCartLink: () => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Initial default cart matching Atelier modest catalog in Indian Rupees
const INITIAL_CART: CartItem[] = [
  {
    id: 'classic-black-abaya-Deep Onyx-56',
    productId: 'classic-black-abaya',
    name: 'Classic Black Nidha Abaya',
    subtitle: 'Signature Korean Nida • Tailored Drape',
    price: 6499,
    originalPrice: 7999,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD21CgfOWX_ZE8kTJa0S6Jf76Wv3M-HCIzvIbYgUVTOkjr8wCIetR_1jE0iJ9p1ZbhK9VSxD9VTq7I52iy6OBYJCPOnOlnixW1_kLbHmQvWWxJY3GwQveoP3qwvFvq2GWFRvobwp3A3ARoYAbMzBpFPgDxXD9_peV9EPZ1S9DC0HTQqjSPxlPLpfcdfe1d2Y6-ZkvNJh7bUJMahMYth89ukYCr3U1DXO2JoM8dv1QUQYB9uNyKh5Xtv',
    color: 'Deep Onyx',
    size: '56',
    quantity: 1,
  },
  {
    id: 'atelier-silk-bonnet-cap-Deep Black-Atelier Standard (M/L)',
    productId: 'atelier-silk-bonnet-cap',
    name: 'Atelier Silk-Lined Bamboo Bonnet Cap',
    subtitle: 'Pure Mulberry Silk Lining • Non-Slip Contour',
    price: 1299,
    originalPrice: 1699,
    image: '/caps/cap-silk-bonnet.svg',
    color: 'Deep Black',
    size: 'Atelier Standard (M/L)',
    quantity: 1,
  },
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('husna_cart');
      return saved ? JSON.parse(saved) : INITIAL_CART;
    } catch {
      return INITIAL_CART;
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('husna_wishlist');
      return saved ? JSON.parse(saved) : ['classic-embroidered-linen-abaya', 'aura-belted-medina-kaftan'];
    } catch {
      return ['classic-embroidered-linen-abaya', 'aura-belted-medina-kaftan'];
    }
  });

  const [promoCode, setPromoCode] = useState<string>('HUSNA20');
  const [isPromoApplied, setIsPromoApplied] = useState<boolean>(true);
  const [includeGiftBox, setIncludeGiftBox] = useState<boolean>(true);

  // Modals state
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (title: string, detail: string) => {
    const id = Date.now().toString();
    setToast({ id, title, detail, type: 'success' });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3500);
  };

  useEffect(() => {
    try {
      localStorage.setItem('husna_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('husna_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  const addToCart = (product: Product, color?: string, size?: string, quantity: number = 1) => {
    const chosenColor = color || product.colors[0]?.name || 'Standard';
    const chosenSize = size || product.sizes[0]?.length || 'One Size';
    const itemId = `${product.id}-${chosenColor}-${chosenSize}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: product.id,
          name: product.name,
          subtitle: product.subtitle,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images.front,
          color: chosenColor,
          size: chosenSize,
          quantity,
        },
      ];
    });

    showToast(
      'Added to your Bag',
      `${product.name} • ${chosenColor}, Size ${chosenSize} (Qty ${quantity})`
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === itemId);
      if (item) {
        showToast('Removed from Bag', item.name);
      }
      return prev.filter((i) => i.id !== itemId);
    });
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem('husna_cart');
    } catch {
      // ignore
    }
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const isSaved = prev.includes(productId);
      const product = PRODUCTS.find((p) => p.id === productId);
      if (isSaved) {
        showToast('Removed from Wishlist', product?.name || 'Item removed');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to Wishlist', product?.name || 'Item saved');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const moveToCartFromWishlist = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (product) {
      addToCart(product);
      setWishlist((prev) => prev.filter((id) => id !== productId));
    }
  };

  const applyPromo = (code: string) => {
    if (code.trim().toUpperCase() === BRAND_INFO.promoCode) {
      setPromoCode(BRAND_INFO.promoCode);
      setIsPromoApplied(true);
      showToast('Promo Code Applied', '20% off has been applied to your checkout.');
      return true;
    }
    showToast('Invalid Code', 'Please enter a valid coupon (try HUSNA20).');
    return false;
  };

  const removePromo = () => {
    setIsPromoApplied(false);
    showToast('Promo Removed', 'Discount coupon has been removed.');
  };

  // Financial calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = isPromoApplied ? subtotal * (BRAND_INFO.discountPercent / 100) : 0;
  
  // Free shipping threshold logic
  const isFreeShippingUnlocked = subtotal >= BRAND_INFO.freeShippingThreshold;
  const shippingFee = subtotal === 0 || isFreeShippingUnlocked ? 0 : BRAND_INFO.shippingFee;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const neededForFreeShipping = Math.max(0, BRAND_INFO.freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(
    100,
    Math.round((subtotal / BRAND_INFO.freeShippingThreshold) * 100)
  );

  const freeShippingProgress = {
    needed: neededForFreeShipping,
    percent: freeShippingPercent,
    isUnlocked: isFreeShippingUnlocked,
  };

  const hasUnlockedFreeHijab = subtotal >= 6999;

  const getWhatsAppCartLink = () => {
    if (cart.length === 0) {
      return `https://wa.me/917227972655?text=${encodeURIComponent(
        'Hello Husna Collection Concierge, I would like personal styling assistance with your modest collection.'
      )}`;
    }
    const itemsSummary = cart
      .map(
        (item) => `• ${item.name} (${item.color}, Size ${item.size}) x${item.quantity} = ₹${(item.price * item.quantity).toLocaleString('en-IN')}`
      )
      .join('\n');
    
    const message = `Assalamu Alaikum / Hello Husna Collection Stylist,\n\nI would like to order my shopping bag items:\n${itemsSummary}\n\nEstimated Subtotal: ₹${subtotal.toLocaleString('en-IN')}${
      isPromoApplied ? `\nPromo (HUSNA20): -₹${discountAmount.toLocaleString('en-IN')}` : ''
    }\nShipping: ${shippingFee === 0 ? 'FREE' : `₹${shippingFee.toLocaleString('en-IN')}`}\nEstimated Total: ₹${total.toLocaleString('en-IN')}\n\nPlease assist me with size confirmation and direct VIP checkout.`;

    return `https://wa.me/917227972655?text=${encodeURIComponent(message)}`;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        moveToCartFromWishlist,
        promoCode,
        isPromoApplied,
        applyPromo,
        removePromo,
        includeGiftBox,
        setIncludeGiftBox,
        subtotal,
        discountAmount,
        shippingFee,
        total,
        freeShippingProgress,
        hasUnlockedFreeHijab,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        isSearchOpen,
        setIsSearchOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        toast,
        showToast,
        getWhatsAppCartLink,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
