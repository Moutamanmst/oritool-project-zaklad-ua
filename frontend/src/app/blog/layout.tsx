import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/page-seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateBreadcrumbSchema, generateItemListSchema, generateFAQSchema } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata("/blog");

// Auto-generated FAQ for blog
const categoryFAQ = [
  {
    question: "Про що пише блог ZakladUA?",
    answer: "Блог ZakladUA публікує статті про ресторанний бізнес: тренди HoReCa, кейси успішних закладів, огляди обладнання та POS-систем, поради з маркетингу та управління.",
  },
  {
    question: "Як часто виходять нові статті?",
    answer: "Ми публікуємо 2-4 статті на тиждень. Підпишіться на розсилку, щоб отримувати найцікавіші матеріали на email.",
  },
  {
    question: "Чи можна написати гостьову статтю?",
    answer: "Так, ми відкриті до співпраці. Надсилайте пропозиції на email редакції. Публікуємо експертні матеріали від практиків ресторанного бізнесу.",
  },
];

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbs = [
    { name: "Головна", url: "/" },
    { name: "Блог", url: "/blog" },
  ];

  return (
    <>
      <JsonLd
        data={[
          generateBreadcrumbSchema(breadcrumbs),
          generateItemListSchema(
            [
              { name: "Ресторанні тренди 2024", url: "https://zaklad.ua/blog/restaurant-trends-2024", position: 1 },
              { name: "Як відкрити ресторан", url: "https://zaklad.ua/blog/how-to-open-restaurant", position: 2 },
              { name: "Порівняння POS-систем", url: "https://zaklad.ua/blog/pos-system-comparison", position: 3 },
            ],
            "Статті про ресторанний бізнес"
          ),
          generateFAQSchema(categoryFAQ),
        ]}
      />
      {children}
    </>
  );
}
