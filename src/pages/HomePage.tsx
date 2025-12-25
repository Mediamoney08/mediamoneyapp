import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getCategories, getProductsByCategory, getPriceBreakdown, getProfile } from '@/db/api';
import type { Category, Product, ServiceCategory, PriceCalculation } from '@/types/types';
import { Search, Gamepad2, Tv, Gift, Smartphone, ArrowLeft, Package, TrendingDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceCategory>('game');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPrices, setUserPrices] = useState<Record<string, PriceCalculation>>({});
  const [userLevelName, setUserLevelName] = useState<string | null>(null);

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
      
      // Load user-specific prices if user is logged in
      if (user) {
        await loadUserPrices(prods);
        await loadUserLevel();
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadUserPrices = async (prods: Product[]) => {
    if (!user) return;
    
    try {
      const prices: Record<string, PriceCalculation> = {};
      for (const product of prods) {
        const priceCalc = await getPriceBreakdown(user.id, product.id);
        prices[product.id] = priceCalc;
      }
      setUserPrices(prices);
    } catch (error) {
      console.error('Error loading user prices:', error);
    }
  };

  const loadUserLevel = async () => {
    if (!user) return;
    
    try {
      const profile = await getProfile(user.id);
      if (profile && (profile as any).user_level_name) {
        setUserLevelName((profile as any).user_level_name);
      }
    } catch (error) {
      console.error('Error loading user level:', error);
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
      <section className="relative overflow-hidden py-8 px-4">
        <div className="absolute inset-0 from-primary/10 via-secondary/10 to-accent/10 animate-gradient border-solid border-[rgb(229,231,235)] bg-[#f9f9f9ff] bg-none border-[0px] border-[#f1f1f1ff]"></div>
        <div className="container relative mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 animate-fadeInUp">
            <span className="gradient-text">MediaMoney</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-4 max-w-2xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            Your one-stop destination for game top-ups, streaming subscriptions, and digital gift cards
          </p>
        </div>
      </section>
      
      {/* Search Bar Section */}
      <section className="container mx-auto px-4 pb-6">
        <div className="max-w-2xl mx-auto">
          {user && userLevelName && (
            <div className="flex justify-center mb-4">
              <Badge variant="secondary" className="text-sm py-1 px-3">
                <span className="mr-2">🏆</span>
                {userLevelName} Member
              </Badge>
            </div>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for games, services, or gift cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg rounded-[4px]"
            />
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
                (<div>
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
                              <div className="flex-1">
                                {user && userPrices[product.id] ? (
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <div className="text-2xl font-bold text-primary">
                                        ${userPrices[product.id].final_price.toFixed(2)}
                                      </div>
                                      {userPrices[product.id].discount_percentage > 0 && (
                                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                                          <TrendingDown className="w-3 h-3 mr-1" />
                                          {userPrices[product.id].discount_percentage.toFixed(0)}% OFF
                                        </Badge>
                                      )}
                                    </div>
                                    {userPrices[product.id].discount_percentage > 0 && (
                                      <div className="text-sm text-muted-foreground line-through">
                                        ${userPrices[product.id].base_price.toFixed(2)}
                                      </div>
                                    )}
                                    {userPrices[product.id].discount_reason && (
                                      <div className="text-xs text-muted-foreground mt-1">
                                        {userPrices[product.id].discount_reason}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-2xl font-bold text-primary">
                                    ${product.price.toFixed(2)}
                                  </div>
                                )}
                                <div className="text-sm text-muted-foreground mt-1">
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
                </div>)
              ) : (
                // Show categories grid
                (<div>
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
                    <div className="grid gap-3 grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                      {filteredCategories.map((category) => (
                        <Card
                          key={category.id}
                          className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border hover:border-primary"
                          onClick={() => handleCategoryClick(category)}
                        >
                          {category.image_url ? (
                            <div className="relative aspect-square overflow-hidden bg-muted">
                              <img
                                src={category.image_url}
                                alt={category.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                              <div className="absolute bottom-0 left-0 right-0 p-2">
                                <h3 className="text-white font-semibold text-xs xl:text-sm drop-shadow-lg line-clamp-2">{category.name}</h3>
                              </div>
                            </div>
                          ) : (
                            <div className="aspect-square bg-muted flex items-center justify-center">
                              <div className="text-center p-2">
                                <Package className="w-6 h-6 xl:w-8 xl:h-8 mx-auto text-muted-foreground mb-1" />
                                <h3 className="font-semibold text-xs xl:text-sm line-clamp-2">{category.name}</h3>
                              </div>
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}
                </div>)
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
