import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

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
  logout: () => void;
  hasRole: (role: AdminRole | AdminRole[]) => boolean;
  hasPermission: (permission: string | string[]) => boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "admin_user";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored) as AdminUser);
      } catch {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // In production this calls /api/admin/login; for now we use demo credentials
    const demoAccounts: Record<string, AdminUser> = {
      "admin@miloha.co.tz": {
        id: 1,
        name: "Super Admin",
        email: "admin@miloha.co.tz",
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
        ],
      },
      "content@miloha.co.tz": {
        id: 2,
        name: "Content Manager",
        email: "content@miloha.co.tz",
        roles: ["content-manager"],
        permissions: [
          "manage-content",
          "manage-products",
          "manage-testimonials",
          "manage-faqs",
          "manage-slider",
        ],
      },
      "sales@miloha.co.tz": {
        id: 3,
        name: "Sales Manager",
        email: "sales@miloha.co.tz",
        roles: ["sales-manager"],
        permissions: ["manage-inquiries"],
      },
    };

    const found = demoAccounts[email.toLowerCase()];
    if (!found || password !== "demo1234") {
      throw new Error("Invalid email or password.");
    }

    setUser(found);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem(STORAGE_KEY);
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
