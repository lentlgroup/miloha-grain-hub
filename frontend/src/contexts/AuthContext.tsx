import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react";

export type AdminRole = "super-admin" | "sales-manager" | "content-manager" | "viewer";

export type AdminPermission =
  | "view-dashboard"
  | "manage-inquiries"
  | "manage-users"
  | "manage-roles"
  | "manage-permissions"
  | "manage-content";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  roles: AdminRole[];
  permissions: AdminPermission[];
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (...roles: AdminRole[]) => boolean;
  hasPermission: (...permissions: AdminPermission[]) => boolean;
}

// Demo accounts – replace with real API calls when backend auth is ready
const DEMO_USERS: Array<AuthUser & { password: string }> = [
  {
    id: 1,
    name: "James Limbu",
    email: "admin@miloha.co.tz",
    roles: ["super-admin"],
    permissions: [
      "view-dashboard",
      "manage-inquiries",
      "manage-users",
      "manage-roles",
      "manage-permissions",
      "manage-content",
    ],
    password: "password",
  },
  {
    id: 2,
    name: "Sarah Mwangi",
    email: "sales@miloha.co.tz",
    roles: ["sales-manager"],
    permissions: ["view-dashboard", "manage-inquiries"],
    password: "password",
  },
];

const AUTH_STORAGE_KEY = "miloha_admin_session";

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored) as AuthUser);
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // Simulates network latency; swap with real API call when backend is ready
    await new Promise<void>((resolve) => setTimeout(resolve, 700));
    const match = DEMO_USERS.find((u) => u.email === email && u.password === password);
    if (!match) throw new Error("Invalid email or password.");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pwd, ...authUser } = match;
    setUser(authUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const hasRole = (...roles: AdminRole[]) => {
    if (!user) return false;
    return roles.some((r) => user.roles.includes(r));
  };

  const hasPermission = (...perms: AdminPermission[]) => {
    if (!user) return false;
    return perms.some((p) => user.permissions.includes(p));
  };

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, isLoading, login, logout, hasRole, hasPermission }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
