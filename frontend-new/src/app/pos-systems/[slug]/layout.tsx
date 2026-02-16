import { Metadata } from "next";
import { generateDynamicMetadata } from "@/lib/page-seo";
import { generateSoftwareSchema, generateBreadcrumbSchema, generateFAQSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

// Fetch POS system data for metadata generation
async function getPosSystem(slug: string) {
  try {
    const res = await fetch(`${API_URL}/pos-systems/${slug}?lang=uk`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch POS system for metadata:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const posSystem = await getPosSystem(slug);

  if (!posSystem) {
    return {
      title: "POS-система не знайдена | ZakladUA",
      description: "Перейдіть до каталогу POS-систем для вибору рішення для вашого закладу.",
      robots: "noindex, nofollow",
    };
  }

  return generateDynamicMetadata("pos-system", {
    name: posSystem.name,
    description: posSystem.description,
    shortDescription: posSystem.shortDescription,
    slug: posSystem.slug,
    logoUrl: posSystem.logoUrl,
    coverUrl: posSystem.coverUrl,
    category: posSystem.category?.name,
    averageRating: posSystem.averageRating,
    reviewCount: posSystem.reviewCount,
    priceFrom: posSystem.priceFrom,
  });
}

export default async function PosSystemLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posSystem = await getPosSystem(slug);
  
  const schemas = [];
  
  if (posSystem) {
    // Software/Product schema
    schemas.push(generateSoftwareSchema({
      name: posSystem.name,
      description: posSystem.shortDescription || posSystem.description || "",
      image: posSystem.logoUrl,
      priceFrom: posSystem.priceFrom,
      averageRating: posSystem.averageRating,
      reviewCount: posSystem.reviewCount,
      slug: posSystem.slug,
      category: "POS-система для ресторанів",
    }));
    
    // Breadcrumbs schema
    schemas.push(generateBreadcrumbSchema([
      { name: "Головна", url: "/" },
      { name: "POS-системи", url: "/pos-systems" },
      { name: posSystem.name, url: `/pos-systems/${slug}` },
    ]));
    
    // FAQ schema for popular POS systems
    if (["poster-pos", "iiko", "r-keeper", "syrve", "goovii"].includes(slug)) {
      const faqs = [
        {
          question: `Скільки коштує ${posSystem.name}?`,
          answer: posSystem.priceFrom 
            ? `${posSystem.name} коштує від ₴${posSystem.priceFrom} на місяць. Точна ціна залежить від кількості терміналів та обраного тарифу.`
            : `Зв'яжіться з ${posSystem.name} для отримання актуальних цін та індивідуальної пропозиції.`,
        },
        {
          question: `Чи є безкоштовний тестовий період у ${posSystem.name}?`,
          answer: `Більшість POS-систем, включаючи ${posSystem.name}, надають безкоштовний тестовий період від 7 до 14 днів для ознайомлення з функціоналом.`,
        },
        {
          question: `Які функції має ${posSystem.name}?`,
          answer: posSystem.features?.length 
            ? `${posSystem.name} включає: ${posSystem.features.slice(0, 5).join(", ")} та інші функції для автоматизації ресторану.`
            : `${posSystem.name} надає повний набір функцій для автоматизації ресторанного бізнесу: облік, аналітика, управління персоналом.`,
        },
      ];
      schemas.push(generateFAQSchema(faqs));
    }
  }
  
  return (
    <>
      {schemas.length > 0 && <JsonLd data={schemas} />}
      {children}
    </>
  );
}
