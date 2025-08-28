
import { Product, Category } from '../types';

export const categories: Category[] = [
  { id: '1', name: 'Women', slug: 'women' },
  { id: '2', name: 'Men', slug: 'men' },
  { id: '3', name: 'Accessories', slug: 'accessories' },
  { id: '4', name: 'Footwear', slug: 'footwear' },
  { id: '5', name: 'Sale', slug: 'sale' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Classic White T-Shirt',
    price: 29.99,
    description: 'A timeless white t-shirt made from premium cotton for everyday comfort and style.',
    category: 'women',
    image: '/images/product-1.jpg',
    images: ['/images/product-1.jpg', '/images/product-1-2.jpg', '/images/product-1-3.jpg'],
    size: ['XS', 'S', 'M', 'L', 'XL'],
    color: ['White', 'Black', 'Gray'],
    featured: true,
    inStock: true,
    createdAt: '2023-01-15T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Slim Fit Jeans',
    price: 59.99,
    description: 'Modern slim fit jeans with a comfortable stretch fabric. Perfect for any casual outfit.',
    category: 'men',
    image: '/images/product-2.jpg',
    size: ['30', '32', '34', '36', '38'],
    color: ['Blue', 'Black', 'Gray'],
    inStock: true,
    createdAt: '2023-01-20T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Leather Crossbody Bag',
    price: 79.99,
    description: 'A stylish leather crossbody bag with multiple compartments for all your essentials.',
    category: 'accessories',
    image: '/images/product-3.jpg',
    color: ['Black', 'Brown', 'Tan'],
    featured: true,
    inStock: true,
    createdAt: '2023-02-05T00:00:00.000Z',
  },
  {
    id: '4',
    name: 'Running Sneakers',
    price: 89.99,
    originalPrice: 119.99,
    description: 'Lightweight and comfortable running shoes with advanced cushioning technology.',
    category: 'footwear',
    image: '/images/product-4.jpg',
    size: ['7', '8', '9', '10', '11'],
    color: ['White', 'Black', 'Blue'],
    inStock: true,
    createdAt: '2023-02-15T00:00:00.000Z',
  },
  {
    id: '5',
    name: 'Wool Blend Coat',
    price: 149.99,
    originalPrice: 199.99,
    description: 'A warm and elegant wool blend coat perfect for colder months.',
    category: 'women',
    image: '/images/product-5.jpg',
    size: ['S', 'M', 'L'],
    color: ['Camel', 'Black', 'Gray'],
    inStock: true,
    createdAt: '2023-03-01T00:00:00.000Z',
  },
  {
    id: '6',
    name: 'Cotton Button-Up Shirt',
    price: 49.99,
    description: 'A versatile button-up shirt made from soft, breathable cotton.',
    category: 'men',
    image: '/images/product-6.jpg',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    color: ['White', 'Blue', 'Pink'],
    featured: true,
    inStock: true,
    createdAt: '2023-03-10T00:00:00.000Z',
  },
  {
    id: '7',
    name: 'Gold Hoop Earrings',
    price: 34.99,
    description: 'Classic gold hoop earrings that add elegance to any outfit.',
    category: 'accessories',
    image: '/images/product-7.jpg',
    color: ['Gold', 'Silver'],
    inStock: true,
    createdAt: '2023-03-25T00:00:00.000Z',
  },
  {
    id: '8',
    name: 'Leather Chelsea Boots',
    price: 129.99,
    description: 'Stylish and durable leather Chelsea boots with elastic side panels.',
    category: 'footwear',
    image: '/images/product-8.jpg',
    size: ['7', '8', '9', '10', '11'],
    color: ['Black', 'Brown'],
    inStock: true,
    createdAt: '2023-04-05T00:00:00.000Z',
  },
];

// Placeholder image URLs for development (replace with actual image paths in production)
export const getImageUrl = (path: string): string => {
  // This function handles placeholder images for development
  if (path.startsWith('/images/')) {
    // Map to placeholder images for demo purposes
    const imageIndex = parseInt(path.split('-')[1]?.split('.')[0] || '1', 10) % 5;
    return `https://placehold.co/600x800?text=Fashion+Item+${imageIndex}`;
  }
  return path;
};

// Utility functions for filtering products
export const getProductsByCategory = (categorySlug: string): Product[] => {
  if (categorySlug === 'all' || !categorySlug) {
    return products;
  }
  return products.filter(product => product.category === categorySlug);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getNewArrivals = (): Product[] => {
  // Sort by creation date and take the 4 newest products
  return [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);
};

export const getSaleProducts = (): Product[] => {
  return products.filter(product => product.originalPrice !== undefined);
};

export const filterProducts = (
  productList: Product[],
  filters: { categories: string[]; priceRange: { min: number; max: number }; searchTerm?: string }
): Product[] => {
  return productList.filter(product => {
    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
    }
    
    // Price range filter
    if (
      product.price < filters.priceRange.min || 
      product.price > filters.priceRange.max
    ) {
      return false;
    }
    
    // Search term filter
    if (filters.searchTerm && !product.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
};
