import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { adminLogin as apiLogin, adminLogout as apiLogout, adminMe, adminRegister as apiRegister } from "@/lib/adminApi";

export type AdminRole = "super-admin" | "content-manager" | "sales-manager" | "viewer";

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  roles: AdminRole[];
  permissions: string[];
};

type AuthContextType = {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: AdminRole | AdminRole[]) => boolean;
  hasPermission: (permission: string | string[]) => boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const USER_KEY = "admin_user";
const TOKEN_KEY = "admin_token";

// Demo accounts used when the backend is unreachable (local dev / demo mode)
const DEMO_ACCOUNTS: Record<string, AdminUser & { password: string }> = {
  "admin@miloha.co.tz": {
    id: 1,
    name: "Super Admin",
    email: "admin@miloha.co.tz",
    password: "demo1234",
    roles: ["super-admin"],
    permissions: [
      "manage-users",
      "manage-roles",
      "manage-permissions",
      "manage-inquiries",
      "manage-content",
      "manage-products",
      "manage-testimonials",
      "manage-faqs",
      "manage-slider",
      "manage-site-content",
    ],
  },
  "content@miloha.co.tz": {
    id: 2,
    name: "Content Manager",
    email: "content@miloha.co.tz",
    password: "demo1234",
    roles: ["content-manager"],
    permissions: [
      "manage-content",
      "manage-products",
      "manage-testimonials",
      "manage-faqs",
      "manage-slider",
      "manage-site-content",
    ],
  },
  "sales@miloha.co.tz": {
    id: 3,
    name: "Sales Manager",
    email: "sales@miloha.co.tz",
    password: "demo1234",
    roles: ["sales-manager"],
    permissions: ["manage-inquiries"],
  },
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount: try /api/admin/me, fall back to cached user
  useEffect(() => {
    const restore = async () => {
      const token = sessionStorage.getItem(TOKEN_KEY);
      const cached = sessionStorage.getItem(USER_KEY);

      if (token) {
        try {
          const me = await adminMe();
          const restored: AdminUser = {
            id: me.id,
            name: me.name,
            email: me.email,
            roles: me.roles as AdminRole[],
            permissions: me.permissions,
          };
          setUser(restored);
          sessionStorage.setItem(USER_KEY, JSON.stringify(restored));
        } catch {
          // Token invalid / backend down — try cached user
          if (cached) {
            try {
              setUser(JSON.parse(cached) as AdminUser);
            } catch {
              sessionStorage.removeItem(USER_KEY);
              sessionStorage.removeItem(TOKEN_KEY);
            }
          } else {
            sessionStorage.removeItem(TOKEN_KEY);
          }
        }
      } else if (cached) {
        try {
          setUser(JSON.parse(cached) as AdminUser);
        } catch {
          sessionStorage.removeItem(USER_KEY);
        }
      }

      setIsLoading(false);
    };

    restore();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // 1. Try real backend first
    try {
      const res = await apiLogin(email, password);
      const u: AdminUser = {
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        roles: res.user.roles as AdminRole[],
        permissions: res.user.permissions,
      };
      sessionStorage.setItem(TOKEN_KEY, res.token);
      sessionStorage.setItem(USER_KEY, JSON.stringify(u));
      setUser(u);
      return;
    } catch (err) {
      // HTTP 401/422 = explicit credential rejection from backend → re-throw
      const status = (err as Error & { status?: number }).status;
      if (status === 401 || status === 422) {
        throw new Error("Invalid email or password.");
      }
      // Any other error (network down, 5xx, etc.) → fall through to demo mode
    }

    // 2. Demo mode fallback (backend unreachable)
    const demo = DEMO_ACCOUNTS[email.toLowerCase()];
    if (!demo || password !== demo.password) {
      throw new Error("Invalid email or password.");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...u } = demo;
    sessionStorage.setItem(USER_KEY, JSON.stringify(u));
    sessionStorage.removeItem(TOKEN_KEY); // no real token in demo mode
    setUser(u);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, passwordConfirmation: string) => {
    const res = await apiRegister(name, email, password, passwordConfirmation);
    const u: AdminUser = {
      id: res.user.id,
      name: res.user.name,
      email: res.user.email,
      roles: res.user.roles as AdminRole[],
      permissions: res.user.permissions,
    };
    sessionStorage.setItem(TOKEN_KEY, res.token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(u));
    setUser(u);
  }, []);

  const logout = useCallback(async () => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        await apiLogout();
      } catch {
        // best-effort
      }
    }
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (role: AdminRole | AdminRole[]) => {
      if (!user) return false;
      const roles = Array.isArray(role) ? role : [role];
      return roles.some((r) => user.roles.includes(r));
    },
    [user],
  );

  const hasPermission = useCallback(
    (permission: string | string[]) => {
      if (!user) return false;
      if (user.roles.includes("super-admin")) return true;
      const perms = Array.isArray(permission) ? permission : [permission];
      return perms.some((p) => user.permissions.includes(p));
    },
    [user],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        hasRole,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
