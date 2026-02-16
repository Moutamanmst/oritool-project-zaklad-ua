"use client";

import { useState, useEffect } from "react";
import { Save, Globe, Bell, Shield, Palette, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useThemeStore } from "@/store/theme";
import { dispatchThemeChange } from "@/components/providers/ThemeProvider";

interface Settings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  defaultLanguage: string;
  notifyNewReviews: boolean;
  notifyNewUsers: boolean;
  notifyBusinessRequests: boolean;
  notifySystemErrors: boolean;
  moderateReviews: boolean;
  verifyBusiness: boolean;
  enableRecaptcha: boolean;
  minRating: string;
  primaryColor: string;
  darkTheme: boolean;
  enableAnimations: boolean;
}

const defaultSettings: Settings = {
  siteName: "ZakladUA",
  siteDescription: "B2B платформа для ресторанного бізнесу України",
  contactEmail: "info@zaklad.ua",
  defaultLanguage: "uk",
  notifyNewReviews: true,
  notifyNewUsers: true,
  notifyBusinessRequests: true,
  notifySystemErrors: true,
  moderateReviews: true,
  verifyBusiness: true,
  enableRecaptcha: false,
  minRating: "1",
  primaryColor: "amber",
  darkTheme: true,
  enableAnimations: true,
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: "" });
  const setTheme = useThemeStore((state) => state.setTheme);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("zakladua-settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (e) {
        console.error("Failed to parse settings:", e);
      }
    }
    setLoaded(true);
  }, []);

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Live preview for theme settings
    if (key === "primaryColor" || key === "darkTheme" || key === "enableAnimations") {
      const newTheme: any = {};
      if (key === "primaryColor") newTheme.primaryColor = value;
      if (key === "darkTheme") newTheme.darkTheme = value;
      if (key === "enableAnimations") newTheme.enableAnimations = value;
      setTheme(newTheme);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    localStorage.setItem("zakladua-settings", JSON.stringify(settings));
    
    // Apply theme changes immediately
    setTheme({
      primaryColor: settings.primaryColor as any,
      darkTheme: settings.darkTheme,
      enableAnimations: settings.enableAnimations,
    });
    
    // Notify other components about theme change
    dispatchThemeChange();
    
    setSaving(false);
    showToast("Налаштування збережено!");
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Налаштування</h1>
          <p className="text-zinc-400 mt-1">Загальні налаштування платформи</p>
        </div>
        <Button
          className="bg-amber-500 hover:bg-amber-600 text-zinc-900"
          onClick={handleSave}
          disabled={saving}
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Збереження..." : "Зберегти"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-amber-500" />
              Загальні
            </CardTitle>
            <CardDescription>Основні налаштування сайту</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Назва сайту</Label>
              <Input 
                id="siteName" 
                value={settings.siteName}
                onChange={(e) => updateSetting("siteName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Опис сайту</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => updateSetting("siteDescription", e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Контактний email</Label>
              <Input 
                id="contactEmail" 
                type="email" 
                value={settings.contactEmail}
                onChange={(e) => updateSetting("contactEmail", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultLanguage">Мова за замовчуванням</Label>
              <Select 
                value={settings.defaultLanguage}
                onValueChange={(value) => updateSetting("defaultLanguage", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uk">Українська</SelectItem>
                  <SelectItem value="ru">Російська</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-500" />
              Сповіщення
            </CardTitle>
            <CardDescription>Налаштування email сповіщень</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-zinc-100">Нові відгуки</p>
                <p className="text-sm text-zinc-400">Сповіщення про нові відгуки</p>
              </div>
              <Switch 
                checked={settings.notifyNewReviews}
                onCheckedChange={(checked) => updateSetting("notifyNewReviews", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-zinc-100">Нові користувачі</p>
                <p className="text-sm text-zinc-400">Сповіщення про реєстрації</p>
              </div>
              <Switch 
                checked={settings.notifyNewUsers}
                onCheckedChange={(checked) => updateSetting("notifyNewUsers", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-zinc-100">Бізнес-запити</p>
                <p className="text-sm text-zinc-400">Запити на верифікацію</p>
              </div>
              <Switch 
                checked={settings.notifyBusinessRequests}
                onCheckedChange={(checked) => updateSetting("notifyBusinessRequests", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-zinc-100">Системні помилки</p>
                <p className="text-sm text-zinc-400">Критичні сповіщення</p>
              </div>
              <Switch 
                checked={settings.notifySystemErrors}
                onCheckedChange={(checked) => updateSetting("notifySystemErrors", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-500" />
              Безпека
            </CardTitle>
            <CardDescription>Налаштування безпеки</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-zinc-100">Модерація відгуків</p>
                <p className="text-sm text-zinc-400">Перевірка перед публікацією</p>
              </div>
              <Switch 
                checked={settings.moderateReviews}
                onCheckedChange={(checked) => updateSetting("moderateReviews", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-zinc-100">Верифікація бізнесу</p>
                <p className="text-sm text-zinc-400">Обов'язкова верифікація</p>
              </div>
              <Switch 
                checked={settings.verifyBusiness}
                onCheckedChange={(checked) => updateSetting("verifyBusiness", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-zinc-100">reCAPTCHA</p>
                <p className="text-sm text-zinc-400">Захист від спаму</p>
              </div>
              <Switch 
                checked={settings.enableRecaptcha}
                onCheckedChange={(checked) => updateSetting("enableRecaptcha", checked)}
              />
            </div>
            <div className="space-y-2">
              <Label>Мінімальний рейтинг для публікації</Label>
              <Select 
                value={settings.minRating}
                onValueChange={(value) => updateSetting("minRating", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 зірка</SelectItem>
                  <SelectItem value="2">2 зірки</SelectItem>
                  <SelectItem value="3">3 зірки</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-amber-500" />
              Зовнішній вигляд
            </CardTitle>
            <CardDescription>Налаштування інтерфейсу</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Основний колір</Label>
              <div className="flex gap-2">
                {["amber", "blue", "green", "purple", "red"].map((color) => (
                  <button
                    key={color}
                    onClick={() => updateSetting("primaryColor", color)}
                    className={`h-8 w-8 rounded-full transition-all ${
                      color === "amber"
                        ? "bg-amber-500"
                        : color === "blue"
                        ? "bg-blue-500"
                        : color === "green"
                        ? "bg-green-500"
                        : color === "purple"
                        ? "bg-purple-500"
                        : "bg-red-500"
                    } ${
                      settings.primaryColor === color
                        ? "ring-2 ring-offset-2 ring-offset-zinc-900 ring-current"
                        : "hover:scale-110"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-zinc-100">Темна тема</p>
                <p className="text-sm text-zinc-400">За замовчуванням</p>
              </div>
              <Switch 
                checked={settings.darkTheme}
                onCheckedChange={(checked) => updateSetting("darkTheme", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-zinc-100">Анімації</p>
                <p className="text-sm text-zinc-400">Увімкнути анімації</p>
              </div>
              <Switch 
                checked={settings.enableAnimations}
                onCheckedChange={(checked) => updateSetting("enableAnimations", checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toast Notification - Right Side */}
      {toast.show && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right fade-in duration-300">
          <div className="flex items-center gap-3 px-4 py-3 bg-emerald-500/20 border border-emerald-500/50 rounded-xl shadow-lg backdrop-blur-sm">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <span className="text-emerald-100 font-medium">{toast.message}</span>
            <button 
              onClick={() => setToast({ show: false, message: "" })}
              className="ml-2 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
