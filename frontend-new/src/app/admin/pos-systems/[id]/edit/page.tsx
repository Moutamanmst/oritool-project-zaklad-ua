"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, ImageIcon } from "lucide-react";
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

export default function EditPosSystemPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
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
    coverImage: "",
    screenshots: [] as string[],
    isActive: true,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [service, cats] = await Promise.all([
          api.get<any>(`/pos-systems/${params.id}`),
          api.get<Category[]>("/categories"),
        ]);

        setCategories(cats || []);
        setForm({
          name: service.name || "",
          slug: service.slug || "",
          categoryId: service.categoryId || "",
          shortDescription: service.shortDescription || "",
          fullDescription: service.fullDescription || "",
          website: service.website || "",
          logo: service.logo || "",
          coverImage: service.coverImage || "",
          screenshots: service.screenshots || [],
          isActive: service.isActive ?? true,
        });
      } catch (error) {
        console.error("Failed to fetch:", error);
        alert("POS-система не знайдена");
        router.push("/admin/pos-systems");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchData();
    }
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.patch(`/pos-systems/${params.id}`, form);
      alert("POS-система оновлена!");
      router.push("/admin/pos-systems");
    } catch (error) {
      console.error("Failed to update:", error);
      alert("Помилка при оновленні");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-zinc-100">Редагування POS-системи</h1>
          <p className="text-zinc-400 mt-1">{form.name}</p>
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
                <Label htmlFor="name">Назва</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
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

        {/* Images Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-amber-500" />
              Зображення
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cover Image */}
              <div className="space-y-2">
                <Label htmlFor="coverImage">Обкладинка (URL)</Label>
                <Input
                  id="coverImage"
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  placeholder="https://example.com/cover.jpg"
                />
                {form.coverImage && (
                  <div className="mt-2 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                    <p className="text-xs text-zinc-500 mb-2">Попередній перегляд:</p>
                    <img
                      src={form.coverImage}
                      alt="Cover"
                      className="h-32 w-full object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Screenshots Info */}
              <div className="space-y-2">
                <Label>Скріншоти інтерфейсу</Label>
                <p className="text-sm text-zinc-400">
                  Додайте скріншоти для демонстрації POS-системи
                </p>
              </div>
            </div>

            {/* Screenshots Gallery */}
            <div className="space-y-2">
              <Label>Скріншоти (URLs, по одному на рядок)</Label>
              <Textarea
                value={form.screenshots.join("\n")}
                onChange={(e) => setForm({ 
                  ...form, 
                  screenshots: e.target.value.split("\n").filter(url => url.trim()) 
                })}
                placeholder="https://example.com/screen1.jpg&#10;https://example.com/screen2.jpg"
                rows={4}
              />
              {form.screenshots.length > 0 && (
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {form.screenshots.slice(0, 8).map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt={`Screenshot ${idx + 1}`}
                        className="h-20 w-full object-cover rounded-lg border border-zinc-700"
                      />
                      <button
                        type="button"
                        onClick={() => setForm({
                          ...form,
                          screenshots: form.screenshots.filter((_, i) => i !== idx)
                        })}
                        className="absolute top-1 right-1 h-5 w-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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
                Збереження...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Зберегти
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

