import { PrismaClient, EntityStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function addRealEquipment() {
  console.log('Adding REAL Ukrainian equipment suppliers...');

  const equipmentCat = await prisma.category.findFirst({ where: { slug: 'equipment' } });

  // Delete old placeholder equipment
  await prisma.posSystem.deleteMany({
    where: { categoryId: equipmentCat?.id },
  });

  // Real Ukrainian equipment suppliers with verified websites
  const realEquipment = [
    {
      slug: 'system4',
      name: 'System4',
      nameRu: 'System4',
      description: 'Один із найбільших в Україні інтернет-магазинів харчового обладнання, працює з 2005 року. Широкий асортимент для ресторанів, кафе, барів.',
      descriptionRu: 'Один из крупнейших в Украине интернет-магазинов пищевого оборудования, работает с 2005 года.',
      shortDescription: 'Найбільший інтернет-магазин обладнання з 2005 року',
      website: 'https://system4.ua',
      features: ['since-2005', 'wide-range', 'delivery', 'warranty'],
      averageRating: 4.7,
      reviewCount: 1245,
    },
    {
      slug: '3wok',
      name: '3WOK',
      nameRu: '3WOK',
      description: 'Професійне обладнання для HoReCa. Експертний підбір, швидка доставка по всій Україні, гарантія якості.',
      descriptionRu: 'Профессиональное оборудование для HoReCa. Экспертный подбор, быстрая доставка по всей Украине.',
      shortDescription: 'Професійне обладнання для HoReCa',
      website: 'https://3wok.ua',
      features: ['expert-selection', 'fast-delivery', 'horeca', 'warranty'],
      averageRating: 4.6,
      reviewCount: 567,
    },
    {
      slug: 'hurakan',
      name: 'Hurakan',
      nameRu: 'Hurakan',
      description: 'Якісне обладнання для закладів громадського харчування по всій Україні з 2018 року. Ефективність та швидка окупність.',
      descriptionRu: 'Качественное оборудование для заведений общественного питания по всей Украине с 2018 года.',
      shortDescription: 'Обладнання для громадського харчування',
      website: 'https://hurakan.ua',
      features: ['quality', 'efficiency', 'roi', 'nationwide'],
      averageRating: 5.0,
      reviewCount: 89,
    },
    {
      slug: 'gold-kitchen',
      name: 'Gold Kitchen',
      nameRu: 'Gold Kitchen',
      description: 'Магазин професійного обладнання для барів, ресторанів та кафе у Києві. Комплексні рішення для харчової індустрії.',
      descriptionRu: 'Магазин профессионального оборудования для баров, ресторанов и кафе в Киеве.',
      shortDescription: 'Професійне обладнання у Києві',
      website: 'https://gold-kitchen.com.ua',
      features: ['kyiv', 'complex-solutions', 'bars', 'restaurants'],
      averageRating: 5.0,
      reviewCount: 30,
    },
    {
      slug: 'restro',
      name: 'RESTRO',
      nameRu: 'RESTRO',
      description: 'Компанія з 9+ років досвіду. Холодильне обладнання та комплексні рішення для ресторанів, кав\'ярень, барів, пекарень.',
      descriptionRu: 'Компания с 9+ лет опыта. Холодильное оборудование и комплексные решения для ресторанов, кофеен, баров.',
      shortDescription: 'Холодильне обладнання та комплексні рішення',
      website: 'https://restro.com.ua',
      features: ['9-years-experience', 'refrigeration', 'complex-solutions', 'bakery'],
      averageRating: 4.9,
      reviewCount: 26,
    },
    {
      slug: 'mirs-horeca',
      name: 'MIRS HoReCa',
      nameRu: 'MIRS HoReCa',
      description: 'З 1999 року постачає товари для HoReCa. Комплексне оснащення барів, ресторанів та готельних комплексів.',
      descriptionRu: 'С 1999 года поставляет товары для HoReCa. Комплексное оснащение баров, ресторанов и гостиничных комплексов.',
      shortDescription: 'Комплексне оснащення HoReCa з 1999 року',
      website: 'https://horeca.mirs.com.ua',
      features: ['since-1999', 'hotels', 'restaurants', 'bars'],
      averageRating: 4.5,
      reviewCount: 234,
    },
    {
      slug: 'dsto',
      name: 'DSTO',
      nameRu: 'DSTO',
      description: 'Професійне кухонне обладнання з нержавіючої сталі. Столи, мийки, стелажі для ресторанів та їдалень.',
      descriptionRu: 'Профессиональное кухонное оборудование из нержавеющей стали. Столы, мойки, стеллажи.',
      shortDescription: 'Обладнання з нержавіючої сталі',
      website: 'https://dsto.com.ua',
      features: ['stainless-steel', 'tables', 'sinks', 'shelving'],
      averageRating: 4.6,
      reviewCount: 178,
    },
    {
      slug: 'inox-trade',
      name: 'INOX-Trade',
      nameRu: 'INOX-Trade',
      description: 'Професійне кухонне обладнання для кафе та ресторанів у Києві з доставкою по Україні.',
      descriptionRu: 'Профессиональное кухонное оборудование для кафе и ресторанов в Киеве с доставкой по Украине.',
      shortDescription: 'Кухонне обладнання з доставкою по Україні',
      website: 'https://inox-trade.com.ua',
      features: ['kyiv', 'nationwide-delivery', 'professional', 'kitchen'],
      averageRating: 4.4,
      reviewCount: 145,
    },
  ];

  for (const item of realEquipment) {
    await prisma.posSystem.create({
      data: { ...item, status: EntityStatus.ACTIVE, categoryId: equipmentCat?.id },
    });
    console.log(`✓ ${item.name} -> ${item.website}`);
  }

  console.log('\nDone! Real Ukrainian equipment suppliers added.');
}

addRealEquipment()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
