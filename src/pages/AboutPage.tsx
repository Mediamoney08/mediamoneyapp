import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MapPin, Phone, Wallet } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="container text-center space-y-6">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <Wallet className="h-16 w-16" />
            </div>
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold">About Recharge Hub</h1>
          <p className="text-lg xl:text-xl text-white/90 max-w-2xl mx-auto">
            Your trusted partner for digital recharge services worldwide
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                At Recharge Hub, we're dedicated to providing seamless digital recharge services for gamers, 
                streamers, and digital content enthusiasts worldwide. Our platform offers instant delivery, 
                secure payments, and competitive pricing for all your digital needs.
              </p>
              <p>
                We believe in making digital purchases simple, secure, and accessible to everyone. Whether 
                you're topping up your favorite game, subscribing to streaming services, or purchasing gift 
                cards, we've got you covered.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Why Choose Us?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">⚡ Instant Delivery</h3>
                  <p className="text-sm text-muted-foreground">
                    Get your digital products delivered instantly after payment confirmation
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">🔒 Secure Payments</h3>
                  <p className="text-sm text-muted-foreground">
                    All transactions are protected with industry-standard encryption
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">💰 Competitive Pricing</h3>
                  <p className="text-sm text-muted-foreground">
                    Best prices in the market with regular discounts and offers
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">🎯 24/7 Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Our support team is always ready to help you
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Contact Us</CardTitle>
              <CardDescription>Get in touch with our team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>support@rechargehub.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span>123 Digital Street, Tech City, TC 12345</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
