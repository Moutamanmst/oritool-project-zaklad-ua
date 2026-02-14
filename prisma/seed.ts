import { PrismaClient, UserRole, BusinessType, EntityStatus, ReviewStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('admin123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@zaklad.ua' },
    update: {},
    create: {
      email: 'admin@zaklad.ua',
      password: adminPassword,
      role: UserRole.ADMIN,
      isVerified: true,
      isActive: true,
      profile: {
        create: {
          firstName: 'Admin',
          lastName: 'Zaklad.ua',
        },
      },
    },
  });
  console.log('Created admin:', admin.email);

  const userPassword = await bcrypt.hash('user123456', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      role: UserRole.USER,
      isVerified: true,
      isActive: true,
      profile: {
        create: {
          firstName: 'Іван',
          lastName: 'Петренко',
          city: 'Київ',
        },
      },
    },
  });
  console.log('Created user:', user.email);

  const businessPassword = await bcrypt.hash('business123456', 12);
  const businessUser = await prisma.user.upsert({
    where: { email: 'business@example.com' },
    update: {},
    create: {
      email: 'business@example.com',
      password: businessPassword,
      role: UserRole.BUSINESS,
      isVerified: true,
      isActive: true,
      profile: {
        create: {
          firstName: 'Олександр',
          lastName: 'Коваленко',
          phone: '+380501234567',
        },
      },
      businessProfile: {
        create: {
          companyName: 'Ресторанна група "Смак"',
          companyNameRu: 'Ресторанная группа "Вкус"',
          description: 'Мережа ресторанів української кухні',
          descriptionRu: 'Сеть ресторанов украинской кухни',
          website: 'https://smak-restaurants.ua',
          phone: '+380441234567',
          email: 'business@example.com',
          isVerified: true,
          verifiedAt: new Date(),
        },
      },
    },
  });
  console.log('Created business user:', businessUser.email);

  const cities = await Promise.all([
    prisma.city.upsert({
      where: { slug: 'kyiv' },
      update: {},
      create: { slug: 'kyiv', name: 'Київ', nameRu: 'Киев', region: 'Київська область', regionRu: 'Киевская область' },
    }),
    prisma.city.upsert({
      where: { slug: 'lviv' },
      update: {},
      create: { slug: 'lviv', name: 'Львів', nameRu: 'Львов', region: 'Львівська область', regionRu: 'Львовская область' },
    }),
    prisma.city.upsert({
      where: { slug: 'odesa' },
      update: {},
      create: { slug: 'odesa', name: 'Одеса', nameRu: 'Одесса', region: 'Одеська область', regionRu: 'Одесская область' },
    }),
    prisma.city.upsert({
      where: { slug: 'kharkiv' },
      update: {},
      create: { slug: 'kharkiv', name: 'Харків', nameRu: 'Харьков', region: 'Харківська область', regionRu: 'Харьковская область' },
    }),
    prisma.city.upsert({
      where: { slug: 'dnipro' },
      update: {},
      create: { slug: 'dnipro', name: 'Дніпро', nameRu: 'Днепр', region: 'Дніпропетровська область', regionRu: 'Днепропетровская область' },
    }),
  ]);
  console.log('Created cities:', cities.length);

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'establishments' },
      update: {},
      create: { slug: 'establishments', name: 'Заклади', nameRu: 'Заведения', description: 'Ресторани, кафе, бари та інші заклади', descriptionRu: 'Рестораны, кафе, бары и другие заведения', icon: 'store', order: 1 },
    }),
    prisma.category.upsert({
      where: { slug: 'pos-systems' },
      update: {},
      create: { slug: 'pos-systems', name: 'POS-системи', nameRu: 'POS-системы', description: 'Системи автоматизації ресторанів', descriptionRu: 'Системы автоматизации ресторанов', icon: 'monitor', order: 2 },
    }),
    prisma.category.upsert({
      where: { slug: 'equipment' },
      update: {},
      create: { slug: 'equipment', name: 'Обладнання', nameRu: 'Оборудование', description: 'Ресторанне обладнання', descriptionRu: 'Ресторанное оборудование', icon: 'chef-hat', order: 3 },
    }),
    prisma.category.upsert({
      where: { slug: 'suppliers' },
      update: {},
      create: { slug: 'suppliers', name: 'Постачальники', nameRu: 'Поставщики', description: 'Постачальники продуктів та товарів', descriptionRu: 'Поставщики продуктов и товаров', icon: 'truck', order: 4 },
    }),
    prisma.category.upsert({
      where: { slug: 'delivery' },
      update: {},
      create: { slug: 'delivery', name: 'Доставка їжі', nameRu: 'Доставка еды', description: 'Сервіси доставки їжі', descriptionRu: 'Сервисы доставки еды', icon: 'bike', order: 5 },
    }),
    prisma.category.upsert({
      where: { slug: 'qr-menu' },
      update: {},
      create: { slug: 'qr-menu', name: 'QR-меню', nameRu: 'QR-меню', description: 'Системи цифрового меню', descriptionRu: 'Системы цифрового меню', icon: 'qr-code', order: 6 },
    }),
    prisma.category.upsert({
      where: { slug: 'marketing' },
      update: {},
      create: { slug: 'marketing', name: 'Маркетинг', nameRu: 'Маркетинг', description: 'Просування та реклама закладів', descriptionRu: 'Продвижение и реклама заведений', icon: 'megaphone', order: 7 },
    }),
    prisma.category.upsert({
      where: { slug: 'restaurants' },
      update: { isActive: false },
      create: { slug: 'restaurants', name: 'Ресторани', nameRu: 'Рестораны', description: 'Ресторани та заклади харчування', descriptionRu: 'Рестораны и заведения питания', icon: 'utensils', order: 10, isActive: false },
    }),
    prisma.category.upsert({
      where: { slug: 'aggregators' },
      update: { isActive: false },
      create: { slug: 'aggregators', name: 'Агрегатори', nameRu: 'Агрегаторы', description: 'Агрегатори доставки та замовлень', descriptionRu: 'Агрегаторы доставки и заказов', icon: 'globe', order: 11, isActive: false },
    }),
  ]);
  console.log('Created categories:', categories.length);

  const businessProfile = await prisma.businessProfile.findFirst({
    where: { userId: businessUser.id },
  });

  const establishments = await Promise.all([
    prisma.establishment.upsert({
      where: { slug: 'restoran-smachna-yizha-kyiv' },
      update: {},
      create: {
        slug: 'restoran-smachna-yizha-kyiv',
        name: 'Ресторан "Смачна їжа"',
        nameRu: 'Ресторан "Вкусная еда"',
        description: 'Затишний ресторан української кухні в самому серці Києва. Автентичні страви за бабусиними рецептами.',
        descriptionRu: 'Уютный ресторан украинской кухни в самом сердце Киева. Аутентичные блюда по бабушкиным рецептам.',
        businessType: BusinessType.RESTAURANT,
        address: 'вул. Хрещатик, 22, Київ',
        addressRu: 'ул. Крещатик, 22, Киев',
        phone: '+380441234567',
        email: 'info@smachna-yizha.ua',
        website: 'https://smachna-yizha.ua',
        priceRange: 3,
        latitude: 50.4501,
        longitude: 30.5234,
        workingHours: {
          monday: { open: '10:00', close: '23:00' },
          tuesday: { open: '10:00', close: '23:00' },
          wednesday: { open: '10:00', close: '23:00' },
          thursday: { open: '10:00', close: '23:00' },
          friday: { open: '10:00', close: '00:00' },
          saturday: { open: '11:00', close: '00:00' },
          sunday: { open: '11:00', close: '22:00' },
        },
        features: ['wifi', 'parking', 'terrace', 'live-music', 'private-events'],
        status: EntityStatus.ACTIVE,
        isFeatured: true,
        averageRating: 4.5,
        reviewCount: 127,
        businessProfileId: businessProfile?.id,
        categoryId: categories[0].id,
        cityId: cities[0].id,
      },
    }),
    prisma.establishment.upsert({
      where: { slug: 'kafe-ranok-lviv' },
      update: {},
      create: {
        slug: 'kafe-ranok-lviv',
        name: 'Кафе "Ранок"',
        nameRu: 'Кафе "Утро"',
        description: 'Сніданки та бранчі в атмосфері львівської кав\'ярні. Свіжа випічка щодня.',
        descriptionRu: 'Завтраки и бранчи в атмосфере львовской кофейни. Свежая выпечка ежедневно.',
        businessType: BusinessType.CAFE,
        address: 'пл. Ринок, 5, Львів',
        addressRu: 'пл. Рынок, 5, Львов',
        phone: '+380321234567',
        priceRange: 2,
        features: ['wifi', 'breakfast', 'terrace'],
        status: EntityStatus.ACTIVE,
        averageRating: 4.8,
        reviewCount: 89,
        categoryId: categories[0].id,
        cityId: cities[1].id,
      },
    }),
    prisma.establishment.upsert({
      where: { slug: 'fastfood-shvydko-odesa' },
      update: {},
      create: {
        slug: 'fastfood-shvydko-odesa',
        name: 'Фастфуд "Швидко"',
        nameRu: 'Фастфуд "Быстро"',
        description: 'Швидке обслуговування та смачні бургери біля моря.',
        descriptionRu: 'Быстрое обслуживание и вкусные бургеры у моря.',
        businessType: BusinessType.FASTFOOD,
        address: 'Дерибасівська, 10, Одеса',
        addressRu: 'Дерибасовская, 10, Одесса',
        priceRange: 1,
        features: ['delivery', 'takeaway'],
        status: EntityStatus.ACTIVE,
        averageRating: 4.2,
        reviewCount: 234,
        categoryId: categories[0].id,
        cityId: cities[2].id,
      },
    }),
  ]);
  console.log('Created establishments:', establishments.length);

  const posSystems = await Promise.all([
    prisma.posSystem.upsert({
      where: { slug: 'poster-pos' },
      update: {
        logoUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop',
        coverUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop',
      },
      create: {
        slug: 'poster-pos',
        name: 'Poster POS',
        nameRu: 'Poster POS',
        description: 'Poster — це хмарна POS-система для ресторанів, кафе та барів. Проста в використанні, потужна в можливостях.',
        descriptionRu: 'Poster — это облачная POS-система для ресторанов, кафе и баров. Простая в использовании, мощная в возможностях.',
        shortDescription: 'Хмарна POS-система для HoReCa',
        shortDescriptionRu: 'Облачная POS-система для HoReCa',
        logoUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop',
        coverUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop',
        website: 'https://joinposter.com',
        priceFrom: 599,
        priceTo: 2499,
        pricingModel: 'subscription',
        features: ['inventory', 'analytics', 'crm', 'kitchen-display', 'loyalty', 'reports'],
        integrations: ['checkbox', 'liqpay', 'fondy', 'glovo', 'bolt-food'],
        status: EntityStatus.ACTIVE,
        isFeatured: true,
        averageRating: 4.7,
        reviewCount: 312,
        categoryId: categories[1].id,
      },
    }),
    prisma.posSystem.upsert({
      where: { slug: 'iiko' },
      update: {
        logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop',
        coverUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
      },
      create: {
        slug: 'iiko',
        name: 'iiko',
        nameRu: 'iiko',
        description: 'Комплексна система автоматизації ресторанного бізнесу. Від управління складом до аналітики.',
        descriptionRu: 'Комплексная система автоматизации ресторанного бизнеса. От управления складом до аналитики.',
        shortDescription: 'Комплексна автоматизація ресторанів',
        shortDescriptionRu: 'Комплексная автоматизация ресторанов',
        logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop',
        coverUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
        website: 'https://iiko.ua',
        priceFrom: 1500,
        priceTo: 5000,
        pricingModel: 'subscription',
        features: ['inventory', 'analytics', 'crm', 'kitchen-display', 'franchise', 'delivery'],
        integrations: ['checkbox', 'liqpay', 'glovo', 'raketa'],
        status: EntityStatus.ACTIVE,
        averageRating: 4.5,
        reviewCount: 189,
        categoryId: categories[1].id,
      },
    }),
    prisma.posSystem.upsert({
      where: { slug: 'r-keeper' },
      update: {
        logoUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop',
        coverUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
      },
      create: {
        slug: 'r-keeper',
        name: 'R-Keeper',
        nameRu: 'R-Keeper',
        description: 'Професійна система для великих ресторанних мереж. Гнучке налаштування під будь-які потреби.',
        descriptionRu: 'Профессиональная система для больших ресторанных сетей. Гибкая настройка под любые потребности.',
        shortDescription: 'Для великих ресторанних мереж',
        shortDescriptionRu: 'Для больших ресторанных сетей',
        logoUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop',
        coverUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
        website: 'https://r-keeper.ua',
        priceFrom: 2000,
        priceTo: 10000,
        pricingModel: 'one-time',
        features: ['inventory', 'analytics', 'franchise', 'multi-location', 'enterprise'],
        integrations: ['checkbox', '1c', 'sap'],
        status: EntityStatus.ACTIVE,
        averageRating: 4.3,
        reviewCount: 156,
        categoryId: categories[1].id,
      },
    }),
    prisma.posSystem.upsert({
      where: { slug: 'choice-qr' },
      update: {
        logoUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop',
        coverUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=600&fit=crop',
      },
      create: {
        slug: 'choice-qr',
        name: 'Choice QR',
        nameRu: 'Choice QR',
        description: 'QR-меню та система самообслуговування для ресторанів. Гості замовляють зі свого телефону.',
        descriptionRu: 'QR-меню и система самообслуживания для ресторанов. Гости заказывают со своего телефона.',
        shortDescription: 'QR-меню та самообслуговування',
        shortDescriptionRu: 'QR-меню и самообслуживание',
        logoUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop',
        coverUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=600&fit=crop',
        website: 'https://choice.ua',
        priceFrom: 299,
        priceTo: 999,
        pricingModel: 'subscription',
        features: ['qr-menu', 'self-order', 'payment', 'analytics'],
        integrations: ['poster', 'iiko', 'liqpay'],
        status: EntityStatus.ACTIVE,
        averageRating: 4.6,
        reviewCount: 78,
        categoryId: categories[5].id,
      },
    }),
    prisma.posSystem.upsert({
      where: { slug: 'goovii' },
      update: {
        logoUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop',
        coverUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop',
      },
      create: {
        slug: 'goovii',
        name: 'Goovii',
        nameRu: 'Goovii',
        description: 'Goovii — сучасна хмарна POS-система для ресторанів, кафе та барів. Інтуїтивний інтерфейс, потужна аналітика та швидка підтримка. Ідеальне рішення для автоматизації вашого закладу.',
        descriptionRu: 'Goovii — современная облачная POS-система для ресторанов, кафе и баров. Интуитивный интерфейс, мощная аналитика и быстрая поддержка. Идеальное решение для автоматизации вашего заведения.',
        shortDescription: 'Сучасна хмарна POS-система',
        shortDescriptionRu: 'Современная облачная POS-система',
        logoUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop',
        coverUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop',
        website: 'https://goovii.ua',
        priceFrom: 499,
        priceTo: 1999,
        pricingModel: 'subscription',
        features: ['inventory', 'analytics', 'crm', 'kitchen-display', 'loyalty', 'reports', 'delivery', 'qr-menu'],
        integrations: ['checkbox', 'liqpay', 'fondy', 'mono', 'glovo', 'bolt-food', 'raketa'],
        status: EntityStatus.ACTIVE,
        isFeatured: true,
        averageRating: 4.9,
        reviewCount: 245,
        categoryId: categories[1].id,
      },
    }),
  ]);
  console.log('Created POS systems:', posSystems.length);

  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        content: 'Чудовий заклад! Смачна їжа, привітний персонал. Особливо сподобався борщ з пампушками. Обовязково повернемося!',
        pros: 'Смачна їжа, гарний інтерєр, швидке обслуговування',
        cons: 'Трохи дорого',
        status: ReviewStatus.APPROVED,
        userId: user.id,
        establishmentId: establishments[0].id,
      },
    }),
    prisma.review.create({
      data: {
        content: 'Poster - найкраща POS-система, яку ми використовували. Легко налаштувати, зручний інтерфейс. Підтримка відповідає швидко.',
        pros: 'Простий інтерфейс, хороша підтримка, інтеграції',
        cons: 'Хотілося б більше кастомізації звітів',
        status: ReviewStatus.APPROVED,
        userId: user.id,
        posSystemId: posSystems[0].id,
      },
    }),
  ]);
  console.log('Created reviews:', reviews.length);

  const ratings = await Promise.all([
    prisma.rating.create({
      data: { score: 5, userId: user.id, establishmentId: establishments[0].id },
    }),
    prisma.rating.create({
      data: { score: 5, userId: user.id, posSystemId: posSystems[0].id },
    }),
  ]);
  console.log('Created ratings:', ratings.length);

  console.log('Seeding completed successfully!');
  console.log('---');
  console.log('Test accounts:');
  console.log('Admin: admin@zaklad.ua / admin123456');
  console.log('User: user@example.com / user123456');
  console.log('Business: business@example.com / business123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

