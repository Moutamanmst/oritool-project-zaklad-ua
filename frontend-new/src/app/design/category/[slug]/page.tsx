"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Palette, Lightbulb, Camera, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/MainLayout";

const categoriesData: Record<string, {
  name: string;
  description: string;
  icon: string;
  color: string;
  articles: Array<{
    slug: string;
    title: string;
    excerpt: string;
    image: string;
    readTime: string;
    views: number;
    date: string;
  }>;
}> = {
  design: {
    name: "Дизайн закладів",
    description: "Освітлення, меблі, планування простору та інші аспекти дизайну",
    icon: "palette",
    color: "amber",
    articles: [
      {
        slug: "trends-2024",
        title: "Топ-10 трендів дизайну ресторанів у 2024",
        excerpt: "Мінімалізм, природні матеріали, відкриті кухні та інші актуальні напрямки.",
        image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&h=400&fit=crop",
        readTime: "7 хв",
        views: 2340,
        date: "15 грудня 2024",
      },
      {
        slug: "lighting-secrets",
        title: "Секрети освітлення: як світло впливає на апетит",
        excerpt: "Теплі тони збільшують середній чек на 15%. Розбираємо науку світла.",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
        readTime: "6 хв",
        views: 1420,
        date: "5 грудня 2024",
      },
      {
        slug: "small-space",
        title: "Маленький простір — великі можливості",
        excerpt: "Як оптимізувати простір у невеликому кафе та створити затишок.",
        image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600&h=400&fit=crop",
        readTime: "4 хв",
        views: 1650,
        date: "20 листопада 2024",
      },
    ],
  },
  trends: {
    name: "Фішки та тренди",
    description: "Інстаграмні інтер'єри, психологія кольору та сучасні рішення",
    icon: "lightbulb",
    color: "pink",
    articles: [
      {
        slug: "instagram-interior",
        title: "Як створити інстаграмний інтер'єр для кав'ярні",
        excerpt: "Фотозони, неонові вивіски, незвичні меблі — все для вірусного контенту.",
        image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&h=400&fit=crop",
        readTime: "5 хв",
        views: 1850,
        date: "10 грудня 2024",
      },
      {
        slug: "color-psychology",
        title: "Психологія кольору в ресторанному бізнесі",
        excerpt: "Червоний стимулює апетит, синій заспокоює — використовуйте правильно.",
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=400&fit=crop",
        readTime: "6 хв",
        views: 2100,
        date: "15 листопада 2024",
      },
      {
        slug: "eco-design",
        title: "Еко-дизайн: екологічний та стильний заклад",
        excerpt: "Перероблені матеріали, живі рослини, енергоефективність.",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop",
        readTime: "8 хв",
        views: 980,
        date: "28 листопада 2024",
      },
    ],
  },
  cases: {
    name: "Кейси та приклади",
    description: "Реальні проекти з детальними бюджетами та результатами",
    icon: "camera",
    color: "emerald",
    articles: [
      {
        slug: "case-kyiv-cafe",
        title: "Кейс: як ми оновили кав'ярню в центрі Києва",
        excerpt: "Повний редизайн за 3 тижні. Бюджет, матеріали, результат.",
        image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop",
        readTime: "10 хв",
        views: 3200,
        date: "12 грудня 2024",
      },
      {
        slug: "case-lviv-restaurant",
        title: "Кейс: ресторан української кухні у Львові",
        excerpt: "Як поєднати традиції та сучасність. Фото до/після.",
        image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&h=400&fit=crop",
        readTime: "8 хв",
        views: 2800,
        date: "5 грудня 2024",
      },
      {
        slug: "case-odesa-bar",
        title: "Кейс: коктейльний бар в Одесі з нуля",
        excerpt: "Від концепції до відкриття за 2 місяці. Повний розбір проекту.",
        image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=400&fit=crop",
        readTime: "12 хв",
        views: 1900,
        date: "28 листопада 2024",
      },
    ],
  },
};

const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  palette: Palette,
  lightbulb: Lightbulb,
  camera: Camera,
};

const colorClasses: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
  amber: {
    bg: "from-amber-500/10 to-orange-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    iconBg: "bg-amber-500/20",
  },
  pink: {
    bg: "from-pink-500/10 to-purple-500/10",
    border: "border-pink-500/20",
    text: "text-pink-400",
    iconBg: "bg-pink-500/20",
  },
  emerald: {
    bg: "from-emerald-500/10 to-teal-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    iconBg: "bg-emerald-500/20",
  },
};

export default function DesignCategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const category = categoriesData[slug];
  
  if (!category) {
    return (
      <div className="min-h-screen py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-2xl font-bold text-zinc-100 mb-4">
            Категорію не знайдено
          </h1>
          <Link href="/establishments">
            <Button>Повернутися до закладів</Button>
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = iconComponents[category.icon];
  const colors = colorClasses[category.color];

  return (
    <MainLayout>
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/establishments"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-amber-400 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад до закладів
        </Link>

        <div className={`mb-8 p-6 rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border}`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${colors.iconBg}`}>
              <IconComponent className={`h-8 w-8 ${colors.text}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-100 mb-1">{category.name}</h1>
              <p className="text-zinc-400">{category.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.articles.map((article) => (
            <Link key={article.slug} href={`/design/${article.slug}`} className="group">
              <article className={`rounded-2xl bg-zinc-900/50 border border-zinc-800 overflow-hidden hover:${colors.border.replace('border-', 'border-').replace('/20', '/40')} transition-all h-full`}>
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="p-5">
                  <h3 className={`font-bold text-zinc-100 mb-2 group-hover:${colors.text} transition-colors line-clamp-2`}>
                    {article.title}
                  </h3>
                  <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {article.views}
                    </span>
                    <span>{article.date}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
    </MainLayout>
  );
}

