"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/features/ServiceCard";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useLanguageStore } from "@/store/language";
import type { PaginatedResponse } from "@/types";

interface CatalogPageProps {
  title: string;
  description: string;
  categorySlug: string;
  basePath: string;
}

export function CatalogPage({
  title,
  description,
  categorySlug,
  basePath,
}: CatalogPageProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { lang } = useLanguageStore();

  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "12",
          sortBy: "averageRating",
          sortOrder: "desc",
        });

        if (search) params.append("search", search);

        // Fetch all items and filter by category on client side
        // since we're using the same PosSystem model for all services
        const data = await api.get<PaginatedResponse<any>>(
          `/pos-systems?${params.toString()}`,
          { lang }
        );

        // Filter by category
        const filtered = data.data.filter(
          (item: any) => item.category?.slug === categorySlug
        );

        setItems(filtered);
        setTotalPages(Math.ceil(filtered.length / 12) || 1);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, [search, page, lang, categorySlug]);

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">{title}</h1>
          <p className="text-zinc-400">{description}</p>
        </div>

        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
            <Input
              type="text"
              placeholder="Пошук..."
              className="pl-12"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-zinc-400 mb-4">Нічого не знайдено</p>
            <Button variant="outline" onClick={() => setSearch("")}>
              Очистити пошук
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <ServiceCard key={item.id} service={item} basePath={basePath} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Попередня
                </Button>
                <span className="px-4 text-sm text-zinc-400">
                  {page} з {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Наступна
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

