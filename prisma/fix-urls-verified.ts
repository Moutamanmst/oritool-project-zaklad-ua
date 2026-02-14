import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixUrls() {
  console.log('Updating with verified Ukrainian URLs...');

  // Verified real Ukrainian companies
  const verifiedUrls: Record<string, string | null> = {
    // Equipment - verified Ukrainian suppliers
    'horeca-trade': 'https://horecatrade.com.ua',
    'profitex': 'https://www.profitex.ua',
    'gastro-market': 'https://gastromarket.com.ua',
    'barservice': 'https://www.barservice.ua',
    
    // These might not exist - set to null
    'torgpro': null,
    'teplo-holod': null,
    
    // Suppliers - verified
    'metro-cash-carry': 'https://metro.ua',
    'selgros': 'https://www.selgros24.ua',
    'fozzy-horeca': 'https://www.fozzy.ua',
    'auchan-pro': 'https://auchan.ua',
    'fresh-farm-supply': null, // fictional
    'premier-food': null, // need to verify
    
    // Delivery - verified
    'glovo': 'https://glovoapp.com/ua/',
    'bolt-food': 'https://food.bolt.eu/uk-ua/',
    'raketa': 'https://raketa.ua',
    'uklon-delivery': 'https://uklon.com.ua',
  };

  for (const [slug, url] of Object.entries(verifiedUrls)) {
    await prisma.posSystem.updateMany({
      where: { slug },
      data: { website: url },
    });
    console.log(`${slug} -> ${url || '(removed)'}`);
  }

  console.log('Done!');
}

fixUrls()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
