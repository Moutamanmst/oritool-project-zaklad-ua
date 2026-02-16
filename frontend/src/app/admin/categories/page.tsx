"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  MoreHorizontal,
  FolderTree,
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

interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  order: number;
  parentId?: string;
  children?: Category[];
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await api.get<Category[]>("/categories");
        setCategories(data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цю категорію?")) return;

    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Помилка при видаленні");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Категорії</h1>
          <p className="text-zinc-400 mt-1">Управління категоріями сервісів</p>
        </div>
        <Link href="/admin/categories/new">
          <Button className="bg-amber-500 hover:bg-amber-600 text-zinc-900">
            <Plus className="h-4 w-4 mr-2" />
            Додати категорію
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Пошук категорій..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Badge variant="secondary">{categories.length} категорій</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-zinc-400">Завантаження...</div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-8 text-zinc-400">Категорій не знайдено</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Назва</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Опис</TableHead>
                  <TableHead>Підкатегорії</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Дії</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                          <FolderTree className="h-5 w-5 text-amber-500" />
                        </div>
                        <p className="font-medium text-zinc-100">{category.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-zinc-800 px-2 py-1 rounded">
                        {category.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-zinc-400 truncate max-w-[200px]">
                        {category.description || "—"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {category.children?.length || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={category.isActive ? "default" : "secondary"}
                        className={
                          category.isActive ? "bg-green-500/10 text-green-400" : ""
                        }
                      >
                        {category.isActive ? "Активна" : "Неактивна"}
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
                            <Link href={`/admin/categories/${category.id}/edit`}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Редагувати
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-400"
                            onClick={() => handleDelete(category.id)}
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

