import { useRef, useState } from "react";
import { Plus, Pencil, Trash2, Image, Upload, Eye, EyeOff, GripVertical, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import heroImg from "@/assets/hero-grains.jpg";

type SlideItem = {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  caption: string;
  cta_primary: string;
  cta_secondary: string;
  image_preview: string;
  sort_order: number;
  active: boolean;
};

const initialSlides: SlideItem[] = [
  {
    id: 1,
    title: "Fresh Grains,\nFair Prices",
    subtitle: "Reliable grain supply for homes, retailers, and institutions across Dar es Salaam and beyond.",
    badge: "Quality Assured",
    caption: "Sourced from Tanzania's finest paddy fields",
    cta_primary: "Explore Products",
    cta_secondary: "Get a Quote",
    image_preview: heroImg,
    sort_order: 1,
    active: true,
  },
];

const emptyForm = (): Omit<SlideItem, "id" | "sort_order"> => ({
  title: "",
  subtitle: "",
  badge: "",
  caption: "",
  cta_primary: "",
  cta_secondary: "",
  image_preview: "",
  active: true,
});

const ManageSlider = () => {
  const { hasPermission } = useAuth();
  const canEdit = hasPermission("manage-slider");

  const [slides, setSlides] = useState<SlideItem[]>(initialSlides);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editing, setEditing] = useState<SlideItem | null>(null);
  const [form, setForm] = useState<Omit<SlideItem, "id" | "sort_order">>(emptyForm());
  const [isSaving, setIsSaving] = useState(false);
  const [preview, setPreview] = useState<SlideItem | null>(slides[0] ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      image_preview: s.image_preview,
      active: s.active,
    });
    setDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm((f) => ({ ...f, image_preview: url }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));

    if (editing) {
      setSlides((prev) =>
        prev.map((s) => (s.id === editing.id ? { ...s, ...form } : s)),
      );
    } else {
      const newId = Math.max(0, ...slides.map((s) => s.id)) + 1;
      const newSlide: SlideItem = { id: newId, ...form, sort_order: slides.length + 1 };
      setSlides((prev) => [...prev, newSlide]);
    }

    setIsSaving(false);
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setSlides((prev) =>
      prev.filter((s) => s.id !== id).map((s, i) => ({ ...s, sort_order: i + 1 })),
    );
    if (preview?.id === id) setPreview(null);
    setDeleteId(null);
  };

  const toggleActive = (id: number) => {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
  };

  const moveUp = (id: number) => {
    setSlides((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx <= 0) return prev;
      const arr = [...prev];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return arr.map((s, i) => ({ ...s, sort_order: i + 1 }));
    });
  };

  const moveDown = (id: number) => {
    setSlides((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx >= prev.length - 1) return prev;
      const arr = [...prev];
      [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      return arr.map((s, i) => ({ ...s, sort_order: i + 1 }));
    });
  };

  const field = (key: keyof typeof form) => ({
    value: String(form[key] ?? ""),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const isValid = form.title.trim() && form.image_preview;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hero Slider</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage hero section images and text on the landing page</p>
        </div>
        {canEdit && (
          <Button onClick={openCreate} className="gap-2">
            <Plus size={15} /> Add Slide
          </Button>
        )}
      </div>

      {/* Preview */}
      {preview && (
        <Card className="overflow-hidden border-border/60">
          <div className="border-b border-border/60 px-5 py-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Live Preview</p>
            <div className="flex gap-2">
              {slides.filter((s) => s.active).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setPreview(s)}
                  className={`h-2 rounded-full transition-all ${preview.id === s.id ? "w-6 bg-primary" : "w-2 bg-muted-foreground/40"}`}
                />
              ))}
            </div>
          </div>
          <div className="relative h-52 sm:h-72 bg-secondary overflow-hidden">
            {preview.image_preview && (
              <img src={preview.image_preview} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/70 to-transparent" />
            <div className="relative z-10 flex h-full flex-col justify-center px-8">
              {preview.badge && (
                <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur">
                  <Sparkles size={11} className="text-accent" />
                  {preview.badge}
                </div>
              )}
              <h2 className="text-2xl sm:text-4xl font-bold text-white leading-tight whitespace-pre-line">
                {preview.title}
              </h2>
              <p className="mt-3 max-w-sm text-sm text-white/70 leading-relaxed">{preview.subtitle}</p>
              <div className="mt-5 flex gap-3">
                {preview.cta_primary && (
                  <span className="rounded-full bg-secondary px-5 py-2 text-xs font-semibold text-white border border-white/20">
                    {preview.cta_primary}
                  </span>
                )}
                {preview.cta_secondary && (
                  <span className="rounded-full border border-white/30 px-5 py-2 text-xs font-semibold text-white/80">
                    {preview.cta_secondary}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Slide list */}
      <div className="space-y-3">
        {slides.map((slide, idx) => (
          <Card key={slide.id} className={`surface-panel border-border/60 ${!slide.active ? "opacity-60" : ""}`}>
            <CardContent className="flex items-center gap-4 p-4">
              {canEdit && (
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => moveUp(slide.id)}
                    disabled={idx === 0}
                    className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs hover:bg-muted/50 transition-colors"
                  >
                    ▲
                  </button>
                  <GripVertical size={13} className="text-muted-foreground/40 mx-auto" />
                  <button
                    onClick={() => moveDown(slide.id)}
                    disabled={idx === slides.length - 1}
                    className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs hover:bg-muted/50 transition-colors"
                  >
                    ▼
                  </button>
                </div>
              )}

              {slide.image_preview ? (
                <div
                  className="h-14 w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-border/60 hover:opacity-80 transition-opacity"
                  onClick={() => setPreview(slide)}
                >
                  <img src={slide.image_preview} alt="" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="h-14 w-20 shrink-0 flex items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/30 text-muted-foreground/40">
                  <Image size={18} />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">{slide.title.replace(/\n/g, " ")}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{slide.subtitle}</p>
                <p className="text-[11px] text-muted-foreground/60 mt-1">Slide {slide.sort_order}</p>
              </div>

              {canEdit && (
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    title={slide.active ? "Deactivate" : "Activate"}
                    onClick={() => toggleActive(slide.id)}
                  >
                    {slide.active ? <Eye size={14} /> : <EyeOff size={14} />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => openEdit(slide)}
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteId(slide.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {slides.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border/60 py-16 text-center text-muted-foreground">
            <Image size={28} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">No slides yet</p>
            {canEdit && (
              <Button variant="link" onClick={openCreate} className="mt-2 text-xs">Add the first slide</Button>
            )}
          </div>
        )}
      </div>

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Image size={16} className="text-primary" />
              {editing ? "Edit Slide" : "Add Slide"}
            </DialogTitle>
            <DialogDescription>Configure the hero slide content and image.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Image upload */}
            <div className="space-y-2">
              <Label>Hero Image <span className="text-destructive">*</span></Label>
              <div
                className="relative flex h-40 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border/60 bg-muted/30 hover:border-primary/40 hover:bg-primary/5 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {form.image_preview ? (
                  <>
                    <img src={form.image_preview} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                      <Upload size={20} className="text-white" />
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Upload size={22} className="mx-auto mb-2" />
                    <p className="text-xs font-medium">Click to upload hero image</p>
                    <p className="text-[11px] mt-0.5">Recommended: 1920×1080px or wider</p>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Headline / Title <span className="text-destructive">*</span></Label>
              <Textarea placeholder={"e.g. Fresh Grains,\nFair Prices"} className="min-h-16 resize-none font-medium" {...field("title")} />
              <p className="text-[11px] text-muted-foreground">Use a new line for a line break in the headline.</p>
            </div>

            <div className="space-y-2">
              <Label>Subtitle / Description</Label>
              <Textarea placeholder="Brief supporting description…" className="min-h-16 resize-none" {...field("subtitle")} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Badge Text</Label>
                <Input placeholder="e.g. Quality Assured" {...field("badge")} />
              </div>
              <div className="space-y-2">
                <Label>Image Caption</Label>
                <Input placeholder="e.g. Sourced from Tanzania…" {...field("caption")} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Primary CTA Button</Label>
                <Input placeholder="e.g. Explore Products" {...field("cta_primary")} />
              </div>
              <div className="space-y-2">
                <Label>Secondary CTA Button</Label>
                <Input placeholder="e.g. Get a Quote" {...field("cta_secondary")} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="slide-active"
                checked={form.active}
                onCheckedChange={(v) => setForm((f) => ({ ...f, active: !!v }))}
              />
              <label htmlFor="slide-active" className="text-sm cursor-pointer">Active (visible on website)</label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!isValid || isSaving}>
              {isSaving ? "Saving…" : editing ? "Save Changes" : "Add Slide"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Slide</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this slide from the hero section. This action cannot be undone.
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

export default ManageSlider;
