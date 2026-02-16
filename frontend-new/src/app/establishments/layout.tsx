import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/page-seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateBreadcrumbSchema, generateItemListSchema, generateFAQSchema } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata("/establishments");

// Auto-generated FAQ for establishments catalog
const categoryFAQ = [
  {
    question: "Як знайти ресторан поруч?",
    answer: "Використовуйте фільтр по місту на сторінці каталогу. Доступні Київ, Львів, Одеса, Харків, Дніпро та інші міста України з сортуванням за рейтингом.",
  },
  {
    question: "Як залишити відгук про заклад?",
    answer: "Зареєструйтесь на ZakladUA та перейдіть на сторінку закладу. Натисніть 'Написати відгук', оцініть кухню, сервіс та атмосферу, додайте коментар.",
  },
  {
    question: "Як додати свій заклад на ZakladUA?",
    answer: "Зареєструйтесь як бізнес-користувач та заповніть профіль закладу: назва, адреса, меню, фото, контакти. Базове розміщення безкоштовне.",
  },
  {
    question: "Які типи закладів представлені?",
    answer: "На платформі представлені: ресторани, кафе, бари, кав'ярні, пекарні, фастфуди, піцерії та інші заклади HoReCa по всій Україні.",
  },
];

export default function EstablishmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbs = [
    { name: "Головна", url: "/" },
    { name: "Заклади", url: "/establishments" },
  ];

  return (
    <>
      <JsonLd
        data={[
          generateBreadcrumbSchema(breadcrumbs),
          generateItemListSchema(
            [
              { name: "Ресторани Києва", url: "https://zaklad.ua/establishments?city=kyiv", position: 1 },
              { name: "Кафе Львова", url: "https://zaklad.ua/establishments?city=lviv", position: 2 },
              { name: "Бари Одеси", url: "https://zaklad.ua/establishments?city=odesa", position: 3 },
            ],
            "Каталог закладів HoReCa України"
          ),
          generateFAQSchema(categoryFAQ),
        ]}
      />
      {children}
    </>
  );
}
