
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { getFeaturedProducts, getNewArrivals, getSaleProducts, getImageUrl } from '@/data/products';
import { Product } from '@/types';

const Index = () => {
  // Get product lists for different sections
  const featuredProducts = getFeaturedProducts();
  const newArrivals = getNewArrivals();
  const saleProducts = getSaleProducts();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img 
          src="https://placehold.co/1920x1080?text=Fashion+Banner" 
          alt="Fashion Collection" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 h-full container mx-auto px-4 flex flex-col justify-center">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              New Season Arrivals
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Discover the latest trends and styles for your wardrobe
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link to="/products?category=women">Shop Women</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/10 text-white hover:bg-white/20">
                <Link to="/products?category=men">Shop Men</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Shop By Category</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { name: 'Women', image: 'https://placehold.co/600x800?text=Women', category: 'women' },
            { name: 'Men', image: 'https://placehold.co/600x800?text=Men', category: 'men' },
            { name: 'Accessories', image: 'https://placehold.co/600x800?text=Accessories', category: 'accessories' },
            { name: 'Footwear', image: 'https://placehold.co/600x800?text=Footwear', category: 'footwear' },
          ].map((item, index) => (
            <Link 
              key={index}
              to={`/products?category=${item.category}`} 
              className="group relative aspect-[3/4] overflow-hidden bg-gray-100 flex items-end justify-center"
            >
              <img 
                src={item.image} 
                alt={item.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="relative z-10 p-6 w-full text-center">
                <h3 className="text-xl font-medium text-white">{item.name}</h3>
                <div className="mt-2 text-sm text-white/80 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Shop Now</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-baseline mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
              <Link to="/products" className="text-sm font-medium hover:underline flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className="py-16 container mx-auto px-4">
          <div className="flex justify-between items-baseline mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">New Arrivals</h2>
            <Link to="/products" className="text-sm font-medium hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Sale Section */}
      {saleProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-10">
              <span className="text-sm uppercase text-red-500 font-medium tracking-widest">Limited Time Offer</span>
              <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-4">Sale Products</h2>
              <p className="text-gray-600">
                Grab these deals before they're gone. Limited stock available at special prices.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {saleProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Button asChild size="lg">
                <Link to="/products?category=sale">Shop All Sale Items</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Our Newsletter</h2>
            <p className="text-gray-300 mb-6">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-md text-gray-900"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
      
      {/* About/Benefits Section */}
      <section className="py-12 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="font-medium mb-2">Quality Materials</h3>
            <p className="text-gray-600 text-sm">
              We source the finest materials for all our products, ensuring quality and longevity.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
              </svg>
            </div>
            <h3 className="font-medium mb-2">Free Shipping</h3>
            <p className="text-gray-600 text-sm">
              Enjoy free standard shipping on all orders over $50 nationwide.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
            </div>
            <h3 className="font-medium mb-2">Secure Payment</h3>
            <p className="text-gray-600 text-sm">
              Your payments are secure with our encrypted payment process.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
