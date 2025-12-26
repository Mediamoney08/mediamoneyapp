import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile } from '@/db/api';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthorization();
  }, [user, requireAdmin]);

  const checkAuthorization = async () => {
    // Not logged in
    if (!user) {
      setIsAuthorized(false);
      setIsLoading(false);
      return;
    }

    // If admin access is required, check role
    if (requireAdmin) {
      try {
        const profile = await getProfile(user.id);
        
        if (!profile || profile.role !== 'admin') {
          toast({
            title: 'Access Denied',
            description: 'You do not have permission to access this page',
            variant: 'destructive',
          });
          setIsAuthorized(false);
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error('Error checking authorization:', error);
        toast({
          title: 'Error',
          description: 'Failed to verify access permissions',
          variant: 'destructive',
        });
        setIsAuthorized(false);
      }
    } else {
      // Just need to be logged in
      setIsAuthorized(true);
    }
    
    setIsLoading(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not authorized - redirect
  if (!isAuthorized) {
    return <Navigate to={user ? '/' : '/login'} state={{ from: location }} replace />;
  }

  // Authorized - render children
  return <>{children}</>;
}
