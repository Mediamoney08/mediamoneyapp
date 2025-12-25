import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getCategories, getSubcategories, getProductsByCategory, getProductsBySubcategory } from '@/db/api';
import type { Category, Subcategory, Product, ServiceCategory } from '@/types/types';
import { Search, Gamepad2, Tv, Gift, Smartphone, ChevronRight, Package } from 'lucide-react';
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
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const service = searchParams.get('service') as ServiceCategory;
    if (service && ['game', 'streaming', 'gift_card', 'app'].includes(service)) {
      setSelectedService(service);
    }
    loadCategories(service || 'game');
  }, [searchParams]);

  useEffect(() => {
    if (selectedCategory) {
      loadSubcategories(selectedCategory.id);
      loadProducts(selectedCategory.id);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedSubcategory) {
      loadProductsBySubcategory(selectedSubcategory.id);
    }
  }, [selectedSubcategory]);

  const loadCategories = async (serviceType: ServiceCategory) => {
    setLoading(true);
    try {
      const cats = await getCategories(serviceType);
      setCategories(cats);
      if (cats.length > 0) {
        setSelectedCategory(cats[0]);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubcategories = async (categoryId: string) => {
    try {
      const subs = await getSubcategories(categoryId);
      setSubcategories(subs);
      setSelectedSubcategory(null);
    } catch (error) {
      console.error('Error loading subcategories:', error);
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

  const loadProductsBySubcategory = async (subcategoryId: string) => {
    try {
      const prods = await getProductsBySubcategory(subcategoryId);
      setProducts(prods);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleServiceChange = (service: ServiceCategory) => {
    setSelectedService(service);
    setSearchParams({ service });
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSubcategories([]);
    setProducts([]);
    loadCategories(service);
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
  };

  const handleSubcategorySelect = (subcategory: Subcategory | null) => {
    setSelectedSubcategory(subcategory);
    if (!subcategory && selectedCategory) {
      loadProducts(selectedCategory.id);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
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
                  <p className="mt-4 text-muted-foreground">Loading categories...</p>
                </div>
              ) : (
                <div className="grid gap-6 lg:grid-cols-4">
                  {/* Categories Sidebar */}
                  <Card className="lg:col-span-1">
                    <CardHeader>
                      <CardTitle className="text-lg">Categories</CardTitle>
                      <CardDescription>
                        {categories.length} categories available
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-1">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => handleCategorySelect(category)}
                            className={`w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center justify-between ${
                              selectedCategory?.id === category.id ? 'bg-muted border-l-4 border-primary' : ''
                            }`}
                          >
                            <span className="font-medium">{category.name}</span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Products Area */}
                  <div className="lg:col-span-3 space-y-6">
                    {/* Subcategories */}
                    {subcategories.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {selectedCategory?.name} - Subcategories
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant={!selectedSubcategory ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleSubcategorySelect(null)}
                            >
                              All
                            </Button>
                            {subcategories.map((sub) => (
                              <Button
                                key={sub.id}
                                variant={selectedSubcategory?.id === sub.id ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleSubcategorySelect(sub)}
                              >
                                {sub.name}
                              </Button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Products Grid */}
                    {selectedCategory && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-2xl font-bold">
                            {selectedSubcategory ? selectedSubcategory.name : selectedCategory.name}
                          </h2>
                          <Badge variant="secondary">
                            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                          </Badge>
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
                          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredProducts.map((product) => (
                              <Card
                                key={product.id}
                                className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                                onClick={() => navigate(`/checkout?product=${product.id}`)}
                              >
                                {product.image_url && (
                                  <div className="aspect-video overflow-hidden bg-muted">
                                    <img
                                      src={product.image_url}
                                      alt={product.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
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
                    )}
                  </div>
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
