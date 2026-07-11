import { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuth(!!data.session);
      setIsChecking(false);
    };
    checkSession();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}