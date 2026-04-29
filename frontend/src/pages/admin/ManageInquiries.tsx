import { useState } from "react";
import {
  MessageSquare, Search, Filter, Eye, CheckCircle2, Clock, AlertCircle,
  Phone, Mail, MapPin, Package, User, X, ChevronDown, Send, Trash2,
  RefreshCw, Download, CheckSquare, Square, MinusSquare,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  fetchInquiries, fetchInquiryStats, updateInquiry, deleteInquiry,
  bulkUpdateInquiries, bulkDeleteInquiries,
  type Inquiry,
} from "@/lib/adminApi";

type InquiryStatus = Inquiry["status"];

const statusMeta: Record<InquiryStatus, { label: string; icon: React.ElementType; color: string; badge: string }> = {
  new: {
    label: "New",
    icon: AlertCircle,
    color: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
  "in-progress": {
    label: "In Progress",
    icon: Clock,
    color: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  },
  archived: {
    label: "Archived",
    icon: X,
    color: "text-muted-foreground",
    badge: "bg-muted text-muted-foreground",
  },
};

/** Convert array of Inquiry objects to CSV and trigger download */
function exportToCsv(inquiries: Inquiry[]) {
  const headers = ["ID", "Name", "Email", "Phone", "Product", "Packaging", "Quantity", "Location", "Buyer Type", "Status", "Message", "Follow-up Note", "Created At"];
  const rows = inquiries.map((inq) => [
    inq.id,
    inq.name,
    inq.email,
    inq.phone,
    inq.product,
    inq.packaging,
    inq.quantity ?? "",
    inq.location,
    inq.buyer_type,
    inq.status,
    (inq.message ?? "").replace(/"/g, '""'),
    (inq.follow_up_note ?? "").replace(/"/g, '""'),
    new Date(inq.created_at).toISOString(),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

const ManageInquiries = () => {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const canEdit = hasPermission("manage-inquiries");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | "all">("all");
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [followUpText, setFollowUpText] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin", "inquiries", statusFilter, search],
    queryFn: () => fetchInquiries({
      status: statusFilter !== "all" ? statusFilter : undefined,
      search: search || undefined,
    }),
    refetchInterval: 60_000,
  });

  const { data: statsData } = useQuery({
    queryKey: ["admin", "inquiry-stats"],
    queryFn: fetchInquiryStats,
    refetchInterval: 60_000,
  });

  const updateMut = useMutation({
    mutationFn: ({ id, body }: { id: number; body: Partial<Pick<Inquiry, "status" | "follow_up_note">> }) =>
      updateInquiry(id, body),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["admin", "inquiries"] });
      qc.invalidateQueries({ queryKey: ["admin", "inquiry-stats"] });
      if (selected?.id === res.data.id) setSelected(res.data);
      toast({ title: "Updated", description: "Inquiry updated successfully." });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteInquiry(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "inquiries"] });
      qc.invalidateQueries({ queryKey: ["admin", "inquiry-stats"] });
      setDeleteTarget(null);
      setSelected(null);
      toast({ title: "Deleted", description: "Inquiry removed." });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const bulkUpdateMut = useMutation({
    mutationFn: ({ ids, status }: { ids: number[]; status: InquiryStatus }) =>
      bulkUpdateInquiries(ids, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "inquiries"] });
      qc.invalidateQueries({ queryKey: ["admin", "inquiry-stats"] });
      setSelectedIds(new Set());
      toast({ title: "Updated", description: `${selectedIds.size} inquiries updated.` });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const bulkDeleteMut = useMutation({
    mutationFn: (ids: number[]) => bulkDeleteInquiries(ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "inquiries"] });
      qc.invalidateQueries({ queryKey: ["admin", "inquiry-stats"] });
      setSelectedIds(new Set());
      setBulkDeleteOpen(false);
      toast({ title: "Deleted", description: "Selected inquiries deleted." });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const inquiries = data?.data ?? [];

  const toggleSelectAll = () => {
    if (selectedIds.size === inquiries.length && inquiries.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(inquiries.map((i) => i.id)));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allSelected = inquiries.length > 0 && selectedIds.size === inquiries.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  const openDetail = (inq: Inquiry) => {
    setSelected(inq);
    setFollowUpText(inq.follow_up_note ?? "");
  };

  const saveFollowUp = () => {
    if (!selected) return;
    updateMut.mutate({ id: selected.id, body: { follow_up_note: followUpText } });
  };

  const setStatus = (id: number, status: InquiryStatus) => {
    updateMut.mutate({ id, body: { status } });
  };

  const stats = statsData ?? { total: 0, new: 0, in_progress: 0, resolved: 0, archived: 0 };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inquiries</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage customer contact requests and quote follow-ups</p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => exportToCsv(inquiries)}
            disabled={inquiries.length === 0}
          >
            <Download size={13} /> Export CSV
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => refetch()}>
            <RefreshCw size={14} /> Refresh
          </Button>
        </div>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["new", "in-progress", "resolved", "archived"] as InquiryStatus[]).map((s) => {
          const meta = statusMeta[s];
          const count = s === "new" ? stats.new : s === "in-progress" ? stats.in_progress : s === "resolved" ? stats.resolved : stats.archived;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
              className={cn(
                "group flex cursor-pointer flex-col gap-1.5 rounded-xl border p-4 text-left transition-all hover:border-primary/30 hover:-translate-y-0.5",
                statusFilter === s
                  ? "border-primary/40 bg-primary/5"
                  : "border-border/60 bg-card/80",
              )}
            >
              <div className={cn("flex items-center gap-1.5", meta.color)}>
                <meta.icon size={15} />
                <span className="text-xs font-semibold uppercase tracking-wide">{meta.label}</span>
              </div>
              {isLoading ? <Skeleton className="h-7 w-10" /> : (
                <p className="text-2xl font-bold text-foreground">{count}</p>
              )}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by name, email, product, location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 shrink-0">
              <Filter size={14} />
              {statusFilter === "all" ? "All Statuses" : statusMeta[statusFilter].label}
              <ChevronDown size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Statuses</DropdownMenuItem>
            {(["new", "in-progress", "resolved", "archived"] as InquiryStatus[]).map((s) => (
              <DropdownMenuItem key={s} onClick={() => setStatusFilter(s)}>
                {statusMeta[s].label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Bulk action bar */}
      {canEdit && selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <span className="text-sm font-medium text-foreground">
            {selectedIds.size} selected
          </span>
          <Separator orientation="vertical" className="h-4" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                Mark as… <ChevronDown size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {(["new", "in-progress", "resolved", "archived"] as InquiryStatus[]).map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => bulkUpdateMut.mutate({ ids: Array.from(selectedIds), status: s })}
                  disabled={bulkUpdateMut.isPending}
                >
                  {statusMeta[s].label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={() => setBulkDeleteOpen(true)}
          >
            <Trash2 size={12} /> Delete selected
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-xs"
            onClick={() => setSelectedIds(new Set())}
          >
            Clear
          </Button>
        </div>
      )}

      {/* Inquiry list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="surface-panel border-border/60">
              <CardContent className="p-4 flex gap-4">
                <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : inquiries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <MessageSquare size={36} className="text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">No inquiries found</p>
          {(search || statusFilter !== "all") && (
            <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={() => { setSearch(""); setStatusFilter("all"); }}>
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Select-all row header */}
          {canEdit && (
            <div className="flex items-center gap-3 px-1">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {allSelected ? (
                  <CheckSquare size={15} className="text-primary" />
                ) : someSelected ? (
                  <MinusSquare size={15} className="text-primary" />
                ) : (
                  <Square size={15} />
                )}
                {allSelected ? "Deselect all" : "Select all"}
              </button>
              <span className="text-xs text-muted-foreground">{inquiries.length} inquiries</span>
            </div>
          )}

          {inquiries.map((inq) => {
            const meta = statusMeta[inq.status];
            const isChecked = selectedIds.has(inq.id);
            return (
              <Card
                key={inq.id}
                className={cn(
                  "surface-panel border-border/60 hover:border-primary/20 transition-all",
                  isChecked && "border-primary/30 bg-primary/[0.03]",
                )}
              >
                <CardContent className="flex items-start gap-3 p-4">
                  {canEdit && (
                    <button
                      className="mt-1 shrink-0 text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => toggleSelect(inq.id)}
                    >
                      {isChecked ? (
                        <CheckSquare size={16} className="text-primary" />
                      ) : (
                        <Square size={16} />
                      )}
                    </button>
                  )}
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted/60", meta.color)}>
                    <meta.icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-sm text-foreground">{inq.name}</p>
                      <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", meta.badge)}>
                        {meta.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {inq.product} · {inq.packaging} · {inq.location}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-0.5">{inq.email} · {inq.phone}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="hidden text-[11px] text-muted-foreground sm:block">
                      {new Date(inq.created_at).toLocaleDateString()}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDetail(inq)}>
                      <Eye size={14} />
                    </Button>
                    {canEdit && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ChevronDown size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {(["new", "in-progress", "resolved", "archived"] as InquiryStatus[]).map((s) => (
                            <DropdownMenuItem
                              key={s}
                              disabled={inq.status === s}
                              onClick={() => setStatus(inq.id, s)}
                            >
                              Mark as {statusMeta[s].label}
                            </DropdownMenuItem>
                          ))}
                          <Separator className="my-1" />
                          <DropdownMenuItem className="text-destructive" onClick={() => setDeleteTarget(inq)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User size={18} />
                {selected.name}
                <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", statusMeta[selected.status].badge)}>
                  {statusMeta[selected.status].label}
                </span>
              </DialogTitle>
              <DialogDescription>
                Submitted {new Date(selected.created_at).toLocaleString()} · #{selected.id}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Contact info */}
              <Card className="border-border/60">
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-sm">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={14} className="text-muted-foreground shrink-0" />
                    <a href={`mailto:${selected.email}`} className="text-primary hover:underline truncate">{selected.email}</a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={14} className="text-muted-foreground shrink-0" />
                    <a href={`tel:${selected.phone}`} className="text-primary hover:underline">{selected.phone}</a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={14} className="text-muted-foreground shrink-0" />
                    <span>{selected.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User size={14} className="text-muted-foreground shrink-0" />
                    <span className="capitalize">{selected.buyer_type}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Order details */}
              <Card className="border-border/60">
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-sm">Order Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Product</p>
                    <p className="font-medium flex items-center gap-1 mt-0.5"><Package size={13} /> {selected.product}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Packaging</p>
                    <p className="font-medium mt-0.5">{selected.packaging}</p>
                  </div>
                  {selected.quantity && (
                    <div>
                      <p className="text-muted-foreground text-xs">Quantity</p>
                      <p className="font-medium mt-0.5">{selected.quantity}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Message */}
              {selected.message && (
                <div className="space-y-1.5">
                  <Label className="text-sm">Customer Message</Label>
                  <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3 text-sm leading-relaxed">
                    {selected.message}
                  </div>
                </div>
              )}

              {/* Follow-up note */}
              {canEdit && (
                <div className="space-y-2">
                  <Label className="text-sm">Follow-up Note</Label>
                  <Textarea
                    className="min-h-[90px] resize-none"
                    placeholder="Add internal follow-up notes, next steps, pricing discussed…"
                    value={followUpText}
                    onChange={(e) => setFollowUpText(e.target.value)}
                  />
                  <Button size="sm" className="gap-2" onClick={saveFollowUp} disabled={updateMut.isPending}>
                    <Send size={13} /> {updateMut.isPending ? "Saving…" : "Save Note"}
                  </Button>
                </div>
              )}

              {/* Actions */}
              <Separator />
              <div className="flex flex-wrap gap-2">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.product} Inquiry`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Mail size={13} /> Email Customer
                  </Button>
                </a>
                <a href={`https://wa.me/${selected.phone.replace(/\D/g, "")}?text=Hello ${encodeURIComponent(selected.name)}, thank you for your interest in MILOHA Grain Hub.`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Phone size={13} /> WhatsApp
                  </Button>
                </a>
                {canEdit && (
                  <>
                    {selected.status === "new" && (
                      <Button size="sm" variant="outline" className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950"
                        onClick={() => setStatus(selected.id, "in-progress")} disabled={updateMut.isPending}>
                        <Clock size={13} /> Mark In Progress
                      </Button>
                    )}
                    {selected.status !== "resolved" && (
                      <Button size="sm" variant="outline" className="gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950"
                        onClick={() => setStatus(selected.id, "resolved")} disabled={updateMut.isPending}>
                        <CheckCircle2 size={13} /> Mark Resolved
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" className="gap-2 ml-auto" onClick={() => setDeleteTarget(selected)}>
                      <Trash2 size={13} /> Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Inquiry?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the inquiry from {deleteTarget?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTarget && deleteMut.mutate(deleteTarget.id)}
              disabled={deleteMut.isPending}>
              {deleteMut.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk delete confirmation */}
      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedIds.size} Inquiries?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedIds.size} selected inquiries. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => bulkDeleteMut.mutate(Array.from(selectedIds))}
              disabled={bulkDeleteMut.isPending}
            >
              {bulkDeleteMut.isPending ? "Deleting…" : `Delete ${selectedIds.size} inquiries`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageInquiries;

