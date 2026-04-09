import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical, Sparkles, RefreshCw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { fetchSiteSettings, updateSiteSettings } from "@/lib/adminApi";
import heroImg from "@/assets/hero-grains.jpg";
import { cn } from "@/lib/utils";

type SlideItem = {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  caption: string;
  cta_primary: string;
  cta_secondary: string;
  image_key: string;
  sort_order: number;
  active: boolean;
};

const emptyForm = (): Omit<SlideItem, "id" | "sort_order"> => ({
  title: "",
  subtitle: "",
  badge: "",
  caption: "",
  cta_primary: "Explore Products",
  cta_secondary: "Get a Quote",
  image_key: "hero",
  active: true,
});

const rawToSlides = (raw: unknown[]): SlideItem[] =>
  raw.map((r, i) => {
    const s = r as Record<string, unknown>;
    return {
      id: i + 1,
      title: String(s.title ?? ""),
      subtitle: String(s.subtitle ?? ""),
      badge: String(s.badge ?? ""),
      caption: String(s.caption ?? ""),
      cta_primary: String(s.cta_primary ?? ""),
      cta_secondary: String(s.cta_secondary ?? ""),
      image_key: String(s.image_key ?? "hero"),
      sort_order: typeof s.sort_order === "number" ? s.sort_order : i + 1,
      active: s.active !== false,
    };
  });

const slidesToRaw = (slides: SlideItem[]) =>
  slides.map((s) => ({
    title: s.title,
    subtitle: s.subtitle,
    badge: s.badge,
    caption: s.caption,
    cta_primary: s.cta_primary,
    cta_secondary: s.cta_secondary,
    image_key: s.image_key,
    sort_order: s.sort_order,
    active: s.active,
  }));

const ManageSlider = () => {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const canEdit = hasPermission("manage-slider");

  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editing, setEditing] = useState<SlideItem | null>(null);
  const [form, setForm] = useState<Omit<SlideItem, "id" | "sort_order">>(emptyForm());
  const [preview, setPreview] = useState<SlideItem | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const { data: settingsData, isLoading, refetch } = useQuery({
    queryKey: ["admin", "site-settings"],
    queryFn: fetchSiteSettings,
  });

  useEffect(() => {
    const raw = settingsData?.data?.hero_slides;
    if (Array.isArray(raw)) {
      const loaded = rawToSlides(raw);
      setSlides(loaded);
      setPreview((prev) => loaded.find((s) => s.id === prev?.id) ?? loaded[0] ?? null);
    }
    setIsDirty(false);
  }, [settingsData]);

  const saveMutation = useMutation({
    mutationFn: (heroSlides: ReturnType<typeof slidesToRaw>) =>
      updateSiteSettings({ hero_slides: heroSlides }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "site-settings"] });
      qc.invalidateQueries({ queryKey: ["site-content"] });
      setIsDirty(false);
      toast({ title: "Saved", description: "Hero slider updated and live on the website." });
    },
    onError: (err: Error) =>
      toast({ title: "Save failed", description: err.message, variant: "destructive" }),
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (s: SlideItem) => {
    setEditing(s);
    setForm({
      title: s.title,
      subtitle: s.subtitle,
      badge: s.badge,
      caption: s.caption,
      cta_primary: s.cta_primary,
      cta_secondary: s.cta_secondary,
      image_key: s.image_key,
      active: s.active,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      setSlides((prev) =>
        prev.map((s) => (s.id === editing.id ? { ...s, ...form } : s)),
      );
    } else {
      const newId = Math.max(0, ...slides.map((s) => s.id)) + 1;
      const newSlide: SlideItem = { id: newId, ...form, sort_order: slides.length + 1 };
      setSlides((prev) => {
        const updated = [...prev, newSlide];
        setPreview(newSlide);
        return updated;
      });
    }
    setIsDirty(true);
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setSlides((prev) => {
      const updated = prev.filter((s) => s.id !== id).map((s, i) => ({ ...s, sort_order: i + 1 }));
      if (preview?.id === id) setPreview(updated[0] ?? null);
      return updated;
    });
    setIsDirty(true);
    setDeleteId(null);
  };

  const toggleActive = (id: number) => {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
    setIsDirty(true);
  };

  const moveUp = (id: number) => {
    setSlides((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx <= 0) return prev;
      const arr = [...prev];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return arr.map((s, i) => ({ ...s, sort_order: i + 1 }));
    });
    setIsDirty(true);
  };

  const moveDown = (id: number) => {
    setSlides((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx >= prev.length - 1) return prev;
      const arr = [...prev];
      [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      return arr.map((s, i) => ({ ...s, sort_order: i + 1 }));
    });
    setIsDirty(true);
  };

  const field = (key: keyof typeof form) => ({
    value: key === "active" ? undefined : String(form[key] ?? ""),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const isValid = form.title.trim().length > 0;

  const previewSlide = preview ?? slides[0] ?? null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hero Slider</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage the hero section text on the landing page — changes are saved to the database and appear live.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => refetch()}>
            <RefreshCw size={13} /> Refresh
          </Button>
          {canEdit && isDirty && (
            <Button className="gap-2" onClick={() => saveMutation.mutate(slidesToRaw(slides))} disabled={saveMutation.isPending}>
              <Save size={14} /> {saveMutation.isPending ? "Saving…" : "Save Changes"}
            </Button>
          )}
          {canEdit && !isDirty && (
            <Button onClick={openCreate} className="gap-2">
              <Plus size={14} /> Add Slide
            </Button>
          )}
        </div>
      </div>

      {isDirty && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
          <Sparkles size={14} />
          <span className="flex-1">You have unsaved changes. Click <strong>Save Changes</strong> to publish to the website.</span>
          <Button size="sm" className="gap-1.5 h-7 text-xs" onClick={() => saveMutation.mutate(slidesToRaw(slides))} disabled={saveMutation.isPending}>
            <Save size={12} /> Save
          </Button>
        </div>
      )}

      {/* Hero preview */}
      {isLoading ? (
        <Skeleton className="h-52 w-full rounded-2xl" />
      ) : previewSlide ? (
        <Card className="overflow-hidden border-border/60">
          <div className="border-b border-border/60 px-5 py-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Live Preview · Slide {previewSlide.sort_order}</p>
            <div className="flex gap-2">
              {slides.filter((s) => s.active).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setPreview(s)}
                  className={cn("h-2 rounded-full transition-all", preview?.id === s.id ? "w-6 bg-primary" : "w-2 bg-muted-foreground/40")}
                />
              ))}
            </div>
          </div>
          <div className="relative h-52 sm:h-72 bg-secondary overflow-hidden">
            <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
            <div className="absolute inset-0 flex flex-col items-start justify-end p-6 sm:p-8">
              {previewSlide.badge && (
                <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur">
                  <Sparkles size={11} className="text-accent" />
                  {previewSlide.badge}
                </span>
              )}
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight whitespace-pre-line">{previewSlide.title}</h2>
              {previewSlide.subtitle && (
                <p className="mt-2 max-w-lg text-sm text-white/75 leading-relaxed line-clamp-2">{previewSlide.subtitle}</p>
              )}
              {previewSlide.caption && (
                <p className="mt-3 text-xs text-white/50">{previewSlide.caption}</p>
              )}
              {(previewSlide.cta_primary || previewSlide.cta_secondary) && (
                <div className="mt-4 flex gap-3">
                  {previewSlide.cta_primary && (
                    <span className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground">{previewSlide.cta_primary}</span>
                  )}
                  {previewSlide.cta_secondary && (
                    <span className="inline-flex items-center rounded-full border border-white/30 px-4 py-2 text-xs font-semibold text-white/80">{previewSlide.cta_secondary}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      ) : null}

      {/* Slide list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
      ) : slides.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 py-16 text-center">
          <Sparkles size={32} className="text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">No slides yet</p>
          {canEdit && (
            <Button variant="link" size="sm" className="mt-2 text-xs" onClick={openCreate}>Add your first slide</Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {slides.map((slide, idx) => (
            <Card key={slide.id} className={cn("border-border/60 transition-all", !slide.active && "opacity-60")}>
              <CardContent className="flex items-start gap-4 p-4">
                <div className="flex flex-col gap-1 mt-1">
                  <button onClick={() => moveUp(slide.id)} disabled={idx === 0 || !canEdit} className="disabled:opacity-30 hover:text-primary">
                    <GripVertical size={14} className="rotate-90" />
                  </button>
                  <button onClick={() => moveDown(slide.id)} disabled={idx === slides.length - 1 || !canEdit} className="disabled:opacity-30 hover:text-primary">
                    <GripVertical size={14} className="rotate-90 scale-y-[-1]" />
                  </button>
                </div>

                <button
                  onClick={() => setPreview(slide)}
                  className={cn("relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all", preview?.id === slide.id ? "border-primary" : "border-border/60")}
                >
                  <img src={heroImg} alt="" className="h-full w-full object-cover opacity-60" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Eye size={14} className="text-white" />
                  </span>
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-sm text-foreground truncate">{slide.title || "Untitled"}</p>
                    {slide.badge && (
                      <span className="inline-flex items-center rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
                        {slide.badge}
                      </span>
                    )}
                    {!slide.active && (
                      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        Hidden
                      </span>
                    )}
                  </div>
                  {slide.subtitle && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{slide.subtitle}</p>
                  )}
                  <p className="text-[11px] text-muted-foreground/60 mt-1">Slide {slide.sort_order}</p>
                </div>

                {canEdit && (
                  <div className="flex shrink-0 items-center gap-1">
                    <Switch
                      checked={slide.active}
                      onCheckedChange={() => toggleActive(slide.id)}
                      className="scale-75"
                    />
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(slide)}>
                      <Pencil size={13} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(slide.id)}>
                      <Trash2 size={13} />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info card */}
      <Card className="border-border/60 bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">About the Hero Slider</CardTitle>
          <CardDescription>
            Each slide controls the text content shown in the hero section of the landing page. Changes are saved to the database and appear live after clicking <strong>Save Changes</strong>. The background image is managed separately.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={(o) => !o && setDialogOpen(false)}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Slide" : "Add Slide"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update the hero slide content." : "Add a new hero slide. Save all changes when done."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Title <span className="text-destructive">*</span></Label>
              <Input placeholder="Fresh Grains, Fair Prices" {...field("title")} />
            </div>
            <div className="space-y-1.5">
              <Label>Subtitle</Label>
              <Textarea className="min-h-[70px] resize-none" placeholder="Supporting text below the title…" {...field("subtitle")} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Badge text</Label>
                <Input placeholder="Quality Assured" {...field("badge")} />
              </div>
              <div className="space-y-1.5">
                <Label>Caption</Label>
                <Input placeholder="Sourced from Tanzania's fields" {...field("caption")} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Primary CTA</Label>
                <Input placeholder="Explore Products" {...field("cta_primary")} />
              </div>
              <div className="space-y-1.5">
                <Label>Secondary CTA</Label>
                <Input placeholder="Get a Quote" {...field("cta_secondary")} />
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
              <Switch
                checked={form.active}
                onCheckedChange={(v) => setForm((f) => ({ ...f, active: v }))}
              />
              <div>
                <p className="text-sm font-medium">{form.active ? "Active" : "Hidden"}</p>
                <p className="text-xs text-muted-foreground">
                  {form.active ? "Slide will be shown on the landing page" : "Slide is hidden from visitors"}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!isValid}>
              {editing ? "Update" : "Add Slide"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Slide?</AlertDialogTitle>
            <AlertDialogDescription>This will remove the slide. Click Save Changes to make it permanent.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => deleteId && handleDelete(deleteId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageSlider;
