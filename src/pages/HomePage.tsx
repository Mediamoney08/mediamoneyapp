import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getCategories, getProductsByCategory } from '@/db/api';
import type { Category, Product, ServiceCategory } from '@/types/types';
import { Search, Gamepad2, Tv, Gift, Smartphone, ArrowLeft, Package } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SERVICE_ICONS = {
  game: Gamepad2,
  streaming: Tv,
  gift_card: Gift,
  app: Smartphone,
};

const SERVICE_LABELS = {
  game: 'Games',
  streaming: 'Streaming',
  gift_card: 'Gift Cards',
  app: 'Apps',
};

export default function HomePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceCategory>('game');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const service = searchParams.get('service') as ServiceCategory;
    const categoryId = searchParams.get('category');
    
    if (service && ['game', 'streaming', 'gift_card', 'app'].includes(service)) {
      setSelectedService(service);
    }
    
    loadCategories(service || 'game', categoryId);
  }, [searchParams]);

  const loadCategories = async (serviceType: ServiceCategory, categoryId?: string | null) => {
    setLoading(true);
    try {
      const cats = await getCategories(serviceType);
      setCategories(cats);
      
      if (categoryId) {
        const category = cats.find(c => c.id === categoryId);
        if (category) {
          setSelectedCategory(category);
          await loadProducts(categoryId);
        }
      } else {
        setSelectedCategory(null);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async (categoryId: string) => {
    try {
      const prods = await getProductsByCategory(categoryId);
      setProducts(prods);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleServiceChange = (service: ServiceCategory) => {
    setSelectedService(service);
    setSearchParams({ service });
    setSelectedCategory(null);
    setProducts([]);
    loadCategories(service);
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setSearchParams({ service: selectedService, category: category.id });
    loadProducts(category.id);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSearchParams({ service: selectedService });
    setProducts([]);
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.service_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 animate-gradient"></div>
        <div className="container relative mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeInUp">
            <span className="gradient-text">Recharge Hub</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            Your one-stop destination for game top-ups, streaming subscriptions, and digital gift cards
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for games, services, or gift cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Service Type Tabs */}
      <section className="container mx-auto px-4 py-8">
        <Tabs value={selectedService} onValueChange={(value) => handleServiceChange(value as ServiceCategory)}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            {(Object.keys(SERVICE_LABELS) as ServiceCategory[]).map((service) => {
              const Icon = SERVICE_ICONS[service];
              return (
                <TabsTrigger key={service} value={service} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{SERVICE_LABELS[service]}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {(Object.keys(SERVICE_LABELS) as ServiceCategory[]).map((service) => (
            <TabsContent key={service} value={service}>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading...</p>
                </div>
              ) : selectedCategory ? (
                // Show products for selected category
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <Button variant="outline" onClick={handleBackToCategories}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Categories
                    </Button>
                    <div>
                      <h2 className="text-3xl font-bold">{selectedCategory.name}</h2>
                      {selectedCategory.description && (
                        <p className="text-muted-foreground mt-1">{selectedCategory.description}</p>
                      )}
                    </div>
                  </div>

                  {filteredProducts.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                          {searchQuery ? 'No products match your search' : 'No products available in this category'}
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {filteredProducts.map((product) => (
                        <Card
                          key={product.id}
                          className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                          onClick={() => navigate(`/checkout?product=${product.id}`)}
                        >
                          {/* Use category image if product doesn't have one */}
                          {(product.image_url || selectedCategory.image_url) && (
                            <div className="aspect-video overflow-hidden bg-muted relative">
                              <img
                                src={product.image_url || selectedCategory.image_url || ''}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              {product.service_name && (
                                <Badge className="absolute top-2 right-2 bg-primary">
                                  {product.service_name}
                                </Badge>
                              )}
                            </div>
                          )}
                          <CardHeader>
                            <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                            {product.description && (
                              <CardDescription className="line-clamp-2">
                                {product.description}
                              </CardDescription>
                            )}
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-2xl font-bold text-primary">
                                  ${product.price.toFixed(2)}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Stock: {product.stock_quantity}
                                </div>
                              </div>
                              <Button size="sm">
                                Buy Now
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Show categories grid
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">
                      {SERVICE_LABELS[service]}
                    </h2>
                    <Badge variant="secondary">
                      {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'}
                    </Badge>
                  </div>

                  {filteredCategories.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                          {searchQuery ? 'No categories match your search' : 'No categories available'}
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {filteredCategories.map((category) => (
                        <Card
                          key={category.id}
                          className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-2 hover:border-primary"
                          onClick={() => handleCategoryClick(category)}
                        >
                          {category.image_url ? (
                            <div className="relative aspect-video overflow-hidden bg-muted">
                              <img
                                src={category.image_url}
                                alt={category.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h3 className="text-white font-bold text-lg drop-shadow-lg">{category.name}</h3>
                                {category.description && (
                                  <p className="text-white/90 text-sm line-clamp-1 drop-shadow-md">
                                    {category.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="aspect-video bg-muted flex items-center justify-center">
                              <div className="text-center p-4">
                                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                                <h3 className="font-bold text-lg">{category.name}</h3>
                                {category.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {category.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Instant Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get your digital products delivered instantly to your account
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Gift className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Wide Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Choose from hundreds of games, services, and gift cards
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Tv className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Secure Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your transactions are protected with industry-standard security
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
