"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Images,
  BookOpen,
  MessageSquareQuote,
  Users,
  Settings,
  PanelLeftClose,
  PanelLeft,
  Menu,
  X,
  ExternalLink,
  Shield,
  UserCheck,
  Film,
  HardHat,
  UsersRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "./logout-button";
import { Toaster } from "@/components/ui/sonner";

interface AdminShellProps {
  admin: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "editor";
  };
  children: React.ReactNode;
}

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Banners",
    href: "/admin/banners",
    icon: Film,
  },
  {
    title: "Projects",
    href: "/admin/projects",
    icon: Building2,
  },
  {
    title: "Construction",
    href: "/admin/constructions",
    icon: HardHat,
  },
  {
    title: "Gallery",
    href: "/admin/gallery",
    icon: Images,
  },
  {
    title: "Blog",
    href: "/admin/blog",
    icon: BookOpen,
  },
  {
    title: "Team",
    href: "/admin/team",
    icon: UsersRound,
  },
  {
    title: "Testimonials",
    href: "/admin/testimonials",
    icon: MessageSquareQuote,
  },
  {
    title: "Leads",
    href: "/admin/leads",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminShell({ admin, children }: AdminShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Close mobile drawer on navigation
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const currentNavItem = navItems.find((item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)
  ) ?? navItems[0];

  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans">
      <Toaster />

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-navy-950 text-white p-4 transition-transform duration-300 md:hidden flex flex-col justify-between shadow-2xl",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-navy-800 pb-4">
            <Link href="/admin" className="flex items-center gap-2.5 font-bold tracking-tight text-white">
              <div className="flex size-8 items-center justify-center rounded-lg bg-mint text-navy-950 font-black text-sm">
                U
              </div>
              <div>
                <p className="text-sm font-semibold leading-none">UPAYON</p>
                <p className="text-[10px] tracking-widest text-mint uppercase">Holdings Admin</p>
              </div>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-md p-1.5 text-navy-400 hover:bg-navy-800 hover:text-white"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-navy-800 text-mint font-semibold shadow-xs"
                      : "text-white/70 hover:bg-navy-900 hover:text-white"
                  )}
                >
                  <Icon className={cn("size-4 shrink-0", active ? "text-mint" : "text-white/60")} />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-navy-800 pt-4">
          <div className="flex items-center justify-between text-xs text-white/60 px-2 py-1">
            <span>Role:</span>
            <Badge variant="mint" className="capitalize text-[10px] py-0 px-2">
              {admin.role}
            </Badge>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "hidden md:flex flex-col justify-between border-r border-border bg-navy-950 text-white transition-all duration-300 sticky top-0 h-screen z-30 shrink-0",
            collapsed ? "w-18" : "w-64"
          )}
        >
          {/* Sidebar Header */}
          <div>
            <div className="h-16 flex items-center justify-between border-b border-navy-800/80 px-4">
              {!collapsed && (
                <Link href="/admin" className="flex items-center gap-2.5 font-bold tracking-tight text-white overflow-hidden">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-mint text-navy-950 font-black text-sm">
                    U
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-semibold leading-none">UPAYON</p>
                    <p className="text-[10px] tracking-widest text-mint uppercase">Admin Panel</p>
                  </div>
                </Link>
              )}
              {collapsed && (
                <Link href="/admin" className="mx-auto flex size-8 items-center justify-center rounded-lg bg-mint text-navy-950 font-black text-sm">
                  U
                </Link>
              )}

              <button
                type="button"
                onClick={() => setCollapsed(!collapsed)}
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                className={cn(
                  "rounded-md p-1.5 text-white/60 hover:bg-navy-800 hover:text-white transition-colors",
                  collapsed && "hidden"
                )}
              >
                <PanelLeftClose className="size-4" />
              </button>
            </div>

            {/* Sidebar Navigation */}
            <nav className="p-3 space-y-1">
              {navItems.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.title : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all group",
                      active
                        ? "bg-navy-800 text-mint font-semibold shadow-inner"
                        : "text-white/70 hover:bg-navy-900 hover:text-white",
                      collapsed && "justify-center px-0 py-2.5"
                    )}
                  >
                    <Icon className={cn("size-4 shrink-0 transition-transform group-hover:scale-110", active ? "text-mint" : "text-white/60")} />
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-navy-800/80">
            {collapsed ? (
              <button
                type="button"
                onClick={() => setCollapsed(false)}
                className="w-full flex justify-center py-2 text-white/60 hover:text-white rounded-md hover:bg-navy-800"
                title="Expand sidebar"
              >
                <PanelLeft className="size-4" />
              </button>
            ) : (
              <div className="rounded-lg bg-navy-900/80 p-2.5 border border-navy-800/80">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-full bg-navy-800 text-white font-medium text-xs">
                    {admin.role === "admin" ? <Shield className="size-3.5 text-mint" /> : <UserCheck className="size-3.5 text-amber-400" />}
                  </div>
                  <div className="truncate text-xs">
                    <p className="font-medium text-white truncate">{admin.name}</p>
                    <p className="text-white/50 text-[11px] capitalize">{admin.role}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Top Bar */}
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-white/95 backdrop-blur-xs px-4 sm:px-6 shadow-xs">
            <div className="flex items-center gap-3">
              {/* Mobile menu trigger */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" />
              </button>

              {/* Title / Breadcrumb */}
              <div>
                <h1 className="text-base sm:text-lg font-bold text-navy-900 leading-tight">
                  {currentNavItem.title}
                </h1>
                <p className="hidden sm:block text-xs text-muted-foreground">
                  Upayon Holdings Management Portal
                </p>
              </div>
            </div>

            {/* Top Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-navy-900 transition-colors px-2 py-1 rounded-md hover:bg-muted"
              >
                <span>Live Site</span>
                <ExternalLink className="size-3.5" />
              </Link>

              <div className="hidden sm:flex flex-col text-right leading-tight border-r border-border pr-3">
                <span className="text-xs font-semibold text-navy-900">{admin.name}</span>
                <span className="text-[11px] text-muted-foreground capitalize font-medium">{admin.role}</span>
              </div>

              <LogoutButton />
            </div>
          </header>

          {/* Main Page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
