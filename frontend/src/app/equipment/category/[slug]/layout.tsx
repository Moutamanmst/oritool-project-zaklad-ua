import { Metadata } from "next";
import { generateCategoryMetadata } from "@/lib/page-seo";
import { generateBreadcrumbSchema, siteConfig } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

// Static category data for SEO
const categoryData: Record<string, { name: string; description: string }> = {
  "maintenance": {
    name: "Технічне обслуговування",
    description: "Ремонт та сервіс ресторанного обладнання. Знайдіть спеціалістів для обслуговування техніки.",
  },
  "refrigeration": {
    name: "Холодильне обладнання",
    description: "Холодильники, морозильники, вітрини для ресторанів. Поради з обслуговування та ремонту.",
  },
  "thermal": {
    name: "Теплове обладнання",
    description: "Плити, печі, грилі, фритюрниці для професійної кухні. Технічні поради та сервіс.",
  },
  "ventilation": {
    name: "Вентиляція",
    description: "Витяжки, кондиціонери, вентиляційні системи для закладів HoReCa.",
  },
  "coffee": {
    name: "Кавове обладнання",
    description: "Кавомашини, кавомолки, аксесуари. Поради з декальцинації та обслуговування.",
  },
  "kitchen": {
    name: "Кухонне обладнання",
    description: "Міксери, слайсери, м'ясорубки та інше обладнання для професійної кухні.",
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
      title: `Категорія обладнання | ZakladUA`,
      description: "Перегляньте обладнання у цій категорії на ZakladUA.",
    };
  }

  return generateCategoryMetadata("equipment", {
    name: category.name,
    slug,
    description: category.description,
  });
}

export default async function EquipmentCategoryLayout({
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
      { name: "Обладнання", url: "/equipment" },
      { name: category.name, url: `/equipment/category/${slug}` },
    ]));

    // CollectionPage schema
    schemas.push({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: category.name,
      description: category.description,
      url: `${siteConfig.url}/equipment/category/${slug}`,
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
