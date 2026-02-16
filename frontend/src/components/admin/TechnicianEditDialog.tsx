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
import { X, Plus, Save, Loader2, Upload, CheckCircle } from "lucide-react";

interface TechnicianData {
  id?: string;
  name: string;
  phone?: string;
  email?: string;
  city?: string;
  address?: string;
  description?: string;
  specializations: string[];
  experience?: number;
  photoUrl?: string;
  isVerified: boolean;
  status: string;
}

interface TechnicianEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: TechnicianData) => Promise<void>;
  technician?: TechnicianData | null;
}

const defaultTechnician: TechnicianData = {
  name: "",
  phone: "",
  email: "",
  city: "",
  address: "",
  description: "",
  specializations: [],
  experience: undefined,
  photoUrl: "",
  isVerified: false,
  status: "PENDING",
};

const statusOptions = [
  { value: "ACTIVE", label: "Активний" },
  { value: "PENDING", label: "На модерації" },
  { value: "INACTIVE", label: "Неактивний" },
];

const commonSpecializations = [
  "POS-термінали",
  "Касові апарати",
  "Принтери чеків",
  "Сканери штрих-кодів",
  "Ваги торгові",
  "Холодильне обладнання",
  "Кавомашини",
  "Посудомийні машини",
  "Плити та печі",
  "Грилі та фритюрниці",
];

export function TechnicianEditDialog({
  open,
  onClose,
  onSave,
  technician,
}: TechnicianEditDialogProps) {
  const [data, setData] = useState<TechnicianData>(defaultTechnician);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newSpec, setNewSpec] = useState("");
  
  // Crop state
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperImage, setCropperImage] = useState("");

  useEffect(() => {
    if (technician) {
      setData({
        ...defaultTechnician,
        ...technician,
        specializations: technician.specializations || [],
      });
    } else {
      setData(defaultTechnician);
    }
  }, [technician, open]);

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Можна завантажувати тільки зображення");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setCropperImage(imageUrl);
    setCropperOpen(true);
    e.target.value = "";
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", croppedBlob, "photo.jpg");

      const response = await fetch("http://localhost:3001/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const result = await response.json();
      setData({ ...data, photoUrl: result.url });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Помилка завантаження фото");
    } finally {
      setUploading(false);
      if (cropperImage) URL.revokeObjectURL(cropperImage);
    }
  };

  const handleSave = async () => {
    if (!data.name.trim()) {
      alert("Введіть ім'я майстра");
      return;
    }
    setSaving(true);
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setSaving(false);
    }
  };

  const addSpecialization = (spec?: string) => {
    const value = spec || newSpec.trim();
    if (value && !data.specializations.includes(value)) {
      setData({ ...data, specializations: [...data.specializations, value] });
      setNewSpec("");
    }
  };

  const removeSpecialization = (spec: string) => {
    setData({ ...data, specializations: data.specializations.filter((s) => s !== spec) });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl text-zinc-100">
            {technician?.id ? "Редагувати майстра" : "Додати майстра"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Photo */}
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex-shrink-0">
              {data.photoUrl ? (
                <img src={data.photoUrl} alt="Photo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-500">
                  <Upload className="h-8 w-8" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <Label className="text-zinc-300">Фото майстра</Label>
              <div className="flex gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleSelectImage}
                    disabled={uploading}
                  />
                  <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
                    <span>
                      {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                      Завантажити
                    </span>
                  </Button>
                </label>
                {data.photoUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setData({ ...data, photoUrl: "" })}
                    className="text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <Label className="text-zinc-300">Ім'я *</Label>
            <Input
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              placeholder="Іван Петренко"
              className="mt-1 bg-zinc-800 border-zinc-700"
            />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-zinc-300">Телефон</Label>
              <Input
                value={data.phone || ""}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                placeholder="+380 XX XXX XXXX"
                className="mt-1 bg-zinc-800 border-zinc-700"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Email</Label>
              <Input
                value={data.email || ""}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                placeholder="email@example.com"
                className="mt-1 bg-zinc-800 border-zinc-700"
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-zinc-300">Місто</Label>
              <Input
                value={data.city || ""}
                onChange={(e) => setData({ ...data, city: e.target.value })}
                placeholder="Київ"
                className="mt-1 bg-zinc-800 border-zinc-700"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Досвід (років)</Label>
              <Input
                type="number"
                value={data.experience || ""}
                onChange={(e) => setData({ ...data, experience: Number(e.target.value) || undefined })}
                placeholder="5"
                className="mt-1 bg-zinc-800 border-zinc-700"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label className="text-zinc-300">Опис</Label>
            <Textarea
              value={data.description || ""}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              placeholder="Досвід роботи, кваліфікація..."
              className="mt-1 bg-zinc-800 border-zinc-700 min-h-[80px]"
            />
          </div>

          {/* Specializations */}
          <div>
            <Label className="text-zinc-300">Спеціалізації</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={newSpec}
                onChange={(e) => setNewSpec(e.target.value)}
                placeholder="Додати спеціалізацію..."
                className="bg-zinc-800 border-zinc-700"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSpecialization())}
              />
              <Button onClick={() => addSpecialization()} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Quick add */}
            <div className="flex flex-wrap gap-1 mt-2">
              {commonSpecializations
                .filter((s) => !data.specializations.includes(s))
                .slice(0, 5)
                .map((spec) => (
                  <Button
                    key={spec}
                    variant="ghost"
                    size="sm"
                    className="text-xs h-6 px-2 text-zinc-500 hover:text-zinc-300"
                    onClick={() => addSpecialization(spec)}
                  >
                    + {spec}
                  </Button>
                ))}
            </div>

            {/* Selected */}
            <div className="flex flex-wrap gap-2 mt-2">
              {data.specializations.map((spec) => (
                <Badge key={spec} variant="secondary" className="bg-zinc-800 gap-1">
                  {spec}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-400"
                    onClick={() => removeSpecialization(spec)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Status & Verified */}
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
                checked={data.isVerified}
                onCheckedChange={(checked) => setData({ ...data, isVerified: checked })}
              />
              <Label className="text-zinc-300 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-400" />
                Верифікований
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

      {/* Image Cropper */}
      <ImageCropper
        open={cropperOpen}
        onClose={() => {
          setCropperOpen(false);
          if (cropperImage) URL.revokeObjectURL(cropperImage);
        }}
        imageSrc={cropperImage}
        onCropComplete={handleCropComplete}
        aspect={1}
        cropShape="round"
      />
    </Dialog>
  );
}
