/**
 * Public contact details shown across the site.
 * TODO: replace placeholders with verified company details
 * (later these can come from the SiteSettings model).
 */
export const siteConfig = {
  name: "Upayon Holdings Ltd.",
  phone: "+880 1339336953",
  phoneHref: "tel:+8801339336953",
  email: "info@upayonholdings.com",
  address: "Upayon Group, House-342, Road-5, Avenue 3, Mirpur DOHS, Dhaka 1216",
  whatsappHref: "https://wa.me/8801339336953",
  /** Office pin (from the Google Maps place link). */
  geo: { lat: 23.8346708, lng: 90.3673277 },
  /**
   * Map shown in an <iframe>. Google only allows "embed" links inside other
   * sites — a normal maps/dir link shows a blank "refused to connect" box.
   */
  mapEmbedSrc: "https://maps.google.com/maps?q=23.8346708,90.3673277&z=16&hl=en&output=embed",
  /** Opens Google Maps with directions to the office. */
  mapDirectionsHref:
    "https://www.google.com/maps/dir//Upayon+Group,+House-342,+Road-5,+Avenue+3,+Dhaka+1216/@23.8424314,90.3683716,14z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3755c10076f12d27:0xe01f11bd3f17b5c0!2m2!1d90.3673277!2d23.8346708?entry=ttu",
} as const;

export const mainNav = [
  { href: "/projects", label: "Real Estate" },
  { href: "/construction", label: "Construction" },
  { href: "/#location", label: "Location" },
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
] as const;
