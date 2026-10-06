import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const DEMO_USER_STORAGE_KEY = "terra_local_demo_user";

interface DemoUser {
  id: string;
  email: string;
  user_metadata: {
    username: string;
  };
}

interface Profile {
  id: string;
  email: string;
}

interface AuthContextType {
  user: DemoUser | null;
  profile: Profile | null;
  loading: boolean;
  signInWithUsername: (username: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithUsername: (username: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function createDemoUser(username: string): DemoUser {
  const normalizedUsername = username.trim();
  return {
    id: `demo-${encodeURIComponent(normalizedUsername.toLowerCase())}`,
    email: `${normalizedUsername}@demo.local`,
    user_metadata: { username: normalizedUsername },
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);
  const profile = user ? { id: user.id, email: user.email } : null;

  useEffect(() => {
    try {
      const storedUser = window.localStorage.getItem(DEMO_USER_STORAGE_KEY);
      setUser(storedUser ? (JSON.parse(storedUser) as DemoUser) : null);
    } catch (error) {
      console.warn("Unable to restore the local demo user.", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithUsername = async (username: string, password: string) => {
    // Demo-only identity: credentials are ignored and no password is stored.
    void password;
    if (!username.trim()) {
      return { error: new Error("Enter a username for the local demo profile.") };
    }

    try {
      const demoUser = createDemoUser(username);
      window.localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
      setUser(demoUser);
      return { error: null };
    } catch (error) {
      return {
        error: error instanceof Error ? error : new Error("Unable to save the demo user."),
      };
    }
  };

  const signUpWithUsername = signInWithUsername;

  const signOut = async () => {
    window.localStorage.removeItem(DEMO_USER_STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signInWithUsername, signUpWithUsername, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
