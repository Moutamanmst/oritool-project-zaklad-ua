"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Bot,
  MessageSquare,
  Clock,
  TrendingUp,
  Download,
  Search,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  CheckCircle,
  Calendar,
  RefreshCw,
  Zap,
  BarChart3,
  Users,
  Eye,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, Column } from "@/components/ui/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api, endpoints } from "@/lib/api";

interface AILog {
  id: string;
  question: string;
  response: string;
  category: string | null;
  userId: string | null;
  sessionId: string;
  responseTime: number;
  helpful: boolean | null;
  tokens: number;
  model: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    profile?: {
      firstName: string;
      lastName: string;
    };
  };
}

interface AIStats {
  totalQueries: number;
  todayQueries: number;
  weekQueries: number;
  monthQueries: number;
  avgResponseTime: number;
  helpfulRate: number;
  helpfulCount: number;
  notHelpfulCount: number;
  topCategories: { name: string; count: number }[];
  hourlyDistribution: { hour: number; count: number }[];
  avgPerDay: number;
}

interface Category {
  name: string;
  count: number;
}

export default function AILogsPage() {
  const [logs, setLogs] = useState<AILog[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [helpfulFilter, setHelpfulFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("7d");
  const [selectedLog, setSelectedLog] = useState<AILog | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [stats, setStats] = useState<AIStats>({
    totalQueries: 0,
    todayQueries: 0,
    weekQueries: 0,
    monthQueries: 0,
    avgResponseTime: 0,
    helpfulRate: 0,
    helpfulCount: 0,
    notHelpfulCount: 0,
    topCategories: [],
    hourlyDistribution: [],
    avgPerDay: 0,
  });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "20");
      
      if (categoryFilter !== "all") {
        params.append("category", categoryFilter);
      }
      if (helpfulFilter !== "all") {
        params.append("helpful", helpfulFilter);
      }
      if (dateFilter !== "all") {
        const days = dateFilter === "1d" ? 1 : dateFilter === "7d" ? 7 : 30;
        const dateFrom = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
        params.append("dateFrom", dateFrom);
      }

      const data = await api.get<{ data: AILog[]; meta: { total: number; totalPages: number } }>(
        `${endpoints.aiLogs.list}?${params.toString()}`
      );
      
      setLogs(data.data || []);
      setTotalPages(data.meta?.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch AI logs:", error);
      // Fallback to empty array on error
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [page, categoryFilter, helpfulFilter, dateFilter]);

  const fetchStats = async () => {
    try {
      const data = await api.get<AIStats>(endpoints.aiLogs.stats);
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch AI stats:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await api.get<Category[]>(endpoints.aiLogs.categories);
      setCategories(data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    fetchStats();
    fetchCategories();
  }, []);

  const handleMarkHelpful = async (id: string, helpful: boolean) => {
    try {
      await api.patch(endpoints.aiLogs.updateHelpful(id), { helpful });
      // Update local state
      setLogs((prev) =>
        prev.map((log) => (log.id === id ? { ...log, helpful } : log))
      );
      // Refresh stats
      fetchStats();
    } catch (error) {
      console.error("Failed to update helpful:", error);
    }
  };

  const exportLogs = () => {
    const csv = [
      ["ID", "Запитання", "Категорія", "Час відповіді (ms)", "Токени", "Корисний", "Дата"].join(","),
      ...logs.map((log) =>
        [
          log.id,
          `"${log.question.replace(/"/g, '""')}"`,
          log.category || "—",
          log.responseTime,
          log.tokens,
          log.helpful === null ? "—" : log.helpful ? "Так" : "Ні",
          new Date(log.createdAt).toISOString(),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const columns: Column<AILog>[] = [
    {
      key: "question",
      header: "Запитання",
      render: (item) => (
        <div className="max-w-md">
          <p className="text-zinc-200 truncate font-medium">{item.question}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="bg-zinc-800/50 text-xs">
              {item.category || "Загальне"}
            </Badge>
            {item.helpful === true && (
              <ThumbsUp className="h-3 w-3 text-emerald-400" />
            )}
            {item.helpful === false && (
              <ThumbsDown className="h-3 w-3 text-red-400" />
            )}
          </div>
        </div>
      ),
    },
    {
      key: "user",
      header: "Користувач",
      render: (item) => (
        <div className="flex items-center gap-2">
          {item.user ? (
            <>
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-zinc-300 text-sm">
                {item.user.profile?.firstName || item.user.email.split("@")[0]}
              </span>
            </>
          ) : (
            <span className="text-zinc-500 text-sm">Гість</span>
          )}
        </div>
      ),
    },
    {
      key: "responseTime",
      header: "Час",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-zinc-500" />
          <span className={`text-sm ${item.responseTime > 2000 ? "text-amber-400" : "text-zinc-400"}`}>
            {item.responseTime}ms
          </span>
        </div>
      ),
    },
    {
      key: "tokens",
      header: "Токени",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-1">
          <Zap className="h-3 w-3 text-violet-400" />
          <span className="text-zinc-400 text-sm">{item.tokens}</span>
        </div>
      ),
    },
    {
      key: "model",
      header: "Модель",
      render: (item) => (
        <Badge variant="outline" className="bg-zinc-800/50 text-xs">
          {item.model || "gpt-4o-mini"}
        </Badge>
      ),
    },
    {
      key: "helpful",
      header: "Оцінка",
      render: (item) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMarkHelpful(item.id, true);
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              item.helpful === true
                ? "bg-emerald-500/20 text-emerald-400"
                : "hover:bg-zinc-800 text-zinc-500"
            }`}
          >
            <ThumbsUp className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMarkHelpful(item.id, false);
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              item.helpful === false
                ? "bg-red-500/20 text-red-400"
                : "hover:bg-zinc-800 text-zinc-500"
            }`}
          >
            <ThumbsDown className="h-4 w-4" />
          </button>
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Дата",
      sortable: true,
      render: (item) => (
        <span className="text-zinc-500 text-xs">
          {new Date(item.createdAt).toLocaleString("uk-UA", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
            <Bot className="h-7 w-7 text-violet-400" />
            AI Контроль
          </h1>
          <p className="text-zinc-400 mt-1">
            Моніторинг та аналітика Zaklad AI Assistant
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => { fetchLogs(); fetchStats(); }}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Оновити
          </Button>
          <Button variant="outline" size="sm" onClick={exportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Експорт
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-500/10">
                <MessageSquare className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-zinc-100">
                  {stats.totalQueries.toLocaleString()}
                </p>
                <p className="text-xs text-zinc-500">Всього</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-zinc-100">
                  {stats.todayQueries}
                </p>
                <p className="text-xs text-zinc-500">Сьогодні</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-zinc-100">
                  {stats.avgResponseTime}ms
                </p>
                <p className="text-xs text-zinc-500">Середній час</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <ThumbsUp className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-zinc-100">
                  {stats.helpfulRate}%
                </p>
                <p className="text-xs text-zinc-500">Корисних</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <BarChart3 className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-zinc-100">
                  {stats.avgPerDay}
                </p>
                <p className="text-xs text-zinc-500">Середнє/день</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/10">
                <Zap className="h-5 w-5 text-rose-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-zinc-100">
                  {stats.weekQueries.toLocaleString()}
                </p>
                <p className="text-xs text-zinc-500">За тиждень</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Logs Table */}
        <div className="lg:col-span-3">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-6">
              <DataTable
                columns={columns}
                data={logs}
                loading={loading}
                searchPlaceholder="Пошук запитань..."
                pageSize={20}
                onRowClick={(log) => setSelectedLog(log)}
                onRefresh={() => { fetchLogs(); fetchStats(); }}
                filters={
                  <div className="flex items-center gap-2">
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="w-32 bg-zinc-800/50 border-zinc-700">
                        <Calendar className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1d">Сьогодні</SelectItem>
                        <SelectItem value="7d">7 днів</SelectItem>
                        <SelectItem value="30d">30 днів</SelectItem>
                        <SelectItem value="all">Весь час</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-40 bg-zinc-800/50 border-zinc-700">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Категорія" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Всі категорії</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.name} value={cat.name}>
                            {cat.name} ({cat.count})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={helpfulFilter} onValueChange={setHelpfulFilter}>
                      <SelectTrigger className="w-36 bg-zinc-800/50 border-zinc-700">
                        <SelectValue placeholder="Оцінка" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Всі</SelectItem>
                        <SelectItem value="true">Корисні</SelectItem>
                        <SelectItem value="false">Некорисні</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                }
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Top Categories */}
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-zinc-100 text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-violet-400" />
                Топ категорій
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topCategories.slice(0, 8).map((cat, i) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 text-xs w-4">{i + 1}.</span>
                      <span className="text-zinc-300 text-sm">{cat.name}</span>
                    </div>
                    <Badge variant="secondary" className="bg-zinc-800 text-xs">
                      {cat.count}
                    </Badge>
                  </div>
                ))}
                {stats.topCategories.length === 0 && (
                  <p className="text-zinc-500 text-sm text-center py-4">
                    Немає даних
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quality Metrics */}
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-zinc-100 text-base flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-emerald-400" />
                Якість відповідей
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-400">Корисні</span>
                  <span className="text-sm text-emerald-400">{stats.helpfulCount}</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${stats.helpfulRate}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-3 rounded-lg bg-emerald-500/10 text-center">
                  <p className="text-emerald-400 font-bold">{stats.helpfulCount}</p>
                  <p className="text-xs text-zinc-500">Корисні</p>
                </div>
                <div className="p-3 rounded-lg bg-red-500/10 text-center">
                  <p className="text-red-400 font-bold">{stats.notHelpfulCount}</p>
                  <p className="text-xs text-zinc-500">Некорисні</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-zinc-100 text-base flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                Статус системи
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm text-zinc-300">API Online</span>
                  </div>
                  <span className="text-xs text-emerald-400">99.9%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                  <span className="text-sm text-zinc-400">Модель</span>
                  <span className="text-sm text-zinc-200">GPT-4o-mini</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                  <span className="text-sm text-zinc-400">Середній час</span>
                  <span className={`text-sm ${stats.avgResponseTime > 2000 ? "text-amber-400" : "text-emerald-400"}`}>
                    {stats.avgResponseTime}ms
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Log Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-violet-400" />
              Деталі запиту
            </DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-6">
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="bg-violet-500/10 text-violet-400">
                  {selectedLog.category || "Загальне"}
                </Badge>
                <Badge variant="outline" className="bg-zinc-800">
                  {selectedLog.model}
                </Badge>
                <span className="text-xs text-zinc-500">
                  {new Date(selectedLog.createdAt).toLocaleString("uk-UA")}
                </span>
              </div>

              {/* Question */}
              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <p className="text-xs text-blue-400 uppercase font-medium mb-2 flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  Запитання користувача
                </p>
                <p className="text-zinc-200">{selectedLog.question}</p>
              </div>

              {/* Response */}
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <p className="text-xs text-emerald-400 uppercase font-medium mb-2 flex items-center gap-1">
                  <Bot className="h-3 w-3" />
                  Відповідь AI
                </p>
                <p className="text-zinc-300 whitespace-pre-wrap">{selectedLog.response}</p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-zinc-800/50 text-center">
                  <Clock className="h-4 w-4 text-amber-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-zinc-100">{selectedLog.responseTime}ms</p>
                  <p className="text-xs text-zinc-500">Час відповіді</p>
                </div>
                <div className="p-3 rounded-lg bg-zinc-800/50 text-center">
                  <Zap className="h-4 w-4 text-violet-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-zinc-100">{selectedLog.tokens}</p>
                  <p className="text-xs text-zinc-500">Токенів</p>
                </div>
                <div className="p-3 rounded-lg bg-zinc-800/50 text-center">
                  <Users className="h-4 w-4 text-blue-400 mx-auto mb-1" />
                  <p className="text-lg font-bold text-zinc-100">
                    {selectedLog.user?.profile?.firstName || "Гість"}
                  </p>
                  <p className="text-xs text-zinc-500">Користувач</p>
                </div>
                <div className="p-3 rounded-lg bg-zinc-800/50 text-center">
                  {selectedLog.helpful === true ? (
                    <ThumbsUp className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                  ) : selectedLog.helpful === false ? (
                    <ThumbsDown className="h-4 w-4 text-red-400 mx-auto mb-1" />
                  ) : (
                    <Eye className="h-4 w-4 text-zinc-500 mx-auto mb-1" />
                  )}
                  <p className="text-lg font-bold text-zinc-100">
                    {selectedLog.helpful === null ? "—" : selectedLog.helpful ? "Так" : "Ні"}
                  </p>
                  <p className="text-xs text-zinc-500">Корисний</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                <Button
                  onClick={() => handleMarkHelpful(selectedLog.id, true)}
                  variant={selectedLog.helpful === true ? "default" : "outline"}
                  className={selectedLog.helpful === true ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Корисна відповідь
                </Button>
                <Button
                  onClick={() => handleMarkHelpful(selectedLog.id, false)}
                  variant={selectedLog.helpful === false ? "default" : "outline"}
                  className={selectedLog.helpful === false ? "bg-red-500 hover:bg-red-600" : ""}
                >
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Некорисна
                </Button>
              </div>

              {/* Technical Details */}
              <div className="pt-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-500 uppercase font-medium mb-2">Технічні деталі</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
                  <div>Session ID: <span className="text-zinc-500">{selectedLog.sessionId}</span></div>
                  <div>User ID: <span className="text-zinc-500">{selectedLog.userId || "—"}</span></div>
                  <div className="col-span-2">User Agent: <span className="text-zinc-500 break-all">{selectedLog.userAgent || "—"}</span></div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
