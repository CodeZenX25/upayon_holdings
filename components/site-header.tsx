"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarDays, Menu, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNav, siteConfig } from "@/lib/site-config";
import { BrandLogo } from "@/components/brand-logo";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const transparent = isHome && !scrolled && !menuOpen;

  function isActive(href: string) {
    if (href.startsWith("/#")) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      {!isHome && <div aria-hidden="true" className="h-[88px]" />}
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6">
        <div
          className={cn(
            "mx-auto flex h-[68px] max-w-[1320px] items-center justify-between gap-4 rounded-full px-4 transition-all duration-500 md:px-6",
            transparent
              ? "bg-white/5 text-white ring-1 ring-white/15 backdrop-blur-md"
              : "bg-white/90 text-navy-900 shadow-[0_12px_40px_-18px_rgba(17,20,58,0.35)] ring-1 ring-navy-900/5 backdrop-blur-xl",
          )}
        >
          <Link href="/" aria-label="Upayon Holdings home" className="shrink-0">
            <BrandLogo light={transparent} />
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 xl:flex"
          >
            {mainNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "whitespace-nowrap rounded-full px-3.5 py-2 text-[14px] font-medium tracking-wide transition-colors",
                  isActive(link.href)
                    ? transparent
                      ? "bg-white/15"
                      : "bg-brand-purple text-white"
                    : transparent
                      ? "text-white/85 hover:bg-white/10 hover:text-white"
                      : "text-navy-900/75 hover:bg-brand-purple/10 hover:text-brand-purple",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 xl:flex">
            <a
              href={siteConfig.phoneHref}
              className="flex items-center gap-2.5 text-[13px] leading-tight"
            >
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-full",
                  transparent ? "bg-white/15" : "bg-brand-purple/10 text-brand-purple",
                )}
              >
                <Phone className="size-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block opacity-70">Call us</span>
                <span className="whitespace-nowrap font-semibold">{siteConfig.phone}</span>
              </span>
            </a>
            <Link
              href="/contact"
              className={cn(
                "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-3 text-[13px] font-bold uppercase tracking-[0.08em] transition hover:-translate-y-0.5",
                transparent
                  ? "bg-white text-brand-purple hover:bg-white/90"
                  : "bg-brand-purple text-white hover:bg-navy-900",
              )}
            >
              <CalendarDays className="size-4" aria-hidden="true" />
              Book a visit
            </Link>
          </div>

          <button
            type="button"
            className={cn(
              "grid size-11 place-items-center rounded-full xl:hidden",
              transparent ? "bg-white/15" : "bg-brand-purple text-white",
            )}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          inert={!menuOpen}
          className={cn(
            "mx-auto mt-2 max-w-[1320px] origin-top overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 xl:hidden",
            menuOpen
              ? "pointer-events-auto scale-100 opacity-100"
              : "pointer-events-none scale-95 opacity-0",
          )}
        >
          <div className="flex flex-col p-3">
            {mainNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "rounded-2xl px-4 py-3 text-[17px] font-semibold",
                  isActive(link.href)
                    ? "bg-brand-purple/10 text-brand-purple"
                    : "text-navy-900 hover:bg-paper",
                )}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={siteConfig.phoneHref}
              className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-brand-purple px-4 py-3.5 font-semibold text-white"
            >
              <Phone className="size-4" aria-hidden="true" /> {siteConfig.phone}
            </a>
          </div>
        </nav>
      </header>
    </>
  );
}
