import { useState } from "react";
import { Plus, Pencil, Trash2, Shield, Search, Key, ChevronDown } from "lucide-react";
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

const ALL_PERMISSIONS = [
  "manage-users",
  "manage-roles",
  "manage-permissions",
  "manage-inquiries",
  "manage-content",
  "manage-products",
  "manage-testimonials",
  "manage-faqs",
  "manage-slider",
];

type Role = {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  users_count: number;
};

const initialRoles: Role[] = [
  {
    id: 1,
    name: "super-admin",
    description: "Full access to all portal features and settings",
    permissions: ALL_PERMISSIONS,
    users_count: 1,
  },
  {
    id: 2,
    name: "content-manager",
    description: "Can manage all website content: products, testimonials, FAQs, slider, and site content",
    permissions: ["manage-content", "manage-products", "manage-testimonials", "manage-faqs", "manage-slider"],
    users_count: 1,
  },
  {
    id: 3,
    name: "sales-manager",
    description: "Can view and manage customer inquiries and follow-ups",
    permissions: ["manage-inquiries"],
    users_count: 1,
  },
  {
    id: 4,
    name: "viewer",
    description: "Read-only access to the admin portal",
    permissions: [],
    users_count: 0,
  },
];

const emptyForm = () => ({
  name: "",
  description: "",
  permissions: [] as string[],
});

const permissionLabels: Record<string, string> = {
  "manage-users": "Manage Users",
  "manage-roles": "Manage Roles",
  "manage-permissions": "Manage Permissions",
  "manage-inquiries": "Manage Inquiries",
  "manage-content": "Manage Site Content",
  "manage-products": "Manage Products",
  "manage-testimonials": "Manage Testimonials",
  "manage-faqs": "Manage FAQs",
  "manage-slider": "Manage Hero Slider",
};

const roleColors: Record<string, string> = {
  "super-admin": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  "content-manager": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  "sales-manager": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  viewer: "bg-gray-100 text-gray-700 dark:bg-gray-800/60 dark:text-gray-400",
};

const ManageRoles = () => {
  const { hasPermission } = useAuth();
  const canEdit = hasPermission("manage-roles");

  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editing, setEditing] = useState<Role | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [isSaving, setIsSaving] = useState(false);

  const filtered = roles.filter(
    (r) =>
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()),
  );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (r: Role) => {
    setEditing(r);
    setForm({ name: r.name, description: r.description, permissions: r.permissions });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((res) => setTimeout(res, 600));

    if (editing) {
      setRoles((prev) =>
        prev.map((r) =>
          r.id === editing.id ? { ...r, name: form.name, description: form.description, permissions: form.permissions } : r,
        ),
      );
    } else {
      const newId = Math.max(0, ...roles.map((r) => r.id)) + 1;
      setRoles((prev) => [
        ...prev,
        { id: newId, name: form.name, description: form.description, permissions: form.permissions, users_count: 0 },
      ]);
    }

    setIsSaving(false);
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setRoles((prev) => prev.filter((r) => r.id !== id));
    setDeleteId(null);
  };

  const togglePermission = (perm: string) => {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(perm)
        ? f.permissions.filter((p) => p !== perm)
        : [...f.permissions, perm],
    }));
  };

  const isValid = form.name.trim();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Roles</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage roles and their permission sets</p>
        </div>
        {canEdit && (
          <Button onClick={openCreate} className="gap-2">
            <Plus size={15} /> Add Role
          </Button>
        )}
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search roles…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((role) => (
          <Card key={role.id} className="surface-panel border-border/60">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      roleColors[role.name] ?? "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <Shield size={11} />
                    {role.name.replace(/-/g, " ")}
                  </span>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{role.description}</p>
                </div>
                {canEdit && (
                  <div className="flex gap-1 shrink-0 ml-3">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => openEdit(role)}>
                      <Pencil size={13} />
                    </Button>
                    {role.users_count === 0 && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setDeleteId(role.id)}>
                        <Trash2 size={13} />
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <div className="text-xs text-muted-foreground mb-3">
                <span className="font-medium text-foreground">{role.users_count}</span> user{role.users_count !== 1 ? "s" : ""} assigned
              </div>

              <div className="flex flex-wrap gap-1.5">
                {role.permissions.length === 0 ? (
                  <span className="text-xs text-muted-foreground italic">No permissions assigned</span>
                ) : role.permissions.includes("manage-users") && role.permissions.includes("manage-roles") ? (
                  <Badge variant="outline" className="text-[10px] text-primary border-primary/30">All permissions</Badge>
                ) : (
                  role.permissions.map((p) => (
                    <Badge key={p} variant="outline" className="text-[10px]">
                      {permissionLabels[p] ?? p}
                    </Badge>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-2 rounded-2xl border border-dashed border-border/60 py-16 text-center text-muted-foreground">
            <Shield size={28} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">No roles found</p>
          </div>
        )}
      </div>

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield size={16} className="text-primary" />
              {editing ? "Edit Role" : "Create Role"}
            </DialogTitle>
            <DialogDescription>
              {editing ? "Update this role's name and permissions." : "Create a new role and assign permissions."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Role Name <span className="text-destructive">*</span></Label>
              <Input
                placeholder="e.g. editor or marketing-lead"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value.toLowerCase().replace(/\s+/g, "-") }))}
              />
              <p className="text-[11px] text-muted-foreground">Use lowercase letters and hyphens only</p>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe what this role can do…"
                className="min-h-16 resize-none"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="space-y-2 rounded-xl border border-border/60 p-3">
                {ALL_PERMISSIONS.map((perm) => (
                  <div key={perm} className="flex items-center gap-2">
                    <Checkbox
                      id={`perm-${perm}`}
                      checked={form.permissions.includes(perm)}
                      onCheckedChange={() => togglePermission(perm)}
                    />
                    <label htmlFor={`perm-${perm}`} className="flex-1 text-sm cursor-pointer">
                      {permissionLabels[perm] ?? perm}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!isValid || isSaving}>
              {isSaving ? "Saving…" : editing ? "Save Changes" : "Create Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this role. Users assigned to this role will lose its permissions.
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

export default ManageRoles;
