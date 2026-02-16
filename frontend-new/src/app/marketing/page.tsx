"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Lightbulb, 
  TrendingUp, 
  FileText, 
  UtensilsCrossed,
  Megaphone,
  Target,
  Users,
  Camera,
  CalendarDays,
  Rocket,
  BookOpen,
  Building2,
  Utensils,
  Leaf,
  GraduationCap,
  BarChart3,
  Cpu
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";

interface PageContent {
  title: string;
  subtitle: string;
  description: string;
}

const defaultContent: PageContent = {
  title: "Маркетинг",
  subtitle: "Просування вашого бізнесу",
  description: "Все про просування вашого закладу",
};

const categories = [
  {
    slug: "tips-trends",
    name: "Фішки та тренди",
    description: "Актуальні тренди та корисні поради для маркетингу закладу",
    icon: Lightbulb,
    color: "from-amber-500 to-orange-500",
  },
  {
    slug: "cases",
    name: "Кейси та приклади",
    description: "Успішні приклади маркетингових кампаній закладів",
    icon: TrendingUp,
    color: "from-emerald-500 to-teal-500",
  },
  {
    slug: "menu-marketing",
    name: "Маркетинг меню",
    description: "Як правильно оформити та просувати меню закладу",
    icon: UtensilsCrossed,
    color: "from-violet-500 to-purple-500",
  },
  {
    slug: "social-media",
    name: "Соціальні мережі",
    description: "SMM-стратегії та контент для ресторанного бізнесу",
    icon: Camera,
    color: "from-pink-500 to-rose-500",
  },
  {
    slug: "loyalty",
    name: "Програми лояльності",
    description: "Як утримати клієнтів та збільшити повторні візити",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
  },
  {
    slug: "advertising",
    name: "Реклама закладу",
    description: "Ефективні рекламні канали для ресторанів та кафе",
    icon: Target,
    color: "from-red-500 to-orange-500",
  },
  {
    slug: "events",
    name: "Події",
    description: "Заходи та івенти у закладах",
    icon: CalendarDays,
    color: "from-indigo-500 to-violet-500",
  },
  {
    slug: "how-to-open",
    name: "Як відкрити заклад",
    description: "Поради для початківців у ресторанному бізнесі",
    icon: Rocket,
    color: "from-sky-500 to-blue-500",
  },
  {
    slug: "menu-pricing",
    name: "Меню та ціноутворення",
    description: "Як формувати меню та встановлювати ціни",
    icon: BookOpen,
    color: "from-emerald-500 to-green-500",
  },
  {
    slug: "franchises",
    name: "Франшизи",
    description: "Готові бізнес-рішення для ресторанів",
    icon: Building2,
    color: "from-purple-500 to-fuchsia-500",
  },
  {
    slug: "business-lunch",
    name: "Бізнес-ланчі",
    description: "Де пообідати та як організувати бізнес-ланч",
    icon: Utensils,
    color: "from-orange-500 to-amber-500",
  },
  {
    slug: "staff",
    name: "Персонал",
    description: "Найм та управління командою закладу",
    icon: Users,
    color: "from-rose-500 to-pink-500",
  },
  {
    slug: "ecology",
    name: "Екологія",
    description: "Еко-ініціативи та сталий розвиток",
    icon: Leaf,
    color: "from-emerald-500 to-green-500",
  },
  {
    slug: "education",
    name: "Навчання",
    description: "Курси, тренінги, майстер-класи",
    icon: GraduationCap,
    color: "from-indigo-500 to-blue-500",
  },
  {
    slug: "analytics",
    name: "Аналітика",
    description: "Метрики та показники ефективності",
    icon: BarChart3,
    color: "from-pink-500 to-rose-500",
  },
  {
    slug: "technology",
    name: "Технології",
    description: "Інновації та діджиталізація",
    icon: Cpu,
    color: "from-cyan-500 to-blue-500",
  },
];

export default function MarketingPage() {
  const [content, setContent] = useState<PageContent>(defaultContent);

  useEffect(() => {
    const savedContent = localStorage.getItem("zakladua-marketing");
    if (savedContent) {
      try {
        setContent({ ...defaultContent, ...JSON.parse(savedContent) });
      } catch (e) {
        console.error("Failed to parse marketing content:", e);
      }
    }
  }, []);

  return (
    <MainLayout>
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10">
              <Megaphone className="h-8 w-8 text-amber-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-100">{content.title}</h1>
              <p className="text-zinc-400">{content.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.slug}
                href={`/marketing/${category.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-amber-500/50 transition-all duration-300 p-6"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${category.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
                
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${category.color} bg-opacity-20 mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-zinc-100 mb-2 group-hover:text-amber-400 transition-colors">
                  {category.name}
                </h3>
                
                <p className="text-sm text-zinc-400">
                  {category.description}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="p-4 rounded-full bg-amber-500/20">
                <FileText className="h-10 w-10 text-amber-500" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-zinc-100 mb-2">
                Потрібна допомога з маркетингом?
              </h3>
              <p className="text-zinc-400">
                Зверніться до нашого AI-помічника для отримання персоналізованих рекомендацій
              </p>
            </div>
            <Link href="/ai-helper">
              <button className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-zinc-900 font-semibold rounded-xl transition-colors">
                Запитати Zaklad AI
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
    </MainLayout>
  );
}

