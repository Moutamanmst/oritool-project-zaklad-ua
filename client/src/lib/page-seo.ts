import { Metadata } from "next";
import { generateSEO, siteConfig } from "./seo";

// Centralized SEO configuration for all pages
// Can be overridden from admin panel via localStorage or API

export interface PageSEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  h1?: string;
  faqs?: { question: string; answer: string }[];
}

// Default SEO for all pages - COMPLETE list of all routes
export const defaultPageSEO: Record<string, PageSEOConfig> = {
  // ============================================
  // MAIN PAGES
  // ============================================
  "/": {
    title: "ZakladUA - B2B платформа для ресторанного бізнесу",
    description: "Знаходьте найкращі рішення для вашого закладу: POS-системи, обладнання, постачальників, сервіси доставки та багато іншого. Порівнюйте, читайте відгуки, обирайте.",
    keywords: ["ресторан", "кафе", "POS-система", "обладнання", "постачальники", "HoReCa", "Україна", "автоматизація"],
    h1: "Ваш персональний помічник у ресторанному бізнесі",
  },
  
  // ============================================
  // ESTABLISHMENTS (Заклади)
  // ============================================
  "/establishments": {
    title: "Заклади - каталог ресторанів, кафе та барів України",
    description: "Перегляньте каталог закладів HoReCa України: ресторани, кафе, бари, пекарні, кав'ярні. Відгуки, рейтинги, адреси, меню, контакти.",
    keywords: ["заклади", "ресторани", "кафе", "бари", "пекарні", "кав'ярні", "Київ", "Львів", "Одеса", "Україна", "каталог"],
    h1: "Каталог закладів HoReCa України",
  },
  "/establishments/rating": {
    title: "Рейтинг закладів України - топ ресторанів та кафе",
    description: "Найкращі заклади України за оцінками відвідувачів. Топ ресторанів, кафе та барів у Києві, Львові, Одесі та інших містах.",
    keywords: ["рейтинг ресторанів", "топ кафе", "кращі заклади", "відгуки", "оцінки", "Україна", "Київ", "Львів"],
    h1: "Рейтинг найкращих закладів України",
  },
  "/establishments/category": {
    title: "Категорії закладів - ресторани, кафе, бари, кав'ярні",
    description: "Перегляньте заклади за категоріями: ресторани, кафе, бари, піцерії, кав'ярні, пекарні, фастфуди та інші типи закладів.",
    keywords: ["категорії", "ресторани", "кафе", "бари", "кав'ярні", "пекарні", "піцерії"],
    h1: "Категорії закладів",
  },
  
  // ============================================
  // POS SYSTEMS (POS-системи)
  // ============================================
  "/pos-systems": {
    title: "POS-системи для ресторанів - порівняння та відгуки 2024",
    description: "Порівняйте найкращі POS-системи для автоматизації ресторанного бізнесу: Poster, iiko, R-Keeper, Syrve, Goovii та інші. Ціни, функції, відгуки.",
    keywords: ["POS-система", "Poster", "iiko", "R-Keeper", "Syrve", "Goovii", "автоматизація ресторану", "каса", "облік"],
    h1: "POS-системи для автоматизації ресторанів",
  },
  "/pos-systems/articles": {
    title: "Статті про POS-системи - огляди та порівняння",
    description: "Детальні огляди POS-систем, порівняння функцій, ціни та рекомендації для вибору оптимального рішення для вашого закладу.",
    keywords: ["статті", "POS-система", "огляди", "порівняння", "вибір"],
    h1: "Статті та огляди POS-систем",
  },
  
  // ============================================
  // EQUIPMENT (Обладнання)
  // ============================================
  "/equipment": {
    title: "Обладнання для ресторанів та кафе - професійна техніка HoReCa",
    description: "Професійне обладнання для HoReCa: печі, холодильники, посудомийні машини, барне обладнання. RATIONAL, Hoshizaki, Fagor.",
    keywords: ["обладнання", "ресторан", "кухня", "печі", "холодильники", "RATIONAL", "Hoshizaki", "HoReCa"],
    h1: "Професійне обладнання для ресторанів",
  },
  "/equipment/category": {
    title: "Категорії обладнання для ресторанів",
    description: "Обладнання за категоріями: теплове, холодильне, посудомийне, барне, кондитерське обладнання та меблі для ресторанів.",
    keywords: ["категорії", "обладнання", "теплове", "холодильне", "барне", "кондитерське"],
    h1: "Категорії обладнання",
  },
  
  // ============================================
  // SUPPLIERS (Постачальники)
  // ============================================
  "/suppliers": {
    title: "Постачальники продуктів для HoReCa - каталог оптових постачальників",
    description: "Знайдіть надійних постачальників продуктів, напоїв та інгредієнтів для вашого закладу. Оптові ціни, доставка по Україні.",
    keywords: ["постачальники", "продукти", "HoReCa", "оптом", "м'ясо", "овочі", "напої", "інгредієнти"],
    h1: "Постачальники продуктів для HoReCa",
  },
  
  // ============================================
  // DELIVERY (Доставка)
  // ============================================
  "/delivery": {
    title: "Сервіси доставки їжі для ресторанів - Glovo, Bolt Food та інші",
    description: "Агрегатори та сервіси доставки їжі: Glovo, Bolt Food, Rocket та інші. Порівняння комісій, умов підключення.",
    keywords: ["доставка", "Glovo", "Bolt Food", "Rocket", "агрегатор", "доставка їжі", "кур'єр"],
    h1: "Сервіси доставки їжі для ресторанів",
  },
  
  // ============================================
  // QR MENU (QR-меню)
  // ============================================
  "/qr-menu": {
    title: "QR-меню для ресторанів - електронне меню та онлайн-замовлення",
    description: "Сервіси QR-меню для закладів: електронне меню, замовлення зі столу, оплата онлайн. Безкоштовні та платні рішення.",
    keywords: ["QR-меню", "електронне меню", "замовлення", "ресторан", "безконтактне меню", "онлайн меню"],
    h1: "QR-меню сервіси для ресторанів",
  },
  
  // ============================================
  // MARKETING (Маркетинг)
  // ============================================
  "/marketing": {
    title: "Маркетинг для ресторанів - інструменти просування закладу",
    description: "Інструменти маркетингу для ресторанного бізнесу: SMM, програми лояльності, акції, реклама, email-маркетинг.",
    keywords: ["маркетинг", "ресторан", "SMM", "реклама", "просування", "лояльність", "акції", "Instagram"],
    h1: "Маркетинг для ресторанного бізнесу",
  },
  "/marketing/smm": {
    title: "SMM для ресторанів - просування в соцмережах",
    description: "Стратегії просування ресторанів в Instagram, Facebook, TikTok. Поради з контент-маркетингу та роботи з блогерами.",
    keywords: ["SMM", "Instagram", "Facebook", "TikTok", "соцмережі", "ресторан", "просування"],
    h1: "SMM маркетинг для ресторанів",
  },
  "/marketing/loyalty": {
    title: "Програми лояльності для ресторанів",
    description: "Як створити ефективну програму лояльності для ресторану. Огляд сервісів та кращі практики утримання клієнтів.",
    keywords: ["лояльність", "бонуси", "знижки", "постійні клієнти", "CRM", "ресторан"],
    h1: "Програми лояльності для закладів",
  },
  "/marketing/email": {
    title: "Email-маркетинг для ресторанів",
    description: "Ефективний email-маркетинг для ресторанів: розсилки, акції, персоналізація. Огляд сервісів та шаблони листів.",
    keywords: ["email", "розсилка", "маркетинг", "ресторан", "акції", "персоналізація"],
    h1: "Email-маркетинг для ресторанів",
  },
  
  // ============================================
  // BLOG (Блог)
  // ============================================
  "/blog": {
    title: "Блог ZakladUA - статті про ресторанний бізнес",
    description: "Корисні статті, поради та новини для власників ресторанів та кафе. Тренди HoReCa, кейси, інтерв'ю, гайди.",
    keywords: ["блог", "статті", "ресторанний бізнес", "HoReCa", "поради", "тренди", "кейси", "гайди"],
    h1: "Блог про ресторанний бізнес",
  },
  // Статті блогу генеруються динамічно з бази даних
  
  // ============================================
  // AI HELPER
  // ============================================
  "/ai-helper": {
    title: "AI-консультант для ресторанного бізнесу - безкоштовна допомога",
    description: "Безкоштовний AI-асистент для ресторанів. Отримайте відповіді на питання про обладнання, POS-системи, маркетинг.",
    keywords: ["AI", "штучний інтелект", "консультант", "ресторан", "допомога", "чат-бот", "рекомендації"],
    h1: "AI-помічник для ресторанного бізнесу",
  },
  
  // ============================================
  // AGGREGATORS
  // ============================================
  "/aggregators": {
    title: "Агрегатори послуг для HoReCa - сервіси та маркетплейси",
    description: "Агрегатори та маркетплейси для ресторанного бізнесу: порівняння сервісів, огляди, рейтинги.",
    keywords: ["агрегатори", "маркетплейс", "HoReCa", "сервіси", "порівняння", "ресторан"],
    h1: "Агрегатори послуг для HoReCa",
  },
  
  // ============================================
  // DESIGN (Дизайн)
  // ============================================
  "/design": {
    title: "Дизайн ресторанів та кафе - ідеї інтер'єру",
    description: "Ідеї дизайну інтер'єру для ресторанів та кафе. Тренди 2024, стилі оформлення, поради дизайнерів.",
    keywords: ["дизайн ресторану", "інтер'єр кафе", "оформлення", "тренди дизайну", "стиль", "декор"],
    h1: "Дизайн інтер'єру ресторанів",
  },
  "/design/category": {
    title: "Категорії дизайну ресторанів",
    description: "Дизайн ресторанів за стилями: лофт, мінімалізм, класика, скандинавський, industrial та інші напрямки.",
    keywords: ["стилі", "дизайн", "лофт", "мінімалізм", "класика", "industrial", "ресторан"],
    h1: "Стилі дизайну ресторанів",
  },
  
  // ============================================
  // PRICING (Тарифи)
  // ============================================
  "/pricing": {
    title: "Тарифи ZakladUA - ціни на послуги платформи",
    description: "Тарифні плани ZakladUA для закладів та постачальників. Безкоштовна реєстрація, преміум-функції, розміщення реклами.",
    keywords: ["тарифи", "ціни", "ZakladUA", "реєстрація", "преміум", "реклама"],
    h1: "Тарифи та ціни ZakladUA",
  },
  
  // ============================================
  // AUTH PAGES
  // ============================================
  "/login": {
    title: "Вхід в акаунт ZakladUA",
    description: "Увійдіть до свого акаунту ZakladUA для управління закладом, відгуками та налаштуваннями.",
    keywords: ["вхід", "логін", "авторизація", "ZakladUA"],
    h1: "Вхід в акаунт",
  },
  "/register": {
    title: "Реєстрація на ZakladUA - створіть акаунт",
    description: "Зареєструйтесь на ZakladUA безкоштовно. Додайте свій заклад, залишайте відгуки, отримуйте рекомендації.",
    keywords: ["реєстрація", "створити акаунт", "ZakladUA", "безкоштовно"],
    h1: "Реєстрація на ZakladUA",
  },
  
  // ============================================
  // LEGAL PAGES
  // ============================================
  "/privacy": {
    title: "Політика конфіденційності ZakladUA",
    description: "Політика конфіденційності та обробки персональних даних ZakladUA. Як ми захищаємо вашу інформацію.",
    keywords: ["конфіденційність", "персональні дані", "GDPR", "політика", "захист даних"],
    h1: "Політика конфіденційності",
  },
  "/terms": {
    title: "Умови використання ZakladUA",
    description: "Умови використання платформи ZakladUA. Правила, обмеження, відповідальність користувачів та адміністрації.",
    keywords: ["умови", "правила", "використання", "угода", "користувач"],
    h1: "Умови використання",
  },
  
  // ============================================
  // INFO PAGES
  // ============================================
  "/about": {
    title: "Про ZakladUA - B2B платформа для HoReCa",
    description: "ZakladUA - провідна B2B платформа для ресторанного бізнесу в Україні. Наша місія, команда, історія, контакти.",
    keywords: ["про нас", "ZakladUA", "команда", "місія", "B2B платформа", "HoReCa"],
    h1: "Про платформу ZakladUA",
  },
  "/contact": {
    title: "Контакти ZakladUA - зв'яжіться з нами",
    description: "Зв'яжіться з командою ZakladUA: email, телефон, соцмережі. Форма зворотного зв'язку для питань та пропозицій.",
    keywords: ["контакти", "зв'язок", "email", "телефон", "підтримка", "форма"],
    h1: "Контакти",
  },
  "/compare": {
    title: "Порівняння POS-систем та обладнання для ресторанів",
    description: "Порівняйте різні POS-системи, обладнання та сервіси для вашого закладу. Детальні таблиці порівняння.",
    keywords: ["порівняння", "POS-система", "обладнання", "вибір", "таблиця", "функції"],
    h1: "Порівняння рішень",
  },
  
  // ============================================
  // DYNAMIC PAGES (templates for [slug] pages)
  // ============================================
  "/establishments/[slug]": {
    title: "[name] - ресторан/кафе | ZakladUA",
    description: "[name] - детальна інформація, меню, відгуки, контакти. Відвідайте заклад на ZakladUA.",
    keywords: ["ресторан", "кафе", "відгуки", "меню", "адреса"],
    h1: "[name]",
  },
  "/establishments/category/[slug]": {
    title: "[category] - заклади категорії | ZakladUA",
    description: "Заклади категорії [category]: каталог, відгуки, рейтинги. Знайдіть найкращий заклад на ZakladUA.",
    keywords: ["категорія", "заклади", "каталог"],
    h1: "Заклади категорії [category]",
  },
  "/pos-systems/[slug]": {
    title: "[name] - POS-система для ресторанів | ZakladUA",
    description: "[name] - детальний огляд POS-системи: функції, ціни, відгуки, інтеграції. Порівняйте на ZakladUA.",
    keywords: ["POS-система", "автоматизація", "функції", "ціни", "відгуки"],
    h1: "[name] - POS-система",
  },
  "/equipment/[slug]": {
    title: "[name] - обладнання для ресторанів | ZakladUA",
    description: "[name] - професійне обладнання: характеристики, ціни, де купити. Огляд на ZakladUA.",
    keywords: ["обладнання", "техніка", "ресторан", "характеристики"],
    h1: "[name]",
  },
  "/equipment/category/[slug]": {
    title: "[category] - обладнання для ресторанів | ZakladUA",
    description: "Обладнання категорії [category]: каталог, порівняння, ціни. Знайдіть найкраще на ZakladUA.",
    keywords: ["категорія", "обладнання", "каталог"],
    h1: "Обладнання: [category]",
  },
  "/suppliers/[slug]": {
    title: "[name] - постачальник продуктів | ZakladUA",
    description: "[name] - постачальник продуктів для HoReCa: асортимент, умови, контакти. Огляд на ZakladUA.",
    keywords: ["постачальник", "продукти", "HoReCa", "оптом"],
    h1: "[name]",
  },
  "/delivery/[slug]": {
    title: "[name] - сервіс доставки їжі | ZakladUA",
    description: "[name] - сервіс доставки: умови підключення, комісії, інтеграції. Детальний огляд на ZakladUA.",
    keywords: ["доставка", "агрегатор", "підключення", "комісія"],
    h1: "[name] - сервіс доставки",
  },
  "/qr-menu/[slug]": {
    title: "[name] - QR-меню для ресторанів | ZakladUA",
    description: "[name] - сервіс QR-меню: функції, тарифи, відгуки. Огляд на ZakladUA.",
    keywords: ["QR-меню", "електронне меню", "функції", "тарифи"],
    h1: "[name] - QR-меню",
  },
  "/marketing/[slug]": {
    title: "[name] - маркетинг для ресторанів | ZakladUA",
    description: "[name] - маркетинговий інструмент для ресторанів: можливості, ціни, кейси. Огляд на ZakladUA.",
    keywords: ["маркетинг", "інструмент", "просування", "ресторан"],
    h1: "[name]",
  },
  "/blog/[slug]": {
    title: "[title] | Блог ZakladUA",
    description: "[excerpt] Читайте на блозі ZakladUA.",
    keywords: ["стаття", "блог", "HoReCa"],
    h1: "[title]",
  },
  "/design/[slug]": {
    title: "[name] - дизайн ресторану | ZakladUA",
    description: "[name] - ідеї дизайну інтер'єру для ресторанів. Фото, поради, референси на ZakladUA.",
    keywords: ["дизайн", "інтер'єр", "ідеї", "референс"],
    h1: "[name]",
  },
  "/design/category/[slug]": {
    title: "[category] - стиль дизайну ресторанів | ZakladUA",
    description: "Дизайн ресторанів у стилі [category]: ідеї, приклади, поради. Натхнення на ZakladUA.",
    keywords: ["стиль", "дизайн", "інтер'єр", "ідеї"],
    h1: "Дизайн у стилі [category]",
  },
};

// Get SEO config for a page (with localStorage override support)
export function getPageSEO(path: string): PageSEOConfig {
  const defaultConfig = defaultPageSEO[path] || defaultPageSEO["/"];
  
  // Server-side: just return default config
  if (typeof window === "undefined") {
    return defaultConfig;
  }
  
  // Client-side: try to get custom SEO from localStorage (set by admin)
  try {
    const customSEO = localStorage.getItem(`zakladua-seo-${path}`);
    if (customSEO) {
      const parsed = JSON.parse(customSEO);
      // Merge with defaults, ensure keywords is array
      return {
        ...defaultConfig,
        ...parsed,
        keywords: Array.isArray(parsed.keywords) 
          ? parsed.keywords 
          : typeof parsed.keywords === "string" 
            ? parsed.keywords.split(",").map((k: string) => k.trim())
            : defaultConfig.keywords,
      };
    }
  } catch (e) {
    console.error("Failed to load custom SEO:", e);
  }
  
  return defaultConfig;
}

// Get H1 for a page
export function getPageH1(path: string): string {
  if (typeof window === "undefined") {
    const config = defaultPageSEO[path];
    return config?.title.split(" - ")[0] || config?.title || "";
  }
  
  try {
    const customSEO = localStorage.getItem(`zakladua-seo-${path}`);
    if (customSEO) {
      const parsed = JSON.parse(customSEO);
      if (parsed.h1) return parsed.h1;
    }
  } catch (e) {}
  
  const config = defaultPageSEO[path];
  return config?.title.split(" - ")[0] || config?.title || "";
}

// Get FAQ for a page
export function getPageFAQ(path: string): { question: string; answer: string }[] {
  if (typeof window === "undefined") {
    return [];
  }
  
  try {
    const customSEO = localStorage.getItem(`zakladua-seo-${path}`);
    if (customSEO) {
      const parsed = JSON.parse(customSEO);
      return parsed.faqs || [];
    }
  } catch (e) {}
  
  return [];
}

// Generate Next.js Metadata for a page
export function generatePageMetadata(path: string, customData?: Partial<PageSEOConfig>): Metadata {
  const config = { ...getPageSEO(path), ...customData };
  
  return generateSEO({
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    image: config.ogImage,
    url: path,
  });
}

// Generate metadata for dynamic pages (establishments, pos-systems, etc.)
export function generateDynamicMetadata(
  type: "establishment" | "pos-system" | "equipment" | "supplier" | "article" | "delivery" | "qr-menu" | "marketing",
  data: {
    name: string;
    description?: string;
    shortDescription?: string;
    slug: string;
    logoUrl?: string;
    coverUrl?: string;
    category?: string;
    city?: string;
    averageRating?: number;
    reviewCount?: number;
    priceFrom?: number;
  }
): Metadata {
  const typeConfig: Record<string, { prefix: string; basePath: string; keywords: string[]; suffix: string }> = {
    "establishment": {
      prefix: "",
      basePath: "/establishments",
      keywords: ["ресторан", "кафе", "заклад", "відгуки", "меню"],
      suffix: "",
    },
    "pos-system": {
      prefix: "",
      basePath: "/pos-systems",
      keywords: ["POS-система", "автоматизація", "каса", "ресторан"],
      suffix: " - POS-система для ресторанів",
    },
    "equipment": {
      prefix: "",
      basePath: "/equipment",
      keywords: ["обладнання", "техніка", "ресторан", "HoReCa"],
      suffix: " - обладнання для ресторанів",
    },
    "supplier": {
      prefix: "Постачальник",
      basePath: "/suppliers",
      keywords: ["постачальник", "продукти", "HoReCa", "оптом"],
      suffix: "",
    },
    "article": {
      prefix: "",
      basePath: "/blog",
      keywords: ["стаття", "блог", "ресторанний бізнес", "поради"],
      suffix: "",
    },
    "delivery": {
      prefix: "",
      basePath: "/delivery",
      keywords: ["доставка", "агрегатор", "ресторан", "кур'єр"],
      suffix: " - сервіс доставки їжі",
    },
    "qr-menu": {
      prefix: "",
      basePath: "/qr-menu",
      keywords: ["QR-меню", "електронне меню", "онлайн замовлення"],
      suffix: " - QR-меню для ресторанів",
    },
    "marketing": {
      prefix: "",
      basePath: "/marketing",
      keywords: ["маркетинг", "просування", "реклама", "ресторан"],
      suffix: " - маркетинг для ресторанів",
    },
  };

  const config = typeConfig[type];
  const title = config.prefix 
    ? `${config.prefix}: ${data.name}${config.suffix}` 
    : `${data.name}${config.suffix}`;
  
  let description = data.description || data.shortDescription || 
    `${data.name} - детальна інформація, відгуки та рейтинг на ZakladUA`;
  
  // Enhance description with rating, price, city
  const extras: string[] = [];
  if (data.averageRating && data.reviewCount) {
    extras.push(`⭐ ${data.averageRating.toFixed(1)}/5 (${data.reviewCount} відгуків)`);
  }
  if (data.priceFrom) {
    extras.push(`від ₴${data.priceFrom}/міс`);
  }
  if (data.city) {
    extras.push(data.city);
  }
  
  if (extras.length > 0) {
    description = `${description.slice(0, 120)} ${extras.join(" • ")}`;
  }

  return generateSEO({
    title,
    description: description.slice(0, 160),
    keywords: [...config.keywords, data.name, data.category || ""].filter(Boolean),
    image: data.coverUrl || data.logoUrl,
    url: `${config.basePath}/${data.slug}`,
    type: type === "article" ? "article" : "website",
  });
}

// Generate metadata for category pages
export function generateCategoryMetadata(
  baseType: "establishments" | "equipment" | "pos-systems" | "suppliers" | "delivery" | "qr-menu" | "design" | "marketing",
  category: {
    name: string;
    slug: string;
    description?: string;
  }
): Metadata {
  const typeConfig: Record<string, { title: string; basePath: string; keywords: string[] }> = {
    "establishments": { 
      title: "Заклади", 
      basePath: "/establishments/category",
      keywords: ["заклади", "ресторани", "кафе", "каталог"],
    },
    "equipment": { 
      title: "Обладнання", 
      basePath: "/equipment/category",
      keywords: ["обладнання", "техніка", "HoReCa"],
    },
    "pos-systems": { 
      title: "POS-системи", 
      basePath: "/pos-systems/category",
      keywords: ["POS", "автоматизація", "каса"],
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
      keywords: ["QR-меню", "електронне меню"],
    },
    "design": { 
      title: "Дизайн", 
      basePath: "/design/category",
      keywords: ["дизайн", "інтер'єр", "оформлення"],
    },
    "marketing": { 
      title: "Маркетинг", 
      basePath: "/marketing",
      keywords: ["маркетинг", "просування", "реклама"],
    },
  };

  const config = typeConfig[baseType];
  const title = `${category.name} - ${config.title}`;
  const description = category.description || 
    `${category.name}: каталог, порівняння, відгуки та рейтинги ${config.title.toLowerCase()} на ZakladUA`;

  return generateSEO({
    title,
    description,
    keywords: [category.name, ...config.keywords, "Україна"],
    url: `${config.basePath}/${category.slug}`,
  });
}
