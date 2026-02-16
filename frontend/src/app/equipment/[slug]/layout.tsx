import { Metadata } from "next";
import { generateDynamicMetadata } from "@/lib/page-seo";
import { generateProductSchema, generateBreadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

async function getEquipment(slug: string) {
  try {
    const res = await fetch(`${API_URL}/pos-systems/${slug}?lang=uk`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const equipment = await getEquipment(slug);

  if (!equipment) {
    return {
      title: "Обладнання не знайдено | ZakladUA",
      description: "Перейдіть до каталогу обладнання для ресторанів та кафе.",
      robots: "noindex, nofollow",
    };
  }

  return generateDynamicMetadata("equipment", {
    name: equipment.name,
    description: equipment.description,
    shortDescription: equipment.shortDescription,
    slug: equipment.slug,
    logoUrl: equipment.logoUrl,
    coverUrl: equipment.coverUrl,
    category: equipment.category?.name,
    averageRating: equipment.averageRating,
    reviewCount: equipment.reviewCount,
    priceFrom: equipment.priceFrom,
  });
}

export default async function EquipmentDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const equipment = await getEquipment(slug);
  
  const schemas = [];
  
  if (equipment) {
    // Product schema
    schemas.push(generateProductSchema({
      name: equipment.name,
      description: equipment.shortDescription || equipment.description || "",
      image: equipment.logoUrl,
      priceFrom: equipment.priceFrom,
      priceTo: equipment.priceTo,
      averageRating: equipment.averageRating,
      reviewCount: equipment.reviewCount,
      slug: equipment.slug,
      category: equipment.category?.name || "Обладнання для ресторанів",
    }));
    
    // Breadcrumbs schema
    schemas.push(generateBreadcrumbSchema([
      { name: "Головна", url: "/" },
      { name: "Обладнання", url: "/equipment" },
      ...(equipment.category ? [{ name: equipment.category.name, url: `/equipment/category/${equipment.category.slug}` }] : []),
      { name: equipment.name, url: `/equipment/${slug}` },
    ]));
  }
  
  return (
    <>
      {schemas.length > 0 && <JsonLd data={schemas} />}
      {children}
    </>
  );
}
