import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/page-seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateBreadcrumbSchema, generateItemListSchema, generateFAQSchema } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata("/qr-menu");

// Auto-generated FAQ for QR-menu services
const categoryFAQ = [
  {
    question: "Що таке QR-меню для ресторану?",
    answer: "QR-меню — це електронне меню, яке гості відкривають на смартфоні, відсканувавши QR-код на столі. Може включати замовлення та оплату онлайн.",
  },
  {
    question: "Скільки коштує QR-меню?",
    answer: "Базові рішення безкоштовні або коштують 100-300 грн/міс. Преміум версії з замовленням та оплатою — 500-1500 грн/міс.",
  },
  {
    question: "Чи потрібен інтернет для QR-меню?",
    answer: "Гостям потрібен інтернет для перегляду меню. Рекомендуємо забезпечити Wi-Fi в закладі. Деякі рішення працюють офлайн після першого завантаження.",
  },
  {
    question: "Як створити QR-меню?",
    answer: "Зареєструйтесь на платформі QR-меню, завантажте меню з фото та цінами, отримайте QR-код для друку. Налаштування займає 15-30 хвилин.",
  },
  {
    question: "Чи замінює QR-меню паперове?",
    answer: "QR-меню може повністю замінити паперове або доповнювати його. Економія на друкуванні, можливість миттєво оновлювати ціни та позиції.",
  },
];

export default function QrMenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbs = [
    { name: "Головна", url: "/" },
    { name: "QR-меню", url: "/qr-menu" },
  ];

  return (
    <>
      <JsonLd
        data={[
          generateBreadcrumbSchema(breadcrumbs),
          generateItemListSchema(
            [
              { name: "Choice QR", url: "https://zaklad.ua/qr-menu/choice-qr", position: 1 },
              { name: "Menu.ua", url: "https://zaklad.ua/qr-menu/menu-ua", position: 2 },
            ],
            "QR-меню сервіси для ресторанів"
          ),
          generateFAQSchema(categoryFAQ),
        ]}
      />
      {children}
    </>
  );
}
