import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/page-seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateBreadcrumbSchema, generateItemListSchema, generateFAQSchema } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata("/pos-systems");

// Auto-generated FAQ for POS systems category page
const categoryFAQ = [
  {
    question: "Що таке POS-система для ресторану?",
    answer: "POS-система (Point of Sale) — це програмно-апаратний комплекс для автоматизації роботи закладу: прийом замовлень, облік продажів, управління складом, аналітика та інтеграція з доставкою.",
  },
  {
    question: "Яку POS-систему обрати для кафе?",
    answer: "Для кафе рекомендуємо системи з простим інтерфейсом та базовими функціями: Poster, Goovii або Checkbox. Вони прості у впровадженні та мають доступну ціну від 299 грн/міс.",
  },
  {
    question: "Скільки коштує POS-система в Україні?",
    answer: "Ціни на POS-системи в Україні стартують від 0 грн (базові тарифи) до 3000+ грн/міс за преміум рішення. Середня вартість для невеликого закладу — 500-1500 грн/міс.",
  },
  {
    question: "Чи потрібне спеціальне обладнання для POS-системи?",
    answer: "Більшість сучасних POS-систем працюють на планшетах та смартфонах. Додатково можуть знадобитися: принтер чеків, сканер штрих-кодів, касовий апарат (ПРРО).",
  },
  {
    question: "Як довго займає впровадження POS-системи?",
    answer: "Базове налаштування займає від 15 хвилин до 1 дня. Повне впровадження з налаштуванням меню, складу та навчанням персоналу — 3-7 днів.",
  },
];

export default function PosSystemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbs = [
    { name: "Головна", url: "/" },
    { name: "POS-системи", url: "/pos-systems" },
  ];

  return (
    <>
      <JsonLd
        data={[
          generateBreadcrumbSchema(breadcrumbs),
          generateItemListSchema(
            [
              { name: "Poster POS", url: "https://zaklad.ua/pos-systems/poster-pos", position: 1 },
              { name: "Goovii", url: "https://zaklad.ua/pos-systems/goovii", position: 2 },
              { name: "iiko", url: "https://zaklad.ua/pos-systems/iiko", position: 3 },
              { name: "R-Keeper", url: "https://zaklad.ua/pos-systems/r-keeper", position: 4 },
              { name: "Syrve", url: "https://zaklad.ua/pos-systems/syrve", position: 5 },
            ],
            "POS-системи для ресторанів України"
          ),
          generateFAQSchema(categoryFAQ),
        ]}
      />
      {children}
    </>
  );
}
