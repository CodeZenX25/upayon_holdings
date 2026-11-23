import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
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
    <footer className="relative z-10 overflow-hidden bg-navy-950 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 size-[520px] rounded-full bg-navy-600/25 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-[1240px] gap-12 px-5 pb-14 pt-20 md:grid-cols-2 md:px-8 lg:grid-cols-[1.3fr_0.8fr_0.9fr_1.4fr]">
        <div>
          <BrandLogo light />
          <p className="mt-6 max-w-xs text-[15px] leading-[1.85] text-white/65">
            Connecting people and their dream homes with transparent land-share
            and flat-share ownership across Dhaka.
          </p>
          <ul className="mt-7 space-y-3 text-[14.5px] text-white/80">
            <li className="flex gap-3">
              <MapPin className="mt-1 size-4 shrink-0 text-gold" aria-hidden="true" />
              {siteConfig.address}
            </li>
            <li>
              <a href={siteConfig.phoneHref} className="flex gap-3 hover:text-gold">
                <Phone className="mt-1 size-4 shrink-0 text-gold" aria-hidden="true" />
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="flex gap-3 hover:text-gold">
                <Mail className="mt-1 size-4 shrink-0 text-gold" aria-hidden="true" />
                {siteConfig.email}
              </a>
            </li>
          </ul>
        </div>

        <FooterColumn title="Our story" links={storyLinks} />
        <FooterColumn title="Developments" links={developmentLinks} />

        <div className="md:col-span-2 lg:col-span-1">
          <p className="font-serif text-[44px] italic leading-[1.05] text-white/90 md:text-[56px]">
            No address
            <br />
            like <span className="text-gradient-gold not-italic font-sans font-extrabold tracking-tight">UPAYON</span>
          </p>
          <div className="mt-8 flex gap-3">
            {socials.map(({ label, Icon }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="grid size-11 place-items-center rounded-full bg-white/8 ring-1 ring-white/15 transition hover:-translate-y-1 hover:bg-gold hover:text-navy-950"
              >
                <Icon className="size-[18px]" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-2 px-5 py-6 text-[13px] text-white/50 md:flex-row md:items-center md:justify-between md:px-8">
          <p>© {new Date().getFullYear()} Upayon Holdings Ltd. All rights reserved.</p>
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
      <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-gold">
        {title}
      </p>
      <ul className="mt-6 space-y-3.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-[15px] text-white/70 transition hover:pl-1 hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
