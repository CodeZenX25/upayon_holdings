"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Users,
  Search,
  Download,
  Phone,
  Mail,
  Calendar,
  Building2,
  Trash2,
  FileText,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export interface LeadData {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  inquiryType: "land-share" | "flat-share" | "general" | "site-visit";
  message: string;
  status: "new" | "contacted" | "closed";
  notes: string;
  createdAt: string;
  project?: {
    _id: string;
    title: string;
    slug: string;
  };
}

export function LeadsView() {
  const [leads, setLeads] = React.useState<LeadData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [inquiryType, setInquiryType] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);

  // Notes Modal state
  const [selectedLead, setSelectedLead] = React.useState<LeadData | null>(null);
  const [notesDraft, setNotesDraft] = React.useState("");
  const [statusDraft, setStatusDraft] = React.useState<LeadData["status"]>("new");
  const [savingNotes, setSavingNotes] = React.useState(false);

  // Delete state
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  // Export state
  const [exporting, setExporting] = React.useState(false);

  const fetchLeads = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search,
        status,
        inquiryType,
        page: page.toString(),
        limit: "10",
      });
      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch leads");
      const data = await res.json();
      setLeads(data.leads || []);
      setTotalPages(data.pagination.totalPages || 1);
      setTotalCount(data.pagination.total || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [search, status, inquiryType, page]);

  React.useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Quick inline status change
  const handleQuickStatusChange = async (
    leadId: string,
    newStatus: LeadData["status"]
  ) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");

      toast.success(`Lead marked as ${newStatus}`);
      setLeads((prev) =>
        prev.map((l) => (l._id === leadId ? { ...l, status: newStatus } : l))
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  // Save notes and status in modal
  const handleSaveModal = async () => {
    if (!selectedLead) return;
    try {
      setSavingNotes(true);
      const res = await fetch(`/api/admin/leads/${selectedLead._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes: notesDraft,
          status: statusDraft,
        }),
      });
      if (!res.ok) throw new Error("Failed to update lead notes");

      toast.success("Lead notes updated successfully!");
      setSelectedLead(null);
      fetchLeads();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save changes");
    } finally {
      setSavingNotes(false);
    }
  };

  // Delete lead
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/leads/${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete lead");
      }
      toast.success("Lead deleted successfully");
      setDeleteId(null);
      fetchLeads();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to delete lead");
    } finally {
      setDeleting(false);
    }
  };

  // Export to CSV
  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const params = new URLSearchParams({
        search,
        status,
        inquiryType,
        export: "true",
      });
      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch leads for export");
      const data = await res.json();
      const exportList: LeadData[] = data.leads || [];

      if (exportList.length === 0) {
        toast.info("No leads available to export matching current filters");
        return;
      }

      // Generate CSV string
      const headers = [
        "ID",
        "Client Name",
        "Phone",
        "Email",
        "Inquiry Type",
        "Project",
        "Status",
        "Message",
        "Internal Notes",
        "Submission Date",
      ];

      const escapeCSV = (str: string | undefined | null) => {
        if (!str) return '""';
        return `"${str.replace(/"/g, '""').replace(/\n/g, " ")}"`;
      };

      const rows = exportList.map((l) => [
        escapeCSV(l._id),
        escapeCSV(l.name),
        escapeCSV(l.phone),
        escapeCSV(l.email || ""),
        escapeCSV(l.inquiryType),
        escapeCSV(l.project?.title || "N/A"),
        escapeCSV(l.status),
        escapeCSV(l.message),
        escapeCSV(l.notes),
        escapeCSV(new Date(l.createdAt).toLocaleString()),
      ]);

      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      const dateStr = new Date().toISOString().split("T")[0];
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `upayon_leads_${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${exportList.length} leads to CSV!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to export CSV");
    } finally {
      setExporting(false);
    }
  };

  const openLeadModal = (lead: LeadData) => {
    setSelectedLead(lead);
    setNotesDraft(lead.notes || "");
    setStatusDraft(lead.status);
  };

  const getStatusBadge = (st: LeadData["status"]) => {
    switch (st) {
      case "new":
        return <Badge variant="info">New</Badge>;
      case "contacted":
        return <Badge variant="warning">Contacted</Badge>;
      case "closed":
        return <Badge variant="success">Closed</Badge>;
      default:
        return <Badge variant="outline">{st}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-navy-900 tracking-tight">
            Client Inquiries & Leads
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Track prospective share buyers, update follow-up statuses, and log internal call notes.
          </p>
        </div>

        <Button
          onClick={handleExportCSV}
          disabled={exporting}
          variant="outline"
          className="gap-1.5 shadow-2xs"
        >
          {exporting ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Download className="size-4 text-primary" />
          )}
          <span>Export to CSV</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-border shadow-xs">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative sm:col-span-1">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search name, phone, message, notes..."
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
                <option value="new">New Inquiries</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed / Converted</option>
              </Select>
            </div>

            <div>
              <Select
                value={inquiryType}
                onChange={(e) => {
                  setInquiryType(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All Inquiry Types</option>
                <option value="flat-share">Flat Share</option>
                <option value="land-share">Land Share</option>
                <option value="site-visit">Site Visit</option>
                <option value="general">General Inquiry</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="border-border shadow-xs overflow-hidden">
        <CardHeader className="py-3 px-6 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Showing {leads.length} of {totalCount} total inquiries
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : leads.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Users className="size-10 mx-auto text-muted-foreground/60" />
              <p className="text-sm font-medium text-navy-900">No leads found</p>
              <p className="text-xs text-muted-foreground">
                Inquiries submitted via website contact and project forms will appear here.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Inquiry Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead._id}>
                    <TableCell>
                      <div className="font-semibold text-navy-900">{lead.name}</div>
                      {lead.project && (
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Building2 className="size-3 shrink-0" />
                          {lead.project.title}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1 text-navy-900 font-medium">
                          <Phone className="size-3 text-muted-foreground" />
                          {lead.phone}
                        </span>
                        {lead.email && (
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Mail className="size-3" />
                            {lead.email}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize text-[11px]">
                        {lead.inquiryType.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="w-28">
                        <Select
                          className="h-7 text-xs font-medium"
                          value={lead.status}
                          onChange={(e) =>
                            handleQuickStatusChange(
                              lead._id,
                              e.target.value as LeadData["status"]
                            )
                          }
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      {lead.notes ? (
                        <p className="text-xs text-muted-foreground truncate" title={lead.notes}>
                          {lead.notes}
                        </p>
                      ) : (
                        <span className="text-[11px] text-muted-foreground/60 italic">
                          No notes
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {new Date(lead.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => openLeadModal(lead)}
                          className="text-xs"
                        >
                          <FileText className="size-3" />
                          Notes
                        </Button>
                        <Button
                          size="icon-xs"
                          variant="ghost"
                          onClick={() => setDeleteId(lead._id)}
                          title="Delete lead"
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

      {/* Details & Notes Dialog */}
      <Dialog
        open={Boolean(selectedLead)}
        onOpenChange={(open) => !open && setSelectedLead(null)}
      >
        {selectedLead && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <div className="flex items-center justify-between pr-6">
                <DialogTitle className="text-lg font-bold text-navy-900">
                  {selectedLead.name}
                </DialogTitle>
                {getStatusBadge(selectedLead.status)}
              </div>
              <DialogDescription>
                Submitted on {new Date(selectedLead.createdAt).toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-sm mt-1">
              <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/30 p-3 text-xs border border-border">
                <div>
                  <span className="text-muted-foreground block font-medium">Phone</span>
                  <span className="font-semibold text-navy-900">{selectedLead.phone}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Email</span>
                  <span className="font-semibold text-navy-900">{selectedLead.email || "N/A"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Inquiry Type</span>
                  <span className="font-semibold capitalize text-navy-900">
                    {selectedLead.inquiryType.replace("-", " ")}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-medium">Interested Project</span>
                  <span className="font-semibold text-navy-900">
                    {selectedLead.project?.title || "General Portfolio Inquiry"}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Customer Message
                </span>
                <p className="rounded-lg border border-border p-3 text-xs leading-relaxed bg-white">
                  {selectedLead.message}
                </p>
              </div>

              {/* Status Selector */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-navy-900 block">
                  Lead Status
                </span>
                <Select
                  value={statusDraft}
                  onChange={(e) =>
                    setStatusDraft(e.target.value as LeadData["status"])
                  }
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed / Converted</option>
                </Select>
              </div>

              {/* Follow-up Notes */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-navy-900 block">
                  Internal Follow-up Notes
                </span>
                <Textarea
                  rows={4}
                  placeholder="Record customer preferences, budget, call summary, meeting dates..."
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedLead(null)}
                  disabled={savingNotes}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveModal} disabled={savingNotes}>
                  {savingNotes && <LoaderCircle className="size-4 animate-spin mr-1" />}
                  Save Notes
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Delete Lead Confirm Dialog */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Inquiry?"
        description="This will permanently delete this client submission and recorded notes."
        confirmText="Yes, Delete"
        variant="destructive"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
