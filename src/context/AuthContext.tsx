import { User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect } from "react";
import supabase from "../supabase";

interface AuthContextType {
  user: User | null;
  signInWithGithub: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe(); // Unsubscribe on cleanup
  }, []);
  const signInWithGithub = () => {
    supabase.auth.signInWithOAuth({ provider: "github" });
  };
  const signOut = () => {
    supabase.auth.signOut();
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, signInWithGithub, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
