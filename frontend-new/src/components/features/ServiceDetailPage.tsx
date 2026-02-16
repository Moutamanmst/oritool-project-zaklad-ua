"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { Skeleton } from "@/components/ui/skeleton";
import { api, endpoints } from "@/lib/api";
import { useLanguageStore } from "@/store/language";
import { formatPrice } from "@/lib/utils";
import type { Review, PaginatedResponse } from "@/types";

interface ServiceDetailPageProps {
  slug: string;
  backPath: string;
  backLabel: string;
}

export function ServiceDetailPage({
  slug,
  backPath,
  backLabel,
}: ServiceDetailPageProps) {
  const [service, setService] = useState<any | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguageStore();

  useEffect(() => {
    async function fetchData() {
      try {
        const [serviceData, reviewsData] = await Promise.all([
          api.get<any>(endpoints.posSystems.detail(slug), { lang }),
          api
            .get<PaginatedResponse<Review>>(
              endpoints.reviews.byPosSystem(slug) + "?limit=5",
              { lang }
            )
            .catch(() => ({ data: [] })),
        ]);

        setService(serviceData);
        setReviews(reviewsData.data || []);
      } catch (error) {
        console.error("Failed to fetch service:", error);
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
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-100 mb-4">
            Не знайдено
          </h1>
          <Link href={backPath}>
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backLabel}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href={backPath}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>

        {/* Cover Image */}
        {service.coverUrl && (
          <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden mb-8">
            <Image
              src={service.coverUrl}
              alt={service.name}
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
                    {service.logoUrl ? (
                      <Image
                        src={service.logoUrl}
                        alt={service.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                        <span className="text-4xl font-black text-amber-500/50">
                          {service.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-zinc-100 mb-2">
                          {service.name}
                        </h1>
                        {service.category?.slug?.includes("aggregator") ? (
                          <Badge variant="outline" className="text-blue-400 border-blue-400/50">
                            {service.category?.slug === "delivery-aggregators" && "Агрегатор доставки"}
                            {service.category?.slug === "suppliers-aggregators" && "Агрегатор постачальників"}
                            {service.category?.slug === "equipment-aggregators" && "Агрегатор обладнання"}
                            {service.category?.slug === "qr-menu-aggregators" && "Агрегатор QR-меню"}
                          </Badge>
                        ) : (
                          <Rating
                            value={service.averageRating}
                            size="md"
                            reviewCount={service.reviewCount}
                          />
                        )}
                      </div>
                      {service.website && (
                        <a
                          href={service.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button>
                            Перейти на сайт
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </Button>
                        </a>
                      )}
                    </div>

                    {service.shortDescription && (
                      <p className="text-lg text-zinc-300 mb-4">
                        {service.shortDescription}
                      </p>
                    )}

                    {service.category && (
                      <Badge variant="secondary">{service.category.name}</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {service.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-amber-500" />
                    Опис
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {service.features && service.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500" />
                    Функції та особливості
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {service.features.map((feature: string) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700"
                      >
                        <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-sm text-zinc-300 capitalize">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {service.integrations && service.integrations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link2 className="h-5 w-5 text-amber-500" />
                    Інтеграції
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {service.integrations.map((integration: string) => (
                      <Badge
                        key={integration}
                        variant="outline"
                        className="text-sm py-1.5 px-3"
                      >
                        {integration}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {reviews.length > 0 && !service.category?.slug?.includes("aggregator") && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500" />
                    Відгуки ({service.reviewCount})
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
                            {new Date(review.createdAt).toLocaleDateString(
                              "uk-UA"
                            )}
                          </p>
                        </div>
                      </div>
                      <p className="text-zinc-300">{review.content}</p>
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
                  {service.priceFrom ? (
                    <>
                      <p className="text-zinc-400 mb-1">від</p>
                      <p className="text-4xl font-bold text-amber-500">
                        {formatPrice(service.priceFrom)}
                      </p>
                      {service.pricingModel === "subscription" && (
                        <p className="text-zinc-500">на місяць</p>
                      )}
                      {service.priceTo &&
                        service.priceTo > service.priceFrom && (
                          <p className="text-sm text-zinc-500 mt-2">
                            до {formatPrice(service.priceTo)}
                          </p>
                        )}
                    </>
                  ) : (
                    <p className="text-xl text-zinc-400">
                      Безкоштовно / за запитом
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  {service.website && (
                    <a
                      href={service.website}
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
                  {!service.category?.slug?.includes("aggregator") && (
                  <Button variant="outline" className="w-full" size="lg">
                    Написати відгук
                  </Button>
                  )}
                </div>

                {!service.category?.slug?.includes("aggregator") && (
                <div className="pt-4 border-t border-zinc-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-zinc-400">Рейтинг</span>
                    <Rating value={service.averageRating} size="sm" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Відгуків</span>
                    <span className="text-sm text-zinc-300">
                      {service.reviewCount}
                    </span>
                  </div>
                </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

