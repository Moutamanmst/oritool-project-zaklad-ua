import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/page-seo";
import { generateBreadcrumbSchema, generateItemListSchema, siteConfig } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generatePageMetadata("/establishments/rating");

export default function EstablishmentRatingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemas = [
    // Breadcrumbs
    generateBreadcrumbSchema([
      { name: "Головна", url: "/" },
      { name: "Заклади", url: "/establishments" },
      { name: "Рейтинг", url: "/establishments/rating" },
    ]),
    // ItemList for ranking page
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Рейтинг закладів України",
      description: "Топ ресторанів, кафе та барів України за оцінками відвідувачів",
      url: `${siteConfig.url}/establishments/rating`,
      numberOfItems: 100,
      itemListOrder: "https://schema.org/ItemListOrderDescending",
    },
  ];

  return (
    <>
      <JsonLd data={schemas} />
      {children}
    </>
  );
}
