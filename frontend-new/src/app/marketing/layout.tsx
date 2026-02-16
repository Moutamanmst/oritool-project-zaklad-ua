import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/page-seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateBreadcrumbSchema, generateItemListSchema, generateFAQSchema } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata("/marketing");

// Auto-generated FAQ for marketing section
const categoryFAQ = [
  {
    question: "Як просувати ресторан в Instagram?",
    answer: "Публікуйте якісні фото страв, використовуйте Stories, співпрацюйте з блогерами, запускайте конкурси. Регулярність важливіша за кількість публікацій.",
  },
  {
    question: "Яка реклама працює для ресторанів?",
    answer: "Найефективніші канали: Google My Business, таргетована реклама в Instagram/Facebook, локальна реклама, програми лояльності та сарафанне радіо.",
  },
  {
    question: "Скільки витрачати на маркетинг ресторану?",
    answer: "Рекомендований бюджет — 3-5% від виручки. Для нових закладів може бути вищим — до 10% перші 3-6 місяців для залучення аудиторії.",
  },
  {
    question: "Як збільшити середній чек?",
    answer: "Навчіть персонал техніці upselling, використовуйте комбо-пропозиції, оновлюйте меню сезонними позиціями, впровадьте програму лояльності.",
  },
  {
    question: "Чи потрібен ресторану сайт?",
    answer: "Так, власний сайт важливий для SEO та іміджу. Мінімум: меню, контакти, бронювання. Оптимально: інтеграція з доставкою та онлайн-оплатою.",
  },
];

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbs = [
    { name: "Головна", url: "/" },
    { name: "Маркетинг", url: "/marketing" },
  ];

  return (
    <>
      <JsonLd
        data={[
          generateBreadcrumbSchema(breadcrumbs),
          generateItemListSchema(
            [
              { name: "SMM для ресторанів", url: "https://zaklad.ua/marketing/smm", position: 1 },
              { name: "Програми лояльності", url: "https://zaklad.ua/marketing/loyalty", position: 2 },
              { name: "Email-маркетинг", url: "https://zaklad.ua/marketing/email", position: 3 },
            ],
            "Маркетингові інструменти для ресторанів"
          ),
          generateFAQSchema(categoryFAQ),
        ]}
      />
      {children}
    </>
  );
}
