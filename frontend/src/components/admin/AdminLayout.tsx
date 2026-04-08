import { useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Shield,
  Key,
  MessageSquare,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Wheat,
  ExternalLink,
  Bell,
} from "lucide-react";
import { useAuth, type AdminPermission } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  requiredPermission?: AdminPermission;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard, requiredPermission: "view-dashboard" }],
  },
  {
    label: "Operations",
    items: [
      { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare, requiredPermission: "manage-inquiries" },
    ],
  },
  {
    label: "User Management",
    items: [
      { label: "Users", href: "/admin/users", icon: Users, requiredPermission: "manage-users" },
      { label: "Roles", href: "/admin/roles", icon: Shield, requiredPermission: "manage-roles" },
      { label: "Permissions", href: "/admin/permissions", icon: Key, requiredPermission: "manage-permissions" },
    ],
  },
];

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const AdminLayout = ({ children, title, description, actions }: AdminLayoutProps) => {
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const isActive = (href: string) =>
    href === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Branding */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
          <Wheat size={18} className="text-primary" />
        </div>
        <div>
          <p className="text-sm font-serif font-semibold text-sidebar-foreground leading-none">MILOHA Admin</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Control Panel
          </p>
        </div>
      </div>

      {/* Current user card */}
      <div className="px-3 py-3 border-b border-sidebar-border shrink-0">
        <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/60 px-3 py-2.5">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {user ? getInitials(user.name) : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-sidebar-foreground leading-tight">{user?.name}</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {user?.roles.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0 text-[9px] font-semibold text-primary"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {NAV_GROUPS.map((group) => {
          const visible = group.items.filter(
            (item) => !item.requiredPermission || hasPermission(item.requiredPermission),
          );
          if (!visible.length) return null;

          return (
            <div key={group.label}>
              <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {visible.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <item.icon size={16} className="shrink-0" />
                      <span className="flex-1">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Footer links */}
      <div className="shrink-0 border-t border-sidebar-border px-3 py-3 space-y-0.5">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          <ExternalLink size={16} className="shrink-0" />
          View Website
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut size={16} className="shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:shrink-0 flex-col border-r border-border bg-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-sidebar border-r border-border">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-sidebar-accent transition-colors"
              aria-label="Close sidebar"
            >
              <X size={16} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm px-4 lg:px-6 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors lg:hidden shrink-0"
              aria-label="Open sidebar"
            >
              <Menu size={18} />
            </button>
            {title && (
              <nav className="flex items-center gap-1.5 text-sm min-w-0">
                <span className="text-muted-foreground hidden sm:block">Admin</span>
                <ChevronRight size={13} className="text-muted-foreground/50 hidden sm:block shrink-0" />
                <span className="font-semibold text-foreground truncate">{title}</span>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle className="hidden md:inline-flex" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9">
                  <Bell size={16} />
                  <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Notifications</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                      {user ? getInitials(user.name) : "?"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>
                  <p className="font-semibold text-sm">{user?.name}</p>
                  <p className="text-xs font-normal text-muted-foreground mt-0.5">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={14} className="mr-2" />
                    View Website
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut size={14} className="mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page header */}
        {(title || description || actions) && (
          <div className="shrink-0 border-b border-border bg-card/40 px-4 py-4 lg:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5 min-w-0">
                {title && <h1 className="text-lg font-serif font-semibold text-foreground">{title}</h1>}
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
              </div>
              {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
