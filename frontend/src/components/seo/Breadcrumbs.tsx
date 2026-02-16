"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/seo";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  /** Include Home link */
  includeHome?: boolean;
  /** Current page name (last item, no link) */
  currentPage?: string;
}

/**
 * SEO-optimized Breadcrumbs with schema.org markup
 */
export function Breadcrumbs({
  items,
  className,
  includeHome = true,
  currentPage,
}: BreadcrumbsProps) {
  const allItems = includeHome
    ? [{ label: "Головна", href: "/" }, ...items]
    : items;

  return (
    <nav
      aria-label="Хлібні крихти"
      className={cn("mb-6", className)}
    >
      <ol
        itemScope
        itemType="https://schema.org/BreadcrumbList"
        className="flex flex-wrap items-center gap-1 text-sm"
      >
        {allItems.map((item, index) => (
          <li
            key={item.href}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="flex items-center"
          >
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-zinc-600 mx-1" />
            )}
            
            {index === 0 && includeHome ? (
              <Link
                href={item.href}
                itemProp="item"
                className="text-zinc-400 hover:text-amber-400 transition-colors flex items-center gap-1"
              >
                <Home className="h-4 w-4" />
                <span itemProp="name" className="sr-only">{item.label}</span>
              </Link>
            ) : (
              <Link
                href={item.href}
                itemProp="item"
                className="text-zinc-400 hover:text-amber-400 transition-colors"
              >
                <span itemProp="name">{item.label}</span>
              </Link>
            )}
            
            <meta itemProp="position" content={(index + 1).toString()} />
          </li>
        ))}
        
        {currentPage && (
          <li
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="flex items-center"
          >
            <ChevronRight className="h-4 w-4 text-zinc-600 mx-1" />
            <span
              itemProp="name"
              className="text-zinc-200"
              aria-current="page"
            >
              {currentPage}
            </span>
            <meta itemProp="position" content={(allItems.length + 1).toString()} />
          </li>
        )}
      </ol>
    </nav>
  );
}

/**
 * Generate breadcrumb items for common page types
 */
export function generateBreadcrumbs(
  type: "pos-system" | "establishment" | "equipment" | "supplier" | "delivery" | "qr-menu" | "marketing" | "blog" | "category",
  context?: {
    name?: string;
    slug?: string;
    category?: {
      name: string;
      slug: string;
    };
  }
): BreadcrumbItem[] {
  const baseRoutes: Record<string, { label: string; href: string }> = {
    "pos-system": { label: "POS-системи", href: "/pos-systems" },
    "establishment": { label: "Заклади", href: "/establishments" },
    "equipment": { label: "Обладнання", href: "/equipment" },
    "supplier": { label: "Постачальники", href: "/suppliers" },
    "delivery": { label: "Доставка", href: "/delivery" },
    "qr-menu": { label: "QR-меню", href: "/qr-menu" },
    "marketing": { label: "Маркетинг", href: "/marketing" },
    "blog": { label: "Блог", href: "/blog" },
    "category": { label: "Категорії", href: "/categories" },
  };

  const items: BreadcrumbItem[] = [baseRoutes[type]];

  // Add category if present
  if (context?.category && type !== "category") {
    items.push({
      label: context.category.name,
      href: `${baseRoutes[type].href}/category/${context.category.slug}`,
    });
  }

  return items;
}

/**
 * Compact breadcrumbs for mobile
 */
export function CompactBreadcrumbs({ items, currentPage }: BreadcrumbsProps) {
  const lastItem = items[items.length - 1];
  
  return (
    <nav aria-label="Навігація" className="mb-4 md:hidden">
      <Link
        href={lastItem?.href || "/"}
        className="text-sm text-zinc-400 hover:text-amber-400 flex items-center gap-1"
      >
        <ChevronRight className="h-4 w-4 rotate-180" />
        <span>Назад до {lastItem?.label || "головної"}</span>
      </Link>
    </nav>
  );
}

/**
 * JSON-LD breadcrumb schema generator
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[], currentPage?: string) {
  const allItems = [
    { label: "Головна", href: "/" },
    ...items,
    ...(currentPage ? [{ label: currentPage, href: "#" }] : []),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href === "#" ? undefined : `${siteConfig.url}${item.href}`,
    })),
  };
}
