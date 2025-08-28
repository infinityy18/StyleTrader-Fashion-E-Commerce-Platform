
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetClose 
} from '@/components/ui/sheet';
import { useAuthContext } from '@/contexts/AuthContext';
import { useCartContext } from '@/contexts/CartContext';
import { categories } from '@/data/products';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthContext();
  const { cartItems } = useCartContext();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4 relative">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between py-2 border-b">
                  <Link to="/" className="font-bold text-xl">FASHION</Link>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </div>
                
                <nav className="flex flex-col gap-2 py-4">
                  {categories.map((category) => (
                    <SheetClose asChild key={category.id}>
                      <Link 
                        to={`/products?category=${category.slug}`}
                        className="px-4 py-2 hover:bg-gray-100 rounded-md text-sm font-medium capitalize"
                      >
                        {category.name}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                
                <div className="mt-auto border-t pt-4">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-sm font-medium">
                        Hello, {user.name}
                      </div>
                      {user.isAdmin && (
                        <SheetClose asChild>
                          <Link 
                            to="/admin" 
                            className="block px-4 py-2 hover:bg-gray-100 rounded-md text-sm font-medium"
                          >
                            Admin Dashboard
                          </Link>
                        </SheetClose>
                      )}
                      <button 
                        onClick={logout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md text-sm font-medium"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Link 
                          to="/login" 
                          className="block px-4 py-2 hover:bg-gray-100 rounded-md text-sm font-medium"
                        >
                          Sign In
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link 
                          to="/signup" 
                          className="block px-4 py-2 hover:bg-gray-100 rounded-md text-sm font-medium"
                        >
                          Create Account
                        </Link>
                      </SheetClose>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="font-bold text-xl ml-2 md:ml-0">FASHION</Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                to={`/products?category=${category.slug}`}
                className={cn(
                  "text-sm font-medium hover:text-black/70 capitalize",
                  location.pathname === `/products` && 
                  location.search.includes(`category=${category.slug}`) && 
                  "underline underline-offset-4"
                )}
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Search, Account, Cart */}
          <div className="flex items-center space-x-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Search className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[90%] sm:w-[450px]">
                <form onSubmit={handleSearch} className="space-y-4 py-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <SheetClose asChild>
                      <Button type="submit" disabled={!searchQuery.trim()}>
                        Search
                      </Button>
                    </SheetClose>
                  </div>
                </form>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[90%] sm:w-[350px]">
                <div className="py-4">
                  <h2 className="text-xl font-bold mb-4">My Account</h2>
                  {user ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p>Hello, {user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      {user.isAdmin && (
                        <SheetClose asChild>
                          <Button 
                            asChild 
                            variant="outline" 
                            className="w-full"
                          >
                            <Link to="/admin">Admin Dashboard</Link>
                          </Button>
                        </SheetClose>
                      )}
                      <Button 
                        onClick={logout}
                        variant="outline" 
                        className="w-full"
                      >
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <SheetClose asChild>
                        <Button asChild className="w-full">
                          <Link to="/login">Sign In</Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button asChild variant="outline" className="w-full">
                          <Link to="/signup">Create Account</Link>
                        </Button>
                      </SheetClose>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Button 
              variant="ghost" 
              size="icon"
              className="relative"
              asChild
            >
              <Link to="/cart">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
