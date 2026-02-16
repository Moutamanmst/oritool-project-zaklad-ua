import { Metadata } from "next";
import { generateCategoryMetadata } from "@/lib/page-seo";
import { generateBreadcrumbSchema, siteConfig } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

// Static category data for SEO
const categoryData: Record<string, { name: string; description: string }> = {
  "business-tips": {
    name: "Бізнес-поради",
    description: "Практичні рішення для власників закладів: управління, сервіс, антикризовий менеджмент.",
  },
  "finance": {
    name: "Фінанси",
    description: "Управління бюджетом та обліком ресторану: планування, контроль витрат, прибутковість.",
  },
  "legal": {
    name: "Юридичні питання",
    description: "Ліцензії, договори, перевірки: правове забезпечення ресторанного бізнесу.",
  },
  "security": {
    name: "Безпека",
    description: "Охорона, відеонагляд, пожежна безпека: захист вашого закладу та відвідувачів.",
  },
  "certification": {
    name: "Сертифікація",
    description: "HACCP, ISO, органічні стандарти: сертифікація якості для ресторанів.",
  },
  "technology": {
    name: "Технології",
    description: "Інновації та діджиталізація: сучасні технології для ресторанного бізнесу.",
  },
  "partnerships": {
    name: "Партнерства",
    description: "Колаборації та нетворкінг: як знаходити партнерів та розвивати бізнес.",
  },
  "trends": {
    name: "Тренди",
    description: "Що нового в індустрії: актуальні тренди ресторанного бізнесу.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryData[slug];

  if (!category) {
    return {
      title: `Категорія | ZakladUA`,
      description: "Перегляньте статті та матеріали у цій категорії на ZakladUA.",
    };
  }

  return generateCategoryMetadata("establishments", {
    name: category.name,
    slug,
    description: category.description,
  });
}

export default async function EstablishmentCategoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = categoryData[slug];

  const schemas = [];

  if (category) {
    // Breadcrumbs schema
    schemas.push(generateBreadcrumbSchema([
      { name: "Головна", url: "/" },
      { name: "Заклади", url: "/establishments" },
      { name: category.name, url: `/establishments/category/${slug}` },
    ]));

    // ItemList schema for category
    schemas.push({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: category.name,
      description: category.description,
      url: `${siteConfig.url}/establishments/category/${slug}`,
      isPartOf: {
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
      },
    });
  }

  return (
    <>
      {schemas.length > 0 && <JsonLd data={schemas} />}
      {children}
    </>
  );
}
