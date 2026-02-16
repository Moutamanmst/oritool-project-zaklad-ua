import { Metadata } from "next";
import { generateDynamicMetadata } from "@/lib/page-seo";
import { generateLocalBusinessSchema, generateBreadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

async function getSupplier(slug: string) {
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
  const supplier = await getSupplier(slug);

  if (!supplier) {
    return {
      title: "Постачальника не знайдено | ZakladUA",
      description: "Перейдіть до каталогу постачальників продуктів для HoReCa.",
      robots: "noindex, nofollow",
    };
  }

  return generateDynamicMetadata("supplier", {
    name: supplier.name,
    description: supplier.description,
    shortDescription: supplier.shortDescription,
    slug: supplier.slug,
    logoUrl: supplier.logoUrl,
    coverUrl: supplier.coverUrl,
    category: supplier.category?.name,
    city: supplier.city?.name,
    averageRating: supplier.averageRating,
    reviewCount: supplier.reviewCount,
  });
}

export default async function SupplierDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supplier = await getSupplier(slug);
  
  const schemas = [];
  
  if (supplier) {
    // LocalBusiness schema for supplier
    schemas.push({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: supplier.name,
      description: supplier.shortDescription || supplier.description,
      url: `https://zaklad.ua/suppliers/${supplier.slug}`,
      image: supplier.logoUrl,
      address: supplier.address ? {
        "@type": "PostalAddress",
        streetAddress: supplier.address,
        addressLocality: supplier.city?.name,
        addressCountry: "UA",
      } : undefined,
      telephone: supplier.phone,
      email: supplier.email,
      ...(supplier.averageRating && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: supplier.averageRating,
          reviewCount: supplier.reviewCount || 0,
          bestRating: 5,
          worstRating: 1,
        },
      }),
    });
    
    // Breadcrumbs schema
    schemas.push(generateBreadcrumbSchema([
      { name: "Головна", url: "/" },
      { name: "Постачальники", url: "/suppliers" },
      ...(supplier.category ? [{ name: supplier.category.name, url: `/suppliers/category/${supplier.category.slug}` }] : []),
      { name: supplier.name, url: `/suppliers/${slug}` },
    ]));
  }
  
  return (
    <>
      {schemas.length > 0 && <JsonLd data={schemas} />}
      {children}
    </>
  );
}
