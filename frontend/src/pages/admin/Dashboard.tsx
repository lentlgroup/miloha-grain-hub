import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  Package,
  Star,
  HelpCircle,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Image,
  FileText,
  Activity,
  Wheat,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

type StatCard = {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  href: string;
  permission: string | null;
  color: string;
};

const stats: StatCard[] = [
  {
    title: "Total Inquiries",
    value: 48,
    description: "Contact & quote requests",
    icon: MessageSquare,
    trend: "+12 this week",
    trendUp: true,
    href: "/admin/inquiries",
    permission: "manage-inquiries",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "New / Unread",
    value: 7,
    description: "Pending your response",
    icon: AlertCircle,
    trend: "Needs attention",
    trendUp: false,
    href: "/admin/inquiries",
    permission: "manage-inquiries",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    title: "Products",
    value: 4,
    description: "Active product listings",
    icon: Package,
    trend: "All published",
    trendUp: true,
    href: "/admin/products",
    permission: "manage-products",
    color: "text-primary",
  },
  {
    title: "Testimonials",
    value: 3,
    description: "Live on website",
    icon: Star,
    trend: "Carousel active",
    trendUp: true,
    href: "/admin/testimonials",
    permission: "manage-testimonials",
    color: "text-accent dark:text-accent",
  },
  {
    title: "FAQs",
    value: 4,
    description: "Published questions",
    icon: HelpCircle,
    trend: "All active",
    trendUp: true,
    href: "/admin/faqs",
    permission: "manage-faqs",
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    title: "Admin Users",
    value: 3,
    description: "Portal accounts",
    icon: Users,
    trend: "3 roles assigned",
    trendUp: true,
    href: "/admin/users",
    permission: "manage-users",
    color: "text-rose-600 dark:text-rose-400",
  },
];

const recentActivity = [
  {
    id: 1,
    type: "inquiry",
    title: "New inquiry from Azania Retail",
    desc: "Rice 25kg × 10 bags — Kinondoni",
    time: "5 min ago",
    status: "new",
    icon: MessageSquare,
  },
  {
    id: 2,
    type: "content",
    title: "Testimonial updated",
    desc: "Hospitality client quote revised",
    time: "2 hr ago",
    status: "done",
    icon: Star,
  },
  {
    id: 3,
    type: "inquiry",
    title: "Follow-up sent",
    desc: "Maize 50kg bulk order — Ubungo",
    time: "4 hr ago",
    status: "in-progress",
    icon: MessageSquare,
  },
  {
    id: 4,
    type: "content",
    title: "FAQ section updated",
    desc: "Added delivery policy FAQ",
    time: "Yesterday",
    status: "done",
    icon: HelpCircle,
  },
  {
    id: 5,
    type: "content",
    title: "Hero slider updated",
    desc: "New grain harvest banner added",
    time: "2 days ago",
    status: "done",
    icon: Image,
  },
];

const statusColors: Record<string, string> = {
  new: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  "in-progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  done: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
};

const quickActions = [
  { label: "View Inquiries", href: "/admin/inquiries", icon: MessageSquare, permission: "manage-inquiries" },
  { label: "Edit Hero Slider", href: "/admin/slider", icon: Image, permission: "manage-slider" },
  { label: "Manage Products", href: "/admin/products", icon: Package, permission: "manage-products" },
  { label: "Edit Testimonials", href: "/admin/testimonials", icon: Star, permission: "manage-testimonials" },
  { label: "Manage FAQs", href: "/admin/faqs", icon: HelpCircle, permission: "manage-faqs" },
  { label: "Site Content", href: "/admin/content", icon: FileText, permission: "manage-content" },
];

const inquiryStatuses = [
  { label: "New", value: 7, total: 48, color: "bg-amber-500" },
  { label: "In Progress", value: 18, total: 48, color: "bg-blue-500" },
  { label: "Resolved", value: 23, total: 48, color: "bg-emerald-500" },
];

const Dashboard = () => {
  const { user, hasPermission } = useAuth();
  const visibleStats = stats.filter((s) => !s.permission || hasPermission(s.permission));
  const visibleActions = quickActions.filter((a) => hasPermission(a.permission));

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
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
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {visibleStats.map((stat) => (
          <Link key={stat.title} to={stat.href}>
            <Card className="group surface-panel border-border/60 hover:border-primary/30 transition-all duration-200 hover:-translate-y-0.5 card-elevated cursor-pointer">
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
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Recent Activity */}
        <Card className="surface-panel border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
              <Link to="/admin/inquiries">
                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
                  View all <ArrowRight size={12} className="ml-1" />
                </Button>
              </Link>
            </div>
            <CardDescription>Latest updates across all modules</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/60">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3 px-6 py-4 hover:bg-muted/30 transition-colors">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
                    <item.icon size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground leading-snug">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.desc}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", statusColors[item.status])}>
                      {item.status}
                    </span>
                    <span className="text-[11px] text-muted-foreground/70">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Inquiry breakdown */}
          {hasPermission("manage-inquiries") && (
            <Card className="surface-panel border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Inquiry Status</CardTitle>
                <CardDescription>48 total requests received</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {inquiryStatuses.map((s) => (
                  <div key={s.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{s.label}</span>
                      <span className="text-muted-foreground">
                        {s.value} / {s.total}
                      </span>
                    </div>
                    <Progress value={(s.value / s.total) * 100} className="h-2" />
                  </div>
                ))}
                <Link to="/admin/inquiries">
                  <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
                    Manage Inquiries <ArrowRight size={12} className="ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

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
                { label: "Landing Page", status: "Live", ok: true },
                { label: "Contact Form", status: "Active", ok: true },
                { label: "Site Search", status: "Active", ok: true },
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
