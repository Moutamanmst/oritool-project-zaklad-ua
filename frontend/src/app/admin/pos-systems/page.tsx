"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Monitor,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Star,
  ExternalLink,
  DollarSign,
  Link2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import { ServiceEditDialog } from "@/components/admin/ServiceEditDialog";
import { useToast } from "@/components/ui/toast-notification";
import { useConfirm } from "@/components/ui/confirm-dialog";

interface PosSystem {
  id: string;
  slug: string;
  name: string;
  nameRu?: string;
  description: string;
  descriptionRu?: string;
  shortDescription: string;
  shortDescriptionRu?: string;
  logoUrl: string;
  website: string;
  priceFrom: number;
  priceTo: number;
  pricingModel: string;
  features: string[];
  integrations: string[];
  status: string;
  isFeatured: boolean;
  viewCount: number;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  categoryId?: string;
  category?: { name: string; slug: string; id: string };
}

const pricingLabels: Record<string, string> = {
  subscription: "Підписка",
  "one-time": "Одноразово",
  free: "Безкоштовно",
  freemium: "Freemium",
};

// Категорії POS-систем (тільки реальні POS)
const POS_CATEGORY_SLUGS = ["pos-systems", "pos"];

export default function PosSystemsPage() {
  const [systems, setSystems] = useState<PosSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<PosSystem | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const { showToast } = useToast();
  const { confirm } = useConfirm();

  const fetchSystems = useCallback(async () => {
    setLoading(true);
    try {
      const [systemsData, categoriesData] = await Promise.all([
        api.get<{ data: PosSystem[] }>(`${endpoints.posSystems.list}?limit=100`),
        api.get<any[]>(`${endpoints.categories.list}`).catch(() => []),
      ]);
      
      // Фільтруємо тільки POS-системи
      const posSystems = (systemsData.data || []).filter(s => {
        const catSlug = s.category?.slug?.toLowerCase() || "";
        return POS_CATEGORY_SLUGS.includes(catSlug) || 
               (!catSlug && !["equipment", "delivery", "suppliers", "qr-menu", "aggregators"].some(c => s.slug?.includes(c)));
      });
      
      setSystems(posSystems);
      // API returns array directly, not { data: [] }
      const cats = Array.isArray(categoriesData) ? categoriesData : (categoriesData.data || []);
      setCategories(cats);
    } catch (error) {
      console.error("Failed to fetch POS systems:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSystems();
  }, [fetchSystems]);

  const handleEdit = (system: PosSystem) => {
    setSelectedSystem(system);
    setEditDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedSystem(null);
    setEditDialogOpen(true);
  };

  const handleSave = async (data: any) => {
    try {
      // Auto-set category to "POS-системи"
      const posCat = categories.find(c => c.slug === "pos-systems");
      
      // Filter only valid POS system fields
      const posFields = {
        name: data.name,
        nameRu: data.nameRu,
        description: data.description,
        descriptionRu: data.descriptionRu,
        shortDescription: data.shortDescription,
        shortDescriptionRu: data.shortDescriptionRu,
        logoUrl: data.logoUrl,
        coverUrl: data.coverUrl,
        website: data.website,
        priceFrom: data.priceFrom,
        priceTo: data.priceTo,
        pricingModel: data.pricingModel,
        features: data.features,
        integrations: data.integrations,
        status: data.status,
        isFeatured: data.isFeatured,
        categoryId: posCat?.id || data.categoryId,
      };
      
      // Remove undefined values
      const cleanData = Object.fromEntries(
        Object.entries(posFields).filter(([_, v]) => v !== undefined && v !== "")
      );
      
      if (selectedSystem?.id) {
        // Update existing
        await api.patch(`${endpoints.posSystems.detail(selectedSystem.id)}`, cleanData);
        showToast("POS-систему оновлено!");
      } else {
        // Create new
        await api.post(endpoints.posSystems.list, cleanData);
        showToast("POS-систему створено!");
      }
      fetchSystems();
    } catch (error) {
      console.error("Failed to save:", error);
      showToast("Помилка збереження", "error");
      throw error;
    }
  };

  const handleDelete = async (system: PosSystem) => {
    const confirmed = await confirm({
      title: "Видалити POS-систему?",
      message: `Ви впевнені, що хочете видалити "${system.name}"? Цю дію не можна скасувати.`,
      confirmText: "Видалити",
      cancelText: "Скасувати",
      variant: "danger",
    });
    
    if (!confirmed) return;
    
    try {
      await api.delete(`${endpoints.posSystems.detail(system.id)}`);
      showToast("POS-систему видалено!");
      fetchSystems();
    } catch (error) {
      console.error("Failed to delete:", error);
      showToast("Помилка видалення", "error");
    }
  };

  const handleToggleFeatured = async (system: PosSystem) => {
    try {
      await api.patch(`${endpoints.posSystems.detail(system.id)}`, {
        isFeatured: !system.isFeatured,
      });
      showToast(system.isFeatured ? "Прибрано з ТОПу" : "Додано в ТОП");
      fetchSystems();
    } catch (error) {
      console.error("Failed to toggle featured:", error);
      showToast("Помилка оновлення", "error");
    }
  };

  const filteredData = systems.filter((s) => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    return true;
  });

  const columns: Column<PosSystem>[] = [
    {
      key: "name",
      header: "Назва",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
            {item.logoUrl ? (
              <Image
                src={item.logoUrl}
                alt={item.name}
                fill
                className="object-contain p-1"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-zinc-500">
                <Monitor className="h-5 w-5" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-zinc-100">{item.name}</p>
              {item.isFeatured && (
                <Badge className="bg-amber-500/10 text-amber-400 text-[10px] px-1">
                  ТОП
                </Badge>
              )}
            </div>
            <p className="text-xs text-zinc-500 truncate max-w-[200px]">
              {item.shortDescription || item.slug}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "features",
      header: "Функції",
      render: (item) => {
        const features = item.features || [];
        return (
          <span className="text-zinc-400 text-sm">
            {features.length > 0 ? features.slice(0, 2).join(", ") : "—"}
          </span>
        );
      },
    },
    {
      key: "priceFrom",
      header: "Ціна",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-1">
          <DollarSign className="h-3 w-3 text-emerald-400" />
          <span className="text-zinc-300">
            {item.priceFrom ? (
              <>
                ₴{item.priceFrom.toLocaleString()}
                {item.priceTo && item.priceTo > item.priceFrom && (
                  <span className="text-zinc-500"> - ₴{item.priceTo.toLocaleString()}</span>
                )}
              </>
            ) : (
              <span className="text-emerald-400">Безкоштовно</span>
            )}
          </span>
        </div>
      ),
    },
    {
      key: "pricingModel",
      header: "Модель",
      sortable: true,
      render: (item) => (
        <span className="text-zinc-400 text-sm">
          {pricingLabels[item.pricingModel] || item.pricingModel || "—"}
        </span>
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
            {item.averageRating?.toFixed(1) || "0.0"}
          </span>
          <span className="text-zinc-500 text-xs">({item.reviewCount || 0})</span>
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
          {(item.viewCount || 0).toLocaleString()}
        </div>
      ),
    },
    {
      key: "integrations",
      header: "Інтеграції",
      render: (item) => {
        const integrations = item.integrations || [];
        return (
          <div className="flex items-center gap-1">
            <Link2 className="h-3 w-3 text-zinc-500" />
            <span className="text-zinc-400">{integrations.length}</span>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Статус",
      sortable: true,
      render: (item) => <StatusBadge status={item.status} />,
    },
  ];

  const stats = {
    total: systems.length,
    active: systems.filter((s) => s.status === "ACTIVE").length,
    featured: systems.filter((s) => s.isFeatured).length,
    avgRating: systems.length
      ? (systems.reduce((acc, s) => acc + (s.averageRating || 0), 0) / systems.length).toFixed(1)
      : "0.0",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
            <Monitor className="h-7 w-7 text-emerald-400" />
            POS-системи
          </h1>
          <p className="text-zinc-400 mt-1">
            Керування POS-системами для автоматизації закладів
          </p>
        </div>
        <Button onClick={handleCreate} className="bg-amber-500 hover:bg-amber-600">
          <Plus className="h-4 w-4 mr-2" />
          Додати POS-систему
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-zinc-100">{stats.total}</p>
            <p className="text-sm text-zinc-500">Всього POS-систем</p>
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
            <p className="text-2xl font-bold text-amber-400">{stats.featured}</p>
            <p className="text-sm text-zinc-500">В ТОПі</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
              <p className="text-2xl font-bold text-zinc-100">{stats.avgRating}</p>
            </div>
            <p className="text-sm text-zinc-500">Середній рейтинг</p>
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
            searchPlaceholder="Пошук систем..."
            pageSize={15}
            onRefresh={fetchSystems}
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
                    <Link href={`/pos-systems/${item.slug}`} target="_blank">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Переглянути на сайті
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Редагувати
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleToggleFeatured(item)}>
                    <Star className="h-4 w-4 mr-2" />
                    {item.isFeatured ? "Прибрати з ТОПу" : "Додати в ТОП"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-400"
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Видалити
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {/* Edit Dialog */}
      <ServiceEditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSave}
        service={selectedSystem}
        type="pos"
        categories={categories.filter(c => POS_CATEGORY_SLUGS.includes(c.slug))}
      />
    </div>
  );
}
