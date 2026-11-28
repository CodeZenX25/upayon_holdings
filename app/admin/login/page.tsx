import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { LoginForm } from "@/components/admin/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { safeAdminRedirect } from "@/lib/auth/redirect";
import { getCurrentAdmin } from "@/lib/auth/server";

export const metadata: Metadata = {
  title: { absolute: "Admin sign in · Upayon Holdings" },
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;
  const redirectTo = safeAdminRedirect(next);

  // Already signed in (checked against the DB, not just the cookie).
  if (await getCurrentAdmin().catch(() => null)) {
    redirect(redirectTo);
  }

  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden bg-paper px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 size-[520px] rounded-full bg-navy-600/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-40 size-[520px] rounded-full bg-gold/20 blur-3xl"
      />

      <div className="relative w-full max-w-[420px]">
        <div className="mb-8 flex justify-center">
          <BrandLogo />
        </div>

        <Card className="gap-6 rounded-2xl bg-white py-8 shadow-[0_30px_80px_-30px_rgba(17,20,58,0.35)] ring-navy-900/10">
          <CardHeader className="px-8">
            <CardTitle className="text-2xl font-extrabold text-navy-900">
              Welcome back
            </CardTitle>
            <CardDescription className="text-[15px] leading-relaxed">
              Sign in to manage projects, leads and site content.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8">
            <LoginForm redirectTo={redirectTo} />
          </CardContent>
        </Card>

        <p className="mt-6 flex items-center justify-center gap-2 text-[13px] text-slate-500">
          <ShieldCheck className="size-4" aria-hidden="true" />
          Authorised staff only. Activity may be logged.
        </p>
      </div>
    </main>
  );
}
