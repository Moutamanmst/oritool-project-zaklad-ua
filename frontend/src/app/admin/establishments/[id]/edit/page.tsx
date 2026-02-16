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
import { ImageUpload, MultiImageUpload } from "@/components/ui/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";

export default function EditEstablishmentPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    type: "restaurant",
    address: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    priceRange: "$$",
    isActive: true,
    logo: "",
    coverImage: "",
    images: [] as string[],
  });

  useEffect(() => {
    async function fetchEstablishment() {
      try {
        const data = await api.get<any>(`/establishments/${params.id}`);
        setForm({
          name: data.name || "",
          slug: data.slug || "",
          type: data.type || "restaurant",
          address: data.address || "",
          phone: data.phone || "",
          email: data.email || "",
          website: data.website || "",
          description: data.description || "",
          priceRange: data.priceRange || "$$",
          isActive: data.isActive ?? true,
          logo: data.logo || "",
          coverImage: data.coverImage || "",
          images: data.images || [],
        });
      } catch (error) {
        console.error("Failed to fetch establishment:", error);
        alert("Заклад не знайдено");
        router.push("/admin/establishments");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchEstablishment();
    }
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.patch(`/establishments/${params.id}`, form);
      alert("Заклад оновлено!");
      router.push("/admin/establishments");
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
        <Link href="/admin/establishments">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Редагування закладу</h1>
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
                <Label htmlFor="type">Тип закладу</Label>
                <Select
                  value={form.type}
                  onValueChange={(value) => setForm({ ...form, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurant">Ресторан</SelectItem>
                    <SelectItem value="cafe">Кафе</SelectItem>
                    <SelectItem value="bar">Бар</SelectItem>
                    <SelectItem value="fast_food">Фаст-фуд</SelectItem>
                    <SelectItem value="coffee_shop">Кав'ярня</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priceRange">Цінова категорія</Label>
                <Select
                  value={form.priceRange}
                  onValueChange={(value) => setForm({ ...form, priceRange: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="$">$ (Бюджетний)</SelectItem>
                    <SelectItem value="$$">$$ (Середній)</SelectItem>
                    <SelectItem value="$$$">$$$ (Преміум)</SelectItem>
                    <SelectItem value="$$$$">$$$$ (Люкс)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Опис</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Контактна інформація</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Адреса</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Веб-сайт</Label>
                <Input
                  id="website"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </div>
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
              {/* Logo */}
              <div className="space-y-2">
                <Label>Логотип</Label>
                <ImageUpload
                  value={form.logo}
                  onChange={(url) => setForm({ ...form, logo: url })}
                  onRemove={() => setForm({ ...form, logo: "" })}
                  label="Завантажити логотип"
                  aspectRatio="square"
                />
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <Label>Обкладинка</Label>
                <ImageUpload
                  value={form.coverImage}
                  onChange={(url) => setForm({ ...form, coverImage: url })}
                  onRemove={() => setForm({ ...form, coverImage: "" })}
                  label="Завантажити обкладинку"
                  aspectRatio="video"
                />
              </div>
            </div>

            {/* Gallery */}
            <div className="space-y-2">
              <Label>Галерея</Label>
              <MultiImageUpload
                values={form.images}
                onChange={(urls) => setForm({ ...form, images: urls })}
                maxImages={8}
                label="Додати фото"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 mt-6">
          <Link href="/admin/establishments">
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

