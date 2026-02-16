"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Filter, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EstablishmentCard } from "@/components/features/EstablishmentCard";
import { Skeleton } from "@/components/ui/skeleton";
import { api, endpoints } from "@/lib/api";
import { useLanguageStore, translations } from "@/store/language";
import type { Establishment, PaginatedResponse } from "@/types";
import { MainLayout } from "@/components/layout/MainLayout";

const businessTypes = [
  { value: "", label: "Всі" },
  { value: "RESTAURANT", label: "Ресторани" },
  { value: "CAFE", label: "Кафе" },
  { value: "FASTFOOD", label: "Фастфуд" },
  { value: "BAR", label: "Бари" },
  { value: "BAKERY", label: "Пекарні" },
  { value: "COFFEESHOP", label: "Кав'ярні" },
];

const priceRanges = [
  { value: "", label: "Всі ціни" },
  { value: "1", label: "$" },
  { value: "2", label: "$$" },
  { value: "3", label: "$$$" },
  { value: "4", label: "$$$$" },
];

const sortOptions = [
  { value: "averageRating:desc", label: "За рейтингом" },
  { value: "reviewCount:desc", label: "Популярні" },
  { value: "createdAt:desc", label: "Найновіші" },
  { value: "name:asc", label: "За назвою" },
];

const cities = [
  { value: "", label: "Всі міста" },
  { value: "Київ", label: "Київ" },
  { value: "Львів", label: "Львів" },
  { value: "Одеса", label: "Одеса" },
  { value: "Харків", label: "Харків" },
  { value: "Дніпро", label: "Дніпро" },
  { value: "Запоріжжя", label: "Запоріжжя" },
  { value: "Вінниця", label: "Вінниця" },
  { value: "Полтава", label: "Полтава" },
  { value: "Хмельницький", label: "Хмельницький" },
  { value: "Чернівці", label: "Чернівці" },
  { value: "Івано-Франківськ", label: "Івано-Франківськ" },
  { value: "Тернопіль", label: "Тернопіль" },
  { value: "Рівне", label: "Рівне" },
  { value: "Луцьк", label: "Луцьк" },
  { value: "Ужгород", label: "Ужгород" },
  { value: "Миколаїв", label: "Миколаїв" },
];

export default function EstablishmentsRatingPage() {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [city, setCity] = useState("");
  const [sortBy, setSortBy] = useState("averageRating:desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { lang } = useLanguageStore();
  const t = translations[lang];

  useEffect(() => {
    async function fetchEstablishments() {
      setLoading(true);
      try {
        const [sortField, sortOrder] = sortBy.split(":");
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "12",
          sortBy: sortField,
          sortOrder: sortOrder,
        });

        if (search) params.append("search", search);
        if (businessType) params.append("businessType", businessType);
        if (priceRange) {
          params.append("minPrice", priceRange);
          params.append("maxPrice", priceRange);
        }

        const data = await api.get<PaginatedResponse<Establishment>>(
          `${endpoints.establishments.list}?${params.toString()}`,
          { lang }
        );

        setEstablishments(data.data);
        setTotalPages(data.meta.totalPages);
      } catch (error) {
        console.error("Failed to fetch establishments:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEstablishments();
  }, [search, businessType, priceRange, sortBy, page, lang]);

  const clearFilters = () => {
    setSearch("");
    setBusinessType("");
    setPriceRange("");
    setCity("");
    setSortBy("averageRating:desc");
    setPage(1);
  };

  const hasActiveFilters = search || businessType || priceRange || city;

  return (
    <MainLayout>
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/establishments">
          <Button variant="ghost" className="mb-6 -ml-2 text-zinc-400 hover:text-zinc-100">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад до закладів
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">
            Рейтинг закладів
          </h1>
          <p className="text-zinc-400">
            Топ закладів за оцінками користувачів
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
            <Input
              type="text"
              placeholder="Пошук закладів..."
              className="pl-12"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <Button
            variant="outline"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="lg:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            Фільтри
          </Button>

          <div className="hidden lg:flex items-center gap-3">
            <select
              value={businessType}
              onChange={(e) => {
                setBusinessType(e.target.value);
                setPage(1);
              }}
              className="h-11 min-w-[140px] px-4 pr-10 rounded-lg border border-zinc-700 bg-zinc-800/50 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a1a1aa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
            >
              {businessTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            <select
              value={priceRange}
              onChange={(e) => {
                setPriceRange(e.target.value);
                setPage(1);
              }}
              className="h-11 min-w-[120px] px-4 pr-10 rounded-lg border border-zinc-700 bg-zinc-800/50 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a1a1aa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>

            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setPage(1);
              }}
              className="h-11 min-w-[160px] px-4 pr-10 rounded-lg border border-zinc-700 bg-zinc-800/50 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a1a1aa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
            >
              {cities.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-11 min-w-[160px] px-4 pr-10 rounded-lg border border-zinc-700 bg-zinc-800/50 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a1a1aa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filtersOpen && (
          <div className="lg:hidden flex flex-wrap gap-3 mb-6 p-4 bg-zinc-900 rounded-xl border border-zinc-800">
            <select
              value={businessType}
              onChange={(e) => {
                setBusinessType(e.target.value);
                setPage(1);
              }}
              className="flex-1 min-w-[140px] h-11 px-4 pr-10 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-zinc-100 appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a1a1aa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
            >
              {businessTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            <select
              value={priceRange}
              onChange={(e) => {
                setPriceRange(e.target.value);
                setPage(1);
              }}
              className="flex-1 min-w-[120px] h-11 px-4 pr-10 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-zinc-100 appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a1a1aa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>

            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setPage(1);
              }}
              className="flex-1 min-w-[140px] h-11 px-4 pr-10 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-zinc-100 appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a1a1aa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
            >
              {cities.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 min-w-[160px] h-11 px-4 pr-10 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-zinc-100 appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a1a1aa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-zinc-500">Активні фільтри:</span>
            {search && (
              <Badge variant="secondary" className="gap-1">
                Пошук: {search}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSearch("")}
                />
              </Badge>
            )}
            {businessType && (
              <Badge variant="secondary" className="gap-1">
                {businessTypes.find((t) => t.value === businessType)?.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setBusinessType("")}
                />
              </Badge>
            )}
            {priceRange && (
              <Badge variant="secondary" className="gap-1">
                {priceRanges.find((r) => r.value === priceRange)?.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setPriceRange("")}
                />
              </Badge>
            )}
            {city && (
              <Badge variant="secondary" className="gap-1">
                {city}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setCity("")}
                />
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Очистити все
            </Button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : establishments.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-zinc-400 mb-4">{t.common.noResults}</p>
            <Button variant="outline" onClick={clearFilters}>
              Очистити фільтри
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {establishments.map((establishment) => (
                <EstablishmentCard
                  key={establishment.id}
                  establishment={establishment}
                />
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
    </MainLayout>
  );
}

