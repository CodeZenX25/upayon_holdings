import type { Metadata, Viewport } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import { seo, siteUrl } from "@/lib/seo";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Only used for the italic accent words — load just what's needed.
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: seo.defaultTitle, template: `%s | ${seo.shortName}` },
  description: seo.description,
  keywords: seo.keywords,
  applicationName: seo.shortName,
  authors: [{ name: seo.name, url: siteUrl }],
  creator: seo.name,
  publisher: seo.name,
  category: "Real Estate",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: seo.shortName,
    title: seo.defaultTitle,
    description: seo.description,
    images: [{ url: seo.ogImage, width: 1600, height: 1600, alt: "Upayon residential building in Dhaka" }],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.defaultTitle,
    description: seo.description,
    images: [seo.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: true, email: true, address: true },
  // Paste the code from Google Search Console / Bing Webmaster Tools into these env vars.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: "#7b4ca8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Banner videos and uploaded media come from Cloudinary — open the connection early. */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className={`${poppins.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
