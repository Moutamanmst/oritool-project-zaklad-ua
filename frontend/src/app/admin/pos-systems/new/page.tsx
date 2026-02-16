"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";

interface Category {
  id: string;
  slug: string;
  name: string;
}

export default function NewPosSystemPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    categoryId: "",
    shortDescription: "",
    fullDescription: "",
    website: "",
    logo: "",
    isActive: true,
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const cats = await api.get<Category[]>("/categories");
        setCategories(cats || []);
        
        const posCat = (cats || []).find((c: Category) => c.slug === "pos-systems");
        if (posCat) {
          setForm((prev) => ({ ...prev, categoryId: posCat.id }));
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }
    fetchCategories();
  }, []);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-zа-яіїєґ0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.post("/pos-systems", form);
      alert("POS-система створена!");
      router.push("/admin/pos-systems");
    } catch (error) {
      console.error("Failed to create:", error);
      alert("Помилка при створенні");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/pos-systems">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Нова POS-система</h1>
          <p className="text-zinc-400 mt-1">Додати нову POS-систему</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Основна інформація</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Назва *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm({
                      ...form,
                      name,
                      slug: generateSlug(name),
                    });
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL) *</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Категорія</Label>
                <Select
                  value={form.categoryId}
                  onValueChange={(value) => setForm({ ...form, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Оберіть категорію" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shortDescription">Короткий опис</Label>
                <Textarea
                  id="shortDescription"
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullDescription">Повний опис</Label>
                <Textarea
                  id="fullDescription"
                  value={form.fullDescription}
                  onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Додаткова інформація</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="website">Веб-сайт</Label>
                <Input
                  id="website"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">URL логотипу</Label>
                <Input
                  id="logo"
                  value={form.logo}
                  onChange={(e) => setForm({ ...form, logo: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              {form.logo && (
                <div className="p-4 bg-zinc-800 rounded-lg">
                  <p className="text-sm text-zinc-400 mb-2">Попередній перегляд:</p>
                  <img
                    src={form.logo}
                    alt="Logo preview"
                    className="h-16 w-16 object-contain rounded"
                  />
                </div>
              )}
              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="font-medium text-zinc-100">Активний</p>
                  <p className="text-sm text-zinc-400">Відображати на сайті</p>
                </div>
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Link href="/admin/pos-systems">
            <Button variant="outline">Скасувати</Button>
          </Link>
          <Button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-zinc-900"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Створення...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Створити
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

