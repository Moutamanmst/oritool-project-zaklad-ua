"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Eye, Calendar, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/MainLayout";

const categoryData: Record<string, string> = {
  "tips-trends": "Фішки та тренди",
  "cases": "Кейси та приклади",
  "menu-marketing": "Маркетинг меню",
  "social-media": "Соціальні мережі",
  "loyalty": "Програми лояльності",
  "advertising": "Реклама закладу",
};

const articlesContent: Record<string, {
  title: string;
  image: string;
  readTime: number;
  views: number;
  date: string;
  content: string[];
}> = {
  "restaurant-trends-2024": {
    title: "Топ-10 трендів ресторанного маркетингу 2024",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200",
    readTime: 8,
    views: 2450,
    date: "15 грудня 2024",
    content: [
      "Ресторанний бізнес постійно змінюється, і 2024 рік приніс нові виклики та можливості для маркетологів. Розглянемо найактуальніші тренди.",
      "**1. Персоналізація на основі даних**\nВикористання CRM-систем та аналітики для створення персоналізованих пропозицій для кожного гостя.",
      "**2. Відео-контент у коротких форматах**\nReels, TikTok та YouTube Shorts стали основними каналами залучення молодої аудиторії.",
      "**3. Екологічність та сталий розвиток**\nГості все частіше обирають заклади з еко-ініціативами та прозорим ланцюжком постачання.",
      "**4. Гіперлокальний маркетинг**\nТаргетування на мікрорайони та використання геолокації для залучення відвідувачів поблизу.",
      "**5. Інтерактивні меню та AR**\nДоповнена реальність дозволяє побачити страву перед замовленням.",
      "**6. Колаборації з локальними брендами**\nСпівпраця з місцевими виробниками та артистами для створення унікального досвіду.",
      "**7. Підписки та членства**\nПрограми лояльності нового покоління з щомісячними підписками на бонуси.",
      "**8. User-Generated Content**\nСтимулювання гостей створювати контент про заклад.",
      "**9. Голосовий пошук та оптимізація**\nАдаптація контенту для голосових асистентів.",
      "**10. Емоційний маркетинг**\nСторітелінг та створення емоційного зв'язку з брендом.",
    ],
  },
  "instagram-reels-tips": {
    title: "Як створювати вірусні Reels для ресторану",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200",
    readTime: 6,
    views: 1890,
    date: "10 грудня 2024",
    content: [
      "Instagram Reels — потужний інструмент для просування ресторану. Ось як зробити ваш контент вірусним.",
      "**Формати що працюють:**\n• Behind the scenes — процес приготування страв\n• Трансформації — до/після сервірування\n• Рецепти за 30 секунд\n• Реакції гостей на страви",
      "**Технічні поради:**\n• Знімайте при хорошому освітленні\n• Використовуйте трендову музику\n• Оптимальна довжина — 15-30 секунд\n• Додавайте субтитри",
      "**Час публікації:**\nНайкращий час для ресторанів — за 2-3 години до обіду або вечері, коли люди планують куди піти.",
      "**Хештеги:**\nВикористовуйте мікс популярних (#foodie, #restaurant) та локальних (#київ, #львів) хештегів.",
    ],
  },
  "case-lviv-cafe": {
    title: "Як львівська кав'ярня збільшила продажі на 40%",
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1200",
    readTime: 10,
    views: 3200,
    date: "5 грудня 2024",
    content: [
      "Кав'ярня 'Світанок' у центрі Львова за 6 місяців збільшила продажі на 40% завдяки комплексній маркетинговій стратегії.",
      "**Початкова ситуація:**\nНевелика кав'ярня на 30 місць, середній чек 150 грн, проблема з залученням нових клієнтів.",
      "**Що зробили:**\n1. Запустили Instagram з акцентом на Reels\n2. Створили програму лояльності через Telegram-бота\n3. Почали співпрацю з місцевими блогерами\n4. Ввели сезонне меню з лімітованими позиціями",
      "**Результати через 6 місяців:**\n• Кількість підписників: 500 → 8500\n• Середній чек: 150 → 210 грн\n• Кількість відвідувачів на день: 80 → 140\n• Загальний ріст продажів: +40%",
      "**Ключовий інсайт:**\nНайбільший вплив мала програма лояльності — 35% продажів приходить від постійних клієнтів.",
    ],
  },
  "menu-psychology": {
    title: "Психологія меню: як збільшити середній чек",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200",
    readTime: 7,
    views: 2100,
    date: "1 грудня 2024",
    content: [
      "Меню — це не просто список страв, а потужний інструмент продажів. Ось науково підтверджені техніки.",
      "**Золотий трикутник:**\nПогляд читача меню рухається по трикутнику: центр → правий верхній кут → лівий верхній кут. Розміщуйте найприбутковіші страви саме там.",
      "**Прибирайте валюту:**\nЦіни без символу валюти (250 замість 250₴) знижують 'біль оплати' та збільшують витрати на 8%.",
      "**Описи що продають:**\nЗамість 'Салат Цезар' — 'Хрусткий салат Цезар з пармезаном 24-місячної витримки'. Детальні описи підвищують продажі на 27%.",
      "**Якір ціни:**\nРозміщуйте найдорожчу страву першою в категорії — інші здаватимуться вигіднішими.",
      "**Обмежений вибір:**\n7±2 страви в категорії — оптимальна кількість для швидкого вибору без стресу.",
    ],
  },
  "instagram-strategy": {
    title: "Instagram-стратегія для ресторану на 2024 рік",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=1200",
    readTime: 11,
    views: 3500,
    date: "28 листопада 2024",
    content: [
      "Повний гайд з ведення Instagram для ресторану: від контент-плану до аналітики.",
      "**Контент-мікс:**\n• 40% — фото страв та напоїв\n• 25% — behind the scenes\n• 20% — команда та атмосфера\n• 15% — репости гостей та відгуки",
      "**Частота публікацій:**\n• Пости: 4-5 на тиждень\n• Stories: 5-10 на день\n• Reels: 3-4 на тиждень",
      "**Робота з блогерами:**\nЗапрошуйте мікроблогерів (5-50к підписників) на безкоштовну вечерю в обмін на контент. ROI вищий ніж у великих інфлюенсерів.",
      "**Хештег-стратегія:**\nСтворіть унікальний хештег закладу та заохочуйте гостей його використовувати.",
      "**Аналітика:**\nЩотижня аналізуйте: охоплення, залученість, переходи в профіль, кліки на посилання.",
    ],
  },
  "loyalty-program-types": {
    title: "5 типів програм лояльності для ресторанів",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200",
    readTime: 8,
    views: 2200,
    date: "20 листопада 2024",
    content: [
      "Програма лояльності — must-have для будь-якого закладу. Розглянемо основні типи.",
      "**1. Накопичувальна система балів**\nКласика: 1 грн = 1 бал, 100 балів = знижка. Простий та зрозумілий механізм.",
      "**2. Штампи/печатки**\n'Купи 9 кав — 10-та безкоштовно'. Працює для закладів з частими візитами.",
      "**3. Кешбек**\nПовернення 5-10% від чека на бонусний рахунок. Мотивує витрачати більше.",
      "**4. Рівнева система**\nБронзовий → Срібний → Золотий статус з різними привілеями. Створює ексклюзивність.",
      "**5. Підписка**\nЩомісячна оплата за безлімітну каву або знижки. Тренд 2024 року.",
      "**Як обрати:**\nДля кав'ярень — штампи або підписка. Для ресторанів — бали або рівні. Для фастфуду — кешбек.",
    ],
  },
  "google-ads-restaurant": {
    title: "Google Ads для ресторану: повний гайд",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
    readTime: 15,
    views: 2700,
    date: "15 листопада 2024",
    content: [
      "Google Ads дозволяє залучати клієнтів саме тоді, коли вони шукають де поїсти. Ось як налаштувати ефективну кампанію.",
      "**Типи кампаній для ресторанів:**\n• Пошукові — для запитів 'ресторан поруч'\n• Локальні — для Google Maps\n• Display — для ремаркетингу",
      "**Ключові слова:**\n• 'ресторан + район'\n• 'де поїсти + місто'\n• 'доставка їжі + район'\n• 'бронювання столика'",
      "**Структура кампанії:**\nСтворіть окремі групи оголошень для: обідів, вечерь, доставки, бронювання.",
      "**Розширення оголошень:**\n• Адреса та телефон\n• Посилання на меню\n• Ціни на популярні страви\n• Відгуки",
      "**Бюджет:**\nПочніть з 500-1000 грн/день. Аналізуйте CPA (вартість залучення клієнта) та оптимізуйте.",
      "**Ремаркетинг:**\nПоказуйте рекламу тим, хто відвідував сайт але не забронював столик.",
    ],
  },
};

export default function MarketingArticlePage() {
  const params = useParams();
  const categorySlug = params.slug as string;
  const articleSlug = params.article as string;
  
  const categoryName = categoryData[categorySlug];
  const article = articlesContent[articleSlug];

  if (!article || !categoryName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-100 mb-4">Статтю не знайдено</h1>
          <Link href="/marketing" className="text-amber-500 hover:text-amber-400">
            Повернутись до маркетингу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          href={`/marketing/${categorySlug}`}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад до {categoryName}
        </Link>

        <article>
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="flex flex-wrap gap-4 text-sm text-zinc-300 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {article.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {article.readTime} хв читання
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {article.views} переглядів
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-zinc-100">
                {article.title}
              </h1>
            </div>
          </div>

          <Card>
            <CardContent className="p-6 md:p-8">
              <div className="prose prose-invert prose-amber max-w-none">
                {article.content.map((paragraph, index) => (
                  <div key={index} className="mb-6">
                    {paragraph.split('\n').map((line, lineIndex) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return (
                          <h3 key={lineIndex} className="text-xl font-bold text-amber-400 mb-3 mt-6">
                            {line.replace(/\*\*/g, '')}
                          </h3>
                        );
                      } else if (line.startsWith('**')) {
                        const parts = line.split('**');
                        return (
                          <div key={lineIndex}>
                            <h3 className="text-xl font-bold text-amber-400 mb-3 mt-6">
                              {parts[1]}
                            </h3>
                            <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
                              {parts[2]}
                            </p>
                          </div>
                        );
                      } else if (line.startsWith('•')) {
                        return (
                          <p key={lineIndex} className="text-zinc-300 leading-relaxed pl-4">
                            {line}
                          </p>
                        );
                      } else {
                        return (
                          <p key={lineIndex} className="text-zinc-300 leading-relaxed">
                            {line}
                          </p>
                        );
                      }
                    })}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-8">
            <Button variant="outline" size="lg" className="gap-2">
              <Share2 className="h-4 w-4" />
              Поділитись статтею
            </Button>
          </div>
        </article>
      </div>
    </div>
    </MainLayout>
  );
}

