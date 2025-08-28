
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  image: string;
  images?: string[];
  size?: string[];
  color?: string[];
  featured?: boolean;
  inStock: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export type PriceRange = {
  min: number;
  max: number;
};

export interface FilterOptions {
  categories: string[];
  priceRange: PriceRange;
  sortBy: string;
}
