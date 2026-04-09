import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Star, GripVertical, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  fetchAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  reorderTestimonials,
} from "@/lib/adminApi";

type Testimonial = {
  id: number;
  name: string;
  role_en: string;
  role_sw: string;
  quote_en: string;
  quote_sw: string;
  sort_order: number;
};

const emptyForm = (): Omit<Testimonial, "id" | "sort_order"> => ({
  name: "",
  role_en: "",
  role_sw: "",
  quote_en: "",
  quote_sw: "",
});

const ManageTestimonials = () => {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const canEdit = hasPermission("manage-testimonials");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(emptyForm());

  const query = useQuery({
    queryKey: ["admin", "testimonials"],
    queryFn: fetchAdminTestimonials,
  });

  const testimonials: Testimonial[] = (query.data?.data ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    quote_en: t.quote,
    quote_sw: (t.translations as Record<string, Record<string, string>> | null)?.sw?.quote ?? "",
    role_en: t.role ?? "",
    role_sw: (t.translations as Record<string, Record<string, string>> | null)?.sw?.role ?? "",
    sort_order: t.sort_order,
  }));

  const onSuccess = () => qc.invalidateQueries({ queryKey: ["admin", "testimonials"] });
  const onError = (err: Error) =>
    toast({ title: "Error", description: err.message, variant: "destructive" });

  const createMutation = useMutation({
    mutationFn: (body: Parameters<typeof createTestimonial>[0]) => createTestimonial(body),
    onSuccess,
    onError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: Parameters<typeof updateTestimonial>[1] }) =>
      updateTestimonial(id, body),
    onSuccess,
    onError,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTestimonial(id),
    onSuccess,
    onError,
  });

  const reorderMutation = useMutation({
    mutationFn: (order: number[]) => reorderTestimonials(order),
    onSuccess,
    onError,
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ name: t.name, role_en: t.role_en, role_sw: t.role_sw, quote_en: t.quote_en, quote_sw: t.quote_sw });
    setDialogOpen(true);
  };

  const handleSave = () => {
    const body = {
      quote: form.quote_en,
      name: form.name,
      role: form.role_en,
      translations: { sw: { quote: form.quote_sw, role: form.role_sw } },
    };
    if (editing) {
      updateMutation.mutate({ id: editing.id, body }, { onSuccess: () => setDialogOpen(false) });
    } else {
      createMutation.mutate(body, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
    setDeleteId(null);
  };

  const moveUp = (id: number) => {
    const idx = testimonials.findIndex((t) => t.id === id);
    if (idx <= 0) return;
    const arr = [...testimonials];
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    reorderMutation.mutate(arr.map((t) => t.id));
  };

  const moveDown = (id: number) => {
    const idx = testimonials.findIndex((t) => t.id === id);
    if (idx >= testimonials.length - 1) return;
    const arr = [...testimonials];
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
    reorderMutation.mutate(arr.map((t) => t.id));
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const isValid = form.name.trim() && form.role_en.trim() && form.quote_en.trim();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Testimonials</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage customer testimonials shown in the carousel</p>
        </div>
        {canEdit && (
          <Button onClick={openCreate} className="gap-2">
            <Plus size={15} /> Add Testimonial
          </Button>
        )}
      </div>

      {query.isError && (
        <p className="text-destructive text-sm">{(query.error as Error)?.message}</p>
      )}

      <div className="space-y-3">
        {query.isLoading ? (
          <>
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </>
        ) : testimonials.map((t, idx) => (
          <Card key={t.id} className="surface-panel border-border/60">
            <CardContent className="flex items-start gap-4 p-5">
              {canEdit && (
                <div className="flex flex-col gap-1 pt-1 shrink-0">
                  <button
                    onClick={() => moveUp(t.id)}
                    disabled={idx === 0}
                    className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground disabled:opacity-30 hover:bg-muted/50 transition-colors"
                  >
                    ▲
                  </button>
                  <GripVertical size={14} className="text-muted-foreground/40 mx-auto" />
                  <button
                    onClick={() => moveDown(t.id)}
                    disabled={idx === testimonials.length - 1}
                    className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground disabled:opacity-30 hover:bg-muted/50 transition-colors"
                  >
                    ▼
                  </button>
                </div>
              )}

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <Quote size={18} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <span className="text-xs text-muted-foreground bg-muted/60 rounded-full px-2 py-0.5">{t.role_en}</span>
                  <span className="text-[10px] font-semibold text-primary bg-primary/8 rounded-full px-2 py-0.5">#{t.sort_order}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">"{t.quote_en}"</p>
                {t.quote_sw && (
                  <p className="mt-1 text-xs text-muted-foreground/70 italic line-clamp-1">SW: "{t.quote_sw}"</p>
                )}
              </div>

              {canEdit && (
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => openEdit(t)}>
                    <Pencil size={14} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setDeleteId(t.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {testimonials.length === 0 && !query.isLoading && (
          <div className="rounded-2xl border border-dashed border-border/60 py-16 text-center text-muted-foreground">
            <Star size={28} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">No testimonials yet</p>
            {canEdit && <Button variant="link" onClick={openCreate} className="mt-2 text-xs">Add the first one</Button>}
          </div>
        )}
      </div>

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star size={16} className="text-primary" />
              {editing ? "Edit Testimonial" : "Add Testimonial"}
            </DialogTitle>
            <DialogDescription>
              {editing ? "Update the testimonial details below." : "Fill in the testimonial details. Swahili fields are optional."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer / Company Name</Label>
                <Input placeholder="e.g. Retail Partner" {...field("name")} />
              </div>
              <div className="space-y-2">
                <Label>Role (English)</Label>
                <Input placeholder="e.g. Mini-market buyer" {...field("role_en")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Role (Swahili) <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Input placeholder="e.g. Mnunuzi wa mini-market" {...field("role_sw")} />
            </div>
            <div className="space-y-2">
              <Label>Quote (English) <span className="text-destructive">*</span></Label>
              <Textarea placeholder="What they said about MILOHA…" className="min-h-24 resize-none" {...field("quote_en")} />
            </div>
            <div className="space-y-2">
              <Label>Quote (Swahili) <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Textarea placeholder="Swahili translation…" className="min-h-24 resize-none" {...field("quote_sw")} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!isValid || isSaving}>
              {isSaving ? "Saving…" : editing ? "Save Changes" : "Add Testimonial"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this testimonial from the website carousel. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteId !== null && handleDelete(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageTestimonials;
