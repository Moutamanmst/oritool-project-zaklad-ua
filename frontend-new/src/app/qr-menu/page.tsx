"use client";

import { useEffect, useState } from "react";
import { Search, BookOpen, QrCode } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { ServiceCard } from "@/components/features/ServiceCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useLanguageStore } from "@/store/language";
import { MainLayout } from "@/components/layout/MainLayout";
import type { PaginatedResponse } from "@/types";

export default function QrMenuPage() {
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

        const filteredServices = allItems.filter(
          (item: any) => item.category?.slug === "qr-menu"
        );

        const filteredAggregators = allItems.filter(
          (item: any) => item.category?.slug === "qr-menu-aggregators"
        );

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
  }, [search, lang]);

  return (
    <MainLayout>
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">QR-меню</h1>
          <p className="text-zinc-400">Рішення для цифрового меню — QR-меню системи та платформи для порівняння</p>
        </div>

        {/* Article Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-6 w-6 text-amber-500" />
            <h2 className="text-2xl font-bold text-zinc-100">Що таке QR-меню?</h2>
          </div>
          
          <Card className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto min-h-[250px]">
                <Image
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800"
                  alt="QR-меню в ресторані"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <QrCode className="h-8 w-8 text-amber-500" />
                  <span className="text-sm text-zinc-500">Цифрове меню</span>
                </div>
                
                <p className="text-zinc-300 leading-relaxed mb-4">
                  <strong className="text-amber-400">QR-меню</strong> — це цифрове меню закладу, доступне через QR-код. 
                  Гість сканує код смартфоном і бачить меню на своєму екрані — без завантаження додатків.
                </p>

                <h4 className="font-bold text-zinc-100 mb-2">Переваги QR-меню:</h4>
                <ul className="space-y-2 text-zinc-400 text-sm mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">✓</span>
                    <span>Безконтактне меню — гігієнічно та сучасно</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">✓</span>
                    <span>Легко оновлювати ціни та позиції</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">✓</span>
                    <span>Фото страв підвищують продажі на 30%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">✓</span>
                    <span>Економія на друці паперових меню</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">✓</span>
                    <span>Можливість замовлення прямо з телефону</span>
                  </li>
                </ul>

                <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                  <p className="text-sm text-zinc-400">
                    <strong className="text-amber-400">💡</strong> Для створення QR-меню не потрібні технічні знання. 
                    Сучасні платформи пропонують зручні конструктори — ви просто додаєте фото та описи страв.
                  </p>
                </div>
              </CardContent>
            </div>
          </Card>
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
                  <h2 className="text-2xl font-bold text-zinc-100">QR-меню системи</h2>
                  <span className="text-sm text-zinc-500">{services.length} сервісів</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {services.map((item) => (
                    <ServiceCard key={item.id} service={item} basePath="/qr-menu" />
                  ))}
                </div>
              </section>
            )}

            {aggregators.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-100">Агрегатори QR-меню</h2>
                    <p className="text-sm text-zinc-500 mt-1">Платформи для порівняння та вибору</p>
                  </div>
                  <span className="text-sm text-zinc-500">{aggregators.length} платформ</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {aggregators.map((item) => (
                    <ServiceCard key={item.id} service={item} basePath="/qr-menu" />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
    </MainLayout>
  );
}
