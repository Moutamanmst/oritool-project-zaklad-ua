"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PosSystemCard } from "@/components/features/PosSystemCard";
import { Skeleton } from "@/components/ui/skeleton";
import { api, endpoints } from "@/lib/api";
import { useLanguageStore, translations } from "@/store/language";
import type { PosSystem, PaginatedResponse } from "@/types";

const featureFilters = [
  { value: "inventory", label: "Склад" },
  { value: "analytics", label: "Аналітика" },
  { value: "crm", label: "CRM" },
  { value: "loyalty", label: "Лояльність" },
  { value: "delivery", label: "Доставка" },
  { value: "kitchen-display", label: "KDS" },
];

const sortOptions = [
  { value: "createdAt:desc", label: "Найновіші" },
  { value: "averageRating:desc", label: "За рейтингом" },
  { value: "reviewCount:desc", label: "Популярні" },
  { value: "priceFrom:asc", label: "За ціною ↑" },
  { value: "priceFrom:desc", label: "За ціною ↓" },
];


interface PageContent {
  title: string;
  subtitle: string;
  description: string;
}

const defaultContent: PageContent = {
  title: "POS-системи",
  subtitle: "Автоматизація ресторанів",
  description: "Порівнюйте та обирайте найкращі POS-системи для вашого бізнесу",
};

export default function PosSystemsPage() {
  const [posSystems, setPosSystems] = useState<PosSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("averageRating:desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [content, setContent] = useState<PageContent>(defaultContent);
  const { lang } = useLanguageStore();
  const t = translations[lang];

  useEffect(() => {
    // Load content from localStorage
    const savedContent = localStorage.getItem("zakladua-pos-systems");
    if (savedContent) {
      try {
        setContent({ ...defaultContent, ...JSON.parse(savedContent) });
      } catch (e) {
        console.error("Failed to parse pos-systems content:", e);
      }
    }

    async function fetchPosSystems() {
      setLoading(true);
      try {
        const [sortField, sortOrder] = sortBy.split(":");
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "50",
          sortBy: sortField,
          sortOrder: sortOrder,
        });

        if (search) params.append("search", search);
        if (selectedFeatures.length > 0) {
          params.append("features", selectedFeatures.join(","));
        }

        const data = await api.get<PaginatedResponse<PosSystem>>(
          `${endpoints.posSystems.list}?${params.toString()}`,
          { lang }
        );

        // Filter only actual POS systems (category slug = 'pos-systems' or no category)
        const filteredData = data.data.filter(
          (item: any) => !item.category || item.category?.slug === "pos-systems" || item.category?.slug === "pos"
        );

        setPosSystems(filteredData);
        setTotalPages(1);
      } catch (error) {
        console.error("Failed to fetch POS systems:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosSystems();
  }, [search, selectedFeatures, sortBy, page, lang]);

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
    setPage(1);
  };

  return (
    <MainLayout>
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">
            {content.title}
          </h1>
          <p className="text-zinc-400">
            {content.description}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
            <Input
              type="text"
              placeholder="Пошук POS-систем..."
              className="pl-12"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-11 px-4 rounded-lg border-2 border-zinc-700 bg-zinc-800/50 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-8">
          <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
          <span className="text-sm text-zinc-500 mr-2">Функції:</span>
          {featureFilters.map((feature) => (
            <Badge
              key={feature.value}
              variant={
                selectedFeatures.includes(feature.value)
                  ? "default"
                  : "secondary"
              }
              className="cursor-pointer transition-all hover:scale-105"
              onClick={() => toggleFeature(feature.value)}
            >
              {feature.label}
            </Badge>
          ))}
          {selectedFeatures.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFeatures([])}
            >
              Очистити
            </Button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        ) : posSystems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-zinc-400 mb-4">{t.common.noResults}</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setSelectedFeatures([]);
              }}
            >
              Очистити фільтри
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {posSystems.map((posSystem) => (
                <PosSystemCard key={posSystem.id} posSystem={posSystem} />
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

        {/* Article Section */}
        <div className="mt-16 pt-12 border-t border-zinc-800">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="h-6 w-6 text-amber-500" />
            <h2 className="text-2xl font-bold text-zinc-100">Що таке POS-система?</h2>
          </div>
          
          <Card>
            <CardContent className="p-6 md:p-8">
              <div className="prose prose-invert prose-amber max-w-none">
                <p className="text-lg text-zinc-300 leading-relaxed mb-6">
                  <strong className="text-amber-400">POS-система</strong> (Point of Sale — точка продажу) — це програмно-апаратний комплекс для автоматизації ресторанного бізнесу. Вона замінює касовий апарат, блокнот офіціанта та Excel-таблиці одним зручним рішенням.
                </p>

                <h3 className="text-xl font-bold text-amber-400 mb-4 mt-8">Основні функції POS-системи:</h3>
                <ul className="space-y-2 text-zinc-300 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span><strong>Прийом замовлень</strong> — швидке оформлення замовлень офіціантами на планшеті або терміналі</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span><strong>Друк на кухню</strong> — автоматична передача замовлення на кухонний принтер або KDS-екран</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span><strong>Оплата</strong> — готівка, картка, безконтакт, розділення рахунку</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span><strong>Складський облік</strong> — автоматичне списання інгредієнтів при продажу страви</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span><strong>Аналітика</strong> — звіти про продажі, популярні страви, виручку по годинах</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span><strong>CRM та лояльність</strong> — база клієнтів, бонусні програми, знижки</span>
                  </li>
                </ul>

                <h3 className="text-xl font-bold text-amber-400 mb-4 mt-8">Переваги використання POS-системи:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
                    <h4 className="font-bold text-zinc-100 mb-2">⚡ Швидкість обслуговування</h4>
                    <p className="text-sm text-zinc-400">Замовлення миттєво потрапляє на кухню. Офіціант не біжить з блокнотом — він вже приймає наступне замовлення.</p>
                  </div>
                  <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
                    <h4 className="font-bold text-zinc-100 mb-2">📊 Контроль бізнесу</h4>
                    <p className="text-sm text-zinc-400">Ви бачите все: скільки продали, який фудкост, хто з офіціантів працює краще. Дані в реальному часі.</p>
                  </div>
                  <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
                    <h4 className="font-bold text-zinc-100 mb-2">🔒 Захист від крадіжок</h4>
                    <p className="text-sm text-zinc-400">Кожна операція фіксується. Неможливо 'забути' пробити чек або списати продукти 'на себе'.</p>
                  </div>
                  <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
                    <h4 className="font-bold text-zinc-100 mb-2">📱 Сучасний досвід</h4>
                    <p className="text-sm text-zinc-400">Інтеграція з доставкою, QR-меню, онлайн-бронювання — все працює злагоджено.</p>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-amber-400 mb-4 mt-8">Як обрати POS-систему?</h3>
                <p className="text-zinc-300 leading-relaxed mb-4">
                  При виборі POS-системи зверніть увагу на:
                </p>
                <ol className="space-y-2 text-zinc-300 mb-6 list-decimal list-inside">
                  <li><strong>Функціональність</strong> — чи є все, що вам потрібно (склад, CRM, доставка)?</li>
                  <li><strong>Вартість</strong> — порахуйте TCO: ліцензія + обладнання + підтримка на 2-3 роки</li>
                  <li><strong>Підтримка</strong> — як швидко відповідають? Чи є підтримка 24/7?</li>
                  <li><strong>Інтеграції</strong> — ПРРО, платіжні термінали, Glovo/Bolt, бухгалтерія</li>
                  <li><strong>Відгуки</strong> — що кажуть інші ресторатори?</li>
                </ol>

                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-xl p-6 mt-8">
                  <p className="text-zinc-300">
                    <strong className="text-amber-400">💡 Порада:</strong> Більшість POS-систем надають безкоштовний тестовий період (7-14 днів). Обов'язково протестуйте 2-3 системи перед вибором. Залучіть персонал до тестування — їм працювати з цією системою щодня.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </MainLayout>
  );
}
