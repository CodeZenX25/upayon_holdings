/**
 * Public contact details shown across the site.
 * TODO: replace placeholders with verified company details
 * (later these can come from the SiteSettings model).
 */
export const siteConfig = {
  name: "Upayon Holdings Ltd.",
  phone: "+880 1700-000000",
  phoneHref: "tel:+8801700000000",
  email: "info@upayonholdings.com",
  address: "Upayon Tower, Road 11, Banani, Dhaka 1213",
  whatsappHref: "https://wa.me/8801700000000",
  mapEmbedSrc:
    "https://www.google.com/maps?q=Banani%2C%20Dhaka&output=embed",
} as const;

export const mainNav = [
  { href: "/projects", label: "Real Estate" },
  { href: "/#models", label: "Construction" },
  { href: "/#location", label: "Location" },
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
] as const;
