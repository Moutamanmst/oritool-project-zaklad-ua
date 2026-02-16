"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Eye, Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/MainLayout";

const categoryData: Record<string, { 
  name: string; 
  description: string;
  articles: Array<{
    slug: string;
    title: string;
    excerpt: string;
    image: string;
    readTime: number;
    views: number;
  }>;
}> = {
  "business-tips": {
    name: "Бізнес-поради",
    description: "Практичні рішення для власників закладів",
    articles: [
      {
        slug: "restaurant-management-basics",
        title: "Основи управління рестораном",
        excerpt: "Ключові принципи ефективного менеджменту",
        image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600",
        readTime: 10,
        views: 2500,
      },
      {
        slug: "customer-service-tips",
        title: "Як покращити сервіс у закладі",
        excerpt: "Поради для підвищення якості обслуговування",
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600",
        readTime: 8,
        views: 1800,
      },
      {
        slug: "crisis-management",
        title: "Антикризовий менеджмент для ресторанів",
        excerpt: "Як пережити складні часи",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600",
        readTime: 12,
        views: 3200,
      },
    ],
  },
  "finance": {
    name: "Фінанси",
    description: "Управління бюджетом та обліком",
    articles: [
      {
        slug: "restaurant-budgeting",
        title: "Бюджетування ресторану: повний гайд",
        excerpt: "Як планувати фінанси закладу",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600",
        readTime: 15,
        views: 2800,
      },
      {
        slug: "cost-control",
        title: "Контроль витрат у ресторанному бізнесі",
        excerpt: "Як оптимізувати витрати без втрати якості",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600",
        readTime: 11,
        views: 2100,
      },
      {
        slug: "profit-margins",
        title: "Як збільшити прибутковість закладу",
        excerpt: "Стратегії підвищення маржинальності",
        image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=600",
        readTime: 9,
        views: 3500,
      },
    ],
  },
  "legal": {
    name: "Юридичні питання",
    description: "Ліцензії, договори, перевірки",
    articles: [
      {
        slug: "restaurant-licenses",
        title: "Які ліцензії потрібні для ресторану",
        excerpt: "Повний перелік дозвільних документів",
        image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600",
        readTime: 14,
        views: 4200,
      },
      {
        slug: "labor-law",
        title: "Трудове законодавство для рестораторів",
        excerpt: "Правильне оформлення персоналу",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600",
        readTime: 12,
        views: 1900,
      },
      {
        slug: "inspections-guide",
        title: "Як підготуватись до перевірок",
        excerpt: "Чек-лист для проходження інспекцій",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600",
        readTime: 10,
        views: 2700,
      },
    ],
  },
  "security": {
    name: "Безпека",
    description: "Охорона, відеонагляд, пожежна безпека",
    articles: [
      {
        slug: "fire-safety",
        title: "Пожежна безпека в ресторані",
        excerpt: "Вимоги та рекомендації",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
        readTime: 11,
        views: 1800,
      },
      {
        slug: "video-surveillance",
        title: "Відеоспостереження для закладів",
        excerpt: "Як обрати та встановити систему",
        image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600",
        readTime: 8,
        views: 1500,
      },
      {
        slug: "food-safety",
        title: "Безпека харчових продуктів",
        excerpt: "Стандарти зберігання та обробки",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
        readTime: 13,
        views: 2400,
      },
    ],
  },
  "maintenance": {
    name: "Технічне обслуговування",
    description: "Ремонт та сервіс обладнання",
    articles: [
      {
        slug: "equipment-maintenance",
        title: "Обслуговування кухонного обладнання",
        excerpt: "Графік та правила догляду",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
        readTime: 9,
        views: 1600,
      },
      {
        slug: "hvac-systems",
        title: "Вентиляція та кондиціювання",
        excerpt: "Як підтримувати комфортний клімат",
        image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600",
        readTime: 7,
        views: 1200,
      },
    ],
  },
  "certification": {
    name: "Сертифікація",
    description: "HACCP, ISO, органічні стандарти",
    articles: [
      {
        slug: "haccp-implementation",
        title: "Впровадження HACCP у ресторані",
        excerpt: "Покрокова інструкція",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600",
        readTime: 16,
        views: 3100,
      },
      {
        slug: "organic-certification",
        title: "Органічна сертифікація для закладів",
        excerpt: "Як отримати та що це дає",
        image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600",
        readTime: 11,
        views: 1700,
      },
    ],
  },
  "technology": {
    name: "Технології",
    description: "Інновації та діджиталізація",
    articles: [
      {
        slug: "restaurant-automation",
        title: "Автоматизація ресторанного бізнесу",
        excerpt: "Сучасні технологічні рішення",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
        readTime: 12,
        views: 2900,
      },
      {
        slug: "ai-in-restaurants",
        title: "Штучний інтелект у ресторанах",
        excerpt: "Як AI змінює індустрію",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600",
        readTime: 10,
        views: 2200,
      },
    ],
  },
  "partnerships": {
    name: "Партнерства",
    description: "Колаборації та нетворкінг",
    articles: [
      {
        slug: "restaurant-collaborations",
        title: "Колаборації між закладами",
        excerpt: "Як знайти партнерів",
        image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600",
        readTime: 8,
        views: 1500,
      },
      {
        slug: "supplier-partnerships",
        title: "Партнерство з постачальниками",
        excerpt: "Як будувати довгострокові відносини",
        image: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=600",
        readTime: 7,
        views: 1300,
      },
    ],
  },
  "trends": {
    name: "Тренди",
    description: "Що нового в індустрії",
    articles: [
      {
        slug: "restaurant-trends-2024",
        title: "Ресторанні тренди 2024 року",
        excerpt: "Що буде популярним",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
        readTime: 10,
        views: 4500,
      },
      {
        slug: "future-of-dining",
        title: "Майбутнє ресторанного бізнесу",
        excerpt: "Прогнози експертів",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
        readTime: 12,
        views: 3200,
      },
    ],
  },
};

export default function EstablishmentCategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const category = categoryData[slug];

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Construction className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-zinc-100 mb-2">Сторінка в розробці</h1>
          <p className="text-zinc-400 mb-6">Ця категорія скоро буде доступна</p>
          <Link href="/establishments">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Повернутись до закладів
            </Button>
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
          href="/establishments"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад до закладів
        </Link>

        <div className="mb-12">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">{category.name}</h1>
          <p className="text-zinc-400">{category.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.articles.map((article) => (
            <Link key={article.slug} href={`/establishments/category/${slug}/${article.slug}`}>
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

