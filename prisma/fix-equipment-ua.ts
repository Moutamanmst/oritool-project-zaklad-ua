import { PrismaClient, EntityStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function fixEquipment() {
  console.log('Replacing international brands with Ukrainian equipment suppliers...');

  // Delete international brands
  await prisma.posSystem.deleteMany({
    where: {
      slug: {
        in: [
          'rational-ukraine',
          'hoshizaki-ukraine',
          'electrolux-professional',
          'blodgett-ovens',
          'fagor-industrial',
          'bartscher',
        ],
      },
    },
  });
  console.log('Deleted international brands');

  const equipmentCat = await prisma.category.findFirst({ where: { slug: 'equipment' } });

  // Add real Ukrainian equipment suppliers
  const ukrainianEquipment = [
    {
      slug: 'horeca-trade',
      name: 'HoReCa Trade',
      nameRu: 'HoReCa Trade',
      description: 'Офіційний дистриб\'ютор професійного обладнання в Україні. RATIONAL, Electrolux, Hoshizaki та інші бренди. Сервісне обслуговування по всій Україні.',
      descriptionRu: 'Официальный дистрибьютор профессионального оборудования в Украине. RATIONAL, Electrolux, Hoshizaki и другие бренды. Сервисное обслуживание по всей Украине.',
      shortDescription: 'Офіційний дистриб\'ютор професійного обладнання',
      website: 'https://horecatrade.com.ua',
      features: ['official-dealer', 'service', 'warranty', 'consultation'],
      averageRating: 4.7,
      reviewCount: 234,
    },
    {
      slug: 'profitex',
      name: 'Profitex',
      nameRu: 'Profitex',
      description: 'Професійне обладнання для ресторанів та кафе. Великий шоурум у Києві. Теплове, холодильне, нейтральне обладнання.',
      descriptionRu: 'Профессиональное оборудование для ресторанов и кафе. Большой шоурум в Киеве. Тепловое, холодильное, нейтральное оборудование.',
      shortDescription: 'Професійне обладнання з шоурумом у Києві',
      website: 'https://profitex.ua',
      features: ['showroom', 'delivery', 'installation', 'wide-range'],
      averageRating: 4.5,
      reviewCount: 567,
    },
    {
      slug: 'torgpro',
      name: 'ТоргПро',
      nameRu: 'ТоргПро',
      description: 'Торгове та ресторанне обладнання. Холодильні вітрини, печі, плити, посудомийні машини. Доставка по Україні.',
      descriptionRu: 'Торговое и ресторанное оборудование. Холодильные витрины, печи, плиты, посудомоечные машины. Доставка по Украине.',
      shortDescription: 'Торгове та ресторанне обладнання',
      website: 'https://torgpro.com.ua',
      features: ['delivery', 'installation', 'credit', 'wide-range'],
      averageRating: 4.3,
      reviewCount: 345,
    },
    {
      slug: 'gastro-market',
      name: 'Gastro Market',
      nameRu: 'Gastro Market',
      description: 'Інтернет-магазин професійного обладнання для HoReCa. Понад 10 000 товарів. Швидка доставка, гарантія.',
      descriptionRu: 'Интернет-магазин профессионального оборудования для HoReCa. Более 10 000 товаров. Быстрая доставка, гарантия.',
      shortDescription: 'Інтернет-магазин обладнання для HoReCa',
      website: 'https://gastromarket.ua',
      features: ['online-store', 'fast-delivery', 'warranty', '10000-products'],
      averageRating: 4.4,
      reviewCount: 456,
    },
    {
      slug: 'barservice',
      name: 'Barservice',
      nameRu: 'Barservice',
      description: 'Професійне барне обладнання. Кавомашини, блендери, льодогенератори, посуд для барів. Навчання бариста.',
      descriptionRu: 'Профессиональное барное оборудование. Кофемашины, блендеры, льдогенераторы, посуда для баров. Обучение бариста.',
      shortDescription: 'Барне обладнання та кавомашини',
      website: 'https://barservice.ua',
      features: ['bar-equipment', 'coffee-machines', 'training', 'service'],
      averageRating: 4.6,
      reviewCount: 289,
    },
    {
      slug: 'teplo-holod',
      name: 'Тепло-Холод',
      nameRu: 'Тепло-Холод',
      description: 'Холодильне та теплове обладнання для ресторанів. Монтаж холодильних камер. Сервіс по всій Україні.',
      descriptionRu: 'Холодильное и тепловое оборудование для ресторанов. Монтаж холодильных камер. Сервис по всей Украине.',
      shortDescription: 'Холодильне та теплове обладнання',
      website: 'https://teplo-holod.ua',
      features: ['refrigeration', 'installation', 'service', 'cold-rooms'],
      averageRating: 4.5,
      reviewCount: 178,
    },
  ];

  for (const item of ukrainianEquipment) {
    await prisma.posSystem.upsert({
      where: { slug: item.slug },
      update: item,
      create: { ...item, status: EntityStatus.ACTIVE, categoryId: equipmentCat?.id },
    });
    console.log(`Added: ${item.name}`);
  }

  console.log('Done! Ukrainian equipment suppliers added.');
}

fixEquipment()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
