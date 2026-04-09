import { useState } from "react";
import { Plus, Pencil, Trash2, Key, Search } from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";

type Permission = {
  id: number;
  name: string;
  description: string;
  roles_count: number;
  group: string;
};

const initialPermissions: Permission[] = [
  { id: 1, name: "manage-users", description: "Create, edit, and delete admin user accounts", roles_count: 1, group: "Access Control" },
  { id: 2, name: "manage-roles", description: "Create, edit, and delete roles", roles_count: 1, group: "Access Control" },
  { id: 3, name: "manage-permissions", description: "Create, edit, and delete permissions", roles_count: 1, group: "Access Control" },
  { id: 4, name: "manage-inquiries", description: "View, update, and follow up on customer inquiries", roles_count: 2, group: "Business" },
  { id: 5, name: "manage-content", description: "Edit site content: delivery zones, metrics, process steps, promo highlights", roles_count: 2, group: "Content" },
  { id: 6, name: "manage-products", description: "Create, edit, and delete product listings", roles_count: 2, group: "Content" },
  { id: 7, name: "manage-testimonials", description: "Create, edit, delete, and reorder testimonials", roles_count: 2, group: "Content" },
  { id: 8, name: "manage-faqs", description: "Create, edit, delete, and reorder FAQ entries", roles_count: 2, group: "Content" },
  { id: 9, name: "manage-slider", description: "Upload and manage hero section slider images and text", roles_count: 2, group: "Content" },
];

const emptyForm = () => ({ name: "", description: "", group: "" });

const groupColors: Record<string, string> = {
  "Access Control": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  Business: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  Content: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
};

const ManagePermissions = () => {
  const { hasPermission } = useAuth();
  const canEdit = hasPermission("manage-permissions");

  const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editing, setEditing] = useState<Permission | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [isSaving, setIsSaving] = useState(false);

  const filtered = permissions.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.group.toLowerCase().includes(search.toLowerCase()),
  );

  const grouped = filtered.reduce<Record<string, Permission[]>>((acc, p) => {
    const group = p.group || "Other";
    if (!acc[group]) acc[group] = [];
    acc[group].push(p);
    return acc;
  }, {});

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (p: Permission) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description, group: p.group });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 500));

    if (editing) {
      setPermissions((prev) =>
        prev.map((p) =>
          p.id === editing.id ? { ...p, name: form.name, description: form.description, group: form.group } : p,
        ),
      );
    } else {
      const newId = Math.max(0, ...permissions.map((p) => p.id)) + 1;
      setPermissions((prev) => [
        ...prev,
        { id: newId, name: form.name, description: form.description, group: form.group, roles_count: 0 },
      ]);
    }

    setIsSaving(false);
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setPermissions((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  };

  const isValid = form.name.trim();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Permissions</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage system permissions and their role assignments</p>
        </div>
        {canEdit && (
          <Button onClick={openCreate} className="gap-2">
            <Plus size={15} /> Add Permission
          </Button>
        )}
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search permissions…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([group, perms]) => (
          <div key={group}>
            <div className="mb-3 flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${groupColors[group] ?? "bg-gray-100 text-gray-700"}`}>
                {group}
              </span>
              <span className="text-xs text-muted-foreground">{perms.length} permission{perms.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="space-y-2">
              {perms.map((perm) => (
                <Card key={perm.id} className="surface-panel border-border/60">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Key size={15} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm font-semibold text-foreground">{perm.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{perm.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">{perm.roles_count} role{perm.roles_count !== 1 ? "s" : ""}</p>
                    </div>
                    {canEdit && (
                      <div className="flex gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => openEdit(perm)}>
                          <Pencil size={12} />
                        </Button>
                        {perm.roles_count === 0 && (
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setDeleteId(perm.id)}>
                            <Trash2 size={12} />
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border/60 py-16 text-center text-muted-foreground">
            <Key size={28} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">No permissions found</p>
          </div>
        )}
      </div>

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key size={16} className="text-primary" />
              {editing ? "Edit Permission" : "Add Permission"}
            </DialogTitle>
            <DialogDescription>
              {editing ? "Update this permission's details." : "Create a new permission that can be assigned to roles."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Permission Name <span className="text-destructive">*</span></Label>
              <Input
                placeholder="e.g. manage-reports"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value.toLowerCase().replace(/\s+/g, "-") }))}
              />
              <p className="text-[11px] text-muted-foreground">Use lowercase letters and hyphens only</p>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="What this permission allows…"
                className="min-h-16 resize-none"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Group</Label>
              <Input
                placeholder="e.g. Content, Business, Access Control"
                value={form.group}
                onChange={(e) => setForm((f) => ({ ...f, group: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!isValid || isSaving}>
              {isSaving ? "Saving…" : editing ? "Save Changes" : "Add Permission"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Permission</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this permission. Any roles that have it will lose access. This action cannot be undone.
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

export default ManagePermissions;
