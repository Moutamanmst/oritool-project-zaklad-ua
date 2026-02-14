import { PrismaClient, EntityStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMainServices() {
  console.log('Adding main services for each category...');

  // Get categories
  const deliveryCat = await prisma.category.findFirst({ where: { slug: 'delivery' } });
  const suppliersCat = await prisma.category.findFirst({ where: { slug: 'suppliers' } });
  const equipmentCat = await prisma.category.findFirst({ where: { slug: 'equipment' } });

  // Delivery Services
  const deliveryServices = [
    {
      slug: 'glovo-ukraine',
      name: 'Glovo',
      nameRu: 'Glovo',
      description: 'Сервіс доставки їжі з ресторанів. Широке охоплення по всій Україні, зручний мобільний додаток, швидка доставка.',
      descriptionRu: 'Сервис доставки еды из ресторанов. Широкое покрытие по всей Украине, удобное мобильное приложение, быстрая доставка.',
      shortDescription: 'Доставка їжі з ресторанів по всій Україні',
      website: 'https://glovoapp.com/ua',
      features: ['mobile-app', 'tracking', 'fast-delivery', 'wide-coverage'],
      averageRating: 4.2,
      reviewCount: 1245,
    },
    {
      slug: 'bolt-food-ukraine',
      name: 'Bolt Food',
      nameRu: 'Bolt Food',
      description: 'Швидка доставка їжі від Bolt. Конкурентні ціни для ресторанів, зручна інтеграція, низькі комісії.',
      descriptionRu: 'Быстрая доставка еды от Bolt. Конкурентные цены для ресторанов, удобная интеграция, низкие комиссии.',
      shortDescription: 'Доставка їжі з низькими комісіями',
      website: 'https://food.bolt.eu',
      features: ['low-commission', 'fast-delivery', 'integration', 'analytics'],
      averageRating: 4.4,
      reviewCount: 876,
    },
    {
      slug: 'raketa-delivery',
      name: 'Raketa',
      nameRu: 'Ракета',
      description: 'Український сервіс доставки їжі. Підтримка локальних ресторанів, гнучкі умови співпраці.',
      descriptionRu: 'Украинский сервис доставки еды. Поддержка локальных ресторанов, гибкие условия сотрудничества.',
      shortDescription: 'Український сервіс доставки',
      website: 'https://raketa.app',
      features: ['local-support', 'flexible-terms', 'ukrainian-owned', 'mobile-app'],
      averageRating: 4.3,
      reviewCount: 654,
    },
    {
      slug: 'uklon-delivery',
      name: 'Uklon Їжа',
      nameRu: 'Uklon Еда',
      description: 'Доставка їжі від Uklon. Інтеграція з таксі-сервісом, велика мережа кур`єрів.',
      descriptionRu: 'Доставка еды от Uklon. Интеграция с такси-сервисом, большая сеть курьеров.',
      shortDescription: 'Доставка від Uklon з великою мережею кур`єрів',
      website: 'https://uklon.com.ua',
      features: ['taxi-integration', 'large-network', 'tracking', 'mobile-app'],
      averageRating: 4.1,
      reviewCount: 432,
    },
  ];

  // Suppliers
  const suppliers = [
    {
      slug: 'metro-cash-carry',
      name: 'METRO Cash & Carry',
      nameRu: 'METRO Cash & Carry',
      description: 'Найбільший оптовий постачальник для HoReCa в Україні. Широкий асортимент продуктів, обладнання та витратних матеріалів.',
      descriptionRu: 'Крупнейший оптовый поставщик для HoReCa в Украине. Широкий ассортимент продуктов, оборудования и расходных материалов.',
      shortDescription: 'Оптовий постачальник №1 для HoReCa',
      website: 'https://metro.ua',
      features: ['wholesale', 'wide-assortment', 'delivery', 'horeca-card'],
      averageRating: 4.5,
      reviewCount: 2345,
    },
    {
      slug: 'selgros-ukraine',
      name: 'Selgros',
      nameRu: 'Selgros',
      description: 'Оптовий центр з великим вибором продуктів для ресторанів. Свіжі продукти, конкурентні ціни.',
      descriptionRu: 'Оптовый центр с большим выбором продуктов для ресторанов. Свежие продукты, конкурентные цены.',
      shortDescription: 'Оптовий центр для ресторанів',
      website: 'https://selgros.ua',
      features: ['wholesale', 'fresh-products', 'competitive-prices', 'delivery'],
      averageRating: 4.3,
      reviewCount: 876,
    },
    {
      slug: 'fozzy-horeca',
      name: 'Fozzy HoReCa',
      nameRu: 'Fozzy HoReCa',
      description: 'Спеціальний напрямок Fozzy для ресторанного бізнесу. Оптові ціни, доставка, кредитування.',
      descriptionRu: 'Специальное направление Fozzy для ресторанного бизнеса. Оптовые цены, доставка, кредитование.',
      shortDescription: 'HoReCa напрямок від Fozzy Group',
      website: 'https://fozzy.ua',
      features: ['wholesale', 'delivery', 'credit', 'wide-network'],
      averageRating: 4.2,
      reviewCount: 567,
    },
    {
      slug: 'auchan-pro',
      name: 'Auchan Professional',
      nameRu: 'Auchan Professional',
      description: 'Професійне постачання від Auchan. Великі обсяги, стабільна якість, регулярні поставки.',
      descriptionRu: 'Профессиональное снабжение от Auchan. Большие объемы, стабильное качество, регулярные поставки.',
      shortDescription: 'Професійне постачання від Auchan',
      website: 'https://auchan.ua',
      features: ['bulk-orders', 'stable-quality', 'regular-delivery', 'wide-assortment'],
      averageRating: 4.1,
      reviewCount: 345,
    },
    {
      slug: 'fresh-farm-supply',
      name: 'Fresh Farm',
      nameRu: 'Fresh Farm',
      description: 'Постачальник свіжих фермерських продуктів напряму від виробників. Органічні овочі, м`ясо, молочні продукти.',
      descriptionRu: 'Поставщик свежих фермерских продуктов напрямую от производителей. Органические овощи, мясо, молочные продукты.',
      shortDescription: 'Фермерські продукти напряму',
      website: 'https://freshfarm.ua',
      features: ['organic', 'direct-from-farm', 'fresh', 'delivery'],
      averageRating: 4.6,
      reviewCount: 234,
    },
  ];

  // Equipment
  const equipment = [
    {
      slug: 'rational-ukraine',
      name: 'RATIONAL',
      nameRu: 'RATIONAL',
      description: 'Німецький виробник професійного теплового обладнання. Пароконвектомати преміум-класу для ресторанів.',
      descriptionRu: 'Немецкий производитель профессионального теплового оборудования. Пароконвектоматы премиум-класса для ресторанов.',
      shortDescription: 'Преміум пароконвектомати з Німеччини',
      website: 'https://rational-online.com',
      features: ['german-quality', 'premium', 'combi-ovens', 'warranty'],
      averageRating: 4.8,
      reviewCount: 567,
    },
    {
      slug: 'hoshizaki-ukraine',
      name: 'Hoshizaki',
      nameRu: 'Hoshizaki',
      description: 'Японський виробник холодильного обладнання та льодогенераторів. Преміум якість, довговічність.',
      descriptionRu: 'Японский производитель холодильного оборудования и льдогенераторов. Премиум качество, долговечность.',
      shortDescription: 'Японське холодильне обладнання преміум-класу',
      website: 'https://hoshizaki.com',
      features: ['japanese-quality', 'ice-makers', 'refrigeration', 'durability'],
      averageRating: 4.7,
      reviewCount: 345,
    },
    {
      slug: 'electrolux-professional',
      name: 'Electrolux Professional',
      nameRu: 'Electrolux Professional',
      description: 'Професійне обладнання для кухні та пральні. Широкий асортимент для будь-яких потреб HoReCa.',
      descriptionRu: 'Профессиональное оборудование для кухни и прачечной. Широкий ассортимент для любых потребностей HoReCa.',
      shortDescription: 'Повний спектр професійного обладнання',
      website: 'https://professional.electrolux.ua',
      features: ['wide-range', 'kitchen', 'laundry', 'warranty'],
      averageRating: 4.5,
      reviewCount: 456,
    },
    {
      slug: 'blodgett-ovens',
      name: 'Blodgett',
      nameRu: 'Blodgett',
      description: 'Американський виробник конвекційних та подових печей. Ідеально для піцерій та пекарень.',
      descriptionRu: 'Американский производитель конвекционных и подовых печей. Идеально для пиццерий и пекарен.',
      shortDescription: 'Печі для піцерій та пекарень',
      website: 'https://blodgett.com',
      features: ['pizza-ovens', 'deck-ovens', 'american-quality', 'bakery'],
      averageRating: 4.6,
      reviewCount: 234,
    },
    {
      slug: 'fagor-industrial',
      name: 'Fagor Industrial',
      nameRu: 'Fagor Industrial',
      description: 'Іспанський виробник кухонного обладнання. Відмінне співвідношення ціни та якості.',
      descriptionRu: 'Испанский производитель кухонного оборудования. Отличное соотношение цены и качества.',
      shortDescription: 'Якісне обладнання за розумною ціною',
      website: 'https://fagorindustrial.com',
      features: ['value-for-money', 'spanish-quality', 'wide-range', 'warranty'],
      averageRating: 4.3,
      reviewCount: 345,
    },
    {
      slug: 'bartscher',
      name: 'Bartscher',
      nameRu: 'Bartscher',
      description: 'Німецький виробник обладнання для барів та ресторанів. Від кавомашин до фритюрниць.',
      descriptionRu: 'Немецкий производитель оборудования для баров и ресторанов. От кофемашин до фритюрниц.',
      shortDescription: 'Обладнання для барів та ресторанів',
      website: 'https://bartscher.de',
      features: ['bar-equipment', 'coffee-machines', 'german-quality', 'affordable'],
      averageRating: 4.4,
      reviewCount: 289,
    },
  ];

  // Create all services
  for (const item of deliveryServices) {
    await prisma.posSystem.upsert({
      where: { slug: item.slug },
      update: {},
      create: { ...item, status: EntityStatus.ACTIVE, categoryId: deliveryCat?.id },
    });
    console.log('Added delivery service:', item.name);
  }

  for (const item of suppliers) {
    await prisma.posSystem.upsert({
      where: { slug: item.slug },
      update: {},
      create: { ...item, status: EntityStatus.ACTIVE, categoryId: suppliersCat?.id },
    });
    console.log('Added supplier:', item.name);
  }

  for (const item of equipment) {
    await prisma.posSystem.upsert({
      where: { slug: item.slug },
      update: {},
      create: { ...item, status: EntityStatus.ACTIVE, categoryId: equipmentCat?.id },
    });
    console.log('Added equipment:', item.name);
  }

  console.log('Done! All main services added.');
}

seedMainServices()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
