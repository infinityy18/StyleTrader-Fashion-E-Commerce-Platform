
import { useState, useEffect, useCallback } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { 
  Sheet,
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Filter } from 'lucide-react';
import { categories } from '@/data/products';
import { Category, FilterOptions, PriceRange } from '@/types';
import { cn } from '@/lib/utils';

interface FilterSidebarProps {
  className?: string;
  selectedCategories: string[];
  priceRange: PriceRange;
  sortOption: string;
  onFilterChange: (filters: FilterOptions) => void;
  maxPrice: number;
}

const FilterSidebar = ({
  className,
  selectedCategories,
  priceRange,
  sortOption,
  onFilterChange,
  maxPrice
}: FilterSidebarProps) => {
  // Local state for filters
  const [localCategories, setLocalCategories] = useState<string[]>(selectedCategories);
  const [localPriceRange, setLocalPriceRange] = useState<PriceRange>(priceRange);
  const [localSortOption, setLocalSortOption] = useState<string>(sortOption);
  
  // Only update local state when props change (prevents unnecessary re-renders)
  useEffect(() => {
    setLocalCategories(selectedCategories);
  }, [selectedCategories]);
  
  useEffect(() => {
    setLocalPriceRange(priceRange);
  }, [priceRange]);
  
  useEffect(() => {
    setLocalSortOption(sortOption);
  }, [sortOption]);
  
  // Handle category checkbox changes (memoized)
  const handleCategoryChange = useCallback((categorySlug: string) => {
    setLocalCategories(prev => {
      if (prev.includes(categorySlug)) {
        return prev.filter(cat => cat !== categorySlug);
      } else {
        return [...prev, categorySlug];
      }
    });
  }, []);
  
  // Handle price slider changes (memoized with debouncing)
  const handlePriceRangeChange = useCallback((value: number[]) => {
    setLocalPriceRange({ min: value[0], max: value[1] });
  }, []);

  // Debounced filter application to prevent excessive re-renders
  useEffect(() => {
    const timer = setTimeout(() => {
      // Apply filters when local price range changes
      onFilterChange({
        categories: localCategories,
        priceRange: localPriceRange,
        sortBy: localSortOption,
      });
    }, 300); // Debounce filter application
    
    return () => clearTimeout(timer);
  }, [localPriceRange, localCategories, localSortOption, onFilterChange]);
  
  // Handle sort option changes (memoized)
  const handleSortOptionChange = useCallback((value: string) => {
    setLocalSortOption(value);
  }, []);
  
  // Apply filters manually (used for mobile sheet close and desktop apply button)
  const applyFilters = useCallback(() => {
    onFilterChange({
      categories: localCategories,
      priceRange: localPriceRange,
      sortBy: localSortOption,
    });
  }, [localCategories, localPriceRange, localSortOption, onFilterChange]);
  
  // Reset filters (memoized)
  const resetFilters = useCallback(() => {
    setLocalCategories([]);
    setLocalPriceRange({ min: 0, max: maxPrice });
    setLocalSortOption('recommended');
    
    onFilterChange({
      categories: [],
      priceRange: { min: 0, max: maxPrice },
      sortBy: 'recommended',
    });
  }, [maxPrice, onFilterChange]);
  
  // Content for the Filter sidebar/dropdown
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm">Categories</h3>
        <div className="space-y-2">
          {categories.map((category: Category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`category-${category.slug}`}
                checked={localCategories.includes(category.slug)}
                onCheckedChange={() => handleCategoryChange(category.slug)}
              />
              <label 
                htmlFor={`category-${category.slug}`}
                className="text-sm font-normal capitalize cursor-pointer"
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">Price Range</h3>
          <span className="text-xs text-gray-500">
            ${localPriceRange.min.toFixed(0)} - ${localPriceRange.max.toFixed(0)}
          </span>
        </div>
        <Slider
          value={[localPriceRange.min, localPriceRange.max]}
          max={maxPrice}
          min={0}
          step={5}
          onValueChange={handlePriceRangeChange}
          className="py-4"
        />
      </div>

      {/* Sort By */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm">Sort By</h3>
        <div className="space-y-2">
          {['recommended', 'price-asc', 'price-desc', 'newest'].map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <input
                type="radio"
                id={`sort-${option}`}
                name="sortOption"
                value={option}
                checked={localSortOption === option}
                onChange={() => handleSortOptionChange(option)}
                className="h-4 w-4 border-gray-300 text-black focus:ring-0"
              />
              <label htmlFor={`sort-${option}`} className="text-sm capitalize cursor-pointer">
                {option === 'price-asc' ? 'Price: Low to High' :
                  option === 'price-desc' ? 'Price: High to Low' :
                  option === 'newest' ? 'Newest First' : 'Recommended'}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  // Desktop filter sidebar
  const DesktopFilter = () => (
    <div className={cn("w-64 shrink-0 pr-8 py-6 hidden md:block", className)}>
      <div className="sticky top-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-medium">Filters</h2>
          <Button 
            variant="link" 
            size="sm" 
            onClick={resetFilters} 
            className="h-auto p-0 text-gray-500 hover:text-gray-800"
          >
            Reset
          </Button>
        </div>
        
        <FilterContent />
        
        <div className="mt-6">
          <Button 
            onClick={applyFilters} 
            className="w-full"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
  
  // Mobile filter sheet
  const MobileFilter = () => (
    <div className="block md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="flex gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter & Sort</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] px-4">
          <SheetHeader>
            <SheetTitle className="text-left text-lg">Filter & Sort</SheetTitle>
          </SheetHeader>
          
          <div className="overflow-y-auto pt-4" style={{ maxHeight: 'calc(85vh - 140px)' }}>
            <FilterContent />
          </div>
          
          <SheetFooter className="flex flex-row gap-3 pt-4 border-t mt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={resetFilters}
            >
              Reset
            </Button>
            <SheetClose asChild>
              <Button 
                className="flex-1"
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
  
  return (
    <>
      <DesktopFilter />
      <MobileFilter />
    </>
  );
};

export default FilterSidebar;
