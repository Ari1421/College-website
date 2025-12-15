import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

type Role = "admin" | "user" | undefined;

export function useSession() {
  const [session, setSession] = useState<null | Awaited<ReturnType<typeof supabase.auth.getSession>> extends { data: { session: infer S } } ? S : null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session ?? null);
        setLoading(false);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const role: Role = (session?.user?.user_metadata?.role as Role) ?? undefined;

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  return {
    session,
    user: session?.user ?? null,
    role,
    loading,
    signIn,
    signOut,
    isAdmin: role === "admin",
    isUser: role === "user",
    isAuthenticated: !!session?.user,
  };
}
