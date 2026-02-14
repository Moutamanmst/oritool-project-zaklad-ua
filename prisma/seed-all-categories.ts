import { PrismaClient, EntityStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAllCategories() {
  console.log('Adding Equipment, Suppliers, Delivery, QR-menu, Aggregators...');

  // Get categories
  const equipmentCat = await prisma.category.findFirst({ where: { slug: 'equipment' } });
  const suppliersCat = await prisma.category.findFirst({ where: { slug: 'suppliers' } });
  const deliveryCat = await prisma.category.findFirst({ where: { slug: 'delivery' } });
  const qrMenuCat = await prisma.category.findFirst({ where: { slug: 'qr-menu' } });
  const aggregatorsCat = await prisma.category.findFirst({ where: { slug: 'aggregators' } });

  // Equipment
  const equipment = [
    {
      slug: 'rational-combi-oven',
      name: 'RATIONAL iCombi Pro',
      nameRu: 'RATIONAL iCombi Pro',
      description: 'Професійна пароконвекційна піч RATIONAL iCombi Pro — золотий стандарт для професійних кухонь. Інтелектуальне приготування, економія часу та енергії.',
      descriptionRu: 'Профессиональный пароконвектомат RATIONAL iCombi Pro — золотой стандарт для профессиональных кухонь. Интеллектуальное приготовление, экономия времени и энергии.',
      shortDescription: 'Пароконвекційна піч преміум-класу',
      shortDescriptionRu: 'Пароконвектомат премиум-класса',
      website: 'https://rational-online.com',
      priceFrom: 150000,
      priceTo: 500000,
      pricingModel: 'one-time',
      features: ['steam', 'convection', 'smart-cooking', 'self-cleaning', 'haccp'],
      integrations: ['iiko', 'r-keeper'],
      averageRating: 4.9,
      reviewCount: 67,
    },
    {
      slug: 'hoshizaki-ice-maker',
      name: 'Hoshizaki IM-240ANE',
      nameRu: 'Hoshizaki IM-240ANE',
      description: 'Льодогенератор Hoshizaki — японська якість та надійність. Виробництво до 240 кг льоду на добу.',
      descriptionRu: 'Льдогенератор Hoshizaki — японское качество и надежность. Производство до 240 кг льда в сутки.',
      shortDescription: 'Професійний льодогенератор',
      shortDescriptionRu: 'Профессиональный льдогенератор',
      website: 'https://hoshizaki.ua',
      priceFrom: 85000,
      priceTo: 150000,
      pricingModel: 'one-time',
      features: ['ice-cubes', 'energy-efficient', 'stainless-steel', 'auto-clean'],
      averageRating: 4.7,
      reviewCount: 34,
    },
    {
      slug: 'fagor-dishwasher',
      name: 'Fagor CO-502 DD',
      nameRu: 'Fagor CO-502 DD',
      description: 'Купольна посудомийна машина Fagor — ідеальне рішення для ресторанів та кафе. Миє до 1440 тарілок на годину.',
      descriptionRu: 'Купольная посудомоечная машина Fagor — идеальное решение для ресторанов и кафе. Моет до 1440 тарелок в час.',
      shortDescription: 'Купольна посудомийна машина',
      shortDescriptionRu: 'Купольная посудомоечная машина',
      website: 'https://fagor.ua',
      priceFrom: 120000,
      priceTo: 200000,
      pricingModel: 'one-time',
      features: ['fast-wash', 'energy-efficient', 'double-skin', 'rinse-aid'],
      averageRating: 4.6,
      reviewCount: 45,
    },
  ];

  // Suppliers
  const suppliers = [
    {
      slug: 'metro-cash-carry',
      name: 'METRO Cash & Carry',
      nameRu: 'METRO Cash & Carry',
      description: 'METRO Cash & Carry — провідний міжнародний постачальник продуктів та товарів для HoReCa. Широкий асортимент, вигідні ціни, доставка.',
      descriptionRu: 'METRO Cash & Carry — ведущий международный поставщик продуктов и товаров для HoReCa. Широкий ассортимент, выгодные цены, доставка.',
      shortDescription: 'Продукти та товари для HoReCa',
      shortDescriptionRu: 'Продукты и товары для HoReCa',
      website: 'https://metro.ua',
      features: ['delivery', 'wholesale', 'fresh-products', 'frozen', 'non-food'],
      averageRating: 4.3,
      reviewCount: 234,
    },
    {
      slug: 'selgros',
      name: 'Selgros',
      nameRu: 'Selgros',
      description: 'Selgros — мережа оптових магазинів для бізнесу. Продукти харчування, напої, обладнання для ресторанів.',
      descriptionRu: 'Selgros — сеть оптовых магазинов для бизнеса. Продукты питания, напитки, оборудование для ресторанов.',
      shortDescription: 'Оптовий постачальник для бізнесу',
      shortDescriptionRu: 'Оптовый поставщик для бизнеса',
      website: 'https://selgros.ua',
      features: ['delivery', 'wholesale', 'fresh-products', 'beverages'],
      averageRating: 4.2,
      reviewCount: 156,
    },
    {
      slug: 'premier-food',
      name: 'Premier Food',
      nameRu: 'Premier Food',
      description: 'Premier Food — преміальний постачальник морепродуктів, м\'яса та делікатесів для ресторанів. Імпорт з Європи та Азії.',
      descriptionRu: 'Premier Food — премиальный поставщик морепродуктов, мяса и деликатесов для ресторанов. Импорт из Европы и Азии.',
      shortDescription: 'Преміум продукти для ресторанів',
      shortDescriptionRu: 'Премиум продукты для ресторанов',
      website: 'https://premierfood.ua',
      features: ['seafood', 'meat', 'import', 'premium', 'delivery'],
      averageRating: 4.8,
      reviewCount: 89,
    },
  ];

  // Delivery Services
  const deliveryServices = [
    {
      slug: 'glovo',
      name: 'Glovo',
      nameRu: 'Glovo',
      description: 'Glovo — сервіс швидкої доставки їжі та товарів. Інтеграція з POS-системами, аналітика замовлень, маркетингові інструменти для ресторанів.',
      descriptionRu: 'Glovo — сервис быстрой доставки еды и товаров. Интеграция с POS-системами, аналитика заказов, маркетинговые инструменты для ресторанов.',
      shortDescription: 'Сервіс доставки їжі',
      shortDescriptionRu: 'Сервис доставки еды',
      website: 'https://glovoapp.com',
      features: ['fast-delivery', 'pos-integration', 'analytics', 'marketing', 'tracking'],
      integrations: ['poster', 'iiko', 'r-keeper', 'checkbox'],
      averageRating: 4.1,
      reviewCount: 567,
    },
    {
      slug: 'bolt-food',
      name: 'Bolt Food',
      nameRu: 'Bolt Food',
      description: 'Bolt Food — доставка їжі з найкращих ресторанів міста. Низька комісія для партнерів, швидка виплата.',
      descriptionRu: 'Bolt Food — доставка еды из лучших ресторанов города. Низкая комиссия для партнеров, быстрая выплата.',
      shortDescription: 'Доставка їжі з ресторанів',
      shortDescriptionRu: 'Доставка еды из ресторанов',
      website: 'https://food.bolt.eu',
      features: ['fast-delivery', 'low-commission', 'pos-integration', 'tracking'],
      integrations: ['poster', 'iiko'],
      averageRating: 4.3,
      reviewCount: 423,
    },
    {
      slug: 'raketa',
      name: 'Raketa',
      nameRu: 'Raketa',
      description: 'Raketa — український сервіс доставки їжі. Підтримка локального бізнесу, низька комісія, швидка доставка.',
      descriptionRu: 'Raketa — украинский сервис доставки еды. Поддержка локального бизнеса, низкая комиссия, быстрая доставка.',
      shortDescription: 'Український сервіс доставки',
      shortDescriptionRu: 'Украинский сервис доставки',
      website: 'https://raketa.ua',
      features: ['fast-delivery', 'low-commission', 'ukrainian', 'tracking'],
      integrations: ['poster', 'iiko', 'checkbox'],
      averageRating: 4.4,
      reviewCount: 312,
    },
  ];

  // QR Menu Services
  const qrMenuServices = [
    {
      slug: 'menu-ua',
      name: 'Menu.ua',
      nameRu: 'Menu.ua',
      description: 'Menu.ua — сервіс електронного меню з QR-кодом. Гості сканують код та бачать меню на телефоні. Можливість замовлення та оплати.',
      descriptionRu: 'Menu.ua — сервис электронного меню с QR-кодом. Гости сканируют код и видят меню на телефоне. Возможность заказа и оплаты.',
      shortDescription: 'Електронне меню з QR-кодом',
      shortDescriptionRu: 'Электронное меню с QR-кодом',
      website: 'https://menu.ua',
      priceFrom: 199,
      priceTo: 799,
      features: ['qr-menu', 'self-order', 'payment', 'analytics', 'multilang'],
      integrations: ['poster', 'iiko', 'liqpay'],
      averageRating: 4.5,
      reviewCount: 123,
    },
    {
      slug: 'easyqr',
      name: 'EasyQR',
      nameRu: 'EasyQR',
      description: 'EasyQR — просте та швидке створення QR-меню для ресторану. Безкоштовний тариф, красиві шаблони.',
      descriptionRu: 'EasyQR — простое и быстрое создание QR-меню для ресторана. Бесплатный тариф, красивые шаблоны.',
      shortDescription: 'Просте QR-меню для ресторану',
      shortDescriptionRu: 'Простое QR-меню для ресторана',
      website: 'https://easyqr.ua',
      priceFrom: 0,
      priceTo: 499,
      features: ['qr-menu', 'free-tier', 'templates', 'easy-setup'],
      averageRating: 4.2,
      reviewCount: 87,
    },
  ];

  // Aggregators
  const aggregators = [
    {
      slug: 'tripadvisor',
      name: 'TripAdvisor',
      nameRu: 'TripAdvisor',
      description: 'TripAdvisor — найбільший у світі сервіс відгуків про ресторани та готелі. Мільйони відгуків, рейтинги, бронювання столиків.',
      descriptionRu: 'TripAdvisor — крупнейший в мире сервис отзывов о ресторанах и отелях. Миллионы отзывов, рейтинги, бронирование столиков.',
      shortDescription: 'Відгуки та рейтинги ресторанів',
      shortDescriptionRu: 'Отзывы и рейтинги ресторанов',
      website: 'https://tripadvisor.com',
      features: ['reviews', 'ratings', 'booking', 'photos', 'awards'],
      averageRating: 4.0,
      reviewCount: 890,
    },
    {
      slug: 'google-maps',
      name: 'Google Maps для бізнесу',
      nameRu: 'Google Maps для бизнеса',
      description: 'Google Maps — обов\'язковий інструмент для ресторану. Відгуки, фото, години роботи, маршрути до закладу.',
      descriptionRu: 'Google Maps — обязательный инструмент для ресторана. Отзывы, фото, часы работы, маршруты к заведению.',
      shortDescription: 'Ваш заклад на Google Maps',
      shortDescriptionRu: 'Ваше заведение на Google Maps',
      website: 'https://business.google.com',
      features: ['reviews', 'photos', 'directions', 'insights', 'free'],
      averageRating: 4.6,
      reviewCount: 1234,
    },
    {
      slug: 'restoclub',
      name: 'RestoClub',
      nameRu: 'RestoClub',
      description: 'RestoClub — український каталог ресторанів. Відгуки, меню, бронювання, акції та знижки.',
      descriptionRu: 'RestoClub — украинский каталог ресторанов. Отзывы, меню, бронирование, акции и скидки.',
      shortDescription: 'Каталог ресторанів України',
      shortDescriptionRu: 'Каталог ресторанов Украины',
      website: 'https://restoclub.ua',
      features: ['reviews', 'booking', 'menu', 'promotions', 'ukrainian'],
      averageRating: 4.1,
      reviewCount: 345,
    },
  ];

  // Create all records
  for (const item of equipment) {
    await prisma.posSystem.upsert({
      where: { slug: item.slug },
      update: {},
      create: { ...item, status: EntityStatus.ACTIVE, categoryId: equipmentCat?.id },
    });
    console.log('Added equipment:', item.name);
  }

  for (const item of suppliers) {
    await prisma.posSystem.upsert({
      where: { slug: item.slug },
      update: {},
      create: { ...item, status: EntityStatus.ACTIVE, categoryId: suppliersCat?.id },
    });
    console.log('Added supplier:', item.name);
  }

  for (const item of deliveryServices) {
    await prisma.posSystem.upsert({
      where: { slug: item.slug },
      update: {},
      create: { ...item, status: EntityStatus.ACTIVE, categoryId: deliveryCat?.id },
    });
    console.log('Added delivery:', item.name);
  }

  for (const item of qrMenuServices) {
    await prisma.posSystem.upsert({
      where: { slug: item.slug },
      update: {},
      create: { ...item, status: EntityStatus.ACTIVE, categoryId: qrMenuCat?.id },
    });
    console.log('Added QR-menu:', item.name);
  }

  for (const item of aggregators) {
    await prisma.posSystem.upsert({
      where: { slug: item.slug },
      update: {},
      create: { ...item, status: EntityStatus.ACTIVE, categoryId: aggregatorsCat?.id },
    });
    console.log('Added aggregator:', item.name);
  }

  console.log('Done! All categories populated.');
}

seedAllCategories()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
