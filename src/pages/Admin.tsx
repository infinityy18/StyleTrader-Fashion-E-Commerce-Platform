import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthContext } from '@/contexts/AuthContext';
import { Product, Category } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { products, categories } from '@/data/products';
import { ArrowRight, ChevronRight, Edit, Plus, Trash } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { toast } = useToast();
  
  // State for products and form
  const [productsList, setProductsList] = useState<Product[]>(products);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    inStock: true,
  });

  // Check if user is admin, if not redirect to home
  useEffect(() => {
    if (!user || !user.isAdmin) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access the admin dashboard.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [user, navigate, toast]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string | boolean) => {
    if (name === 'inStock') {
      // Handle the inStock field specially since it's a boolean
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      // For other fields like category, treat as string
      setFormData(prev => ({ ...prev, [name]: value as string }));
    }
  };

  // Handle numeric input changes (price)
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  // Edit product
  const editProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category,
      image: product.image,
      inStock: product.inStock,
    });
    setIsDialogOpen(true);
  };

  // Delete product
  const deleteProduct = (productId: string) => {
    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      setProductsList(products.filter(p => p.id !== productId));
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully.",
      });
      setIsLoading(false);
    }, 500);
  };

  // Save product (create or update)
  const saveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate form
    if (!formData.name || !formData.price || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // Simulate API request
    setTimeout(() => {
      if (editingProduct) {
        // Update existing product
        setProductsList(prevProducts => 
          prevProducts.map(p => 
            p.id === editingProduct.id ? { ...editingProduct, ...formData } : p
          )
        );
        toast({
          title: "Product updated",
          description: "The product has been updated successfully.",
        });
      } else {
        // Create new product
        const newProduct: Product = {
          id: `new-${Date.now()}`,
          name: formData.name!,
          price: formData.price!,
          description: formData.description || '',
          category: formData.category!,
          image: formData.image || '/images/product-placeholder.jpg',
          inStock: formData.inStock !== undefined ? formData.inStock : true,
          createdAt: new Date().toISOString(),
          ...(formData.originalPrice && { originalPrice: formData.originalPrice }),
        };
        
        setProductsList([newProduct, ...productsList]);
        toast({
          title: "Product created",
          description: "The new product has been created successfully.",
        });
      }
      
      // Reset form and close dialog
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: '',
        image: '',
        inStock: true,
      });
      setEditingProduct(null);
      setIsDialogOpen(false);
      setIsLoading(false);
    }, 800);
  };

  // Create product dialog open
  const openNewProductDialog = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      image: '',
      inStock: true,
    });
    setIsDialogOpen(true);
  };

  if (!user || !user.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={() => navigate('/')}>
          Back to Store
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Dashboard Overview</CardTitle>
          <CardDescription>Key metrics for your store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Total Products</p>
              <h3 className="text-2xl font-bold">{productsList.length}</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Categories</p>
              <h3 className="text-2xl font-bold">{categories.length}</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Out of Stock</p>
              <h3 className="text-2xl font-bold">
                {productsList.filter(p => !p.inStock).length}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="products">
        <TabsList className="mb-6">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Product Management</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openNewProductDialog}>
                  <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={saveProduct}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name*
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="price" className="text-right">
                        Price*
                      </Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={handleNumericChange}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="originalPrice" className="text-right">
                        Original Price
                      </Label>
                      <Input
                        id="originalPrice"
                        name="originalPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.originalPrice || ''}
                        onChange={handleNumericChange}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">
                        Category*
                      </Label>
                      <Select 
                        onValueChange={(value) => handleSelectChange('category', value)}
                        value={formData.category}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.slug}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="image" className="text-right">
                        Image URL
                      </Label>
                      <Input
                        id="image"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="http://example.com/image.jpg"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="col-span-3"
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="inStock" className="text-right">
                        Status
                      </Label>
                      <Select 
                        onValueChange={(value) => handleSelectChange('inStock', value === 'true')}
                        value={formData.inStock ? 'true' : 'false'}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select product status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">In Stock</SelectItem>
                          <SelectItem value="false">Out of Stock</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          {editingProduct ? 'Updating...' : 'Creating...'}
                        </span>
                      ) : (
                        editingProduct ? 'Update Product' : 'Create Product'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsList.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.id.slice(0, 4)}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell className="capitalize">{product.category}</TableCell>
                    <TableCell>
                      ${product.price.toFixed(2)}
                      {product.originalPrice && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        product.inStock 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => editProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deleteProduct(product.id)}
                          disabled={isLoading}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="orders">
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Order Management Coming Soon</h3>
            <p className="text-gray-500">
              This feature is currently under development.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="customers">
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Customer Management Coming Soon</h3>
            <p className="text-gray-500">
              This feature is currently under development.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default AdminDashboard;
