import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

// API fetchers with error handling
async function fetchAPI<T>(endpoint: string): Promise<T[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || data || [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const now = new Date();

  // ============================================
  // STATIC PAGES - All main sections
  // ============================================
  const staticPages: MetadataRoute.Sitemap = [
    // Homepage - highest priority
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    
    // Main catalog pages - high priority
    { url: `${baseUrl}/establishments`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/establishments/rating`, lastModified: now, changeFrequency: "daily", priority: 0.85 },
    { url: `${baseUrl}/pos-systems`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/equipment`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/suppliers`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/delivery`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/qr-menu`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/marketing`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    
    // Content pages - medium priority
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/ai-helper`, lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    { url: `${baseUrl}/aggregators`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/design`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    
    // Auth pages - lower priority but important for users
    { url: `${baseUrl}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/register`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    
    // Legal pages - low priority
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // ============================================
  // DYNAMIC PAGES - Fetched from API
  // ============================================
  
  // Establishments
  const establishments = await fetchAPI<{ slug: string; updatedAt?: string; createdAt: string }>("/establishments?limit=500&status=ACTIVE");
  const establishmentPages: MetadataRoute.Sitemap = establishments.map((item) => ({
    url: `${baseUrl}/establishments/${item.slug}`,
    lastModified: new Date(item.updatedAt || item.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // POS Systems
  const posSystems = await fetchAPI<{ slug: string; updatedAt?: string; createdAt: string; category?: { slug: string } }>("/pos-systems?limit=500&status=ACTIVE");
  const posSystemPages: MetadataRoute.Sitemap = posSystems
    .filter(item => item.category?.slug === "pos-systems")
    .map((item) => ({
      url: `${baseUrl}/pos-systems/${item.slug}`,
      lastModified: new Date(item.updatedAt || item.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));

  // Equipment (from same endpoint, different category)
  const equipmentItems = posSystems
    .filter(item => item.category?.slug === "equipment" || item.category?.slug?.includes("equipment"))
    .map((item) => ({
      url: `${baseUrl}/equipment/${item.slug}`,
      lastModified: new Date(item.updatedAt || item.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  // Delivery services
  const deliveryItems = posSystems
    .filter(item => item.category?.slug === "delivery" || item.category?.slug?.includes("delivery"))
    .map((item) => ({
      url: `${baseUrl}/delivery/${item.slug}`,
      lastModified: new Date(item.updatedAt || item.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  // QR-menu services
  const qrMenuItems = posSystems
    .filter(item => item.category?.slug === "qr-menu" || item.category?.slug?.includes("qr"))
    .map((item) => ({
      url: `${baseUrl}/qr-menu/${item.slug}`,
      lastModified: new Date(item.updatedAt || item.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  // Suppliers
  const supplierItems = posSystems
    .filter(item => item.category?.slug === "suppliers" || item.category?.slug?.includes("supplier"))
    .map((item) => ({
      url: `${baseUrl}/suppliers/${item.slug}`,
      lastModified: new Date(item.updatedAt || item.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  // Categories
  const categories = await fetchAPI<{ slug: string; updatedAt?: string; createdAt: string; type?: string }>("/categories?limit=100");
  const categoryPages: MetadataRoute.Sitemap = categories.map((item) => ({
    url: `${baseUrl}/establishments/category/${item.slug}`,
    lastModified: new Date(item.updatedAt || item.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Blog articles (static for now)
  const blogPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/blog/restaurant-trends-2024`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.65 },
    { url: `${baseUrl}/blog/how-to-open-restaurant`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.65 },
    { url: `${baseUrl}/blog/pos-system-comparison`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.65 },
  ];

  return [
    ...staticPages,
    ...establishmentPages,
    ...posSystemPages,
    ...equipmentItems,
    ...deliveryItems,
    ...qrMenuItems,
    ...supplierItems,
    ...categoryPages,
    ...blogPages,
  ];
}
