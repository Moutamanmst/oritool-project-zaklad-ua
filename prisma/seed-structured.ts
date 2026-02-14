import { PrismaClient, EntityStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function seedStructured() {
  console.log('Creating structured categories with aggregators...');

  // Create subcategories
  const deliveryCat = await prisma.category.findFirst({ where: { slug: 'delivery' } });
  const suppliersCat = await prisma.category.findFirst({ where: { slug: 'suppliers' } });
  const equipmentCat = await prisma.category.findFirst({ where: { slug: 'equipment' } });

  // Create aggregator subcategories
  const deliveryAggregatorsCat = await prisma.category.upsert({
    where: { slug: 'delivery-aggregators' },
    update: {},
    create: {
      slug: 'delivery-aggregators',
      name: 'Агрегатори доставки',
      nameRu: 'Агрегаторы доставки',
      description: 'Платформи для порівняння та вибору сервісів доставки',
      icon: 'globe',
      parentId: deliveryCat?.id,
      order: 10,
    },
  });

  const suppliersAggregatorsCat = await prisma.category.upsert({
    where: { slug: 'suppliers-aggregators' },
    update: {},
    create: {
      slug: 'suppliers-aggregators',
      name: 'Агрегатори постачальників',
      nameRu: 'Агрегаторы поставщиков',
      description: 'Платформи для пошуку та порівняння постачальників',
      icon: 'globe',
      parentId: suppliersCat?.id,
      order: 10,
    },
  });

  const equipmentAggregatorsCat = await prisma.category.upsert({
    where: { slug: 'equipment-aggregators' },
    update: {},
    create: {
      slug: 'equipment-aggregators',
      name: 'Агрегатори обладнання',
      nameRu: 'Агрегаторы оборудования',
      description: 'Платформи для пошуку та порівняння обладнання',
      icon: 'globe',
      parentId: equipmentCat?.id,
      order: 10,
    },
  });

  console.log('Created aggregator subcategories');

  // Delivery Aggregators
  const deliveryAggregators = [
    {
      slug: 'delivery-hero-analytics',
      name: 'Delivery Analytics Hub',
      nameRu: 'Delivery Analytics Hub',
      description: 'Платформа для аналітики та порівняння сервісів доставки. Порівнюйте комісії, швидкість доставки, охоплення територій різних агрегаторів.',
      descriptionRu: 'Платформа для аналитики и сравнения сервисов доставки. Сравнивайте комиссии, скорость доставки, охват территорий разных агрегаторов.',
      shortDescription: 'Аналітика та порівняння сервісів доставки',
      website: 'https://delivery-analytics.ua',
      features: ['comparison', 'analytics', 'commission-calculator', 'coverage-map'],
      averageRating: 4.3,
      reviewCount: 45,
    },
    {
      slug: 'food-delivery-ukraine',
      name: 'Food Delivery Ukraine',
      nameRu: 'Food Delivery Ukraine',
      description: 'Каталог всіх сервісів доставки їжі в Україні. Відгуки рестораторів, порівняння умов співпраці, актуальні комісії.',
      descriptionRu: 'Каталог всех сервисов доставки еды в Украине. Отзывы рестораторов, сравнение условий сотрудничества, актуальные комиссии.',
      shortDescription: 'Каталог сервісів доставки України',
      website: 'https://fooddelivery.ua',
      features: ['catalog', 'reviews', 'comparison', 'news'],
      averageRating: 4.1,
      reviewCount: 67,
    },
    {
      slug: 'horeca-delivery-monitor',
      name: 'HoReCa Delivery Monitor',
      nameRu: 'HoReCa Delivery Monitor',
      description: 'Моніторинг ринку доставки для ресторанного бізнесу. Статистика, тренди, рейтинги агрегаторів.',
      descriptionRu: 'Мониторинг рынка доставки для ресторанного бизнеса. Статистика, тренды, рейтинги агрегаторов.',
      shortDescription: 'Моніторинг ринку доставки',
      website: 'https://horeca-monitor.ua',
      features: ['monitoring', 'statistics', 'trends', 'ratings'],
      averageRating: 4.5,
      reviewCount: 34,
    },
  ];

  // Suppliers Aggregators
  const suppliersAggregators = [
    {
      slug: 'horeca-supply',
      name: 'HoReCa Supply',
      nameRu: 'HoReCa Supply',
      description: 'Найбільший B2B маркетплейс для ресторанного бізнесу. Тисячі постачальників, порівняння цін, онлайн-замовлення.',
      descriptionRu: 'Крупнейший B2B маркетплейс для ресторанного бизнеса. Тысячи поставщиков, сравнение цен, онлайн-заказы.',
      shortDescription: 'B2B маркетплейс для HoReCa',
      website: 'https://horecasupply.ua',
      features: ['marketplace', 'price-comparison', 'online-orders', 'verified-suppliers'],
      averageRating: 4.6,
      reviewCount: 234,
    },
    {
      slug: 'food-cost-ua',
      name: 'FoodCost.ua',
      nameRu: 'FoodCost.ua',
      description: 'Платформа для оптимізації закупівель. Порівняння цін від різних постачальників, аналітика витрат, автоматизація замовлень.',
      descriptionRu: 'Платформа для оптимизации закупок. Сравнение цен от разных поставщиков, аналитика затрат, автоматизация заказов.',
      shortDescription: 'Оптимізація закупівель для ресторанів',
      website: 'https://foodcost.ua',
      features: ['price-comparison', 'cost-analytics', 'automation', 'reports'],
      averageRating: 4.4,
      reviewCount: 156,
    },
    {
      slug: 'supplier-rating',
      name: 'Supplier Rating',
      nameRu: 'Supplier Rating',
      description: 'Рейтинг та відгуки про постачальників для HoReCa. Перевірені відгуки від рестораторів, рейтинги надійності.',
      descriptionRu: 'Рейтинг и отзывы о поставщиках для HoReCa. Проверенные отзывы от рестораторов, рейтинги надежности.',
      shortDescription: 'Рейтинг постачальників HoReCa',
      website: 'https://supplier-rating.ua',
      features: ['ratings', 'reviews', 'verification', 'categories'],
      averageRating: 4.2,
      reviewCount: 189,
    },
    {
      slug: 'agro-b2b',
      name: 'Agro B2B',
      nameRu: 'Agro B2B',
      description: 'Платформа для прямих закупівель від фермерів та виробників. Свіжі продукти без посередників.',
      descriptionRu: 'Платформа для прямых закупок от фермеров и производителей. Свежие продукты без посредников.',
      shortDescription: 'Прямі закупівлі від виробників',
      website: 'https://agrob2b.ua',
      features: ['direct-buy', 'farmers', 'fresh-products', 'delivery'],
      averageRating: 4.3,
      reviewCount: 98,
    },
  ];

  // Equipment Aggregators
  const equipmentAggregators = [
    {
      slug: 'horeca-equipment-ua',
      name: 'HoReCa Equipment UA',
      nameRu: 'HoReCa Equipment UA',
      description: 'Найбільший каталог професійного обладнання для ресторанів. Порівняння цін, характеристик, відгуки користувачів.',
      descriptionRu: 'Крупнейший каталог профессионального оборудования для ресторанов. Сравнение цен, характеристик, отзывы пользователей.',
      shortDescription: 'Каталог ресторанного обладнання',
      website: 'https://horeca-equipment.ua',
      features: ['catalog', 'price-comparison', 'specifications', 'reviews'],
      averageRating: 4.5,
      reviewCount: 312,
    },
    {
      slug: 'kitchen-pro-market',
      name: 'Kitchen Pro Market',
      nameRu: 'Kitchen Pro Market',
      description: 'Маркетплейс професійного кухонного обладнання. Нове та б/у обладнання, лізинг, сервісне обслуговування.',
      descriptionRu: 'Маркетплейс профессионального кухонного оборудования. Новое и б/у оборудование, лизинг, сервисное обслуживание.',
      shortDescription: 'Маркетплейс кухонного обладнання',
      website: 'https://kitchenpro.ua',
      features: ['marketplace', 'new-used', 'leasing', 'service'],
      averageRating: 4.4,
      reviewCount: 178,
    },
    {
      slug: 'resto-tech-compare',
      name: 'RestoTech Compare',
      nameRu: 'RestoTech Compare',
      description: 'Сервіс порівняння ресторанного обладнання. Детальні характеристики, тести, рекомендації експертів.',
      descriptionRu: 'Сервис сравнения ресторанного оборудования. Детальные характеристики, тесты, рекомендации экспертов.',
      shortDescription: 'Порівняння ресторанного обладнання',
      website: 'https://restotech.ua',
      features: ['comparison', 'tests', 'expert-reviews', 'specifications'],
      averageRating: 4.6,
      reviewCount: 89,
    },
    {
      slug: 'equipment-lease-ua',
      name: 'Equipment Lease UA',
      nameRu: 'Equipment Lease UA',
      description: 'Платформа для лізингу та оренди ресторанного обладнання. Порівняння умов від різних компаній.',
      descriptionRu: 'Платформа для лизинга и аренды ресторанного оборудования. Сравнение условий от разных компаний.',
      shortDescription: 'Лізинг ресторанного обладнання',
      website: 'https://equipment-lease.ua',
      features: ['leasing', 'rental', 'comparison', 'calculator'],
      averageRating: 4.2,
      reviewCount: 67,
    },
  ];

  // Create all aggregators
  for (const item of deliveryAggregators) {
    await prisma.posSystem.upsert({
      where: { slug: item.slug },
      update: {},
      create: { ...item, status: EntityStatus.ACTIVE, categoryId: deliveryAggregatorsCat.id },
    });
    console.log('Added delivery aggregator:', item.name);
  }

  for (const item of suppliersAggregators) {
    await prisma.posSystem.upsert({
      where: { slug: item.slug },
      update: {},
      create: { ...item, status: EntityStatus.ACTIVE, categoryId: suppliersAggregatorsCat.id },
    });
    console.log('Added suppliers aggregator:', item.name);
  }

  for (const item of equipmentAggregators) {
    await prisma.posSystem.upsert({
      where: { slug: item.slug },
      update: {},
      create: { ...item, status: EntityStatus.ACTIVE, categoryId: equipmentAggregatorsCat.id },
    });
    console.log('Added equipment aggregator:', item.name);
  }

  console.log('Done! All aggregators added.');
}

seedStructured()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
