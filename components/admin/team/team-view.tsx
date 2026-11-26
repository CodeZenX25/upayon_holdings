"use client";

import * as React from "react";
import { toast } from "sonner";
import { Crown, Edit2, LoaderCircle, Plus, Trash2, UsersRound } from "lucide-react";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

type Group = "leadership" | "department";

interface MemberData {
  _id?: string;
  name: string;
  designation: string;
  photo?: string;
  group: Group;
  order: number;
  isActive: boolean;
}

const empty: MemberData = { name: "", designation: "", photo: "", group: "department", order: 0, isActive: true };

const groupLabel: Record<Group, string> = {
  leadership: "Leadership",
  department: "Department head",
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

export function TeamView() {
  const [members, setMembers] = React.useState<MemberData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<MemberData>(empty);
  const [submitting, setSubmitting] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const load = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/team");
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { members?: MemberData[] };
      setMembers(data.members ?? []);
    } catch {
      toast.error("Failed to load team");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const set = <K extends keyof MemberData>(key: K, value: MemberData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...empty, order: members.length });
    setDialogOpen(true);
  };

  const openEdit = (m: MemberData) => {
    setEditingId(m._id ?? null);
    setForm({ ...empty, ...m });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.designation.trim()) return toast.error("Designation is required");
    try {
      setSubmitting(true);
      const res = await fetch(editingId ? `/api/admin/team/${editingId}` : "/api/admin/team", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, order: Number(form.order) || 0 }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) throw new Error(data.message || "Failed to save");
      toast.success(editingId ? "Team member updated!" : "Team member added!");
      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/team/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Team member removed");
      setDeleteId(null);
      load();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const toggleActive = async (m: MemberData) => {
    try {
      const res = await fetch(`/api/admin/team/${m._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...m, isActive: !m.isActive }),
      });
      if (!res.ok) throw new Error();
      toast.success(m.isActive ? "Hidden from website" : "Shown on website");
      load();
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-navy-900">Team</h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Leaders and department heads shown on the About page.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-1.5">
          <Plus className="size-4" />
          Add Member
        </Button>
      </div>

      {!loading && members.length === 0 && (
        <div className="rounded-lg border border-brand-purple/20 bg-brand-purple/5 px-4 py-3 text-sm text-navy-900">
          <strong className="text-brand-purple">Demo members are showing on the About page.</strong> They disappear
          as soon as you add your first real team member.
        </div>
      )}

      <Card className="overflow-hidden border-border shadow-xs">
        <CardHeader className="border-b border-border bg-muted/20 px-6 py-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            {members.length} team member{members.length === 1 ? "" : "s"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-4 p-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="size-11 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
              ))}
            </div>
          ) : members.length === 0 ? (
            <div className="space-y-3 py-16 text-center">
              <UsersRound className="mx-auto size-10 text-muted-foreground/60" />
              <p className="text-sm font-medium text-navy-900">No team members yet</p>
              <p className="text-xs text-muted-foreground">Add your Chairman, MD and department heads.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((m) => (
                    <TableRow key={m._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-brand-purple/10 text-xs font-bold text-brand-purple">
                            {m.photo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={m.photo} alt="" className="size-full object-cover" />
                            ) : (
                              initials(m.name)
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-navy-900">{m.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{m.designation}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-bold ${
                            m.group === "leadership"
                              ? "bg-brand-purple text-white"
                              : "bg-muted text-navy-900"
                          }`}
                        >
                          {m.group === "leadership" && <Crown className="size-3" />}
                          {groupLabel[m.group]}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs tabular-nums text-muted-foreground">{m.order}</TableCell>
                      <TableCell>
                        <button type="button" onClick={() => toggleActive(m)} title="Click to toggle">
                          {m.isActive ? <Badge variant="success">Shown</Badge> : <Badge variant="outline">Hidden</Badge>}
                        </button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="icon-xs" variant="ghost" onClick={() => openEdit(m)} aria-label="Edit">
                            <Edit2 className="size-3.5" />
                          </Button>
                          <Button
                            size="icon-xs"
                            variant="ghost"
                            onClick={() => setDeleteId(m._id ?? null)}
                            className="text-destructive hover:bg-destructive/10"
                            aria-label="Delete"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={submitting ? () => {} : setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
            <DialogDescription>Shown in the team section of the About page.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <ImageUploader
              label="Photo"
              description="A portrait on a plain background looks best (auto-converted to WebP)."
              folder="team"
              value={form.photo ?? ""}
              onChange={(val) => set("photo", Array.isArray(val) ? val[0] ?? "" : val)}
            />

            <div className="space-y-1.5">
              <Label htmlFor="tmName">Full name *</Label>
              <Input
                id="tmName"
                placeholder="e.g. Md. Rafiqul Islam"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tmDesignation">Designation *</Label>
              <Input
                id="tmDesignation"
                placeholder="e.g. Managing Director & CEO"
                value={form.designation}
                onChange={(e) => set("designation", e.target.value)}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="tmGroup">Show as</Label>
                <Select id="tmGroup" value={form.group} onChange={(e) => set("group", e.target.value as Group)}>
                  <option value="leadership">Leadership (large card)</option>
                  <option value="department">Department head</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tmOrder">Display order</Label>
                <Input
                  id="tmOrder"
                  type="number"
                  value={form.order}
                  onChange={(e) => set("order", parseInt(e.target.value, 10) || 0)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/10 p-3">
              <div>
                <p className="text-sm font-semibold text-navy-900">Show on website</p>
                <p className="text-xs text-muted-foreground">Lower order numbers appear first.</p>
              </div>
              <Switch checked={form.isActive} onCheckedChange={(v) => set("isActive", v)} />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <LoaderCircle className="mr-1 size-4 animate-spin" />}
                {editingId ? "Save Changes" : "Add Member"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Remove team member?"
        description="They will be removed from the About page, and their uploaded photo deleted."
        confirmText="Yes, Remove"
        variant="destructive"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
