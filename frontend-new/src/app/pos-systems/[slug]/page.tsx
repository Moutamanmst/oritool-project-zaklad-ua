"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ExternalLink,
  Check,
  Star,
  MessageSquare,
  Zap,
  Link2,
  DollarSign,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { Skeleton } from "@/components/ui/skeleton";
import { api, endpoints } from "@/lib/api";
import { useLanguageStore, translations } from "@/store/language";
import { formatPrice } from "@/lib/utils";
import type { PosSystem, Review, PaginatedResponse } from "@/types";
import { MainLayout } from "@/components/layout/MainLayout";
import { SocialShare } from "@/components/sharing/SocialShare";
import { QRCodeGenerator } from "@/components/sharing/QRCodeGenerator";

export default function PosSystemDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [posSystem, setPosSystem] = useState<PosSystem | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguageStore();
  const t = translations[lang];

  useEffect(() => {
    async function fetchData() {
      try {
        const [posData, reviewsData] = await Promise.all([
          api.get<PosSystem>(endpoints.posSystems.detail(slug), { lang }),
          api.get<PaginatedResponse<Review>>(
            endpoints.reviews.byPosSystem(slug) + "?limit=5",
            { lang }
          ).catch(() => ({ data: [] })),
        ]);

        setPosSystem(posData);
        setReviews(reviewsData.data || []);
      } catch (error) {
        console.error("Failed to fetch POS system:", error);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchData();
    }
  }, [slug, lang]);

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 rounded-2xl" />
              <Skeleton className="h-48 rounded-2xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-80 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!posSystem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-100 mb-4">
            POS-систему не знайдено
          </h1>
          <Link href="/pos-systems">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Повернутися до каталогу
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
          href="/pos-systems"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад до каталогу
        </Link>

        {/* Cover Image */}
        {posSystem.coverUrl && (
          <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden mb-8">
            <Image
              src={posSystem.coverUrl}
              alt={posSystem.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-2xl overflow-hidden bg-zinc-800 flex-shrink-0">
                    {posSystem.logoUrl ? (
                      <Image
                        src={posSystem.logoUrl}
                        alt={posSystem.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                        <span className="text-4xl font-black text-amber-500/50">
                          {posSystem.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-zinc-100 mb-2">
                          {posSystem.name}
                        </h1>
                        <Rating
                          value={posSystem.averageRating}
                          size="md"
                          reviewCount={posSystem.reviewCount}
                        />
                      </div>
                      {posSystem.website && (
                        <a
                          href={posSystem.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button>
                            Перейти на сайт
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </Button>
                        </a>
                      )}
                      <div className="flex items-center gap-2">
                        <SocialShare
                          title={posSystem.name}
                          description={posSystem.shortDescription || ""}
                          variant="minimal"
                        />
                        <QRCodeGenerator
                          title={posSystem.name}
                          variant="icon"
                        />
                      </div>
                    </div>

                    {posSystem.shortDescription && (
                      <p className="text-lg text-zinc-300 mb-4">
                        {posSystem.shortDescription}
                      </p>
                    )}

                    {posSystem.category && (
                      <Badge variant="secondary">
                        {posSystem.category.name}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {posSystem.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-amber-500" />
                    Опис
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
                    {posSystem.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {posSystem.features && posSystem.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500" />
                    Функції
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {posSystem.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700"
                      >
                        <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-sm text-zinc-300 capitalize">
                          {featureLabels[feature] || feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {posSystem.integrations && posSystem.integrations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link2 className="h-5 w-5 text-amber-500" />
                    Інтеграції
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {posSystem.integrations.map((integration) => (
                      <Badge key={integration} variant="outline" className="text-sm py-1.5 px-3">
                        {integration}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500" />
                    Відгуки ({posSystem.reviewCount})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-zinc-900 font-bold">
                          {review.user.profile?.firstName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-200">
                            {review.user.profile?.firstName}{" "}
                            {review.user.profile?.lastName}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {new Date(review.createdAt).toLocaleDateString("uk-UA")}
                          </p>
                        </div>
                      </div>
                      <p className="text-zinc-300">{review.content}</p>
                      {review.pros && (
                        <p className="mt-2 text-sm text-emerald-400">
                          ✓ {review.pros}
                        </p>
                      )}
                      {review.cons && (
                        <p className="mt-1 text-sm text-red-400">
                          ✗ {review.cons}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-amber-500" />
                  Вартість
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20">
                  {posSystem.priceFrom ? (
                    <>
                      <p className="text-zinc-400 mb-1">від</p>
                      <p className="text-4xl font-bold text-amber-500">
                        {formatPrice(posSystem.priceFrom)}
                      </p>
                      <p className="text-zinc-500">на місяць</p>
                      {posSystem.priceTo && posSystem.priceTo > posSystem.priceFrom && (
                        <p className="text-sm text-zinc-500 mt-2">
                          до {formatPrice(posSystem.priceTo)}/міс
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-xl text-zinc-400">Ціна за запитом</p>
                  )}
                </div>

                {posSystem.pricingModel && (
                  <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                    <span className="text-zinc-400">Модель оплати</span>
                    <Badge variant="secondary">
                      {pricingModelLabels[posSystem.pricingModel] || posSystem.pricingModel}
                    </Badge>
                  </div>
                )}

                <div className="space-y-3">
                  {posSystem.website && (
                    <a
                      href={posSystem.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full" size="lg">
                        Перейти на сайт
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </a>
                  )}
                  <Button variant="outline" className="w-full" size="lg">
                    Написати відгук
                  </Button>
                </div>

                <div className="pt-4 border-t border-zinc-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-zinc-400">Рейтинг</span>
                    <Rating value={posSystem.averageRating} size="sm" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Відгуків</span>
                    <span className="text-sm text-zinc-300">
                      {posSystem.reviewCount}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </MainLayout>
  );
}

const featureLabels: Record<string, string> = {
  inventory: "Склад",
  analytics: "Аналітика",
  crm: "CRM",
  "kitchen-display": "KDS (кухня)",
  loyalty: "Лояльність",
  reports: "Звіти",
  "qr-menu": "QR-меню",
  delivery: "Доставка",
  "multi-location": "Мульти-локації",
  franchise: "Франшиза",
  enterprise: "Enterprise",
  "self-order": "Самозамовлення",
  payment: "Оплата",
};

const pricingModelLabels: Record<string, string> = {
  subscription: "Підписка",
  "one-time": "Одноразова оплата",
  free: "Безкоштовно",
};

