import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        const role = session?.user?.user_metadata?.role as 'admin' | 'user' | undefined;
        setIsAdmin(role === 'admin');
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      const role = session?.user?.user_metadata?.role as 'admin' | 'user' | undefined;
      setIsAdmin(role === 'admin');
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Deprecated: role is now sourced from user_metadata.role

  const signUp = async (email: string, password: string, fullName: string) => {
    // Note: Email confirmation behavior is controlled in Supabase Auth settings.
    // This client sets default role metadata and lets project settings decide confirmation.
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'user', // default role
        },
      },
    });
    // If signup returns an authenticated session (auto-confirm enabled), immediately sign out
    // so the user must explicitly sign in next. This matches your desired UX.
    if (!error) {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        await supabase.auth.signOut();
      }
    }
    // Profile row is typically inserted on first sign-in; see ensureProfile below.
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error) {
      // After successful sign-in, ensure a profile row exists for this user
      await ensureProfile();
      // Enforce role: make a specific UUID the only admin; others become user
      await enforceRole();
    }
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const ensureProfile = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    const fullName = (userData.user?.user_metadata?.full_name as string) || "";
    if (!userId) return;

    // Check if profile exists
    const { data: existing, error: selectError } = await supabase
      .from('profiles')
      .select('uuid')
      .eq('uuid', userId)
      .maybeSingle();

    if (selectError) return;
    if (existing) return;

    // Insert minimal profile row
    await supabase
      .from('profiles')
      .insert({ uuid: userId, full_name: fullName });
  };

  const enforceRole = async () => {
    const ADMIN_UUID = "81f62178-4163-4dd9-9c62-c5f9a6ca3221";
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return;

    const isAdmin = user.id === ADMIN_UUID || (user.user_metadata?.full_name === "Nivethitha");
    const desiredRole = isAdmin ? "admin" : "user";

    // Only update if different to avoid extra network calls
    if (user.user_metadata?.role !== desiredRole) {
      await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          role: desiredRole,
        },
      });
    }
  };

  return {
    user,
    session,
    loading,
    isAdmin,
    signUp,
    signIn,
    signOut,
  };
}