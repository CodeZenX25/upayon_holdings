import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/components/social-icons";
import { siteConfig } from "@/lib/site-config";

const storyLinks = [
  { href: "/about", label: "About Upayon" },
  { href: "/about", label: "Management" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Insights & blog" },
  { href: "/contact", label: "Careers" },
];

const developmentLinks = [
  { href: "/projects?status=ongoing", label: "Ongoing projects" },
  { href: "/projects?status=upcoming", label: "Upcoming projects" },
  { href: "/projects?status=completed", label: "Completed projects" },
  { href: "/#models", label: "Land share" },
  { href: "/#models", label: "Flat share" },
];

const socials = [
  { label: "Facebook", Icon: FacebookIcon },
  { label: "Instagram", Icon: InstagramIcon },
  { label: "LinkedIn", Icon: LinkedinIcon },
  { label: "YouTube", Icon: YoutubeIcon },
];

export function SiteFooter() {
  return (
    // Light surface + ONE accent (logo purple), no gradients — matches the home sections.
    <footer className="relative z-10 overflow-hidden border-t border-navy-900/10 bg-white text-navy-900">
      {/* Faint brand watermark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[0.18em] left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-[26vw] font-extrabold leading-none tracking-tight text-navy-900/[0.035] lg:text-[19vw]"
      >
        UPAYON
      </span>

      <div className="relative mx-auto grid max-w-[1240px] gap-12 px-5 pb-14 pt-16 sm:pt-20 md:grid-cols-2 md:px-8 lg:grid-cols-[1.3fr_0.8fr_0.9fr_1.4fr] lg:gap-10">
        <div>
          <BrandLogo />
          <p className="mt-6 max-w-xs text-[15.5px] leading-[1.8] text-slate-600">
            Connecting people and their dream homes with transparent land-share
            and flat-share ownership across Dhaka.
          </p>
          <ul className="mt-7 space-y-3.5 text-[15px] font-medium text-navy-900">
            <li>
              <a href={siteConfig.phoneHref} className="group flex items-center gap-3 transition-colors hover:text-brand-purple">
                <FooterIcon Icon={Phone} />
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                className="group flex items-center gap-3 break-all transition-colors hover:text-brand-purple"
              >
                <FooterIcon Icon={Mail} />
                {siteConfig.email}
              </a>
            </li>
          </ul>
        </div>

        <FooterColumn title="Our story" links={storyLinks} />
        <FooterColumn title="Developments" links={developmentLinks} />

        <div className="md:col-span-2 lg:col-span-1">
          {/* Office address */}
          <p className="inline-flex items-center gap-3 text-[12.5px] font-bold uppercase tracking-[0.22em] text-brand-purple">
            <span aria-hidden="true" className="h-0.5 w-6 bg-brand-purple" />
            Visit our office
          </p>
          <address className="mt-5 not-italic">
            <a
              href={siteConfig.mapDirectionsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <span className="flex items-center gap-2.5 font-serif text-[30px] font-semibold italic leading-tight text-navy-900 transition-colors group-hover:text-brand-purple sm:text-[34px]">
                <MapPin className="size-6 shrink-0 text-brand-purple" aria-hidden="true" />
                Upayon Group
              </span>
              {/* Non-breaking hyphens keep "House-342" / "Road-5" on one line */}
              <span className="mt-2 block text-[17px] font-medium leading-relaxed text-slate-600 sm:text-[18px]">
                House{"‑"}342, Road{"‑"}5, Avenue 3,
                <br />
                Mirpur DOHS, Dhaka 1216
              </span>
              <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-[0.12em] text-brand-purple">
                Get directions
                <ArrowUpRight
                  className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </a>
          </address>
          <div className="mt-7 flex gap-3">
            {socials.map(({ label, Icon }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="grid size-11 place-items-center rounded-full bg-brand-purple/10 text-brand-purple transition duration-300 hover:-translate-y-1 hover:bg-brand-purple hover:text-white"
              >
                <Icon className="size-[18px]" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="relative border-t border-navy-900/10">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-2 px-5 py-6 text-[13.5px] text-slate-500 md:flex-row md:items-center md:justify-between md:px-8">
          <p>© {new Date().getFullYear()} Upayon Holdings. All rights reserved.</p>
          <p>Member of REHAB · Approved by RAJUK · Dhaka, Bangladesh</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="inline-flex items-center gap-3 text-[12.5px] font-bold uppercase tracking-[0.22em] text-brand-purple">
        <span aria-hidden="true" className="h-0.5 w-6 bg-brand-purple" />
        {title}
      </p>
      <ul className="mt-6 space-y-3.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-[15.5px] font-medium text-slate-600 transition-all hover:pl-1 hover:text-brand-purple"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterIcon({ Icon }: { Icon: LucideIcon }) {
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-purple/10 text-brand-purple transition-colors group-hover:bg-brand-purple group-hover:text-white">
      <Icon className="size-4" aria-hidden="true" />
    </span>
  );
}
