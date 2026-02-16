import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/page-seo";
import { generateBreadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generatePageMetadata("/pricing");

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemas = [
    generateBreadcrumbSchema([
      { name: "Головна", url: "/" },
      { name: "Тарифи", url: "/pricing" },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      {children}
    </>
  );
}
