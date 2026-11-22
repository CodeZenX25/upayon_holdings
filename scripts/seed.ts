import { loadEnvConfig } from "@next/env";
import mongoose from "mongoose";
import { connectToDatabase } from "../lib/db";
import {
  AdminModel,
  BlogModel,
  GalleryItemModel,
  ProjectModel,
  SiteSettingsModel,
  TestimonialModel,
} from "../models";
import {
  adminSchema,
  blogSchema,
  galleryItemSchema,
  projectSchema,
  siteSettingsSchema,
  testimonialSchema,
} from "../lib/validations";

loadEnvConfig(process.cwd());

const sampleImage = "https://res.cloudinary.com/demo/image/upload/sample.jpg";
const seedAdminEmail =
  process.env.SEED_ADMIN_EMAIL ?? "admin@upayonholdings.com";

async function seed(): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Refusing to seed a production environment.");
  }

  const seedAdminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!seedAdminPassword) {
    throw new Error(
      "Missing SEED_ADMIN_PASSWORD. Set it in your local environment before seeding.",
    );
  }

  const adminInput = adminSchema.parse({
    name: "Seed Administrator",
    email: seedAdminEmail,
    password: seedAdminPassword,
    role: "admin",
  });

  try {
    await connectToDatabase();

    const existingAdmin = await AdminModel.findOne({ email: adminInput.email });
    if (!existingAdmin) {
      await new AdminModel(adminInput).save();
    } else if (existingAdmin.role !== "admin") {
      throw new Error(
        `Seed email ${adminInput.email} already belongs to a non-admin account.`,
      );
    }

    const projectInput = projectSchema.parse({
      title: "Demo Project - Gulshan Residences",
      slug: "demo-gulshan-residences",
      status: "ongoing",
      type: "flat-share",
      location: "Gulshan, Dhaka",
      address: "Gulshan Avenue, Dhaka",
      shortDescription: "A sample residential project for initial development.",
      description:
        "This demo project is seeded sample content. Replace it with verified project information before publishing.",
      coverImage: sampleImage,
      images: [sampleImage],
      landArea: "5 katha",
      floors: 12,
      totalUnits: 24,
      flatSizes: ["1250 sqft"],
      facing: "South",
      handoverDate: new Date("2028-12-31T00:00:00.000Z"),
      features: [
        { name: "Rooftop garden", icon: "Trees" },
        { name: "Secure parking", icon: "CarFront" },
      ],
      floorPlans: [{ title: "Sample floor plan", image: sampleImage }],
      mapEmbedUrl: "https://www.google.com/maps?q=Gulshan,Dhaka&output=embed",
      progress: 35,
      progressUpdates: [
        {
          date: new Date("2026-01-15T00:00:00.000Z"),
          note: "Sample construction progress update.",
          images: [sampleImage],
        },
      ],
      isFeatured: true,
      order: 0,
      seo: {
        metaTitle: "Demo Gulshan Residences",
        metaDescription: "Sample project data for local development.",
      },
    });

    const project = await ProjectModel.findOneAndUpdate(
      { slug: projectInput.slug },
      { $setOnInsert: projectInput },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    );

    const galleryInput = galleryItemSchema.parse({
      title: "Demo project exterior",
      category: "ongoing",
      imageUrl: sampleImage,
      project: project._id.toString(),
      order: 0,
    });

    await GalleryItemModel.findOneAndUpdate(
      { title: galleryInput.title },
      { $setOnInsert: { ...galleryInput, project: project._id } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    );

    const blogInput = blogSchema.parse({
      title: "Sample Guide to Property Shares in Dhaka",
      slug: "sample-property-shares-guide",
      excerpt: "A sample blog entry for verifying the content workflow.",
      content:
        "This is seeded sample content. Replace it with reviewed, accurate information before publication.",
      coverImage: sampleImage,
      category: "Buying Guide",
      tags: ["sample", "property"],
      author: "Upayon Holdings",
      isPublished: false,
      seo: {
        metaTitle: "Sample Property Shares Guide",
        metaDescription: "A draft blog post used as seed data.",
      },
    });

    await BlogModel.findOneAndUpdate(
      { slug: blogInput.slug },
      { $setOnInsert: blogInput },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    );

    const testimonialInput = testimonialSchema.parse({
      name: "Sample Homeowner",
      projectName: "Demo Project - Gulshan Residences",
      message: "This is placeholder testimonial content for local development.",
      rating: 5,
      isActive: false,
    });

    await TestimonialModel.findOneAndUpdate(
      { name: testimonialInput.name, projectName: testimonialInput.projectName },
      { $setOnInsert: testimonialInput },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    );

    const settingsInput = siteSettingsSchema.parse({
      phone: "+880 2 0000 0000",
      email: "info@upayonholdings.com",
      address: "Dhaka, Bangladesh",
      whatsapp: "+880 2 0000 0000",
      socialLinks: [],
      stats: { years: 0, completed: 0, ongoing: 0, families: 0 },
      heroSlides: [
        {
          title: "Find your place in Dhaka",
          subtitle: "Sample hero content for local development.",
          image: sampleImage,
          buttonText: "Explore projects",
          buttonUrl: "/projects",
          order: 0,
        },
      ],
    });

    await SiteSettingsModel.findOneAndUpdate(
      { singletonKey: "default" },
      { $setOnInsert: settingsInput },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    );

    console.info(
      `Seed complete. Admin account: ${adminInput.email}. Project: ${project.slug}.`,
    );
  } finally {
    await mongoose.disconnect();
  }
}

seed().catch((error: unknown) => {
  console.error("Seed failed:", error);
  process.exitCode = 1;
});
