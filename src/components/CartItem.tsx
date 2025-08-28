
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CartItem as CartItemType } from '@/types';
import { useCartContext } from '@/contexts/CartContext';
import { getImageUrl } from '@/data/products';
import { X, Plus, Minus } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCartContext();
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (value: string) => {
    setLoading(true);
    setTimeout(() => {
      updateQuantity(item.product.id, parseInt(value));
      setLoading(false);
    }, 300); // Simulating API call
  };

  const handleRemove = () => {
    setLoading(true);
    setTimeout(() => {
      removeFromCart(item.product.id);
      setLoading(false);
    }, 300); // Simulating API call
  };

  const incrementQuantity = () => {
    updateQuantity(item.product.id, item.quantity + 1);
  };

  const decrementQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(item.product.id, item.quantity - 1);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row border-b py-6 gap-4 relative">
      {loading && (
        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
          <div className="animate-pulse">Updating...</div>
        </div>
      )}
      
      <Link to={`/products/${item.product.id}`} className="w-full sm:w-32 h-40">
        <img
          src={getImageUrl(item.product.image)}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </Link>
      
      <div className="flex-1 flex flex-col sm:flex-row">
        <div className="flex-1">
          <div className="flex justify-between">
            <Link to={`/products/${item.product.id}`} className="hover:underline font-medium">
              {item.product.name}
            </Link>
            <Button variant="ghost" size="icon" onClick={handleRemove} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-sm text-gray-500 capitalize mt-1">
            Category: {item.product.category}
          </div>
          
          {item.selectedSize && (
            <div className="text-sm mt-1">
              Size: {item.selectedSize}
            </div>
          )}
          
          {item.selectedColor && (
            <div className="text-sm mt-1">
              Color: {item.selectedColor}
            </div>
          )}
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-end sm:items-start justify-between sm:flex-col sm:items-end gap-4">
          <div className="flex border rounded-md">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 p-0 rounded-none"
              onClick={decrementQuantity}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <div className="w-8 flex items-center justify-center text-sm">
              {item.quantity}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 p-0 rounded-none"
              onClick={incrementQuantity}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="text-sm font-medium">
            ${(item.product.price * item.quantity).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
