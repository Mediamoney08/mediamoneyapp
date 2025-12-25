import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getProducts } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Product, ServiceCategory } from '@/types/types';
import { Gamepad2, Tv, Gift, Smartphone } from 'lucide-react';

const categoryIcons = {
  game: Gamepad2,
  streaming: Tv,
  gift_card: Gift,
  app: Smartphone,
};

const categoryLabels = {
  game: 'Games',
  streaming: 'Streaming',
  gift_card: 'Gift Cards',
  app: 'Apps',
};

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>(
    (searchParams.get('category') as ServiceCategory) || 'all'
  );

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts(selectedCategory === 'all' ? undefined : selectedCategory);
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category as ServiceCategory | 'all');
    if (category === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  const handleBuyNow = (product: Product) => {
    if (!user) {
      navigate('/login', { state: { from: '/' } });
      return;
    }
    navigate('/checkout', { state: { product } });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fadeInUp">
            <h1 className="text-4xl xl:text-6xl font-bold">
              Welcome to Recharge Hub
            </h1>
            <p className="text-lg xl:text-xl text-white/90">
              Your one-stop platform for game top-ups, streaming subscriptions, and digital gift cards
            </p>
            {!user && (
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/login')}
                className="mt-4"
              >
                Get Started
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container py-12">
        <Tabs value={selectedCategory} onValueChange={handleCategoryChange} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="game">
              <Gamepad2 className="h-4 w-4 mr-2" />
              Games
            </TabsTrigger>
            <TabsTrigger value="streaming">
              <Tv className="h-4 w-4 mr-2" />
              Streaming
            </TabsTrigger>
            <TabsTrigger value="gift_card">
              <Gift className="h-4 w-4 mr-2" />
              Gift Cards
            </TabsTrigger>
            <TabsTrigger value="app">
              <Smartphone className="h-4 w-4 mr-2" />
              Apps
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full bg-muted" />
                    <CardHeader>
                      <Skeleton className="h-4 w-3/4 bg-muted" />
                      <Skeleton className="h-3 w-1/2 bg-muted" />
                    </CardHeader>
                    <CardFooter>
                      <Skeleton className="h-10 w-full bg-muted" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products available in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => {
                  const Icon = categoryIcons[product.category];
                  return (
                    <Card
                      key={product.id}
                      className="overflow-hidden card-hover animate-fadeInUp"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="relative h-48 overflow-hidden bg-muted">
                        <img
                          src={product.image_url || 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=400'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <Badge className="absolute top-2 right-2">
                          <Icon className="h-3 w-3 mr-1" />
                          {categoryLabels[product.category]}
                        </Badge>
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {product.description || 'Digital product'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-2xl font-bold text-primary">
                            ${product.price.toFixed(2)}
                          </span>
                          <span className="text-sm text-muted-foreground">{product.currency}</span>
                        </div>
                        {product.stock_quantity > 0 && product.stock_quantity < 10 && (
                          <p className="text-xs text-warning mt-2">
                            Only {product.stock_quantity} left in stock
                          </p>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full gradient-bg"
                          onClick={() => handleBuyNow(product)}
                          disabled={product.stock_quantity === 0}
                        >
                          {product.stock_quantity === 0 ? 'Out of Stock' : 'Buy Now'}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>

      {/* Features Section */}
      <section className="bg-muted py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Recharge Hub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 animate-fadeInUp">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Instant Delivery</h3>
              <p className="text-muted-foreground">
                Get your digital products delivered instantly after payment confirmation
              </p>
            </div>
            <div className="text-center space-y-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Secure Payments</h3>
              <p className="text-muted-foreground">
                All transactions are secured with industry-standard encryption
              </p>
            </div>
            <div className="text-center space-y-4 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">24/7 Support</h3>
              <p className="text-muted-foreground">
                Our support team is always ready to help you with any questions
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
