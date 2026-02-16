"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  aspectRatio?: "square" | "video" | "banner";
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  label = "Завантажити зображення",
  aspectRatio = "square",
  className,
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    banner: "aspect-[3/1]",
  };

  const handleFileChange = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Будь ласка, виберіть зображення");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Файл занадто великий. Максимум 5MB");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onChange(data.url);
    } catch (error) {
      console.error("Upload error:", error);
      
      // Fallback: convert to base64 for demo purposes
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {value ? (
        <div className="relative group">
          <div
            className={cn(
              "relative overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800",
              aspectClasses[aspectRatio]
            )}
          >
            <img
              src={value}
              alt="Uploaded"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-1" />
              Замінити
            </Button>
            {onRemove && (
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={onRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "relative rounded-lg border-2 border-dashed transition-colors cursor-pointer",
            dragOver
              ? "border-amber-500 bg-amber-500/10"
              : "border-zinc-700 hover:border-zinc-600 bg-zinc-800/50",
            aspectClasses[aspectRatio]
          )}
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            {loading ? (
              <>
                <Loader2 className="h-8 w-8 text-amber-500 animate-spin mb-2" />
                <p className="text-sm text-zinc-400">Завантаження...</p>
              </>
            ) : (
              <>
                <div className="h-12 w-12 rounded-full bg-zinc-700 flex items-center justify-center mb-3">
                  <ImageIcon className="h-6 w-6 text-zinc-400" />
                </div>
                <p className="text-sm text-zinc-300 font-medium mb-1">{label}</p>
                <p className="text-xs text-zinc-500 text-center">
                  Перетягніть файл або натисніть для вибору
                </p>
                <p className="text-xs text-zinc-600 mt-1">PNG, JPG до 5MB</p>
              </>
            )}
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileChange(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

interface MultiImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  label?: string;
}

export function MultiImageUpload({
  values,
  onChange,
  maxImages = 8,
  label = "Додати зображення",
}: MultiImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (files: FileList) => {
    if (!files.length) return;

    const remainingSlots = maxImages - values.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    setLoading(true);

    const newUrls: string[] = [];

    for (const file of filesToUpload) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 5 * 1024 * 1024) continue;

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          newUrls.push(data.url);
        } else {
          throw new Error("Upload failed");
        }
      } catch {
        // Fallback: convert to base64
        const url = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
        newUrls.push(url);
      }
    }

    onChange([...values, ...newUrls]);
    setLoading(false);
  };

  const handleRemove = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {values.map((url, index) => (
          <div key={index} className="relative group aspect-square">
            <img
              src={url}
              alt={`Image ${index + 1}`}
              className="h-full w-full object-cover rounded-lg border border-zinc-700"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 h-6 w-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {values.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="aspect-square rounded-lg border-2 border-dashed border-zinc-700 hover:border-zinc-600 bg-zinc-800/50 flex flex-col items-center justify-center transition-colors"
          >
            {loading ? (
              <Loader2 className="h-6 w-6 text-amber-500 animate-spin" />
            ) : (
              <>
                <Upload className="h-6 w-6 text-zinc-500 mb-1" />
                <span className="text-xs text-zinc-500">{label}</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFileChange(e.target.files);
          e.target.value = "";
        }}
      />

      <p className="text-xs text-zinc-500">
        {values.length} / {maxImages} зображень
      </p>
    </div>
  );
}

