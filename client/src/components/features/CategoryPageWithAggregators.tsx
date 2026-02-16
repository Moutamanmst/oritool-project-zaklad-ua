"use client";

import { useEffect, useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/features/ServiceCard";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useLanguageStore } from "@/store/language";
import type { PaginatedResponse } from "@/types";

interface CategoryPageWithAggregatorsProps {
  title: string;
  description: string;
  categorySlug: string;
  aggregatorsCategorySlug: string;
  basePath: string;
  servicesTitle: string;
  aggregatorsTitle: string;
}

export function CategoryPageWithAggregators({
  title,
  description,
  categorySlug,
  aggregatorsCategorySlug,
  basePath,
  servicesTitle,
  aggregatorsTitle,
}: CategoryPageWithAggregatorsProps) {
  const [services, setServices] = useState<any[]>([]);
  const [aggregators, setAggregators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { lang } = useLanguageStore();

  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      try {
        const data = await api.get<PaginatedResponse<any>>(
          `/pos-systems?limit=100&sortBy=averageRating&sortOrder=desc`,
          { lang }
        );

        const allItems = data.data;

        // Filter by main category
        const filteredServices = allItems.filter(
          (item: any) => item.category?.slug === categorySlug
        );

        // Filter by aggregators category
        const filteredAggregators = allItems.filter(
          (item: any) => item.category?.slug === aggregatorsCategorySlug
        );

        // Apply search filter
        if (search) {
          const searchLower = search.toLowerCase();
          setServices(
            filteredServices.filter(
              (item: any) =>
                item.name.toLowerCase().includes(searchLower) ||
                item.shortDescription?.toLowerCase().includes(searchLower)
            )
          );
          setAggregators(
            filteredAggregators.filter(
              (item: any) =>
                item.name.toLowerCase().includes(searchLower) ||
                item.shortDescription?.toLowerCase().includes(searchLower)
            )
          );
        } else {
          setServices(filteredServices);
          setAggregators(filteredAggregators);
        }
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, [search, lang, categorySlug, aggregatorsCategorySlug]);

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">{title}</h1>
          <p className="text-zinc-400">{description}</p>
        </div>

        <div className="flex gap-4 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
            <Input
              type="text"
              placeholder="Пошук..."
              className="pl-12"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-12">
            <div>
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-2xl" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-16">
            {services.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-zinc-100">
                    {servicesTitle}
                  </h2>
                  <span className="text-sm text-zinc-500">
                    {services.length} сервісів
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {services.map((item) => (
                    <ServiceCard
                      key={item.id}
                      service={item}
                      basePath={basePath}
                    />
                  ))}
                </div>
              </section>
            )}

            {aggregators.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-100">
                      {aggregatorsTitle}
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1">
                      Платформи для порівняння та вибору
                    </p>
                  </div>
                  <span className="text-sm text-zinc-500">
                    {aggregators.length} платформ
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {aggregators.map((item) => (
                    <ServiceCard
                      key={item.id}
                      service={item}
                      basePath={basePath}
                    />
                  ))}
                </div>
              </section>
            )}

            {services.length === 0 && aggregators.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-zinc-400 mb-4">Нічого не знайдено</p>
                <Button variant="outline" onClick={() => setSearch("")}>
                  Очистити пошук
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

