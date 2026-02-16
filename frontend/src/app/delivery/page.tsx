"use client";

import { useEffect, useState } from "react";
import { ServiceCard } from "@/components/features/ServiceCard";
import { Skeleton } from "@/components/ui/skeleton";
import { api, endpoints } from "@/lib/api";
import { useLanguageStore } from "@/store/language";
import { MainLayout } from "@/components/layout/MainLayout";
import type { Service, PaginatedResponse } from "@/types";

interface PageContent {
  title: string;
  subtitle: string;
  description: string;
}

const defaultContent: PageContent = {
  title: "Доставка їжі",
  subtitle: "Сервіси доставки",
  description: "Сервіси доставки для ресторанного бізнесу",
};

export default function DeliveryPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<PageContent>(defaultContent);
  const { lang } = useLanguageStore();

  useEffect(() => {
    // Load content from localStorage
    const savedContent = localStorage.getItem("zakladua-delivery");
    if (savedContent) {
      try {
        setContent({ ...defaultContent, ...JSON.parse(savedContent) });
      } catch (e) {
        console.error("Failed to parse delivery content:", e);
      }
    }

    async function fetchData() {
      setLoading(true);
      try {
        const servicesData = await api.get<PaginatedResponse<Service>>(
          `${endpoints.posSystems.list}?limit=50`,
          { lang }
        );

        const deliveryServices = servicesData.data.filter(
          (s) => s.category?.slug === "delivery"
        );

        setServices(deliveryServices);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [lang]);

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

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-2xl" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-zinc-400">Сервіси не знайдено</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  basePath="/delivery"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
