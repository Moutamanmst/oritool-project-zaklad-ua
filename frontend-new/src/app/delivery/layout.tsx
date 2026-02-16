import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/page-seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateBreadcrumbSchema, generateItemListSchema, generateFAQSchema } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata("/delivery");

// Auto-generated FAQ for delivery services
const categoryFAQ = [
  {
    question: "Як підключити ресторан до сервісу доставки?",
    answer: "Заповніть заявку на сайті сервісу (Glovo, Bolt Food тощо). Менеджер зв'яжеться для підписання договору та налаштування інтеграції з вашою POS-системою.",
  },
  {
    question: "Яка комісія у сервісів доставки?",
    answer: "Комісія залежить від сервісу та умов договору. Зазвичай 15-35% від суми замовлення. Точні умови уточнюйте при підключенні.",
  },
  {
    question: "Чи можна підключитися до кількох сервісів одночасно?",
    answer: "Так, більшість закладів працюють з 2-3 сервісами доставки одночасно. Це збільшує охоплення аудиторії та кількість замовлень.",
  },
  {
    question: "Як інтегрувати доставку з POS-системою?",
    answer: "Популярні POS-системи (Poster, iiko, R-Keeper) мають готові інтеграції з Glovo, Bolt Food та іншими агрегаторами. Замовлення автоматично потрапляють у систему.",
  },
];

export default function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbs = [
    { name: "Головна", url: "/" },
    { name: "Доставка", url: "/delivery" },
  ];

  return (
    <>
      <JsonLd
        data={[
          generateBreadcrumbSchema(breadcrumbs),
          generateItemListSchema(
            [
              { name: "Glovo", url: "https://zaklad.ua/delivery/glovo", position: 1 },
              { name: "Bolt Food", url: "https://zaklad.ua/delivery/bolt-food", position: 2 },
              { name: "Rocket", url: "https://zaklad.ua/delivery/rocket", position: 3 },
            ],
            "Сервіси доставки їжі для ресторанів"
          ),
          generateFAQSchema(categoryFAQ),
        ]}
      />
      {children}
    </>
  );
}
