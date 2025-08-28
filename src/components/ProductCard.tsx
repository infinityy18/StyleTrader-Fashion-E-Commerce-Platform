
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { getImageUrl } from '@/data/products';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  return (
    <div 
      className={cn(
        "group bg-white rounded-md overflow-hidden shadow-sm product-card-transition product-card-hover",
        className
      )}
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.originalPrice && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
              SALE
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium line-clamp-1">{product.name}</h3>
            <div className="ml-2 flex-shrink-0">
              {product.originalPrice ? (
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium">${product.price.toFixed(2)}</span>
                  <span className="text-xs text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                </div>
              ) : (
                <span className="text-sm font-medium">${product.price.toFixed(2)}</span>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1 capitalize">{product.category}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
