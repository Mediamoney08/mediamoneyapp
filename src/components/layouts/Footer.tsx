import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="gradient-bg rounded-lg p-2">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">Recharge Hub</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your trusted platform for digital recharge services, game top-ups, and streaming subscriptions.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/?category=game" className="hover:text-primary transition-colors">Game Recharge</Link></li>
              <li><Link to="/?category=streaming" className="hover:text-primary transition-colors">Streaming Subscriptions</Link></li>
              <li><Link to="/?category=gift_card" className="hover:text-primary transition-colors">Gift Cards</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/wallet" className="hover:text-primary transition-colors">Wallet</Link></li>
              <li><Link to="/orders" className="hover:text-primary transition-colors">My Orders</Link></li>
              <li><Link to="/security" className="hover:text-primary transition-colors">Security</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/support" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/api-docs" className="hover:text-primary transition-colors">API Documentation</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Recharge Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
