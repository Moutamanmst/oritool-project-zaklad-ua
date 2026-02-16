"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Wrench, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  Clock,
  ArrowRight,
  Refrigerator,
  Flame,
  Wind,
  Coffee,
  UtensilsCrossed,
  Sparkles,
  Package,
  Users,
  Shield,
  CheckCircle2
} from "lucide-react";
import { ServiceCard } from "@/components/features/ServiceCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { api, endpoints } from "@/lib/api";
import { useLanguageStore } from "@/store/language";
import { MainLayout } from "@/components/layout/MainLayout";
import type { Service, PaginatedResponse } from "@/types";

const categories = [
  {
    slug: "maintenance",
    name: "Технічне обслуговування",
    description: "Ремонт та сервіс обладнання",
    icon: Wrench,
    color: "from-zinc-500 to-zinc-600",
  },
  {
    slug: "refrigeration",
    name: "Холодильне обладнання",
    description: "Холодильники, морозильники, вітрини",
    icon: Refrigerator,
    color: "from-blue-500 to-cyan-500",
  },
  {
    slug: "thermal",
    name: "Теплове обладнання",
    description: "Плити, печі, грилі, фритюрниці",
    icon: Flame,
    color: "from-orange-500 to-red-500",
  },
  {
    slug: "ventilation",
    name: "Вентиляція",
    description: "Витяжки, кондиціонери, вентиляційні системи",
    icon: Wind,
    color: "from-sky-500 to-blue-500",
  },
  {
    slug: "coffee",
    name: "Кавове обладнання",
    description: "Кавомашини, кавомолки, аксесуари",
    icon: Coffee,
    color: "from-amber-600 to-orange-600",
  },
  {
    slug: "kitchen",
    name: "Кухонне обладнання",
    description: "Міксери, слайсери, м'ясорубки",
    icon: UtensilsCrossed,
    color: "from-emerald-500 to-green-500",
  },
];

interface Technician {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  reviews: number;
  phone: string;
  email: string;
  location: string;
  available: boolean;
}

const defaultTechnicians: Technician[] = [
  {
    id: "1",
    name: "Олександр Петренко",
    specialty: "Холодильне обладнання",
    experience: "12 років досвіду",
    rating: 4.9,
    reviews: 156,
    phone: "+380 67 123 45 67",
    email: "o.petrenko@service.ua",
    location: "Київ",
    available: true,
  },
  {
    id: "2",
    name: "Віталій Коваленко",
    specialty: "Теплове обладнання",
    experience: "8 років досвіду",
    rating: 4.8,
    reviews: 98,
    phone: "+380 50 234 56 78",
    email: "v.kovalenko@service.ua",
    location: "Київ, Львів",
    available: true,
  },
  {
    id: "3",
    name: "Андрій Шевченко",
    specialty: "Кавове обладнання",
    experience: "10 років досвіду",
    rating: 5.0,
    reviews: 203,
    phone: "+380 63 345 67 89",
    email: "a.shevchenko@service.ua",
    location: "Київ, Одеса",
    available: true,
  },
];

interface PageContent {
  title: string;
  subtitle: string;
  description: string;
  categories: { id: string; title: string; description: string; icon: string }[];
  technicians?: Technician[];
}

const defaultContent: PageContent = {
  title: "Обладнання",
  subtitle: "Професійне обладнання",
  description: "Професійне обладнання та сервіс для ресторанів",
  categories: [],
  technicians: defaultTechnicians,
};

export default function EquipmentPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<PageContent>(defaultContent);
  const { lang } = useLanguageStore();

  useEffect(() => {
    // Load content from localStorage
    const savedContent = localStorage.getItem("zakladua-equipment");
    if (savedContent) {
      try {
        setContent({ ...defaultContent, ...JSON.parse(savedContent) });
      } catch (e) {
        console.error("Failed to parse equipment content:", e);
      }
    }

    async function fetchData() {
      setLoading(true);
      try {
        const servicesData = await api.get<PaginatedResponse<Service>>(
          `${endpoints.posSystems.list}?limit=50`,
          { lang }
        );

        const equipmentServices = servicesData.data.filter(
          (s) => s.category?.slug === "equipment"
        );

        setServices(equipmentServices);
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
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10">
                <Package className="h-8 w-8 text-emerald-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-zinc-100">{content.title}</h1>
                <p className="text-zinc-400">{content.description}</p>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-zinc-100 mb-6">Категорії обладнання</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Link
                    key={category.slug}
                    href={`/equipment/category/${category.slug}`}
                    className="group relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/50 transition-all duration-300 p-6"
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${category.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
                    
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${category.color} bg-opacity-20 mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-zinc-100 mb-2 group-hover:text-emerald-400 transition-colors">
                      {category.name}
                    </h3>
                    
                    <p className="text-sm text-zinc-400 mb-4">
                      {category.description}
                    </p>

                    <div className="flex items-center text-emerald-400 text-sm font-medium">
                      <span>Переглянути</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Technicians Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-zinc-100">Майстри та сервісні центри</h2>
                <p className="text-zinc-400 text-sm mt-1">Перевірені спеціалісти з ремонту обладнання</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Users className="h-4 w-4" />
                <span>{(content.technicians || []).length} майстрів</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(content.technicians || []).map((tech) => (
                <div
                  key={tech.id}
                  className="relative rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all p-6"
                >
                  {/* Availability badge */}
                  <div className={`absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    tech.available 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-zinc-700/50 text-zinc-500'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${tech.available ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
                    {tech.available ? 'Доступний' : 'Зайнятий'}
                  </div>

                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-emerald-400">
                        {tech.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-zinc-100 truncate">{tech.name}</h3>
                      <p className="text-sm text-amber-400">{tech.specialty}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{tech.experience}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold text-zinc-100">{tech.rating}</span>
                    </div>
                    <span className="text-sm text-zinc-500">({tech.reviews} відгуків)</span>
                  </div>

                  {/* Specialty */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 rounded-lg bg-zinc-800 text-xs text-zinc-400">
                      {tech.specialty}
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-zinc-800 text-xs text-zinc-400">
                      {tech.experience}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{tech.location}</span>
                  </div>

                  {/* Contact buttons */}
                  <div className="flex gap-2">
                    <a
                      href={`tel:${tech.phone.replace(/\s/g, '')}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      Зателефонувати
                    </a>
                    <a
                      href={`mailto:${tech.email}`}
                      className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment from DB */}
          {services.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-bold text-zinc-100 mb-6">Постачальники обладнання</h2>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-72 rounded-2xl" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      basePath="/equipment"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CTA Banner */}
          <div className="bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 border border-emerald-500/30 rounded-2xl p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="p-4 rounded-full bg-emerald-500/20">
                  <Shield className="h-10 w-10 text-emerald-500" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-zinc-100 mb-2">
                  Ви майстер з ремонту обладнання?
                </h3>
                <p className="text-zinc-400">
                  Додайте свій профіль на ZakladUA та отримуйте нових клієнтів
                </p>
              </div>
              <Link href="/register?type=business">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Стати партнером
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
