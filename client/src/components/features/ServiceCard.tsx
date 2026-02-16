"use client";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { formatPrice } from "@/lib/utils";

interface ServiceCardProps {
  service: {
    id: string;
    slug: string;
    name: string;
    shortDescription?: string;
    logoUrl?: string;
    website?: string;
    priceFrom?: number;
    priceTo?: number;
    features?: string[];
    averageRating: number;
    reviewCount: number;
    category?: { slug: string; name?: string };
  };
  basePath: string;
}

const aggregatorLabels: Record<string, string> = {
  "delivery-aggregators": "Агрегатор доставки",
  "suppliers-aggregators": "Агрегатор постачальників",
  "equipment-aggregators": "Агрегатор обладнання",
  "qr-menu-aggregators": "Агрегатор QR-меню",
};

// SEO type mapping for image alt generation
const basePathToSeoType: Record<string, string> = {
  "/pos-systems": "POS-система",
  "/equipment": "обладнання для ресторанів",
  "/delivery": "сервіс доставки",
  "/qr-menu": "QR-меню сервіс",
  "/suppliers": "постачальник",
  "/marketing": "маркетинговий інструмент",
};

export function ServiceCard({ service, basePath }: ServiceCardProps) {
  const isAggregator = service.category?.slug?.includes("aggregator");
  const aggregatorLabel = service.category?.slug ? aggregatorLabels[service.category.slug] : null;
  
  // Generate SEO-friendly alt and title for images
  const seoType = basePathToSeoType[basePath] || "сервіс";
  const imageAlt = `Логотип ${service.name} - ${seoType} для HoReCa`;
  const imageTitle = `Переглянути ${service.name} - детальна інформація та відгуки`;
  
  // SEO-friendly link aria-label
  const linkAriaLabel = `Переглянути ${service.name} - ${seoType}, ${
    service.priceFrom ? `від ${formatPrice(service.priceFrom)}/міс` : "безкоштовно"
  }, рейтинг ${service.averageRating.toFixed(1)}/5`;

  return (
    <Link 
      href={`${basePath}/${service.slug}`}
      aria-label={linkAriaLabel}
      title={imageTitle}
    >
      <article 
        className="group overflow-hidden hover:scale-[1.02] transition-transform duration-300 h-full"
        itemScope
        itemType="https://schema.org/Product"
      >
        <Card className="h-full">
          <CardContent className="p-6 h-full flex flex-col">
            <div className="flex items-start gap-4 mb-4">
              <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                {service.logoUrl ? (
                  <Image
                    src={service.logoUrl}
                    alt={imageAlt}
                    title={imageTitle}
                    fill
                    className="object-cover"
                    itemProp="image"
                  />
                ) : (
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center"
                    role="img"
                    aria-label={`${service.name} - логотип відсутній`}
                  >
                    <span className="text-xl font-black text-amber-500/50" aria-hidden="true">
                      {service.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 
                  className="text-lg font-bold text-zinc-100 mb-1 group-hover:text-amber-400 transition-colors line-clamp-1"
                  itemProp="name"
                >
                  {service.name}
                </h3>
                {isAggregator && aggregatorLabel ? (
                  <Badge variant="outline" className="text-xs text-blue-400 border-blue-400/50">
                    {aggregatorLabel}
                  </Badge>
                ) : (
                  <div itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                    <meta itemProp="ratingValue" content={service.averageRating.toString()} />
                    <meta itemProp="reviewCount" content={service.reviewCount.toString()} />
                    <meta itemProp="bestRating" content="5" />
                    <Rating
                      value={service.averageRating}
                      size="sm"
                      reviewCount={service.reviewCount}
                    />
                  </div>
                )}
              </div>
            </div>

            {service.shortDescription && (
              <p 
                className="text-sm text-zinc-400 mb-4 line-clamp-2 flex-grow"
                itemProp="description"
              >
                {service.shortDescription}
              </p>
            )}

            {service.features && service.features.length > 0 && (
              <ul className="flex flex-wrap gap-1.5 mb-4" aria-label="Ключові функції">
                {service.features.slice(0, 3).map((feature) => (
                  <li key={feature}>
                    <Badge variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  </li>
                ))}
                {service.features.length > 3 && (
                  <li>
                    <Badge variant="outline" className="text-xs">
                      +{service.features.length - 3} функцій
                    </Badge>
                  </li>
                )}
              </ul>
            )}

            <div className="mt-auto pt-4 border-t border-zinc-800 flex items-center justify-between">
              <div className="text-sm" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                <meta itemProp="priceCurrency" content="UAH" />
                {service.priceFrom ? (
                  <span className="text-zinc-400">
                    від{" "}
                    <span className="text-lg font-bold text-amber-500" itemProp="price">
                      {formatPrice(service.priceFrom)}
                    </span>
                    <span className="sr-only"> гривень на місяць</span>
                  </span>
                ) : (
                  <>
                    <span className="text-zinc-500">Безкоштовно</span>
                    <meta itemProp="price" content="0" />
                  </>
                )}
              </div>
              {service.website && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(service.website, "_blank", "noopener,noreferrer");
                  }}
                  aria-label={`Відкрити офіційний сайт ${service.name} у новій вкладці`}
                  title={`Перейти на сайт ${service.name}`}
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Відкрити сайт</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </article>
    </Link>
  );
}

