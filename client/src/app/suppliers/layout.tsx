import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/page-seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateBreadcrumbSchema, generateItemListSchema, generateFAQSchema } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata("/suppliers");

// Auto-generated FAQ for suppliers
const categoryFAQ = [
  {
    question: "Як знайти постачальника для ресторану?",
    answer: "На ZakladUA представлені перевірені постачальники продуктів, напоїв та інгредієнтів. Фільтруйте за категорією, містом та типом продукції.",
  },
  {
    question: "Які мінімальні обсяги замовлення?",
    answer: "Мінімальне замовлення залежить від постачальника. Зазвичай від 500-1000 грн для продуктів та від 3000 грн для напоїв.",
  },
  {
    question: "Чи є доставка від постачальників?",
    answer: "Більшість постачальників здійснюють доставку по місту та Україні. Безкоштовна доставка зазвичай від певної суми замовлення.",
  },
  {
    question: "Як отримати оптові ціни?",
    answer: "Зареєструйтесь як бізнес-клієнт, укладіть договір з постачальником. Оптові ціни на 10-30% нижчі від роздрібних.",
  },
  {
    question: "Як перевірити якість постачальника?",
    answer: "Читайте відгуки на ZakladUA, запитуйте сертифікати якості, замовте тестову партію перед укладанням довгострокового договору.",
  },
];

export default function SuppliersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbs = [
    { name: "Головна", url: "/" },
    { name: "Постачальники", url: "/suppliers" },
  ];

  return (
    <>
      <JsonLd
        data={[
          generateBreadcrumbSchema(breadcrumbs),
          generateItemListSchema(
            [
              { name: "METRO", url: "https://zaklad.ua/suppliers/metro", position: 1 },
              { name: "Fozzy Group", url: "https://zaklad.ua/suppliers/fozzy", position: 2 },
            ],
            "Постачальники продуктів для HoReCa"
          ),
          generateFAQSchema(categoryFAQ),
        ]}
      />
      {children}
    </>
  );
}
