import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import { Button } from '@/components/ui/button';
import { products, filterProducts } from '@/data/products';
import { FilterOptions, Product, PriceRange } from '@/types';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchTerm = searchParams.get('search');

  // Find max price for the price range slider
  const maxPrice = useMemo(() => Math.max(...products.map(p => p.price), 200), []);

  // State for filters
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: maxPrice });
  const [sortOption, setSortOption] = useState<string>('recommended');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Apply filters whenever they change
  useEffect(() => {
    // Simulate loading state for better UX
    setIsLoading(true);

    // Filter products based on selected filters
    const filtered = filterProducts(products, {
      categories: selectedCategories,
      priceRange: priceRange,
      searchTerm: searchTerm || undefined
    });
    
    // Sort filtered products
    let sorted = [...filtered];
    switch (sortOption) {
      case 'price-asc':
        sorted = sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted = sorted.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sorted = sorted.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        // recommended sort - keep default order or implement custom logic
        break;
    }
    
    // Simulate network delay
    const timer = setTimeout(() => {
      setFilteredProducts(sorted);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [selectedCategories, priceRange, sortOption, searchTerm]);

  // Update URL params when filters change (debounced to avoid excessive updates)
  useEffect(() => {
    const timer = setTimeout(() => {
      const newParams = new URLSearchParams();
      
      // Add categories to URL params
      if (selectedCategories.length === 1) {
        newParams.set('category', selectedCategories[0]);
      }
      
      // Add search term to URL params if it exists
      if (searchTerm) {
        newParams.set('search', searchTerm);
      }
      
      // Update URL with new params without full page reload
      setSearchParams(newParams, { replace: true });
    }, 300); // Debounce URL updates
    
    return () => clearTimeout(timer);
  }, [selectedCategories, searchTerm, setSearchParams]);

  // Initialize filters from URL params on component mount
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
    
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, [categoryParam]);

  // Handle filter changes (memoized to prevent unnecessary re-renders)
  const handleFilterChange = useCallback((filters: FilterOptions) => {
    setSelectedCategories(filters.categories);
    setPriceRange(filters.priceRange);
    setSortOption(filters.sortBy);
  }, []);

  // Clear filters function (memoized)
  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: maxPrice });
    setSortOption('recommended');
    setSearchParams({});
  }, [maxPrice, setSearchParams]);

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Sidebar */}
          <FilterSidebar
            selectedCategories={selectedCategories}
            priceRange={priceRange}
            sortOption={sortOption}
            onFilterChange={handleFilterChange}
            maxPrice={maxPrice}
          />
          
          {/* Product Grid */}
          <div className="flex-1">
            {/* Header with results count and mobile filter */}
            <div className="flex flex-wrap justify-between items-center mb-6">
              <div>
                <h1 className="text-xl md:text-2xl font-bold">
                  {searchTerm 
                    ? `Search results for "${searchTerm}"`
                    : categoryParam 
                      ? `${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)}`
                      : 'All Products'
                  }
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                </p>
              </div>
            </div>
            
            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((placeholder) => (
                  <div key={placeholder} className="animate-pulse">
                    <div className="bg-gray-200 aspect-[3/4] mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search term</p>
                <Button onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Products;
