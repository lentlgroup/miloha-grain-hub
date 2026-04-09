import { useState } from "react";
import { Plus, Pencil, Trash2, FileText, Truck, BarChart3, Zap, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

type PromoItem = { id: number; text_en: string; text_sw: string; sort_order: number };
type DeliveryZone = { id: number; zone_en: string; zone_sw: string; eta_en: string; eta_sw: string; note_en: string; note_sw: string; sort_order: number };
type TrustMetric = { id: number; value: number; suffix: string; label_en: string; label_sw: string; detail_en: string; detail_sw: string; sort_order: number };
type ProcessStep = { id: number; title_en: string; title_sw: string; desc_en: string; desc_sw: string; sort_order: number };

const initialPromo: PromoItem[] = [
  { id: 1, text_en: "New-season rice and maize sourcing now available for planned wholesale orders.", text_sw: "Mchele na mahindi ya msimu mpya sasa yanapatikana kwa oda za jumla zilizopangwa.", sort_order: 1 },
  { id: 2, text_en: "Retail-ready packaged grain bundles prepared for mini-markets and neighborhood shops.", text_sw: "Vifurushi vya nafaka vilivyofungashwa tayari kwa rejareja vimeandaliwa kwa maduka madogo.", sort_order: 2 },
  { id: 3, text_en: "Priority response for repeat customers placing weekly or monthly replenishment requests.", text_sw: "Majibu ya kipaumbele kwa wateja wa kurudia wanaoweka oda za kila wiki au kila mwezi.", sort_order: 3 },
];

const initialZones: DeliveryZone[] = [
  { id: 1, zone_en: "Tegeta to City Center", zone_sw: "Tegeta hadi Katikati ya Jiji", eta_en: "Same day", eta_sw: "Siku hiyo hiyo", note_en: "Fast turnaround for stocked items and repeat buyers.", note_sw: "Huduma ya haraka kwa bidhaa zilizopo stoo.", sort_order: 1 },
  { id: 2, zone_en: "Kinondoni & Ubungo", zone_sw: "Kinondoni na Ubungo", eta_en: "Within 24 hours", eta_sw: "Ndani ya saa 24", note_en: "Reliable coverage for homes, restaurants, and mini-markets.", note_sw: "Huduma thabiti kwa nyumba, migahawa, na maduka madogo.", sort_order: 2 },
  { id: 3, zone_en: "Temeke & Kigamboni", zone_sw: "Temeke na Kigamboni", eta_en: "24–48 hours", eta_sw: "Saa 24–48", note_en: "Scheduled dispatch with quantity-based planning.", note_sw: "Usafirishaji uliopangwa kulingana na kiasi cha oda.", sort_order: 3 },
  { id: 4, zone_en: "Up-country supply", zone_sw: "Usambazaji wa Mikoani", eta_en: "Planned dispatch", eta_sw: "Usafirishaji uliopangwa", note_en: "Bulk shipment support for institutions and wholesale partners.", note_sw: "Msaada wa shehena kubwa kwa taasisi na washirika wa jumla.", sort_order: 4 },
];

const initialMetrics: TrustMetric[] = [
  { id: 1, value: 500, suffix: "+", label_en: "Retail & wholesale orders supported", label_sw: "Oda za rejareja na jumla zilizohudumiwa", detail_en: "Flexible order handling for homes, retailers, and institutions.", detail_sw: "Huduma rahisi kwa nyumba, wauzaji wa rejareja, na taasisi.", sort_order: 1 },
  { id: 2, value: 98, suffix: "%", label_en: "Quality check pass confidence", label_sw: "Uhakika wa kupita ukaguzi wa ubora", detail_en: "Careful sorting, drying, and inspection before dispatch.", detail_sw: "Upangaji, ukaushaji, na ukaguzi wa makini kabla ya kusafirishwa.", sort_order: 2 },
  { id: 3, value: 12, suffix: "", label_en: "Packaging and bulk supply formats", label_sw: "Aina za vifungashio na usambazaji wa jumla", detail_en: "Structured for shelf-ready, household, and large-volume buyers.", detail_sw: "Imeandaliwa kwa rafu za maduka, matumizi ya nyumbani.", sort_order: 3 },
  { id: 4, value: 8, suffix: "+", label_en: "Coverage zones around Dar es Salaam", label_sw: "Maeneo ya huduma ndani na karibu na Dar es Salaam", detail_en: "Fast response for city deliveries and arranged regional dispatch.", detail_sw: "Majibu ya haraka kwa usafirishaji wa jiji na mipango ya mikoani.", sort_order: 4 },
];

const initialSteps: ProcessStep[] = [
  { id: 1, title_en: "Farm Sourcing", title_sw: "Upatikanaji Kutoka Mashambani", desc_en: "We work with trusted farming networks and source grains aligned with our purity and consistency standards.", desc_sw: "Tunafanya kazi na mitandao ya wakulima wanaoaminika.", sort_order: 1 },
  { id: 2, title_en: "Cleaning & Sorting", title_sw: "Usafishaji na Upangaji", desc_en: "Batches are cleaned, graded, and sorted to remove impurities and improve uniformity.", desc_sw: "Bidhaa husafishwa, hupangwa kwa viwango, na kuchambuliwa.", sort_order: 2 },
  { id: 3, title_en: "Quality Review", title_sw: "Ukaguzi wa Ubora", desc_en: "Moisture, freshness, and visual quality are checked before stock moves into packaging.", desc_sw: "Unyevu, ubichi, na mwonekano hukaguliwa kabla ya bidhaa kuingia kwenye ufungashaji.", sort_order: 3 },
  { id: 4, title_en: "Packaging & Storage", title_sw: "Ufungashaji na Uhifadhi", desc_en: "Products are packed for household, retail, or wholesale channels and stored for freshness.", desc_sw: "Bidhaa hufungwa kwa matumizi ya nyumbani, rejareja, au jumla.", sort_order: 4 },
  { id: 5, title_en: "Delivery & Fulfillment", title_sw: "Usafirishaji na Utekelezaji", desc_en: "Orders are coordinated for pickup, city delivery, or arranged up-country distribution.", desc_sw: "Oda huratibiwa kwa kuchukuliwa dukani, kupelekwa ndani ya jiji.", sort_order: 5 },
];

// Generic CRUD list component
type GenericItem = { id: number; sort_order: number; [key: string]: unknown };

function CrudList<T extends GenericItem>({
  items,
  onUpdate,
  renderCard,
  onAdd,
  emptyIcon: EmptyIcon,
  emptyLabel,
  canEdit,
}: {
  items: T[];
  onUpdate: (items: T[]) => void;
  renderCard: (item: T, idx: number, onEdit: (item: T) => void, onDelete: (id: number) => void, onMoveUp: (id: number) => void, onMoveDown: (id: number) => void) => React.ReactNode;
  onAdd: () => void;
  emptyIcon: React.ElementType;
  emptyLabel: string;
  canEdit: boolean;
}) {
  const moveUp = (id: number) => {
    const idx = items.findIndex((i) => i.id === id);
    if (idx <= 0) return;
    const arr = [...items];
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    onUpdate(arr.map((item, i) => ({ ...item, sort_order: i + 1 })));
  };

  const moveDown = (id: number) => {
    const idx = items.findIndex((i) => i.id === id);
    if (idx >= items.length - 1) return;
    const arr = [...items];
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
    onUpdate(arr.map((item, i) => ({ ...item, sort_order: i + 1 })));
  };

  const onDelete = (id: number) => {
    onUpdate(items.filter((i) => i.id !== id).map((item, i) => ({ ...item, sort_order: i + 1 })));
  };

  const onEdit = (updated: T) => {
    onUpdate(items.map((i) => (i.id === updated.id ? updated : i)));
  };

  if (items.length === 0)
    return (
      <div className="rounded-2xl border border-dashed border-border/60 py-12 text-center text-muted-foreground">
        <EmptyIcon size={24} className="mx-auto mb-2 opacity-40" />
        <p className="text-sm font-medium">{emptyLabel}</p>
        {canEdit && <Button variant="link" onClick={onAdd} className="mt-1 text-xs">Add one now</Button>}
      </div>
    );

  return (
    <div className="space-y-3">
      {items.map((item, idx) =>
        renderCard(item, idx, onEdit as (item: T) => void, onDelete, moveUp, moveDown),
      )}
    </div>
  );
}

const ManageContent = () => {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const canEdit = hasPermission("manage-content");

  const [promo, setPromo] = useState<PromoItem[]>(initialPromo);
  const [zones, setZones] = useState<DeliveryZone[]>(initialZones);
  const [metrics, setMetrics] = useState<TrustMetric[]>(initialMetrics);
  const [steps, setSteps] = useState<ProcessStep[]>(initialSteps);

  // Promo dialogs
  const [promoDialog, setPromoDialog] = useState(false);
  const [promoEdit, setPromoEdit] = useState<PromoItem | null>(null);
  const [promoForm, setPromoForm] = useState({ text_en: "", text_sw: "" });

  // Zone dialogs
  const [zoneDialog, setZoneDialog] = useState(false);
  const [zoneEdit, setZoneEdit] = useState<DeliveryZone | null>(null);
  const [zoneForm, setZoneForm] = useState({ zone_en: "", zone_sw: "", eta_en: "", eta_sw: "", note_en: "", note_sw: "" });

  // Metric dialogs
  const [metricDialog, setMetricDialog] = useState(false);
  const [metricEdit, setMetricEdit] = useState<TrustMetric | null>(null);
  const [metricForm, setMetricForm] = useState({ value: 0, suffix: "", label_en: "", label_sw: "", detail_en: "", detail_sw: "" });

  // Process step dialogs
  const [stepDialog, setStepDialog] = useState(false);
  const [stepEdit, setStepEdit] = useState<ProcessStep | null>(null);
  const [stepForm, setStepForm] = useState({ title_en: "", title_sw: "", desc_en: "", desc_sw: "" });

  const [isSaving, setIsSaving] = useState(false);

  const save = async (fn: () => void) => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    fn();
    setIsSaving(false);
    toast({ title: "Saved", description: "Content updated successfully." });
  };

  const openPromoCreate = () => { setPromoEdit(null); setPromoForm({ text_en: "", text_sw: "" }); setPromoDialog(true); };
  const openPromoEdit = (p: PromoItem) => { setPromoEdit(p); setPromoForm({ text_en: p.text_en, text_sw: p.text_sw }); setPromoDialog(true); };
  const savePromo = () => save(() => {
    if (promoEdit) {
      setPromo((prev) => prev.map((p) => (p.id === promoEdit.id ? { ...p, ...promoForm } : p)));
    } else {
      const id = Math.max(0, ...promo.map((p) => p.id)) + 1;
      setPromo((prev) => [...prev, { id, ...promoForm, sort_order: prev.length + 1 }]);
    }
    setPromoDialog(false);
  });

  const openZoneCreate = () => { setZoneEdit(null); setZoneForm({ zone_en: "", zone_sw: "", eta_en: "", eta_sw: "", note_en: "", note_sw: "" }); setZoneDialog(true); };
  const openZoneEdit = (z: DeliveryZone) => { setZoneEdit(z); setZoneForm({ zone_en: z.zone_en, zone_sw: z.zone_sw, eta_en: z.eta_en, eta_sw: z.eta_sw, note_en: z.note_en, note_sw: z.note_sw }); setZoneDialog(true); };
  const saveZone = () => save(() => {
    if (zoneEdit) {
      setZones((prev) => prev.map((z) => (z.id === zoneEdit.id ? { ...z, ...zoneForm } : z)));
    } else {
      const id = Math.max(0, ...zones.map((z) => z.id)) + 1;
      setZones((prev) => [...prev, { id, ...zoneForm, sort_order: prev.length + 1 }]);
    }
    setZoneDialog(false);
  });

  const openMetricCreate = () => { setMetricEdit(null); setMetricForm({ value: 0, suffix: "", label_en: "", label_sw: "", detail_en: "", detail_sw: "" }); setMetricDialog(true); };
  const openMetricEdit = (m: TrustMetric) => { setMetricEdit(m); setMetricForm({ value: m.value, suffix: m.suffix, label_en: m.label_en, label_sw: m.label_sw, detail_en: m.detail_en, detail_sw: m.detail_sw }); setMetricDialog(true); };
  const saveMetric = () => save(() => {
    if (metricEdit) {
      setMetrics((prev) => prev.map((m) => (m.id === metricEdit.id ? { ...m, ...metricForm } : m)));
    } else {
      const id = Math.max(0, ...metrics.map((m) => m.id)) + 1;
      setMetrics((prev) => [...prev, { id, ...metricForm, sort_order: prev.length + 1 }]);
    }
    setMetricDialog(false);
  });

  const openStepEdit = (s: ProcessStep) => { setStepEdit(s); setStepForm({ title_en: s.title_en, title_sw: s.title_sw, desc_en: s.desc_en, desc_sw: s.desc_sw }); setStepDialog(true); };
  const saveStep = () => save(() => {
    if (stepEdit) {
      setSteps((prev) => prev.map((s) => (s.id === stepEdit.id ? { ...s, ...stepForm } : s)));
    }
    setStepDialog(false);
  });

  const MoveButtons = ({ id, idx, length, onMoveUp, onMoveDown }: { id: number; idx: number; length: number; onMoveUp: (id: number) => void; onMoveDown: (id: number) => void }) =>
    canEdit ? (
      <div className="flex flex-col gap-0.5 shrink-0">
        <button onClick={() => onMoveUp(id)} disabled={idx === 0} className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs hover:bg-muted/50 transition-colors">▲</button>
        <GripVertical size={12} className="text-muted-foreground/40 mx-auto" />
        <button onClick={() => onMoveDown(id)} disabled={idx === length - 1} className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs hover:bg-muted/50 transition-colors">▼</button>
      </div>
    ) : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Site Content</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage landing page sections: promo highlights, delivery zones, trust metrics, and process steps</p>
      </div>

      <Tabs defaultValue="promo">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="promo" className="gap-1.5 text-xs">
            <Zap size={13} /> Promo
          </TabsTrigger>
          <TabsTrigger value="delivery" className="gap-1.5 text-xs">
            <Truck size={13} /> Delivery
          </TabsTrigger>
          <TabsTrigger value="metrics" className="gap-1.5 text-xs">
            <BarChart3 size={13} /> Metrics
          </TabsTrigger>
          <TabsTrigger value="process" className="gap-1.5 text-xs">
            <FileText size={13} /> Process
          </TabsTrigger>
        </TabsList>

        {/* Promo Highlights */}
        <TabsContent value="promo" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Promo Highlights</h2>
              <p className="text-xs text-muted-foreground">Rotating promotional messages shown on the hero section</p>
            </div>
            {canEdit && <Button size="sm" onClick={openPromoCreate} className="gap-1.5"><Plus size={13} /> Add</Button>}
          </div>
          <div className="space-y-2">
            {promo.map((p, idx) => (
              <Card key={p.id} className="surface-panel border-border/60">
                <CardContent className="flex items-center gap-3 p-4">
                  <MoveButtons id={p.id} idx={idx} length={promo.length} onMoveUp={(id) => { const arr = [...promo]; const i = arr.findIndex(x => x.id === id); if (i > 0) { [arr[i-1], arr[i]] = [arr[i], arr[i-1]]; setPromo(arr.map((x, j) => ({ ...x, sort_order: j + 1 }))); } }} onMoveDown={(id) => { const arr = [...promo]; const i = arr.findIndex(x => x.id === id); if (i < arr.length - 1) { [arr[i], arr[i+1]] = [arr[i+1], arr[i]]; setPromo(arr.map((x, j) => ({ ...x, sort_order: j + 1 }))); } }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{p.text_en}</p>
                    {p.text_sw && <p className="text-xs text-muted-foreground/60 mt-0.5 italic">{p.text_sw}</p>}
                  </div>
                  {canEdit && (
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => openPromoEdit(p)}><Pencil size={12} /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setPromo((prev) => prev.filter((x) => x.id !== p.id).map((x, i) => ({ ...x, sort_order: i + 1 })))}><Trash2 size={12} /></Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Delivery Zones */}
        <TabsContent value="delivery" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Delivery Zones</h2>
              <p className="text-xs text-muted-foreground">Coverage areas, ETAs and delivery notes</p>
            </div>
            {canEdit && <Button size="sm" onClick={openZoneCreate} className="gap-1.5"><Plus size={13} /> Add Zone</Button>}
          </div>
          <div className="space-y-3">
            {zones.map((z, idx) => (
              <Card key={z.id} className="surface-panel border-border/60">
                <CardContent className="flex items-start gap-3 p-4">
                  <MoveButtons id={z.id} idx={idx} length={zones.length} onMoveUp={(id) => { const arr = [...zones]; const i = arr.findIndex(x => x.id === id); if (i > 0) { [arr[i-1], arr[i]] = [arr[i], arr[i-1]]; setZones(arr.map((x, j) => ({ ...x, sort_order: j + 1 }))); } }} onMoveDown={(id) => { const arr = [...zones]; const i = arr.findIndex(x => x.id === id); if (i < arr.length - 1) { [arr[i], arr[i+1]] = [arr[i+1], arr[i]]; setZones(arr.map((x, j) => ({ ...x, sort_order: j + 1 }))); } }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-foreground">{z.zone_en}</p>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{z.eta_en}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{z.note_en}</p>
                  </div>
                  {canEdit && (
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => openZoneEdit(z)}><Pencil size={12} /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setZones((prev) => prev.filter((x) => x.id !== z.id).map((x, i) => ({ ...x, sort_order: i + 1 })))}><Trash2 size={12} /></Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Trust Metrics */}
        <TabsContent value="metrics" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Trust Metrics</h2>
              <p className="text-xs text-muted-foreground">Key numbers shown in the trust/stats section</p>
            </div>
            {canEdit && <Button size="sm" onClick={openMetricCreate} className="gap-1.5"><Plus size={13} /> Add Metric</Button>}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {metrics.map((m, idx) => (
              <Card key={m.id} className="surface-panel border-border/60">
                <CardContent className="flex items-start gap-3 p-4">
                  <MoveButtons id={m.id} idx={idx} length={metrics.length} onMoveUp={(id) => { const arr = [...metrics]; const i = arr.findIndex(x => x.id === id); if (i > 0) { [arr[i-1], arr[i]] = [arr[i], arr[i-1]]; setMetrics(arr.map((x, j) => ({ ...x, sort_order: j + 1 }))); } }} onMoveDown={(id) => { const arr = [...metrics]; const i = arr.findIndex(x => x.id === id); if (i < arr.length - 1) { [arr[i], arr[i+1]] = [arr[i+1], arr[i]]; setMetrics(arr.map((x, j) => ({ ...x, sort_order: j + 1 }))); } }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-2xl font-bold text-primary">{m.value}{m.suffix}</p>
                    <p className="text-xs font-medium text-foreground mt-0.5">{m.label_en}</p>
                    <p className="text-xs text-muted-foreground">{m.detail_en}</p>
                  </div>
                  {canEdit && (
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => openMetricEdit(m)}><Pencil size={12} /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setMetrics((prev) => prev.filter((x) => x.id !== m.id).map((x, i) => ({ ...x, sort_order: i + 1 })))}><Trash2 size={12} /></Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Process Steps */}
        <TabsContent value="process" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Process Steps</h2>
              <p className="text-xs text-muted-foreground">Our grain handling process shown on the website</p>
            </div>
          </div>
          <div className="space-y-3">
            {steps.map((step, idx) => (
              <Card key={step.id} className="surface-panel border-border/60">
                <CardContent className="flex items-start gap-3 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary text-sm font-bold mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground">{step.title_en}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.desc_en}</p>
                  </div>
                  {canEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
                      onClick={() => openStepEdit(step)}
                    >
                      <Pencil size={12} />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Promo Dialog */}
      <Dialog open={promoDialog} onOpenChange={setPromoDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{promoEdit ? "Edit Promo Highlight" : "Add Promo Highlight"}</DialogTitle>
            <DialogDescription>Promotional message shown in the hero highlights section.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Text (English) <span className="text-destructive">*</span></Label>
              <Textarea placeholder="Promotional message…" className="min-h-20 resize-none" value={promoForm.text_en} onChange={(e) => setPromoForm((f) => ({ ...f, text_en: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Text (Swahili)</Label>
              <Textarea placeholder="Swahili translation…" className="min-h-20 resize-none" value={promoForm.text_sw} onChange={(e) => setPromoForm((f) => ({ ...f, text_sw: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPromoDialog(false)}>Cancel</Button>
            <Button onClick={savePromo} disabled={!promoForm.text_en.trim() || isSaving}>
              {isSaving ? "Saving…" : promoEdit ? "Save Changes" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Zone Dialog */}
      <Dialog open={zoneDialog} onOpenChange={setZoneDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{zoneEdit ? "Edit Delivery Zone" : "Add Delivery Zone"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Zone (EN) <span className="text-destructive">*</span></Label><Input value={zoneForm.zone_en} onChange={(e) => setZoneForm((f) => ({ ...f, zone_en: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Zone (SW)</Label><Input value={zoneForm.zone_sw} onChange={(e) => setZoneForm((f) => ({ ...f, zone_sw: e.target.value }))} /></div>
              <div className="space-y-2"><Label>ETA (EN) <span className="text-destructive">*</span></Label><Input placeholder="e.g. Same day" value={zoneForm.eta_en} onChange={(e) => setZoneForm((f) => ({ ...f, eta_en: e.target.value }))} /></div>
              <div className="space-y-2"><Label>ETA (SW)</Label><Input value={zoneForm.eta_sw} onChange={(e) => setZoneForm((f) => ({ ...f, eta_sw: e.target.value }))} /></div>
            </div>
            <div className="space-y-2"><Label>Note (EN)</Label><Textarea className="min-h-16 resize-none" value={zoneForm.note_en} onChange={(e) => setZoneForm((f) => ({ ...f, note_en: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Note (SW)</Label><Textarea className="min-h-16 resize-none" value={zoneForm.note_sw} onChange={(e) => setZoneForm((f) => ({ ...f, note_sw: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setZoneDialog(false)}>Cancel</Button>
            <Button onClick={saveZone} disabled={!zoneForm.zone_en.trim() || !zoneForm.eta_en.trim() || isSaving}>
              {isSaving ? "Saving…" : zoneEdit ? "Save Changes" : "Add Zone"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Metric Dialog */}
      <Dialog open={metricDialog} onOpenChange={setMetricDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{metricEdit ? "Edit Trust Metric" : "Add Trust Metric"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Value <span className="text-destructive">*</span></Label><Input type="number" value={metricForm.value} onChange={(e) => setMetricForm((f) => ({ ...f, value: Number(e.target.value) }))} /></div>
              <div className="space-y-2"><Label>Suffix</Label><Input placeholder="e.g. + or %" value={metricForm.suffix} onChange={(e) => setMetricForm((f) => ({ ...f, suffix: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Label (EN) <span className="text-destructive">*</span></Label><Input value={metricForm.label_en} onChange={(e) => setMetricForm((f) => ({ ...f, label_en: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Label (SW)</Label><Input value={metricForm.label_sw} onChange={(e) => setMetricForm((f) => ({ ...f, label_sw: e.target.value }))} /></div>
            </div>
            <div className="space-y-2"><Label>Detail (EN)</Label><Textarea className="min-h-16 resize-none" value={metricForm.detail_en} onChange={(e) => setMetricForm((f) => ({ ...f, detail_en: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Detail (SW)</Label><Textarea className="min-h-16 resize-none" value={metricForm.detail_sw} onChange={(e) => setMetricForm((f) => ({ ...f, detail_sw: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMetricDialog(false)}>Cancel</Button>
            <Button onClick={saveMetric} disabled={!metricForm.label_en.trim() || isSaving}>
              {isSaving ? "Saving…" : metricEdit ? "Save Changes" : "Add Metric"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Process Step Dialog */}
      <Dialog open={stepDialog} onOpenChange={setStepDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Process Step</DialogTitle>
            <DialogDescription>Update the step title and description.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Title (EN) <span className="text-destructive">*</span></Label><Input value={stepForm.title_en} onChange={(e) => setStepForm((f) => ({ ...f, title_en: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Title (SW)</Label><Input value={stepForm.title_sw} onChange={(e) => setStepForm((f) => ({ ...f, title_sw: e.target.value }))} /></div>
            </div>
            <div className="space-y-2"><Label>Description (EN) <span className="text-destructive">*</span></Label><Textarea className="min-h-20 resize-none" value={stepForm.desc_en} onChange={(e) => setStepForm((f) => ({ ...f, desc_en: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Description (SW)</Label><Textarea className="min-h-20 resize-none" value={stepForm.desc_sw} onChange={(e) => setStepForm((f) => ({ ...f, desc_sw: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStepDialog(false)}>Cancel</Button>
            <Button onClick={saveStep} disabled={!stepForm.title_en.trim() || !stepForm.desc_en.trim() || isSaving}>
              {isSaving ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageContent;
