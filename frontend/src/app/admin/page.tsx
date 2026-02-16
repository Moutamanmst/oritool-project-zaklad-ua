"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Store,
  Monitor,
  Eye,
  Star,
  RefreshCw,
  CheckCircle,
  Clock,
  Package,
  Truck,
  QrCode,
  Newspaper,
  Users,
  Search,
  TrendingUp,
  ExternalLink,
  Edit,
  Plus,
  AlertTriangle,
  CheckSquare,
  Square,
  Zap,
  FileText,
  ImageOff,
  Link2,
  ArrowUpRight,
  Sparkles,
  Calendar,
  Target,
  Award,
  BarChart3,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { api, endpoints } from "@/lib/api";
import { useToast } from "@/components/ui/toast-notification";

interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  coverUrl?: string;
  description?: string;
  category?: { slug: string; name: string };
  viewCount: number;
  averageRating: number;
  status: string;
  createdAt: string;
}

interface TodoItem {
  id: string;
  text: string;
  type: "seo" | "content" | "moderation" | "marketing";
  priority: "high" | "medium" | "low";
  link?: string;
  completed: boolean;
}

interface SEOIssue {
  id: string;
  name: string;
  slug: string;
  issues: string[];
  category?: string;
}

export default function AdminDashboard() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ServiceItem[]>([]);
  const [searching, setSearching] = useState(false);
  
  // Stats
  const [stats, setStats] = useState({
    totalServices: 0,
    totalUsers: 0,
    totalBlogPosts: 0,
    pendingReviews: 0,
    totalViews: 0,
    avgRating: 0,
  });
  
  // Lists
  const [recentItems, setRecentItems] = useState<ServiceItem[]>([]);
  const [seoIssues, setSeoIssues] = useState<SEOIssue[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  
  // Content health score
  const [healthScore, setHealthScore] = useState(0);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [usersData, posSystemsData, blogData] = await Promise.all([
        api.get<{ data: any[]; meta?: { total: number } }>(`${endpoints.users.list}?limit=1`).catch(() => ({ data: [], meta: { total: 0 } })),
        api.get<{ data: any[]; meta?: { total: number } }>(`${endpoints.posSystems.list}?limit=100&sortBy=createdAt&sortOrder=desc`).catch(() => ({ data: [], meta: { total: 0 } })),
        api.get<{ data: any[]; meta?: { total: number } }>(`${endpoints.blog.list}?limit=50`).catch(() => ({ data: [], meta: { total: 0 } })),
      ]);

      const users = usersData.data || [];
      const posSystems = posSystemsData.data || [];
      const blogPosts = blogData.data || [];

      // Calculate stats
      const totalViews = posSystems.reduce((sum: number, p: any) => sum + (p.viewCount || 0), 0);
      const ratingsSum = posSystems.reduce((sum: number, p: any) => sum + (p.averageRating || 0), 0);
      const itemsWithRating = posSystems.filter((p: any) => p.averageRating > 0).length;

      setStats({
        totalServices: posSystemsData.meta?.total || posSystems.length,
        totalUsers: usersData.meta?.total || users.length,
        totalBlogPosts: blogData.meta?.total || blogPosts.length,
        pendingReviews: 0,
        totalViews,
        avgRating: itemsWithRating > 0 ? ratingsSum / itemsWithRating : 0,
      });

      // Recent items
      setRecentItems(posSystems.slice(0, 5).map((item: any) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        logoUrl: item.logoUrl,
        coverUrl: item.coverUrl,
        description: item.description,
        category: item.category,
        viewCount: item.viewCount || 0,
        averageRating: item.averageRating || 0,
        status: item.status,
        createdAt: item.createdAt,
      })));

      // Analyze SEO issues
      const issues: SEOIssue[] = [];
      let healthPoints = 100;
      
      posSystems.forEach((item: any) => {
        const itemIssues: string[] = [];
        
        if (!item.logoUrl) {
          itemIssues.push("Немає логотипу");
          healthPoints -= 2;
        }
        if (!item.coverUrl) {
          itemIssues.push("Немає обкладинки");
          healthPoints -= 1;
        }
        if (!item.description || item.description.length < 100) {
          itemIssues.push("Короткий опис (< 100 символів)");
          healthPoints -= 3;
        }
        if (!item.shortDescription) {
          itemIssues.push("Немає короткого опису");
          healthPoints -= 1;
        }
        
        if (itemIssues.length > 0) {
          issues.push({
            id: item.id,
            name: item.name,
            slug: item.slug,
            issues: itemIssues,
            category: item.category?.slug,
          });
        }
      });

      setSeoIssues(issues.slice(0, 10));
      setHealthScore(Math.max(0, Math.min(100, healthPoints)));

      // Generate smart todos
      const generatedTodos: TodoItem[] = [];
      
      if (issues.length > 5) {
        generatedTodos.push({
          id: "seo-1",
          text: `Виправити SEO проблеми у ${issues.length} елементів`,
          type: "seo",
          priority: "high",
          completed: false,
        });
      }
      
      const itemsWithoutLogo = posSystems.filter((p: any) => !p.logoUrl).length;
      if (itemsWithoutLogo > 0) {
        generatedTodos.push({
          id: "content-1",
          text: `Додати логотипи для ${itemsWithoutLogo} сервісів`,
          type: "content",
          priority: "high",
          completed: false,
        });
      }

      const itemsWithShortDesc = posSystems.filter((p: any) => !p.description || p.description.length < 100).length;
      if (itemsWithShortDesc > 0) {
        generatedTodos.push({
          id: "content-2",
          text: `Розширити описи для ${itemsWithShortDesc} сервісів`,
          type: "content",
          priority: "medium",
          completed: false,
        });
      }

      if (blogPosts.length < 10) {
        generatedTodos.push({
          id: "marketing-1",
          text: `Написати більше статей (зараз ${blogPosts.length})`,
          type: "marketing",
          priority: "medium",
          link: "/admin/blog",
          completed: false,
        });
      }

      // Load saved todos from localStorage
      const savedTodos = localStorage.getItem("admin-todos");
      if (savedTodos) {
        const parsed = JSON.parse(savedTodos);
        // Merge saved completion status
        generatedTodos.forEach(todo => {
          const saved = parsed.find((t: TodoItem) => t.id === todo.id);
          if (saved) {
            todo.completed = saved.completed;
          }
        });
      }

      setTodos(generatedTodos);

    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    setSearching(true);
    try {
      const data = await api.get<{ data: any[] }>(`${endpoints.posSystems.list}?search=${encodeURIComponent(searchQuery)}&limit=10`);
      setSearchResults(data.data || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setSearching(false);
    }
  };

  const toggleTodo = (id: string) => {
    const updated = todos.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTodos(updated);
    localStorage.setItem("admin-todos", JSON.stringify(updated));
    showToast("Завдання оновлено");
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) handleSearch();
      else setSearchResults([]);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getCategoryInfo = (slug?: string) => {
    const info: Record<string, { label: string; color: string; href: string }> = {
      "pos-systems": { label: "POS", color: "bg-emerald-500/20 text-emerald-400", href: "/admin/pos-systems" },
      "pos": { label: "POS", color: "bg-emerald-500/20 text-emerald-400", href: "/admin/pos-systems" },
      "equipment": { label: "Обладнання", color: "bg-orange-500/20 text-orange-400", href: "/admin/equipment" },
      "equipment-aggregators": { label: "Обладнання", color: "bg-orange-500/20 text-orange-400", href: "/admin/equipment" },
      "suppliers": { label: "Постачальник", color: "bg-violet-500/20 text-violet-400", href: "/admin/suppliers" },
      "delivery": { label: "Доставка", color: "bg-pink-500/20 text-pink-400", href: "/admin/delivery" },
      "delivery-aggregators": { label: "Доставка", color: "bg-pink-500/20 text-pink-400", href: "/admin/delivery" },
      "qr-menu": { label: "QR-меню", color: "bg-cyan-500/20 text-cyan-400", href: "/admin/qr-menu" },
      "qr-menu-aggregators": { label: "QR-меню", color: "bg-cyan-500/20 text-cyan-400", href: "/admin/qr-menu" },
      "aggregators": { label: "Агрегатор", color: "bg-indigo-500/20 text-indigo-400", href: "/admin/aggregators" },
    };
    return info[slug || ""] || { label: "Інше", color: "bg-zinc-500/20 text-zinc-400", href: "/admin" };
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  };

  const getHealthBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  const priorityColors = {
    high: "bg-red-500/20 text-red-400 border-red-500/30",
    medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    low: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  };

  const typeIcons = {
    seo: Target,
    content: FileText,
    moderation: CheckSquare,
    marketing: Sparkles,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Панель керування</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Здоров'я контенту: <span className={getHealthColor(healthScore)}>{healthScore}%</span>
          </p>
        </div>
        
        {/* Global Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Пошук..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-zinc-900 border-zinc-700 focus:border-amber-500"
          />
          
          {(searchResults.length > 0 || searching) && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
              {searching ? (
                <div className="p-4 text-center text-zinc-500">Пошук...</div>
              ) : (
                <div className="p-2 space-y-1">
                  {searchResults.map((item) => (
                    <Link 
                      key={item.id}
                      href={getCategoryInfo(item.category?.slug).href}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                    >
                      <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center">
                        {item.logoUrl ? (
                          <Image src={item.logoUrl} alt="" width={32} height={32} className="rounded" />
                        ) : (
                          <Package className="h-4 w-4 text-zinc-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-zinc-200 truncate">{item.name}</p>
                        <p className="text-xs text-zinc-500">{getCategoryInfo(item.category?.slug).label}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <Button onClick={fetchDashboardData} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Оновити
        </Button>
      </div>

      {/* Health Score Card */}
      <Card className="bg-gradient-to-r from-zinc-900 to-zinc-900/50 border-zinc-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${healthScore >= 80 ? 'bg-emerald-500/20' : healthScore >= 60 ? 'bg-amber-500/20' : 'bg-red-500/20'}`}>
                <BarChart3 className={`h-6 w-6 ${getHealthColor(healthScore)}`} />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-100">Здоров'я контенту</h3>
                <p className="text-sm text-zinc-500">На основі SEO та повноти даних</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-4xl font-bold ${getHealthColor(healthScore)}`}>{healthScore}%</p>
              <p className="text-xs text-zinc-500">{seoIssues.length} проблем знайдено</p>
            </div>
          </div>
          <Progress value={healthScore} className="h-2" />
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Сервісів", value: stats.totalServices, icon: Monitor, color: "text-emerald-400", href: "/admin/pos-systems" },
          { label: "Користувачів", value: stats.totalUsers, icon: Users, color: "text-blue-400", href: "/admin/users" },
          { label: "Статей", value: stats.totalBlogPosts, icon: Newspaper, color: "text-pink-400", href: "/admin/blog" },
          { label: "Переглядів", value: stats.totalViews, icon: Eye, color: "text-violet-400", href: "#" },
          { label: "Рейтинг", value: stats.avgRating.toFixed(1), icon: Star, color: "text-amber-400", href: "#" },
          { label: "Проблем", value: seoIssues.length, icon: AlertTriangle, color: "text-red-400", href: "#issues" },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer h-full">
              <CardContent className="p-4">
                <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
                <p className="text-2xl font-bold text-zinc-100">{loading ? "..." : stat.value}</p>
                <p className="text-xs text-zinc-500">{stat.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Todo List */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-zinc-200 text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-amber-500" />
                Рекомендації
              </span>
              <Badge variant="outline" className="text-xs">
                {todos.filter(t => !t.completed).length} активних
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))
            ) : todos.length === 0 ? (
              <div className="text-center py-6">
                <Award className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-zinc-400">Все чудово!</p>
              </div>
            ) : (
              todos.map((todo) => {
                const Icon = typeIcons[todo.type];
                return (
                  <div
                    key={todo.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                      todo.completed 
                        ? "bg-zinc-800/30 border-zinc-800 opacity-60" 
                        : `bg-zinc-800/50 ${priorityColors[todo.priority].split(' ')[2]}`
                    }`}
                  >
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className="mt-0.5 flex-shrink-0"
                    >
                      {todo.completed ? (
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Square className="h-5 w-5 text-zinc-500 hover:text-amber-400 transition-colors" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${todo.completed ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                        {todo.text}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-[10px] px-1.5 py-0 ${priorityColors[todo.priority]}`}>
                          {todo.priority === "high" ? "Важливо" : todo.priority === "medium" ? "Середнє" : "Низьке"}
                        </Badge>
                        <Icon className="h-3 w-3 text-zinc-600" />
                      </div>
                    </div>
                    {todo.link && (
                      <Link href={todo.link}>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* SEO Issues */}
        <Card className="bg-zinc-900/50 border-zinc-800" id="issues">
          <CardHeader className="pb-3">
            <CardTitle className="text-zinc-200 text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                SEO проблеми
              </span>
              <Badge variant="outline" className="text-xs text-red-400 border-red-500/30">
                {seoIssues.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-80 overflow-y-auto">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))
            ) : seoIssues.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-zinc-400">Проблем не знайдено!</p>
              </div>
            ) : (
              seoIssues.map((item) => (
                <Link
                  key={item.id}
                  href={getCategoryInfo(item.category).href}
                  className="block p-3 rounded-xl bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors border border-zinc-800"
                >
                  <p className="text-sm font-medium text-zinc-200 truncate">{item.name}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.issues.map((issue, i) => (
                      <Badge key={i} variant="outline" className="text-[10px] py-0 text-red-400 border-red-500/30">
                        {issue.includes("логотипу") && <ImageOff className="h-2.5 w-2.5 mr-1" />}
                        {issue.includes("опис") && <FileText className="h-2.5 w-2.5 mr-1" />}
                        {issue}
                      </Badge>
                    ))}
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Items */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-zinc-200 text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-zinc-500" />
              Останні додані
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))
            ) : recentItems.length === 0 ? (
              <p className="text-zinc-500 text-sm text-center py-4">Немає даних</p>
            ) : (
              recentItems.map((item) => {
                const catInfo = getCategoryInfo(item.category?.slug);
                return (
                  <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 overflow-hidden flex-shrink-0">
                      {item.logoUrl ? (
                        <Image src={item.logoUrl} alt={item.name} width={40} height={40} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-zinc-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-200 truncate">{item.name}</p>
                      <Badge className={`text-[10px] px-1.5 py-0 ${catInfo.color}`}>
                        {catInfo.label}
                      </Badge>
                    </div>
                    <Link href={catInfo.href}>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-zinc-200 text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            Швидкі дії
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {[
              { title: "POS", icon: Monitor, color: "hover:bg-emerald-500/10 hover:border-emerald-500/50", href: "/admin/pos-systems" },
              { title: "Обладнання", icon: Package, color: "hover:bg-orange-500/10 hover:border-orange-500/50", href: "/admin/equipment" },
              { title: "Постачальники", icon: Store, color: "hover:bg-violet-500/10 hover:border-violet-500/50", href: "/admin/suppliers" },
              { title: "Доставка", icon: Truck, color: "hover:bg-pink-500/10 hover:border-pink-500/50", href: "/admin/delivery" },
              { title: "QR-меню", icon: QrCode, color: "hover:bg-cyan-500/10 hover:border-cyan-500/50", href: "/admin/qr-menu" },
              { title: "Користувачі", icon: Users, color: "hover:bg-blue-500/10 hover:border-blue-500/50", href: "/admin/users" },
              { title: "Блог", icon: Newspaper, color: "hover:bg-rose-500/10 hover:border-rose-500/50", href: "/admin/blog" },
              { title: "SEO", icon: Target, color: "hover:bg-amber-500/10 hover:border-amber-500/50", href: "/admin/seo" },
            ].map((item) => (
              <Link key={item.title} href={item.href}>
                <Card className={`bg-zinc-800/30 border-zinc-800 ${item.color} transition-all cursor-pointer`}>
                  <CardContent className="p-3 text-center">
                    <item.icon className="h-5 w-5 mx-auto mb-1 text-zinc-400" />
                    <p className="text-xs text-zinc-400">{item.title}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
