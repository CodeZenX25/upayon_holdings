"use client";

import * as React from "react";
import { toast } from "sonner";
import { Edit2, ExternalLink, HardHat, LoaderCircle, MapPin, Plus, Search, Sparkles, Trash2 } from "lucide-react";
import { ImageUploader } from "@/components/admin/image-uploader";
import { BrochureUploader } from "@/components/admin/brochure-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

type Status = "ongoing" | "upcoming" | "completed";
type Kind = "residential" | "commercial" | "industrial" | "institutional" | "mixed-use";

interface ConstructionData {
  _id?: string;
  title: string;
  slug: string;
  status: Status;
  constructionType: Kind;
  projectCode?: string;
  location: string;
  address?: string;
  buildingHeight?: string;
  description: string;
  coverImage: string;
  images: string[];
  brochureUrl?: string;
  order: number;
  isPublished: boolean;
}

const empty: ConstructionData = {
  title: "",
  slug: "",
  status: "ongoing",
  constructionType: "residential",
  projectCode: "",
  location: "",
  address: "",
  buildingHeight: "",
  description: "",
  coverImage: "",
  images: [],
  brochureUrl: "",
  order: 0,
  isPublished: true,
};

const statusOptions: { value: Status; label: string }[] = [
  { value: "ongoing", label: "Ongoing" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
];

const typeOptions: { value: Kind; label: string }[] = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "industrial", label: "Industrial" },
  { value: "institutional", label: "Institutional" },
  { value: "mixed-use", label: "Mixed-use" },
];

const statusBadge: Record<Status, string> = {
  ongoing: "bg-brand-purple/10 text-brand-purple",
  upcoming: "bg-amber-100 text-amber-800",
  completed: "bg-emerald-100 text-emerald-800",
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function ConstructionsView() {
  const [items, setItems] = React.useState<ConstructionData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | Status>("all");

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<ConstructionData>(empty);
  const [submitting, setSubmitting] = React.useState(false);

  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const load = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/admin/constructions?${params.toString()}`);
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { constructions?: ConstructionData[] };
      setItems(data.constructions ?? []);
    } catch {
      toast.error("Failed to load constructions");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  React.useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const set = <K extends keyof ConstructionData>(key: K, value: ConstructionData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const openCreate = () => {
    setEditingId(null);
    setForm(empty);
    setDialogOpen(true);
  };

  const openEdit = (item: ConstructionData) => {
    setEditingId(item._id ?? null);
    setForm({ ...empty, ...item, images: item.images ?? [] });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.slug.trim()) return toast.error("Slug is required — click Auto Slug");
    if (!form.location.trim()) return toast.error("Location is required");
    if (!form.coverImage.trim()) return toast.error("Cover image is required");

    try {
      setSubmitting(true);
      const res = await fetch(editingId ? `/api/admin/constructions/${editingId}` : "/api/admin/constructions", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, order: Number(form.order) || 0 }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) throw new Error(data.message || "Failed to save");
      toast.success(editingId ? "Construction updated!" : "Construction added!");
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
      const res = await fetch(`/api/admin/constructions/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Construction removed");
      setDeleteId(null);
      load();
    } catch {
      toast.error("Failed to delete construction");
    } finally {
      setDeleting(false);
    }
  };

  const togglePublished = async (item: ConstructionData) => {
    try {
      const res = await fetch(`/api/admin/constructions/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, isPublished: !item.isPublished }),
      });
      if (!res.ok) throw new Error();
      toast.success(item.isPublished ? "Hidden from website" : "Published on website");
      load();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-navy-900">Construction</h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Buildings Upayon constructs — shown on the public Construction page.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-1.5">
          <Plus className="size-4" />
          Add Construction
        </Button>
      </div>

      <Card className="border-border shadow-xs">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title, location, project ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | Status)}
            className="sm:w-48"
          >
            <option value="all">All statuses</option>
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border shadow-xs">
        <CardHeader className="border-b border-border bg-muted/20 px-6 py-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            {items.length} construction{items.length === 1 ? "" : "s"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-4 p-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-16 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="space-y-3 py-16 text-center">
              <HardHat className="mx-auto size-10 text-muted-foreground/60" />
              <p className="text-sm font-medium text-navy-900">No constructions yet</p>
              <p className="text-xs text-muted-foreground">
                Until you add one, the website shows a “coming soon” message.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Construction</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-16 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                            {item.coverImage && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={item.coverImage} alt="" className="size-full object-cover" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-navy-900">{item.title}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {item.projectCode ? `${item.projectCode} · ` : ""}
                              {typeOptions.find((t) => t.value === item.constructionType)?.label}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <span className="flex items-center gap-1 text-navy-900">
                          <MapPin className="size-3 text-muted-foreground" />
                          {item.location}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${statusBadge[item.status]}`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <button type="button" onClick={() => togglePublished(item)} title="Click to toggle">
                          {item.isPublished ? (
                            <Badge variant="success">Published</Badge>
                          ) : (
                            <Badge variant="outline">Hidden</Badge>
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {item.isPublished && (
                            <a
                              href={`/construction/${item.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="grid size-6 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-navy-900"
                              title="View on website"
                            >
                              <ExternalLink className="size-3.5" />
                            </a>
                          )}
                          <Button size="icon-xs" variant="ghost" onClick={() => openEdit(item)} aria-label="Edit">
                            <Edit2 className="size-3.5" />
                          </Button>
                          <Button
                            size="icon-xs"
                            variant="ghost"
                            onClick={() => setDeleteId(item._id ?? null)}
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

      {/* Create / edit */}
      <Dialog open={dialogOpen} onOpenChange={submitting ? () => {} : setDialogOpen}>
        <DialogContent className="flex max-h-[92dvh] max-w-3xl flex-col overflow-hidden p-0 sm:max-h-[90dvh]">
          <DialogHeader className="mb-0 border-b border-border bg-muted/20 p-4 pr-12 sm:p-6 sm:pr-14">
            <DialogTitle className="text-xl font-bold text-navy-900">
              {editingId ? "Edit Construction" : "Add Construction"}
            </DialogTitle>
            <DialogDescription>Shown on the public Construction page.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="cTitle">Title *</Label>
                  <div className="flex flex-col gap-2 min-[420px]:flex-row">
                    <Input
                      id="cTitle"
                      placeholder="e.g. Green Crescent Tower"
                      value={form.title}
                      onChange={(e) => set("title", e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => set("slug", slugify(form.title))}
                      className="shrink-0 gap-1 text-xs"
                    >
                      <Sparkles className="size-3.5" />
                      Auto Slug
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cSlug">Slug (URL) *</Label>
                  <Input
                    id="cSlug"
                    placeholder="green-crescent-tower"
                    value={form.slug}
                    onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cCode">Project ID</Label>
                  <Input
                    id="cCode"
                    placeholder="e.g. UP-2025-014"
                    value={form.projectCode ?? ""}
                    onChange={(e) => set("projectCode", e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cStatus">Status *</Label>
                  <Select id="cStatus" value={form.status} onChange={(e) => set("status", e.target.value as Status)}>
                    {statusOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cType">Construction type</Label>
                  <Select
                    id="cType"
                    value={form.constructionType}
                    onChange={(e) => set("constructionType", e.target.value as Kind)}
                  >
                    {typeOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cLocation">Location (area) *</Label>
                  <Input
                    id="cLocation"
                    placeholder="e.g. Baridhara"
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cHeight">Building height</Label>
                  <Input
                    id="cHeight"
                    placeholder="e.g. B+G+9 = 10 storied"
                    value={form.buildingHeight ?? ""}
                    onChange={(e) => set("buildingHeight", e.target.value)}
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="cAddress">Full address</Label>
                  <Input
                    id="cAddress"
                    placeholder="e.g. Madani Avenue, Baridhara"
                    value={form.address ?? ""}
                    onChange={(e) => set("address", e.target.value)}
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="cDesc">Construction description</Label>
                  <Textarea
                    id="cDesc"
                    rows={4}
                    placeholder="Structure, materials, scope of work…"
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                  />
                </div>
              </div>

              <div className="border-t border-border pt-5">
                <ImageUploader
                  label="Cover image *"
                  description="Main photo for the card and detail page."
                  folder="constructions"
                  value={form.coverImage}
                  onChange={(val) => set("coverImage", Array.isArray(val) ? val[0] ?? "" : val)}
                />
              </div>

              <div className="border-t border-border pt-5">
                <ImageUploader
                  label="Gallery photos"
                  description="Shown in the Media slider on the detail page."
                  folder="constructions"
                  multiple
                  value={form.images}
                  onChange={(val) => set("images", Array.isArray(val) ? val : [val].filter(Boolean))}
                />
              </div>

              <div className="border-t border-border pt-5">
                <BrochureUploader
                  label="Brochure (PDF)"
                  description="Adds a “Download brochure” button on the detail page."
                  folder="constructions"
                  downloadName={form.title}
                  value={form.brochureUrl ?? ""}
                  onChange={(url) => set("brochureUrl", url)}
                />
              </div>

              <div className="grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="cOrder">Display order</Label>
                  <Input
                    id="cOrder"
                    type="number"
                    value={form.order}
                    onChange={(e) => set("order", parseInt(e.target.value, 10) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">Lower numbers show first.</p>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/10 p-3">
                  <div>
                    <p className="text-sm font-semibold text-navy-900">Show on website</p>
                    <p className="text-xs text-muted-foreground">Turn off to keep it as a draft.</p>
                  </div>
                  <Switch checked={form.isPublished} onCheckedChange={(v) => set("isPublished", v)} />
                </div>
              </div>
            </div>

            <DialogFooter className="mt-0 border-t border-border bg-muted/20 px-4 py-3 sm:px-6 sm:py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={submitting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                {submitting && <LoaderCircle className="mr-1 size-4 animate-spin" />}
                {editingId ? "Save Changes" : "Add Construction"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete construction?"
        description="It will be removed from the website, along with its uploaded photos and brochure."
        confirmText="Yes, Delete"
        variant="destructive"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
