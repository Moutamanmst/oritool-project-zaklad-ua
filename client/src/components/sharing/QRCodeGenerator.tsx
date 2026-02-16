"use client";

import { useState, useRef, useEffect } from "react";
import { QrCode, Download, Copy, Check, ExternalLink, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trackEvent } from "@/components/analytics/GoogleAnalytics";

interface QRCodeGeneratorProps {
  url?: string;
  title?: string;
  size?: number;
  variant?: "button" | "icon" | "inline";
  className?: string;
}

export function QRCodeGenerator({
  url,
  title = "QR-код",
  size = 200,
  variant = "button",
  className = "",
}: QRCodeGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState(url || "");
  const [qrSize, setQrSize] = useState(size);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Get current URL if not provided
  useEffect(() => {
    if (!url && typeof window !== "undefined") {
      setQrUrl(window.location.href);
    }
  }, [url]);

  // Generate QR code using canvas
  useEffect(() => {
    if (!qrUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use QR code API
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(qrUrl)}&format=png&margin=10`;
    
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = qrSize;
      canvas.height = qrSize;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, qrSize, qrSize);
      ctx.drawImage(img, 0, 0, qrSize, qrSize);
      setQrDataUrl(canvas.toDataURL("image/png"));
    };
    img.src = qrApiUrl;
  }, [qrUrl, qrSize]);

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const link = document.createElement("a");
    link.download = `qr-code-${title.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.href = qrDataUrl;
    link.click();

    trackEvent("qr_download", "engagement", title);
  };

  const handleCopyImage = async () => {
    if (!qrDataUrl) return;

    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackEvent("qr_copy", "engagement", title);
    } catch (err) {
      console.error("Failed to copy image:", err);
      // Fallback: copy URL
      await navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (!qrDataUrl) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR-код: ${title}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              font-family: system-ui, sans-serif;
            }
            img {
              max-width: 300px;
              margin-bottom: 20px;
            }
            h1 {
              font-size: 18px;
              color: #333;
              margin-bottom: 10px;
            }
            p {
              font-size: 12px;
              color: #666;
              word-break: break-all;
              max-width: 300px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <img src="${qrDataUrl}" alt="QR Code" />
          <p>${qrUrl}</p>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    trackEvent("qr_print", "engagement", title);
  };

  const TriggerButton = () => {
    if (variant === "icon") {
      return (
        <Button variant="ghost" size="sm" className={`h-8 w-8 p-0 ${className}`}>
          <QrCode className="h-4 w-4" />
        </Button>
      );
    }

    if (variant === "inline") {
      return (
        <button className={`flex items-center gap-2 text-sm text-zinc-400 hover:text-amber-400 transition-colors ${className}`}>
          <QrCode className="h-4 w-4" />
          QR-код
        </button>
      );
    }

    return (
      <Button variant="outline" size="sm" className={`border-zinc-700 ${className}`}>
        <QrCode className="h-4 w-4 mr-2" />
        QR-код
      </Button>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <TriggerButton />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-amber-400" />
            QR-код
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* QR Code Preview */}
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-white rounded-xl shadow-lg">
              <canvas ref={canvasRef} className="block" />
            </div>
            <p className="text-xs text-zinc-500 text-center max-w-[250px] truncate">
              {qrUrl}
            </p>
          </div>

          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="qr-url">URL</Label>
            <div className="flex gap-2">
              <Input
                id="qr-url"
                value={qrUrl}
                onChange={(e) => setQrUrl(e.target.value)}
                placeholder="https://..."
                className="bg-zinc-800/50 border-zinc-700"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(qrUrl, "_blank")}
                className="border-zinc-700 px-3"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2">
            <Label htmlFor="qr-size">Розмір</Label>
            <Select value={qrSize.toString()} onValueChange={(v) => setQrSize(parseInt(v))}>
              <SelectTrigger className="bg-zinc-800/50 border-zinc-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="150">150 × 150 px</SelectItem>
                <SelectItem value="200">200 × 200 px</SelectItem>
                <SelectItem value="300">300 × 300 px</SelectItem>
                <SelectItem value="400">400 × 400 px (HD)</SelectItem>
                <SelectItem value="500">500 × 500 px (Print)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleDownload}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-zinc-900"
            >
              <Download className="h-4 w-4 mr-2" />
              Завантажити
            </Button>
            <Button
              variant="outline"
              onClick={handleCopyImage}
              className={`border-zinc-700 ${copied ? "bg-emerald-500/10 border-emerald-500/50" : ""}`}
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button variant="outline" onClick={handlePrint} className="border-zinc-700">
              <Printer className="h-4 w-4" />
            </Button>
          </div>

          {/* Tip */}
          <p className="text-xs text-zinc-500 text-center">
            Скануйте QR-код камерою телефону, щоб відкрити посилання
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
