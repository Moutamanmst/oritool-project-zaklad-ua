"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Eye, Calendar, Share2, Bookmark, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MainLayout } from "@/components/layout/MainLayout";

const articles: Record<string, any> = {
  "trends-2024": {
    title: "Топ-10 трендів дизайну ресторанів у 2024",
    excerpt: "Мінімалізм, природні матеріали, відкриті кухні та інші актуальні напрямки, які варто впровадити у своєму закладі.",
    image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1200&h=600&fit=crop",
    category: "Тренди",
    categoryColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    readTime: "7 хв",
    views: 2340,
    date: "15 грудня 2024",
    content: `
## 1. Мінімалізм та чисті лінії

Сучасні ресторани відмовляються від надмірного декору на користь простих форм та нейтральних кольорів. Мінімалістичний дизайн створює відчуття простору та спокою.

**Де замовити мінімалістичні меблі:**
- [JYSK Ukraine](https://jysk.ua) — доступні варіанти
- [BoConcept Kyiv](https://boconcept.com) — преміум сегмент
- [Kare Design Ukraine](https://kare-design.com.ua) — дизайнерські меблі

## 2. Природні матеріали

Дерево, камінь, бетон та метал — ці матеріали домінують у інтер'єрах 2024 року.

**Де замовити:**
- [Епіцентр](https://epicentrk.ua) — дерево, камінь, плитка
- [Stone & More](https://stoneandmore.com.ua) — натуральний камінь
- [Loft Furniture](https://loftfurniture.com.ua) — меблі з металу та дерева

## 3. Відкриті кухні

Гості хочуть бачити, як готується їхня їжа. Відкриті кухні стають центральним елементом закладу.

**Проектування:**
- [HoReCa Design](https://horecadesign.com.ua) — дизайн ресторанних кухонь
- [Profitex](https://profitex.ua) — професійне обладнання

## 4. Біофільний дизайн

Живі рослини, зелені стіни та природне освітлення покращують самопочуття гостей.

**Де замовити зелені стіни:**
- [Zeleni Stiny](https://zelenistiny.com.ua) — вертикальне озеленення
- [Florium](https://florium.ua) — рослини та догляд
- [Green Wall Ukraine](https://instagram.com/greenwall.ua) — Instagram

## 5. Гнучкі простори

Модульні меблі та трансформовані зони дозволяють адаптувати простір під різні заходи.

## 6. Локальна ідентичність

Використання місцевих матеріалів, художників та ремісників створює унікальний характер закладу.

**Українські ремісники:**
- [Etsy Ukraine](https://etsy.com/market/ukraine_handmade) — handmade декор
- [Всі.Свої](https://vsi.svoi.ua) — український крафт
- [Це Галя](https://tse-galya.com) — кераміка ручної роботи

## 7. Інстаграмні зони

Спеціально спроектовані фотозони з неоновими вивісками та унікальним декором.

## 8. Теплі кольори та освітлення

Бурштинові та теплі тони замість холодного білого світла створюють затишок.

## 9. Акустичний комфорт

Звукопоглинаючі матеріали та продуманий акустичний дизайн забезпечують комфортне спілкування.

**Де замовити:**
- [Acoustic Group](https://acoustic.ua) — акустичні панелі
- [Ekoustik](https://ekoustik.com.ua) — звукоізоляція

## 10. Сталий розвиток

Екологічні матеріали, енергоефективність та відмова від одноразового пластику — не просто тренд, а необхідність.
    `,
  },
  "instagram-interior": {
    title: "Як створити інстаграмний інтер'єр для кав'ярні",
    excerpt: "Фотозони, неонові вивіски, незвичні меблі — все що потрібно для вірусного контенту.",
    image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&h=600&fit=crop",
    category: "Фішки",
    categoryColor: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    readTime: "5 хв",
    views: 1850,
    date: "10 грудня 2024",
    content: `
## Чому це важливо?

У 2024 році 78% гостей обирають заклад за фото в Instagram. Красивий інтер'єр — це безкоштовна реклама від ваших відвідувачів.

## Неонові вивіски

Фраза на стіні в неоновому світлі — класика жанру. Оберіть щось унікальне: цитату, жарт або назву закладу.

**Де замовити неонові вивіски в Україні:**
- [Neon Ukraine](https://neon.ua) — від 2500 грн, виготовлення 3-5 днів
- [NULAR Neon](https://nular.com.ua) — LED-неон, гнучкий неон
- [Neon Studio Kyiv](https://instagram.com/neonstudio.kyiv) — індивідуальні проекти
- [Planeta Neon](https://planetaneon.com.ua) — великий вибір готових та на замовлення
- [Prom.ua](https://prom.ua/ua/Neonovye-vyveski.html) — багато виробників

**Ціни:**
- Проста фраза (до 50 см): 2500-4000 грн
- Середня вивіска (50-100 см): 4000-8000 грн
- Велика інсталяція: від 10000 грн

## Кольорові акценти

Одна яскрава стіна може стати ідеальним фоном для фото.

**Де замовити фарби:**
- [Sniezka Ukraine](https://sniezka.ua) — якісні інтер'єрні фарби
- [Tikkurila](https://tikkurila.com.ua) — преміум фарби
- [Caparol](https://caparol.ua) — професійні покриття

**Популярні кольори 2024:** Millennial Pink, Sage Green, Terracotta, Deep Teal

## Незвичні меблі

Підвісні крісла, круглі дивани, вінтажні стільці — все, що виглядає нестандартно.

**Де замовити:**
- [Підвісні крісла UA](https://podvesnye-kresla.com.ua) — підвісні крісла від 3500 грн
- [Loft Mebel](https://loftmebel.com.ua) — лофт меблі
- [Вінтаж Маркет](https://instagram.com/vintage.market.ua) — антикварні меблі
- [OLX Антикваріат](https://olx.ua/uk/hobbi-otdyh-i-sport/antikvariyat/) — унікальні знахідки

## Рослини та квіти

Живі рослини не тільки покращують повітря, але й створюють ідеальний фон.

**Де замовити:**
- [Florium](https://florium.ua) — монстера, фікус, пальми
- [Pilea](https://pilea.com.ua) — кімнатні рослини з доставкою
- Квіткові ринки — Київ: Бессарабка, Львів: на Галицькій
- [Пампасна трава](https://instagram.com/pampastravakyiv) — OLX, Instagram

**Ціни на рослини:**
- Монстера (великий лист): від 500 грн
- Фікус (1-1.5 м): від 1500 грн
- Пампасна трава (пучок): від 300 грн

## Дзеркала та світло

Великі дзеркала візуально збільшують простір та створюють цікаві ракурси.

**Де замовити дзеркала:**
- [Mirror Lab](https://mirrorlab.com.ua) — дзеркала на замовлення
- [IKEA Ukraine](https://ikea.com.ua) — доступні варіанти
- [Склоресурс](https://skloresurs.com.ua) — великі дзеркала

## Детальний декор

Красиві чашки, оригінальна подача, стильні серветки — деталі, які гості фотографують найчастіше.

**Де замовити посуд:**
- [Olvia](https://olvia.com.ua) — стильний посуд для закладів
- [Luminarc Ukraine](https://luminarc.ua) — класичний посуд
- [Ceramica UA](https://instagram.com/ceramica.ua) — керамікa ручної роботи
- [Це Галя](https://tse-galya.com) — унікальна українська кераміка
    `,
  },
  "lighting-secrets": {
    title: "Секрети освітлення: як світло впливає на апетит гостей",
    excerpt: "Теплі тони збільшують середній чек на 15%. Розбираємо науку світла в ресторанах.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=600&fit=crop",
    category: "Поради",
    categoryColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    readTime: "6 хв",
    views: 1420,
    date: "5 грудня 2024",
    content: `
## Наука про світло

Дослідження показують, що правильне освітлення може збільшити середній чек на 15-20%. Ось як це працює.

## Теплі vs холодні тони

- **Тепле світло (2700-3000K)**: створює затишок, розслаблює, стимулює апетит
- **Холодне світло (4000K+)**: бадьорить, прискорює обіг столів, підходить для фаст-фуду

**Де замовити LED-лампи з теплим світлом:**
- [Maxus LED](https://maxus.com.ua) — українські LED-лампи
- [Osram Ukraine](https://osram.ua) — преміум освітлення
- [Philips Ukraine](https://philips.ua) — широкий асортимент

## Рівні освітлення

Ресторани потребують багаторівневого освітлення:
1. **Загальне** — основний рівень видимості
2. **Акцентне** — виділяє декор та зони
3. **Локальне** — світло над столами

**Де замовити світильники:**
- [Nowodvorski Ukraine](https://nowodvorski.com.ua) — дизайнерські світильники
- [Lightstar](https://lightstar.com.ua) — люстри та бра
- [Luminex](https://luminex.ua) — промислове та дизайнерське освітлення
- [IKEA Ukraine](https://ikea.com.ua) — бюджетні варіанти

## Димери — must have

Можливість регулювати яскравість дозволяє змінювати атмосферу протягом дня.

**Де замовити димери:**
- [ABB Ukraine](https://abb.ua) — професійні системи
- [Legrand Ukraine](https://legrand.ua) — надійні рішення
- [Schneider Electric](https://se.com/ua) — розумне управління

**Ціни:** 
- Простий димер: 500-1500 грн
- Смарт-димер з Wi-Fi: 2000-5000 грн

## Світло над столом

Оптимальна висота підвісних світильників — 75-80 см над столом.

**Підвісні світильники для ресторанів:**
- [Loft Design](https://loftdesign.ua) — індустріальний стиль
- [ArtLight](https://artlight.ua) — авторські світильники
- [Nordlux](https://nordlux.com) — скандинавський дизайн

## LED vs лампи розжарювання

LED економічніші, але оберіть моделі з CRI (індексом кольоропередачі) понад 90.

**Рекомендовані бренди:**
- Philips Hue — розумне світло, CRI 90+
- Osram LED — якість та довговічність
- Maxus LED — українське виробництво, гарна якість

**Ціни на LED з високим CRI:**
- Лампа E27 (теплий білий): 150-400 грн
- Трекові світильники: від 1500 грн
- LED-стрічка (5м): від 500 грн
    `,
  },
  "eco-design": {
    title: "Еко-дизайн: як зробити заклад екологічним та стильним",
    excerpt: "Перероблені матеріали, живі рослини, енергоефективність — тренд на сталий розвиток.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=600&fit=crop",
    category: "Тренди",
    categoryColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    readTime: "8 хв",
    views: 980,
    date: "28 листопада 2024",
    content: `
## Чому еко-дизайн — це вигідно?

67% споживачів готові платити більше за екологічні бренди. Еко-підхід — це не тільки про планету, але й про прибуток.

## Перероблені матеріали

Меблі з переробленого дерева, столи з відновленого металу, декор з вторинної сировини.

**Де замовити еко-меблі:**
- [ReWood Ukraine](https://rewood.ua) — меблі з переробленого дерева
- [Loft Mebel](https://loftmebel.com.ua) — індустріальний стиль з відновлених матеріалів
- [Etsy Ukraine](https://etsy.com/market/ukraine_handmade) — handmade з екоматеріалів
- [OLX Меблі Лофт](https://olx.ua/uk/dom-i-sad/mebel/) — вживані промислові меблі

## Живі стіни та рослини

Вертикальні сади очищують повітря та створюють wow-ефект.

**Де замовити вертикальне озеленення:**
- [Zeleni Stiny](https://zelenistiny.com.ua) — фітостіни від 5000 грн/м²
- [Florawall](https://florawall.com.ua) — модульні системи
- [Green Art Ukraine](https://instagram.com/greenart.ua) — Instagram
- [Florium](https://florium.ua) — рослини для самостійного оформлення

**Ціни:**
- Модуль для фітостіни: від 800 грн
- Повна установка (1 м²): 5000-15000 грн
- Система автополиву: від 3000 грн

## Енергоефективне освітлення

LED-лампи споживають на 75% менше енергії.

**Де замовити:**
- [Maxus LED](https://maxus.com.ua) — українське виробництво
- [OSRAM](https://osram.ua) — преміум клас
- Датчики руху: [Епіцентр](https://epicentrk.ua), [Леруа Мерлен](https://leroymerlin.ua)

## Відмова від одноразового пластику

**Де замовити еко-упаковку:**
- [Ecotoys](https://ecotoys.com.ua) — паперові трубочки, еко-посуд
- [Pack Trade](https://packtrade.ua) — біорозкладна упаковка
- [Green Pack](https://greenpack.com.ua) — крафт-упаковка

**Ціни:**
- Паперові трубочки (100 шт): від 80 грн
- Біорозкладні контейнери: від 5 грн/шт
- Багаторазові контейнери: від 50 грн/шт

## Локальні продукти

**Постачальники органічних продуктів:**
- [Organic Market](https://organicmarket.com.ua)
- [Good Wine](https://goodwine.ua) — розділ "Органіка"
- [Лавка Традицій](https://lavkatradicij.com.ua)

## Компостування відходів

**Обладнання для компостування:**
- Composting Ukraine — Instagram @composting.ua
- Леруа Мерлен — компостери для закладів
- Промислові компостери: від 15000 грн

## Сертифікація

**Еко-сертифікати для ресторанів:**
- [Green Restaurant Association](https://dinegreen.com)
- [Organic Standard Ukraine](https://organicstandard.ua)
- [Зелений журавлик](https://ecolabel.org.ua) — українська еко-маркування
    `,
  },
  "small-space": {
    title: "Маленький простір — великі можливості",
    excerpt: "Як оптимізувати простір у невеликому кафе та створити затишну атмосферу.",
    image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1200&h=600&fit=crop",
    category: "Поради",
    categoryColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    readTime: "4 хв",
    views: 1650,
    date: "20 листопада 2024",
    content: `
## Маленький — не означає тісний

Правильне планування може зробити 30 м² комфортнішими за 100 м². Головне — розумно використовувати кожен сантиметр.

## Дзеркала — ваш друг

Великі дзеркала візуально подвоюють простір.

**Де замовити великі дзеркала:**
- [Mirror Lab](https://mirrorlab.com.ua) — на замовлення, будь-який розмір
- [IKEA Ukraine](https://ikea.com.ua) — HOVET, NISSEDAL — популярні моделі
- [Склоресурс](https://skloresurs.com.ua) — великі дзеркала
- [Leroy Merlin](https://leroymerlin.ua) — бюджетні варіанти

**Ціни:**
- Дзеркало 100x50 см: від 1500 грн
- Дзеркало 180x60 см: від 3500 грн
- На замовлення (м²): від 800 грн

## Вертикальний простір

Полиці до стелі, підвісні рослини, високі барні стільці.

**Де замовити:**
- [IKEA](https://ikea.com.ua) — системи зберігання KALLAX, BILLY
- [Loft Design](https://loftdesign.ua) — металеві полиці
- [OLX Полиці](https://olx.ua/uk/dom-i-sad/mebel/polki-stellazhy/) — на замовлення

## Складні меблі

Столи, що складаються до стіни, штабельовані стільці.

**Де замовити:**
- [IKEA](https://ikea.com.ua) — складні столи NORBERG, NORBO
- [Nardi](https://nardi.com.ua) — штабельовані пластикові стільці
- [Bontempi](https://bontempi.it) — італійські трансформери
- [OLX Меблі](https://olx.ua/uk/dom-i-sad/mebel/) — меблеві майстерні

**Ціни:**
- Відкидний стіл (настінний): від 2500 грн
- Штабельовані стільці (1 шт): від 800 грн

## Світлі кольори

Біла та пастельна палітра візуально розширює простір.

**Рекомендовані фарби:**
- [Sniezka](https://sniezka.ua) — Nature, Energy White
- [Tikkurila](https://tikkurila.com.ua) — Harmony, Feelings
- [Dulux](https://dulux.ua) — Light & Space (спеціальна лінійка)

## Компактне обладнання для кухні

**Де замовити:**
- [Profitex](https://profitex.ua) — компактне HoReCa обладнання
- [Gastromaster](https://gastromaster.ua) — міні-кухні
- [Bosch Professional](https://bosch-professional.com.ua) — компактна техніка

## Освітлення по периметру

Світло по краях візуально розширює стіни.

**Де замовити LED-стрічки:**
- [Maxus LED](https://maxus.com.ua) — якісні LED-стрічки
- [Епіцентр](https://epicentrk.ua) — широкий вибір
- [Klus](https://klus.com.ua) — профілі для LED

**Ціни:**
- LED-стрічка (5м): від 500 грн
- Алюмінієвий профіль (2м): від 200 грн
- Блок живлення: від 300 грн
    `,
  },
  "color-psychology": {
    title: "Психологія кольору в ресторанному бізнесі",
    excerpt: "Червоний стимулює апетит, синій заспокоює — як використовувати кольори правильно.",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&h=600&fit=crop",
    category: "Фішки",
    categoryColor: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    readTime: "6 хв",
    views: 2100,
    date: "15 листопада 2024",
    content: `
## Наука про колір

Кольори впливають на емоції, апетит та поведінку гостей. Правильна палітра може збільшити продажі на 20%.

## Червоний та оранжевий

Стимулюють апетит та прискорюють серцебиття. Ідеальні для фаст-фуду.

**Рекомендовані відтінки (Pantone):**
- Flame Scarlet (18-1662) — яскравий червоний
- Orange Tiger (17-1456) — насичений оранжевий

**Де замовити фарби:**
- [Tikkurila](https://tikkurila.com.ua) — точне колорування
- [Sniezka](https://sniezka.ua) — доступні ціни
- [Caparol](https://caparol.ua) — преміум якість

## Жовтий

Викликає відчуття щастя та енергії. Використовуйте як акцент.

**Популярні відтінки:**
- Illuminating (13-0647) — Pantone Color 2021
- Mustard Yellow — для ретро-стилю

## Зелений

Асоціюється зі здоров'ям та свіжістю. Ідеальний для вегетаріанських закладів.

**Трендові відтінки 2024:**
- Sage Green — шавлієвий, заспокійливий
- Forest Green — насичений, природний
- Mint — свіжий, молодіжний

## Синій

Заспокоює, підходить для морської тематики або преміум-закладів.

**Де використовувати:**
- Морські ресторани
- Cocktail бари
- Преміум-заклади

## Коричневий та бежевий

Створюють відчуття комфорту. Класичний вибір для кав'ярень.

**Матеріали з природними кольорами:**
- Дерево — меблі, панелі
- Шкіра — дивани, крісла
- Керамічна плитка — теракота

**Де замовити:**
- [Loft Mebel](https://loftmebel.com.ua) — дерев'яні меблі
- [Regal Leather](https://regalleather.com.ua) — шкіряні меблі

## Чорний та золотий

Асоціюються з розкішшю. Підходять для fine dining.

**Де замовити золоті акценти:**
- [ZARA Home](https://zarahome.com/ua) — золотий декор
- [H&M Home](https://hm.com/ua/department/HOME) — доступні аксесуари
- [Decor Gold UA](https://instagram.com/decor.gold.ua) — український декор

## Правило 60-30-10

60% — основний колір (стіни, підлога)
30% — вторинний (меблі)
10% — акценти (декор, текстиль)

**Приклад для кав'ярні:**
- 60%: білі/бежеві стіни
- 30%: дерев'яні меблі
- 10%: зелені рослини, золоті лампи

**Сервіси для підбору кольорів:**
- [Coolors](https://coolors.co) — генератор палітр
- [Adobe Color](https://color.adobe.com) — професійний підбір
- [Pantone Color Finder](https://pantone.com/color-finder) — точні кольори
    `,
  },
  "case-kyiv-cafe": {
    title: "Кейс: як ми оновили кав'ярню в центрі Києва",
    excerpt: "Повний редизайн за 3 тижні. Бюджет, матеріали, результат.",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&h=600&fit=crop",
    category: "Кейс",
    categoryColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    readTime: "10 хв",
    views: 3200,
    date: "12 грудня 2024",
    content: `
## Про проект

Кав'ярня "Ранок" на Подолі працювала 5 років без оновлення інтер'єру. Власники звернулися з проханням зробити редизайн, зберігши затишну атмосферу, але додавши сучасності.

## Завдання

- Оновити інтер'єр без капітального ремонту
- Створити інстаграмну зону
- Збільшити кількість посадкових місць
- Вкластися в бюджет 150 000 грн

## Що зробили

**Тиждень 1: Підготовка**
- Демонтаж старих меблів
- Фарбування стін у теплий бежевий (Tikkurila Harmony)
- Заміна освітлення на LED з теплим світлом

**Тиждень 2: Меблі та декор**
- Нові столи з IKEA (LISABO) — 12 000 грн
- Стільці з [Loft Mebel](https://loftmebel.com.ua) — 24 000 грн
- Диван для зони відпочинку — 18 000 грн

**Тиждень 3: Фінальні штрихи**
- Неонова вивіска "Good vibes" від [Neon Ukraine](https://neon.ua) — 4 500 грн
- Рослини з [Florium](https://florium.ua) — 8 000 грн
- Новий посуд — 15 000 грн

## Бюджет

| Категорія | Сума |
|-----------|------|
| Фарби та матеріали | 25 000 грн |
| Меблі | 54 000 грн |
| Освітлення | 18 000 грн |
| Декор | 28 000 грн |
| Роботи | 20 000 грн |
| **Разом** | **145 000 грн** |

## Результат

- Середній чек зріс на 18%
- Кількість фото в Instagram зросла в 3 рази
- Повернення інвестицій за 4 місяці
    `,
  },
  "case-lviv-restaurant": {
    title: "Кейс: ресторан української кухні у Львові",
    excerpt: "Як поєднати традиції та сучасність. Фото до/після.",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200&h=600&fit=crop",
    category: "Кейс",
    categoryColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    readTime: "8 хв",
    views: 2800,
    date: "5 грудня 2024",
    content: `
## Про проект

Ресторан "Смачна Хата" у центрі Львова хотів відійти від "бабусиного" стилю, зберігши українську ідентичність, але зробивши інтер'єр сучасним.

## Концепція

"Сучасна Україна" — поєднання традиційних українських елементів з мінімалістичним скандинавським дизайном.

## Ключові елементи

**Кольорова палітра:**
- Білий та світло-сірий — основа
- Теракотовий — акценти
- Натуральне дерево — тепло

**Українські акценти:**
- Керамічний посуд від [Це Галя](https://tse-galya.com)
- Вишивані серветки від українських майстрів
- Картини сучасних українських художників

**Меблі:**
- Дубові столи на замовлення
- Стільці з [Bontempi](https://bontempi.it)
- Лавки з переробленого дерева

## Освітлення

- Підвісні світильники з керамічними абажурами
- Свічки на столах
- LED-підсвітка під полицями

## Що сказали гості

"Нарешті українська кухня в сучасному інтер'єрі!" — найчастіший відгук.

## Бюджет проекту: 480 000 грн

Включаючи:
- Дизайн-проект
- Меблі на замовлення
- Декор та посуд
- Освітлення
- Роботи
    `,
  },
  "case-odesa-bar": {
    title: "Кейс: коктейльний бар в Одесі з нуля",
    excerpt: "Від концепції до відкриття за 2 місяці. Повний розбір проекту.",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&h=600&fit=crop",
    category: "Кейс",
    categoryColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    readTime: "12 хв",
    views: 1900,
    date: "28 листопада 2024",
    content: `
## Про проект

Новий коктейльний бар "Sunset" на Аркадії. Завдання — створити преміальний простір з атмосферою Miami Vice.

## Концепція: "Одеса 80-х зустрічає Miami"

Ретро-футуризм з неоновими акцентами, рожево-блакитна палітра, багато дзеркал та металу.

## Етапи створення

**Місяць 1: Підготовка простору**
- Демонтаж попереднього інтер'єру
- Вирівнювання стін та стелі
- Прокладання електрики для світлових інсталяцій

**Місяць 2: Дизайн та меблі**
- Барна стійка на замовлення — 85 000 грн
- Диванні зони — 120 000 грн
- Освітлення — 65 000 грн

## Ключові елементи

**Неонові інсталяції:**
- Великий неоновий фламінго — [Planeta Neon](https://planetaneon.com.ua) — 12 000 грн
- Напис "Sunset" — 6 500 грн
- LED-контурне підсвічування — 18 000 грн

**Барна стійка:**
- Основа: бетон з LED-підсвіткою
- Топ: мармурова плита
- Барні стільці: [Nardi](https://nardi.com.ua)

**Дзеркала:**
- Дзеркальна стіна за баром
- Дзеркальна стеля в зоні танцполу
- Виготовлення: [Mirror Lab](https://mirrorlab.com.ua)

## Звук та акустика

- Професійна звукова система
- Акустичні панелі від [Acoustic Group](https://acoustic.ua)
- Зонування звуку: гучніше біля бару, тихіше в лаунж-зоні

## Загальний бюджет: 850 000 грн

| Категорія | Сума |
|-----------|------|
| Будівельні роботи | 180 000 грн |
| Барна стійка | 85 000 грн |
| Меблі | 220 000 грн |
| Освітлення та неон | 95 000 грн |
| Звук та акустика | 120 000 грн |
| Декор | 80 000 грн |
| Дизайн-проект | 70 000 грн |

## Результат

- Повне завантаження у вихідні з першого тижня
- Середній чек: 650 грн
- ROI: очікуване повернення інвестицій за 14 місяців
    `,
  },
};

const relatedArticles = [
  { slug: "trends-2024", title: "Топ-10 трендів дизайну ресторанів у 2024" },
  { slug: "instagram-interior", title: "Як створити інстаграмний інтер'єр" },
  { slug: "lighting-secrets", title: "Секрети освітлення в ресторанах" },
  { slug: "eco-design", title: "Еко-дизайн для ресторану" },
  { slug: "small-space", title: "Маленький простір — великі можливості" },
  { slug: "color-psychology", title: "Психологія кольору в ресторанах" },
  { slug: "case-kyiv-cafe", title: "Кейс: кав'ярня в Києві" },
  { slug: "case-lviv-restaurant", title: "Кейс: ресторан у Львові" },
  { slug: "case-odesa-bar", title: "Кейс: бар в Одесі" },
];

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const article = articles[slug];
  
  if (!article) {
    return (
      <div className="min-h-screen py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-2xl font-bold text-zinc-100 mb-4">
            Статтю не знайдено
          </h1>
          <Link href="/design">
            <Button>Повернутися до статей</Button>
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
          href="/establishments"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-amber-400 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад до закладів
        </Link>

        <article>
          <Badge className={`mb-4 ${article.categoryColor}`}>
            {article.category}
          </Badge>
          
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4">
            {article.title}
          </h1>
          
          <p className="text-xl text-zinc-400 mb-6">
            {article.excerpt}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 mb-8">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {article.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {article.readTime} читання
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {article.views} переглядів
            </span>
          </div>

          <div className="rounded-2xl overflow-hidden mb-8">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-[400px] object-cover"
            />
          </div>

          <div className="flex gap-3 mb-8">
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Поділитися
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Bookmark className="h-4 w-4" />
              Зберегти
            </Button>
          </div>

          <div className="prose prose-invert prose-amber max-w-none">
            {article.content.split('\n').map((line: string, i: number) => {
              if (line.startsWith('## ')) {
                return <h2 key={i} className="text-2xl font-bold text-zinc-100 mt-8 mb-4">{line.replace('## ', '')}</h2>;
              }
              if (line.startsWith('- **')) {
                const match = line.match(/- \*\*(.+?)\*\*: (.+)/);
                if (match) {
                  return (
                    <p key={i} className="text-zinc-300 mb-2">
                      <strong className="text-amber-400">{match[1]}</strong>: {match[2]}
                    </p>
                  );
                }
              }
              if (line.match(/^\d+\. \*\*/)) {
                const match = line.match(/^(\d+)\. \*\*(.+?)\*\* — (.+)/);
                if (match) {
                  return (
                    <p key={i} className="text-zinc-300 mb-2">
                      <span className="text-amber-400 font-bold">{match[1]}.</span> <strong>{match[2]}</strong> — {match[3]}
                    </p>
                  );
                }
              }
              if (line.includes('](')) {
                const parts = line.split(/\[([^\]]+)\]\(([^)]+)\)/g);
                return (
                  <p key={i} className="text-zinc-300 mb-2 leading-relaxed">
                    {parts.map((part, j) => {
                      if (j % 3 === 1) {
                        const url = parts[j + 1];
                        return (
                          <a 
                            key={j} 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-amber-400 hover:text-amber-300 underline"
                          >
                            {part}
                          </a>
                        );
                      }
                      if (j % 3 === 2) return null;
                      return part;
                    })}
                  </p>
                );
              }
              if (line.trim()) {
                return <p key={i} className="text-zinc-300 mb-4 leading-relaxed">{line}</p>;
              }
              return null;
            })}
          </div>
        </article>

        <div className="mt-12 pt-8 border-t border-zinc-800">
          <h3 className="text-xl font-bold text-zinc-100 mb-6">Читайте також</h3>
          <div className="space-y-3">
            {relatedArticles
              .filter(a => a.slug !== slug)
              .slice(0, 3)
              .map((related) => (
                <Link 
                  key={related.slug}
                  href={`/design/${related.slug}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-amber-500/30 transition-colors group"
                >
                  <span className="text-zinc-300 group-hover:text-amber-400 transition-colors">
                    {related.title}
                  </span>
                  <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-amber-400 transition-colors" />
                </Link>
              ))}
          </div>
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <h3 className="text-lg font-bold text-zinc-100 mb-2">Маєте ідею для статті?</h3>
          <p className="text-zinc-400 mb-4">Поділіться своїм досвідом з іншими власниками закладів</p>
          <Button className="bg-amber-500 hover:bg-amber-600 text-black">
            Запропонувати тему
          </Button>
        </div>
      </div>
    </div>
    </MainLayout>
  );
}
