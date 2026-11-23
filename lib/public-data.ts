export type PublicProjectStatus = "ongoing" | "upcoming" | "completed";
export type PublicProjectType = "land-share" | "flat-share";

export interface PublicProject {
  title: string;
  slug: string;
  status: PublicProjectStatus;
  type: PublicProjectType;
  location: string;
  shortDescription: string;
  coverImage: string;
  landArea: string;
  floors: number;
  totalUnits: number;
  flatSizes: string[];
  facing: string;
  handoverDate: string;
  progress: number;
  features: string[];
  description: string[];
}

export interface PublicBlogPost {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  author: string;
  publishedAt: string;
  content: string[];
}

export interface PublicGalleryItem {
  title: string;
  category: "ongoing" | "completed" | "interior" | "events";
  image: string;
}

export const projects: PublicProject[] = [
  {
    title: "Nirvana",
    slug: "nirvana",
    status: "ongoing",
    type: "flat-share",
    location: "Bashundhara R/A, Dhaka",
    shortDescription:
      "A thoughtful collection of contemporary homes designed around light, comfort, and everyday life.",
    coverImage:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
    landArea: "8 katha",
    floors: 12,
    totalUnits: 24,
    flatSizes: ["1,250 sqft", "1,450 sqft", "1,680 sqft"],
    facing: "South-facing",
    handoverDate: "December 2028",
    progress: 35,
    features: [
      "Thoughtful, naturally lit homes",
      "Secure resident parking",
      "Rooftop garden and gathering space",
      "Convenient access to everyday essentials",
    ],
    description: [
      "Nirvana brings a calm, considered approach to urban living. Its homes are planned to make the most of daylight, provide comfortable spaces for family life, and feel connected to their neighborhood.",
      "The development is planned with shared spaces, secure access, and practical amenities. Project information on this page is an initial presentation and should be confirmed with our team before making an investment decision.",
    ],
  },
  {
    title: "Mojid's Star Rainbow",
    slug: "mojids-star-rainbow",
    status: "completed",
    type: "flat-share",
    location: "Uttara, Dhaka",
    shortDescription:
      "A welcoming residential address with considered layouts and easy connections across the city.",
    coverImage:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=85",
    landArea: "6 katha",
    floors: 10,
    totalUnits: 20,
    flatSizes: ["1,200 sqft", "1,500 sqft"],
    facing: "East-facing",
    handoverDate: "Completed",
    progress: 100,
    features: [
      "Efficient apartment layouts",
      "Passenger lift",
      "Resident parking",
      "Close to neighborhood amenities",
    ],
    description: [
      "Mojid's Star Rainbow is a completed residential development in Uttara, planned to make everyday life convenient and comfortable.",
      "Contact Upayon Holdings for current availability and verified project documents.",
    ],
  },
  {
    title: "Upayon Green View",
    slug: "upayon-green-view",
    status: "upcoming",
    type: "land-share",
    location: "Purbachal, Dhaka",
    shortDescription:
      "A future-focused land-share opportunity in one of Dhaka's growing neighborhoods.",
    coverImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85",
    landArea: "10 katha",
    floors: 0,
    totalUnits: 0,
    flatSizes: [],
    facing: "South-facing plots",
    handoverDate: "To be announced",
    progress: 0,
    features: [
      "Planned residential neighborhood",
      "Land-share ownership model",
      "Flexible consultation with our team",
      "Project documentation available on request",
    ],
    description: [
      "Upayon Green View is an upcoming land-share project in Purbachal. Our team can explain the proposed location, share structure, documentation, and next steps.",
      "Project status, plot details, and timelines are subject to change. Please speak with our team and review the relevant documents before making a decision.",
    ],
  },
  {
    title: "Upayon Lakefront",
    slug: "upayon-lakefront",
    status: "ongoing",
    type: "flat-share",
    location: "Aftabnagar, Dhaka",
    shortDescription:
      "A modern residential project bringing open views and practical family living together.",
    coverImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
    landArea: "7 katha",
    floors: 11,
    totalUnits: 22,
    flatSizes: ["1,300 sqft", "1,550 sqft"],
    facing: "North-facing",
    handoverDate: "June 2029",
    progress: 18,
    features: [
      "Family-friendly shared spaces",
      "Well-planned apartment layouts",
      "Secure building access",
      "Easy connections to local roads",
    ],
    description: [
      "Upayon Lakefront is planned around practical, light-filled homes and shared spaces for residents. The project is currently under development in Aftabnagar.",
      "Construction milestones and handover timing are indicative. Please contact our team for current updates and official documentation.",
    ],
  },
];

export const blogPosts: PublicBlogPost[] = [
  {
    title: "A thoughtful guide to buying your first apartment in Dhaka",
    slug: "first-apartment-guide-dhaka",
    excerpt:
      "The questions to ask, documents to review, and details to consider before choosing a home.",
    coverImage:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85",
    category: "Buying guide",
    author: "Upayon Holdings",
    publishedAt: "October 18, 2026",
    content: [
      "Buying a home is a major decision. Start by understanding the neighborhood, your day-to-day needs, and the total cost of ownership, not only the advertised price.",
      "Review the title and ownership documents, approved plans, project permissions, payment schedule, and handover terms with qualified professionals. Ask for written answers and keep copies of every document.",
      "Take time to visit the site, understand the share or unit structure, and compare what is included. A transparent conversation helps you make a decision that fits your family and finances.",
    ],
  },
  {
    title: "What to look for in a well-planned residential neighborhood",
    slug: "choosing-a-residential-neighborhood",
    excerpt:
      "How access, community facilities, and future needs shape a place that feels like home.",
    coverImage:
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1400&q=85",
    category: "Lifestyle",
    author: "Upayon Holdings",
    publishedAt: "September 26, 2026",
    content: [
      "A neighborhood is more than an address. Consider the routes you use each day, access to schools and healthcare, nearby services, and the character of the surrounding community.",
      "Visit at different times of day and ask how roads, utilities, drainage, and shared spaces are planned and maintained. Small practical details make a lasting difference.",
      "Look for clear, verifiable information about development plans and timelines, and seek independent advice where needed.",
    ],
  },
  {
    title: "Land-share and flat-share: understanding the difference",
    slug: "land-share-vs-flat-share",
    excerpt:
      "A plain-language introduction to two ways families explore property ownership.",
    coverImage:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=85",
    category: "Property insights",
    author: "Upayon Holdings",
    publishedAt: "August 12, 2026",
    content: [
      "Land-share and flat-share arrangements can involve different ownership structures, rights, obligations, and timelines. The details depend on the project documents and the applicable laws.",
      "Before committing, ask exactly what your share represents, how it is recorded, what payments remain, how decisions are made, and what happens if plans change.",
      "This article is general information, not legal or financial advice. Review the relevant project documents with an independent professional.",
    ],
  },
];

export const galleryItems: PublicGalleryItem[] = [
  {
    title: "Nirvana — residence concept",
    category: "ongoing",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "A considered exterior",
    category: "completed",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Warm, welcoming interiors",
    category: "interior",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "A light-filled living space",
    category: "interior",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Thoughtful city living",
    category: "ongoing",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Spaces made for gathering",
    category: "events",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=85",
  },
];

