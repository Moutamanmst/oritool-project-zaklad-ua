"use client";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { formatPrice } from "@/lib/utils";
import type { PosSystem } from "@/types";

interface PosSystemCardProps {
  posSystem: PosSystem;
}

export function PosSystemCard({ posSystem }: PosSystemCardProps) {
  return (
    <Link href={`/pos-systems/${posSystem.slug}`}>
      <Card className="group overflow-hidden hover:scale-[1.02] transition-transform duration-300 h-full">
        <CardContent className="p-6 h-full flex flex-col">
          <div className="flex items-start gap-4 mb-4">
            <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
              {posSystem.logoUrl ? (
                <Image
                  src={posSystem.logoUrl}
                  alt={posSystem.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                  <span className="text-2xl font-black text-amber-500/50">
                    {posSystem.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-zinc-100 mb-1 group-hover:text-amber-400 transition-colors">
                {posSystem.name}
              </h3>
              <Rating
                value={posSystem.averageRating}
                size="sm"
                reviewCount={posSystem.reviewCount}
              />
            </div>
          </div>

          {posSystem.shortDescription && (
            <p className="text-sm text-zinc-400 mb-4 line-clamp-2 flex-grow">
              {posSystem.shortDescription}
            </p>
          )}

          {posSystem.features && posSystem.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {posSystem.features.slice(0, 4).map((feature) => (
                <Badge key={feature} variant="secondary" className="text-xs">
                  <Check className="h-3 w-3 mr-1" />
                  {feature}
                </Badge>
              ))}
              {posSystem.features.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{posSystem.features.length - 4}
                </Badge>
              )}
            </div>
          )}

          <div className="mt-auto pt-4 border-t border-zinc-800 flex items-center justify-between">
            <div className="text-sm">
              {posSystem.priceFrom ? (
                <span className="text-zinc-400">
                  від{" "}
                  <span className="text-lg font-bold text-amber-500">
                    {formatPrice(posSystem.priceFrom)}
                  </span>
                  <span className="text-zinc-500">/міс</span>
                </span>
              ) : (
                <span className="text-zinc-500">Ціна за запитом</span>
              )}
            </div>
            {posSystem.website && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(posSystem.website, "_blank");
                }}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

