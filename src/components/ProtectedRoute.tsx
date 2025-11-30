'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Scissors } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'branch_admin' | 'super_admin';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (!isLoading && user && requiredRole && user.role !== requiredRole) {
      // If user doesn't have required role, redirect to appropriate admin page
      if (user.role === 'branch_admin') {
        router.push('/admin');
      } else {
        router.push('/super-admin');
      }
    }
  }, [user, isLoading, router, requiredRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-secondary flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Scissors className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-serif text-primary mb-2">Loading...</h2>
            <p className="text-gray-600">Please wait while we verify your access.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (requiredRole && user.role !== requiredRole) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}