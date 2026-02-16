"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MessageSquare,
  User,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  ThumbsUp,
  Eye,
  Store,
  Monitor,
  RefreshCw,
  Download,
  AlertCircle,
  Calendar,
  ExternalLink,
  Flag,
  Reply,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, StatusBadge, Column } from "@/components/ui/data-table";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface Review {
  id: string;
  content: string;
  pros: string | null;
  cons: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    profile?: {
      firstName: string | null;
      lastName: string | null;
      avatarUrl: string | null;
    };
  };
  establishment?: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
  };
  posSystem?: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
  };
  rating?: {
    score: number;
  };
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [moderationNote, setModerationNote] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch pending reviews for moderation
      const params = new URLSearchParams();
      params.append("limit", "100");
      
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const data = await api.get<{ data: Review[] }>(
        `${endpoints.reviews.pending}?${params.toString()}`
      );
      
      let filtered = data.data || [];
      
      // Client-side type filtering
      if (typeFilter === "establishments") {
        filtered = filtered.filter((r) => r.establishment);
      } else if (typeFilter === "pos-systems") {
        filtered = filtered.filter((r) => r.posSystem);
      }
      
      setReviews(filtered);
    } catch (error: any) {
      // Silently handle unauthorized - API requires auth
      if (!error?.message?.includes("Unauthorized")) {
        console.error("Failed to fetch reviews:", error);
      }
      // Show demo data when API is unavailable
      setReviews([
        {
          id: "demo-1",
          content: "Чудова система! Рекомендую всім рестораторам.",
          rating: 5,
          status: "PENDING",
          createdAt: new Date().toISOString(),
          user: { profile: { firstName: "Олена", lastName: "Коваленко" } },
          posSystem: { name: "Poster POS", slug: "poster-pos" },
        },
        {
          id: "demo-2",
          content: "Гарне обслуговування, смачна їжа.",
          rating: 4,
          status: "PENDING",
          createdAt: new Date().toISOString(),
          user: { profile: { firstName: "Петро", lastName: "Сидоренко" } },
          establishment: { name: "Кафе Затишок", slug: "cafe-zatyshok" },
        },
      ] as any);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleModerate = async (id: string, status: "APPROVED" | "REJECTED") => {
    setProcessingId(id);
    try {
      await api.patch(endpoints.reviews.moderate(id), { status });
      
      // Update local state
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
      setSelectedReview(null);
      setModerationNote("");
      
      // Optionally refresh to get fresh data
      // fetchReviews();
    } catch (error) {
      console.error("Failed to moderate review:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const exportReviews = () => {
    const csv = [
      ["ID", "Автор", "Об'єкт", "Оцінка", "Статус", "Дата", "Зміст"].join(","),
      ...reviews.map((r) =>
        [
          r.id,
          r.user.email,
          r.establishment?.name || r.posSystem?.name || "—",
          r.rating?.score || "—",
          r.status,
          new Date(r.createdAt).toISOString(),
          `"${r.content.replace(/"/g, '""')}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reviews-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const columns: Column<Review>[] = [
    {
      key: "user",
      header: "Автор",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
            {item.user.profile?.avatarUrl ? (
              <Image
                src={item.user.profile.avatarUrl}
                alt=""
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <User className="h-4 w-4 text-zinc-500" />
            )}
          </div>
          <div>
            <p className="font-medium text-zinc-200 text-sm">
              {item.user.profile?.firstName || item.user.email.split("@")[0]}
              {item.user.profile?.lastName && ` ${item.user.profile.lastName}`}
            </p>
            <p className="text-xs text-zinc-500">{item.user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "content",
      header: "Відгук",
      render: (item) => (
        <div className="max-w-xs">
          <p className="text-zinc-300 text-sm truncate">{item.content}</p>
          <div className="flex items-center gap-2 mt-1">
            {item.isVerifiedPurchase && (
              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                ✓ Верифікований
              </Badge>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "target",
      header: "Об'єкт",
      render: (item) => (
        <div className="flex items-center gap-2">
          {item.establishment ? (
            <>
              <div className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                {item.establishment.logoUrl ? (
                  <Image
                    src={item.establishment.logoUrl}
                    alt=""
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                ) : (
                  <Store className="h-4 w-4 text-blue-400" />
                )}
              </div>
              <div>
                <p className="text-zinc-300 text-sm">{item.establishment.name}</p>
                <p className="text-xs text-zinc-500">Заклад</p>
              </div>
            </>
          ) : item.posSystem ? (
            <>
              <div className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                {item.posSystem.logoUrl ? (
                  <Image
                    src={item.posSystem.logoUrl}
                    alt=""
                    width={32}
                    height={32}
                    className="object-contain p-1"
                  />
                ) : (
                  <Monitor className="h-4 w-4 text-emerald-400" />
                )}
              </div>
              <div>
                <p className="text-zinc-300 text-sm">{item.posSystem.name}</p>
                <p className="text-xs text-zinc-500">POS-система</p>
              </div>
            </>
          ) : (
            <span className="text-zinc-500">—</span>
          )}
        </div>
      ),
    },
    {
      key: "rating",
      header: "Оцінка",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < (item.rating?.score || 0)
                  ? "text-amber-400 fill-amber-400"
                  : "text-zinc-700"
              }`}
            />
          ))}
        </div>
      ),
    },
    {
      key: "helpfulCount",
      header: "Корисний",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-1 text-zinc-400">
          <ThumbsUp className="h-3 w-3" />
          <span className="text-sm">{item.helpfulCount}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Статус",
      sortable: true,
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "createdAt",
      header: "Дата",
      sortable: true,
      render: (item) => (
        <span className="text-zinc-500 text-xs">
          {new Date(item.createdAt).toLocaleDateString("uk-UA")}
        </span>
      ),
    },
  ];

  const stats = {
    total: reviews.length,
    pending: reviews.filter((r) => r.status === "PENDING").length,
    approved: reviews.filter((r) => r.status === "APPROVED").length,
    rejected: reviews.filter((r) => r.status === "REJECTED").length,
    avgRating: reviews.length
      ? (reviews.reduce((acc, r) => acc + (r.rating?.score || 0), 0) / reviews.length).toFixed(1)
      : "0.0",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
            <MessageSquare className="h-7 w-7 text-amber-400" />
            Модерація відгуків
          </h1>
          <p className="text-zinc-400 mt-1">
            Перевірка та схвалення відгуків користувачів
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchReviews}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Оновити
          </Button>
          <Button variant="outline" size="sm" onClick={exportReviews}>
            <Download className="h-4 w-4 mr-2" />
            Експорт
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-zinc-100">{stats.total}</p>
            <p className="text-sm text-zinc-500">Всього відгуків</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800 border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-400" />
              <p className="text-2xl font-bold text-amber-400">{stats.pending}</p>
            </div>
            <p className="text-sm text-zinc-500">Очікують перевірки</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-emerald-400">{stats.approved}</p>
            <p className="text-sm text-zinc-500">Схвалених</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
            <p className="text-sm text-zinc-500">Відхилених</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
              <p className="text-2xl font-bold text-zinc-100">{stats.avgRating}</p>
            </div>
            <p className="text-sm text-zinc-500">Середня оцінка</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions for Pending */}
      {stats.pending > 0 && statusFilter === "PENDING" && (
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-400" />
              <div>
                <p className="text-zinc-200 font-medium">
                  {stats.pending} відгуків очікують модерації
                </p>
                <p className="text-zinc-500 text-sm">
                  Перевірте та схваліть або відхиліть відгуки
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Table */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={reviews}
            loading={loading}
            searchPlaceholder="Пошук відгуків..."
            pageSize={15}
            onRowClick={(review) => setSelectedReview(review)}
            onRefresh={fetchReviews}
            filters={
              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 bg-zinc-800/50 border-zinc-700">
                    <SelectValue placeholder="Статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Всі статуси</SelectItem>
                    <SelectItem value="PENDING">Очікують</SelectItem>
                    <SelectItem value="APPROVED">Схвалені</SelectItem>
                    <SelectItem value="REJECTED">Відхилені</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40 bg-zinc-800/50 border-zinc-700">
                    <SelectValue placeholder="Тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Всі типи</SelectItem>
                    <SelectItem value="establishments">Заклади</SelectItem>
                    <SelectItem value="pos-systems">POS-системи</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            }
            actions={(item) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setSelectedReview(item)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Переглянути
                  </DropdownMenuItem>
                  {(item.establishment || item.posSystem) && (
                    <DropdownMenuItem asChild>
                      <Link
                        href={
                          item.establishment
                            ? `/establishments/${item.establishment.slug}`
                            : `/pos-systems/${item.posSystem?.slug}`
                        }
                        target="_blank"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Відкрити на сайті
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {item.status === "PENDING" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleModerate(item.id, "APPROVED")}
                        className="text-emerald-400"
                        disabled={processingId === item.id}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Схвалити
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleModerate(item.id, "REJECTED")}
                        className="text-red-400"
                        disabled={processingId === item.id}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Відхилити
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            bulkActions={
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-emerald-400 border-emerald-400/20">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Схвалити вибрані
                </Button>
                <Button variant="outline" size="sm" className="text-red-400 border-red-400/20">
                  <XCircle className="h-4 w-4 mr-2" />
                  Відхилити вибрані
                </Button>
              </div>
            }
          />
        </CardContent>
      </Card>

      {/* Review Detail Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-amber-400" />
              Деталі відгуку
            </DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-6">
              {/* Author Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center">
                    {selectedReview.user.profile?.avatarUrl ? (
                      <Image
                        src={selectedReview.user.profile.avatarUrl}
                        alt=""
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="h-6 w-6 text-zinc-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-zinc-100">
                      {selectedReview.user.profile?.firstName || selectedReview.user.email.split("@")[0]}
                      {selectedReview.user.profile?.lastName && ` ${selectedReview.user.profile.lastName}`}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {selectedReview.user.email}
                    </p>
                  </div>
                </div>
                <StatusBadge status={selectedReview.status} />
              </div>

              {/* Target */}
              <div className="p-4 rounded-xl bg-zinc-800/50">
                <p className="text-xs text-zinc-500 mb-2">Відгук на:</p>
                <div className="flex items-center gap-3">
                  {selectedReview.establishment ? (
                    <>
                      <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden">
                        {selectedReview.establishment.logoUrl ? (
                          <Image
                            src={selectedReview.establishment.logoUrl}
                            alt=""
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <Store className="h-5 w-5 text-blue-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-zinc-100 font-medium">
                          {selectedReview.establishment.name}
                        </p>
                        <Link
                          href={`/establishments/${selectedReview.establishment.slug}`}
                          target="_blank"
                          className="text-xs text-amber-400 hover:underline"
                        >
                          Відкрити на сайті →
                        </Link>
                      </div>
                    </>
                  ) : selectedReview.posSystem ? (
                    <>
                      <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden">
                        {selectedReview.posSystem.logoUrl ? (
                          <Image
                            src={selectedReview.posSystem.logoUrl}
                            alt=""
                            width={40}
                            height={40}
                            className="object-contain p-1"
                          />
                        ) : (
                          <Monitor className="h-5 w-5 text-emerald-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-zinc-100 font-medium">
                          {selectedReview.posSystem.name}
                        </p>
                        <Link
                          href={`/pos-systems/${selectedReview.posSystem.slug}`}
                          target="_blank"
                          className="text-xs text-amber-400 hover:underline"
                        >
                          Відкрити на сайті →
                        </Link>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              {/* Rating */}
              <div>
                <p className="text-xs text-zinc-500 mb-2">Оцінка:</p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-6 w-6 ${
                        i < (selectedReview.rating?.score || 0)
                          ? "text-amber-400 fill-amber-400"
                          : "text-zinc-700"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-zinc-400">
                    ({selectedReview.rating?.score}/5)
                  </span>
                </div>
              </div>

              {/* Content */}
              <div>
                <p className="text-xs text-zinc-500 mb-2">Текст відгуку:</p>
                <p className="text-zinc-200 bg-zinc-800/30 p-4 rounded-xl">
                  {selectedReview.content}
                </p>
              </div>

              {/* Pros & Cons */}
              {(selectedReview.pros || selectedReview.cons) && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <p className="text-xs text-emerald-400 mb-2 flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      Переваги
                    </p>
                    <p className="text-zinc-300 text-sm">{selectedReview.pros || "—"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                    <p className="text-xs text-red-400 mb-2 flex items-center gap-1">
                      <Flag className="h-3 w-3" />
                      Недоліки
                    </p>
                    <p className="text-zinc-300 text-sm">{selectedReview.cons || "—"}</p>
                  </div>
                </div>
              )}

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 pt-4 border-t border-zinc-800">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {new Date(selectedReview.createdAt).toLocaleString("uk-UA")}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  {selectedReview.helpfulCount} корисних
                </span>
                {selectedReview.isVerifiedPurchase && (
                  <Badge
                    variant="outline"
                    className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  >
                    ✓ Верифікований клієнт
                  </Badge>
                )}
              </div>

              {/* Moderation Actions */}
              {selectedReview.status === "PENDING" && (
                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <div>
                    <p className="text-xs text-zinc-500 mb-2">Примітка модератора (опційно):</p>
                    <Textarea
                      value={moderationNote}
                      onChange={(e) => setModerationNote(e.target.value)}
                      placeholder="Причина рішення..."
                      className="bg-zinc-800/50 border-zinc-700"
                      rows={2}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => handleModerate(selectedReview.id, "APPROVED")}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                      disabled={processingId === selectedReview.id}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Схвалити
                    </Button>
                    <Button
                      onClick={() => handleModerate(selectedReview.id, "REJECTED")}
                      variant="outline"
                      className="flex-1 text-red-400 border-red-400/20 hover:bg-red-400/10"
                      disabled={processingId === selectedReview.id}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Відхилити
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
