import { supabase } from './supabase';

export interface AdminUser {
  username: string;
  name: string;
  isLoggedIn: boolean;
}

export const login = async (email: string, password: string): Promise<boolean> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    console.error('Login error:', error?.message);
    return false;
  }
  return true;
};

export const logout = async () => {
  await supabase.auth.signOut();
};

export const getCurrentUser = async (): Promise<AdminUser | null> => {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;

  return {
    username: data.user.email ?? 'admin',
    name: 'Administrator Dusun',
    isLoggedIn: true,
  };
};

export const isAuthenticated = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};