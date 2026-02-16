"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Layers, 
  Truck, 
  Package, 
  UtensilsCrossed, 
  QrCode,
  ExternalLink,
  Star,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MainLayout } from "@/components/layout/MainLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { api, endpoints } from "@/lib/api";
import { useLanguageStore } from "@/store/language";

interface Aggregator {
  id: string;
  slug: string;
  name: string;
  shortDescription?: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  averageRating: number;
  reviewCount: number;
  isActive: boolean;
  category?: {
    slug: string;
    name: string;
  };
}

interface AggregatorBlock {
  title: string;
  description: string;
  icon: any;
  color: string;
  categorySlug: string;
  aggregators: Aggregator[];
}

export default function AggregatorsPage() {
  const [aggregators, setAggregators] = useState<Aggregator[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguageStore();

  useEffect(() => {
    async function fetchAggregators() {
      try {
        const data = await api.get<any>(`${endpoints.posSystems.list}?limit=100`, { lang });
        const filtered = (data.data || []).filter((s: any) =>
          s.category?.slug?.includes("aggregator")
        );
        setAggregators(filtered);
      } catch (error) {
        console.error("Failed to fetch aggregators:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAggregators();
  }, [lang]);

  // Group aggregators by category
  const blocks: AggregatorBlock[] = [
    {
      title: "Агрегатори доставки",
      description: "Платформи для підключення до сервісів доставки їжі",
      icon: Truck,
      color: "from-blue-500 to-cyan-500",
      categorySlug: "delivery",
      aggregators: aggregators.filter(a => a.category?.slug?.includes("delivery")),
    },
    {
      title: "Агрегатори постачальників",
      description: "Платформи для пошуку та порівняння постачальників",
      icon: UtensilsCrossed,
      color: "from-green-500 to-emerald-500",
      categorySlug: "suppliers",
      aggregators: aggregators.filter(a => a.category?.slug?.includes("suppliers")),
    },
    {
      title: "Агрегатори обладнання",
      description: "Платформи для пошуку та порівняння обладнання",
      icon: Package,
      color: "from-purple-500 to-violet-500",
      categorySlug: "equipment",
      aggregators: aggregators.filter(a => a.category?.slug?.includes("equipment")),
    },
    {
      title: "Агрегатори QR-меню",
      description: "Платформи для цифрових меню та замовлень",
      icon: QrCode,
      color: "from-amber-500 to-orange-500",
      categorySlug: "qr-menu",
      aggregators: aggregators.filter(a => a.category?.slug?.includes("qr-menu")),
    },
  ];

  // Filter out empty blocks
  const activeBlocks = blocks.filter(b => b.aggregators.length > 0);

  return (
    <MainLayout>
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10">
                <Layers className="h-8 w-8 text-amber-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-zinc-100">Агрегатори</h1>
                <p className="text-zinc-400">Платформи для порівняння та вибору сервісів</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-8 w-64" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((j) => (
                      <Skeleton key={j} className="h-48 rounded-2xl" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : activeBlocks.length === 0 ? (
            <div className="text-center py-16">
              <Layers className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-zinc-300 mb-2">
                Агрегаторів поки немає
              </h3>
              <p className="text-zinc-500">
                Скоро тут з'являться платформи для порівняння сервісів
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {activeBlocks.map((block) => {
                const Icon = block.icon;
                return (
                  <div key={block.categorySlug}>
                    {/* Block Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${block.color} bg-opacity-20`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-zinc-100">{block.title}</h2>
                        <p className="text-sm text-zinc-400">{block.description}</p>
                      </div>
                      <Badge variant="secondary" className="ml-auto">
                        {block.aggregators.length} платформ
                      </Badge>
                    </div>

                    {/* Aggregators Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {block.aggregators.map((aggregator) => (
                        <Link
                          key={aggregator.id}
                          href={`/pos-systems/${aggregator.slug}`}
                          className="group"
                        >
                          <Card className="h-full bg-zinc-900/50 border-zinc-800 hover:border-amber-500/50 transition-all duration-300 overflow-hidden">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  {aggregator.logoUrl ? (
                                    <img
                                      src={aggregator.logoUrl}
                                      alt={aggregator.name}
                                      className="h-12 w-12 rounded-xl object-cover"
                                    />
                                  ) : (
                                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${block.color} flex items-center justify-center`}>
                                      <span className="text-xl font-bold text-white">
                                        {aggregator.name.charAt(0)}
                                      </span>
                                    </div>
                                  )}
                                  <div>
                                    <h3 className="font-bold text-zinc-100 group-hover:text-amber-400 transition-colors">
                                      {aggregator.name}
                                    </h3>
                                    {aggregator.averageRating > 0 && (
                                      <div className="flex items-center gap-1 text-sm">
                                        <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                                        <span className="text-amber-400 font-medium">
                                          {aggregator.averageRating.toFixed(1)}
                                        </span>
                                        <span className="text-zinc-500">
                                          ({aggregator.reviewCount})
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {aggregator.website && (
                                  <a
                                    href={aggregator.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-zinc-500 hover:text-amber-400 transition-colors"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                )}
                              </div>

                              <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
                                {aggregator.shortDescription || aggregator.description || "Платформа для порівняння та вибору"}
                              </p>

                              <div className="flex items-center justify-between">
                                <Badge 
                                  variant="secondary" 
                                  className={aggregator.isActive ? "bg-emerald-500/10 text-emerald-400" : ""}
                                >
                                  {aggregator.isActive ? "Активний" : "Неактивний"}
                                </Badge>
                                <span className="text-amber-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                  Детальніше
                                  <ArrowRight className="h-4 w-4" />
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
