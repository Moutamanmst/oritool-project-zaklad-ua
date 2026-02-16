"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Store,
  Monitor,
  MessageSquare,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  AlertTriangle,
  Filter,
  RefreshCw,
  ChevronRight,
  User,
  Star,
  Calendar,
  MapPin,
  Globe,
  Phone,
  Mail,
  ExternalLink,
  ThumbsUp,
  Flag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, StatusBadge, Column } from "@/components/ui/data-table";
import { api, endpoints } from "@/lib/api";

// Types based on Prisma schema
interface PendingEstablishment {
  id: string;
  slug: string;
  name: string;
  description: string;
  businessType: "RESTAURANT" | "CAFE" | "FASTFOOD" | "BAR" | "BAKERY" | "COFFEESHOP" | "OTHER";
  address: string;
  phone: string;
  email: string;
  website: string;
  logoUrl: string;
  coverUrl: string;
  priceRange: number;
  status: "PENDING" | "ACTIVE" | "INACTIVE" | "REJECTED";
  isFeatured: boolean;
  viewCount: number;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  category?: { id: string; name: string; slug: string };
  city?: { id: string; name: string };
  businessProfile?: {
    id: string;
    companyName: string;
    isVerified: boolean;
    user?: { id: string; email: string };
  };
}

interface PendingReview {
  id: string;
  content: string;
  pros: string | null;
  cons: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
  user: {
    id: string;
    email: string;
    profile?: { firstName: string | null; lastName: string | null; avatarUrl: string | null };
  };
  establishment?: { id: string; name: string; slug: string; logoUrl: string | null };
  posSystem?: { id: string; name: string; slug: string; logoUrl: string | null };
}

interface PendingBusiness {
  id: string;
  userId: string;
  companyName: string;
  description: string;
  website: string;
  phone: string;
  email: string;
  logoUrl: string;
  isVerified: boolean;
  verifiedAt: string | null;
  createdAt: string;
  user: { id: string; email: string; role: string };
}

type PendingItem = 
  | { type: "establishment"; data: PendingEstablishment }
  | { type: "review"; data: PendingReview }
  | { type: "business"; data: PendingBusiness };

const businessTypeLabels: Record<string, string> = {
  RESTAURANT: "Ресторан",
  CAFE: "Кафе",
  FASTFOOD: "Фаст-фуд",
  BAR: "Бар",
  BAKERY: "Пекарня",
  COFFEESHOP: "Кав'ярня",
  OTHER: "Інше",
};

export default function ModerationPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Data states
  const [pendingEstablishments, setPendingEstablishments] = useState<PendingEstablishment[]>([]);
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);
  const [pendingBusinesses, setPendingBusinesses] = useState<PendingBusiness[]>([]);
  
  // Dialog states
  const [selectedEstablishment, setSelectedEstablishment] = useState<PendingEstablishment | null>(null);
  const [selectedReview, setSelectedReview] = useState<PendingReview | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<PendingBusiness | null>(null);
  
  // Processing states
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [moderationNote, setModerationNote] = useState("");

  const fetchAllPending = useCallback(async () => {
    setRefreshing(true);
    try {
      const [establishmentsRes, reviewsRes] = await Promise.all([
        api.get<{ data: PendingEstablishment[] }>(`${endpoints.establishments.list}?status=PENDING&limit=100`).catch(() => ({ data: [] })),
        api.get<{ data: PendingReview[] }>(`${endpoints.reviews.pending}?limit=100`).catch(() => ({ data: [] })),
      ]);

      setPendingEstablishments(establishmentsRes.data || []);
      setPendingReviews(reviewsRes.data || []);
      // Note: Business verification would come from users endpoint with pending business profiles
    } catch (error) {
      console.error("Failed to fetch pending items:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAllPending();
  }, [fetchAllPending]);

  // Moderation handlers
  const handleApproveEstablishment = async (id: string) => {
    setProcessingId(id);
    try {
      await api.patch(`/establishments/${id}`, { status: "ACTIVE" });
      setPendingEstablishments((prev) => prev.filter((e) => e.id !== id));
      setSelectedEstablishment(null);
    } catch (error) {
      console.error("Failed to approve establishment:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectEstablishment = async (id: string) => {
    setProcessingId(id);
    try {
      await api.patch(`/establishments/${id}`, { status: "REJECTED" });
      setPendingEstablishments((prev) => prev.filter((e) => e.id !== id));
      setSelectedEstablishment(null);
    } catch (error) {
      console.error("Failed to reject establishment:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleModerateReview = async (id: string, status: "APPROVED" | "REJECTED") => {
    setProcessingId(id);
    try {
      await api.patch(endpoints.reviews.moderate(id), { status });
      setPendingReviews((prev) => prev.filter((r) => r.id !== id));
      setSelectedReview(null);
      setModerationNote("");
    } catch (error) {
      console.error("Failed to moderate review:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleVerifyBusiness = async (userId: string) => {
    setProcessingId(userId);
    try {
      await api.patch(endpoints.users.verifyBusiness(userId), {});
      setPendingBusinesses((prev) => prev.filter((b) => b.userId !== userId));
      setSelectedBusiness(null);
    } catch (error) {
      console.error("Failed to verify business:", error);
    } finally {
      setProcessingId(null);
    }
  };

  // Stats
  const totalPending = pendingEstablishments.length + pendingReviews.length + pendingBusinesses.length;

  // Table columns for establishments
  const establishmentColumns: Column<PendingEstablishment>[] = [
    {
      key: "name",
      header: "Заклад",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0">
            {item.logoUrl ? (
              <Image src={item.logoUrl} alt="" width={40} height={40} className="object-cover" />
            ) : (
              <Store className="h-5 w-5 text-zinc-500" />
            )}
          </div>
          <div>
            <p className="font-medium text-zinc-100">{item.name}</p>
            <p className="text-xs text-zinc-500">{businessTypeLabels[item.businessType]}</p>
          </div>
        </div>
      ),
    },
    {
      key: "city",
      header: "Місто",
      render: (item) => (
        <span className="text-zinc-400 text-sm flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {item.city?.name || "—"}
        </span>
      ),
    },
    {
      key: "businessProfile",
      header: "Власник",
      render: (item) => (
        <div className="text-sm">
          <p className="text-zinc-300">{item.businessProfile?.companyName || "—"}</p>
          <p className="text-xs text-zinc-500">{item.businessProfile?.user?.email}</p>
        </div>
      ),
    },
    {
      key: "priceRange",
      header: "Ціновий діапазон",
      render: (item) => (
        <span className="text-zinc-400">
          {"₴".repeat(item.priceRange)}
          <span className="text-zinc-700">{"₴".repeat(4 - item.priceRange)}</span>
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Дата подачі",
      sortable: true,
      render: (item) => (
        <span className="text-zinc-500 text-xs flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {new Date(item.createdAt).toLocaleDateString("uk-UA")}
        </span>
      ),
    },
  ];

  // Table columns for reviews
  const reviewColumns: Column<PendingReview>[] = [
    {
      key: "user",
      header: "Автор",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center">
            {item.user.profile?.avatarUrl ? (
              <Image src={item.user.profile.avatarUrl} alt="" width={32} height={32} className="rounded-full" />
            ) : (
              <User className="h-4 w-4 text-zinc-500" />
            )}
          </div>
          <div>
            <p className="text-sm text-zinc-200">
              {item.user.profile?.firstName || item.user.email.split("@")[0]}
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
          {item.isVerifiedPurchase && (
            <Badge variant="outline" className="mt-1 text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              ✓ Верифікований
            </Badge>
          )}
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
              <Store className="h-4 w-4 text-blue-400" />
              <span className="text-zinc-300 text-sm">{item.establishment.name}</span>
            </>
          ) : item.posSystem ? (
            <>
              <Monitor className="h-4 w-4 text-emerald-400" />
              <span className="text-zinc-300 text-sm">{item.posSystem.name}</span>
            </>
          ) : (
            <span className="text-zinc-500">—</span>
          )}
        </div>
      ),
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
            <Shield className="h-7 w-7 text-amber-400" />
            Центр модерації
          </h1>
          <p className="text-zinc-400 mt-1">
            Перевірка та схвалення контенту користувачів
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchAllPending} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Оновити
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-amber-400">{totalPending}</p>
                <p className="text-sm text-zinc-500">Всього очікує</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-400/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-400">{pendingEstablishments.length}</p>
                <p className="text-sm text-zinc-500">Заклади</p>
              </div>
              <Store className="h-8 w-8 text-blue-400/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-violet-400">{pendingReviews.length}</p>
                <p className="text-sm text-zinc-500">Відгуки</p>
              </div>
              <MessageSquare className="h-8 w-8 text-violet-400/30" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-emerald-400">{pendingBusinesses.length}</p>
                <p className="text-sm text-zinc-500">Бізнес-акаунти</p>
              </div>
              <Building2 className="h-8 w-8 text-emerald-400/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert if items pending */}
      {totalPending > 0 && (
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-amber-500/10">
              <Clock className="h-6 w-6 text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-zinc-100 font-medium">
                {totalPending} елементів очікують модерації
              </p>
              <p className="text-zinc-500 text-sm">
                Перевірте та схваліть або відхиліть контент, щоб підтримувати якість платформи
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="all" className="data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-900">
            Всі ({totalPending})
          </TabsTrigger>
          <TabsTrigger value="establishments" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Store className="h-4 w-4 mr-2" />
            Заклади ({pendingEstablishments.length})
          </TabsTrigger>
          <TabsTrigger value="reviews" className="data-[state=active]:bg-violet-500 data-[state=active]:text-white">
            <MessageSquare className="h-4 w-4 mr-2" />
            Відгуки ({pendingReviews.length})
          </TabsTrigger>
          <TabsTrigger value="businesses" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            <Building2 className="h-4 w-4 mr-2" />
            Бізнеси ({pendingBusinesses.length})
          </TabsTrigger>
        </TabsList>

        {/* All Tab - Quick Actions */}
        <TabsContent value="all" className="space-y-6">
          {totalPending === 0 ? (
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-16 w-16 mx-auto mb-4 text-emerald-500/50" />
                <h3 className="text-xl font-semibold text-zinc-100 mb-2">Все перевірено!</h3>
                <p className="text-zinc-500">Немає елементів, що очікують модерації</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending Establishments */}
              {pendingEstablishments.length > 0 && (
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-zinc-100 text-base flex items-center gap-2">
                      <Store className="h-5 w-5 text-blue-400" />
                      Заклади ({pendingEstablishments.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {pendingEstablishments.slice(0, 5).map((establishment) => (
                      <div
                        key={establishment.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors cursor-pointer"
                        onClick={() => setSelectedEstablishment(establishment)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-zinc-700 flex items-center justify-center overflow-hidden">
                            {establishment.logoUrl ? (
                              <Image src={establishment.logoUrl} alt="" width={40} height={40} className="object-cover" />
                            ) : (
                              <Store className="h-5 w-5 text-zinc-500" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-zinc-200">{establishment.name}</p>
                            <p className="text-xs text-zinc-500">
                              {businessTypeLabels[establishment.businessType]} • {establishment.city?.name}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-zinc-600" />
                      </div>
                    ))}
                    {pendingEstablishments.length > 5 && (
                      <Button
                        variant="ghost"
                        className="w-full text-zinc-400"
                        onClick={() => setActiveTab("establishments")}
                      >
                        Показати всі ({pendingEstablishments.length})
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Pending Reviews */}
              {pendingReviews.length > 0 && (
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-zinc-100 text-base flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-violet-400" />
                      Відгуки ({pendingReviews.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {pendingReviews.slice(0, 5).map((review) => (
                      <div
                        key={review.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors cursor-pointer"
                        onClick={() => setSelectedReview(review)}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-zinc-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-zinc-200 truncate">{review.content}</p>
                            <p className="text-xs text-zinc-500">
                              {review.user.email} • {review.establishment?.name || review.posSystem?.name}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-zinc-600 flex-shrink-0" />
                      </div>
                    ))}
                    {pendingReviews.length > 5 && (
                      <Button
                        variant="ghost"
                        className="w-full text-zinc-400"
                        onClick={() => setActiveTab("reviews")}
                      >
                        Показати всі ({pendingReviews.length})
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* Establishments Tab */}
        <TabsContent value="establishments">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-6">
              <DataTable
                columns={establishmentColumns}
                data={pendingEstablishments}
                loading={loading}
                searchPlaceholder="Пошук закладів..."
                pageSize={15}
                onRowClick={(item) => setSelectedEstablishment(item)}
                onRefresh={fetchAllPending}
                actions={(item) => (
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-emerald-400 hover:bg-emerald-500/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApproveEstablishment(item.id);
                      }}
                      disabled={processingId === item.id}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-400 hover:bg-red-500/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRejectEstablishment(item.id);
                      }}
                      disabled={processingId === item.id}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
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
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-6">
              <DataTable
                columns={reviewColumns}
                data={pendingReviews}
                loading={loading}
                searchPlaceholder="Пошук відгуків..."
                pageSize={15}
                onRowClick={(item) => setSelectedReview(item)}
                onRefresh={fetchAllPending}
                actions={(item) => (
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-emerald-400 hover:bg-emerald-500/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleModerateReview(item.id, "APPROVED");
                      }}
                      disabled={processingId === item.id}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-400 hover:bg-red-500/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleModerateReview(item.id, "REJECTED");
                      }}
                      disabled={processingId === item.id}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Businesses Tab */}
        <TabsContent value="businesses">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-12 text-center">
              <Building2 className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
              <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                {pendingBusinesses.length === 0 ? "Немає бізнесів на верифікацію" : `${pendingBusinesses.length} бізнесів очікують`}
              </h3>
              <p className="text-zinc-500">
                Бізнес-акаунти, що очікують верифікації, відображаються тут
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Establishment Detail Dialog */}
      <Dialog open={!!selectedEstablishment} onOpenChange={() => setSelectedEstablishment(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-blue-400" />
              Модерація закладу
            </DialogTitle>
          </DialogHeader>
          {selectedEstablishment && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="h-20 w-20 rounded-xl bg-zinc-800 flex items-center justify-center overflow-hidden">
                  {selectedEstablishment.logoUrl ? (
                    <Image src={selectedEstablishment.logoUrl} alt="" width={80} height={80} className="object-cover" />
                  ) : (
                    <Store className="h-10 w-10 text-zinc-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-zinc-100">{selectedEstablishment.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{businessTypeLabels[selectedEstablishment.businessType]}</Badge>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20">
                      <Clock className="h-3 w-3 mr-1" />
                      Очікує перевірки
                    </Badge>
                  </div>
                  <p className="text-zinc-500 text-sm mt-2">
                    Подано: {new Date(selectedEstablishment.createdAt).toLocaleString("uk-UA")}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-medium text-zinc-400 mb-2">Опис</h4>
                <p className="text-zinc-300 bg-zinc-800/50 p-4 rounded-xl">
                  {selectedEstablishment.description || "Опис не надано"}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-800/50">
                  <div className="flex items-center gap-2 text-zinc-500 mb-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Адреса</span>
                  </div>
                  <p className="text-zinc-200">{selectedEstablishment.address || "—"}</p>
                  <p className="text-sm text-zinc-500">{selectedEstablishment.city?.name}</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-800/50">
                  <div className="flex items-center gap-2 text-zinc-500 mb-1">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">Контакти</span>
                  </div>
                  <p className="text-zinc-200">{selectedEstablishment.phone || "—"}</p>
                  <p className="text-sm text-zinc-500">{selectedEstablishment.email}</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-800/50">
                  <div className="flex items-center gap-2 text-zinc-500 mb-1">
                    <Globe className="h-4 w-4" />
                    <span className="text-sm">Веб-сайт</span>
                  </div>
                  {selectedEstablishment.website ? (
                    <a
                      href={selectedEstablishment.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline flex items-center gap-1"
                    >
                      {selectedEstablishment.website}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <p className="text-zinc-500">—</p>
                  )}
                </div>
                <div className="p-4 rounded-xl bg-zinc-800/50">
                  <div className="flex items-center gap-2 text-zinc-500 mb-1">
                    <Building2 className="h-4 w-4" />
                    <span className="text-sm">Власник</span>
                  </div>
                  <p className="text-zinc-200">{selectedEstablishment.businessProfile?.companyName || "—"}</p>
                  <p className="text-sm text-zinc-500">{selectedEstablishment.businessProfile?.user?.email}</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="p-4 rounded-xl bg-zinc-800/50">
                <h4 className="text-sm font-medium text-zinc-400 mb-2">Цінова категорія</h4>
                <div className="text-2xl">
                  {"₴".repeat(selectedEstablishment.priceRange)}
                  <span className="text-zinc-700">{"₴".repeat(4 - selectedEstablishment.priceRange)}</span>
                </div>
              </div>

              {/* Moderation Note */}
              <div>
                <h4 className="text-sm font-medium text-zinc-400 mb-2">Примітка модератора (опційно)</h4>
                <Textarea
                  value={moderationNote}
                  onChange={(e) => setModerationNote(e.target.value)}
                  placeholder="Причина рішення..."
                  className="bg-zinc-800/50 border-zinc-700"
                  rows={2}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                <Button
                  onClick={() => handleApproveEstablishment(selectedEstablishment.id)}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                  disabled={processingId === selectedEstablishment.id}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Схвалити
                </Button>
                <Button
                  onClick={() => handleRejectEstablishment(selectedEstablishment.id)}
                  variant="outline"
                  className="flex-1 text-red-400 border-red-400/20 hover:bg-red-400/10"
                  disabled={processingId === selectedEstablishment.id}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Відхилити
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Detail Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-violet-400" />
              Модерація відгуку
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
                    <p className="text-sm text-zinc-500">{selectedReview.user.email}</p>
                  </div>
                </div>
                {selectedReview.isVerifiedPurchase && (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    ✓ Верифікований клієнт
                  </Badge>
                )}
              </div>

              {/* Target */}
              <div className="p-4 rounded-xl bg-zinc-800/50">
                <p className="text-xs text-zinc-500 mb-2">Відгук на:</p>
                <div className="flex items-center gap-3">
                  {selectedReview.establishment ? (
                    <>
                      <Store className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-zinc-100 font-medium">{selectedReview.establishment.name}</p>
                        <p className="text-xs text-zinc-500">Заклад</p>
                      </div>
                    </>
                  ) : selectedReview.posSystem ? (
                    <>
                      <Monitor className="h-5 w-5 text-emerald-400" />
                      <div>
                        <p className="text-zinc-100 font-medium">{selectedReview.posSystem.name}</p>
                        <p className="text-xs text-zinc-500">POS-система</p>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              {/* Content */}
              <div>
                <h4 className="text-sm font-medium text-zinc-400 mb-2">Текст відгуку</h4>
                <p className="text-zinc-200 bg-zinc-800/30 p-4 rounded-xl">{selectedReview.content}</p>
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
              <div className="flex items-center gap-4 text-sm text-zinc-500 pt-4 border-t border-zinc-800">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(selectedReview.createdAt).toLocaleString("uk-UA")}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  {selectedReview.helpfulCount} корисних
                </span>
              </div>

              {/* Moderation Note */}
              <div>
                <h4 className="text-sm font-medium text-zinc-400 mb-2">Примітка модератора (опційно)</h4>
                <Textarea
                  value={moderationNote}
                  onChange={(e) => setModerationNote(e.target.value)}
                  placeholder="Причина рішення..."
                  className="bg-zinc-800/50 border-zinc-700"
                  rows={2}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                <Button
                  onClick={() => handleModerateReview(selectedReview.id, "APPROVED")}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                  disabled={processingId === selectedReview.id}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Схвалити
                </Button>
                <Button
                  onClick={() => handleModerateReview(selectedReview.id, "REJECTED")}
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
