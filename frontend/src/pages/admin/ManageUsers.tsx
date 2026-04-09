import { useState } from "react";
import { Plus, Pencil, Trash2, Users, Search, Mail, Shield, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

type UserRole = "super-admin" | "content-manager" | "sales-manager" | "viewer";

type AdminUser = {
  id: number;
  name: string;
  email: string;
  roles: UserRole[];
  created_at: string;
  last_login?: string;
  active: boolean;
};

const roleConfig: Record<UserRole, { label: string; color: string }> = {
  "super-admin": { label: "Super Admin", color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" },
  "content-manager": { label: "Content Manager", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400" },
  "sales-manager": { label: "Sales Manager", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" },
  viewer: { label: "Viewer", color: "bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-400" },
};

const allRoles: UserRole[] = ["super-admin", "content-manager", "sales-manager", "viewer"];

const initialUsers: AdminUser[] = [
  {
    id: 1,
    name: "Super Admin",
    email: "admin@miloha.co.tz",
    roles: ["super-admin"],
    created_at: "2026-04-06T10:00:00Z",
    last_login: "2026-04-09T08:00:00Z",
    active: true,
  },
  {
    id: 2,
    name: "Content Manager",
    email: "content@miloha.co.tz",
    roles: ["content-manager"],
    created_at: "2026-04-07T10:00:00Z",
    last_login: "2026-04-08T14:30:00Z",
    active: true,
  },
  {
    id: 3,
    name: "Sales Manager",
    email: "sales@miloha.co.tz",
    roles: ["sales-manager"],
    created_at: "2026-04-07T11:00:00Z",
    last_login: "2026-04-09T07:45:00Z",
    active: true,
  },
];

const emptyForm = () => ({
  name: "",
  email: "",
  password: "",
  roles: [] as UserRole[],
  active: true,
});

const ManageUsers = () => {
  const { hasPermission, user: currentUser } = useAuth();
  const canEdit = hasPermission("manage-users");

  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [isSaving, setIsSaving] = useState(false);

  const filtered = users.filter(
    (u) =>
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (u: AdminUser) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, password: "", roles: u.roles, active: u.active });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));

    if (editing) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editing.id
            ? { ...u, name: form.name, email: form.email, roles: form.roles, active: form.active }
            : u,
        ),
      );
    } else {
      const newId = Math.max(0, ...users.map((u) => u.id)) + 1;
      setUsers((prev) => [
        ...prev,
        {
          id: newId,
          name: form.name,
          email: form.email,
          roles: form.roles,
          created_at: new Date().toISOString(),
          active: form.active,
        },
      ]);
    }

    setIsSaving(false);
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setDeleteId(null);
  };

  const toggleRole = (role: UserRole) => {
    setForm((f) => ({
      ...f,
      roles: f.roles.includes(role) ? f.roles.filter((r) => r !== role) : [...f.roles, role],
    }));
  };

  const initials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  const isValid = form.name.trim() && form.email.trim() && (editing || form.password.trim()) && form.roles.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage admin portal accounts and role assignments</p>
        </div>
        {canEdit && (
          <Button onClick={openCreate} className="gap-2">
            <Plus size={15} /> Add User
          </Button>
        )}
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search users…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((u) => (
          <Card key={u.id} className="surface-panel border-border/60">
            <CardContent className="flex items-center gap-4 p-5">
              <Avatar className="h-10 w-10 rounded-xl shrink-0">
                <AvatarFallback className="rounded-xl bg-primary/12 text-primary text-sm font-bold">
                  {initials(u.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-foreground">{u.name}</p>
                  {u.id === currentUser?.id && (
                    <span className="text-[10px] bg-primary/10 text-primary rounded-full px-2 py-0.5 font-semibold">You</span>
                  )}
                  {!u.active && (
                    <span className="text-[10px] bg-muted text-muted-foreground rounded-full px-2 py-0.5 font-semibold">Inactive</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Mail size={11} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{u.email}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {u.roles.map((role) => (
                    <span
                      key={role}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        roleConfig[role].color,
                      )}
                    >
                      <Shield size={9} />
                      {roleConfig[role].label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-right shrink-0 text-xs text-muted-foreground space-y-1">
                <p>Joined {fmt(u.created_at)}</p>
                {u.last_login && <p>Last login {fmt(u.last_login)}</p>}
              </div>

              {canEdit && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <MoreHorizontal size={15} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(u)}>
                      <Pencil size={13} className="mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, active: !x.active } : x)))}>
                      {u.active ? "Deactivate" : "Activate"}
                    </DropdownMenuItem>
                    {u.id !== currentUser?.id && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteId(u.id)}>
                          <Trash2 size={13} className="mr-2" /> Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border/60 py-16 text-center text-muted-foreground">
            <Users size={28} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">No users found</p>
          </div>
        )}
      </div>

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users size={16} className="text-primary" />
              {editing ? "Edit User" : "Add User"}
            </DialogTitle>
            <DialogDescription>
              {editing ? "Update user details and role assignments." : "Create a new admin portal account."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Full Name <span className="text-destructive">*</span></Label>
              <Input
                placeholder="e.g. John Mwalimu"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Email Address <span className="text-destructive">*</span></Label>
              <Input
                type="email"
                placeholder="user@miloha.co.tz"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Password {editing && <span className="text-muted-foreground text-xs">(leave blank to keep current)</span>}</Label>
              <Input
                type="password"
                placeholder={editing ? "Leave blank to keep current" : "Set a password"}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Roles <span className="text-destructive">*</span></Label>
              <div className="space-y-2 rounded-xl border border-border/60 p-3">
                {allRoles.map((role) => (
                  <div key={role} className="flex items-center gap-2">
                    <Checkbox
                      id={`role-${role}`}
                      checked={form.roles.includes(role)}
                      onCheckedChange={() => toggleRole(role)}
                    />
                    <label htmlFor={`role-${role}`} className="flex-1 text-sm cursor-pointer flex items-center gap-2">
                      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", roleConfig[role].color)}>
                        {roleConfig[role].label}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="user-active"
                checked={form.active}
                onCheckedChange={(v) => setForm((f) => ({ ...f, active: !!v }))}
              />
              <label htmlFor="user-active" className="text-sm cursor-pointer">Active account</label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!isValid || isSaving}>
              {isSaving ? "Saving…" : editing ? "Save Changes" : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this user account. This action cannot be undone.
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

export default ManageUsers;
