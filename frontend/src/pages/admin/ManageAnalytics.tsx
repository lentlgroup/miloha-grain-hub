import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, MessageSquare, Package, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchInquiries,
  fetchInquiryStats,
  fetchAdminProducts,
  fetchAdminUsers,
  type Inquiry,
} from "@/lib/adminApi";
import { cn } from "@/lib/utils";

const PIE_COLORS = ["#F59E0B", "#3B82F6", "#10B981", "#94A3B8"];
const BUYER_COLORS = ["#1F4D2B", "#7FBF3F", "#C89B3C", "#1C355E", "#6366F1"];

function buildDailyTrend(inquiries: Inquiry[], days = 14) {
  const result: { date: string; total: number; new: number; resolved: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    result.push({ date: key, total: 0, new: 0, resolved: 0 });
  }
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  inquiries.forEach((inq) => {
    const d = new Date(inq.created_at);
    if (d >= cutoff) {
      const key = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
      const found = result.find((r) => r.date === key);
      if (found) {
        found.total += 1;
        if (inq.status === "new") found.new += 1;
        if (inq.status === "resolved") found.resolved += 1;
      }
    }
  });
  return result;
}

function buildProductBreakdown(inquiries: Inquiry[]) {
  const map: Record<string, number> = {};
  inquiries.forEach((inq) => {
    if (!inq.product) return;
    map[inq.product] = (map[inq.product] ?? 0) + 1;
  });
  return Object.entries(map)
    .map(([product, count]) => ({ product, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

function buildBuyerTypeBreakdown(inquiries: Inquiry[]) {
  const map: Record<string, number> = {};
  inquiries.forEach((inq) => {
    const type = inq.buyer_type || "unknown";
    map[type] = (map[type] ?? 0) + 1;
  });
  return Object.entries(map)
    .map(([type, count]) => ({ name: type, value: count }))
    .sort((a, b) => b.value - a.value);
}

function buildLocationBreakdown(inquiries: Inquiry[]) {
  const map: Record<string, number> = {};
  inquiries.forEach((inq) => {
    if (!inq.location) return;
    map[inq.location] = (map[inq.location] ?? 0) + 1;
  });
  return Object.entries(map)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

/** Escape a value for use in a CSV cell. */
const escapeCsvField = (value: string | number | null | undefined): string =>
  String(value ?? "").replace(/"/g, '""');

function exportInquiriesCsv(inquiries: Inquiry[]) {
  const headers = ["ID", "Name", "Email", "Phone", "Product", "Packaging", "Quantity", "Location", "Buyer Type", "Status", "Created At"];
  const rows = inquiries.map((inq) => [
    inq.id,
    escapeCsvField(inq.name),
    escapeCsvField(inq.email),
    escapeCsvField(inq.phone),
    escapeCsvField(inq.product),
    escapeCsvField(inq.packaging),
    inq.quantity ?? "",
    escapeCsvField(inq.location),
    escapeCsvField(inq.buyer_type),
    inq.status,
    new Date(inq.created_at).toISOString(),
  ]);
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `analytics-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const ManageAnalytics = () => {
  const { hasPermission } = useAuth();

  const { data: inquiriesData, isLoading: inqLoading } = useQuery({
    queryKey: ["admin", "inquiries", "all"],
    queryFn: () => fetchInquiries(),
    enabled: hasPermission("manage-inquiries"),
  });

  const { data: statsData } = useQuery({
    queryKey: ["admin", "inquiry-stats"],
    queryFn: fetchInquiryStats,
  });

  const { data: productsData } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: fetchAdminProducts,
    enabled: hasPermission("manage-products"),
  });

  const { data: usersData } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: fetchAdminUsers,
    enabled: hasPermission("manage-users"),
  });

  const inquiries = inquiriesData?.data ?? [];
  const stats = statsData ?? { total: 0, new: 0, in_progress: 0, resolved: 0, archived: 0 };

  const trendData = buildDailyTrend(inquiries, 14);
  const productData = buildProductBreakdown(inquiries);
  const buyerTypeData = buildBuyerTypeBreakdown(inquiries);
  const locationData = buildLocationBreakdown(inquiries);
  const pieData = [
    { name: "New",         value: stats.new },
    { name: "In Progress", value: stats.in_progress },
    { name: "Resolved",    value: stats.resolved },
    { name: "Archived",    value: stats.archived },
  ].filter((d) => d.value > 0);

  const resolutionRate = stats.total > 0
    ? Math.round((stats.resolved / stats.total) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Inquiry trends, product demand, and operational metrics
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 self-start"
          onClick={() => exportInquiriesCsv(inquiries)}
          disabled={inquiries.length === 0}
        >
          <Download size={13} /> Export All Data
        </Button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Inquiries", value: stats.total, icon: MessageSquare, color: "text-blue-600 dark:text-blue-400" },
          { label: "Resolution Rate", value: `${resolutionRate}%`, icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-400" },
          { label: "Products Listed", value: productsData?.data?.length ?? "—", icon: Package, color: "text-primary" },
          { label: "Admin Users", value: usersData?.data?.length ?? "—", icon: Users, color: "text-rose-600 dark:text-rose-400" },
        ].map((kpi) => (
          <Card key={kpi.label} className="surface-panel border-border/60">
            <CardContent className="flex items-start justify-between p-5">
              <div>
                <p className="text-xs text-muted-foreground font-medium">{kpi.label}</p>
                {inqLoading ? (
                  <Skeleton className="h-8 w-14 mt-1" />
                ) : (
                  <p className="text-3xl font-bold text-foreground mt-1">{kpi.value}</p>
                )}
              </div>
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl bg-muted/60", kpi.color)}>
                <kpi.icon size={18} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trend + Pie row */}
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* 14-day trend */}
        <Card className="surface-panel border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">14-Day Inquiry Trend</CardTitle>
            <CardDescription>Daily breakdown of new vs. resolved inquiries</CardDescription>
          </CardHeader>
          <CardContent className="pr-4">
            {inqLoading ? (
              <Skeleton className="h-56 w-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={trendData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#10B981" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="total" name="Total" stroke="#3B82F6" strokeWidth={2} fill="url(#totalGrad)" dot={false} />
                  <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#10B981" strokeWidth={2} fill="url(#resolvedGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Status donut */}
        <Card className="surface-panel border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Status Distribution</CardTitle>
            <CardDescription>{stats.total} total inquiries</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {inqLoading ? (
              <Skeleton className="h-44 w-44 rounded-full" />
            ) : pieData.length > 0 ? (
              <>
                <PieChart width={160} height={160}>
                  <Pie data={pieData} cx={75} cy={75} innerRadius={50} outerRadius={72} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                </PieChart>
                <div className="w-full space-y-2">
                  {[
                    { name: "New", value: stats.new, color: PIE_COLORS[0] },
                    { name: "In Progress", value: stats.in_progress, color: PIE_COLORS[1] },
                    { name: "Resolved", value: stats.resolved, color: PIE_COLORS[2] },
                    { name: "Archived", value: stats.archived, color: PIE_COLORS[3] },
                  ].map((s) => (
                    <div key={s.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full shrink-0" style={{ background: s.color }} />
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

      {/* Product demand + Buyer types */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Product demand bar chart */}
        <Card className="surface-panel border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Product Demand</CardTitle>
            <CardDescription>Most requested products by inquiry count</CardDescription>
          </CardHeader>
          <CardContent className="pr-4">
            {inqLoading ? (
              <Skeleton className="h-56 w-full rounded-xl" />
            ) : productData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={productData} margin={{ top: 4, right: 4, bottom: 40, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="product" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} angle={-35} textAnchor="end" interval={0} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="count" name="Inquiries" fill="hsl(154 55% 27%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground py-8">No inquiry data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Buyer type breakdown */}
        <Card className="surface-panel border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Buyer Type Breakdown</CardTitle>
            <CardDescription>Inquiries segmented by buyer category</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {inqLoading ? (
              <Skeleton className="h-44 w-44 rounded-full" />
            ) : buyerTypeData.length > 0 ? (
              <>
                <PieChart width={160} height={160}>
                  <Pie data={buyerTypeData} cx={75} cy={75} outerRadius={72} paddingAngle={2} dataKey="value">
                    {buyerTypeData.map((_, i) => <Cell key={i} fill={BUYER_COLORS[i % BUYER_COLORS.length]} />)}
                  </Pie>
                </PieChart>
                <div className="w-full space-y-2">
                  {buyerTypeData.map((b, i) => (
                    <div key={b.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full shrink-0" style={{ background: BUYER_COLORS[i % BUYER_COLORS.length] }} />
                        <span className="text-muted-foreground capitalize">{b.name}</span>
                      </div>
                      <span className="font-semibold text-foreground tabular-nums">{b.value}</span>
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

      {/* Top locations */}
      {locationData.length > 0 && (
        <Card className="surface-panel border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Top Inquiry Locations</CardTitle>
            <CardDescription>Regions generating the most inquiries</CardDescription>
          </CardHeader>
          <CardContent className="pr-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={locationData} layout="vertical" margin={{ top: 0, right: 24, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="location" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={90} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" name="Inquiries" fill="#C89B3C" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ManageAnalytics;
