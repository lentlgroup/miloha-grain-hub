import { Link } from "react-router-dom";
import {
  MessageSquare,
  Package,
  Star,
  HelpCircle,
  Users,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Image,
  FileText,
  Activity,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchInquiryStats,
  fetchAdminProducts,
  fetchAdminTestimonials,
  fetchAdminFaqs,
  fetchAdminUsers,
  fetchInquiries,
} from "@/lib/adminApi";
import { cn } from "@/lib/utils";

const quickActions = [
  { label: "View Inquiries",    href: "/admin/inquiries",    icon: MessageSquare, permission: "manage-inquiries" },
  { label: "Edit Hero Slider",  href: "/admin/slider",       icon: Image,         permission: "manage-slider" },
  { label: "Manage Products",   href: "/admin/products",     icon: Package,       permission: "manage-products" },
  { label: "Edit Testimonials", href: "/admin/testimonials", icon: Star,          permission: "manage-testimonials" },
  { label: "Manage FAQs",       href: "/admin/faqs",         icon: HelpCircle,    permission: "manage-faqs" },
  { label: "Site Content",      href: "/admin/content",      icon: FileText,      permission: "manage-content" },
  { label: "Analytics",         href: "/admin/analytics",    icon: BarChart3,     permission: "manage-inquiries" },
];

const statusColors: Record<string, string> = {
  new: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  "in-progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  archived: "bg-muted text-muted-foreground",
};

const PIE_COLORS = ["#F59E0B", "#3B82F6", "#10B981", "#94A3B8"];

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

/** Build a 7-day trend from raw inquiries, keyed by date string */
function buildTrend(inquiries: { created_at: string }[]) {
  const days: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    days.push({ date: key, count: 0 });
  }
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  inquiries.forEach((inq) => {
    const d = new Date(inq.created_at);
    if (d >= cutoff) {
      const key = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
      const found = days.find((day) => day.date === key);
      if (found) found.count += 1;
    }
  });
  return days;
}

const StatSkeleton = () => (
  <Card className="surface-panel border-border/60">
    <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-9 w-9 rounded-xl" />
    </CardHeader>
    <CardContent className="px-5 pb-5">
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32 mt-2" />
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user, hasPermission } = useAuth();

  const { data: inquiryStats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ["admin", "inquiry-stats"],
    queryFn: fetchInquiryStats,
    refetchInterval: 60_000,
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: fetchAdminProducts,
    enabled: hasPermission("manage-products"),
  });

  const { data: testimonialsData, isLoading: testimonialsLoading } = useQuery({
    queryKey: ["admin", "testimonials"],
    queryFn: fetchAdminTestimonials,
    enabled: hasPermission("manage-testimonials"),
  });

  const { data: faqsData, isLoading: faqsLoading } = useQuery({
    queryKey: ["admin", "faqs"],
    queryFn: fetchAdminFaqs,
    enabled: hasPermission("manage-faqs"),
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: fetchAdminUsers,
    enabled: hasPermission("manage-users"),
  });

  const { data: recentInquiriesData } = useQuery({
    queryKey: ["admin", "inquiries", "recent"],
    queryFn: () => fetchInquiries(),
    enabled: hasPermission("manage-inquiries"),
    refetchInterval: 60_000,
  });

  const recentInquiries = (recentInquiriesData?.data ?? []).slice(0, 5);
  const trendData = buildTrend(recentInquiriesData?.data ?? []);

  const stats = [
    {
      title: "Total Inquiries",
      value: inquiryStats?.total ?? "—",
      description: "Contact & quote requests",
      icon: MessageSquare,
      trend: inquiryStats ? `${inquiryStats.new} new pending` : undefined,
      trendUp: true,
      href: "/admin/inquiries",
      permission: "manage-inquiries",
      color: "text-blue-600 dark:text-blue-400",
      loading: statsLoading,
    },
    {
      title: "New / Unread",
      value: inquiryStats?.new ?? "—",
      description: "Pending your response",
      icon: AlertCircle,
      trend: (inquiryStats?.new ?? 0) > 0 ? "Needs attention" : "All clear",
      trendUp: (inquiryStats?.new ?? 0) === 0,
      href: "/admin/inquiries",
      permission: "manage-inquiries",
      color: "text-amber-600 dark:text-amber-400",
      loading: statsLoading,
    },
    {
      title: "Products",
      value: productsData?.data?.length ?? "—",
      description: "Active product listings",
      icon: Package,
      trend: "In product catalog",
      trendUp: true,
      href: "/admin/products",
      permission: "manage-products",
      color: "text-primary",
      loading: productsLoading,
    },
    {
      title: "Testimonials",
      value: testimonialsData?.data?.length ?? "—",
      description: "Live on website",
      icon: Star,
      trend: "Carousel active",
      trendUp: true,
      href: "/admin/testimonials",
      permission: "manage-testimonials",
      color: "text-accent",
      loading: testimonialsLoading,
    },
    {
      title: "FAQs",
      value: faqsData?.data?.length ?? "—",
      description: "Published questions",
      icon: HelpCircle,
      trend: "All active",
      trendUp: true,
      href: "/admin/faqs",
      permission: "manage-faqs",
      color: "text-purple-600 dark:text-purple-400",
      loading: faqsLoading,
    },
    {
      title: "Admin Users",
      value: usersData?.data?.length ?? "—",
      description: "Portal accounts",
      icon: Users,
      trend: "RBAC managed",
      trendUp: true,
      href: "/admin/users",
      permission: "manage-users",
      color: "text-rose-600 dark:text-rose-400",
      loading: usersLoading,
    },
  ];

  const visibleStats = stats.filter((s) => !s.permission || hasPermission(s.permission));
  const visibleActions = quickActions.filter((a) => hasPermission(a.permission));

  const total = inquiryStats?.total ?? 0;
  const pieData = inquiryStats
    ? [
        { name: "New",         value: inquiryStats.new         },
        { name: "In Progress", value: inquiryStats.in_progress },
        { name: "Resolved",    value: inquiryStats.resolved    },
        { name: "Archived",    value: inquiryStats.archived    },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {greeting()}, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here's what's happening with your MILOHA portal today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/80 px-3 py-2 text-xs text-muted-foreground">
            <Activity size={13} className="text-primary animate-pulse-soft" />
            <span>Live dashboard</span>
          </div>
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => refetchStats()}>
            <RefreshCw size={13} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleStats.map((stat) =>
          stat.loading ? (
            <StatSkeleton key={stat.title} />
          ) : (
            <Link key={stat.title} to={stat.href}>
              <Card className="group surface-panel border-border/60 hover:border-primary/30 transition-all duration-200 hover:-translate-y-0.5 card-elevated cursor-pointer h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">{stat.title}</CardTitle>
                  <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl bg-muted/60", stat.color)}>
                    <stat.icon size={18} />
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  {stat.trend && (
                    <div className={cn("mt-3 flex items-center gap-1.5 text-xs font-medium", stat.trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>
                      <TrendingUp size={11} />
                      {stat.trend}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ),
        )}
      </div>

      {/* Charts row */}
      {hasPermission("manage-inquiries") && (
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          {/* 7-day inquiry trend */}
          <Card className="surface-panel border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Inquiry Trend</CardTitle>
                <Link to="/admin/analytics">
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
                    Full analytics <ArrowRight size={12} className="ml-1" />
                  </Button>
                </Link>
              </div>
              <CardDescription>New inquiries over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent className="pr-4">
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={trendData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="inquiryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="hsl(154 55% 27%)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="hsl(154 55% 27%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    labelStyle={{ fontWeight: 600, color: "hsl(var(--foreground))" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Inquiries"
                    stroke="hsl(154 55% 27%)"
                    strokeWidth={2}
                    fill="url(#inquiryGradient)"
                    dot={{ r: 4, fill: "hsl(154 55% 27%)", strokeWidth: 0 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status breakdown donut */}
          <Card className="surface-panel border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Status Breakdown</CardTitle>
              <CardDescription>{total} total requests</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              {statsLoading ? (
                <Skeleton className="h-36 w-36 rounded-full" />
              ) : pieData.length > 0 ? (
                <>
                  <PieChart width={140} height={140}>
                    <Pie
                      data={pieData}
                      cx={65}
                      cy={65}
                      innerRadius={44}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                  <div className="w-full space-y-2">
                    {[
                      { name: "New",         value: inquiryStats?.new         ?? 0, color: PIE_COLORS[0] },
                      { name: "In Progress", value: inquiryStats?.in_progress ?? 0, color: PIE_COLORS[1] },
                      { name: "Resolved",    value: inquiryStats?.resolved    ?? 0, color: PIE_COLORS[2] },
                      { name: "Archived",    value: inquiryStats?.archived    ?? 0, color: PIE_COLORS[3] },
                    ].map((s) => (
                      <div key={s.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                          <span className="text-muted-foreground">{s.name}</span>
                        </div>
                        <span className="font-semibold text-foreground tabular-nums">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground py-8">No data yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Recent Inquiries */}
        {hasPermission("manage-inquiries") && (
          <Card className="surface-panel border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Recent Inquiries</CardTitle>
                <Link to="/admin/inquiries">
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
                    View all <ArrowRight size={12} className="ml-1" />
                  </Button>
                </Link>
              </div>
              <CardDescription>Latest contact and quote requests</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {recentInquiries.length === 0 ? (
                <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                  No inquiries yet — they'll appear here when customers submit requests.
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {recentInquiries.map((inq) => (
                    <Link key={inq.id} to="/admin/inquiries" className="block">
                      <div className="flex items-start gap-3 px-6 py-4 hover:bg-muted/30 transition-colors">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
                          <MessageSquare size={15} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground leading-snug">{inq.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            {inq.product} · {inq.location}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", statusColors[inq.status])}>
                            {inq.status}
                          </span>
                          <span className="text-[11px] text-muted-foreground/70">
                            {new Date(inq.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {/* Quick actions */}
          <Card className="surface-panel border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
              <CardDescription>Jump to any management section</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/60">
                {visibleActions.map((action) => (
                  <Link key={action.href} to={action.href}>
                    <div className="flex items-center gap-3 px-6 py-3 hover:bg-muted/30 transition-colors group cursor-pointer">
                      <action.icon size={15} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="flex-1 text-sm font-medium text-foreground">{action.label}</span>
                      <ArrowRight size={13} className="text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System status */}
          <Card className="surface-panel border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Landing Page",    status: "Live",   ok: true },
                { label: "Contact Form",    status: "Active", ok: true },
                { label: "Site Search",     status: "Active", ok: true },
                { label: "WhatsApp Widget", status: "Active", ok: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <div className="flex items-center gap-1.5">
                    {item.ok ? (
                      <CheckCircle2 size={13} className="text-emerald-500" />
                    ) : (
                      <AlertCircle size={13} className="text-amber-500" />
                    )}
                    <span className={cn("text-xs font-medium", item.ok ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
