"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Globe,
  Clock,
  Star,
  DollarSign,
  Wifi,
  Car,
  Music,
  UtensilsCrossed,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { Skeleton } from "@/components/ui/skeleton";
import { api, endpoints } from "@/lib/api";
import { useLanguageStore, translations } from "@/store/language";
import type { Establishment, Review, PaginatedResponse } from "@/types";
import { MainLayout } from "@/components/layout/MainLayout";

const businessTypeLabels: Record<string, string> = {
  RESTAURANT: "Ресторан",
  CAFE: "Кафе",
  FASTFOOD: "Фастфуд",
  BAR: "Бар",
  BAKERY: "Пекарня",
  COFFEESHOP: "Кав'ярня",
  OTHER: "Інше",
};

const featureIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="h-4 w-4" />,
  parking: <Car className="h-4 w-4" />,
  "live-music": <Music className="h-4 w-4" />,
  terrace: <UtensilsCrossed className="h-4 w-4" />,
};

const featureLabels: Record<string, string> = {
  wifi: "Wi-Fi",
  parking: "Парковка",
  terrace: "Тераса",
  "live-music": "Жива музика",
  "private-events": "Приватні заходи",
  delivery: "Доставка",
  takeaway: "На виніс",
  breakfast: "Сніданки",
};

const dayLabels: Record<string, string> = {
  monday: "Понеділок",
  tuesday: "Вівторок",
  wednesday: "Середа",
  thursday: "Четвер",
  friday: "П'ятниця",
  saturday: "Субота",
  sunday: "Неділя",
};

export default function EstablishmentDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [establishment, setEstablishment] = useState<Establishment | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguageStore();
  const t = translations[lang];

  useEffect(() => {
    async function fetchData() {
      try {
        const [estData, reviewsData] = await Promise.all([
          api.get<Establishment>(endpoints.establishments.detail(slug), { lang }),
          api.get<PaginatedResponse<Review>>(
            endpoints.reviews.byEstablishment(slug) + "?limit=5",
            { lang }
          ).catch(() => ({ data: [] })),
        ]);

        setEstablishment(estData);
        setReviews(reviewsData.data || []);
      } catch (error) {
        console.error("Failed to fetch establishment:", error);
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
          <Skeleton className="h-80 rounded-2xl mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48 rounded-2xl" />
              <Skeleton className="h-48 rounded-2xl" />
            </div>
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!establishment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-100 mb-4">
            Заклад не знайдено
          </h1>
          <Link href="/establishments">
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
          href="/establishments"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад до каталогу
        </Link>

        <div className="relative h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden mb-8">
          {establishment.coverUrl ? (
            <Image
              src={establishment.coverUrl}
              alt={establishment.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-zinc-900 flex items-center justify-center">
              <span className="text-8xl font-black text-amber-500/20">
                {establishment.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge>
                    {businessTypeLabels[establishment.businessType] ||
                      establishment.businessType}
                  </Badge>
                  {establishment.city && (
                    <Badge variant="secondary">{establishment.city.name}</Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-2">
                  {establishment.name}
                </h1>
                <Rating
                  value={establishment.averageRating}
                  size="lg"
                  reviewCount={establishment.reviewCount}
                />
              </div>

              <div className="flex items-center gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <DollarSign
                    key={i}
                    className={`h-6 w-6 ${
                      i < establishment.priceRange
                        ? "text-amber-500"
                        : "text-zinc-700"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {establishment.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Про заклад</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
                    {establishment.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {establishment.features && establishment.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t.establishment.features}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {establishment.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700"
                      >
                        <div className="text-amber-500">
                          {featureIcons[feature] || (
                            <Check className="h-4 w-4" />
                          )}
                        </div>
                        <span className="text-sm text-zinc-300">
                          {featureLabels[feature] || feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {establishment.workingHours && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-500" />
                    {t.establishment.workingHours}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(establishment.workingHours).map(
                      ([day, hours]) => (
                        <div
                          key={day}
                          className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0"
                        >
                          <span className="text-zinc-400">
                            {dayLabels[day] || day}
                          </span>
                          <span className="text-zinc-200 font-medium">
                            {hours.open} - {hours.close}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500" />
                    Відгуки ({establishment.reviewCount})
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
                <CardTitle>Контакти</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {establishment.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-zinc-400">
                        {t.establishment.address}
                      </p>
                      <p className="text-zinc-200">{establishment.address}</p>
                    </div>
                  </div>
                )}

                {establishment.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-zinc-400">
                        {t.establishment.phone}
                      </p>
                      <a
                        href={`tel:${establishment.phone}`}
                        className="text-zinc-200 hover:text-amber-500 transition-colors"
                      >
                        {establishment.phone}
                      </a>
                    </div>
                  </div>
                )}

                {establishment.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-zinc-400">
                        {t.establishment.website}
                      </p>
                      <a
                        href={establishment.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-500 hover:underline"
                      >
                        {establishment.website.replace(/https?:\/\//, "")}
                      </a>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-zinc-800 space-y-3">
                  <Button className="w-full" size="lg">
                    {t.establishment.writeReview}
                  </Button>
                  {establishment.phone && (
                    <a href={`tel:${establishment.phone}`}>
                      <Button variant="outline" className="w-full" size="lg">
                        <Phone className="h-4 w-4 mr-2" />
                        Зателефонувати
                      </Button>
                    </a>
                  )}
                </div>

                <div className="pt-4 border-t border-zinc-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-zinc-400">Рейтинг</span>
                    <Rating value={establishment.averageRating} size="sm" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Відгуків</span>
                    <span className="text-sm text-zinc-300">
                      {establishment.reviewCount}
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

