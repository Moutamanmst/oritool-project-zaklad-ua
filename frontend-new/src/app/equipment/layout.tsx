import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/page-seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateBreadcrumbSchema, generateItemListSchema, generateFAQSchema } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata("/equipment");

// Auto-generated FAQ for equipment category page
const categoryFAQ = [
  {
    question: "Яке обладнання потрібно для відкриття ресторану?",
    answer: "Базове обладнання включає: професійну плиту, конвекційну піч, холодильні шафи, посудомийну машину, витяжку, робочі столи з нержавійки. Точний список залежить від концепції та меню закладу.",
  },
  {
    question: "Скільки коштує обладнання для кафе?",
    answer: "Мінімальний бюджет для невеликого кафе — від 100 000 грн. Для повноцінного ресторану — від 500 000 грн. Ціна залежить від площі кухні та меню.",
  },
  {
    question: "Де купити професійне кухонне обладнання в Україні?",
    answer: "На ZakladUA представлені провідні постачальники: RATIONAL, Profitex, Fagor, Hoshizaki. Порівнюйте ціни, читайте відгуки та замовляйте з доставкою по Україні.",
  },
  {
    question: "Яка гарантія на ресторанне обладнання?",
    answer: "Гарантія від виробника зазвичай складає 1-3 роки. Деякі бренди (RATIONAL) надають до 5 років гарантії на окремі компоненти.",
  },
  {
    question: "Чи можна взяти обладнання в лізинг?",
    answer: "Так, багато постачальників пропонують лізинг або розстрочку на професійне обладнання. Умови залежать від суми та терміну договору.",
  },
];

export default function EquipmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbs = [
    { name: "Головна", url: "/" },
    { name: "Обладнання", url: "/equipment" },
  ];

  return (
    <>
      <JsonLd
        data={[
          generateBreadcrumbSchema(breadcrumbs),
          generateItemListSchema(
            [
              { name: "RATIONAL", url: "https://zaklad.ua/equipment/rational", position: 1 },
              { name: "Profitex", url: "https://zaklad.ua/equipment/profitex", position: 2 },
              { name: "Fagor", url: "https://zaklad.ua/equipment/fagor", position: 3 },
              { name: "Hoshizaki", url: "https://zaklad.ua/equipment/hoshizaki", position: 4 },
            ],
            "Професійне обладнання для ресторанів"
          ),
          generateFAQSchema(categoryFAQ),
        ]}
      />
      {children}
    </>
  );
}
