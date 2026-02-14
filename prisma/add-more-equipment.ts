import { PrismaClient, EntityStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function addMoreEquipment() {
  console.log('Adding more equipment suppliers...');

  const equipmentCat = await prisma.category.findFirst({ where: { slug: 'equipment' } });

  const moreEquipment = [
    {
      slug: 'frosty',
      name: 'Frosty',
      nameRu: 'Frosty',
      description: 'Італійський бренд професійного кухонного обладнання. Електромеханічне, теплове та холодильне обладнання високої якості.',
      descriptionRu: 'Итальянский бренд профессионального кухонного оборудования. Электромеханическое, тепловое и холодильное оборудование.',
      shortDescription: 'Італійське професійне обладнання',
      website: 'https://frosty.com.ua',
      features: ['italian-brand', 'refrigeration', 'thermal', 'electromechanical'],
      averageRating: 4.7,
      reviewCount: 312,
    },
    {
      slug: 'orest',
      name: 'Orest',
      nameRu: 'Orest',
      description: 'Український виробник професійного кухонного обладнання. Теплове обладнання, нержавіючі меблі, лінії роздачі.',
      descriptionRu: 'Украинский производитель профессионального кухонного оборудования. Тепловое оборудование, мебель из нержавейки.',
      shortDescription: 'Український виробник обладнання',
      website: 'https://orest.ua',
      features: ['ukrainian-made', 'thermal', 'stainless-furniture', 'serving-lines'],
      averageRating: 4.5,
      reviewCount: 189,
    },
    {
      slug: 'primus-shop',
      name: 'PRIMUS-SHOP',
      nameRu: 'PRIMUS-SHOP',
      description: 'Інтернет-магазин професійного обладнання. Офіційний дистриб\'ютор Frosty та інших брендів в Україні.',
      descriptionRu: 'Интернет-магазин профессионального оборудования. Официальный дистрибьютор Frosty и других брендов.',
      shortDescription: 'Офіційний дистриб\'ютор Frosty',
      website: 'https://primus-shop.com.ua',
      features: ['official-dealer', 'frosty', 'delivery', 'warranty'],
      averageRating: 4.6,
      reviewCount: 234,
    },
  ];

  for (const item of moreEquipment) {
    await prisma.posSystem.upsert({
      where: { slug: item.slug },
      update: item,
      create: { ...item, status: EntityStatus.ACTIVE, categoryId: equipmentCat?.id },
    });
    console.log(`✓ ${item.name} -> ${item.website}`);
  }

  console.log('\nDone!');
}

addMoreEquipment()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
