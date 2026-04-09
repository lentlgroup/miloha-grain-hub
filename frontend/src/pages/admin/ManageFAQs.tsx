import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, HelpCircle, GripVertical } from "lucide-react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  fetchAdminFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  reorderFaqs,
} from "@/lib/adminApi";

type Faq = {
  id: number;
  question_en: string;
  question_sw: string;
  answer_en: string;
  answer_sw: string;
  sort_order: number;
};

const emptyForm = () => ({
  question_en: "",
  question_sw: "",
  answer_en: "",
  answer_sw: "",
});

const ManageFAQs = () => {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const canEdit = hasPermission("manage-faqs");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [form, setForm] = useState(emptyForm());

  const query = useQuery({
    queryKey: ["admin", "faqs"],
    queryFn: fetchAdminFaqs,
  });

  const faqs: Faq[] = (query.data?.data ?? []).map((f) => ({
    id: f.id,
    question_en: f.question,
    question_sw: (f.translations as Record<string, Record<string, string>> | null)?.sw?.question ?? "",
    answer_en: f.answer,
    answer_sw: (f.translations as Record<string, Record<string, string>> | null)?.sw?.answer ?? "",
    sort_order: f.sort_order,
  }));

  const onSuccess = () => {
    qc.invalidateQueries({ queryKey: ["admin", "faqs"] });
    qc.invalidateQueries({ queryKey: ["site-content"] });
  };
  const onError = (err: Error) =>
    toast({ title: "Error", description: err.message, variant: "destructive" });

  const createMutation = useMutation({
    mutationFn: (body: Parameters<typeof createFaq>[0]) => createFaq(body),
    onSuccess,
    onError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: Parameters<typeof updateFaq>[1] }) =>
      updateFaq(id, body),
    onSuccess,
    onError,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteFaq(id),
    onSuccess,
    onError,
  });

  const reorderMutation = useMutation({
    mutationFn: (order: number[]) => reorderFaqs(order),
    onSuccess,
    onError,
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (faq: Faq) => {
    setEditing(faq);
    setForm({
      question_en: faq.question_en,
      question_sw: faq.question_sw,
      answer_en: faq.answer_en,
      answer_sw: faq.answer_sw,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    const body = {
      question: form.question_en,
      answer: form.answer_en,
      translations: { sw: { question: form.question_sw, answer: form.answer_sw } },
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
    const idx = faqs.findIndex((f) => f.id === id);
    if (idx <= 0) return;
    const arr = [...faqs];
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    reorderMutation.mutate(arr.map((f) => f.id));
  };

  const moveDown = (id: number) => {
    const idx = faqs.findIndex((f) => f.id === id);
    if (idx >= faqs.length - 1) return;
    const arr = [...faqs];
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
    reorderMutation.mutate(arr.map((f) => f.id));
  };

  const field = (key: keyof ReturnType<typeof emptyForm>) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const isValid = form.question_en.trim() && form.answer_en.trim();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">FAQs</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage frequently asked questions on the landing page</p>
        </div>
        {canEdit && (
          <Button onClick={openCreate} className="gap-2">
            <Plus size={15} /> Add FAQ
          </Button>
        )}
      </div>

      {query.isError && (
        <p className="text-destructive text-sm">{(query.error as Error)?.message}</p>
      )}

      {/* Preview accordion */}
      <Card className="surface-panel border-border/60">
        <CardContent className="p-0">
          <div className="border-b border-border/60 px-5 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Website Preview</p>
          </div>
          <Accordion type="multiple" className="px-5">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={String(faq.id)} className="border-border/60">
                <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
                  {faq.question_en}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {faq.answer_en}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* FAQ list */}
      <div className="space-y-3">
        {query.isLoading ? (
          <>
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </>
        ) : faqs.map((faq, idx) => (
          <Card key={faq.id} className="surface-panel border-border/60">
            <CardContent className="flex items-start gap-4 p-5">
              {canEdit && (
                <div className="flex flex-col gap-1 pt-1 shrink-0">
                  <button
                    onClick={() => moveUp(faq.id)}
                    disabled={idx === 0}
                    className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground disabled:opacity-30 hover:bg-muted/50 transition-colors"
                  >
                    ▲
                  </button>
                  <GripVertical size={14} className="text-muted-foreground/40 mx-auto" />
                  <button
                    onClick={() => moveDown(faq.id)}
                    disabled={idx === faqs.length - 1}
                    className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground disabled:opacity-30 hover:bg-muted/50 transition-colors"
                  >
                    ▼
                  </button>
                </div>
              )}

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <HelpCircle size={17} className="text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm leading-snug">{faq.question_en}</p>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{faq.answer_en}</p>
                {faq.question_sw && (
                  <p className="mt-1 text-xs text-muted-foreground/60 italic line-clamp-1">SW: {faq.question_sw}</p>
                )}
              </div>

              {canEdit && (
                <div className="flex gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => openEdit(faq)}
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteId(faq.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {faqs.length === 0 && !query.isLoading && (
          <div className="rounded-2xl border border-dashed border-border/60 py-16 text-center text-muted-foreground">
            <HelpCircle size={28} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">No FAQs yet</p>
            {canEdit && (
              <Button variant="link" onClick={openCreate} className="mt-2 text-xs">
                Add the first FAQ
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle size={16} className="text-primary" />
              {editing ? "Edit FAQ" : "Add FAQ"}
            </DialogTitle>
            <DialogDescription>
              {editing ? "Update the FAQ details below." : "Add a new question and answer. Swahili fields are optional."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Question (English) <span className="text-destructive">*</span></Label>
              <Input placeholder="e.g. Do you support bulk orders?" {...field("question_en")} />
            </div>
            <div className="space-y-2">
              <Label>Question (Swahili) <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Input placeholder="Swahili version…" {...field("question_sw")} />
            </div>
            <div className="space-y-2">
              <Label>Answer (English) <span className="text-destructive">*</span></Label>
              <Textarea placeholder="Detailed answer…" className="min-h-28 resize-none" {...field("answer_en")} />
            </div>
            <div className="space-y-2">
              <Label>Answer (Swahili) <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Textarea placeholder="Swahili translation…" className="min-h-28 resize-none" {...field("answer_sw")} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!isValid || isSaving}>
              {isSaving ? "Saving…" : editing ? "Save Changes" : "Add FAQ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete FAQ</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this FAQ from the website. This action cannot be undone.
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

export default ManageFAQs;
