import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixUrls() {
  console.log('Updating URLs to real websites...');

  const realUrls: Record<string, string> = {
    // POS Systems
    'iiko': 'https://iiko.ua',
    'poster-pos': 'https://joinposter.com/ua',
    'r-keeper': 'https://r-keeper.ua',
    'goovii': 'https://goovii.app',
    
    // Delivery
    'glovo': 'https://glovoapp.com/ua/uk/kyiv/',
    'bolt-food': 'https://food.bolt.eu/uk-ua/',
    'raketa': 'https://raketa.app',
    'uklon-delivery': 'https://uklon.com.ua',
    
    // Suppliers
    'metro-cash-carry': 'https://metro.ua',
    'selgros': 'https://www.selgros.ua',
    'fozzy-horeca': 'https://fozzygroup.ua',
    'auchan-pro': 'https://auchan.ua',
    'fresh-farm-supply': 'https://freshmarket.ua',
    'premier-food': 'https://premierfood.com.ua',
    
    // Equipment (real brands)
    'rational-ukraine': 'https://www.rational-online.com/ua_ua/',
    'hoshizaki-ukraine': 'https://www.hoshizaki-europe.com',
    'electrolux-professional': 'https://www.electroluxprofessional.com/ua/',
    'blodgett-ovens': 'https://www.blodgett.com',
    'fagor-industrial': 'https://www.fagorindustrial.com',
    'bartscher': 'https://www.bartscher.com',
    
    // QR Menu
    'choice-qr': 'https://choice.menu',
    'menu-ua': 'https://menu.ua',
    'easyqr': 'https://easyqr.menu',
    
    // General aggregators  
    'restoclub': 'https://restoclub.ua',
    'google-maps-business': 'https://business.google.com',
    'tripadvisor': 'https://www.tripadvisor.com',
  };

  for (const [slug, url] of Object.entries(realUrls)) {
    const updated = await prisma.posSystem.updateMany({
      where: { slug },
      data: { website: url },
    });
    if (updated.count > 0) {
      console.log(`Updated ${slug} -> ${url}`);
    }
  }

  // Remove fake URLs from demo aggregators (set to null)
  const fakeAggregators = [
    'delivery-hero-analytics',
    'food-delivery-ukraine', 
    'horeca-delivery-monitor',
    'horeca-supply',
    'food-cost-ua',
    'supplier-rating',
    'agro-b2b',
    'horeca-equipment-ua',
    'kitchen-pro-market',
    'resto-tech-compare',
    'equipment-lease-ua',
    'digital-menu-hub',
    'qr-tech-compare',
  ];

  for (const slug of fakeAggregators) {
    await prisma.posSystem.updateMany({
      where: { slug },
      data: { website: null },
    });
  }
  console.log('Removed fake URLs from demo aggregators');

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
