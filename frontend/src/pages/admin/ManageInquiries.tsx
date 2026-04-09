import { useState } from "react";
import {
  MessageSquare,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Package,
  User,
  X,
  ChevronDown,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

type InquiryStatus = "new" | "in-progress" | "resolved" | "archived";

type Inquiry = {
  id: number;
  buyer_type: string;
  product: string;
  packaging: string;
  quantity: string;
  location: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: InquiryStatus;
  created_at: string;
  follow_up_note?: string;
};

const mockInquiries: Inquiry[] = [
  {
    id: 1,
    buyer_type: "Retail shop",
    product: "Rice",
    packaging: "25kg",
    quantity: "10 bags",
    location: "Kinondoni, Dar es Salaam",
    name: "Azania Retail",
    email: "orders@azaniaretail.co.tz",
    phone: "+255 712 345 678",
    message: "We need 10 bags of 25kg rice weekly. Can you confirm availability and pricing?",
    status: "new",
    created_at: "2026-04-09T06:30:00Z",
  },
  {
    id: 2,
    buyer_type: "Restaurant",
    product: "Maize",
    packaging: "50kg",
    quantity: "5 bags",
    location: "Ubungo, Dar es Salaam",
    name: "Safari Kitchens Ltd",
    email: "procurement@safarikitchens.com",
    phone: "+255 754 987 654",
    message: "Looking for bulk maize for ugali preparation. Please advise on delivery timeline.",
    status: "in-progress",
    created_at: "2026-04-08T14:15:00Z",
    follow_up_note: "Called customer — confirmed order for next Wednesday delivery.",
  },
  {
    id: 3,
    buyer_type: "Wholesale buyer",
    product: "Beans",
    packaging: "25kg",
    quantity: "20 bags",
    location: "Temeke, Dar es Salaam",
    name: "EastBay Traders",
    email: "info@eastbaytraders.co.tz",
    phone: "+255 688 111 222",
    message: "Monthly restocking order for mixed beans. Request formal quotation.",
    status: "resolved",
    created_at: "2026-04-07T09:00:00Z",
    follow_up_note: "Quotation sent via email on 2026-04-07. Payment confirmed.",
  },
  {
    id: 4,
    buyer_type: "Household",
    product: "Packaged Products",
    packaging: "5kg",
    quantity: "3 bags",
    location: "Mikocheni, Dar es Salaam",
    name: "Fatuma Hassan",
    email: "fhassan@gmail.com",
    phone: "+255 765 444 555",
    message: "Interested in home delivery of your branded 5kg rice packs.",
    status: "new",
    created_at: "2026-04-09T08:45:00Z",
  },
  {
    id: 5,
    buyer_type: "Institution",
    product: "Rice",
    packaging: "50kg",
    quantity: "100 bags",
    location: "Dodoma",
    name: "Central Region Schools",
    email: "procurement@crschools.go.tz",
    phone: "+255 622 800 900",
    message: "Institutional supply of rice for school feeding program. Need monthly supply agreement.",
    status: "in-progress",
    created_at: "2026-04-06T11:20:00Z",
    follow_up_note: "Meeting scheduled with procurement officer.",
  },
  {
    id: 6,
    buyer_type: "Mini-market",
    product: "Maize",
    packaging: "25kg",
    quantity: "8 bags",
    location: "Tegeta, Dar es Salaam",
    name: "Karibu Stores",
    email: "karibu@stores.co.tz",
    phone: "+255 699 333 444",
    message: "Regular maize stock refill — same as last month's order.",
    status: "resolved",
    created_at: "2026-04-05T16:00:00Z",
  },
];

const statusConfig: Record<InquiryStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  new: { label: "New", icon: AlertCircle, color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/40" },
  "in-progress": { label: "In Progress", icon: Clock, color: "text-blue-700 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/40" },
  resolved: { label: "Resolved", icon: CheckCircle2, color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40" },
  archived: { label: "Archived", icon: X, color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-100 dark:bg-gray-800/60" },
};

const statusOrder: InquiryStatus[] = ["new", "in-progress", "resolved", "archived"];

const ManageInquiries = () => {
  const { hasPermission } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>(mockInquiries);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<InquiryStatus | "all">("all");
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [followUpNote, setFollowUpNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const canEdit = hasPermission("manage-inquiries");

  const filtered = inquiries.filter((inq) => {
    const matchSearch =
      !search ||
      inq.name.toLowerCase().includes(search.toLowerCase()) ||
      inq.email.toLowerCase().includes(search.toLowerCase()) ||
      inq.product.toLowerCase().includes(search.toLowerCase()) ||
      inq.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || inq.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: number, status: InquiryStatus) => {
    setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, status } : inq)));
    if (selected?.id === id) setSelected((prev) => (prev ? { ...prev, status } : null));
  };

  const saveFollowUp = async () => {
    if (!selected) return;
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === selected.id ? { ...inq, follow_up_note: followUpNote, status: "in-progress" } : inq)),
    );
    setSelected((prev) => (prev ? { ...prev, follow_up_note: followUpNote, status: "in-progress" } : null));
    setIsSaving(false);
  };

  const openDetail = (inq: Inquiry) => {
    setSelected(inq);
    setFollowUpNote(inq.follow_up_note ?? "");
  };

  const statusCounts = statusOrder.reduce<Record<string, number>>(
    (acc, s) => ({ ...acc, [s]: inquiries.filter((i) => i.status === s).length }),
    {},
  );

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Inquiries</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage incoming contact and quote requests</p>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statusOrder.map((s) => {
          const cfg = statusConfig[s];
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? "all" : s)}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-4 text-left transition-all hover:border-primary/30",
                filterStatus === s
                  ? "border-primary/40 bg-primary/5"
                  : "border-border/60 bg-card/80 surface-panel",
              )}
            >
              <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", cfg.bg)}>
                <cfg.icon size={15} className={cfg.color} />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{statusCounts[s] ?? 0}</p>
                <p className="text-[11px] text-muted-foreground">{cfg.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, product, location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 shrink-0">
              <Filter size={14} />
              {filterStatus === "all" ? "All statuses" : statusConfig[filterStatus].label}
              <ChevronDown size={13} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilterStatus("all")}>All statuses</DropdownMenuItem>
            {statusOrder.map((s) => (
              <DropdownMenuItem key={s} onClick={() => setFilterStatus(s)}>
                {statusConfig[s].label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Inquiry cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border/60 py-16 text-center text-muted-foreground">
            <MessageSquare size={28} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">No inquiries found</p>
          </div>
        )}
        {filtered.map((inq) => {
          const cfg = statusConfig[inq.status];
          return (
            <Card
              key={inq.id}
              className="surface-panel border-border/60 hover:border-primary/30 transition-all cursor-pointer"
              onClick={() => openDetail(inq)}
            >
              <CardContent className="flex items-start gap-4 p-5">
                <div className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", cfg.bg)}>
                  <cfg.icon size={16} className={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-foreground">{inq.name}</p>
                    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold", cfg.bg, cfg.color)}>
                      {cfg.label}
                    </span>
                    <span className="text-xs text-muted-foreground">{inq.buyer_type}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Package size={11} />{inq.product} · {inq.packaging}</span>
                    <span className="flex items-center gap-1"><MapPin size={11} />{inq.location}</span>
                    <span className="flex items-center gap-1"><Mail size={11} />{inq.email}</span>
                  </div>
                  {inq.follow_up_note && (
                    <p className="mt-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 line-clamp-1">
                      📝 {inq.follow_up_note}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] text-muted-foreground">{fmt(inq.created_at)}</p>
                  <Button variant="ghost" size="sm" className="mt-1 h-7 text-xs gap-1">
                    <Eye size={12} /> View
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MessageSquare size={18} className="text-primary" />
                  Inquiry from {selected.name}
                </DialogTitle>
                <DialogDescription>{fmt(selected.created_at)}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                {/* Status changer */}
                {canEdit && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-muted-foreground">Status:</span>
                    {statusOrder.filter((s) => s !== "archived").map((s) => {
                      const cfg = statusConfig[s];
                      return (
                        <button
                          key={s}
                          onClick={() => updateStatus(selected.id, s)}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border transition-all",
                            selected.status === s
                              ? cn(cfg.bg, cfg.color, "border-transparent")
                              : "border-border/60 bg-transparent text-muted-foreground hover:border-primary/30",
                          )}
                        >
                          <cfg.icon size={11} />
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                <Separator />

                {/* Contact info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User size={14} className="text-primary shrink-0" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wide font-semibold">Name</p>
                        <p className="text-foreground font-medium">{selected.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail size={14} className="text-primary shrink-0" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wide font-semibold">Email</p>
                        <a href={`mailto:${selected.email}`} className="text-primary hover:underline">{selected.email}</a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone size={14} className="text-primary shrink-0" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wide font-semibold">Phone</p>
                        <a href={`tel:${selected.phone}`} className="text-foreground font-medium hover:text-primary">{selected.phone}</a>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Package size={14} className="text-primary shrink-0" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground">Product</p>
                        <p className="text-foreground font-medium">{selected.product} · {selected.packaging}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package size={14} className="text-primary shrink-0" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground">Quantity</p>
                        <p className="text-foreground font-medium">{selected.quantity || "—"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-primary shrink-0" />
                      <div>
                        <p className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground">Location</p>
                        <p className="text-foreground font-medium">{selected.location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selected.message && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Message</p>
                      <p className="text-sm text-foreground leading-relaxed bg-muted/40 rounded-xl p-4">{selected.message}</p>
                    </div>
                  </>
                )}

                <Separator />

                {/* Follow-up note */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Follow-up Note
                  </Label>
                  <Textarea
                    placeholder="Add follow-up notes, actions taken, next steps…"
                    value={followUpNote}
                    onChange={(e) => setFollowUpNote(e.target.value)}
                    className="min-h-24 text-sm resize-none"
                    disabled={!canEdit}
                  />
                  {canEdit && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveFollowUp} disabled={isSaving} className="gap-2">
                        <Send size={13} />
                        {isSaving ? "Saving…" : "Save Note"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const mailto = `mailto:${selected.email}?subject=Re: Your MILOHA Inquiry&body=Dear ${selected.name},%0A%0AThank you for your inquiry about ${selected.product}.`;
                          window.open(mailto);
                        }}
                        className="gap-2"
                      >
                        <Mail size={13} />
                        Reply by Email
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`https://wa.me/${selected.phone.replace(/\D/g, "")}`)}
                        className="gap-2"
                      >
                        <Phone size={13} />
                        WhatsApp
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageInquiries;
