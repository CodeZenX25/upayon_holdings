# Upayon Holdings Ltd

## Project overview

Upayon Holdings Ltd is a real estate company in Dhaka. This project is a portfolio website for promoting land shares and flat shares, with a public-facing site and an authenticated admin panel.

## Technology stack

- Next.js 15 App Router with TypeScript, Server Components, and Route Handlers
- MongoDB with Mongoose
- Tailwind CSS, shadcn/ui, Aceternity UI, and Framer Motion
- JWT authentication using an httpOnly cookie for the admin panel
- Zod for input validation
- Cloudinary for image uploads

## Project structure

The project has the following base structure. Add feature-specific directories as needed.

```text
app/
  (public)/
  admin/
  api/
  globals.css
  layout.tsx
  page.tsx
components/
  ui/
    button.tsx
  sections/
lib/
  db.ts
  utils.ts
  validations/
    admin.ts
    blog.ts
    gallery-item.ts
    lead.ts
    project.ts
    site-settings.ts
    testimonial.ts
models/
  admin.ts
  blog.ts
  gallery-item.ts
  lead.ts
  project.ts
  site-settings.ts
  testimonial.ts
public/
scripts/
  seed.ts
types/
```

## Coding conventions

- Keep TypeScript strict; avoid `any` and unsafe type assertions. Validate untrusted input at system boundaries.
- Build reusable, focused components. Follow existing project patterns before introducing new abstractions or dependencies.
- Keep page composition in the App Router. Prefer Server Components; add Client Components only when browser-side interactivity is needed.
- Keep server-side actions and HTTP Route Handlers in the relevant `app/api/` feature directories. Use dedicated `'use server'` action modules (for example, `actions.ts`) and `route.ts` for Route Handlers; do not treat Server Actions as REST routes.
- Put Mongoose models in `models/` and shared utilities, database connection helpers, and server-side integrations in `lib/`.
- Validate request data with Zod before database writes or external service calls.
- Keep secrets and environment-specific configuration out of source code. Document required variable names and safe setup instructions without including secret values.
- **Never commit `.env` files.**

## Product areas

- Public site: Home, About, Projects (Ongoing / Upcoming / Completed), Project Details, Gallery, Blog, and Contact.
- Admin panel: manage projects, gallery, blog posts, testimonials, contact leads, and site settings.
