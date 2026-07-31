"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AuthState = {
  signedIn: boolean;
  ready: boolean;
};

const AuthStateContext = createContext<AuthState | null>(null);

export function AuthStateProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [state, setState] = useState<AuthState>({ signedIn: false, ready: false });

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    return createClient();
  }, []);

  useEffect(() => {
    if (!supabase) {
      setState({ signedIn: false, ready: true });
      return;
    }

    let mounted = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setState({ signedIn: !!data.user, ready: true });
    });

    return () => {
      mounted = false;
    };
  }, [pathname, supabase]);

  useEffect(() => {
    if (!supabase) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ signedIn: !!session?.user, ready: true });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <AuthStateContext.Provider value={state}>{children}</AuthStateContext.Provider>
  );
}

export function useAuthState(): AuthState {
  const ctx = useContext(AuthStateContext);
  if (!ctx) {
    throw new Error("useAuthState must be used within AuthStateProvider");
  }
  return ctx;
}
