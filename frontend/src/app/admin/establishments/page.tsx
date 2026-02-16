"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Store,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  MapPin,
  ExternalLink,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, StatusBadge, Column } from "@/components/ui/data-table";
import { api, endpoints } from "@/lib/api";
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

interface Establishment {
  id: string;
  slug: string;
  name: string;
  description: string;
  businessType: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logoUrl: string;
  priceRange: number;
  status: string;
  isFeatured: boolean;
  viewCount: number;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  category?: { name: string; slug: string };
  city?: { name: string };
}

const businessTypeLabels: Record<string, string> = {
  RESTAURANT: "Ресторан",
  CAFE: "Кафе",
  FASTFOOD: "Фаст-фуд",
  BAR: "Бар",
  BAKERY: "Пекарня",
  COFFEESHOP: "Кав'ярня",
  OTHER: "Інше",
};

export default function EstablishmentsPage() {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const fetchEstablishments = async () => {
    setLoading(true);
    try {
      const data = await api.get<{ data: Establishment[] }>(
        `${endpoints.establishments.list}?limit=100`
      );
      setEstablishments(data.data || []);
    } catch (error) {
      console.error("Failed to fetch establishments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstablishments();
  }, []);

  const filteredData = establishments.filter((e) => {
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    if (typeFilter !== "all" && e.businessType !== typeFilter) return false;
    return true;
  });

  const handleApprove = async (id: string) => {
    try {
      // API call to approve establishment
      setEstablishments((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: "ACTIVE" } : e))
      );
    } catch (error) {
      console.error("Failed to approve:", error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      // API call to reject establishment
      setEstablishments((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: "REJECTED" } : e))
      );
    } catch (error) {
      console.error("Failed to reject:", error);
    }
  };

  const columns: Column<Establishment>[] = [
    {
      key: "name",
      header: "Заклад",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
            {item.logoUrl ? (
              <Image
                src={item.logoUrl}
                alt={item.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-zinc-500">
                <Store className="h-5 w-5" />
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-zinc-100">{item.name}</p>
            <p className="text-xs text-zinc-500">{item.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "businessType",
      header: "Тип",
      sortable: true,
      render: (item) => (
        <Badge variant="outline" className="bg-zinc-800/50">
          {businessTypeLabels[item.businessType] || item.businessType}
        </Badge>
      ),
    },
    {
      key: "city",
      header: "Місто",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-1 text-zinc-400">
          <MapPin className="h-3 w-3" />
          {item.city?.name || "—"}
        </div>
      ),
    },
    {
      key: "averageRating",
      header: "Рейтинг",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
          <span className="font-medium text-zinc-100">
            {item.averageRating.toFixed(1)}
          </span>
          <span className="text-zinc-500 text-xs">({item.reviewCount})</span>
        </div>
      ),
    },
    {
      key: "viewCount",
      header: "Перегляди",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-1 text-zinc-400">
          <Eye className="h-3 w-3" />
          {item.viewCount.toLocaleString()}
        </div>
      ),
    },
    {
      key: "priceRange",
      header: "Ціна",
      sortable: true,
      render: (item) => (
        <span className="text-zinc-400">
          {"₴".repeat(item.priceRange)}
          <span className="text-zinc-700">{"₴".repeat(4 - item.priceRange)}</span>
        </span>
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
      header: "Створено",
      sortable: true,
      render: (item) => (
        <span className="text-zinc-500 text-xs">
          {new Date(item.createdAt).toLocaleDateString("uk-UA")}
        </span>
      ),
    },
  ];

  const stats = {
    total: establishments.length,
    active: establishments.filter((e) => e.status === "ACTIVE").length,
    pending: establishments.filter((e) => e.status === "PENDING").length,
    rejected: establishments.filter((e) => e.status === "REJECTED").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
            <Store className="h-7 w-7 text-blue-400" />
            Заклади
          </h1>
          <p className="text-zinc-400 mt-1">
            Керування закладами на платформі
          </p>
        </div>
        <Button className="bg-amber-500 hover:bg-amber-600">
          <Plus className="h-4 w-4 mr-2" />
          Додати заклад
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-zinc-100">{stats.total}</p>
            <p className="text-sm text-zinc-500">Всього закладів</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-emerald-400">{stats.active}</p>
            <p className="text-sm text-zinc-500">Активних</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-amber-400">{stats.pending}</p>
            <p className="text-sm text-zinc-500">Очікують модерації</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
            <p className="text-sm text-zinc-500">Відхилених</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={filteredData}
            loading={loading}
            searchPlaceholder="Пошук закладів..."
            pageSize={15}
            onRefresh={fetchEstablishments}
            onExport={() => {
              const csv = establishments
                .map((e) => `${e.name},${e.businessType},${e.status},${e.averageRating}`)
                .join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "establishments.csv";
              a.click();
            }}
            filters={
              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36 bg-zinc-800/50 border-zinc-700">
                    <SelectValue placeholder="Статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Всі статуси</SelectItem>
                    <SelectItem value="ACTIVE">Активні</SelectItem>
                    <SelectItem value="PENDING">Очікують</SelectItem>
                    <SelectItem value="INACTIVE">Неактивні</SelectItem>
                    <SelectItem value="REJECTED">Відхилені</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-36 bg-zinc-800/50 border-zinc-700">
                    <SelectValue placeholder="Тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Всі типи</SelectItem>
                    {Object.entries(businessTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
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
                  <DropdownMenuItem asChild>
                    <Link href={`/establishments/${item.slug}`} target="_blank">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Переглянути на сайті
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Редагувати
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {item.status === "PENDING" && (
                    <>
                      <DropdownMenuItem
                        onClick={() => handleApprove(item.id)}
                        className="text-emerald-400"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Схвалити
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleReject(item.id)}
                        className="text-red-400"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Відхилити
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-400">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Видалити
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            bulkActions={
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-emerald-400">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Схвалити вибрані
                </Button>
                <Button variant="outline" size="sm" className="text-red-400">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Видалити вибрані
                </Button>
              </div>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
