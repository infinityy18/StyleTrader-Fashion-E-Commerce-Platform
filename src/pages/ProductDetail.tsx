
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ProductCard from '@/components/ProductCard';
import { getProductById, getProductsByCategory, getImageUrl } from '@/data/products';
import { useCartContext } from '@/contexts/CartContext';
import { Product } from '@/types';
import { ArrowLeft, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCartContext();
  const { toast } = useToast();
  
  // Get product data
  const product = id ? getProductById(id) : undefined;
  
  // State variables
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  // Set up initial state based on product data
  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      
      // Set default size if available
      if (product.size && product.size.length > 0) {
        setSelectedSize(product.size[0]);
      }
      
      // Set default color if available
      if (product.color && product.color.length > 0) {
        setSelectedColor(product.color[0]);
      }
      
      // Get related products from same category
      if (product.category) {
        const categoryProducts = getProductsByCategory(product.category)
          .filter(p => p.id !== product.id)
          .slice(0, 4);
        setRelatedProducts(categoryProducts);
      }
      
      // Scroll to top when product changes
      window.scrollTo(0, 0);
    }
  }, [product]);
  
  // Handle quantity changes
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    
    // Check if size is required but not selected
    if (product.size && product.size.length > 0 && !selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      setIsAddingToCart(false);
      return;
    }
    
    // Check if color is required but not selected
    if (product.color && product.color.length > 0 && !selectedColor) {
      toast({
        title: "Please select a color",
        variant: "destructive",
      });
      setIsAddingToCart(false);
      return;
    }
    
    // Simulate API call delay
    setTimeout(() => {
      addToCart(product, quantity, selectedSize, selectedColor);
      setIsAddingToCart(false);
    }, 500);
  };
  
  // Redirect if product not found
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <main className="py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button 
          variant="outline" 
          className="mb-6" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-gray-100">
              <img 
                src={getImageUrl(selectedImage)} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 w-20 h-20 border ${
                      selectedImage === image ? 'border-black' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img 
                      src={getImageUrl(image)} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div>
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
              <div className="mt-2 flex items-baseline">
                {product.originalPrice ? (
                  <>
                    <span className="text-xl font-medium">${product.price.toFixed(2)}</span>
                    <span className="ml-2 text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                    <span className="ml-2 text-sm text-red-500">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-xl font-medium">${product.price.toFixed(2)}</span>
                )}
              </div>
            </div>
            
            {/* Size Selection */}
            {product.size && product.size.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Size</span>
                  <Link to="#" className="text-xs underline text-gray-500">Size Guide</Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.size.map((size) => (
                    <button
                      key={size}
                      className={`px-4 py-2 border ${
                        selectedSize === size 
                          ? 'border-black bg-black text-white' 
                          : 'border-gray-300 hover:border-gray-500'
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Color Selection */}
            {product.color && product.color.length > 0 && (
              <div className="mb-6">
                <span className="text-sm font-medium block mb-2">Color</span>
                <div className="flex flex-wrap gap-2">
                  {product.color.map((color) => (
                    <button
                      key={color}
                      className={`px-4 py-2 border ${
                        selectedColor === color 
                          ? 'border-black bg-black text-white' 
                          : 'border-gray-300 hover:border-gray-500'
                      }`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity and Add to Cart */}
            <div className="mb-6">
              <span className="text-sm font-medium block mb-2">Quantity</span>
              <div className="flex">
                <div className="flex items-center border border-gray-300">
                  <button
                    className="px-4 py-2 hover:bg-gray-100"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <button
                    className="px-4 py-2 hover:bg-gray-100"
                    onClick={incrementQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <Button 
              className="w-full mb-6 h-12"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Adding...
                </span>
              ) : (
                <span className="flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
                </span>
              )}
            </Button>
            
            {/* Product Description Tabs */}
            <Tabs defaultValue="description" className="mt-8">
              <TabsList className="w-full">
                <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
                <TabsTrigger value="shipping" className="flex-1">Shipping & Returns</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="pt-4">
                <p className="text-gray-700">
                  {product.description}
                </p>
              </TabsContent>
              <TabsContent value="shipping" className="pt-4">
                <div className="text-gray-700">
                  <p className="mb-4">
                    <strong className="font-medium">Free Standard Shipping</strong><br />
                    For orders over $50. Delivery within 3-5 business days.
                  </p>
                  <p>
                    <strong className="font-medium">Returns</strong><br />
                    Easy returns within 30 days of delivery. 
                    Unworn, unwashed items in original packaging can be returned for a full refund.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-xl md:text-2xl font-bold mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductDetail;
