import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { SearchModal } from './components/SearchModal';
import { WishlistModal } from './components/WishlistModal';
import { AuthModal } from './components/AuthModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';
import { ContactPage } from './pages/ContactPage';
import { AccountPage } from './pages/AccountPage';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('classic-embroidered-linen-abaya');
  const [shopCategoryFilter, setShopCategoryFilter] = useState<string>('all');

  const { toast, setIsCheckoutModalOpen } = useCart();

  // Navigation handler
  const handleNavigate = (page: string, param?: string) => {
    if (page === 'product') {
      if (param) setSelectedProductId(param);
      setCurrentPage('product');
    } else if (page === 'shop') {
      setShopCategoryFilter(param || 'all');
      setCurrentPage('shop');
    } else if (page === 'new-arrivals') {
      setShopCategoryFilter('new-arrivals');
      setCurrentPage('shop');
    } else {
      setCurrentPage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keep browser history back/forward responsive if needed
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf9f3] text-[#1c1c18] font-sans antialiased">
      {/* Sticky Header */}
      <Header currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main Page View */}
      <main className="flex-1 w-full pt-20">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'shop' && (
          <ShopPage
            initialCategory={shopCategoryFilter}
            onNavigate={handleNavigate}
          />
        )}
        {currentPage === 'product' && (
          <ProductDetailPage
            productId={selectedProductId}
            onNavigate={handleNavigate}
          />
        )}
        {currentPage === 'cart' && <CartPage onNavigate={handleNavigate} />}
        {currentPage === 'collections' && <CollectionsPage onNavigate={handleNavigate} />}
        {currentPage === 'about-us' && <AboutPage onNavigate={handleNavigate} />}
        {currentPage === 'blog' && <BlogPage />}
        {currentPage === 'contact-us' && <ContactPage />}
        {currentPage === 'account' && <AccountPage onNavigate={handleNavigate} />}
      </main>

      {/* Brand Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Slide-over & Modal Overlays */}
      <CartDrawer
        onNavigateToCart={() => handleNavigate('cart')}
        onNavigateToCheckout={() => setIsCheckoutModalOpen(true)}
        onProductClick={(id) => handleNavigate('product', id)}
      />

      <CheckoutModal
        onSuccessReturn={() => handleNavigate('account')}
      />

      <SizeGuideModal />

      <SearchModal
        onSelectProduct={(id) => handleNavigate('product', id)}
      />

      <WishlistModal
        onSelectProduct={(id) => handleNavigate('product', id)}
      />

      {/* Supabase Authentication & Connection Modals */}
      <AuthModal />
      <SupabaseConfigModal />

      {/* Floating Notification Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-300 pointer-events-none">
          <div className="bg-[#171411] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/10 max-w-sm">
            <span className="w-8 h-8 rounded-full bg-[#5c6149] flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined text-sm">check</span>
            </span>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold">{toast.title}</span>
              <span className="text-[11px] text-[#cfc4bd] truncate max-w-xs">{toast.detail}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

