import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupDuplicates() {
  console.log('Cleaning up duplicate entries...');

  // Get all POS systems grouped by name
  const allItems = await prisma.posSystem.findMany({
    orderBy: { createdAt: 'asc' },
  });

  const seen = new Map<string, string>();
  const toDelete: string[] = [];

  for (const item of allItems) {
    const key = item.name.toLowerCase();
    if (seen.has(key)) {
      toDelete.push(item.id);
      console.log(`Duplicate found: ${item.name} (${item.slug})`);
    } else {
      seen.set(key, item.id);
    }
  }

  if (toDelete.length > 0) {
    await prisma.posSystem.deleteMany({
      where: { id: { in: toDelete } },
    });
    console.log(`Deleted ${toDelete.length} duplicates`);
  } else {
    console.log('No duplicates found');
  }

  // Also clean up establishments
  const allEstablishments = await prisma.establishment.findMany({
    orderBy: { createdAt: 'asc' },
  });

  const seenEst = new Map<string, string>();
  const toDeleteEst: string[] = [];

  for (const item of allEstablishments) {
    const key = item.slug;
    if (seenEst.has(key)) {
      toDeleteEst.push(item.id);
      console.log(`Duplicate establishment found: ${item.slug}`);
    } else {
      seenEst.set(key, item.id);
    }
  }

  if (toDeleteEst.length > 0) {
    await prisma.establishment.deleteMany({
      where: { id: { in: toDeleteEst } },
    });
    console.log(`Deleted ${toDeleteEst.length} duplicate establishments`);
  }

  console.log('Cleanup complete!');
}

cleanupDuplicates()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
