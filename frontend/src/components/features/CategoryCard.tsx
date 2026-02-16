"use client";

import Link from "next/link";
import {
  Utensils,
  Monitor,
  Truck,
  Package,
  Bike,
  QrCode,
  Globe,
  Store,
  ChefHat,
  Megaphone,
  LucideIcon,
} from "lucide-react";
import type { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
}

const iconMap: Record<string, LucideIcon> = {
  utensils: Utensils,
  store: Store,
  monitor: Monitor,
  "cash-register": Monitor,
  "chef-hat": ChefHat,
  tools: Package,
  truck: Truck,
  bike: Bike,
  motorcycle: Bike,
  "qr-code": QrCode,
  qrcode: QrCode,
  megaphone: Megaphone,
  globe: Globe,
};

const categoryLinks: Record<string, string> = {
  establishments: "/establishments",
  restaurants: "/establishments",
  "pos-systems": "/pos-systems",
  equipment: "/equipment",
  suppliers: "/suppliers",
  delivery: "/delivery",
  "qr-menu": "/qr-menu",
  marketing: "/marketing",
};

const hiddenCategories = ["aggregators"];

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = iconMap[category.icon || ""] || Utensils;
  const href = categoryLinks[category.slug] || `/categories/${category.slug}`;

  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-800/50 transition-all duration-300"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 group-hover:from-amber-500/30 group-hover:to-orange-500/20 transition-colors">
        <Icon className="h-7 w-7 text-amber-500" />
      </div>
      <span className="text-sm font-medium text-zinc-300 group-hover:text-zinc-100 transition-colors text-center">
        {category.name}
      </span>
    </Link>
  );
}

