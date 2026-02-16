import { Metadata } from "next";
import { generateDynamicMetadata } from "@/lib/page-seo";
import { generateServiceSchema, generateBreadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

async function getDeliveryService(slug: string) {
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
  const service = await getDeliveryService(slug);

  if (!service) {
    return {
      title: "Сервіс доставки не знайдено | ZakladUA",
      description: "Перейдіть до каталогу сервісів доставки їжі для ресторанів.",
      robots: "noindex, nofollow",
    };
  }

  return generateDynamicMetadata("delivery", {
    name: service.name,
    description: service.description,
    shortDescription: service.shortDescription,
    slug: service.slug,
    logoUrl: service.logoUrl,
    coverUrl: service.coverUrl,
    category: service.category?.name,
    averageRating: service.averageRating,
    reviewCount: service.reviewCount,
  });
}

export default async function DeliveryDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getDeliveryService(slug);
  
  const schemas = [];
  
  if (service) {
    // Service schema
    schemas.push(generateServiceSchema({
      name: service.name,
      description: service.shortDescription || service.description || `${service.name} - сервіс доставки їжі для ресторанів`,
      slug: service.slug,
      basePath: "/delivery",
      provider: service.name,
      areaServed: "Україна",
    }));
    
    // Breadcrumbs schema
    schemas.push(generateBreadcrumbSchema([
      { name: "Головна", url: "/" },
      { name: "Доставка", url: "/delivery" },
      { name: service.name, url: `/delivery/${slug}` },
    ]));
  }
  
  return (
    <>
      {schemas.length > 0 && <JsonLd data={schemas} />}
      {children}
    </>
  );
}
