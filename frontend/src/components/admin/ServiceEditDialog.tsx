"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImageCropper } from "@/components/ui/image-cropper";
import { X, Plus, Save, Loader2, Upload, Star, Crop } from "lucide-react";
import { api } from "@/lib/api";

export type ServiceType = "pos" | "equipment" | "suppliers" | "delivery" | "qr-menu";

interface ServiceData {
  id?: string;
  name: string;
  nameRu?: string;
  slug?: string;
  description: string;
  descriptionRu?: string;
  shortDescription?: string;
  shortDescriptionRu?: string;
  logoUrl?: string;
  coverUrl?: string;
  website?: string;
  priceFrom?: number;
  priceTo?: number;
  pricingModel?: string;
  features: string[];
  integrations: string[];
  status: string;
  isFeatured: boolean;
  categoryId?: string;
  // Additional fields
  manufacturer?: string;
  warranty?: string;
  deliveryRegions?: string[];
  minOrder?: number;
  commission?: number;
}

interface ServiceEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ServiceData) => Promise<void>;
  service?: ServiceData | null;
  type: ServiceType;
  categories?: { id: string; name: string; slug: string }[];
}

const defaultService: ServiceData = {
  name: "",
  description: "",
  shortDescription: "",
  features: [],
  integrations: [],
  status: "PENDING",
  isFeatured: false,
};

const typeConfig: Record<ServiceType, {
  title: string;
  fields: string[];
  featureLabel: string;
  featurePlaceholder: string;
}> = {
  pos: {
    title: "POS-система",
    fields: ["price", "pricingModel", "integrations"],
    featureLabel: "Функції системи",
    featurePlaceholder: "Наприклад: склад, CRM, аналітика",
  },
  equipment: {
    title: "Обладнання",
    fields: ["manufacturer", "warranty"],
    featureLabel: "Характеристики",
    featurePlaceholder: "Наприклад: потужність, розмір, матеріал",
  },
  suppliers: {
    title: "Постачальник",
    fields: ["deliveryRegions", "minOrder"],
    featureLabel: "Спеціалізація",
    featurePlaceholder: "Наприклад: м'ясо, овочі, морепродукти",
  },
  delivery: {
    title: "Сервіс доставки",
    fields: ["commission", "integrations"],
    featureLabel: "Можливості",
    featurePlaceholder: "Наприклад: tracking, швидка доставка",
  },
  "qr-menu": {
    title: "QR-меню сервіс",
    fields: ["price", "pricingModel", "integrations"],
    featureLabel: "Функції",
    featurePlaceholder: "Наприклад: замовлення, оплата, мультимова",
  },
};

const pricingModels = [
  { value: "subscription", label: "Підписка (щомісячно)" },
  { value: "one-time", label: "Одноразова оплата" },
  { value: "freemium", label: "Freemium" },
  { value: "free", label: "Безкоштовно" },
  { value: "custom", label: "Індивідуально" },
];

const statusOptions = [
  { value: "ACTIVE", label: "Активний" },
  { value: "PENDING", label: "На модерації" },
  { value: "INACTIVE", label: "Неактивний" },
];

export function ServiceEditDialog({
  open,
  onClose,
  onSave,
  service,
  type,
  categories = [],
}: ServiceEditDialogProps) {
  const [data, setData] = useState<ServiceData>(defaultService);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [newIntegration, setNewIntegration] = useState("");
  const config = typeConfig[type];
  
  // Crop state
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperImage, setCropperImage] = useState("");
  const [cropperField, setCropperField] = useState<"logoUrl" | "coverUrl">("logoUrl");
  const [cropperAspect, setCropperAspect] = useState(1);

  // Open cropper with selected image
  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>, field: "logoUrl" | "coverUrl") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Можна завантажувати тільки зображення");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Розмір файлу не може перевищувати 10MB");
      return;
    }

    // Create URL for cropper
    const imageUrl = URL.createObjectURL(file);
    setCropperImage(imageUrl);
    setCropperField(field);
    setCropperAspect(field === "logoUrl" ? 1 : 2); // 1:1 for logo, 2:1 for cover
    setCropperOpen(true);
    
    // Reset input
    e.target.value = "";
  };

  // Upload cropped image
  const handleCropComplete = async (croppedBlob: Blob) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", croppedBlob, "cropped-image.jpg");

      const response = await fetch("http://localhost:3001/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      setData({ ...data, [cropperField]: result.url });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Помилка завантаження файлу");
    } finally {
      setUploading(false);
      // Clean up object URL
      if (cropperImage) {
        URL.revokeObjectURL(cropperImage);
      }
    }
  };

  useEffect(() => {
    if (service) {
      setData({
        ...defaultService,
        ...service,
        features: service.features || [],
        integrations: service.integrations || [],
      });
    } else {
      setData(defaultService);
    }
  }, [service, open]);

  const handleSave = async () => {
    if (!data.name.trim()) {
      alert("Введіть назву");
      return;
    }
    setSaving(true);
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Помилка збереження");
    } finally {
      setSaving(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !data.features.includes(newFeature.trim())) {
      setData({ ...data, features: [...data.features, newFeature.trim()] });
      setNewFeature("");
    }
  };

  const removeFeature = (feature: string) => {
    setData({ ...data, features: data.features.filter((f) => f !== feature) });
  };

  const addIntegration = () => {
    if (newIntegration.trim() && !data.integrations.includes(newIntegration.trim())) {
      setData({ ...data, integrations: [...data.integrations, newIntegration.trim()] });
      setNewIntegration("");
    }
  };

  const removeIntegration = (integration: string) => {
    setData({ ...data, integrations: data.integrations.filter((i) => i !== integration) });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl text-zinc-100">
            {service?.id ? `Редагувати ${config.title}` : `Додати ${config.title}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <Label className="text-zinc-300">Назва *</Label>
              <Input
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                placeholder="Назва українською"
                className="mt-1 bg-zinc-800 border-zinc-700"
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <Label className="text-zinc-300">Назва (RU)</Label>
              <Input
                value={data.nameRu || ""}
                onChange={(e) => setData({ ...data, nameRu: e.target.value })}
                placeholder="Название на русском"
                className="mt-1 bg-zinc-800 border-zinc-700"
              />
            </div>
          </div>

          {/* Short Description */}
          <div>
            <Label className="text-zinc-300">Короткий опис</Label>
            <Input
              value={data.shortDescription || ""}
              onChange={(e) => setData({ ...data, shortDescription: e.target.value })}
              placeholder="Короткий опис для карток (до 100 символів)"
              className="mt-1 bg-zinc-800 border-zinc-700"
              maxLength={100}
            />
          </div>

          {/* Full Description */}
          <div>
            <Label className="text-zinc-300">Повний опис</Label>
            <Textarea
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              placeholder="Детальний опис..."
              className="mt-1 bg-zinc-800 border-zinc-700 min-h-[100px]"
            />
          </div>

          {/* Logo Upload */}
          <div>
            <Label className="text-zinc-300">Логотип</Label>
            <div className="mt-2 flex items-start gap-4">
              {/* Preview */}
              <div className="w-20 h-20 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden flex-shrink-0">
                {data.logoUrl ? (
                  <img 
                    src={data.logoUrl} 
                    alt="Logo preview" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500">
                    <Upload className="h-6 w-6" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-2">
                {/* Upload Button */}
                <div className="flex gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleSelectImage(e, "logoUrl")}
                      disabled={uploading}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      disabled={uploading}
                      asChild
                    >
                      <span>
                        {uploading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        Завантажити
                      </span>
                    </Button>
                  </label>
                  {data.logoUrl && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setData({ ...data, logoUrl: "" })}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {/* URL Input */}
                <Input
                  value={data.logoUrl || ""}
                  onChange={(e) => setData({ ...data, logoUrl: e.target.value })}
                  placeholder="або вставте URL зображення"
                  className="bg-zinc-800 border-zinc-700 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Cover Image Upload */}
          <div>
            <Label className="text-zinc-300">Обкладинка (головне зображення)</Label>
            <div className="mt-2 flex items-start gap-4">
              {/* Preview */}
              <div className="w-32 h-20 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden flex-shrink-0">
                {data.coverUrl ? (
                  <img 
                    src={data.coverUrl} 
                    alt="Cover preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500">
                    <Upload className="h-6 w-6" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-2">
                {/* Upload Button */}
                <div className="flex gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleSelectImage(e, "coverUrl")}
                      disabled={uploading}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      disabled={uploading}
                      asChild
                    >
                      <span>
                        {uploading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        Завантажити
                      </span>
                    </Button>
                  </label>
                  {data.coverUrl && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setData({ ...data, coverUrl: "" })}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {/* URL Input */}
                <Input
                  value={data.coverUrl || ""}
                  onChange={(e) => setData({ ...data, coverUrl: e.target.value })}
                  placeholder="або вставте URL зображення"
                  className="bg-zinc-800 border-zinc-700 text-sm"
                />
              </div>
            </div>
            <p className="text-xs text-zinc-500 mt-1">Рекомендований розмір: 1200x600px</p>
          </div>

          {/* Website */}
          <div>
            <Label className="text-zinc-300">Веб-сайт</Label>
            <Input
              value={data.website || ""}
              onChange={(e) => setData({ ...data, website: e.target.value })}
              placeholder="https://example.com"
              className="mt-1 bg-zinc-800 border-zinc-700"
            />
          </div>

          {/* Price (for POS, QR-menu) */}
          {config.fields.includes("price") && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-zinc-300">Ціна від (₴)</Label>
                <Input
                  type="number"
                  value={data.priceFrom || ""}
                  onChange={(e) => setData({ ...data, priceFrom: Number(e.target.value) || undefined })}
                  placeholder="0"
                  className="mt-1 bg-zinc-800 border-zinc-700"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Ціна до (₴)</Label>
                <Input
                  type="number"
                  value={data.priceTo || ""}
                  onChange={(e) => setData({ ...data, priceTo: Number(e.target.value) || undefined })}
                  placeholder="0"
                  className="mt-1 bg-zinc-800 border-zinc-700"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Модель оплати</Label>
                <Select
                  value={data.pricingModel || ""}
                  onValueChange={(value) => setData({ ...data, pricingModel: value })}
                >
                  <SelectTrigger className="mt-1 bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder="Оберіть..." />
                  </SelectTrigger>
                  <SelectContent>
                    {pricingModels.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Manufacturer & Warranty (for Equipment) */}
          {config.fields.includes("manufacturer") && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-300">Виробник</Label>
                <Input
                  value={data.manufacturer || ""}
                  onChange={(e) => setData({ ...data, manufacturer: e.target.value })}
                  placeholder="Наприклад: RATIONAL, Hoshizaki"
                  className="mt-1 bg-zinc-800 border-zinc-700"
                />
              </div>
              <div>
                <Label className="text-zinc-300">Гарантія</Label>
                <Input
                  value={data.warranty || ""}
                  onChange={(e) => setData({ ...data, warranty: e.target.value })}
                  placeholder="Наприклад: 2 роки"
                  className="mt-1 bg-zinc-800 border-zinc-700"
                />
              </div>
            </div>
          )}

          {/* Commission (for Delivery) */}
          {config.fields.includes("commission") && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-300">Комісія (%)</Label>
                <Input
                  type="number"
                  value={data.commission || ""}
                  onChange={(e) => setData({ ...data, commission: Number(e.target.value) || undefined })}
                  placeholder="15"
                  className="mt-1 bg-zinc-800 border-zinc-700"
                />
              </div>
            </div>
          )}

          {/* Min Order (for Suppliers) */}
          {config.fields.includes("minOrder") && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-300">Мін. замовлення (₴)</Label>
                <Input
                  type="number"
                  value={data.minOrder || ""}
                  onChange={(e) => setData({ ...data, minOrder: Number(e.target.value) || undefined })}
                  placeholder="1000"
                  className="mt-1 bg-zinc-800 border-zinc-700"
                />
              </div>
            </div>
          )}

          {/* Features */}
          <div>
            <Label className="text-zinc-300">{config.featureLabel}</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder={config.featurePlaceholder}
                className="bg-zinc-800 border-zinc-700"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
              />
              <Button onClick={addFeature} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.features.map((feature) => (
                <Badge key={feature} variant="secondary" className="bg-zinc-800 gap-1">
                  {feature}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-400"
                    onClick={() => removeFeature(feature)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Integrations (for POS, Delivery, QR-menu) */}
          {config.fields.includes("integrations") && (
            <div>
              <Label className="text-zinc-300">Інтеграції</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={newIntegration}
                  onChange={(e) => setNewIntegration(e.target.value)}
                  placeholder="Наприклад: Poster, iiko, R-Keeper"
                  className="bg-zinc-800 border-zinc-700"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addIntegration())}
                />
                <Button onClick={addIntegration} variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.integrations.map((integration) => (
                  <Badge key={integration} variant="secondary" className="bg-emerald-500/10 text-emerald-400 gap-1">
                    {integration}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-400"
                      onClick={() => removeIntegration(integration)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Category is set automatically based on the page */}

          {/* Status & Featured */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-zinc-300">Статус</Label>
              <Select
                value={data.status}
                onValueChange={(value) => setData({ ...data, status: value })}
              >
                <SelectTrigger className="mt-1 bg-zinc-800 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Switch
                checked={data.isFeatured}
                onCheckedChange={(checked) => setData({ ...data, isFeatured: checked })}
              />
              <Label className="text-zinc-300 flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-400" />
                В ТОПі / Рекомендовано
              </Label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Скасувати
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-amber-500 hover:bg-amber-600">
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
      </DialogContent>

      {/* Image Cropper Modal */}
      <ImageCropper
        open={cropperOpen}
        onClose={() => {
          setCropperOpen(false);
          if (cropperImage) {
            URL.revokeObjectURL(cropperImage);
          }
        }}
        imageSrc={cropperImage}
        onCropComplete={handleCropComplete}
        aspect={cropperAspect}
        cropShape={cropperField === "logoUrl" ? "round" : "rect"}
      />
    </Dialog>
  );
}
