"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api, endpoints } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { useLanguageStore, translations } from "@/store/language";
import type { AuthResponse } from "@/types";
import { MainLayout } from "@/components/layout/MainLayout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { lang } = useLanguageStore();
  const t = translations[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post<AuthResponse>(endpoints.auth.login, {
        email,
        password,
      });

      setAuth(response);
      
      // Redirect admins to admin panel
      if (response.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка входу");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="absolute inset-0 hero-pattern" />

      <Card className="relative w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <img 
              src="/images/logo.png" 
              alt="ZakladUA" 
              className="h-14 w-14 object-contain"
            />
          </Link>
          <CardTitle className="text-2xl">{t.auth.loginTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                {t.auth.email}
              </label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                {t.auth.password}
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                  Завантаження...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  {t.auth.loginButton}
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-400">
            {t.auth.noAccount}{" "}
            <Link href="/register" className="text-amber-500 hover:underline">
              {t.auth.registerButton}
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-800">
            <p className="text-xs text-zinc-500 text-center mb-3">
              Тестові акаунти:
            </p>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setEmail("user@example.com");
                  setPassword("user123456");
                }}
                className="p-2 rounded bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                User: user@example.com
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("business@example.com");
                  setPassword("business123456");
                }}
                className="p-2 rounded bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Business: business@example.com
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("admin@zaklad.ua");
                  setPassword("admin123456");
                }}
                className="p-2 rounded bg-zinc-800/50 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Admin: admin@zaklad.ua
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </MainLayout>
  );
}

