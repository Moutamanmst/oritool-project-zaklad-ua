"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import type { Establishment } from "@/types";

interface EstablishmentCardProps {
  establishment: Establishment;
}

const businessTypeLabels: Record<string, string> = {
  RESTAURANT: "Ресторан",
  CAFE: "Кафе",
  FASTFOOD: "Фастфуд",
  BAR: "Бар",
  BAKERY: "Пекарня",
  COFFEESHOP: "Кав'ярня",
  OTHER: "Інше",
};

// SEO: Price range labels for screen readers
const priceRangeLabels: Record<number, string> = {
  1: "бюджетний",
  2: "середній",
  3: "преміум",
  4: "люксовий",
};

export function EstablishmentCard({ establishment }: EstablishmentCardProps) {
  const businessType = businessTypeLabels[establishment.businessType] || establishment.businessType;
  const cityName = establishment.city?.name;
  
  // SEO-friendly image alt and title
  const imageAlt = `${establishment.name} - ${businessType.toLowerCase()}${cityName ? ` в місті ${cityName}` : ""}, інтер'єр та атмосфера закладу`;
  const imageTitle = `Переглянути ${establishment.name} - меню, відгуки, ціни`;
  
  // SEO-friendly link aria-label
  const linkAriaLabel = `${establishment.name} - ${businessType.toLowerCase()}${cityName ? ` в ${cityName}` : ""}, рейтинг ${establishment.averageRating.toFixed(1)}/5 (${establishment.reviewCount} відгуків), ціновий рівень ${priceRangeLabels[establishment.priceRange] || "середній"}`;

  return (
    <Link 
      href={`/establishments/${establishment.slug}`}
      aria-label={linkAriaLabel}
      title={imageTitle}
    >
      <article 
        className="group overflow-hidden hover:scale-[1.02] transition-transform duration-300"
        itemScope
        itemType="https://schema.org/Restaurant"
      >
        <Card className="h-full">
          <div className="relative h-48 overflow-hidden bg-zinc-800">
            {establishment.coverUrl || establishment.logoUrl ? (
              <Image
                src={establishment.coverUrl || establishment.logoUrl || ""}
                alt={imageAlt}
                title={imageTitle}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                itemProp="image"
              />
            ) : (
              <div 
                className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center"
                role="img"
                aria-label={`${establishment.name} - зображення відсутнє`}
              >
                <span className="text-6xl font-black text-amber-500/30" aria-hidden="true">
                  {establishment.name.charAt(0)}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" aria-hidden="true" />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge variant="default">
                <span itemProp="servesCuisine">{businessType}</span>
              </Badge>
            </div>
          </div>
          <CardContent className="p-5">
            <h3 
              className="text-lg font-bold text-zinc-100 mb-2 line-clamp-1 group-hover:text-amber-400 transition-colors"
              itemProp="name"
            >
              {establishment.name}
            </h3>

            <div 
              className="flex items-center gap-3 mb-3"
              itemProp="aggregateRating"
              itemScope
              itemType="https://schema.org/AggregateRating"
            >
              <meta itemProp="ratingValue" content={establishment.averageRating.toString()} />
              <meta itemProp="reviewCount" content={establishment.reviewCount.toString()} />
              <meta itemProp="bestRating" content="5" />
              <meta itemProp="worstRating" content="1" />
              <Rating
                value={establishment.averageRating}
                size="sm"
                reviewCount={establishment.reviewCount}
              />
            </div>

            {establishment.address && (
              <div 
                className="flex items-center gap-2 text-sm text-zinc-500 mb-2"
                itemProp="address"
                itemScope
                itemType="https://schema.org/PostalAddress"
              >
                <MapPin className="h-4 w-4 text-amber-500/70" aria-hidden="true" />
                <span className="line-clamp-1" itemProp="streetAddress">
                  {establishment.address}
                </span>
                {cityName && <meta itemProp="addressLocality" content={cityName} />}
                <meta itemProp="addressCountry" content="UA" />
              </div>
            )}

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800">
              <div 
                className="flex items-center gap-1"
                role="img"
                aria-label={`Ціновий рівень: ${priceRangeLabels[establishment.priceRange] || "середній"}`}
              >
                <meta itemProp="priceRange" content={"₴".repeat(establishment.priceRange)} />
                {Array.from({ length: 4 }).map((_, i) => (
                  <DollarSign
                    key={i}
                    className={`h-4 w-4 ${
                      i < establishment.priceRange
                        ? "text-amber-500"
                        : "text-zinc-700"
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              {cityName && (
                <span className="text-xs text-zinc-500">
                  {cityName}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </article>
    </Link>
  );
}

