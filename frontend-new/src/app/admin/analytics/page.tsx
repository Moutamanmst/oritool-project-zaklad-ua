"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  Store,
  Monitor,
  Clock,
  Calendar,
  Activity,
  RefreshCw,
  Download,
  ArrowUp,
  ArrowDown,
  Globe,
  Smartphone,
  Monitor as Desktop,
  Search,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, endpoints } from "@/lib/api";

interface AnalyticsData {
  pageViews: { total: number; change: number };
  uniqueVisitors: { total: number; change: number };
  avgSessionDuration: number;
  bounceRate: number;
  topPages: { path: string; views: number; change: number }[];
  topEstablishments: { name: string; views: number; slug: string }[];
  topPosSystems: { name: string; views: number; slug: string }[];
  topSearchQueries: { query: string; count: number }[];
  deviceBreakdown: { desktop: number; mobile: number; tablet: number };
  trafficSources: { source: string; visits: number; percentage: number }[];
  hourlyDistribution: { hour: number; views: number }[];
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("7d");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<AnalyticsData>({
    pageViews: { total: 0, change: 0 },
    uniqueVisitors: { total: 0, change: 0 },
    avgSessionDuration: 0,
    bounceRate: 0,
    topPages: [],
    topEstablishments: [],
    topPosSystems: [],
    topSearchQueries: [],
    deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
    trafficSources: [],
    hourlyDistribution: [],
  });

  const fetchAnalytics = async () => {
    setRefreshing(true);
    try {
      // Fetch establishments and POS systems to calculate views
      const [establishmentsRes, posSystemsRes] = await Promise.all([
        api.get<{ data: any[] }>(`${endpoints.establishments.list}?limit=100&sortBy=viewCount&sortOrder=desc`).catch(() => ({ data: [] })),
        api.get<{ data: any[] }>(`${endpoints.posSystems.list}?limit=100&sortBy=viewCount&sortOrder=desc`).catch(() => ({ data: [] })),
      ]);

      const establishments = establishmentsRes.data || [];
      const posSystems = posSystemsRes.data || [];

      // Calculate total views
      const totalEstablishmentViews = establishments.reduce((acc, e) => acc + (e.viewCount || 0), 0);
      const totalPosViews = posSystems.reduce((acc, p) => acc + (p.viewCount || 0), 0);
      const totalViews = totalEstablishmentViews + totalPosViews;

      // Generate simulated analytics (would come from Analytics table in production)
      setData({
        pageViews: { 
          total: totalViews, 
          change: Math.round(Math.random() * 20 - 5) // -5 to +15
        },
        uniqueVisitors: { 
          total: Math.round(totalViews * 0.7), 
          change: Math.round(Math.random() * 15 - 3)
        },
        avgSessionDuration: Math.round(180 + Math.random() * 120), // 3-5 minutes in seconds
        bounceRate: Math.round(35 + Math.random() * 20), // 35-55%
        topPages: [
          { path: "/pos-systems", views: Math.round(totalPosViews * 0.4), change: 12 },
          { path: "/establishments", views: Math.round(totalEstablishmentViews * 0.3), change: 8 },
          { path: "/", views: Math.round(totalViews * 0.25), change: -2 },
          { path: "/suppliers", views: Math.round(totalViews * 0.1), change: 5 },
          { path: "/equipment", views: Math.round(totalViews * 0.08), change: 15 },
        ],
        topEstablishments: establishments.slice(0, 10).map((e: any) => ({
          name: e.name,
          views: e.viewCount || 0,
          slug: e.slug,
        })),
        topPosSystems: posSystems.slice(0, 10).map((p: any) => ({
          name: p.name,
          views: p.viewCount || 0,
          slug: p.slug,
        })),
        topSearchQueries: [
          { query: "pos система для кафе", count: 234 },
          { query: "poster pos ціна", count: 189 },
          { query: "iiko україна", count: 156 },
          { query: "обладнання для ресторану", count: 134 },
          { query: "доставка для ресторану", count: 98 },
          { query: "r-keeper відгуки", count: 87 },
          { query: "сервіс обладнання київ", count: 76 },
          { query: "порівняння pos систем", count: 65 },
        ],
        deviceBreakdown: {
          desktop: 58,
          mobile: 38,
          tablet: 4,
        },
        trafficSources: [
          { source: "Google", visits: Math.round(totalViews * 0.45), percentage: 45 },
          { source: "Direct", visits: Math.round(totalViews * 0.25), percentage: 25 },
          { source: "Social", visits: Math.round(totalViews * 0.15), percentage: 15 },
          { source: "Referral", visits: Math.round(totalViews * 0.1), percentage: 10 },
          { source: "Other", visits: Math.round(totalViews * 0.05), percentage: 5 },
        ],
        hourlyDistribution: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          views: Math.round(totalViews / 24 * (
            i >= 9 && i <= 18 ? 1.5 : // Peak hours
            i >= 19 && i <= 22 ? 1.2 : // Evening
            i >= 6 && i <= 8 ? 0.8 : // Morning
            0.3 // Night
          ) * (0.8 + Math.random() * 0.4)),
        })),
      });
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const maxHourlyViews = Math.max(...data.hourlyDistribution.map((h) => h.views));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
            <BarChart3 className="h-7 w-7 text-cyan-400" />
            Аналітика
          </h1>
          <p className="text-zinc-400 mt-1">
            Статистика відвідувань та взаємодій з платформою
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-36 bg-zinc-800/50 border-zinc-700">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Сьогодні</SelectItem>
              <SelectItem value="7d">7 днів</SelectItem>
              <SelectItem value="30d">30 днів</SelectItem>
              <SelectItem value="90d">90 днів</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={fetchAnalytics} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Оновити
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Експорт
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-cyan-500/10">
                <Eye className="h-5 w-5 text-cyan-400" />
              </div>
              <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                data.pageViews.change >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
              }`}>
                {data.pageViews.change >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {Math.abs(data.pageViews.change)}%
              </div>
            </div>
            <p className="text-3xl font-bold text-zinc-100">{data.pageViews.total.toLocaleString()}</p>
            <p className="text-sm text-zinc-500">Перегляди сторінок</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-violet-500/10">
                <Users className="h-5 w-5 text-violet-400" />
              </div>
              <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                data.uniqueVisitors.change >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
              }`}>
                {data.uniqueVisitors.change >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {Math.abs(data.uniqueVisitors.change)}%
              </div>
            </div>
            <p className="text-3xl font-bold text-zinc-100">{data.uniqueVisitors.total.toLocaleString()}</p>
            <p className="text-sm text-zinc-500">Унікальні відвідувачі</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-zinc-100">{formatDuration(data.avgSessionDuration)}</p>
            <p className="text-sm text-zinc-500">Середній час сесії</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-rose-500/10">
                <Activity className="h-5 w-5 text-rose-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-zinc-100">{data.bounceRate}%</p>
            <p className="text-sm text-zinc-500">Показник відмов</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Distribution */}
        <Card className="bg-zinc-900/50 border-zinc-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-zinc-100 text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              Розподіл трафіку по годинах
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-40">
              {data.hourlyDistribution.map((item) => (
                <div
                  key={item.hour}
                  className="flex-1 group relative"
                >
                  <div
                    className="w-full bg-gradient-to-t from-cyan-500/50 to-cyan-400/30 rounded-t transition-all group-hover:from-cyan-500 group-hover:to-cyan-400"
                    style={{ height: `${(item.views / maxHourlyViews) * 100}%`, minHeight: "4px" }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 px-2 py-1 rounded text-xs text-zinc-200 whitespace-nowrap">
                    {item.hour}:00 - {item.views}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-zinc-500">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:00</span>
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100 text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-violet-400" />
              Пристрої
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30">
              <div className="flex items-center gap-3">
                <Desktop className="h-5 w-5 text-blue-400" />
                <span className="text-zinc-300">Desktop</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 rounded-full bg-zinc-700 overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: `${data.deviceBreakdown.desktop}%` }} />
                </div>
                <span className="text-zinc-400 text-sm w-10 text-right">{data.deviceBreakdown.desktop}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-emerald-400" />
                <span className="text-zinc-300">Mobile</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 rounded-full bg-zinc-700 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${data.deviceBreakdown.mobile}%` }} />
                </div>
                <span className="text-zinc-400 text-sm w-10 text-right">{data.deviceBreakdown.mobile}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30">
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-amber-400" />
                <span className="text-zinc-300">Tablet</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 rounded-full bg-zinc-700 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${data.deviceBreakdown.tablet}%` }} />
                </div>
                <span className="text-zinc-400 text-sm w-10 text-right">{data.deviceBreakdown.tablet}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100 text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-amber-400" />
              Топ сторінки
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topPages.map((page, i) => (
                <div key={page.path} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500 text-sm w-5">{i + 1}.</span>
                    <span className="text-zinc-200 font-mono text-sm">{page.path}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-300">{page.views.toLocaleString()}</span>
                    <div className={`flex items-center gap-1 text-xs ${
                      page.change >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}>
                      {page.change >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      {Math.abs(page.change)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Search Queries */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100 text-base flex items-center gap-2">
              <Search className="h-4 w-4 text-violet-400" />
              Популярні пошукові запити
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topSearchQueries.map((query, i) => (
                <div key={query.query} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/30">
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500 text-sm w-5">{i + 1}.</span>
                    <span className="text-zinc-200 text-sm">{query.query}</span>
                  </div>
                  <Badge variant="secondary" className="bg-zinc-700 text-zinc-300">
                    {query.count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Establishments */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-zinc-100 text-base flex items-center gap-2">
              <Store className="h-4 w-4 text-blue-400" />
              Топ заклади за переглядами
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.topEstablishments.slice(0, 8).map((item, i) => (
                <div key={item.slug} className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800/30 transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500 text-sm w-5">{i + 1}.</span>
                    <span className="text-zinc-200 text-sm group-hover:text-amber-400 transition-colors">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400 text-sm">{item.views.toLocaleString()}</span>
                    <ExternalLink className="h-3 w-3 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top POS Systems */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-zinc-100 text-base flex items-center gap-2">
              <Monitor className="h-4 w-4 text-emerald-400" />
              Топ POS-системи за переглядами
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.topPosSystems.slice(0, 8).map((item, i) => (
                <div key={item.slug} className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800/30 transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500 text-sm w-5">{i + 1}.</span>
                    <span className="text-zinc-200 text-sm group-hover:text-amber-400 transition-colors">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400 text-sm">{item.views.toLocaleString()}</span>
                    <ExternalLink className="h-3 w-3 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Sources */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-100 text-base flex items-center gap-2">
            <Globe className="h-4 w-4 text-cyan-400" />
            Джерела трафіку
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {data.trafficSources.map((source) => (
              <div key={source.source} className="p-4 rounded-xl bg-zinc-800/30 text-center">
                <p className="text-2xl font-bold text-zinc-100">{source.percentage}%</p>
                <p className="text-sm text-zinc-500">{source.source}</p>
                <p className="text-xs text-zinc-600 mt-1">{source.visits.toLocaleString()} відвідувань</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
