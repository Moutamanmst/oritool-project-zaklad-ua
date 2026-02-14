import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupProducts() {
  console.log('Removing specific product models (keeping only brands)...');

  // These are specific product models, not brands
  const productSlugs = [
    'rational-icombi-pro',
    'hoshizaki-im-240ane', 
    'fagor-co-502-dd',
  ];

  for (const slug of productSlugs) {
    const item = await prisma.posSystem.findFirst({ where: { slug } });
    if (item) {
      await prisma.posSystem.delete({ where: { id: item.id } });
      console.log(`Deleted product: ${item.name}`);
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
