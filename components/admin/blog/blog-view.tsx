"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { BlogDialog, type BlogData } from "./blog-dialog";

export function BlogView() {
  const searchParams = useSearchParams();
  const [blogs, setBlogs] = React.useState<BlogData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [category, setCategory] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);

  // Dialogs
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingBlog, setEditingBlog] = React.useState<BlogData | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  // Check URL query param ?create=true
  React.useEffect(() => {
    if (searchParams.get("create") === "true") {
      setEditingBlog(null);
      setDialogOpen(true);
    }
  }, [searchParams]);

  const fetchBlogs = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search,
        status,
        category,
        page: page.toString(),
        limit: "10",
      });
      const res = await fetch(`/api/admin/blogs?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch blogs");
      const data = await res.json();
      setBlogs(data.blogs || []);
      setTotalPages(data.pagination.totalPages || 1);
      setTotalCount(data.pagination.total || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load blog articles");
    } finally {
      setLoading(false);
    }
  }, [search, status, category, page]);

  React.useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/blogs/${deleteId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete article");
      }
      toast.success("Blog article deleted successfully");
      setDeleteId(null);
      fetchBlogs();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to delete article");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-navy-900 tracking-tight">
            Blog & Insights
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Author and publish real estate articles, property investment guides, and news.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingBlog(null);
            setDialogOpen(true);
          }}
          className="gap-1.5 bg-primary text-white hover:bg-navy-800"
        >
          <Plus className="size-4" />
          <span>New Article</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-border shadow-xs">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative sm:col-span-1">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search articles by title, author..."
                className="pl-8"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div>
              <Select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </Select>
            </div>

            <div>
              <Select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All Categories</option>
                <option value="Investment Guide">Investment Guide</option>
                <option value="Market Update">Market Update</option>
                <option value="Architecture">Architecture</option>
                <option value="Lifestyle">Lifestyle</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blog Table */}
      <Card className="border-border shadow-xs overflow-hidden">
        <CardHeader className="py-3 px-6 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Showing {blogs.length} of {totalCount} articles
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="size-12 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <BookOpen className="size-10 mx-auto text-muted-foreground/60" />
              <p className="text-sm font-medium text-navy-900">No blog posts found</p>
              <p className="text-xs text-muted-foreground">
                Write your first article to share valuable insights with prospective buyers.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Cover</TableHead>
                  <TableHead>Article Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((b) => (
                  <TableRow key={b._id}>
                    <TableCell>
                      <div className="size-12 rounded-lg overflow-hidden border border-border bg-muted">
                        <img
                          src={b.coverImage}
                          alt={b.title}
                          className="size-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-navy-900 max-w-sm truncate" title={b.title}>
                        {b.title}
                      </div>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        /blog/{b.slug}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[11px]">
                        {b.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="size-3" />
                        {b.author}
                      </span>
                    </TableCell>
                    <TableCell>
                      {b.isPublished ? (
                        <Badge variant="success">Published</Badge>
                      ) : (
                        <Badge variant="warning">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {b.publishedAt
                          ? new Date(b.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Not set"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          onClick={() => {
                            setEditingBlog(b);
                            setDialogOpen(true);
                          }}
                          title="Edit article"
                        >
                          <Edit2 className="size-3.5 text-navy-800" />
                        </Button>
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          onClick={() => setDeleteId(b._id!)}
                          title="Delete article"
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-6 py-3">
              <span className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="size-3.5" />
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Next
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Blog Dialog */}
      <BlogDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        blog={editingBlog}
        onSuccess={fetchBlogs}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Article?"
        description="This blog post and its published content will be permanently removed. This cannot be undone."
        confirmText="Yes, Delete"
        variant="destructive"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
