# Upayon Holdings Ltd

Public portfolio website for a Dhaka-based real estate company offering
land-share and flat-share opportunities.

## Stack

- Next.js 15 App Router and TypeScript
- Tailwind CSS 4 and shadcn/ui
- MongoDB with Mongoose
- Zod request validation
- Framer Motion and Cloudinary integrations

## Local development

1. Copy `.env.example` to `.env.local`.
2. Set `MONGODB_URI` to a development database before testing contact form
   submissions. The contact endpoint returns an error if it cannot persist a
   lead.
3. Run `npm install`, then `npm run dev`.
4. Open `http://localhost:3000`.

Use `npm run build` for a production build and `npm run lint` for ESLint.

## SEO settings (production)

- `NEXT_PUBLIC_SITE_URL` — the live domain, e.g. `https://upayonholdings.com`.
  Canonical links, `sitemap.xml`, `robots.txt`, social previews and structured
  data all use it. Without it they point at `localhost`.
- `GOOGLE_SITE_VERIFICATION` (optional) — the code from Google Search Console's
  "HTML tag" verification method.
- `BING_SITE_VERIFICATION` (optional) — the code from Bing Webmaster Tools.

After deploying, submit `https://<domain>/sitemap.xml` in Google Search Console.

## Public pages

- `/` — Homepage and project search
- `/about` — Company overview
- `/projects` — Filterable project listing
- `/projects/[slug]` — Project details
- `/gallery` — Filterable image gallery
- `/blog` and `/blog/[slug]` — Editorial previews
- `/contact` — Enquiry form, persisted as a lead through `POST /api/leads`

The current project and editorial entries in `lib/public-data.ts`, along with
their images and project metrics, are illustrative preview content. Replace
them with company-approved information and media before publishing. The
website intentionally avoids inventing contact details or customer
testimonials.

Never commit `.env` files. Keep local secrets in ignored environment files and
provide only variable names in shared examples.
