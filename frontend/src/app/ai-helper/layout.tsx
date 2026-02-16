import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/page-seo";
import { generateFAQSchema, generateBreadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = generatePageMetadata("/ai-helper");

export default function AiHelperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemas = [
    // Breadcrumbs
    generateBreadcrumbSchema([
      { name: "Головна", url: "/" },
      { name: "AI-помічник", url: "/ai-helper" },
    ]),
    // FAQ schema for AI helper
    generateFAQSchema([
      {
        question: "Що таке AI-помічник ZakladUA?",
        answer: "AI-помічник ZakladUA - це безкоштовний чат-бот на базі штучного інтелекту, який допомагає власникам ресторанів та кафе з вибором обладнання, POS-систем, постачальників та відповідає на питання про ресторанний бізнес.",
      },
      {
        question: "Чи безкоштовний AI-помічник?",
        answer: "Так, AI-помічник ZakladUA повністю безкоштовний для всіх користувачів платформи.",
      },
      {
        question: "Які питання можна задавати AI-помічнику?",
        answer: "Ви можете запитувати про вибір POS-системи, порівняння обладнання, пошук постачальників, маркетингові стратегії, юридичні питання та будь-що інше, пов'язане з ресторанним бізнесом.",
      },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      {children}
    </>
  );
}
