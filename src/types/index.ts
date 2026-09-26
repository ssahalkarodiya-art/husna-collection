export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  category: 'abayas' | 'hijabs' | 'dresses' | 'coord-sets' | 'outerwear' | 'kimonos' | 'accessories';
  categoryLabel: string;
  fabric: string;
  images: {
    front: string;
    texture?: string;
    sleeve?: string;
    motion?: string;
  };
  alt: string;
  badge?: 'Bestseller' | 'Limited' | 'Artisan Haute' | 'Eid Edition' | 'Essential' | 'Trending';
  colors: {
    name: string;
    hex: string;
  }[];
  sizes: {
    length: string;
    heightRec: string;
  }[];
  description: string;
  details: string[];
  fabricCare: {
    material: string;
    careTips: string[];
  };
  isNewArrival?: boolean;
}

export interface CartItem {
  id: string; // product id + color + size combination
  productId: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
  isGift?: boolean;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  verified: boolean;
  content: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
  date: string;
  image: string;
  content: string[];
}

export interface FilterState {
  category: string;
  fabricTypes: string[];
  lengths: string[];
  colors: string[];
  priceRange: [number, number];
  searchQuery: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}
