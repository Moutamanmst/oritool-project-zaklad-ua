import { Metadata } from "next";
import { generateSEO, siteConfig } from "./seo";

// SEO configurations for all static pages
export const pageSEO: Record<string, {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
}> = {
  // Main pages
  home: {
    title: "ZakladUA - B2B платформа для ресторанного бізнесу",
    description: "Знаходьте найкращі рішення для вашого закладу: POS-системи, обладнання, постачальників, доставку та багато іншого. Порівнюйте, читайте відгуки, обирайте.",
    keywords: ["ресторан", "кафе", "HoReCa", "POS-система", "обладнання для ресторану", "постачальники", "Україна", "автоматизація"],
  },
  
  // Establishments
  establishments: {
    title: "Заклади - каталог ресторанів та кафе України",
    description: "Каталог закладів HoReCa в Україні: ресторани, кафе, бари, пекарні, кав'ярні. Адреси, відгуки, рейтинги, контакти.",
    keywords: ["заклади", "ресторани", "кафе", "бари", "пекарні", "кав'ярні", "Україна", "каталог"],
  },
  "establishments/restaurants": {
    title: "Ресторани України - каталог з відгуками",
    description: "Знайдіть найкращі ресторани України. Адреси, меню, ціни, відгуки відвідувачів та рейтинги.",
    keywords: ["ресторани", "ресторани України", "кращі ресторани", "відгуки про ресторани"],
  },
  "establishments/cafes": {
    title: "Кафе України - каталог кав'ярень та кафе",
    description: "Кафе та кав'ярні по всій Україні. Затишні місця для сніданків, обідів та зустрічей.",
    keywords: ["кафе", "кав'ярні", "сніданки", "обіди", "Україна"],
  },
  "establishments/bars": {
    title: "Бари України - каталог барів та пабів",
    description: "Бари, паби та нічні клуби України. Коктейлі, жива музика, атмосфера.",
    keywords: ["бари", "паби", "нічні клуби", "коктейлі", "Україна"],
  },
  
  // POS Systems
  "pos-systems": {
    title: "POS-системи для ресторанів - порівняння та відгуки",
    description: "Порівняйте найкращі POS-системи для ресторанного бізнесу: Poster, iiko, R-Keeper, Syrve та інші. Ціни, функції, відгуки.",
    keywords: ["POS-система", "Poster", "iiko", "R-Keeper", "Syrve", "каса для ресторану", "автоматизація ресторану"],
  },
  
  // Equipment
  equipment: {
    title: "Обладнання для ресторанів - професійна техніка HoReCa",
    description: "Професійне обладнання для ресторанів та кафе: пічки, холодильники, посудомийки, грилі. Провідні бренди: RATIONAL, Hoshizaki, Fagor.",
    keywords: ["обладнання для ресторану", "професійна кухня", "RATIONAL", "Hoshizaki", "Fagor", "холодильне обладнання", "теплове обладнання"],
  },
  
  // Suppliers
  suppliers: {
    title: "Постачальники продуктів для HoReCa",
    description: "Знайдіть надійних постачальників продуктів, напоїв та інгредієнтів для вашого закладу. Оптові ціни, доставка по Україні.",
    keywords: ["постачальники продуктів", "HoReCa", "оптом", "продукти для ресторанів", "інгредієнти"],
  },
  
  // Delivery
  delivery: {
    title: "Сервіси доставки їжі - агрегатори та кур'єрські служби",
    description: "Підключіть ваш заклад до сервісів доставки: Glovo, Bolt Food, Raketa. Порівняння комісій та умов.",
    keywords: ["доставка їжі", "Glovo", "Bolt Food", "Raketa", "агрегатори доставки", "кур'єрська доставка"],
  },
  
  // QR Menu
  "qr-menu": {
    title: "QR-меню для ресторанів - електронне меню",
    description: "Сервіси QR-меню для закладів: електронне меню, онлайн-замовлення, безконтактна оплата. Порівняння та відгуки.",
    keywords: ["QR-меню", "електронне меню", "онлайн меню", "безконтактне замовлення", "меню для ресторану"],
  },
  
  // Marketing
  marketing: {
    title: "Маркетинг для ресторанів - інструменти просування",
    description: "Маркетингові інструменти для ресторанного бізнесу: SMM, реклама, програми лояльності, email-маркетинг.",
    keywords: ["маркетинг ресторану", "SMM", "реклама кафе", "програми лояльності", "просування закладу"],
  },
  
  // Blog
  blog: {
    title: "Блог ZakladUA - статті про ресторанний бізнес",
    description: "Корисні статті, поради та новини для власників ресторанів та кафе. Тренди HoReCa, кейси, інтерв'ю.",
    keywords: ["блог", "статті", "ресторанний бізнес", "HoReCa", "поради рестораторам", "тренди"],
  },
  
  // AI Chat
  "ai-chat": {
    title: "AI Консультант - допомога з вибором рішень",
    description: "Отримайте персональні рекомендації від AI-консультанта. Допоможемо обрати POS-систему, обладнання та постачальників.",
    keywords: ["AI консультант", "рекомендації", "допомога з вибором", "чат-бот"],
  },
  
  // Compare
  compare: {
    title: "Порівняння POS-систем та обладнання",
    description: "Порівняйте характеристики, ціни та відгуки на POS-системи та обладнання. Знайдіть оптимальне рішення.",
    keywords: ["порівняння", "POS-системи", "обладнання", "ціни", "характеристики"],
  },
  
  // About
  about: {
    title: "Про ZakladUA - B2B платформа для HoReCa",
    description: "ZakladUA - провідна B2B платформа для ресторанного бізнесу в Україні. Наша місія, команда, контакти.",
    keywords: ["про нас", "ZakladUA", "B2B платформа", "HoReCa", "команда"],
  },
  
  // Contact
  contact: {
    title: "Контакти ZakladUA",
    description: "Зв'яжіться з нами: email, телефон, соціальні мережі. Ми завжди раді допомогти.",
    keywords: ["контакти", "зв'язатися", "підтримка", "ZakladUA"],
  },
  
  // Privacy
  privacy: {
    title: "Політика конфіденційності",
    description: "Політика конфіденційності та обробки персональних даних на платформі ZakladUA.",
    keywords: ["політика конфіденційності", "персональні дані", "GDPR"],
  },
  
  // Terms
  terms: {
    title: "Умови використання",
    description: "Умови використання платформи ZakladUA. Правила, права та обов'язки користувачів.",
    keywords: ["умови використання", "правила", "угода"],
  },
};

// Generate metadata for a static page
export function getPageMetadata(pageKey: string): Metadata {
  const seo = pageSEO[pageKey];
  if (!seo) {
    return generateSEO({
      title: "ZakladUA",
      description: siteConfig.description,
    });
  }
  
  return generateSEO({
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    image: seo.image,
    url: pageKey === "home" ? "/" : `/${pageKey}`,
  });
}

// Generate metadata for dynamic establishment page
export function generateEstablishmentMetadata(establishment: {
  name: string;
  description?: string;
  shortDescription?: string;
  city?: string;
  category?: { name: string };
  averageRating?: number;
  reviewCount?: number;
  logoUrl?: string;
  slug: string;
}): Metadata {
  const cityText = establishment.city ? ` в ${establishment.city}` : "";
  const categoryText = establishment.category?.name || "Заклад";
  const ratingText = establishment.averageRating 
    ? ` ⭐ ${establishment.averageRating.toFixed(1)} (${establishment.reviewCount || 0} відгуків)` 
    : "";
  
  return generateSEO({
    title: `${establishment.name} - ${categoryText}${cityText}`,
    description: establishment.shortDescription || establishment.description || 
      `${establishment.name} - ${categoryText.toLowerCase()}${cityText}. Меню, ціни, відгуки, контакти.${ratingText}`,
    keywords: [
      establishment.name,
      categoryText,
      establishment.city || "Україна",
      "відгуки",
      "меню",
      "ціни",
    ],
    image: establishment.logoUrl,
    url: `/establishments/${establishment.slug}`,
  });
}

// Generate metadata for dynamic POS system page
export function generatePosSystemMetadata(posSystem: {
  name: string;
  description?: string;
  shortDescription?: string;
  priceFrom?: number;
  priceTo?: number;
  averageRating?: number;
  reviewCount?: number;
  logoUrl?: string;
  slug: string;
  features?: string[];
}): Metadata {
  const priceText = posSystem.priceFrom 
    ? ` від ₴${posSystem.priceFrom}/міс` 
    : "";
  const ratingText = posSystem.averageRating 
    ? ` ⭐ ${posSystem.averageRating.toFixed(1)}` 
    : "";
  
  return generateSEO({
    title: `${posSystem.name} - POS-система для ресторанів${priceText}`,
    description: posSystem.shortDescription || posSystem.description || 
      `${posSystem.name} - POS-система для автоматизації ресторанного бізнесу.${priceText}${ratingText}. Функції, ціни, відгуки.`,
    keywords: [
      posSystem.name,
      "POS-система",
      "автоматизація ресторану",
      "каса",
      ...(posSystem.features?.slice(0, 5) || []),
    ],
    image: posSystem.logoUrl,
    url: `/pos-systems/${posSystem.slug}`,
    type: "product",
  });
}

// Generate metadata for dynamic equipment page
export function generateEquipmentMetadata(equipment: {
  name: string;
  description?: string;
  shortDescription?: string;
  category?: { name: string };
  averageRating?: number;
  reviewCount?: number;
  logoUrl?: string;
  slug: string;
}): Metadata {
  const categoryText = equipment.category?.name || "Обладнання";
  
  return generateSEO({
    title: `${equipment.name} - ${categoryText} для ресторанів`,
    description: equipment.shortDescription || equipment.description || 
      `${equipment.name} - професійне ${categoryText.toLowerCase()} для ресторанів та кафе. Характеристики, ціни, відгуки.`,
    keywords: [
      equipment.name,
      categoryText,
      "обладнання для ресторану",
      "HoReCa",
      "професійна кухня",
    ],
    image: equipment.logoUrl,
    url: `/equipment/${equipment.slug}`,
    type: "product",
  });
}

// Generate metadata for dynamic blog article
export function generateArticleMetadata(article: {
  title: string;
  description?: string;
  excerpt?: string;
  category?: string;
  author?: string;
  publishedAt?: string;
  imageUrl?: string;
  slug: string;
  tags?: string[];
}): Metadata {
  return generateSEO({
    title: article.title,
    description: article.excerpt || article.description || 
      `${article.title} - стаття на блозі ZakladUA про ресторанний бізнес.`,
    keywords: [
      ...(article.tags || []),
      article.category || "статті",
      "ресторанний бізнес",
      "HoReCa",
    ],
    image: article.imageUrl,
    url: `/blog/${article.slug}`,
    type: "article",
    article: {
      publishedTime: article.publishedAt,
      author: article.author || "ZakladUA",
      section: article.category,
      tags: article.tags,
    },
  });
}

// Generate metadata for category pages
export function generateCategoryMetadata(
  type: "establishments" | "pos-systems" | "equipment" | "suppliers" | "delivery" | "qr-menu",
  category: {
    name: string;
    description?: string;
    slug: string;
  }
): Metadata {
  const typeLabels = {
    establishments: "Заклади",
    "pos-systems": "POS-системи",
    equipment: "Обладнання",
    suppliers: "Постачальники",
    delivery: "Доставка",
    "qr-menu": "QR-меню",
  };
  
  const typeLabel = typeLabels[type];
  
  return generateSEO({
    title: `${category.name} - ${typeLabel}`,
    description: category.description || 
      `${category.name} - каталог ${typeLabel.toLowerCase()} в категорії. Порівняння, відгуки, рейтинги.`,
    keywords: [
      category.name,
      typeLabel,
      "каталог",
      "порівняння",
      "Україна",
    ],
    url: `/${type}/category/${category.slug}`,
  });
}
