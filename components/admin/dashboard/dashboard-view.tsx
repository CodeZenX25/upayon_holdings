"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  FileText,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DashboardData {
  projectStats: {
    ongoing: number;
    upcoming: number;
    completed: number;
    total: number;
  };
  leadStats: {
    total: number;
    newThisWeek: number;
    new: number;
    contacted: number;
    closed: number;
  };
  blogStats: {
    published: number;
    draft: number;
    total: number;
  };
  galleryCount: number;
  latestLeads: Array<{
    _id: string;
    name: string;
    phone: string;
    email?: string;
    inquiryType: string;
    message: string;
    status: "new" | "contacted" | "closed";
    notes?: string;
    createdAt: string;
    project?: {
      _id: string;
      title: string;
      slug: string;
    };
  }>;
}

export function DashboardView() {
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedLead, setSelectedLead] = React.useState<DashboardData["latestLeads"][0] | null>(null);

  const fetchDashboard = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/dashboard");
      if (!res.ok) {
        throw new Error("Failed to load dashboard metrics");
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const leadStatusBadge = (status: "new" | "contacted" | "closed") => {
    switch (status) {
      case "new":
        return <Badge variant="info">New</Badge>;
      case "contacted":
        return <Badge variant="warning">Contacted</Badge>;
      case "closed":
        return <Badge variant="success">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>

        {/* Stat cards skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-16 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-3 w-48" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Latest leads skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="border-destructive/30 bg-destructive/5 text-destructive p-6 text-center space-y-4">
        <AlertCircle className="size-10 mx-auto text-destructive" />
        <div>
          <h2 className="text-lg font-bold">Failed to load dashboard</h2>
          <p className="text-sm mt-1">{error ?? "Unknown error"}</p>
        </div>
        <Button variant="outline" onClick={fetchDashboard}>
          Try Again
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-navy-900 tracking-tight">Overview</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Current portfolio performance, recent leads, and operational status.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/projects?create=true"
            className={cn(buttonVariants({ size: "sm" }), "bg-primary hover:bg-navy-800 text-white gap-1.5")}
          >
            <PlusCircle className="size-3.5" />
            Add Project
          </Link>
          <Link
            href="/admin/blog?create=true"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
          >
            <FileText className="size-3.5" />
            New Post
          </Link>
        </div>
      </div>

      {/* Primary Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Project Stats Card */}
        <Card className="border-border shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Total Projects
            </CardTitle>
            <div className="flex size-9 items-center justify-center rounded-lg bg-navy-50 text-primary">
              <Building2 className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-navy-900">
              {data.projectStats.total}
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <span className="inline-flex items-center gap-1 font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                <TrendingUp className="size-3" />
                {data.projectStats.ongoing} Ongoing
              </span>
              <span className="inline-flex items-center gap-1 font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                <Clock className="size-3" />
                {data.projectStats.upcoming} Upcoming
              </span>
              <span className="inline-flex items-center gap-1 font-medium text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="size-3" />
                {data.projectStats.completed} Completed
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Leads Stats Card */}
        <Card className="border-border shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              New Leads This Week
            </CardTitle>
            <div className="flex size-9 items-center justify-center rounded-lg bg-mint/30 text-navy-900">
              <Users className="size-4 text-navy-900" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-navy-900">
              {data.leadStats.newThisWeek}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {data.leadStats.total} total inquiries captured
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs flex-wrap">
              <Badge variant="info">{data.leadStats.new} New</Badge>
              <Badge variant="warning">{data.leadStats.contacted} Contacted</Badge>
              <Badge variant="success">{data.leadStats.closed} Closed</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Blog Stats Card */}
        <Card className="border-border shadow-xs hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Published Blogs
            </CardTitle>
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <BookOpen className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-navy-900">
              {data.blogStats.published}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Out of {data.blogStats.total} total articles ({data.blogStats.draft} draft{data.blogStats.draft === 1 ? "" : "s"})
            </p>
            <div className="mt-3 flex items-center justify-between text-xs pt-1 border-t border-border/50">
              <span className="text-muted-foreground">Gallery Assets</span>
              <span className="font-semibold text-navy-900">{data.galleryCount} items</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Latest 5 Leads Table */}
      <Card className="border-border shadow-xs overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 bg-muted/20 px-6 py-4">
          <div>
            <CardTitle className="text-base font-bold text-navy-900">
              Latest Inquiries & Leads
            </CardTitle>
            <CardDescription className="text-xs">
              Showing the 5 most recent prospective client submissions
            </CardDescription>
          </div>
          <Link
            href="/admin/leads"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1 text-xs")}
          >
            <span>View all leads</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {data.latestLeads.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No leads received yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Client Name</TableHead>
                  <TableHead className="font-semibold">Contact</TableHead>
                  <TableHead className="font-semibold">Interest</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.latestLeads.map((lead) => (
                  <TableRow key={lead._id} className="cursor-pointer hover:bg-muted/40">
                    <TableCell className="font-medium text-navy-900">
                      {lead.name}
                      {lead.project && (
                        <p className="text-[11px] text-muted-foreground line-clamp-1">
                          Re: {lead.project.title}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1 text-navy-900">
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
                    <TableCell>{leadStatusBadge(lead.status)}</TableCell>
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
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => setSelectedLead(lead)}
                        className="text-xs text-primary hover:text-navy-950 font-medium"
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick view lead dialog */}
      <Dialog open={Boolean(selectedLead)} onOpenChange={(open) => !open && setSelectedLead(null)}>
        {selectedLead && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="flex items-center justify-between pr-6">
                <DialogTitle className="text-lg font-bold">{selectedLead.name}</DialogTitle>
                {leadStatusBadge(selectedLead.status)}
              </div>
              <DialogDescription>
                Submitted on {new Date(selectedLead.createdAt).toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-sm mt-2">
              <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-3 text-xs">
                <div>
                  <span className="text-muted-foreground block">Phone</span>
                  <span className="font-semibold text-navy-900">{selectedLead.phone}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Email</span>
                  <span className="font-semibold text-navy-900">{selectedLead.email || "N/A"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Inquiry Type</span>
                  <span className="font-semibold capitalize text-navy-900">
                    {selectedLead.inquiryType.replace("-", " ")}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Interested Project</span>
                  <span className="font-semibold text-navy-900">
                    {selectedLead.project?.title || "General Inquiry"}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Message
                </span>
                <p className="rounded-lg border border-border p-3 text-xs leading-relaxed bg-white">
                  {selectedLead.message}
                </p>
              </div>

              {selectedLead.notes && (
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                    Internal Notes
                  </span>
                  <p className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-900">
                    {selectedLead.notes}
                  </p>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <Link
                  href="/admin/leads"
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  Go to Leads Manager
                </Link>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
