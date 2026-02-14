import { PrismaClient, EntityStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function seedQrAggregators() {
  console.log('Adding QR-menu aggregators...');

  const qrMenuCat = await prisma.category.findFirst({ where: { slug: 'qr-menu' } });

  // Create QR-menu aggregators subcategory
  const qrMenuAggregatorsCat = await prisma.category.upsert({
    where: { slug: 'qr-menu-aggregators' },
    update: {},
    create: {
      slug: 'qr-menu-aggregators',
      name: 'Агрегатори QR-меню',
      nameRu: 'Агрегаторы QR-меню',
      description: 'Платформи для порівняння та вибору QR-меню рішень',
      icon: 'globe',
      parentId: qrMenuCat?.id,
      order: 10,
    },
  });

  // QR-Menu Aggregators
  const qrMenuAggregators = [
    {
      slug: 'digital-menu-hub',
      name: 'Digital Menu Hub',
      nameRu: 'Digital Menu Hub',
      description: 'Платформа для порівняння всіх рішень цифрового меню. Огляди, ціни, функціонал.',
      descriptionRu: 'Платформа для сравнения всех решений цифрового меню. Обзоры, цены, функционал.',
      shortDescription: 'Порівняння цифрових меню рішень',
      website: 'https://digitalmenuhub.ua',
      features: ['comparison', 'reviews', 'pricing', 'features'],
      averageRating: 4.4,
      reviewCount: 123,
    },
    {
      slug: 'qr-tech-compare',
      name: 'QR Tech Compare',
      nameRu: 'QR Tech Compare',
      description: 'Порівняння технологій QR-меню. Детальний аналіз функціоналу, інтеграцій та цін.',
      descriptionRu: 'Сравнение технологий QR-меню. Детальный анализ функционала, интеграций и цен.',
      shortDescription: 'Технічне порівняння QR-меню',
      website: 'https://qrtechcompare.ua',
      features: ['technical-comparison', 'integrations', 'pricing', 'demo'],
      averageRating: 4.3,
      reviewCount: 87,
    },
  ];

  for (const item of qrMenuAggregators) {
    await prisma.posSystem.upsert({
      where: { slug: item.slug },
      update: {},
      create: { ...item, status: EntityStatus.ACTIVE, categoryId: qrMenuAggregatorsCat.id },
    });
    console.log('Added QR-menu aggregator:', item.name);
  }

  console.log('Done!');
}

seedQrAggregators()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
