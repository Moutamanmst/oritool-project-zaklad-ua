import { Metadata } from "next";
import { generateEstablishmentMetadata } from "@/lib/seo-pages";
import { generateLocalBusinessSchema, generateBreadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

async function getEstablishment(slug: string) {
  try {
    const res = await fetch(`${API_URL}/establishments/${slug}?lang=uk`, {
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
  const establishment = await getEstablishment(slug);
  
  if (!establishment) {
    return {
      title: "Заклад не знайдено | ZakladUA",
      description: "Запитуваний заклад не знайдено в каталозі.",
    };
  }
  
  return generateEstablishmentMetadata(establishment);
}

export default async function EstablishmentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const establishment = await getEstablishment(slug);
  
  const schemas = [];
  
  if (establishment) {
    schemas.push(generateLocalBusinessSchema({
      name: establishment.name,
      description: establishment.description || establishment.shortDescription,
      address: establishment.address,
      city: establishment.city,
      phone: establishment.phone,
      email: establishment.email,
      website: establishment.website,
      priceRange: establishment.priceRange,
      averageRating: establishment.averageRating,
      reviewCount: establishment.reviewCount,
      image: establishment.logoUrl,
      slug: establishment.slug,
    }));
    
    schemas.push(generateBreadcrumbSchema([
      { name: "Головна", url: "/" },
      { name: "Заклади", url: "/establishments" },
      { name: establishment.name, url: `/establishments/${slug}` },
    ]));
  }
  
  return (
    <>
      {schemas.length > 0 && <JsonLd data={schemas} />}
      {children}
    </>
  );
}
