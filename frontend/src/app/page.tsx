"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Crown, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EstablishmentCard } from "@/components/features/EstablishmentCard";
import { PosSystemCard } from "@/components/features/PosSystemCard";
import { CategoryCard } from "@/components/features/CategoryCard";
import { Skeleton } from "@/components/ui/skeleton";
import { api, endpoints } from "@/lib/api";
import { useLanguageStore, translations } from "@/store/language";
import { MainLayout } from "@/components/layout/MainLayout";
import type { Establishment, PosSystem, Category, PaginatedResponse } from "@/types";

interface HomepageContent {
  partnerName: string;
  partnerDescription: string;
  partnerRating: string;
  partnerViews: string;
  partnerSlug: string;
}

const defaultPartner: HomepageContent = {
  partnerName: "Poster POS",
  partnerDescription: "Автоматизація для кафе, ресторанів та магазинів. Просте впровадження за 15 хвилин.",
  partnerRating: "4.8",
  partnerViews: "12.4k",
  partnerSlug: "poster-pos",
};

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [posSystems, setPosSystems] = useState<PosSystem[]>([]);
  const [partner, setPartner] = useState<HomepageContent | null>(null);
  const [partnerLoaded, setPartnerLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguageStore();
  const t = translations[lang];

  // Load partner BEFORE first render using useLayoutEffect-like pattern
  useEffect(() => {
    if (partnerLoaded) return;
    
    const defaultDescription = "Автоматизація для кафе, ресторанів та магазинів. Просте впровадження за 15 хвилин.";
    
    // Try to load from API first, then fallback to localStorage
    async function loadHomepageContent() {
      try {
        const data = await api.get<HomepageContent>(endpoints.siteContent.get("homepage"));
        if (data && data.partnerName) {
          setPartner({
            partnerName: data.partnerName || defaultPartner.partnerName,
            partnerDescription: data.partnerDescription || defaultDescription,
            partnerRating: data.partnerRating || defaultPartner.partnerRating,
            partnerViews: data.partnerViews || defaultPartner.partnerViews,
            partnerSlug: data.partnerSlug || defaultPartner.partnerSlug,
          });
          setPartnerLoaded(true);
          return;
        }
      } catch (e) {
        // API failed, try localStorage
      }
      
      // Fallback to localStorage
      const savedHomepage = localStorage.getItem("zakladua-homepage");
      if (savedHomepage) {
        try {
          const data = JSON.parse(savedHomepage);
          setPartner({
            partnerName: data.partnerName || defaultPartner.partnerName,
            partnerDescription: data.partnerDescription || defaultDescription,
            partnerRating: data.partnerRating || defaultPartner.partnerRating,
            partnerViews: data.partnerViews || defaultPartner.partnerViews,
            partnerSlug: data.partnerSlug || defaultPartner.partnerSlug,
          });
        } catch (e) {
          console.error("Failed to parse homepage data:", e);
          setPartner(defaultPartner);
        }
      } else {
        setPartner(defaultPartner);
      }
      setPartnerLoaded(true);
    }
    
    loadHomepageContent();

    async function fetchData() {
      try {
        const [categoriesData, establishmentsData, posSystemsData] =
          await Promise.all([
            api.get<Category[]>(endpoints.categories.list, { lang }),
            api.get<PaginatedResponse<Establishment>>(
              `${endpoints.establishments.list}?limit=6`,
              { lang }
            ),
            api.get<PaginatedResponse<PosSystem>>(
              `${endpoints.posSystems.list}?limit=50`,
              { lang }
            ),
          ]);

        setCategories(categoriesData);
        setEstablishments(establishmentsData.data);
        setPosSystems(posSystemsData.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [lang]);

  return (
    <MainLayout>
    <div className="min-h-screen">
      <section className="relative hero-pattern py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              <span className="block text-zinc-100 whitespace-nowrap">
                Ваш персональний помічник
              </span>
              <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent whitespace-nowrap">
                у ресторанному бізнесі
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
              {t.home.description}
            </p>

            {/* Partner Card - Compact Premium */}
            <div className="relative max-w-4xl mx-auto">
              {/* Subtle glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 to-orange-500/30 rounded-2xl blur-lg" />
              
              {!partner || !partnerLoaded ? (
                <div className="relative overflow-hidden rounded-2xl bg-zinc-900/95 backdrop-blur border border-amber-500/20 p-6">
                  <div className="flex items-center gap-6">
                    <Skeleton className="h-16 w-16 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-4 w-64" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </div>
              ) : (
              <Link href={`/pos-systems/${partner.partnerSlug}`} className="block group relative">
                <div className="relative overflow-hidden rounded-2xl bg-zinc-900/95 backdrop-blur border border-amber-500/20 hover:border-amber-500/40 transition-all">
                  <div className="flex items-stretch">
                    {/* Left - Logo section */}
                    <div className="relative p-6 flex items-center justify-center bg-gradient-to-br from-amber-500/10 to-orange-500/5">
                      <div className="relative">
                        <div className="absolute inset-0 bg-amber-500 rounded-2xl blur-lg opacity-30" />
                        <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-zinc-800 flex items-center justify-center">
                          <img 
                            src={`/images/logos/${partner.partnerSlug}.svg`} 
                            alt={partner.partnerName} 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <span className="hidden text-2xl font-bold text-amber-400">{partner.partnerName.charAt(0)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Middle - Content */}
                    <div className="flex-1 p-5 flex flex-col justify-center">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">{partner.partnerName}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium flex items-center gap-1">
                          <Crown className="h-3 w-3" />
                          Партнер тижня
                        </span>
                      </div>
                      <p className="text-zinc-400 text-sm text-left line-clamp-2">{partner.partnerDescription}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-zinc-500 text-xs flex items-center gap-1">
                          <Eye className="h-3 w-3" /> {partner.partnerViews}
                        </span>
                        <span className="text-amber-400 text-xs font-semibold">★ {partner.partnerRating}</span>
                        <span className="text-emerald-400 text-xs flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          Рекомендовано
                        </span>
                      </div>
                    </div>
                    
                    {/* Right - Features + CTA */}
                    <div className="hidden lg:flex items-center gap-6 px-6 border-l border-zinc-800">
                      {/* POS Systems */}
                      {['poster-pos', 'goovii', 'iiko', 'r-keeper', 'syrve', 'checkbox', 'choice-qr'].includes(partner.partnerSlug) && (
                        <div className="flex gap-4">
                          <div className="text-center">
                            <p className="text-lg font-bold text-zinc-100">15 хв</p>
                            <p className="text-[10px] text-zinc-500 uppercase">Інтеграція</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-zinc-100">24/7</p>
                            <p className="text-[10px] text-zinc-500 uppercase">Підтримка</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-emerald-400">FREE</p>
                            <p className="text-[10px] text-zinc-500 uppercase">Тест</p>
                          </div>
                        </div>
                      )}
                      {/* Delivery Services */}
                      {['glovo', 'bolt'].includes(partner.partnerSlug) && (
                        <div className="flex gap-4">
                          <div className="text-center">
                            <p className="text-lg font-bold text-zinc-100">30 хв</p>
                            <p className="text-[10px] text-zinc-500 uppercase">Доставка</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-zinc-100">5000+</p>
                            <p className="text-[10px] text-zinc-500 uppercase">Закладів</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-emerald-400">0%</p>
                            <p className="text-[10px] text-zinc-500 uppercase">Старт</p>
                          </div>
                        </div>
                      )}
                      {/* Equipment */}
                      {['rational', 'profitex'].includes(partner.partnerSlug) && (
                        <div className="flex gap-4">
                          <div className="text-center">
                            <p className="text-lg font-bold text-zinc-100">5 р.</p>
                            <p className="text-[10px] text-zinc-500 uppercase">Гарантія</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-zinc-100">24/7</p>
                            <p className="text-[10px] text-zinc-500 uppercase">Сервіс</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-emerald-400">Лізинг</p>
                            <p className="text-[10px] text-zinc-500 uppercase">Доступно</p>
                          </div>
                        </div>
                      )}
                      {/* Suppliers */}
                      {['metro'].includes(partner.partnerSlug) && (
                        <div className="flex gap-4">
                          <div className="text-center">
                            <p className="text-lg font-bold text-zinc-100">-30%</p>
                            <p className="text-[10px] text-zinc-500 uppercase">Опт ціни</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-zinc-100">24 год</p>
                            <p className="text-[10px] text-zinc-500 uppercase">Доставка</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-emerald-400">Картка</p>
                            <p className="text-[10px] text-zinc-500 uppercase">Клієнта</p>
                          </div>
                        </div>
                      )}
                      {/* Default for unknown */}
                      {!['poster-pos', 'goovii', 'iiko', 'r-keeper', 'syrve', 'checkbox', 'choice-qr', 'glovo', 'bolt', 'rational', 'profitex', 'metro'].includes(partner.partnerSlug) && (
                        <span className="text-sm text-zinc-400 group-hover:text-amber-400 transition-colors">Детальніше</span>
                      )}
                      <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-zinc-100 mb-8 text-center">
            {t.home.allCategories}
          </h2>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {categories
                .filter((category) => 
                  !category.slug.includes("aggregators") && 
                  category.slug !== "restaurants" &&
                  !category.parentId
                )
                .map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Scrolling Brands */}
      <section className="py-8 overflow-hidden border-y border-zinc-800/50">
        <div className="relative">
          <div className="flex animate-scroll gap-12 whitespace-nowrap">
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="flex gap-12 items-center">
                <span className="text-2xl font-bold text-zinc-700 hover:text-amber-500 transition-colors cursor-default">Poster</span>
                <span className="text-2xl font-bold text-zinc-700 hover:text-amber-500 transition-colors cursor-default">iiko</span>
                <span className="text-2xl font-bold text-zinc-700 hover:text-amber-500 transition-colors cursor-default">R-Keeper</span>
                <span className="text-2xl font-bold text-zinc-700 hover:text-amber-500 transition-colors cursor-default">Syrve</span>
                <span className="text-2xl font-bold text-zinc-700 hover:text-amber-500 transition-colors cursor-default">Goovii</span>
                <span className="text-2xl font-bold text-zinc-700 hover:text-amber-500 transition-colors cursor-default">METRO</span>
                <span className="text-2xl font-bold text-zinc-700 hover:text-amber-500 transition-colors cursor-default">Glovo</span>
                <span className="text-2xl font-bold text-zinc-700 hover:text-amber-500 transition-colors cursor-default">Bolt Food</span>
                <span className="text-2xl font-bold text-zinc-700 hover:text-amber-500 transition-colors cursor-default">RATIONAL</span>
                <span className="text-2xl font-bold text-zinc-700 hover:text-amber-500 transition-colors cursor-default">Profitex</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-amber-400 rounded-full animate-ping" />
          <div className="absolute top-1/3 left-1/2 w-3 h-3 bg-emerald-400 rounded-full animate-ping delay-300" />
          <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-pink-400 rounded-full animate-ping delay-500" />
          <div className="absolute top-2/3 left-2/3 w-3 h-3 bg-blue-400 rounded-full animate-ping delay-700" />
          <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-violet-400 rounded-full animate-ping delay-1000" />
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-amber-400 font-medium mb-2">🇺🇦 По всій Україні</p>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4">
                Приєднуйтесь до спільноти
              </h2>
              <p className="text-zinc-400 mb-8">
                ZakladUA об'єднує ресторанний бізнес по всій Україні. 
                І це тільки початок.
              </p>
              
              <div className="flex gap-8 mb-8">
                <div>
                  <p className="text-3xl font-bold text-amber-400">8</p>
                  <p className="text-sm text-zinc-500">областей</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-emerald-400">26</p>
                  <p className="text-sm text-zinc-500">міст</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-pink-400">90</p>
                  <p className="text-sm text-zinc-500">закладів</p>
                </div>
              </div>
              
              <Link href="/register?type=business">
                <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold">
                  Приєднатися
                </Button>
              </Link>
            </div>
            
            <div className="relative inline-block mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/images/ukraine-map.png"
                alt="Карта України"
                className="max-w-md h-auto"
              />
              {/* Київ */}
              <div className="absolute" style={{ top: '30%', left: '48%' }}>
                <svg width="20" height="26" viewBox="0 0 24 32" className="drop-shadow-lg -translate-x-1/2 -translate-y-full">
                  <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20c0-6.6-5.4-12-12-12z" fill="#ef4444"/>
                  <circle cx="12" cy="12" r="4" fill="white"/>
                </svg>
              </div>
              {/* Львів */}
              <div className="absolute" style={{ top: '35%', left: '15%' }}>
                <svg width="16" height="22" viewBox="0 0 24 32" className="drop-shadow-lg -translate-x-1/2 -translate-y-full">
                  <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20c0-6.6-5.4-12-12-12z" fill="#ef4444"/>
                  <circle cx="12" cy="12" r="4" fill="white"/>
                </svg>
              </div>
              {/* Хмельницький */}
              <div className="absolute" style={{ top: '36%', left: '28%' }}>
                <svg width="14" height="18" viewBox="0 0 24 32" className="drop-shadow-lg -translate-x-1/2 -translate-y-full">
                  <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20c0-6.6-5.4-12-12-12z" fill="#ef4444"/>
                  <circle cx="12" cy="12" r="4" fill="white"/>
                </svg>
              </div>
              {/* Одеса */}
              <div className="absolute" style={{ top: '72%', left: '40%' }}>
                <svg width="16" height="22" viewBox="0 0 24 32" className="drop-shadow-lg -translate-x-1/2 -translate-y-full">
                  <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20c0-6.6-5.4-12-12-12z" fill="#ef4444"/>
                  <circle cx="12" cy="12" r="4" fill="white"/>
                </svg>
              </div>
              {/* Дніпро */}
              <div className="absolute" style={{ top: '44%', left: '68%' }}>
                <svg width="16" height="22" viewBox="0 0 24 32" className="drop-shadow-lg -translate-x-1/2 -translate-y-full">
                  <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20c0-6.6-5.4-12-12-12z" fill="#ef4444"/>
                  <circle cx="12" cy="12" r="4" fill="white"/>
                </svg>
              </div>
              {/* Запоріжжя */}
              <div className="absolute" style={{ top: '52%', left: '72%' }}>
                <svg width="14" height="18" viewBox="0 0 24 32" className="drop-shadow-lg -translate-x-1/2 -translate-y-full">
                  <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20c0-6.6-5.4-12-12-12z" fill="#ef4444"/>
                  <circle cx="12" cy="12" r="4" fill="white"/>
                </svg>
              </div>
              {/* Вінниця */}
              <div className="absolute" style={{ top: '40%', left: '36%' }}>
                <svg width="14" height="18" viewBox="0 0 24 32" className="drop-shadow-lg -translate-x-1/2 -translate-y-full">
                  <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20c0-6.6-5.4-12-12-12z" fill="#ef4444"/>
                  <circle cx="12" cy="12" r="4" fill="white"/>
                </svg>
              </div>
              {/* Полтава */}
              <div className="absolute" style={{ top: '34%', left: '66%' }}>
                <svg width="14" height="18" viewBox="0 0 24 32" className="drop-shadow-lg -translate-x-1/2 -translate-y-full">
                  <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20c0-6.6-5.4-12-12-12z" fill="#ef4444"/>
                  <circle cx="12" cy="12" r="4" fill="white"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnerships Section */}
      <section className="py-16 bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-zinc-100 mb-1">Партнерства</h2>
            <p className="text-zinc-400">Колаборації та нетворкінг</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/establishments/category/partnerships/restaurant-collaborations">
              <Card className="group overflow-hidden hover:scale-[1.02] transition-transform duration-300 h-full">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800"
                    alt="Колаборації між закладами"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                </div>
                <CardContent className="p-5">
                  <h3 className="text-xl font-bold text-zinc-100 mb-2 group-hover:text-amber-400 transition-colors">
                    Колаборації між закладами
                  </h3>
                  <p className="text-zinc-400 mb-4">
                    Як знайти партнерів
                  </p>
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      8 хв
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      1500
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/establishments/category/partnerships/supplier-partnerships">
              <Card className="group overflow-hidden hover:scale-[1.02] transition-transform duration-300 h-full">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=800"
                    alt="Партнерство з постачальниками"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                </div>
                <CardContent className="p-5">
                  <h3 className="text-xl font-bold text-zinc-100 mb-2 group-hover:text-amber-400 transition-colors">
                    Партнерство з постачальниками
                  </h3>
                  <p className="text-zinc-400 mb-4">
                    Як будувати довгострокові відносини
                  </p>
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      7 хв
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      1300
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-zinc-100">
              {t.home.featuredEstablishments}
            </h2>
            <Link href="/establishments">
              <Button variant="ghost">
                {t.home.viewAll}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {establishments.map((establishment) => (
                <EstablishmentCard
                  key={establishment.id}
                  establishment={establishment}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-zinc-900/50 border-y border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-zinc-100">
              {t.home.featuredPosSystems}
            </h2>
            <Link href="/pos-systems">
              <Button variant="ghost">
                {t.home.viewAll}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {posSystems
                .filter((ps) => ps.category?.slug === "pos-systems" && ["poster-pos", "goovii"].includes(ps.slug))
                .sort((a, b) => {
                  const order = ["poster-pos", "goovii"];
                  return order.indexOf(a.slug) - order.indexOf(b.slug);
                })
                .map((posSystem) => (
                  <PosSystemCard key={posSystem.id} posSystem={posSystem} />
                ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-violet-600/20 via-purple-900/30 to-zinc-900 border border-violet-500/30 p-8 lg:p-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
            
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-sm font-medium mb-4">
                  <Sparkles className="h-4 w-4" />
                  AI-помічник
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-zinc-100 mb-4">
                  Запитай у Zaklad AI
                </h2>
                <p className="text-zinc-400 mb-6">
                  Розумний помічник допоможе обрати обладнання, порівняти POS-системи, 
                  знайти постачальників та відповість на питання про ресторанний бізнес.
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <button className="px-4 py-2 rounded-full bg-zinc-800/80 border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-700 hover:border-zinc-600 transition-all">
                    Яку POS обрати для кафе?
                  </button>
                  <button className="px-4 py-2 rounded-full bg-zinc-800/80 border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-700 hover:border-zinc-600 transition-all">
                    Порівняй Poster та iiko
                  </button>
                  <button className="px-4 py-2 rounded-full bg-zinc-800/80 border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-700 hover:border-zinc-600 transition-all">
                    Що потрібно для піцерії?
                  </button>
                </div>

                <Link href="/ai-helper">
                  <Button size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 border-0">
                    Відкрити AI-помічник
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <div className="relative">
                <div className="bg-zinc-900/80 backdrop-blur-sm rounded-2xl border border-zinc-700 p-6 shadow-2xl">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-700">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-100">Zaklad AI</p>
                      <p className="text-xs text-emerald-400">● Online</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-zinc-700 flex-shrink-0" />
                      <div className="bg-zinc-800 rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%]">
                        <p className="text-sm text-zinc-300">Хочу відкрити кав'ярню, що потрібно?</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 justify-end">
                      <div className="bg-gradient-to-br from-violet-600/20 to-purple-600/20 border border-violet-500/30 rounded-2xl rounded-tr-none px-4 py-3 max-w-[80%]">
                        <p className="text-sm text-zinc-200">
                          Для кав'ярні рекомендую: <span className="text-violet-300">Poster POS</span> для автоматизації, 
                          кавомашину від <span className="text-violet-300">Barservice</span>, та продукти від <span className="text-violet-300">METRO</span>. 
                          Показати детальніше?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
    </MainLayout>
  );
}
