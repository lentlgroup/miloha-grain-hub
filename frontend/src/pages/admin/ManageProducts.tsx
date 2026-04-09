import { useRef, useState } from "react";
import { Plus, Pencil, Trash2, Package, Upload, X, Tag, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import riceImg from "@/assets/product-rice.jpg";
import maizeImg from "@/assets/product-maize.jpg";
import beansImg from "@/assets/product-beans.jpg";
import packagedImg from "@/assets/product-packaged.jpg";

type Category = "retail" | "wholesale" | "packaged" | "bulk";

type Product = {
  id: string;
  name_en: string;
  name_sw: string;
  desc_en: string;
  desc_sw: string;
  tag_en: string;
  tag_sw: string;
  categories: Category[];
  sizes: string;
  image_key: string;
  image_preview: string;
  sort_order: number;
  published: boolean;
};

const categoryOptions: { value: Category; label: string }[] = [
  { value: "retail", label: "Retail" },
  { value: "wholesale", label: "Wholesale" },
  { value: "packaged", label: "Packaged" },
  { value: "bulk", label: "Bulk" },
];

const initialProducts: Product[] = [
  {
    id: "rice",
    name_en: "Premium Rice",
    name_sw: "Mchele Bora",
    desc_en: "Grade A polished and unpolished rice varieties sourced from Tanzania's finest paddy fields.",
    desc_sw: "Aina za mchele wa daraja la A uliokobolewa na usiokobolewa kutoka mashamba bora ya mpunga Tanzania.",
    tag_en: "Best Seller",
    tag_sw: "Inayouzwa Sana",
    categories: ["retail", "wholesale", "bulk"],
    sizes: "1kg, 5kg, 25kg, 50kg",
    image_key: "rice",
    image_preview: riceImg,
    sort_order: 1,
    published: true,
  },
  {
    id: "maize",
    name_en: "Quality Maize",
    name_sw: "Mahindi Bora",
    desc_en: "Clean, dried and sorted maize kernels ideal for ugali, flour milling, and animal feed.",
    desc_sw: "Mahindi safi, yaliyokaushwa na kuchambuliwa yanayofaa kwa ugali, kusaga unga, na chakula cha mifugo.",
    tag_en: "Popular",
    tag_sw: "Maarufu",
    categories: ["retail", "wholesale", "bulk"],
    sizes: "5kg, 25kg, 50kg",
    image_key: "maize",
    image_preview: maizeImg,
    sort_order: 2,
    published: true,
  },
  {
    id: "beans",
    name_en: "Mixed Beans",
    name_sw: "Maharage Mchanganyiko",
    desc_en: "Nutritious bean varieties - kidney, soy, black, and mixed - rich in protein and fiber.",
    desc_sw: "Aina mbalimbali za maharage kama red kidney, soya, black, na mchanganyiko zenye protini na nyuzi nyingi.",
    tag_en: "Nutritious",
    tag_sw: "Yenye Lishe",
    categories: ["retail", "wholesale"],
    sizes: "1kg, 5kg, 25kg",
    image_key: "beans",
    image_preview: beansImg,
    sort_order: 3,
    published: true,
  },
  {
    id: "packaged",
    name_en: "Packaged Products",
    name_sw: "Bidhaa Zilizofungashwa",
    desc_en: "Branded MILOHA packaged grains ready for retail shelves, available in 1kg, 5kg, and 25kg bags.",
    desc_sw: "Nafaka za MILOHA zilizofungashwa tayari kwa rafu za maduka, zinapatikana katika mifuko ya 1kg, 5kg, na 25kg.",
    tag_en: "New",
    tag_sw: "Mpya",
    categories: ["packaged", "retail", "wholesale"],
    sizes: "1kg, 5kg, 25kg",
    image_key: "packaged",
    image_preview: packagedImg,
    sort_order: 4,
    published: true,
  },
];

const emptyForm = (): Omit<Product, "id" | "sort_order"> => ({
  name_en: "",
  name_sw: "",
  desc_en: "",
  desc_sw: "",
  tag_en: "",
  tag_sw: "",
  categories: [],
  sizes: "",
  image_key: "",
  image_preview: "",
  published: true,
});

const ManageProducts = () => {
  const { hasPermission } = useAuth();
  const canEdit = hasPermission("manage-products");

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id" | "sort_order">>(emptyForm());
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name_en: p.name_en,
      name_sw: p.name_sw,
      desc_en: p.desc_en,
      desc_sw: p.desc_sw,
      tag_en: p.tag_en,
      tag_sw: p.tag_sw,
      categories: p.categories,
      sizes: p.sizes,
      image_key: p.image_key,
      image_preview: p.image_preview,
      published: p.published,
    });
    setDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm((f) => ({ ...f, image_preview: url, image_key: file.name.replace(/\.[^/.]+$/, "") }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));

    if (editing) {
      setProducts((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...form } : p)));
    } else {
      const newId = form.name_en.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
      setProducts((prev) => [...prev, { id: newId, ...form, sort_order: prev.length + 1 }]);
    }

    setIsSaving(false);
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setProducts((prev) =>
      prev.filter((p) => p.id !== id).map((p, i) => ({ ...p, sort_order: i + 1 })),
    );
    setDeleteId(null);
  };

  const togglePublished = (id: string) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, published: !p.published } : p)));
  };

  const toggleCategory = (cat: Category) => {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter((c) => c !== cat)
        : [...f.categories, cat],
    }));
  };

  const field = (key: keyof typeof form) => ({
    value: String(form[key] ?? ""),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const isValid = form.name_en.trim() && form.desc_en.trim() && form.categories.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage grain products displayed on the landing page</p>
        </div>
        {canEdit && (
          <Button onClick={openCreate} className="gap-2">
            <Plus size={15} /> Add Product
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        {products.map((p) => (
          <Card key={p.id} className="surface-panel border-border/60 overflow-hidden">
            <div className="relative h-40 bg-muted">
              {p.image_preview ? (
                <img src={p.image_preview} alt={p.name_en} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground/40">
                  <Package size={40} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <p className="text-sm font-bold text-white leading-tight">{p.name_en}</p>
                  <p className="text-xs text-white/70">{p.name_sw}</p>
                </div>
                {p.tag_en && (
                  <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold text-accent-foreground">
                    {p.tag_en}
                  </span>
                )}
              </div>
              {!p.published && (
                <div className="absolute top-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white/80">
                  Draft
                </div>
              )}
            </div>

            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{p.desc_en}</p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {p.categories.map((cat) => (
                  <Badge key={cat} variant="outline" className="text-[10px] capitalize">
                    {cat}
                  </Badge>
                ))}
              </div>

              <p className="text-xs text-muted-foreground mb-4">
                <span className="font-medium text-foreground">Sizes: </span>{p.sizes}
              </p>

              {canEdit && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs" onClick={() => openEdit(p)}>
                    <Pencil size={12} /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5 text-xs"
                    onClick={() => togglePublished(p.id)}
                  >
                    <Eye size={12} /> {p.published ? "Unpublish" : "Publish"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteId(p.id)}
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package size={16} className="text-primary" />
              {editing ? "Edit Product" : "Add Product"}
            </DialogTitle>
            <DialogDescription>
              Swahili fields are optional but recommended for bilingual support.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Image upload */}
            <div className="space-y-2">
              <Label>Product Image</Label>
              <div
                className="relative flex h-36 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border/60 bg-muted/30 hover:border-primary/40 hover:bg-primary/5 transition-colors"
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
                    <p className="text-xs font-medium">Click to upload image</p>
                    <p className="text-[11px] mt-0.5">JPG, PNG, WebP up to 5MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name (English) <span className="text-destructive">*</span></Label>
                <Input placeholder="e.g. Premium Rice" {...field("name_en")} />
              </div>
              <div className="space-y-2">
                <Label>Name (Swahili)</Label>
                <Input placeholder="e.g. Mchele Bora" {...field("name_sw")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description (English) <span className="text-destructive">*</span></Label>
              <Textarea placeholder="Product description…" className="min-h-20 resize-none" {...field("desc_en")} />
            </div>
            <div className="space-y-2">
              <Label>Description (Swahili)</Label>
              <Textarea placeholder="Swahili translation…" className="min-h-20 resize-none" {...field("desc_sw")} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tag (English)</Label>
                <Input placeholder="e.g. Best Seller" {...field("tag_en")} />
              </div>
              <div className="space-y-2">
                <Label>Tag (Swahili)</Label>
                <Input placeholder="e.g. Inayouzwa Sana" {...field("tag_sw")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Available Sizes <span className="text-muted-foreground text-xs">(comma separated)</span></Label>
              <Input placeholder="e.g. 1kg, 5kg, 25kg, 50kg" {...field("sizes")} />
            </div>

            <div className="space-y-2">
              <Label>Categories <span className="text-destructive">*</span></Label>
              <div className="flex flex-wrap gap-3">
                {categoryOptions.map((opt) => (
                  <div key={opt.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`cat-${opt.value}`}
                      checked={form.categories.includes(opt.value)}
                      onCheckedChange={() => toggleCategory(opt.value)}
                    />
                    <label htmlFor={`cat-${opt.value}`} className="text-sm cursor-pointer">{opt.label}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="published"
                checked={form.published}
                onCheckedChange={(v) => setForm((f) => ({ ...f, published: !!v }))}
              />
              <label htmlFor="published" className="text-sm cursor-pointer">Published (visible on website)</label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!isValid || isSaving}>
              {isSaving ? "Saving…" : editing ? "Save Changes" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this product from the website. This action cannot be undone.
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

export default ManageProducts;
