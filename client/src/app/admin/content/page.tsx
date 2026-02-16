"use client";

import { useState, useEffect } from "react";
import { 
  Save, 
  Home, 
  FileText, 
  MapPin, 
  Star,
  CheckCircle,
  X,
  Plus,
  Trash2,
  Crown,
  Store,
  Package,
  Megaphone,
  Monitor,
  Truck,
  Utensils,
  Wrench
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { api, endpoints } from "@/lib/api";

interface Partner {
  id: string;
  slug: string;
  name: string;
  shortDescription?: string;
  description?: string;
  averageRating: number;
  viewCount: number;
}

interface HomepageContent {
  heroTitle1: string;
  heroTitle2: string;
  heroDescription: string;
  partnerName: string;
  partnerDescription: string;
  partnerRating: string;
  partnerViews: string;
  partnerSlug: string;
  statsRegions: string;
  statsCities: string;
  statsEstablishments: string;
  aiHelperTitle: string;
  aiHelperDescription: string;
  aiQuestions: string[];
}

interface FooterContent {
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  socialFacebook: string;
  socialInstagram: string;
  socialTelegram: string;
  copyright: string;
}

interface PageContent {
  title: string;
  subtitle: string;
  description: string;
}

interface CategoryItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// Page-specific content
interface EstablishmentsPageContent extends PageContent {
  categories: CategoryItem[];
}

interface Technician {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  reviews: number;
  phone: string;
  email: string;
  location: string;
  available: boolean;
}

interface EquipmentPageContent extends PageContent {
  categories: CategoryItem[];
  technicians: Technician[];
}

interface MarketingPageContent extends PageContent {
  categories: CategoryItem[];
}

interface PosSystemsPageContent extends PageContent {
  categories: CategoryItem[];
}

interface SuppliersPageContent extends PageContent {
  categories: CategoryItem[];
}

interface DeliveryPageContent extends PageContent {
  categories: CategoryItem[];
}

const defaultEstablishments: EstablishmentsPageContent = {
  title: "Заклади",
  subtitle: "Каталог закладів",
  description: "Знаходьте найкращі ресторани, кафе та бари у вашому місті",
  categories: [
    { id: "1", title: "Ресторани", description: "Ресторани різних кухонь", icon: "utensils" },
    { id: "2", title: "Кафе", description: "Затишні кафе та кав'ярні", icon: "coffee" },
    { id: "3", title: "Бари", description: "Бари та паби", icon: "beer" },
    { id: "4", title: "Фастфуд", description: "Швидке харчування", icon: "burger" },
    { id: "5", title: "Піцерії", description: "Піца та італійська кухня", icon: "pizza" },
    { id: "6", title: "Суші", description: "Японська кухня", icon: "fish" },
  ],
};

const defaultEquipment: EquipmentPageContent = {
  title: "Обладнання",
  subtitle: "Професійне обладнання",
  description: "Все необхідне обладнання для вашого закладу",
  categories: [
    { id: "1", title: "Холодильне", description: "Холодильники та морозильні камери", icon: "snowflake" },
    { id: "2", title: "Теплове", description: "Плити, печі, гриль", icon: "flame" },
    { id: "3", title: "Барне", description: "Кавомашини, блендери", icon: "coffee" },
    { id: "4", title: "Нейтральне", description: "Столи, стелажі, мийки", icon: "box" },
    { id: "5", title: "Посуд", description: "Професійний посуд", icon: "utensils" },
    { id: "6", title: "Технічне обслуговування", description: "Ремонт та сервіс обладнання", icon: "wrench" },
  ],
  technicians: [
    {
      id: "1",
      name: "Олександр Петренко",
      specialty: "Холодильне обладнання",
      experience: "12 років досвіду",
      rating: 4.9,
      reviews: 156,
      phone: "+380 67 123 45 67",
      email: "o.petrenko@service.ua",
      location: "Київ",
      available: true,
    },
    {
      id: "2",
      name: "Віталій Коваленко",
      specialty: "Теплове обладнання",
      experience: "8 років досвіду",
      rating: 4.8,
      reviews: 98,
      phone: "+380 50 234 56 78",
      email: "v.kovalenko@service.ua",
      location: "Київ, Львів",
      available: true,
    },
    {
      id: "3",
      name: "Андрій Шевченко",
      specialty: "Кавове обладнання",
      experience: "10 років досвіду",
      rating: 5.0,
      reviews: 203,
      phone: "+380 63 345 67 89",
      email: "a.shevchenko@service.ua",
      location: "Київ, Одеса",
      available: true,
    },
  ],
};

const defaultMarketing: MarketingPageContent = {
  title: "Маркетинг",
  subtitle: "Просування вашого бізнесу",
  description: "Інструменти та послуги для залучення клієнтів",
  categories: [
    { id: "1", title: "SMM", description: "Просування в соцмережах", icon: "share" },
    { id: "2", title: "Реклама", description: "Таргетована реклама", icon: "megaphone" },
    { id: "3", title: "Брендинг", description: "Розробка бренду", icon: "palette" },
    { id: "4", title: "Фото/Відео", description: "Контент для закладів", icon: "camera" },
    { id: "5", title: "Лояльність", description: "Програми лояльності", icon: "heart" },
    { id: "6", title: "Технології", description: "Інновації та діджиталізація", icon: "cpu" },
  ],
};

const defaultPosSystems: PosSystemsPageContent = {
  title: "POS-системи",
  subtitle: "Автоматизація ресторанів",
  description: "Порівняйте та оберіть найкращу систему для вашого закладу",
  categories: [
    { id: "1", title: "Для ресторанів", description: "Повнофункціональні рішення", icon: "utensils" },
    { id: "2", title: "Для кафе", description: "Прості та зручні системи", icon: "coffee" },
    { id: "3", title: "Для фастфуду", description: "Швидкі каси", icon: "zap" },
    { id: "4", title: "Для доставки", description: "Інтеграція з агрегаторами", icon: "truck" },
  ],
};

const defaultSuppliers: SuppliersPageContent = {
  title: "Постачальники",
  subtitle: "Надійні партнери",
  description: "Знаходьте постачальників продуктів та товарів",
  categories: [
    { id: "1", title: "Продукти", description: "Свіжі продукти харчування", icon: "apple" },
    { id: "2", title: "Напої", description: "Алкогольні та безалкогольні", icon: "wine" },
    { id: "3", title: "Упаковка", description: "Пакування та контейнери", icon: "package" },
    { id: "4", title: "Інвентар", description: "Інвентар та витратні матеріали", icon: "box" },
  ],
};

const defaultDelivery: DeliveryPageContent = {
  title: "Доставка",
  subtitle: "Сервіси доставки",
  description: "Підключіться до агрегаторів доставки",
  categories: [
    { id: "1", title: "Агрегатори", description: "Glovo, Bolt Food та інші", icon: "bike" },
    { id: "2", title: "Власна доставка", description: "Рішення для власної доставки", icon: "truck" },
    { id: "3", title: "Логістика", description: "Оптимізація маршрутів", icon: "map" },
  ],
};

const defaultHomepage: HomepageContent = {
  heroTitle1: "Ваш персональний помічник",
  heroTitle2: "у ресторанному бізнесі",
  heroDescription: "Знаходьте найкращі POS-системи, обладнання та постачальників для вашого закладу",
  partnerName: "Poster POS",
  partnerDescription: "Автоматизація для кафе, ресторанів та магазинів. Просте впровадження за 15 хвилин.",
  partnerRating: "4.8",
  partnerViews: "12.4k",
  partnerSlug: "poster-pos",
  statsRegions: "8",
  statsCities: "26",
  statsEstablishments: "90",
  aiHelperTitle: "Запитай у Zaklad AI",
  aiHelperDescription: "Розумний помічник допоможе обрати обладнання, порівняти POS-системи, знайти постачальників та відповість на питання про ресторанний бізнес.",
  aiQuestions: [
    "Яку POS обрати для кафе?",
    "Порівняй Poster та iiko",
    "Що потрібно для піцерії?"
  ],
};

const defaultFooter: FooterContent = {
  companyName: "ZakladUA",
  contactEmail: "info@zaklad.ua",
  contactPhone: "+380 44 123 45 67",
  socialFacebook: "https://facebook.com/zakladua",
  socialInstagram: "https://instagram.com/zakladua",
  socialTelegram: "https://t.me/zakladua",
  copyright: "© 2024 ZakladUA. Всі права захищені.",
};

export default function AdminContentPage() {
  const [homepage, setHomepage] = useState<HomepageContent>(defaultHomepage);
  const [footer, setFooter] = useState<FooterContent>(defaultFooter);
  const [establishments, setEstablishments] = useState<EstablishmentsPageContent>(defaultEstablishments);
  const [equipment, setEquipment] = useState<EquipmentPageContent>(defaultEquipment);
  const [marketing, setMarketing] = useState<MarketingPageContent>(defaultMarketing);
  const [posSystems, setPosSystems] = useState<PosSystemsPageContent>(defaultPosSystems);
  const [suppliers, setSuppliers] = useState<SuppliersPageContent>(defaultSuppliers);
  const [delivery, setDelivery] = useState<DeliveryPageContent>(defaultDelivery);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({ 
    show: false, 
    message: "", 
    type: "success" 
  });

  useEffect(() => {
    // Load content from API
    async function loadContent() {
      try {
        const allContent = await api.get<Record<string, any>>(endpoints.siteContent.getAll);
        
        if (allContent.homepage) setHomepage(allContent.homepage);
        if (allContent.footer) setFooter(allContent.footer);
        if (allContent.partnerId) setSelectedPartnerId(allContent.partnerId);
        if (allContent.establishments) setEstablishments(allContent.establishments);
        if (allContent.equipment) setEquipment(allContent.equipment);
        if (allContent.marketing) setMarketing(allContent.marketing);
        if (allContent.posSystems) setPosSystems(allContent.posSystems);
        if (allContent.suppliers) setSuppliers(allContent.suppliers);
        if (allContent.delivery) setDelivery(allContent.delivery);
      } catch (error) {
        console.error("Failed to load content from API, falling back to localStorage:", error);
        // Fallback to localStorage for backward compatibility
        const savedHomepage = localStorage.getItem("zakladua-homepage");
        const savedFooter = localStorage.getItem("zakladua-footer");
        const savedPartnerId = localStorage.getItem("zakladua-partner-id");
        const savedEstablishments = localStorage.getItem("zakladua-establishments");
        const savedEquipment = localStorage.getItem("zakladua-equipment");
        const savedMarketing = localStorage.getItem("zakladua-marketing");
        const savedPosSystems = localStorage.getItem("zakladua-pos-systems");
        const savedSuppliers = localStorage.getItem("zakladua-suppliers");
        const savedDelivery = localStorage.getItem("zakladua-delivery");

        if (savedHomepage) setHomepage(JSON.parse(savedHomepage));
        if (savedFooter) setFooter(JSON.parse(savedFooter));
        if (savedPartnerId) setSelectedPartnerId(savedPartnerId);
        if (savedEstablishments) setEstablishments(JSON.parse(savedEstablishments));
        if (savedEquipment) setEquipment(JSON.parse(savedEquipment));
        if (savedMarketing) setMarketing(JSON.parse(savedMarketing));
        if (savedPosSystems) setPosSystems(JSON.parse(savedPosSystems));
        if (savedSuppliers) setSuppliers(JSON.parse(savedSuppliers));
        if (savedDelivery) setDelivery(JSON.parse(savedDelivery));
      }
      
      // Fetch partners from API
      try {
        const response = await api.get<{ data: Partner[] }>(`${endpoints.posSystems.list}?limit=50`);
        setPartners(response.data);
      } catch (error) {
        console.error("Failed to fetch partners:", error);
      }
      
      setLoaded(true);
    }
    
    loadContent();
  }, []);

  const handleSelectPartner = (partnerId: string) => {
    setSelectedPartnerId(partnerId);
    const partner = partners.find(p => p.id === partnerId);
    if (partner) {
      // Generate default description if none exists
      const description = partner.shortDescription || partner.description || 
        "Автоматизація для кафе, ресторанів та магазинів. Просте впровадження за 15 хвилин.";
      
      setHomepage({
        ...homepage,
        partnerName: partner.name,
        partnerDescription: description,
        partnerRating: partner.averageRating.toFixed(1),
        partnerViews: partner.viewCount > 1000 
          ? `${(partner.viewCount / 1000).toFixed(1)}k` 
          : partner.viewCount.toString(),
        partnerSlug: partner.slug,
      });
    }
  };

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Save all content to API
      await Promise.all([
        api.put(endpoints.siteContent.upsert("homepage"), homepage),
        api.put(endpoints.siteContent.upsert("footer"), footer),
        api.put(endpoints.siteContent.upsert("partnerId"), selectedPartnerId),
        api.put(endpoints.siteContent.upsert("establishments"), establishments),
        api.put(endpoints.siteContent.upsert("equipment"), equipment),
        api.put(endpoints.siteContent.upsert("marketing"), marketing),
        api.put(endpoints.siteContent.upsert("posSystems"), posSystems),
        api.put(endpoints.siteContent.upsert("suppliers"), suppliers),
        api.put(endpoints.siteContent.upsert("delivery"), delivery),
      ]);
      
      // Also save to localStorage for frontend pages (backward compatibility)
      localStorage.setItem("zakladua-homepage", JSON.stringify(homepage));
      localStorage.setItem("zakladua-footer", JSON.stringify(footer));
      localStorage.setItem("zakladua-partner-id", selectedPartnerId);
      localStorage.setItem("zakladua-establishments", JSON.stringify(establishments));
      localStorage.setItem("zakladua-equipment", JSON.stringify(equipment));
      localStorage.setItem("zakladua-marketing", JSON.stringify(marketing));
      localStorage.setItem("zakladua-pos-systems", JSON.stringify(posSystems));
      localStorage.setItem("zakladua-suppliers", JSON.stringify(suppliers));
      localStorage.setItem("zakladua-delivery", JSON.stringify(delivery));
      
      showToast("Контент збережено!");
    } catch (error) {
      console.error("Failed to save content:", error);
      showToast("Помилка збереження!", "error");
    } finally {
      setSaving(false);
    }
  };

  const addAiQuestion = () => {
    setHomepage({
      ...homepage,
      aiQuestions: [...homepage.aiQuestions, "Нове питання?"]
    });
  };

  const removeAiQuestion = (index: number) => {
    setHomepage({
      ...homepage,
      aiQuestions: homepage.aiQuestions.filter((_, i) => i !== index)
    });
  };

  const updateAiQuestion = (index: number, value: string) => {
    const newQuestions = [...homepage.aiQuestions];
    newQuestions[index] = value;
    setHomepage({ ...homepage, aiQuestions: newQuestions });
  };

  // Generic category update functions
  const updateCategory = (
    pageType: 'establishments' | 'equipment' | 'marketing' | 'posSystems' | 'suppliers' | 'delivery',
    categoryId: string, 
    field: 'title' | 'description', 
    value: string
  ) => {
    const setters = {
      establishments: setEstablishments,
      equipment: setEquipment,
      marketing: setMarketing,
      posSystems: setPosSystems,
      suppliers: setSuppliers,
      delivery: setDelivery,
    };
    const states = {
      establishments,
      equipment,
      marketing,
      posSystems,
      suppliers,
      delivery,
    };
    
    const setter = setters[pageType];
    const state = states[pageType];
    
    setter({
      ...state,
      categories: state.categories.map(cat => 
        cat.id === categoryId ? { ...cat, [field]: value } : cat
      )
    } as any);
  };

  // Technician management functions
  const addTechnician = () => {
    const newTech: Technician = {
      id: Date.now().toString(),
      name: "Новий майстер",
      specialty: "Спеціалізація",
      experience: "1 рік досвіду",
      rating: 5.0,
      reviews: 0,
      phone: "+380 XX XXX XX XX",
      email: "email@example.com",
      location: "Місто",
      available: true,
    };
    setEquipment({
      ...equipment,
      technicians: [...equipment.technicians, newTech]
    });
  };

  const removeTechnician = (id: string) => {
    setEquipment({
      ...equipment,
      technicians: equipment.technicians.filter(t => t.id !== id)
    });
  };

  const updateTechnician = (id: string, field: keyof Technician, value: any) => {
    setEquipment({
      ...equipment,
      technicians: equipment.technicians.map(t => 
        t.id === id ? { ...t, [field]: value } : t
      )
    });
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Управління контентом</h1>
          <p className="text-zinc-400 mt-1">Редагуйте весь контент сайту</p>
        </div>
        <Button
          className="bg-amber-500 hover:bg-amber-600 text-zinc-900"
          onClick={handleSave}
          disabled={saving}
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Збереження..." : "Зберегти все"}
        </Button>
      </div>

      <Tabs defaultValue="homepage" className="space-y-6">
        <TabsList className="bg-zinc-800/50 border border-zinc-700 flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="homepage" className="data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-900">
            <Home className="h-4 w-4 mr-2" />
            Головна
          </TabsTrigger>
          <TabsTrigger value="establishments" className="data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-900">
            <Store className="h-4 w-4 mr-2" />
            Заклади
          </TabsTrigger>
          <TabsTrigger value="equipment" className="data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-900">
            <Package className="h-4 w-4 mr-2" />
            Обладнання
          </TabsTrigger>
          <TabsTrigger value="pos-systems" className="data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-900">
            <Monitor className="h-4 w-4 mr-2" />
            POS
          </TabsTrigger>
          <TabsTrigger value="marketing" className="data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-900">
            <Megaphone className="h-4 w-4 mr-2" />
            Маркетинг
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-900">
            <Utensils className="h-4 w-4 mr-2" />
            Постачальники
          </TabsTrigger>
          <TabsTrigger value="delivery" className="data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-900">
            <Truck className="h-4 w-4 mr-2" />
            Доставка
          </TabsTrigger>
          <TabsTrigger value="footer" className="data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-900">
            <FileText className="h-4 w-4 mr-2" />
            Футер
          </TabsTrigger>
        </TabsList>

        {/* Homepage Content */}
        <TabsContent value="homepage" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hero Section */}
            <Card>
              <CardHeader>
                <CardTitle>Hero секція</CardTitle>
                <CardDescription>Головний банер сайту</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Заголовок (рядок 1)</Label>
                  <Input 
                    value={homepage.heroTitle1}
                    onChange={(e) => setHomepage({...homepage, heroTitle1: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Заголовок (рядок 2)</Label>
                  <Input 
                    value={homepage.heroTitle2}
                    onChange={(e) => setHomepage({...homepage, heroTitle2: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Опис</Label>
                  <Textarea 
                    value={homepage.heroDescription}
                    onChange={(e) => setHomepage({...homepage, heroDescription: e.target.value})}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Partner Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-500" />
                  Партнер тижня
                </CardTitle>
                <CardDescription>Оберіть партнера зі списку POS-систем</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Обрати партнера</Label>
                  <SearchableSelect
                    value={selectedPartnerId}
                    onValueChange={handleSelectPartner}
                    placeholder="Оберіть партнера зі списку..."
                    searchPlaceholder="Пошук партнера..."
                    emptyMessage="Партнера не знайдено"
                    options={partners.map((partner) => ({
                      value: partner.id,
                      label: partner.name,
                      sublabel: `★ ${partner.averageRating.toFixed(1)} • ${partner.viewCount > 1000 ? `${(partner.viewCount / 1000).toFixed(1)}k` : partner.viewCount} переглядів`,
                    }))}
                  />
                </div>

                {selectedPartnerId && (
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <p className="text-sm text-amber-400 mb-2">Обраний партнер:</p>
                    <p className="text-lg font-semibold text-zinc-100">{homepage.partnerName}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Опис партнера (можна редагувати)</Label>
                  <Textarea 
                    value={homepage.partnerDescription}
                    onChange={(e) => setHomepage({...homepage, partnerDescription: e.target.value})}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Рейтинг</Label>
                    <Input 
                      value={homepage.partnerRating}
                      onChange={(e) => setHomepage({...homepage, partnerRating: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Перегляди</Label>
                    <Input 
                      value={homepage.partnerViews}
                      onChange={(e) => setHomepage({...homepage, partnerViews: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-amber-500" />
                  Статистика
                </CardTitle>
                <CardDescription>Числа на головній сторінці</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Областей</Label>
                    <Input 
                      value={homepage.statsRegions}
                      onChange={(e) => setHomepage({...homepage, statsRegions: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Міст</Label>
                    <Input 
                      value={homepage.statsCities}
                      onChange={(e) => setHomepage({...homepage, statsCities: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Закладів</Label>
                    <Input 
                      value={homepage.statsEstablishments}
                      onChange={(e) => setHomepage({...homepage, statsEstablishments: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Helper Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  AI-помічник
                </CardTitle>
                <CardDescription>Секція Zaklad AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Заголовок</Label>
                  <Input 
                    value={homepage.aiHelperTitle}
                    onChange={(e) => setHomepage({...homepage, aiHelperTitle: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Опис</Label>
                  <Textarea 
                    value={homepage.aiHelperDescription}
                    onChange={(e) => setHomepage({...homepage, aiHelperDescription: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Приклади питань</Label>
                    <Button size="sm" variant="outline" onClick={addAiQuestion}>
                      <Plus className="h-3 w-3 mr-1" />
                      Додати
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {homepage.aiQuestions.map((q, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input 
                          value={q}
                          onChange={(e) => updateAiQuestion(idx, e.target.value)}
                        />
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="text-red-400 hover:text-red-300"
                          onClick={() => removeAiQuestion(idx)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Establishments Page */}
        <TabsContent value="establishments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5 text-amber-500" />
                Сторінка "Заклади"
              </CardTitle>
              <CardDescription>Редагуйте заголовки та категорії</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Заголовок сторінки</Label>
                  <Input 
                    value={establishments.title}
                    onChange={(e) => setEstablishments({...establishments, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Підзаголовок</Label>
                  <Input 
                    value={establishments.subtitle}
                    onChange={(e) => setEstablishments({...establishments, subtitle: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Опис</Label>
                <Textarea 
                  value={establishments.description}
                  onChange={(e) => setEstablishments({...establishments, description: e.target.value})}
                  rows={2}
                />
              </div>
              <div className="space-y-4">
                <Label className="text-base font-semibold">Категорії</Label>
                {establishments.categories.map((cat) => (
                  <div key={cat.id} className="grid grid-cols-2 gap-4 p-4 border border-zinc-700 rounded-lg">
                    <div className="space-y-2">
                      <Label>Назва категорії</Label>
                      <Input 
                        value={cat.title}
                        onChange={(e) => updateCategory('establishments', cat.id, 'title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Опис категорії</Label>
                      <Input 
                        value={cat.description}
                        onChange={(e) => updateCategory('establishments', cat.id, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Equipment Page */}
        <TabsContent value="equipment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-amber-500" />
                Сторінка "Обладнання"
              </CardTitle>
              <CardDescription>Редагуйте заголовки та категорії</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Заголовок сторінки</Label>
                  <Input 
                    value={equipment.title}
                    onChange={(e) => setEquipment({...equipment, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Підзаголовок</Label>
                  <Input 
                    value={equipment.subtitle}
                    onChange={(e) => setEquipment({...equipment, subtitle: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Опис</Label>
                <Textarea 
                  value={equipment.description}
                  onChange={(e) => setEquipment({...equipment, description: e.target.value})}
                  rows={2}
                />
              </div>
              <div className="space-y-4">
                <Label className="text-base font-semibold">Категорії</Label>
                {equipment.categories.map((cat) => (
                  <div key={cat.id} className="grid grid-cols-2 gap-4 p-4 border border-zinc-700 rounded-lg">
                    <div className="space-y-2">
                      <Label>Назва категорії</Label>
                      <Input 
                        value={cat.title}
                        onChange={(e) => updateCategory('equipment', cat.id, 'title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Опис категорії</Label>
                      <Input 
                        value={cat.description}
                        onChange={(e) => updateCategory('equipment', cat.id, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Technicians Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-amber-500" />
                    Майстри та сервісні центри
                  </CardTitle>
                  <CardDescription>Управління списком майстрів з ремонту обладнання</CardDescription>
                </div>
                <Button onClick={addTechnician} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Додати майстра
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {equipment.technicians.map((tech) => (
                <div key={tech.id} className="p-4 border border-zinc-700 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-zinc-100">{tech.name}</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => removeTechnician(tech.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Ім'я</Label>
                      <Input 
                        value={tech.name}
                        onChange={(e) => updateTechnician(tech.id, "name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Спеціалізація</Label>
                      <Input 
                        value={tech.specialty}
                        onChange={(e) => updateTechnician(tech.id, "specialty", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Досвід</Label>
                      <Input 
                        value={tech.experience}
                        onChange={(e) => updateTechnician(tech.id, "experience", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Локація</Label>
                      <Input 
                        value={tech.location}
                        onChange={(e) => updateTechnician(tech.id, "location", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Телефон</Label>
                      <Input 
                        value={tech.phone}
                        onChange={(e) => updateTechnician(tech.id, "phone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input 
                        value={tech.email}
                        onChange={(e) => updateTechnician(tech.id, "email", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Рейтинг</Label>
                      <Input 
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={tech.rating}
                        onChange={(e) => updateTechnician(tech.id, "rating", parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Відгуків</Label>
                      <Input 
                        type="number"
                        value={tech.reviews}
                        onChange={(e) => updateTechnician(tech.id, "reviews", parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {equipment.technicians.length === 0 && (
                <div className="text-center py-8 text-zinc-500">
                  Немає майстрів. Натисніть "Додати майстра" щоб додати.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* POS Systems Page */}
        <TabsContent value="pos-systems" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-amber-500" />
                Сторінка "POS-системи"
              </CardTitle>
              <CardDescription>Редагуйте заголовки та категорії</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Заголовок сторінки</Label>
                  <Input 
                    value={posSystems.title}
                    onChange={(e) => setPosSystems({...posSystems, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Підзаголовок</Label>
                  <Input 
                    value={posSystems.subtitle}
                    onChange={(e) => setPosSystems({...posSystems, subtitle: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Опис</Label>
                <Textarea 
                  value={posSystems.description}
                  onChange={(e) => setPosSystems({...posSystems, description: e.target.value})}
                  rows={2}
                />
              </div>
              <div className="space-y-4">
                <Label className="text-base font-semibold">Категорії</Label>
                {posSystems.categories.map((cat) => (
                  <div key={cat.id} className="grid grid-cols-2 gap-4 p-4 border border-zinc-700 rounded-lg">
                    <div className="space-y-2">
                      <Label>Назва категорії</Label>
                      <Input 
                        value={cat.title}
                        onChange={(e) => updateCategory('posSystems', cat.id, 'title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Опис категорії</Label>
                      <Input 
                        value={cat.description}
                        onChange={(e) => updateCategory('posSystems', cat.id, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Marketing Page */}
        <TabsContent value="marketing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-amber-500" />
                Сторінка "Маркетинг"
              </CardTitle>
              <CardDescription>Редагуйте заголовки та категорії</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Заголовок сторінки</Label>
                  <Input 
                    value={marketing.title}
                    onChange={(e) => setMarketing({...marketing, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Підзаголовок</Label>
                  <Input 
                    value={marketing.subtitle}
                    onChange={(e) => setMarketing({...marketing, subtitle: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Опис</Label>
                <Textarea 
                  value={marketing.description}
                  onChange={(e) => setMarketing({...marketing, description: e.target.value})}
                  rows={2}
                />
              </div>
              <div className="space-y-4">
                <Label className="text-base font-semibold">Категорії</Label>
                {marketing.categories.map((cat) => (
                  <div key={cat.id} className="grid grid-cols-2 gap-4 p-4 border border-zinc-700 rounded-lg">
                    <div className="space-y-2">
                      <Label>Назва категорії</Label>
                      <Input 
                        value={cat.title}
                        onChange={(e) => updateCategory('marketing', cat.id, 'title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Опис категорії</Label>
                      <Input 
                        value={cat.description}
                        onChange={(e) => updateCategory('marketing', cat.id, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suppliers Page */}
        <TabsContent value="suppliers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-amber-500" />
                Сторінка "Постачальники"
              </CardTitle>
              <CardDescription>Редагуйте заголовки та категорії</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Заголовок сторінки</Label>
                  <Input 
                    value={suppliers.title}
                    onChange={(e) => setSuppliers({...suppliers, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Підзаголовок</Label>
                  <Input 
                    value={suppliers.subtitle}
                    onChange={(e) => setSuppliers({...suppliers, subtitle: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Опис</Label>
                <Textarea 
                  value={suppliers.description}
                  onChange={(e) => setSuppliers({...suppliers, description: e.target.value})}
                  rows={2}
                />
              </div>
              <div className="space-y-4">
                <Label className="text-base font-semibold">Категорії</Label>
                {suppliers.categories.map((cat) => (
                  <div key={cat.id} className="grid grid-cols-2 gap-4 p-4 border border-zinc-700 rounded-lg">
                    <div className="space-y-2">
                      <Label>Назва категорії</Label>
                      <Input 
                        value={cat.title}
                        onChange={(e) => updateCategory('suppliers', cat.id, 'title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Опис категорії</Label>
                      <Input 
                        value={cat.description}
                        onChange={(e) => updateCategory('suppliers', cat.id, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivery Page */}
        <TabsContent value="delivery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-amber-500" />
                Сторінка "Доставка"
              </CardTitle>
              <CardDescription>Редагуйте заголовки та категорії</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Заголовок сторінки</Label>
                  <Input 
                    value={delivery.title}
                    onChange={(e) => setDelivery({...delivery, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Підзаголовок</Label>
                  <Input 
                    value={delivery.subtitle}
                    onChange={(e) => setDelivery({...delivery, subtitle: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Опис</Label>
                <Textarea 
                  value={delivery.description}
                  onChange={(e) => setDelivery({...delivery, description: e.target.value})}
                  rows={2}
                />
              </div>
              <div className="space-y-4">
                <Label className="text-base font-semibold">Категорії</Label>
                {delivery.categories.map((cat) => (
                  <div key={cat.id} className="grid grid-cols-2 gap-4 p-4 border border-zinc-700 rounded-lg">
                    <div className="space-y-2">
                      <Label>Назва категорії</Label>
                      <Input 
                        value={cat.title}
                        onChange={(e) => updateCategory('delivery', cat.id, 'title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Опис категорії</Label>
                      <Input 
                        value={cat.description}
                        onChange={(e) => updateCategory('delivery', cat.id, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Footer Content */}
        <TabsContent value="footer" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Основна інформація</CardTitle>
                <CardDescription>Інформація про компанію</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Назва компанії</Label>
                  <Input 
                    value={footer.companyName}
                    onChange={(e) => setFooter({...footer, companyName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Копірайт</Label>
                  <Input 
                    value={footer.copyright}
                    onChange={(e) => setFooter({...footer, copyright: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Контакти</CardTitle>
                <CardDescription>Контактна інформація</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input 
                    type="email"
                    value={footer.contactEmail}
                    onChange={(e) => setFooter({...footer, contactEmail: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Телефон</Label>
                  <Input 
                    value={footer.contactPhone}
                    onChange={(e) => setFooter({...footer, contactPhone: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Соціальні мережі</CardTitle>
                <CardDescription>Посилання на соцмережі</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Facebook</Label>
                    <Input 
                      value={footer.socialFacebook}
                      onChange={(e) => setFooter({...footer, socialFacebook: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Instagram</Label>
                    <Input 
                      value={footer.socialInstagram}
                      onChange={(e) => setFooter({...footer, socialInstagram: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telegram</Label>
                    <Input 
                      value={footer.socialTelegram}
                      onChange={(e) => setFooter({...footer, socialTelegram: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right fade-in duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm ${
            toast.type === "success" 
              ? "bg-emerald-500/20 border border-emerald-500/50" 
              : "bg-red-500/20 border border-red-500/50"
          }`}>
            <CheckCircle className={`h-5 w-5 ${toast.type === "success" ? "text-emerald-400" : "text-red-400"}`} />
            <span className={`font-medium ${toast.type === "success" ? "text-emerald-100" : "text-red-100"}`}>
              {toast.message}
            </span>
            <button 
              onClick={() => setToast({ show: false, message: "", type: "success" })}
              className={`ml-2 transition-colors ${
                toast.type === "success" 
                  ? "text-emerald-400 hover:text-emerald-300" 
                  : "text-red-400 hover:text-red-300"
              }`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
