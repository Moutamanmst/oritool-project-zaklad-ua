import { Metadata } from "next";
import { generateDynamicMetadata } from "@/lib/page-seo";
import { generateSoftwareSchema, generateBreadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

async function getQrMenuService(slug: string) {
  try {
    const res = await fetch(`${API_URL}/pos-systems/${slug}?lang=uk`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getQrMenuService(slug);

  if (!service) {
    return {
      title: "QR-меню сервіс не знайдено | ZakladUA",
      description: "Перейдіть до каталогу QR-меню сервісів для ресторанів.",
      robots: "noindex, nofollow",
    };
  }

  return generateDynamicMetadata("qr-menu", {
    name: service.name,
    description: service.description,
    shortDescription: service.shortDescription,
    slug: service.slug,
    logoUrl: service.logoUrl,
    coverUrl: service.coverUrl,
    category: service.category?.name,
    averageRating: service.averageRating,
    reviewCount: service.reviewCount,
    priceFrom: service.priceFrom,
  });
}

export default async function QrMenuDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getQrMenuService(slug);
  
  const schemas = [];
  
  if (service) {
    // Software schema for QR menu service
    schemas.push(generateSoftwareSchema({
      name: service.name,
      description: service.shortDescription || service.description || `${service.name} - QR-меню для ресторанів`,
      image: service.logoUrl,
      priceFrom: service.priceFrom,
      averageRating: service.averageRating,
      reviewCount: service.reviewCount,
      slug: service.slug,
      category: "QR-меню та електронне меню",
    }));
    
    // Breadcrumbs schema
    schemas.push(generateBreadcrumbSchema([
      { name: "Головна", url: "/" },
      { name: "QR-меню", url: "/qr-menu" },
      { name: service.name, url: `/qr-menu/${slug}` },
    ]));
  }
  
  return (
    <>
      {schemas.length > 0 && <JsonLd data={schemas} />}
      {children}
    </>
  );
}
