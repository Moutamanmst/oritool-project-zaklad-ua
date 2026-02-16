"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ui/image-upload";
import { api } from "@/lib/api";

export default function NewCategoryPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    nameRu: "",
    slug: "",
    description: "",
    descriptionRu: "",
    icon: "",
    iconImage: "",
    coverImage: "",
    order: 0,
    isActive: true,
  });

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
      await api.post("/categories", form);
      alert("Категорію створено!");
      router.push("/admin/categories");
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
        <Link href="/admin/categories">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Нова категорія</h1>
          <p className="text-zinc-400 mt-1">Додати нову категорію</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Українська</CardTitle>
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
                <Label htmlFor="description">Опис</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Російська</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nameRu">Назва (RU)</Label>
                <Input
                  id="nameRu"
                  value={form.nameRu}
                  onChange={(e) => setForm({ ...form, nameRu: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descriptionRu">Опис (RU)</Label>
                <Textarea
                  id="descriptionRu"
                  value={form.descriptionRu}
                  onChange={(e) => setForm({ ...form, descriptionRu: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Налаштування</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Іконка</Label>
                  <Input
                    id="icon"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    placeholder="monitor, truck, package..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Порядок</Label>
                  <Input
                    id="order"
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="font-medium text-zinc-100">Активна</p>
                  <p className="text-sm text-zinc-400">Відображати на сайті</p>
                </div>
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Images Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-amber-500" />
                Зображення
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Icon Image */}
                <div className="space-y-2">
                  <Label>Іконка категорії</Label>
                  <ImageUpload
                    value={form.iconImage}
                    onChange={(url) => setForm({ ...form, iconImage: url })}
                    onRemove={() => setForm({ ...form, iconImage: "" })}
                    label="Завантажити іконку"
                    aspectRatio="square"
                  />
                </div>

                {/* Cover Image */}
                <div className="space-y-2">
                  <Label>Обкладинка / Банер</Label>
                  <ImageUpload
                    value={form.coverImage}
                    onChange={(url) => setForm({ ...form, coverImage: url })}
                    onRemove={() => setForm({ ...form, coverImage: "" })}
                    label="Завантажити обкладинку"
                    aspectRatio="banner"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Link href="/admin/categories">
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

