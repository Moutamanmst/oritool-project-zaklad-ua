"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Wrench, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  ArrowLeft,
  Refrigerator,
  Flame,
  Wind,
  Coffee,
  UtensilsCrossed,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/MainLayout";

const categoryData: Record<string, {
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  tips: string[];
  commonIssues: string[];
}> = {
  maintenance: {
    name: "Технічне обслуговування",
    description: "Ремонт та сервіс ресторанного обладнання",
    icon: Wrench,
    color: "from-zinc-500 to-zinc-600",
    tips: [
      "Регулярне технічне обслуговування продовжує термін служби обладнання на 30-50%",
      "Складайте графік профілактичних перевірок щомісяця",
      "Зберігайте всі гарантійні документи та сервісні книжки",
      "Навчіть персонал базовому догляду за обладнанням",
    ],
    commonIssues: [
      "Холодильник не холодить - перевірте компресор та фреон",
      "Піч не нагрівається - можлива проблема з термостатом",
      "Посудомийка не миє - забитий фільтр або зламана помпа",
      "Кавомашина не варить - потрібна декальцинація",
    ],
  },
  refrigeration: {
    name: "Холодильне обладнання",
    description: "Холодильники, морозильники, вітрини",
    icon: Refrigerator,
    color: "from-blue-500 to-cyan-500",
    tips: [
      "Перевіряйте температуру двічі на день",
      "Чистіть конденсатор кожні 3 місяці",
      "Не перевантажуйте камеру - це знижує ефективність",
      "Слідкуйте за рівнем фреону",
    ],
    commonIssues: [
      "Обмерзання - перевірте ущільнювачі дверей",
      "Шум компресора - можлива несправність мотора",
      "Підвищена температура - забитий конденсатор",
      "Витік води - засмічена дренажна система",
    ],
  },
  thermal: {
    name: "Теплове обладнання",
    description: "Плити, печі, грилі, фритюрниці",
    icon: Flame,
    color: "from-orange-500 to-red-500",
    tips: [
      "Щоденно чистіть поверхні після роботи",
      "Перевіряйте газові підключення щотижня",
      "Калібруйте термостати раз на місяць",
      "Замінюйте масло у фритюрницях своєчасно",
    ],
    commonIssues: [
      "Нерівномірний нагрів - проблема з конфорками",
      "Запах газу - негайно викликайте спеціаліста",
      "Іскріння - пошкоджена проводка",
      "Термостат не працює - потрібна заміна",
    ],
  },
  ventilation: {
    name: "Вентиляція",
    description: "Витяжки, кондиціонери, вентиляційні системи",
    icon: Wind,
    color: "from-sky-500 to-blue-500",
    tips: [
      "Чистіть фільтри витяжок щотижня",
      "Проводьте професійну чистку повітроводів раз на рік",
      "Перевіряйте роботу вентиляторів щомісяця",
      "Слідкуйте за тиском у системі",
    ],
    commonIssues: [
      "Слабка тяга - забиті фільтри або повітроводи",
      "Шум - зношені підшипники вентилятора",
      "Запахи не виводяться - недостатня потужність",
      "Конденсат - проблеми з ізоляцією",
    ],
  },
  coffee: {
    name: "Кавове обладнання",
    description: "Кавомашини, кавомолки, аксесуари",
    icon: Coffee,
    color: "from-amber-600 to-orange-600",
    tips: [
      "Декальцинація кожні 2-4 тижні залежно від жорсткості води",
      "Чистіть групу щодня після зміни",
      "Калібруйте помел під кожну партію кави",
      "Використовуйте фільтровану воду",
    ],
    commonIssues: [
      "Кава гірка - занадто дрібний помел або забруднена група",
      "Слабкий тиск - зношена помпа або накип",
      "Пара не йде - засмічена паровентиль",
      "Помел нерівномірний - затуплені жорна",
    ],
  },
  kitchen: {
    name: "Кухонне обладнання",
    description: "Міксери, слайсери, м'ясорубки",
    icon: UtensilsCrossed,
    color: "from-emerald-500 to-green-500",
    tips: [
      "Заточуйте ножі слайсерів кожні 2-3 місяці",
      "Змащуйте механізми згідно з інструкцією",
      "Не перевантажуйте техніку понад норму",
      "Перевіряйте електричні з'єднання",
    ],
    commonIssues: [
      "Міксер перегрівається - перевантаження або зношені щітки",
      "Слайсер не ріже рівно - затуплений ніж",
      "М'ясорубка заклинює - забитий механізм",
      "Вібрація - розбалансування деталей",
    ],
  },
};

const technicians = [
  {
    id: 1,
    name: "Олександр Петренко",
    specialty: "Холодильне обладнання",
    categories: ["refrigeration", "maintenance"],
    experience: "12 років досвіду",
    rating: 4.9,
    reviews: 156,
    phone: "+380 67 123 45 67",
    email: "o.petrenko@service.ua",
    location: "Київ",
    available: true,
  },
  {
    id: 2,
    name: "Віталій Коваленко",
    specialty: "Теплове обладнання",
    categories: ["thermal", "maintenance"],
    experience: "8 років досвіду",
    rating: 4.8,
    reviews: 98,
    phone: "+380 50 234 56 78",
    email: "v.kovalenko@service.ua",
    location: "Київ, Львів",
    available: true,
  },
  {
    id: 3,
    name: "Андрій Шевченко",
    specialty: "Кавове обладнання",
    categories: ["coffee", "maintenance"],
    experience: "10 років досвіду",
    rating: 5.0,
    reviews: 203,
    phone: "+380 63 345 67 89",
    email: "a.shevchenko@service.ua",
    location: "Київ, Одеса",
    available: true,
  },
  {
    id: 4,
    name: "Сергій Бондаренко",
    specialty: "Вентиляційні системи",
    categories: ["ventilation", "maintenance"],
    experience: "15 років досвіду",
    rating: 4.7,
    reviews: 87,
    phone: "+380 97 456 78 90",
    email: "s.bondarenko@service.ua",
    location: "Київ, Харків",
    available: false,
  },
  {
    id: 5,
    name: "Микола Ткаченко",
    specialty: "Універсальний майстер",
    categories: ["maintenance", "refrigeration", "thermal", "ventilation", "coffee", "kitchen"],
    experience: "20 років досвіду",
    rating: 4.9,
    reviews: 312,
    phone: "+380 66 567 89 01",
    email: "m.tkachenko@service.ua",
    location: "Львів",
    available: true,
  },
  {
    id: 6,
    name: "Ігор Мельник",
    specialty: "Кухонне обладнання",
    categories: ["kitchen", "maintenance"],
    experience: "7 років досвіду",
    rating: 4.6,
    reviews: 64,
    phone: "+380 68 678 90 12",
    email: "i.melnyk@service.ua",
    location: "Одеса",
    available: true,
  },
];

export default function EquipmentCategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const category = categoryData[slug];
  
  if (!category) {
    return (
      <MainLayout>
        <div className="min-h-screen py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16">
              <h1 className="text-2xl font-bold text-zinc-100 mb-4">Категорію не знайдено</h1>
              <Link href="/equipment">
                <Button>Повернутись до обладнання</Button>
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const Icon = category.icon;
  const relevantTechnicians = technicians.filter(t => t.categories.includes(slug));

  return (
    <MainLayout>
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <Link href="/equipment" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            Назад до обладнання
          </Link>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-4 rounded-xl bg-gradient-to-br ${category.color}`}>
                <Icon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-zinc-100">{category.name}</h1>
                <p className="text-zinc-400">{category.description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Tips */}
              <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <h2 className="text-xl font-bold text-zinc-100">Корисні поради</h2>
                </div>
                <ul className="space-y-3">
                  {category.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                      <span className="text-zinc-300">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Common Issues */}
              <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                  <h2 className="text-xl font-bold text-zinc-100">Часті проблеми</h2>
                </div>
                <ul className="space-y-3">
                  {category.commonIssues.map((issue, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                      <span className="text-zinc-300">{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technicians for this category */}
              <div>
                <h2 className="text-xl font-bold text-zinc-100 mb-4">Спеціалісти з {category.name.toLowerCase()}</h2>
                <div className="space-y-4">
                  {relevantTechnicians.map((tech) => (
                    <div
                      key={tech.id}
                      className="rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all p-5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-emerald-400">
                              {tech.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-zinc-100">{tech.name}</h3>
                              {tech.available ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">Доступний</span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-zinc-700/50 text-zinc-500 text-xs">Зайнятий</span>
                              )}
                            </div>
                            <p className="text-sm text-zinc-400">{tech.specialty} • {tech.experience}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex items-center gap-1">
                                <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                                <span className="text-sm text-zinc-300">{tech.rating}</span>
                              </div>
                              <span className="text-xs text-zinc-500">({tech.reviews} відгуків)</span>
                              <span className="text-xs text-zinc-500 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {tech.location}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 sm:flex-col">
                          <a
                            href={`tel:${tech.phone.replace(/\s/g, '')}`}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors"
                          >
                            <Phone className="h-4 w-4" />
                            <span className="sm:hidden lg:inline">Зателефонувати</span>
                          </a>
                          <a
                            href={`mailto:${tech.email}`}
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm transition-colors"
                          >
                            <Mail className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Contact */}
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 p-6">
                <h3 className="font-bold text-zinc-100 mb-3">Потрібна допомога?</h3>
                <p className="text-sm text-zinc-400 mb-4">
                  Опишіть проблему і ми підберемо найкращого спеціаліста
                </p>
                <Link href="/ai-helper">
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Запитати AI-помічника
                  </Button>
                </Link>
              </div>

              {/* Emergency Contact */}
              <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-5 w-5 text-red-400" />
                  <h3 className="font-bold text-zinc-100">Терміновий ремонт</h3>
                </div>
                <p className="text-sm text-zinc-400 mb-4">
                  Цілодобова підтримка для екстрених випадків
                </p>
                <a
                  href="tel:+380800123456"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  0 800 123 456
                </a>
              </div>

              {/* Stats */}
              <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6">
                <h3 className="font-bold text-zinc-100 mb-4">Статистика</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Майстрів у категорії</span>
                    <span className="font-semibold text-zinc-100">{relevantTechnicians.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Середній рейтинг</span>
                    <span className="font-semibold text-zinc-100">
                      {(relevantTechnicians.reduce((acc, t) => acc + t.rating, 0) / relevantTechnicians.length).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Загалом відгуків</span>
                    <span className="font-semibold text-zinc-100">
                      {relevantTechnicians.reduce((acc, t) => acc + t.reviews, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
