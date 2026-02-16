import { Metadata } from "next";

// Base site config
export const siteConfig = {
  name: "ZakladUA",
  description: "B2B платформа для ресторанного бізнесу в Україні. POS-системи, обладнання, постачальники.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://zaklad.ua",
  ogImage: "/images/og-image.jpg",
  locale: "uk_UA",
  twitter: "@zakladua",
};

// API base URL for server-side fetching
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Fetch helper for server-side metadata generation
async function fetchData<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// Generate metadata for pages
export function generateSEO({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  noIndex = false,
  article,
}: {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  noIndex?: boolean;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}): Metadata {
  const fullTitle = title.includes(siteConfig.name) 
    ? title 
    : `${title} | ${siteConfig.name}`;
  
  const fullUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
  const ogImage = image || siteConfig.ogImage;

  return {
    title: fullTitle,
    description,
    keywords: keywords?.join(", "),
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    robots: noIndex ? "noindex, nofollow" : "index, follow",
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      type: type === "article" ? "article" : "website",
      locale: siteConfig.locale,
      url: fullUrl,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage.startsWith("http") ? ogImage : `${siteConfig.url}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(article && {
        publishedTime: article.publishedTime,
        modifiedTime: article.modifiedTime,
        authors: article.author ? [article.author] : undefined,
        section: article.section,
        tags: article.tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      site: siteConfig.twitter,
      creator: siteConfig.twitter,
      images: [ogImage.startsWith("http") ? ogImage : `${siteConfig.url}${ogImage}`],
    },
  };
}

// Generate JSON-LD structured data for Organization
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      addressCountry: "UA",
      addressLocality: "Київ",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "info@zaklad.ua",
    },
    sameAs: [
      "https://facebook.com/zakladua",
      "https://instagram.com/zakladua",
      "https://t.me/zakladua",
    ],
  };
}

// Generate JSON-LD for WebSite with SearchAction
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "uk-UA",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// Generate JSON-LD for LocalBusiness (establishments)
export function generateLocalBusinessSchema(establishment: {
  name: string;
  description: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  website?: string;
  priceRange?: number;
  averageRating?: number;
  reviewCount?: number;
  image?: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: establishment.name,
    description: establishment.description,
    url: `${siteConfig.url}/establishments/${establishment.slug}`,
    image: establishment.image,
    address: {
      "@type": "PostalAddress",
      streetAddress: establishment.address,
      addressLocality: establishment.city,
      addressCountry: "UA",
    },
    telephone: establishment.phone,
    email: establishment.email,
    priceRange: "₴".repeat(establishment.priceRange || 2),
    ...(establishment.averageRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: establishment.averageRating,
        reviewCount: establishment.reviewCount || 0,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
}

// Generate JSON-LD for Product (POS systems, equipment)
export function generateProductSchema(product: {
  name: string;
  description: string;
  image?: string;
  priceFrom?: number;
  priceTo?: number;
  averageRating?: number;
  reviewCount?: number;
  slug: string;
  category?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    url: `${siteConfig.url}/pos-systems/${product.slug}`,
    category: product.category,
    ...(product.priceFrom && {
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "UAH",
        lowPrice: product.priceFrom,
        highPrice: product.priceTo || product.priceFrom,
        offerCount: 1,
      },
    }),
    ...(product.averageRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.averageRating,
        reviewCount: product.reviewCount || 0,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
}

// Generate JSON-LD for Article (blog posts)
export function generateArticleSchema(article: {
  title: string;
  description: string;
  image?: string;
  publishedTime: string;
  modifiedTime?: string;
  author?: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image,
    url: `${siteConfig.url}/blog/${article.slug}`,
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
    author: {
      "@type": "Organization",
      name: article.author || siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/images/logo.png`,
      },
    },
  };
}

// Generate JSON-LD for BreadcrumbList
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}

// Generate JSON-LD for FAQ
export function generateFAQSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Generate JSON-LD for SoftwareApplication (POS systems)
export function generateSoftwareSchema(software: {
  name: string;
  description: string;
  image?: string;
  priceFrom?: number;
  averageRating?: number;
  reviewCount?: number;
  slug: string;
  category?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: software.name,
    description: software.description,
    image: software.image,
    url: `${siteConfig.url}/pos-systems/${software.slug}`,
    applicationCategory: software.category || "BusinessApplication",
    operatingSystem: "Web, iOS, Android",
    ...(software.priceFrom && {
      offers: {
        "@type": "Offer",
        priceCurrency: "UAH",
        price: software.priceFrom,
        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
    }),
    ...(software.averageRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: software.averageRating,
        reviewCount: software.reviewCount || 0,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
}

// Generate JSON-LD for ItemList (catalog pages)
export function generateItemListSchema(
  items: { name: string; url: string; image?: string; position: number }[],
  listName: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: items.length,
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      url: item.url,
      ...(item.image && { image: item.image }),
    })),
  };
}

// Generate JSON-LD for Service
export function generateServiceSchema(service: {
  name: string;
  description: string;
  provider?: string;
  areaServed?: string;
  slug: string;
  basePath: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: `${siteConfig.url}${service.basePath}/${service.slug}`,
    provider: {
      "@type": "Organization",
      name: service.provider || siteConfig.name,
    },
    areaServed: {
      "@type": "Country",
      name: service.areaServed || "Україна",
    },
  };
}

// ============================================
// DYNAMIC METADATA GENERATORS FOR [slug] PAGES
// ============================================

// Generate metadata for POS system detail page
export async function generatePosSystemPageMetadata(slug: string): Promise<Metadata> {
  const posSystem = await fetchData<{
    name: string;
    description?: string;
    shortDescription?: string;
    logoUrl?: string;
    coverUrl?: string;
    priceFrom?: number;
    priceTo?: number;
    averageRating?: number;
    reviewCount?: number;
    features?: string[];
    category?: { name: string };
  }>(`/pos-systems/${slug}`);

  if (!posSystem) {
    return generateSEO({
      title: "POS-система не знайдена",
      description: "Перейдіть до каталогу POS-систем для вибору рішення для вашого закладу.",
      url: "/pos-systems",
      noIndex: true,
    });
  }

  const priceText = posSystem.priceFrom ? ` від ₴${posSystem.priceFrom}/міс` : "";
  const ratingText = posSystem.averageRating ? ` ⭐ ${posSystem.averageRating.toFixed(1)}` : "";
  const reviewText = posSystem.reviewCount ? ` (${posSystem.reviewCount} відгуків)` : "";

  const title = `${posSystem.name} - POS-система для ресторанів${priceText}`;
  const description = posSystem.shortDescription || posSystem.description ||
    `${posSystem.name} - POS-система для автоматизації ресторанного бізнесу.${priceText}${ratingText}${reviewText}. Функції, ціни, відгуки.`;

  return generateSEO({
    title,
    description: description.slice(0, 160),
    keywords: [
      posSystem.name,
      "POS-система",
      "автоматизація ресторану",
      "каса для ресторану",
      posSystem.category?.name || "",
      ...(posSystem.features?.slice(0, 5) || []),
    ].filter(Boolean),
    image: posSystem.coverUrl || posSystem.logoUrl,
    url: `/pos-systems/${slug}`,
    type: "product",
  });
}

// Generate metadata for establishment detail page
export async function generateEstablishmentPageMetadata(slug: string): Promise<Metadata> {
  const establishment = await fetchData<{
    name: string;
    description?: string;
    shortDescription?: string;
    logoUrl?: string;
    coverUrl?: string;
    city?: { name: string };
    address?: string;
    businessType?: string;
    averageRating?: number;
    reviewCount?: number;
    features?: string[];
    category?: { name: string };
  }>(`/establishments/${slug}`);

  if (!establishment) {
    return generateSEO({
      title: "Заклад не знайдено",
      description: "Перейдіть до каталогу закладів для пошуку ресторанів, кафе та барів.",
      url: "/establishments",
      noIndex: true,
    });
  }

  const businessTypeLabels: Record<string, string> = {
    RESTAURANT: "Ресторан",
    CAFE: "Кафе",
    FASTFOOD: "Фастфуд",
    BAR: "Бар",
    BAKERY: "Пекарня",
    COFFEESHOP: "Кав'ярня",
    OTHER: "Заклад",
  };

  const typeText = businessTypeLabels[establishment.businessType || "OTHER"] || "Заклад";
  const cityText = establishment.city?.name ? ` в ${establishment.city.name}` : "";
  const ratingText = establishment.averageRating 
    ? ` ⭐ ${establishment.averageRating.toFixed(1)} (${establishment.reviewCount || 0} відгуків)` 
    : "";

  const title = `${establishment.name} - ${typeText}${cityText}`;
  const description = establishment.shortDescription || establishment.description ||
    `${establishment.name} - ${typeText.toLowerCase()}${cityText}. Меню, ціни, відгуки, адреса, контакти.${ratingText}`;

  return generateSEO({
    title,
    description: description.slice(0, 160),
    keywords: [
      establishment.name,
      typeText,
      establishment.city?.name || "Україна",
      establishment.category?.name || "",
      "відгуки",
      "меню",
      "ціни",
      "адреса",
    ].filter(Boolean),
    image: establishment.coverUrl || establishment.logoUrl,
    url: `/establishments/${slug}`,
  });
}

// Generate metadata for equipment detail page
export async function generateEquipmentPageMetadata(slug: string): Promise<Metadata> {
  const equipment = await fetchData<{
    name: string;
    description?: string;
    shortDescription?: string;
    logoUrl?: string;
    coverUrl?: string;
    averageRating?: number;
    reviewCount?: number;
    category?: { name: string };
  }>(`/pos-systems/${slug}`); // Equipment uses same endpoint as POS systems

  if (!equipment) {
    return generateSEO({
      title: "Обладнання не знайдено",
      description: "Перейдіть до каталогу обладнання для ресторанів та кафе.",
      url: "/equipment",
      noIndex: true,
    });
  }

  const categoryText = equipment.category?.name || "Обладнання";
  const ratingText = equipment.averageRating 
    ? ` ⭐ ${equipment.averageRating.toFixed(1)}` 
    : "";

  const title = `${equipment.name} - ${categoryText} для ресторанів`;
  const description = equipment.shortDescription || equipment.description ||
    `${equipment.name} - професійне ${categoryText.toLowerCase()} для ресторанів та кафе.${ratingText} Характеристики, ціни, відгуки.`;

  return generateSEO({
    title,
    description: description.slice(0, 160),
    keywords: [
      equipment.name,
      categoryText,
      "обладнання для ресторану",
      "HoReCa",
      "професійна кухня",
    ],
    image: equipment.coverUrl || equipment.logoUrl,
    url: `/equipment/${slug}`,
    type: "product",
  });
}

// Generate metadata for supplier detail page
export async function generateSupplierPageMetadata(slug: string): Promise<Metadata> {
  const supplier = await fetchData<{
    name: string;
    description?: string;
    shortDescription?: string;
    logoUrl?: string;
    coverUrl?: string;
    city?: { name: string };
    averageRating?: number;
    reviewCount?: number;
    category?: { name: string };
  }>(`/establishments/${slug}`);

  if (!supplier) {
    return generateSEO({
      title: "Постачальника не знайдено",
      description: "Перейдіть до каталогу постачальників продуктів для HoReCa.",
      url: "/suppliers",
      noIndex: true,
    });
  }

  const categoryText = supplier.category?.name || "Постачальник";
  const cityText = supplier.city?.name ? ` - ${supplier.city.name}` : "";

  const title = `${supplier.name} - ${categoryText}${cityText}`;
  const description = supplier.shortDescription || supplier.description ||
    `${supplier.name} - ${categoryText.toLowerCase()} продуктів для HoReCa.${cityText} Каталог, ціни, контакти.`;

  return generateSEO({
    title,
    description: description.slice(0, 160),
    keywords: [
      supplier.name,
      categoryText,
      "постачальник",
      "продукти HoReCa",
      supplier.city?.name || "Україна",
    ].filter(Boolean),
    image: supplier.coverUrl || supplier.logoUrl,
    url: `/suppliers/${slug}`,
  });
}

// Generate metadata for blog article page
export async function generateBlogArticlePageMetadata(slug: string): Promise<Metadata> {
  // Static blog data for now (would be fetched from API in production)
  const articles: Record<string, {
    title: string;
    excerpt: string;
    category: string;
    date: string;
    image: string;
    tags?: string[];
  }> = {
    "restaurant-trends-2024": {
      title: "Ресторанні тренди 2024: що змінюється в індустрії",
      excerpt: "Огляд головних трендів у ресторанному бізнесі України — від технологій до концепцій закладів",
      category: "Тренди",
      date: "2024-01-05",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200",
      tags: ["тренди", "ресторан", "2024", "бізнес"],
    },
    "how-to-open-restaurant": {
      title: "Як відкрити ресторан у 2024 році: покроковий гайд",
      excerpt: "Все, що потрібно знати перед відкриттям власного закладу",
      category: "Бізнес",
      date: "2024-01-03",
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600",
      tags: ["бізнес", "відкриття", "ресторан", "гайд"],
    },
    "pos-system-comparison": {
      title: "Порівняння POS-систем: Poster vs iiko vs Goovii",
      excerpt: "Детальний аналіз найпопулярніших систем автоматизації",
      category: "Технології",
      date: "2024-01-01",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600",
      tags: ["POS", "Poster", "iiko", "Goovii", "порівняння"],
    },
  };

  const article = articles[slug];

  if (!article) {
    return generateSEO({
      title: "Стаття не знайдена",
      description: "Перейдіть до блогу ZakladUA для перегляду актуальних статей про ресторанний бізнес.",
      url: "/blog",
      noIndex: true,
    });
  }

  return generateSEO({
    title: article.title,
    description: article.excerpt,
    keywords: article.tags || [article.category, "ресторанний бізнес", "HoReCa"],
    image: article.image,
    url: `/blog/${slug}`,
    type: "article",
    article: {
      publishedTime: article.date,
      author: "ZakladUA",
      section: article.category,
      tags: article.tags,
    },
  });
}

// Generate metadata for delivery service detail page
export async function generateDeliveryPageMetadata(slug: string): Promise<Metadata> {
  const service = await fetchData<{
    name: string;
    description?: string;
    shortDescription?: string;
    logoUrl?: string;
    coverUrl?: string;
    averageRating?: number;
    reviewCount?: number;
    category?: { name: string };
  }>(`/pos-systems/${slug}`);

  if (!service) {
    return generateSEO({
      title: "Сервіс доставки не знайдено",
      description: "Перейдіть до каталогу сервісів доставки їжі для ресторанів.",
      url: "/delivery",
      noIndex: true,
    });
  }

  const title = `${service.name} - Сервіс доставки їжі для ресторанів`;
  const description = service.shortDescription || service.description ||
    `${service.name} - підключіть ваш заклад до сервісу доставки. Умови, комісії, інтеграції.`;

  return generateSEO({
    title,
    description: description.slice(0, 160),
    keywords: [
      service.name,
      "доставка їжі",
      "агрегатор доставки",
      "підключення ресторану",
      "кур'єрська доставка",
    ],
    image: service.coverUrl || service.logoUrl,
    url: `/delivery/${slug}`,
  });
}

// Generate metadata for QR-menu service detail page
export async function generateQrMenuPageMetadata(slug: string): Promise<Metadata> {
  const service = await fetchData<{
    name: string;
    description?: string;
    shortDescription?: string;
    logoUrl?: string;
    coverUrl?: string;
    averageRating?: number;
    reviewCount?: number;
    priceFrom?: number;
  }>(`/pos-systems/${slug}`);

  if (!service) {
    return generateSEO({
      title: "QR-меню сервіс не знайдено",
      description: "Перейдіть до каталогу QR-меню сервісів для ресторанів.",
      url: "/qr-menu",
      noIndex: true,
    });
  }

  const priceText = service.priceFrom ? ` від ₴${service.priceFrom}/міс` : "";
  const title = `${service.name} - QR-меню для ресторанів${priceText}`;
  const description = service.shortDescription || service.description ||
    `${service.name} - електронне QR-меню для вашого закладу.${priceText} Функції, ціни, відгуки.`;

  return generateSEO({
    title,
    description: description.slice(0, 160),
    keywords: [
      service.name,
      "QR-меню",
      "електронне меню",
      "онлайн меню",
      "меню для ресторану",
    ],
    image: service.coverUrl || service.logoUrl,
    url: `/qr-menu/${slug}`,
  });
}

// Generate metadata for category pages
export async function generateCategoryPageMetadata(
  type: "establishments" | "pos-systems" | "equipment" | "suppliers" | "delivery" | "qr-menu" | "design" | "marketing",
  categorySlug: string
): Promise<Metadata> {
  const category = await fetchData<{
    name: string;
    description?: string;
  }>(`/categories/slug/${categorySlug}`);

  const typeConfig: Record<string, { title: string; basePath: string; keywords: string[] }> = {
    "establishments": {
      title: "Заклади",
      basePath: "/establishments/category",
      keywords: ["заклади", "ресторани", "кафе", "бари"],
    },
    "pos-systems": {
      title: "POS-системи",
      basePath: "/pos-systems/category",
      keywords: ["POS", "автоматизація", "каса"],
    },
    "equipment": {
      title: "Обладнання",
      basePath: "/equipment/category",
      keywords: ["обладнання", "техніка", "кухня"],
    },
    "suppliers": {
      title: "Постачальники",
      basePath: "/suppliers/category",
      keywords: ["постачальники", "продукти", "оптом"],
    },
    "delivery": {
      title: "Доставка",
      basePath: "/delivery/category",
      keywords: ["доставка", "агрегатори", "кур'єри"],
    },
    "qr-menu": {
      title: "QR-меню",
      basePath: "/qr-menu/category",
      keywords: ["QR-меню", "електронне меню", "онлайн"],
    },
    "design": {
      title: "Дизайн",
      basePath: "/design/category",
      keywords: ["дизайн", "інтер'єр", "оформлення"],
    },
    "marketing": {
      title: "Маркетинг",
      basePath: "/marketing/category",
      keywords: ["маркетинг", "просування", "реклама"],
    },
  };

  const config = typeConfig[type];
  const categoryName = category?.name || categorySlug;
  const title = `${categoryName} - ${config.title}`;
  const description = category?.description ||
    `${categoryName} - каталог ${config.title.toLowerCase()}. Порівняння, відгуки, рейтинги на ZakladUA.`;

  return generateSEO({
    title,
    description: description.slice(0, 160),
    keywords: [categoryName, ...config.keywords, "каталог", "Україна"],
    url: `${config.basePath}/${categorySlug}`,
  });
}
