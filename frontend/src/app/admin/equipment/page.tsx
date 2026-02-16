"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Star,
  ExternalLink,
  Wrench,
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

interface Equipment {
  id: string;
  slug: string;
  name: string;
  nameRu?: string;
  description: string;
  shortDescription: string;
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
  categoryId?: string;
  category?: { name: string; slug: string; id: string };
}

const EQUIPMENT_CATEGORY_SLUGS = ["equipment"];

export default function AdminEquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Equipment | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const { showToast } = useToast();
  const { confirm } = useConfirm();

  const fetchEquipment = useCallback(async () => {
    setLoading(true);
    try {
      const [data, categoriesData] = await Promise.all([
        api.get<{ data: Equipment[] }>(`${endpoints.posSystems.list}?limit=100`),
        api.get<any[]>(`${endpoints.categories.list}`).catch(() => []),
      ]);
      
      const filtered = (data.data || []).filter(s => {
        const catSlug = s.category?.slug?.toLowerCase() || "";
        return EQUIPMENT_CATEGORY_SLUGS.includes(catSlug);
      });
      
      setEquipment(filtered);
      const cats = Array.isArray(categoriesData) ? categoriesData : (categoriesData.data || []);
      setCategories(cats);
    } catch (error) {
      console.error("Failed to fetch equipment:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  const handleEdit = (item: Equipment) => {
    setSelectedItem(item);
    setEditDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setEditDialogOpen(true);
  };

  const handleSave = async (data: any) => {
    try {
      // Знаходимо категорію equipment
      const equipmentCat = categories.find(c => c.slug === "equipment");
      
      // Filter only valid fields
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
        categoryId: equipmentCat?.id || data.categoryId,
      };
      
      // Remove undefined values
      const cleanData = Object.fromEntries(
        Object.entries(posFields).filter(([_, v]) => v !== undefined && v !== "")
      );
      
      if (selectedItem?.id) {
        await api.patch(`${endpoints.posSystems.detail(selectedItem.id)}`, cleanData);
        showToast("Обладнання оновлено!");
      } else {
        await api.post(endpoints.posSystems.list, cleanData);
        showToast("Обладнання створено!");
      }
      fetchEquipment();
    } catch (error) {
      console.error("Failed to save:", error);
      throw error;
    }
  };

  const handleDelete = async (item: Equipment) => {
    const confirmed = await confirm({
      title: "Видалити обладнання?",
      message: `Ви впевнені, що хочете видалити "${item.name}"? Цю дію не можна скасувати.`,
      confirmText: "Видалити",
      variant: "danger",
    });
    if (!confirmed) return;
    try {
      await api.delete(`${endpoints.posSystems.detail(item.id)}`);
      showToast("Обладнання видалено!");
      fetchEquipment();
    } catch (error) {
      showToast("Помилка видалення", "error");
    }
  };

  const handleToggleFeatured = async (item: Equipment) => {
    try {
      await api.patch(`${endpoints.posSystems.detail(item.id)}`, { isFeatured: !item.isFeatured });
      fetchEquipment();
    } catch (error) {
      showToast("Помилка оновлення", "error");
    }
  };

  const filteredData = equipment.filter((s) => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    return true;
  });

  const getEquipmentType = (item: Equipment) => {
    const name = (item.name || "").toLowerCase();
    const desc = (item.shortDescription || "").toLowerCase();
    
    if (name.includes("oven") || name.includes("combi") || name.includes("rational") || desc.includes("піч")) {
      return { type: "Печі", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" };
    } else if (name.includes("ice") || name.includes("hoshizaki") || desc.includes("льод") || desc.includes("холод")) {
      return { type: "Холодильне", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
    } else if (name.includes("dishwasher") || name.includes("fagor") || desc.includes("посудомий")) {
      return { type: "Посудомийне", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" };
    } else if (name.includes("grill") || desc.includes("гриль")) {
      return { type: "Грилі", color: "bg-red-500/10 text-red-400 border-red-500/20" };
    }
    return { type: "Обладнання", color: "bg-zinc-800/50" };
  };

  const columns: Column<Equipment>[] = [
    {
      key: "name",
      header: "Назва",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
            {item.logoUrl ? (
              <Image src={item.logoUrl} alt={item.name} fill className="object-contain p-1" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-zinc-500">
                <Package className="h-5 w-5" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-zinc-100">{item.name}</p>
              {item.isFeatured && (
                <Badge className="bg-amber-500/10 text-amber-400 text-[10px] px-1">ТОП</Badge>
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
      key: "type",
      header: "Тип",
      render: (item) => {
        const { type, color } = getEquipmentType(item);
        return <Badge variant="outline" className={color}>{type}</Badge>;
      },
    },
    {
      key: "features",
      header: "Характеристики",
      render: (item) => (
        <span className="text-zinc-400 text-sm">
          {(item.features || []).length > 0 ? item.features.slice(0, 2).join(", ") : "—"}
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
          <span className="font-medium text-zinc-100">{item.averageRating?.toFixed(1) || "0.0"}</span>
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
      key: "website",
      header: "Сайт",
      render: (item) => item.website ? (
        <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300">
          <ExternalLink className="h-3 w-3" />
        </a>
      ) : <span className="text-zinc-600">—</span>,
    },
    {
      key: "status",
      header: "Статус",
      sortable: true,
      render: (item) => <StatusBadge status={item.status} />,
    },
  ];

  const stats = {
    total: equipment.length,
    active: equipment.filter((s) => s.status === "ACTIVE").length,
    featured: equipment.filter((s) => s.isFeatured).length,
    avgRating: equipment.length
      ? (equipment.reduce((acc, s) => acc + (s.averageRating || 0), 0) / equipment.length).toFixed(1)
      : "0.0",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
            <Package className="h-7 w-7 text-orange-400" />
            Обладнання
          </h1>
          <p className="text-zinc-400 mt-1">Професійне обладнання для закладів HoReCa</p>
        </div>
        <Button onClick={handleCreate} className="bg-amber-500 hover:bg-amber-600">
          <Plus className="h-4 w-4 mr-2" />
          Додати обладнання
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-zinc-100">{stats.total}</p>
            <p className="text-sm text-zinc-500">Всього обладнання</p>
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

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={filteredData}
            loading={loading}
            searchPlaceholder="Пошук обладнання..."
            pageSize={15}
            onRefresh={fetchEquipment}
            filters={
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
                    <Link href={`/equipment/${item.slug}`} target="_blank">
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
                  <DropdownMenuItem className="text-red-400" onClick={() => handleDelete(item)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Видалити
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          />
        </CardContent>
      </Card>

      <ServiceEditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSave}
        service={selectedItem}
        type="equipment"
        categories={categories.filter(c => EQUIPMENT_CATEGORY_SLUGS.includes(c.slug))}
      />
    </div>
  );
}
