import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupProducts() {
  console.log('Removing specific product models...');

  const productSlugs = [
    'rational-combi-oven',
    'hoshizaki-ice-maker', 
    'fagor-dishwasher',
  ];

  for (const slug of productSlugs) {
    const item = await prisma.posSystem.findFirst({ where: { slug } });
    if (item) {
      await prisma.posSystem.delete({ where: { id: item.id } });
      console.log(`Deleted: ${item.name}`);
    }
  }

  console.log('Done!');
}

cleanupProducts()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
