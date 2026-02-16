"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/MainLayout";

const categoryData: Record<string, { name: string; description: string }> = {
  "tips-trends": {
    name: "Фішки та тренди",
    description: "Актуальні тренди та корисні поради для маркетингу закладу",
  },
  "cases": {
    name: "Кейси та приклади",
    description: "Успішні приклади маркетингових кампаній закладів",
  },
  "menu-marketing": {
    name: "Маркетинг меню",
    description: "Як правильно оформити та просувати меню закладу",
  },
  "social-media": {
    name: "Соціальні мережі",
    description: "SMM-стратегії та контент для ресторанного бізнесу",
  },
  "loyalty": {
    name: "Програми лояльності",
    description: "Як утримати клієнтів та збільшити повторні візити",
  },
  "advertising": {
    name: "Реклама закладу",
    description: "Ефективні рекламні канали для ресторанів та кафе",
  },
  "events": {
    name: "Події",
    description: "Заходи та івенти у закладах",
  },
  "how-to-open": {
    name: "Як відкрити заклад",
    description: "Поради для початківців у ресторанному бізнесі",
  },
  "menu-pricing": {
    name: "Меню та ціноутворення",
    description: "Як формувати меню та встановлювати ціни",
  },
  "franchises": {
    name: "Франшизи",
    description: "Готові бізнес-рішення для ресторанів",
  },
  "business-lunch": {
    name: "Бізнес-ланчі",
    description: "Де пообідати та як організувати бізнес-ланч",
  },
  "staff": {
    name: "Персонал",
    description: "Найм та управління командою закладу",
  },
  "ecology": {
    name: "Екологія",
    description: "Еко-ініціативи та сталий розвиток",
  },
  "education": {
    name: "Навчання",
    description: "Курси, тренінги, майстер-класи",
  },
  "analytics": {
    name: "Аналітика",
    description: "Метрики та показники ефективності",
  },
};

const articles: Record<string, Array<{
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  readTime: number;
  views: number;
}>> = {
  "tips-trends": [
    {
      slug: "restaurant-trends-2024",
      title: "Топ-10 трендів ресторанного маркетингу 2024",
      excerpt: "Від персоналізації до екологічності — що працює зараз",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
      readTime: 8,
      views: 2450,
    },
    {
      slug: "instagram-reels-tips",
      title: "Як створювати вірусні Reels для ресторану",
      excerpt: "Секрети контенту, який збирає тисячі переглядів",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600",
      readTime: 6,
      views: 1890,
    },
    {
      slug: "seasonal-marketing",
      title: "Сезонний маркетинг: як використовувати свята",
      excerpt: "Календар маркетингових активностей на рік",
      image: "https://images.unsplash.com/photo-1482049016gy-2d846bc97fb7?w=600",
      readTime: 5,
      views: 1230,
    },
  ],
  "cases": [
    {
      slug: "case-lviv-cafe",
      title: "Як львівська кав'ярня збільшила продажі на 40%",
      excerpt: "Кейс використання Instagram та програми лояльності",
      image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600",
      readTime: 10,
      views: 3200,
    },
    {
      slug: "case-kyiv-restaurant",
      title: "Ребрендинг київського ресторану: до і після",
      excerpt: "Як зміна концепції привела нових клієнтів",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
      readTime: 12,
      views: 2800,
    },
    {
      slug: "case-delivery-growth",
      title: "Від 10 до 100 замовлень на день: історія успіху",
      excerpt: "Як невеликий заклад побудував систему доставки",
      image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600",
      readTime: 8,
      views: 4100,
    },
  ],
  "menu-marketing": [
    {
      slug: "menu-psychology",
      title: "Психологія меню: як збільшити середній чек",
      excerpt: "Розташування страв, ціни та описи що продають",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
      readTime: 7,
      views: 2100,
    },
    {
      slug: "food-photography",
      title: "Фуд-фотографія: як знімати страви для меню",
      excerpt: "Поради від професійних фуд-фотографів",
      image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600",
      readTime: 9,
      views: 1750,
    },
    {
      slug: "digital-menu-design",
      title: "Дизайн цифрового меню: UX для ресторанів",
      excerpt: "Як зробити QR-меню зручним та продаючим",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600",
      readTime: 6,
      views: 1400,
    },
  ],
  "social-media": [
    {
      slug: "instagram-strategy",
      title: "Instagram-стратегія для ресторану на 2024 рік",
      excerpt: "Контент-план, хештеги та робота з блогерами",
      image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600",
      readTime: 11,
      views: 3500,
    },
    {
      slug: "tiktok-restaurant",
      title: "TikTok для ресторанів: з чого почати",
      excerpt: "Формати контенту що працюють у 2024",
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600",
      readTime: 7,
      views: 2900,
    },
    {
      slug: "ugc-content",
      title: "UGC-контент: як мотивувати гостей ділитись",
      excerpt: "Стратегії залучення користувацького контенту",
      image: "https://images.unsplash.com/photo-1529543544277-750e11dbf6fd?w=600",
      readTime: 5,
      views: 1600,
    },
  ],
  "loyalty": [
    {
      slug: "loyalty-program-types",
      title: "5 типів програм лояльності для ресторанів",
      excerpt: "Від карток до мобільних додатків",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600",
      readTime: 8,
      views: 2200,
    },
    {
      slug: "customer-retention",
      title: "Як повернути клієнта: email та SMS маркетинг",
      excerpt: "Автоматизація комунікації з гостями",
      image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=600",
      readTime: 6,
      views: 1800,
    },
    {
      slug: "birthday-marketing",
      title: "День народження гостя: маркетингові можливості",
      excerpt: "Як використовувати персональні дати",
      image: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=600",
      readTime: 4,
      views: 1100,
    },
  ],
  "advertising": [
    {
      slug: "google-ads-restaurant",
      title: "Google Ads для ресторану: повний гайд",
      excerpt: "Налаштування кампаній та оптимізація бюджету",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600",
      readTime: 15,
      views: 2700,
    },
    {
      slug: "facebook-ads-tips",
      title: "Facebook та Instagram реклама для закладів",
      excerpt: "Таргетинг, креативи та аналітика",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600",
      readTime: 12,
      views: 3100,
    },
    {
      slug: "local-seo",
      title: "Локальне SEO: як потрапити в топ Google Maps",
      excerpt: "Оптимізація Google Business Profile",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600",
      readTime: 9,
      views: 2400,
    },
  ],
  "events": [
    {
      slug: "restaurant-events-guide",
      title: "Як організувати подію у ресторані",
      excerpt: "Покроковий гайд з організації заходів",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600",
      readTime: 10,
      views: 1850,
    },
    {
      slug: "wine-tasting-events",
      title: "Винні дегустації: як залучити нових гостей",
      excerpt: "Формати та організація винних вечорів",
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600",
      readTime: 7,
      views: 1420,
    },
    {
      slug: "live-music-restaurant",
      title: "Жива музика в ресторані: плюси та мінуси",
      excerpt: "Як обрати музикантів та організувати виступи",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600",
      readTime: 6,
      views: 980,
    },
  ],
  "how-to-open": [
    {
      slug: "restaurant-opening-checklist",
      title: "Чек-лист відкриття ресторану",
      excerpt: "Все що потрібно знати перед стартом",
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600",
      readTime: 15,
      views: 4200,
    },
    {
      slug: "restaurant-business-plan",
      title: "Як скласти бізнес-план для ресторану",
      excerpt: "Фінансові розрахунки та прогнози",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600",
      readTime: 12,
      views: 3100,
    },
    {
      slug: "restaurant-location",
      title: "Як обрати локацію для закладу",
      excerpt: "Фактори успішного розташування",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600",
      readTime: 8,
      views: 2500,
    },
  ],
  "menu-pricing": [
    {
      slug: "menu-engineering",
      title: "Меню-інжиніринг: наука продажів",
      excerpt: "Як аналізувати та оптимізувати меню",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
      readTime: 10,
      views: 2800,
    },
    {
      slug: "food-cost-calculation",
      title: "Розрахунок фудкосту: формули та приклади",
      excerpt: "Як правильно рахувати собівартість страв",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600",
      readTime: 11,
      views: 3500,
    },
    {
      slug: "seasonal-menu",
      title: "Сезонне меню: переваги та впровадження",
      excerpt: "Як використовувати сезонність на користь бізнесу",
      image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600",
      readTime: 7,
      views: 1900,
    },
  ],
  "franchises": [
    {
      slug: "franchise-basics",
      title: "Франшиза ресторану: з чого почати",
      excerpt: "Основи франчайзингу в ресторанному бізнесі",
      image: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600",
      readTime: 9,
      views: 2100,
    },
    {
      slug: "franchise-vs-own",
      title: "Франшиза чи власний бренд: що обрати",
      excerpt: "Порівняння двох моделей бізнесу",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600",
      readTime: 8,
      views: 1800,
    },
    {
      slug: "top-franchises-ukraine",
      title: "Топ-10 ресторанних франшиз в Україні",
      excerpt: "Огляд найпопулярніших франшиз",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
      readTime: 6,
      views: 4500,
    },
  ],
  "business-lunch": [
    {
      slug: "business-lunch-concept",
      title: "Як запустити бізнес-ланч у ресторані",
      excerpt: "Концепція та організація денного меню",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
      readTime: 7,
      views: 1600,
    },
    {
      slug: "business-lunch-pricing",
      title: "Ціноутворення бізнес-ланчу",
      excerpt: "Як встановити правильну ціну",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600",
      readTime: 5,
      views: 1200,
    },
    {
      slug: "corporate-clients",
      title: "Залучення корпоративних клієнтів",
      excerpt: "Як працювати з офісами та компаніями",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600",
      readTime: 8,
      views: 2000,
    },
  ],
  "staff": [
    {
      slug: "hiring-restaurant-staff",
      title: "Як найняти персонал для ресторану",
      excerpt: "Пошук, співбесіди та онбординг",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600",
      readTime: 10,
      views: 2700,
    },
    {
      slug: "staff-motivation",
      title: "Мотивація персоналу: що працює",
      excerpt: "Фінансові та нефінансові стимули",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600",
      readTime: 8,
      views: 2200,
    },
    {
      slug: "staff-training",
      title: "Навчання персоналу ресторану",
      excerpt: "Програми та методи підготовки команди",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600",
      readTime: 9,
      views: 1900,
    },
  ],
  "ecology": [
    {
      slug: "zero-waste-restaurant",
      title: "Zero Waste ресторан: як почати",
      excerpt: "Як зменшити відходи та стати екологічнішим",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600",
      readTime: 10,
      views: 2100,
    },
    {
      slug: "sustainable-sourcing",
      title: "Екологічні закупівлі продуктів",
      excerpt: "Як обирати еко-постачальників",
      image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600",
      readTime: 8,
      views: 1400,
    },
    {
      slug: "eco-packaging",
      title: "Екологічна упаковка для доставки",
      excerpt: "Альтернативи пластику та їх вартість",
      image: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600",
      readTime: 7,
      views: 1800,
    },
  ],
  "education": [
    {
      slug: "barista-courses",
      title: "Курси бариста: де навчитися",
      excerpt: "Огляд найкращих курсів в Україні",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600",
      readTime: 8,
      views: 2300,
    },
    {
      slug: "sommelier-training",
      title: "Як стати сомельє: навчання та сертифікація",
      excerpt: "Шлях до професії та програми навчання",
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600",
      readTime: 10,
      views: 1900,
    },
    {
      slug: "chef-masterclasses",
      title: "Майстер-класи від шеф-кухарів",
      excerpt: "Де підвищити кваліфікацію кухарям",
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600",
      readTime: 7,
      views: 1600,
    },
  ],
  "analytics": [
    {
      slug: "restaurant-kpi",
      title: "KPI для ресторану: ключові метрики",
      excerpt: "Які показники відстежувати щодня",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
      readTime: 9,
      views: 2500,
    },
    {
      slug: "food-cost-calculation",
      title: "Як рахувати фудкост правильно",
      excerpt: "Формули та інструменти для контролю витрат",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600",
      readTime: 11,
      views: 3100,
    },
    {
      slug: "revenue-analytics",
      title: "Аналітика виручки: що і як аналізувати",
      excerpt: "Дашборди та звіти для власника",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600",
      readTime: 8,
      views: 2000,
    },
  ],
};

export default function MarketingCategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const category = categoryData[slug];
  const categoryArticles = articles[slug] || [];

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-100 mb-4">Категорію не знайдено</h1>
          <Link href="/marketing" className="text-amber-500 hover:text-amber-400">
            Повернутись до маркетингу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/marketing"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад до маркетингу
        </Link>

        <div className="mb-12">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">{category.name}</h1>
          <p className="text-zinc-400">{category.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryArticles.map((article) => (
            <Link key={article.slug} href={`/marketing/${slug}/${article.slug}`}>
              <Card className="group overflow-hidden hover:scale-[1.02] transition-transform duration-300 h-full">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-bold text-zinc-100 mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readTime} хв
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {article.views}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
    </MainLayout>
  );
}

