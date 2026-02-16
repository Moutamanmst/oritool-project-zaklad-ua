"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Palette, ArrowRight, Trophy, TrendingUp, MapPin, Clock, Sparkles, Briefcase, Wallet, Scale, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EstablishmentCard } from "@/components/features/EstablishmentCard";
import { Skeleton } from "@/components/ui/skeleton";
import { api, endpoints } from "@/lib/api";
import { useLanguageStore, translations } from "@/store/language";
import { MainLayout } from "@/components/layout/MainLayout";
import type { Establishment, PaginatedResponse } from "@/types";

interface PageContent {
  title: string;
  subtitle: string;
  description: string;
  categories: { id: string; title: string; description: string; icon: string }[];
}

const defaultContent: PageContent = {
  title: "Заклади",
  subtitle: "Каталог закладів",
  description: "Знайдіть найкращі ресторани, кафе та бари",
  categories: [
    { id: "1", title: "Рейтинг закладів", description: "Топ закладів за оцінками користувачів", icon: "star" },
    { id: "2", title: "Дизайн закладів", description: "Ідеї для інтер'єру вашого закладу", icon: "palette" },
    { id: "3", title: "Бізнес-поради", description: "Практичні рішення для власників", icon: "briefcase" },
    { id: "4", title: "Фінанси", description: "Управління бюджетом та обліком", icon: "wallet" },
    { id: "5", title: "Юридичні питання", description: "Ліцензії, договори, перевірки", icon: "scale" },
    { id: "6", title: "Безпека", description: "Охорона, відеонагляд, пожежна безпека", icon: "shield" },
    { id: "7", title: "Сертифікація", description: "HACCP, ISO, органічні стандарти", icon: "award" },
  ],
};

const iconMap: Record<string, any> = {
  star: Star,
  palette: Palette,
  briefcase: Briefcase,
  wallet: Wallet,
  scale: Scale,
  shield: Shield,
  award: Award,
};

const colorMap: Record<string, string> = {
  star: "yellow",
  palette: "amber",
  briefcase: "blue",
  wallet: "green",
  scale: "purple",
  shield: "red",
  award: "orange",
};

const hrefMap: Record<string, string> = {
  "1": "/establishments/rating",
  "2": "/design/category/design",
  "3": "/establishments/category/business-tips",
  "4": "/establishments/category/finance",
  "5": "/establishments/category/legal",
  "6": "/establishments/category/security",
  "7": "/establishments/category/certification",
};

export default function EstablishmentsPage() {
  const [topEstablishments, setTopEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<PageContent>(defaultContent);
  const { lang } = useLanguageStore();
  const t = translations[lang];

  useEffect(() => {
    // Load content from localStorage
    const savedContent = localStorage.getItem("zakladua-establishments");
    if (savedContent) {
      try {
        setContent({ ...defaultContent, ...JSON.parse(savedContent) });
      } catch (e) {
        console.error("Failed to parse establishments content:", e);
      }
    }

    async function fetchTopEstablishments() {
      try {
        const data = await api.get<PaginatedResponse<Establishment>>(
          `${endpoints.establishments.list}?limit=3&sortBy=averageRating&sortOrder=desc`,
          { lang }
        );
        setTopEstablishments(data.data);
      } catch (error) {
        console.error("Failed to fetch establishments:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTopEstablishments();
  }, [lang]);

  return (
    <MainLayout>
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">
            {content.title}
          </h1>
          <p className="text-zinc-400">
            {content.description}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              <span className="text-2xl font-bold text-zinc-100">90+</span>
            </div>
            <p className="text-sm text-zinc-500">закладів</p>
          </div>
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-blue-400" />
              <span className="text-2xl font-bold text-zinc-100">26</span>
            </div>
            <p className="text-sm text-zinc-500">міст</p>
          </div>
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <span className="text-2xl font-bold text-zinc-100">4.5</span>
            </div>
            <p className="text-sm text-zinc-500">середній рейтинг</p>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-zinc-100 mb-6">Категорії</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.categories.map((category) => {
              const Icon = iconMap[category.icon] || Star;
              const color = colorMap[category.icon] || "amber";
              const href = hrefMap[category.id] || `/establishments/category/${category.id}`;
              return (
                <Link key={category.id} href={href} className="group">
                  <div className="relative h-56 rounded-2xl border border-zinc-700 bg-zinc-800/50 p-5 overflow-hidden transition-all hover:border-amber-500/50 hover:bg-zinc-800">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl transform translate-x-8 -translate-y-8 group-hover:bg-amber-500/20 transition-all" />
                    
                    <div className="relative h-full flex flex-col">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-3">
                        <Icon className="h-6 w-6 text-amber-400" />
                      </div>
                      
                      <h3 className="text-lg font-bold text-zinc-100 mb-2 group-hover:text-amber-400 transition-colors">
                        {category.title}
                      </h3>
                      
                      <p className="text-zinc-400 text-sm mb-3 flex-1 line-clamp-2">
                        {category.description}
                      </p>
                      
                      <div className="flex items-center justify-end">
                        <ArrowRight className="h-4 w-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Top Establishments */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-zinc-100">Топ-3 заклади</h2>
            <Link href="/establishments/rating">
              <Button variant="ghost" size="sm">
                Дивитись всі
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topEstablishments.map((establishment, index) => (
                <div key={establishment.id} className="relative">
                  {index === 0 && (
                    <div className="absolute -top-3 -left-3 z-10 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-black font-bold">🥇</span>
                    </div>
                  )}
                  {index === 1 && (
                    <div className="absolute -top-3 -left-3 z-10 w-10 h-10 bg-zinc-300 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-black font-bold">🥈</span>
                    </div>
                  )}
                  {index === 2 && (
                    <div className="absolute -top-3 -left-3 z-10 w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold">🥉</span>
                    </div>
                  )}
                  <EstablishmentCard establishment={establishment} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular Cities */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-zinc-100 mb-6">Популярні міста</h2>
          <div className="flex flex-wrap gap-3">
            {["Київ", "Львів", "Одеса", "Харків", "Дніпро", "Вінниця", "Запоріжжя", "Полтава"].map((city) => (
              <Link 
                key={city} 
                href={`/establishments/rating?city=${encodeURIComponent(city)}`}
                className="group"
              >
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800 border border-zinc-700 hover:border-blue-500/50 hover:bg-zinc-700 transition-all">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  <span className="text-zinc-100 group-hover:text-blue-400 transition-colors">{city}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-zinc-100 mb-6">Останні відгуки</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-400 font-bold">О</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-zinc-100">Олена</span>
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 mb-2">Кафе "Ранок", Львів</p>
                  <p className="text-sm text-zinc-300">"Чудова атмосфера та смачна кава! Обов'язково повернусь."</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                      <Clock className="h-3 w-3" />
                      <span>2 години тому</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335"/>
                        <circle cx="12" cy="9" r="2.5" fill="white"/>
                      </svg>
                      <span>Google Maps</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-400 font-bold">М</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-zinc-100">Максим</span>
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4].map((star) => (
                        <Star key={star} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      ))}
                      <Star className="h-3 w-3 text-zinc-600" />
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 mb-2">Ресторан "Смачна їжа", Київ</p>
                  <p className="text-sm text-zinc-300">"Швидке обслуговування, великі порції. Рекомендую!"</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                      <Clock className="h-3 w-3" />
                      <span>5 годин тому</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335"/>
                        <circle cx="12" cy="9" r="2.5" fill="white"/>
                      </svg>
                      <span>Google Maps</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/30 rounded-2xl p-8 text-center">
          <Sparkles className="h-10 w-10 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-zinc-100 mb-2">Маєте заклад?</h2>
          <p className="text-zinc-400 mb-6 max-w-md mx-auto">
            Додайте свій ресторан, кафе або бар на ZakladUA та залучайте нових клієнтів!
          </p>
          <Link href="/register?type=business">
            <Button className="bg-amber-500 hover:bg-amber-600 text-black font-medium">
              Додати заклад безкоштовно
            </Button>
          </Link>
        </div>
      </div>
    </div>
    </MainLayout>
  );
}
