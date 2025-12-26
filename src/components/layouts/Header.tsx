import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Moon, Sun, Menu, Wallet, User, LogOut, Shield, Settings } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import NotificationBell from '@/components/notifications/NotificationBell';
import { useCurrency } from '@/components/LanguageCurrencySwitcher';

export default function Header() {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'API', path: '/api-docs' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="gradient-bg rounded-lg p-2">
            <Wallet className="h-6 w-6 text-white" data-href="/" />
          </div>

        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Balance Display - Animated */}
        {user && profile && (
          <Link 
            to="/wallet" 
            className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 group"
          >
            <div className="relative">
              <Wallet className="h-5 w-5 text-primary group-hover:animate-bounce" />
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">Balance</span>
              <span className="text-sm font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {formatPrice(profile.wallet_balance || 0)}
              </span>
            </div>
          </Link>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {user ? (
            <>
              {/* Notifications */}
              <NotificationBell />

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{profile?.username || 'User'}</p>
                      <p className="text-xs text-muted-foreground">
                        Balance: ${profile?.wallet_balance?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/wallet')}>
                    <Wallet className="mr-2 h-4 w-4" />
                    Wallet
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/orders')}>
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/security')}>
                    <Shield className="mr-2 h-4 w-4" />
                    Security
                  </DropdownMenuItem>
                  {profile?.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Shield className="mr-2 h-4 w-4" />
                        Payment Approvals
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/manage')}>
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Management
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={() => navigate('/login')} className="gradient-bg">
              Sign In
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-8">
                {/* Mobile Balance Display */}
                {user && profile && (
                  <Link 
                    to="/wallet" 
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 hover:border-primary/40 transition-all duration-300"
                  >
                    <div className="relative">
                      <Wallet className="h-4 w-4 text-primary" />
                      <div className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-muted-foreground font-medium">Wallet Balance</span>
                      <span className="text-sm font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        ${profile.wallet_balance?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  </Link>
                )}
                
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                {user && (
                  <>
                    <Link to="/wallet" className="text-sm font-medium hover:text-primary transition-colors">
                      Wallet
                    </Link>
                    <Link to="/orders" className="text-sm font-medium hover:text-primary transition-colors">
                      My Orders
                    </Link>
                    <Link to="/security" className="text-sm font-medium hover:text-primary transition-colors">
                      Security
                    </Link>
                    {profile?.role === 'admin' && (
                      <Link to="/admin" className="text-sm font-medium hover:text-primary transition-colors">
                        Admin Panel
                      </Link>
                    )}
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
