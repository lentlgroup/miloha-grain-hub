import { Navigate, Outlet, useLocation, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  MessageSquare,
  Star,
  HelpCircle,
  Package,
  Image,
  FileText,
  Users,
  Shield,
  Key,
  LogOut,
  Wheat,
  ChevronRight,
  Bell,
  BarChart3,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { fetchInquiryStats } from "@/lib/adminApi";
import { cn } from "@/lib/utils";

const navMain = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    permission: null,
  },
];

const navContent = [
  {
    title: "Inquiries",
    url: "/admin/inquiries",
    icon: MessageSquare,
    permission: "manage-inquiries",
    badge: "new",
  },
  {
    title: "Hero Slider",
    url: "/admin/slider",
    icon: Image,
    permission: "manage-slider",
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: Package,
    permission: "manage-products",
  },
  {
    title: "Testimonials",
    url: "/admin/testimonials",
    icon: Star,
    permission: "manage-testimonials",
  },
  {
    title: "FAQs",
    url: "/admin/faqs",
    icon: HelpCircle,
    permission: "manage-faqs",
  },
  {
    title: "Site Content",
    url: "/admin/content",
    icon: FileText,
    permission: "manage-content",
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: BarChart3,
    permission: "manage-inquiries",
  },
];

const navUsers = [
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
    permission: "manage-users",
  },
  {
    title: "Roles",
    url: "/admin/roles",
    icon: Shield,
    permission: "manage-roles",
  },
  {
    title: "Permissions",
    url: "/admin/permissions",
    icon: Key,
    permission: "manage-permissions",
  },
];

const roleBadgeColor: Record<string, string> = {
  "super-admin": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  "content-manager": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  "sales-manager": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  viewer: "bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-400",
};

const AdminSidebar = () => {
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();

  const { data: inquiryStats } = useQuery({
    queryKey: ["admin", "inquiry-stats"],
    queryFn: fetchInquiryStats,
    refetchInterval: 60_000,
    enabled: hasPermission("manage-inquiries"),
  });

  const newCount = inquiryStats?.new ?? 0;

  const isActive = (url: string) =>
    url === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(url);

  const initials = user?.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? "AU";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link to="/admin" className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 border border-primary/20">
            <Wheat size={20} className="text-primary" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-bold text-sidebar-foreground leading-none">MILOHA</p>
            <p className="text-[11px] text-sidebar-foreground/55 mt-0.5">Admin Portal</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarMenu>
            {navMain.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.url)}
                  tooltip={item.title}
                >
                  <Link to={item.url} className="gap-3">
                    <item.icon size={18} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <Separator className="my-2 bg-sidebar-border" />

        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/45">
            Content
          </SidebarGroupLabel>
          <SidebarMenu>
            {navContent
              .filter((item) => !item.permission || hasPermission(item.permission))
              .map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link to={item.url} className="gap-3">
                      <item.icon size={18} />
                      <span className="flex-1">{item.title}</span>
                      {item.url === "/admin/inquiries" && newCount > 0 && (
                        <span className="group-data-[collapsible=icon]:hidden inline-flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground px-1">
                          {newCount > 99 ? "99+" : newCount}
                        </span>
                      )}
                      {item.url !== "/admin/inquiries" && item.badge && (
                        <span className="group-data-[collapsible=icon]:hidden inline-flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
                          ●
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarGroup>

        {hasPermission(["manage-users", "manage-roles", "manage-permissions"]) && (
          <>
            <Separator className="my-2 bg-sidebar-border" />
            <SidebarGroup>
              <SidebarGroupLabel className="px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/45">
                Access Control
              </SidebarGroupLabel>
              <SidebarMenu>
                {navUsers
                  .filter((item) => hasPermission(item.permission))
                  .map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.url)}
                        tooltip={item.title}
                      >
                        <Link to={item.url} className="gap-3">
                          <item.icon size={18} />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg shrink-0">
                    <AvatarFallback className="rounded-lg bg-primary/15 text-primary text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold text-sidebar-foreground">{user?.name}</span>
                    <span className="truncate text-[11px] text-sidebar-foreground/55">{user?.email}</span>
                  </div>
                  <ChevronRight size={14} className="ml-auto text-sidebar-foreground/40 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-primary/15 text-primary text-xs font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.name}</span>
                      <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5">
                  {user?.roles.map((role) => (
                    <span
                      key={role}
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
                        roleBadgeColor[role] ?? roleBadgeColor.viewer,
                      )}
                    >
                      {role.replace("-", " ")}
                    </span>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/" target="_blank" rel="noopener noreferrer">
                    <Wheat size={14} className="mr-2" />
                    View Website
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={logout}
                >
                  <LogOut size={14} className="mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

type BreadcrumbItem = { label: string; href?: string };

const useBreadcrumbs = (): BreadcrumbItem[] => {
  const location = useLocation();
  const segments = location.pathname.replace(/^\/admin\/?/, "").split("/").filter(Boolean);

  const labelMap: Record<string, string> = {
    inquiries: "Inquiries",
    slider: "Hero Slider",
    products: "Products",
    testimonials: "Testimonials",
    faqs: "FAQs",
    content: "Site Content",
    users: "Users",
    roles: "Roles",
    permissions: "Permissions",
  };

  const crumbs: BreadcrumbItem[] = [{ label: "Dashboard", href: "/admin" }];
  if (segments[0] && labelMap[segments[0]]) {
    crumbs.push({ label: labelMap[segments[0]] });
  }
  return crumbs;
};

const AdminLayout = () => {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();
  const location = useLocation();
  const breadcrumbs = useBreadcrumbs();

  const { data: inquiryStats } = useQuery({
    queryKey: ["admin", "inquiry-stats"],
    queryFn: fetchInquiryStats,
    refetchInterval: 60_000,
    enabled: isAuthenticated && hasPermission("manage-inquiries"),
  });

  const newCount = inquiryStats?.new ?? 0;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Wheat size={20} className="animate-pulse text-primary" />
          <span className="text-sm">Loading…</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AdminSidebar />

        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top bar */}
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border/60 bg-background/95 px-4 backdrop-blur">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4" />

            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb.label} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight size={14} className="text-muted-foreground/50" />}
                  {crumb.href && i < breadcrumbs.length - 1 ? (
                    <Link to={crumb.href} className="text-muted-foreground hover:text-foreground transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={i === breadcrumbs.length - 1 ? "font-medium text-foreground" : "text-muted-foreground"}>
                      {crumb.label}
                    </span>
                  )}
                </span>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <Link to="/admin/inquiries" className="relative flex h-8 w-8 items-center justify-center rounded-lg hover:bg-accent/50 transition-colors text-muted-foreground hover:text-foreground" title="New inquiries">
                <Bell size={16} />
                {newCount > 0 && (
                  <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
                    {newCount > 9 ? "9+" : newCount}
                  </span>
                )}
              </Link>
              <ThemeToggle />
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 items-center gap-1.5 rounded-lg border border-border/60 bg-card/80 px-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors"
              >
                <Wheat size={12} className="text-primary" />
                View Site
              </a>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
