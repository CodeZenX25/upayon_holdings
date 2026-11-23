import type { ReactNode } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { LogoutButton } from "@/components/admin/logout-button";
import { getCurrentAdmin } from "@/lib/auth/server";

export const metadata: Metadata = {
  title: "Admin · Upayon Holdings",
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  // Middleware already checked the JWT; this confirms the admin still exists.
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="min-h-svh bg-paper">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <BrandLogo />
          <div className="flex items-center gap-4">
            <div className="hidden text-right text-sm leading-tight sm:block">
              <p className="font-semibold text-navy-900">{admin.name}</p>
              <p className="capitalize text-muted-foreground">{admin.role}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
    </div>
  );
}
