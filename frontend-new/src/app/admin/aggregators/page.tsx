"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  MoreHorizontal,
  ExternalLink,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

export default function AdminAggregatorsPage() {
  const [aggregators, setAggregators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchAggregators() {
      try {
        const data = await api.get<any>("/pos-systems?limit=100");
        const filtered = (data.data || []).filter((s: any) =>
          s.category?.slug?.includes("aggregator")
        );
        setAggregators(filtered);
      } catch (error) {
        console.error("Failed to fetch aggregators:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAggregators();
  }, []);

  const filteredAggregators = aggregators.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цей агрегатор?")) return;

    try {
      await api.delete(`/pos-systems/${id}`);
      setAggregators(aggregators.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Помилка при видаленні");
    }
  };

  const getCategoryLabel = (slug: string) => {
    if (slug?.includes("delivery")) return "Доставка";
    if (slug?.includes("suppliers")) return "Постачальники";
    if (slug?.includes("equipment")) return "Обладнання";
    if (slug?.includes("qr-menu")) return "QR-меню";
    return slug;
  };

  const getCategoryColor = (slug: string) => {
    if (slug?.includes("delivery")) return "bg-blue-500/10 text-blue-400";
    if (slug?.includes("suppliers")) return "bg-green-500/10 text-green-400";
    if (slug?.includes("equipment")) return "bg-purple-500/10 text-purple-400";
    if (slug?.includes("qr-menu")) return "bg-amber-500/10 text-amber-400";
    return "bg-zinc-500/10 text-zinc-400";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Агрегатори</h1>
          <p className="text-zinc-400 mt-1">
            Управління всіма агрегаторами платформи
          </p>
        </div>
        <Link href="/admin/services/new?category=aggregator">
          <Button className="bg-amber-500 hover:bg-amber-600 text-zinc-900">
            <Plus className="h-4 w-4 mr-2" />
            Додати агрегатор
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Пошук агрегаторів..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Badge variant="secondary">
              {filteredAggregators.length} агрегаторів
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-zinc-400">Завантаження...</div>
          ) : filteredAggregators.length === 0 ? (
            <div className="text-center py-8 text-zinc-400">
              Агрегаторів не знайдено
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Назва</TableHead>
                  <TableHead>Категорія</TableHead>
                  <TableHead>Опис</TableHead>
                  <TableHead>Сайт</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Дії</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAggregators.map((aggregator) => (
                  <TableRow key={aggregator.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                          <Layers className="h-5 w-5 text-amber-500" />
                        </div>
                        <p className="font-medium text-zinc-100">
                          {aggregator.name}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(aggregator.category?.slug)}>
                        {getCategoryLabel(aggregator.category?.slug)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-zinc-400 truncate max-w-[200px]">
                        {aggregator.shortDescription || "—"}
                      </p>
                    </TableCell>
                    <TableCell>
                      {aggregator.website ? (
                        <a
                          href={aggregator.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-400 hover:text-amber-300 flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span className="text-xs">Відкрити</span>
                        </a>
                      ) : (
                        <span className="text-zinc-500">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={aggregator.isActive ? "default" : "secondary"}
                        className={
                          aggregator.isActive
                            ? "bg-green-500/10 text-green-400"
                            : ""
                        }
                      >
                        {aggregator.isActive ? "Активний" : "Неактивний"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/services/${aggregator.id}/edit`}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Редагувати
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-400"
                            onClick={() => handleDelete(aggregator.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Видалити
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

