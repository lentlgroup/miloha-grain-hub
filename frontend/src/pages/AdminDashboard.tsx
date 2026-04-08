import { Link } from "react-router-dom";
import {
  MessageSquare,
  Users,
  Shield,
  Key,
  TrendingUp,
  Clock,
  CheckCircle2,
  Eye,
  ArrowRight,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const STATS = [
  {
    label: "Total Inquiries",
    value: "47",
    sub: "+12 this week",
    icon: MessageSquare,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    trend: true,
  },
  {
    label: "Pending Review",
    value: "12",
    sub: "Needs attention",
    icon: Clock,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    trend: false,
  },
  {
    label: "Total Users",
    value: "8",
    sub: "Active accounts",
    icon: Users,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    trend: true,
  },
  {
    label: "Active Roles",
    value: "4",
    sub: "Access profiles",
    icon: Shield,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/10",
    trend: false,
  },
];

const RECENT_INQUIRIES = [
  { id: 1, name: "Amina Hassan", product: "Rice", location: "Kinondoni", status: "new", ago: "2 hours ago" },
  { id: 2, name: "Juma Salim", product: "Maize Flour", location: "Temeke", status: "in_progress", ago: "5 hours ago" },
  { id: 3, name: "Fatuma Ali", product: "Beans", location: "Ilala", status: "new", ago: "Yesterday" },
  { id: 4, name: "Rashid Mohamed", product: "Rice (Bulk)", location: "Mwanza", status: "completed", ago: "2 days ago" },
  { id: 5, name: "Grace Kimaro", product: "Packaged Rice", location: "Arusha", status: "new", ago: "3 days ago" },
];

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  new: { label: "New", className: "bg-blue-500/10 text-blue-600 border-blue-200/50" },
  in_progress: { label: "In Progress", className: "bg-amber-500/10 text-amber-600 border-amber-200/50" },
  completed: { label: "Completed", className: "bg-primary/10 text-primary border-primary/20" },
  archived: { label: "Archived", className: "bg-muted text-muted-foreground border-muted" },
};

const QUICK_ACTIONS = [
  { label: "Review Inquiries", href: "/admin/inquiries", icon: MessageSquare, permission: "manage-inquiries", badge: "12" },
  { label: "Manage Users", href: "/admin/users", icon: Users, permission: "manage-users" },
  { label: "Manage Roles", href: "/admin/roles", icon: Shield, permission: "manage-roles" },
  { label: "Manage Permissions", href: "/admin/permissions", icon: Key, permission: "manage-permissions" },
] as const;

const AdminDashboard = () => {
  const { user, hasPermission } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <AdminLayout
      title="Dashboard"
      description={`Welcome back, ${firstName}. Here's what's happening with MILOHA today.`}
    >
      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {STATS.map((stat) => (
          <Card key={stat.label} className="surface-panel">
            <CardContent className="pt-5 pb-4 px-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}>
                  <stat.icon size={18} className={stat.iconColor} />
                </div>
                {stat.trend && (
                  <div className="flex items-center gap-1 rounded-full bg-primary/8 px-2 py-1">
                    <TrendingUp size={11} className="text-primary" />
                    <span className="text-[10px] font-semibold text-primary">Up</span>
                  </div>
                )}
              </div>
              <p className="text-2xl font-serif font-semibold text-foreground">{stat.value}</p>
              <p className="text-sm font-medium text-foreground mt-0.5">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Inquiries table */}
        <Card className="lg:col-span-2 surface-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-serif">Recent Inquiries</CardTitle>
              <CardDescription className="text-xs mt-0.5">Latest quote requests from customers</CardDescription>
            </div>
            {hasPermission("manage-inquiries") && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/inquiries" className="flex items-center gap-1.5">
                  View All <ArrowRight size={13} />
                </Link>
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {RECENT_INQUIRIES.map((inquiry) => {
                const st = STATUS_CONFIG[inquiry.status] ?? STATUS_CONFIG.new;
                return (
                  <div
                    key={inquiry.id}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      {inquiry.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{inquiry.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {inquiry.product} · {inquiry.location}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${st.className}`}
                      >
                        {st.label}
                      </span>
                      <p className="text-[10px] text-muted-foreground">{inquiry.ago}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-4">
          {/* Quick actions */}
          <Card className="surface-panel">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-serif">Quick Actions</CardTitle>
              <CardDescription className="text-xs">Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {QUICK_ACTIONS.filter((a) => hasPermission(a.permission)).map((action) => (
                <Button
                  key={action.href}
                  variant="outline"
                  className="w-full justify-start gap-2 text-sm"
                  size="sm"
                  asChild
                >
                  <Link to={action.href}>
                    <action.icon size={14} />
                    {action.label}
                    {action.badge && (
                      <span className="ml-auto inline-flex items-center rounded-full bg-amber-500/10 px-1.5 py-0 text-[10px] font-semibold text-amber-600">
                        {action.badge}
                      </span>
                    )}
                  </Link>
                </Button>
              ))}
              <Button variant="outline" className="w-full justify-start gap-2 text-sm" size="sm" asChild>
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <Eye size={14} />
                  Preview Website
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* System health */}
          <Card className="surface-panel">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-serif">System Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Inquiries resolved", value: 74 },
                { label: "Response rate", value: 91 },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground">{metric.label}</span>
                    <span className="font-semibold text-foreground">{metric.value}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5 mt-1">
                <CheckCircle2 size={14} className="text-primary shrink-0" />
                <p className="text-xs text-primary font-medium">System operating normally</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;