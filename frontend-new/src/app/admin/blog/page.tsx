"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Save, 
  Plus, 
  Trash2, 
  Edit,
  Eye,
  Clock,
  CheckCircle,
  X,
  Search,
  ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, endpoints } from "@/lib/api";

interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: number;
  views: number;
  date: string;
  image: string;
  published: boolean;
}

const defaultArticles: BlogArticle[] = [
  {
    id: "0",
    slug: "restaurant-trends-2024",
    title: "Ресторанні тренди 2024: що змінюється в індустрії",
    excerpt: "Огляд головних трендів у ресторанному бізнесі України — від технологій до концепцій закладів",
    content: "Повний текст статті...",
    category: "Тренди",
    readTime: 12,
    views: 4500,
    date: "2024-01-05",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200",
    published: true,
  },
  {
    id: "1",
    slug: "how-to-open-restaurant",
    title: "Як відкрити ресторан у 2024 році: покроковий гайд",
    excerpt: "Все, що потрібно знати перед відкриттям власного закладу",
    content: "Повний текст статті...",
    category: "Бізнес",
    readTime: 15,
    views: 3200,
    date: "2024-01-03",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600",
    published: true,
  },
  {
    id: "2",
    slug: "pos-system-comparison",
    title: "Порівняння POS-систем: Poster vs iiko vs Goovii",
    excerpt: "Детальний аналіз найпопулярніших систем автоматизації",
    content: "Повний текст статті...",
    category: "Технології",
    readTime: 10,
    views: 2800,
    date: "2024-01-01",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600",
    published: true,
  },
  {
    id: "3",
    slug: "menu-engineering",
    title: "Меню-інжиніринг: як збільшити прибуток на 30%",
    excerpt: "Секрети правильного складання меню для максимізації виручки",
    content: "Повний текст статті...",
    category: "Маркетинг",
    readTime: 8,
    views: 2100,
    date: "2023-12-28",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
    published: true,
  },
  {
    id: "4",
    slug: "staff-management",
    title: "Управління персоналом у ресторані: повний гайд",
    excerpt: "Як наймати, навчати та мотивувати команду",
    content: "Повний текст статті...",
    category: "Персонал",
    readTime: 11,
    views: 1900,
    date: "2023-12-25",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600",
    published: true,
  },
  {
    id: "5",
    slug: "delivery-optimization",
    title: "Оптимізація доставки: як заробляти більше",
    excerpt: "Стратегії роботи з агрегаторами та власною доставкою",
    content: "Повний текст статті...",
    category: "Доставка",
    readTime: 9,
    views: 1700,
    date: "2023-12-22",
    image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600",
    published: true,
  },
  {
    id: "6",
    slug: "restaurant-design",
    title: "Дизайн ресторану: тренди 2024 року",
    excerpt: "Актуальні ідеї для інтер'єру вашого закладу",
    content: "Повний текст статті...",
    category: "Дизайн",
    readTime: 7,
    views: 2400,
    date: "2023-12-20",
    image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600",
    published: true,
  },
  {
    id: "7",
    slug: "food-cost-control",
    title: "Контроль фудкосту: як не втрачати гроші",
    excerpt: "Практичні методи зниження собівартості страв",
    content: "Повний текст статті...",
    category: "Фінанси",
    readTime: 12,
    views: 2600,
    date: "2023-12-18",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600",
    published: true,
  },
  {
    id: "8",
    slug: "instagram-marketing",
    title: "Instagram для ресторану: повний гайд",
    excerpt: "Як залучати клієнтів через соціальні мережі",
    content: "Повний текст статті...",
    category: "Маркетинг",
    readTime: 10,
    views: 3100,
    date: "2023-12-15",
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600",
    published: true,
  },
  {
    id: "9",
    slug: "kitchen-equipment",
    title: "Обладнання для кухні: що обрати",
    excerpt: "Огляд професійного обладнання для ресторанів",
    content: "Повний текст статті...",
    category: "Обладнання",
    readTime: 14,
    views: 1800,
    date: "2023-12-12",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
    published: true,
  },
  {
    id: "10",
    slug: "customer-loyalty",
    title: "Програми лояльності: що працює в 2024",
    excerpt: "Як утримати клієнтів та збільшити повторні візити",
    content: "Повний текст статті...",
    category: "Маркетинг",
    readTime: 8,
    views: 2200,
    date: "2023-12-10",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600",
    published: true,
  },
];

const categories = [
  "Тренди",
  "Бізнес",
  "Технології",
  "Маркетинг",
  "Персонал",
  "Доставка",
  "Дизайн",
  "Фінанси",
  "Обладнання",
  "Меню",
  "Постачальники",
];

export default function AdminBlogPage() {
  const [articles, setArticles] = useState<BlogArticle[]>(defaultArticles);
  const [search, setSearch] = useState("");
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: "" });

  useEffect(() => {
    async function loadArticles() {
      try {
        const response = await api.get<{ data: any[] }>(endpoints.blog.list + "?limit=100");
        if (response.data && response.data.length > 0) {
          // Transform API data to match our interface
          const transformedArticles = response.data.map((a: any) => ({
            id: a.id,
            slug: a.slug,
            title: a.title,
            excerpt: a.excerpt || "",
            content: a.content || "",
            category: a.category || "Новини",
            readTime: Math.ceil((a.content?.length || 0) / 1500) || 5,
            views: a.viewCount || 0,
            date: a.publishedAt ? new Date(a.publishedAt).toISOString().split("T")[0] : new Date(a.createdAt).toISOString().split("T")[0],
            image: a.coverImage || "",
            published: a.status === "ACTIVE",
          }));
          setArticles(transformedArticles);
        }
      } catch (error) {
        console.error("Failed to load articles from API, using defaults:", error);
        // Fallback to localStorage
        const saved = localStorage.getItem("zakladua-blog-articles");
        if (saved) {
          setArticles(JSON.parse(saved));
        }
      }
      setLoaded(true);
    }
    loadArticles();
  }, []);

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const saveArticlesToLocal = (newArticles: BlogArticle[]) => {
    setArticles(newArticles);
    localStorage.setItem("zakladua-blog-articles", JSON.stringify(newArticles));
  };

  const handleSaveArticle = async () => {
    if (!editingArticle) return;
    
    setSaving(true);

    try {
      // Prepare data for API
      const apiData = {
        slug: editingArticle.slug || editingArticle.title.toLowerCase()
          .replace(/[^a-zа-яіїєґ0-9\s]/g, '')
          .replace(/\s+/g, '-'),
        title: editingArticle.title,
        excerpt: editingArticle.excerpt,
        content: editingArticle.content,
        coverImage: editingArticle.image,
        category: editingArticle.category,
        status: editingArticle.published ? "ACTIVE" : "PENDING",
        publishedAt: editingArticle.published ? new Date().toISOString() : null,
      };

      if (editingArticle.id && editingArticle.id.length > 10) {
        // Update existing (real UUID from API)
        await api.put(endpoints.blog.update(editingArticle.id), apiData);
        const updated = articles.map(a => 
          a.id === editingArticle.id ? editingArticle : a
        );
        saveArticlesToLocal(updated);
      } else {
        // Create new
        const response = await api.post<any>(endpoints.blog.create, apiData);
        const newArticle = {
          ...editingArticle,
          id: response.id,
          slug: response.slug,
          views: 0,
          date: new Date().toISOString().split('T')[0],
        };
        saveArticlesToLocal([newArticle, ...articles]);
      }

      setIsDialogOpen(false);
      setEditingArticle(null);
      showToast("Статтю збережено!");
    } catch (error) {
      console.error("Failed to save article:", error);
      showToast("Помилка збереження!");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (confirm("Ви впевнені, що хочете видалити цю статтю?")) {
      try {
        // Only call API delete if it's a real UUID (not a local ID)
        if (id.length > 10) {
          await api.delete(endpoints.blog.delete(id));
        }
        saveArticlesToLocal(articles.filter(a => a.id !== id));
        showToast("Статтю видалено!");
      } catch (error) {
        console.error("Failed to delete article:", error);
        showToast("Помилка видалення!");
      }
    }
  };

  const handleNewArticle = () => {
    setEditingArticle({
      id: "",
      slug: "",
      title: "",
      excerpt: "",
      content: "",
      category: "Бізнес",
      readTime: 5,
      views: 0,
      date: new Date().toISOString().split('T')[0],
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
      published: false,
    });
    setIsDialogOpen(true);
  };

  const handleEditArticle = (article: BlogArticle) => {
    setEditingArticle({ ...article });
    setIsDialogOpen(true);
  };

  const filteredArticles = articles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-zinc-100">Управління блогом</h1>
          <p className="text-zinc-400 mt-1">{articles.length} статей</p>
        </div>
        <Button
          className="bg-amber-500 hover:bg-amber-600 text-zinc-900"
          onClick={handleNewArticle}
        >
          <Plus className="h-4 w-4 mr-2" />
          Нова стаття
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
        <Input
          placeholder="Пошук статей..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12"
        />
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="relative w-full md:w-48 h-32 md:h-auto bg-zinc-800">
                  {article.image ? (
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full min-h-[128px] flex items-center justify-center text-zinc-600">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                  {!article.published && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-zinc-900/80 text-zinc-400 text-xs rounded">
                      Чернетка
                    </div>
                  )}
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-medium rounded">
                          {article.category}
                        </span>
                        <span className="text-xs text-zinc-500">{article.date}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-zinc-100 mb-1">
                        {article.title}
                      </h3>
                      <p className="text-sm text-zinc-400 mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.readTime} хв
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {article.views}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => handleEditArticle(article)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() => handleDeleteArticle(article.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-400">Статей не знайдено</p>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingArticle?.id ? "Редагувати статтю" : "Нова стаття"}
            </DialogTitle>
          </DialogHeader>
          
          {editingArticle && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Заголовок</Label>
                <Input
                  value={editingArticle.title}
                  onChange={(e) => setEditingArticle({...editingArticle, title: e.target.value})}
                  placeholder="Введіть заголовок статті"
                />
              </div>

              <div className="space-y-2">
                <Label>Короткий опис</Label>
                <Textarea
                  value={editingArticle.excerpt}
                  onChange={(e) => setEditingArticle({...editingArticle, excerpt: e.target.value})}
                  placeholder="Короткий опис для превью"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Текст статті</Label>
                <Textarea
                  value={editingArticle.content}
                  onChange={(e) => setEditingArticle({...editingArticle, content: e.target.value})}
                  placeholder="Повний текст статті..."
                  rows={10}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Категорія</Label>
                  <Select 
                    value={editingArticle.category}
                    onValueChange={(value) => setEditingArticle({...editingArticle, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Час читання (хв)</Label>
                  <Input
                    type="number"
                    value={editingArticle.readTime}
                    onChange={(e) => setEditingArticle({...editingArticle, readTime: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>URL зображення</Label>
                <div className="flex gap-2">
                  <Input
                    value={editingArticle.image}
                    onChange={(e) => setEditingArticle({...editingArticle, image: e.target.value})}
                    placeholder="https://..."
                  />
                  <Button variant="outline" size="icon">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </div>
                {editingArticle.image && (
                  <div className="relative h-40 rounded-lg overflow-hidden">
                    <Image
                      src={editingArticle.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={editingArticle.published}
                  onChange={(e) => setEditingArticle({...editingArticle, published: e.target.checked})}
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-amber-500 focus:ring-amber-500"
                />
                <Label htmlFor="published">Опублікувати статтю</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Скасувати
                </Button>
                <Button 
                  className="bg-amber-500 hover:bg-amber-600 text-zinc-900"
                  onClick={handleSaveArticle}
                  disabled={saving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Збереження..." : "Зберегти"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Toast */}
      {toast.show && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right fade-in duration-300">
          <div className="flex items-center gap-3 px-4 py-3 bg-emerald-500/20 border border-emerald-500/50 rounded-xl shadow-lg backdrop-blur-sm">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <span className="text-emerald-100 font-medium">{toast.message}</span>
            <button 
              onClick={() => setToast({ show: false, message: "" })}
              className="ml-2 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
