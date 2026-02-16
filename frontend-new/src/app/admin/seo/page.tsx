"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search,
  Globe,
  Share2,
  BarChart3,
  Save,
  RefreshCw,
  ExternalLink,
  FileText,
  Code,
  CheckCircle,
  AlertTriangle,
  Settings2,
  Link2,
  Image as ImageIcon,
  Twitter,
  Facebook,
  Plus,
  Trash2,
  HelpCircle,
  Eye,
  ChevronDown,
  ChevronUp,
  Loader2,
  Database,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { defaultPageSEO, type PageSEOConfig } from "@/lib/page-seo";

interface SEOSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  defaultOgImage: string;
  favicon: string;
  googleAnalyticsId: string;
  googleSearchConsoleId: string;
  facebookPixelId: string;
  twitterHandle: string;
  facebookUrl: string;
  instagramUrl: string;
  telegramUrl: string;
  linkedinUrl: string;
  allowIndexing: boolean;
  generateSitemap: boolean;
  customHeadCode: string;
  customBodyCode: string;
}

interface PageSEO {
  path: string;
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  noIndex: boolean;
  h1?: string;
  type: "static" | "pos-system" | "establishment" | "equipment" | "supplier" | "delivery" | "qr-menu" | "blog" | "category" | "aggregator";
}

const defaultSettings: SEOSettings = {
  siteName: "ZakladUA",
  siteDescription: "B2B платформа для ресторанного бізнесу в Україні",
  siteUrl: "https://zaklad.ua",
  defaultOgImage: "/images/og-image.jpg",
  favicon: "/favicon.ico",
  googleAnalyticsId: "",
  googleSearchConsoleId: "",
  facebookPixelId: "",
  twitterHandle: "@zakladua",
  facebookUrl: "https://facebook.com/zakladua",
  instagramUrl: "https://instagram.com/zakladua",
  telegramUrl: "https://t.me/zakladua",
  linkedinUrl: "",
  allowIndexing: true,
  generateSitemap: true,
  customHeadCode: "",
  customBodyCode: "",
};

// Convert static pages from config
const getStaticPages = (): PageSEO[] => {
  return Object.entries(defaultPageSEO)
    .filter(([path]) => !path.includes("[slug]") && !path.includes("[id]"))
    .map(([path, seo]) => ({
      path,
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords.join(", "),
      ogImage: seo.ogImage || "",
      noIndex: false,
      h1: seo.h1 || seo.title.split(" - ")[0],
      type: "static" as const,
    }));
};

const API_URL = "http://localhost:3001/api/v1";

// Helper to fetch with language header
const fetchAPI = async (endpoint: string) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { "x-lang": "uk", "Content-Type": "application/json" },
  });
  return res.json();
};

export default function SEOPage() {
  const [settings, setSettings] = useState<SEOSettings>(defaultSettings);
  const [pages, setPages] = useState<PageSEO[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pages");
  const [expandedPage, setExpandedPage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [loadingStatus, setLoadingStatus] = useState<string>("");

  // Filter pages
  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || page.type === filterType;
    return matchesSearch && matchesType;
  });

  // Count by type
  const pageCounts: Record<string, number> = {
    all: pages.length,
    static: pages.filter((p) => p.type === "static").length,
    "pos-system": pages.filter((p) => p.type === "pos-system").length,
    establishment: pages.filter((p) => p.type === "establishment").length,
    equipment: pages.filter((p) => p.type === "equipment").length,
    supplier: pages.filter((p) => p.type === "supplier").length,
    delivery: pages.filter((p) => p.type === "delivery").length,
    "qr-menu": pages.filter((p) => p.type === "qr-menu").length,
    blog: pages.filter((p) => p.type === "blog").length,
    category: pages.filter((p) => p.type === "category").length,
    aggregator: pages.filter((p) => p.type === "aggregator").length,
  };

  // Load ALL pages from API
  const loadAllPages = useCallback(async () => {
    setLoading(true);
    const allPages: PageSEO[] = [...getStaticPages()];

    // Helper functions
    const isAggregator = (slug?: string): boolean => {
      if (!slug) return false;
      return slug === "aggregators" || slug.includes("aggregator");
    };

    const getTypeFromCategory = (slug?: string): PageSEO["type"] => {
      if (!slug) return "pos-system";
      if (isAggregator(slug)) return "aggregator";
      if (slug === "pos-systems" || slug === "pos") return "pos-system";
      if (slug === "equipment" || slug.includes("equipment")) return "equipment";
      if (slug === "suppliers" || slug.includes("supplier")) return "supplier";
      if (slug === "delivery" || slug.includes("delivery")) return "delivery";
      if (slug === "qr-menu" || slug.includes("qr")) return "qr-menu";
      return "category"; // Unknown categories
    };

    const getBasePath = (slug?: string): string => {
      if (!slug) return "/pos-systems";
      if (isAggregator(slug)) return "/aggregators";
      if (slug === "pos-systems" || slug === "pos") return "/pos-systems";
      if (slug === "equipment" || slug.includes("equipment")) return "/equipment";
      if (slug === "suppliers" || slug.includes("supplier")) return "/suppliers";
      if (slug === "delivery" || slug.includes("delivery")) return "/delivery";
      if (slug === "qr-menu" || slug.includes("qr")) return "/qr-menu";
      return `/${slug}`; // Use slug as path for unknown categories
    };

    const getTypeLabel = (slug?: string): string => {
      if (!slug) return "POS-система";
      if (isAggregator(slug)) return "агрегатор";
      if (slug === "pos-systems" || slug === "pos") return "POS-система";
      if (slug === "equipment" || slug.includes("equipment")) return "обладнання";
      if (slug === "suppliers" || slug.includes("supplier")) return "постачальник";
      if (slug === "delivery" || slug.includes("delivery")) return "сервіс доставки";
      if (slug === "qr-menu" || slug.includes("qr")) return "QR-меню";
      return "сервіс";
    };

    // 1. Load POS Systems (includes all service types)
    setLoadingStatus("Завантаження POS-систем, обладнання, доставки...");
    try {
      const data = await fetchAPI("/pos-systems?limit=100");
      if (data?.data) {
        data.data.forEach((item: any) => {
          const catSlug = item.category?.slug;
          const pageType = getTypeFromCategory(catSlug);
          const basePath = getBasePath(catSlug);
          const typeLabel = getTypeLabel(catSlug);

          allPages.push({
            path: `${basePath}/${item.slug}`,
            title: `${item.name} - ${typeLabel} | ZakladUA`,
            description: item.shortDescription || item.description?.slice(0, 155) || `${item.name} - огляд, функції, ціни, відгуки`,
            keywords: `${item.name}, ${item.category?.name || typeLabel}, ресторан, HoReCa`,
            ogImage: item.logoUrl || "",
            noIndex: false,
            h1: item.name,
            type: pageType,
          });
        });
      }
    } catch (e) {
      console.error("Error loading services:", e);
    }

    // 2. Load Establishments
    setLoadingStatus("Завантаження закладів...");
    try {
      const data = await fetchAPI("/establishments?limit=100");
      if (data?.data) {
        data.data.forEach((item: any) => {
          allPages.push({
            path: `/establishments/${item.slug}`,
            title: `${item.name}${item.city?.name ? ` - ${item.city.name}` : ""} | ZakladUA`,
            description: item.description?.slice(0, 155) || `${item.name} - меню, відгуки, контакти`,
            keywords: `${item.name}, ${item.category?.name || "ресторан"}, ${item.city?.name || "Україна"}`,
            ogImage: item.coverUrl || "",
            noIndex: false,
            h1: item.name,
            type: "establishment",
          });
        });
      }
    } catch (e) {
      console.error("Error loading establishments:", e);
    }

    // 3. Load Categories
    setLoadingStatus("Завантаження категорій...");
    try {
      const data = await fetchAPI("/categories");
      const categories = Array.isArray(data) ? data : data?.data || [];
      
      categories.forEach((cat: any) => {
        let basePath = "/establishments";
        if (cat.slug === "equipment" || cat.slug.includes("equipment")) basePath = "/equipment";
        else if (cat.slug === "pos-systems" || cat.slug.includes("pos")) basePath = "/pos-systems";
        else if (cat.slug === "suppliers" || cat.slug.includes("supplier")) basePath = "/suppliers";
        else if (cat.slug === "delivery" || cat.slug.includes("delivery")) basePath = "/delivery";
        else if (cat.slug === "qr-menu" || cat.slug.includes("qr")) basePath = "/qr-menu";

        allPages.push({
          path: `${basePath}/category/${cat.slug}`,
          title: `${cat.name} - каталог | ZakladUA`,
          description: cat.description?.slice(0, 155) || `${cat.name} - каталог, порівняння, відгуки`,
          keywords: `${cat.name}, категорія, каталог`,
          ogImage: "",
          noIndex: false,
          h1: cat.name,
          type: "category",
        });

        // Child categories
        if (cat.children?.length > 0) {
          cat.children.forEach((child: any) => {
            allPages.push({
              path: `${basePath}/category/${child.slug}`,
              title: `${child.name} - ${cat.name} | ZakladUA`,
              description: child.description?.slice(0, 155) || `${child.name} - каталог`,
              keywords: `${child.name}, ${cat.name}, категорія`,
              ogImage: "",
              noIndex: false,
              h1: child.name,
              type: "category",
            });
          });
        }
      });
    } catch (e) {
      console.error("Error loading categories:", e);
    }

    // 4. Load Blog
    setLoadingStatus("Завантаження блогу...");
    try {
      const data = await fetchAPI("/blog?limit=100");
      if (data?.data) {
        data.data.forEach((item: any) => {
          allPages.push({
            path: `/blog/${item.slug}`,
            title: `${item.title} | Блог ZakladUA`,
            description: item.metaDescription || item.excerpt?.slice(0, 155) || item.title,
            keywords: `${item.title}, блог, HoReCa`,
            ogImage: item.coverUrl || "",
            noIndex: false,
            h1: item.title,
            type: "blog",
          });
        });
      }
    } catch (e) {
      console.error("Error loading blog:", e);
    }

    // Merge with saved overrides
    const saved = localStorage.getItem("zakladua-seo-pages");
    if (saved) {
      try {
        const savedPages = JSON.parse(saved);
        allPages.forEach((page, idx) => {
          const override = savedPages.find((s: PageSEO) => s.path === page.path);
          if (override) {
            allPages[idx] = { ...page, ...override, type: page.type };
          }
        });
      } catch (e) {}
    }

    // Remove duplicates by path (keep LAST occurrence - dynamic pages override static)
    const uniquePages = allPages.filter((page, index, self) => 
      index === self.findLastIndex((p) => p.path === page.path)
    );

    setPages(uniquePages);
    setLoadingStatus("");
    setLoading(false);
  }, []);

  // Load on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("zakladua-seo-settings");
    if (savedSettings) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      } catch (e) {}
    }
    loadAllPages();
  }, [loadAllPages]);

  // Save
  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem("zakladua-seo-settings", JSON.stringify(settings));
      localStorage.setItem("zakladua-seo-pages", JSON.stringify(pages));
      
      // Save individual pages for page-seo.ts consumption
      pages.forEach((page) => {
        localStorage.setItem(`zakladua-seo-${page.path}`, JSON.stringify({
          title: page.title,
          description: page.description,
          keywords: page.keywords.split(",").map((k) => k.trim()),
          ogImage: page.ogImage,
          h1: page.h1,
        }));
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error("Save error:", e);
    } finally {
      setSaving(false);
    }
  };

  // Update page
  const updatePage = (path: string, field: keyof PageSEO, value: any) => {
    setPages((prev) => prev.map((p) => (p.path === path ? { ...p, [field]: value } : p)));
  };

  // Page completeness
  const getCompleteness = (page: PageSEO) => {
    let score = 0;
    if (page.title.length > 10) score += 25;
    if (page.description.length >= 50) score += 25;
    if (page.keywords.length > 5) score += 25;
    if (page.h1 && page.h1.length > 3) score += 25;
    return score;
  };

  // SEO score
  const seoScore = Math.round(
    (settings.siteName ? 15 : 0) +
    (settings.siteDescription.length >= 50 ? 15 : 0) +
    (settings.defaultOgImage ? 15 : 0) +
    (settings.googleAnalyticsId ? 15 : 0) +
    (settings.twitterHandle || settings.facebookUrl ? 15 : 0) +
    (settings.allowIndexing ? 15 : 0) +
    (settings.generateSitemap ? 10 : 0)
  );

  const typeLabels: Record<string, { label: string; color: string }> = {
    static: { label: "Статична", color: "bg-blue-500/20 text-blue-400 border-blue-500" },
    "pos-system": { label: "POS", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500" },
    establishment: { label: "Заклад", color: "bg-amber-500/20 text-amber-400 border-amber-500" },
    equipment: { label: "Обладн.", color: "bg-violet-500/20 text-violet-400 border-violet-500" },
    supplier: { label: "Постач.", color: "bg-pink-500/20 text-pink-400 border-pink-500" },
    delivery: { label: "Достав.", color: "bg-orange-500/20 text-orange-400 border-orange-500" },
    "qr-menu": { label: "QR", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500" },
    blog: { label: "Блог", color: "bg-rose-500/20 text-rose-400 border-rose-500" },
    category: { label: "Катег.", color: "bg-indigo-500/20 text-indigo-400 border-indigo-500" },
    aggregator: { label: "Агрег.", color: "bg-gray-500/20 text-gray-400 border-gray-500" },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
            <Zap className="h-7 w-7 text-amber-400" />
            Auto-SEO для всього сайту
          </h1>
          <p className="text-zinc-400 mt-1">
            Автоматичне SEO для {pages.length} сторінок • {loadingStatus || "Готово"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={loadAllPages} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Оновити
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-amber-500 hover:bg-amber-600 text-zinc-900">
            {saving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : saved ? <CheckCircle className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            {saved ? "Збережено!" : "Зберегти"}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-3">
            <p className="text-xs text-zinc-500">Всього</p>
            <p className="text-xl font-bold text-zinc-100">{pages.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-3">
            <p className="text-xs text-zinc-500">POS + Сервіси</p>
            <p className="text-xl font-bold text-emerald-400">{pageCounts["pos-system"] + pageCounts.equipment + pageCounts.delivery + pageCounts["qr-menu"] + pageCounts.supplier}</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-3">
            <p className="text-xs text-zinc-500">Заклади</p>
            <p className="text-xl font-bold text-amber-400">{pageCounts.establishment}</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-3">
            <p className="text-xs text-zinc-500">Категорії</p>
            <p className="text-xl font-bold text-indigo-400">{pageCounts.category}</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-3">
            <p className="text-xs text-zinc-500">SEO Score</p>
            <p className={`text-xl font-bold ${seoScore >= 80 ? "text-emerald-400" : seoScore >= 50 ? "text-amber-400" : "text-red-400"}`}>{seoScore}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="pages" className="data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-900">
            <FileText className="h-4 w-4 mr-2" />
            Сторінки ({pages.length})
          </TabsTrigger>
          <TabsTrigger value="general" className="data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-900">
            <Globe className="h-4 w-4 mr-2" />
            Загальні
          </TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-900">
            <Share2 className="h-4 w-4 mr-2" />
            Соцмережі
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-900">
            <BarChart3 className="h-4 w-4 mr-2" />
            Аналітика
          </TabsTrigger>
        </TabsList>

        {/* Pages Tab */}
        <TabsContent value="pages" className="mt-4">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-zinc-100 flex items-center gap-2">
                    <Database className="h-5 w-5 text-amber-400" />
                    SEO для всіх сторінок
                    {loading && <Loader2 className="h-4 w-4 animate-spin text-amber-400" />}
                  </CardTitle>
                  <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Пошук по URL або назві..."
                      className="pl-10 bg-zinc-800/50 border-zinc-700"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                  {Object.entries(typeLabels).map(([key, { label }]) => (
                    <Button
                      key={key}
                      variant={filterType === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterType(filterType === key ? "all" : key)}
                      className={filterType === key ? "bg-amber-500 text-zinc-900" : ""}
                    >
                      {label}
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {pageCounts[key] || 0}
                      </Badge>
                    </Button>
                  ))}
                  {filterType !== "all" && (
                    <Button variant="ghost" size="sm" onClick={() => setFilterType("all")}>
                      Скинути
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="text-center py-8 text-zinc-500">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p>{loadingStatus || "Завантаження..."}</p>
                </div>
              ) : filteredPages.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  Нічого не знайдено
                </div>
              ) : (
                filteredPages.map((page, idx) => (
                  <div key={`${page.path}-${idx}`} className="rounded-lg bg-zinc-800/30 overflow-hidden">
                    <div
                      className="p-3 flex items-center justify-between cursor-pointer hover:bg-zinc-800/50"
                      onClick={() => setExpandedPage(expandedPage === page.path ? null : page.path)}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Badge variant="outline" className={`text-xs shrink-0 ${typeLabels[page.type]?.color || ""}`}>
                          {typeLabels[page.type]?.label || page.type}
                        </Badge>
                        <span className="font-mono text-xs text-amber-400 truncate">{page.path}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={getCompleteness(page) >= 75 ? "default" : getCompleteness(page) >= 50 ? "secondary" : "destructive"} className="text-xs">
                          {getCompleteness(page)}%
                        </Badge>
                        {expandedPage === page.path ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>

                    {expandedPage === page.path && (
                      <div className="p-4 pt-2 space-y-3 border-t border-zinc-700/50">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">Title ({page.title.length}/60)</Label>
                            <Input
                              value={page.title}
                              onChange={(e) => updatePage(page.path, "title", e.target.value)}
                              className="bg-zinc-800/50 border-zinc-700 text-sm mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">H1</Label>
                            <Input
                              value={page.h1 || ""}
                              onChange={(e) => updatePage(page.path, "h1", e.target.value)}
                              className="bg-zinc-800/50 border-zinc-700 text-sm mt-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">Description ({page.description.length}/160)</Label>
                          <Textarea
                            value={page.description}
                            onChange={(e) => updatePage(page.path, "description", e.target.value)}
                            className="bg-zinc-800/50 border-zinc-700 text-sm mt-1"
                            rows={2}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">Keywords</Label>
                            <Input
                              value={page.keywords}
                              onChange={(e) => updatePage(page.path, "keywords", e.target.value)}
                              className="bg-zinc-800/50 border-zinc-700 text-sm mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">OG Image</Label>
                            <Input
                              value={page.ogImage}
                              onChange={(e) => updatePage(page.path, "ogImage", e.target.value)}
                              className="bg-zinc-800/50 border-zinc-700 text-sm mt-1"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2">
                            <Switch checked={page.noIndex} onCheckedChange={(v) => updatePage(page.path, "noIndex", v)} />
                            <span className="text-xs text-zinc-500">noindex</span>
                          </div>
                          <a href={page.path} target="_blank" className="text-xs text-amber-400 hover:underline flex items-center gap-1">
                            <Eye className="h-3 w-3" /> Переглянути
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* General Tab */}
        <TabsContent value="general" className="mt-4">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-100">Загальні налаштування</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Назва сайту</Label>
                  <Input value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} className="bg-zinc-800/50 border-zinc-700 mt-1" />
                </div>
                <div>
                  <Label>URL сайту</Label>
                  <Input value={settings.siteUrl} onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })} className="bg-zinc-800/50 border-zinc-700 mt-1" />
                </div>
              </div>
              <div>
                <Label>Опис сайту ({settings.siteDescription.length}/160)</Label>
                <Textarea value={settings.siteDescription} onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })} className="bg-zinc-800/50 border-zinc-700 mt-1" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>OG Image</Label>
                  <Input value={settings.defaultOgImage} onChange={(e) => setSettings({ ...settings, defaultOgImage: e.target.value })} className="bg-zinc-800/50 border-zinc-700 mt-1" />
                </div>
                <div>
                  <Label>Favicon</Label>
                  <Input value={settings.favicon} onChange={(e) => setSettings({ ...settings, favicon: e.target.value })} className="bg-zinc-800/50 border-zinc-700 mt-1" />
                </div>
              </div>
              <div className="flex gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <Switch checked={settings.allowIndexing} onCheckedChange={(v) => setSettings({ ...settings, allowIndexing: v })} />
                  <span>Дозволити індексацію</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={settings.generateSitemap} onCheckedChange={(v) => setSettings({ ...settings, generateSitemap: v })} />
                  <span>Генерувати Sitemap</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Tab */}
        <TabsContent value="social" className="mt-4">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-100">Соціальні мережі</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Twitter</Label>
                  <Input value={settings.twitterHandle} onChange={(e) => setSettings({ ...settings, twitterHandle: e.target.value })} placeholder="@zakladua" className="bg-zinc-800/50 border-zinc-700 mt-1" />
                </div>
                <div>
                  <Label>Facebook</Label>
                  <Input value={settings.facebookUrl} onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })} className="bg-zinc-800/50 border-zinc-700 mt-1" />
                </div>
                <div>
                  <Label>Instagram</Label>
                  <Input value={settings.instagramUrl} onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })} className="bg-zinc-800/50 border-zinc-700 mt-1" />
                </div>
                <div>
                  <Label>Telegram</Label>
                  <Input value={settings.telegramUrl} onChange={(e) => setSettings({ ...settings, telegramUrl: e.target.value })} className="bg-zinc-800/50 border-zinc-700 mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-4">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-100">Аналітика</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Google Analytics ID</Label>
                  <Input value={settings.googleAnalyticsId} onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })} placeholder="G-XXXXXXXXXX" className="bg-zinc-800/50 border-zinc-700 mt-1 font-mono" />
                </div>
                <div>
                  <Label>Google Search Console</Label>
                  <Input value={settings.googleSearchConsoleId} onChange={(e) => setSettings({ ...settings, googleSearchConsoleId: e.target.value })} className="bg-zinc-800/50 border-zinc-700 mt-1 font-mono" />
                </div>
                <div>
                  <Label>Facebook Pixel ID</Label>
                  <Input value={settings.facebookPixelId} onChange={(e) => setSettings({ ...settings, facebookPixelId: e.target.value })} className="bg-zinc-800/50 border-zinc-700 mt-1 font-mono" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
