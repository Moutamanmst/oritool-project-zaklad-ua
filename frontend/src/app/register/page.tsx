"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, UserPlus, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api, endpoints } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { useLanguageStore, translations } from "@/store/language";
import { cn } from "@/lib/utils";
import type { AuthResponse } from "@/types";
import { MainLayout } from "@/components/layout/MainLayout";

function RegisterForm() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") === "business" ? "business" : "user";

  const [accountType, setAccountType] = useState<"user" | "business">(initialType);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
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
      const endpoint =
        accountType === "business"
          ? endpoints.auth.registerBusiness
          : endpoints.auth.register;

      const data =
        accountType === "business"
          ? { email, password, firstName, lastName, companyName }
          : { email, password, firstName, lastName };

      const response = await api.post<AuthResponse>(endpoint, data);

      setAuth(response);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка реєстрації");
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
          <CardTitle className="text-2xl">{t.auth.registerTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setAccountType("user")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all",
                accountType === "user"
                  ? "border-amber-500 bg-amber-500/10 text-amber-400"
                  : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
              )}
            >
              <UserPlus className="h-4 w-4" />
              Користувач
            </button>
            <button
              type="button"
              onClick={() => setAccountType("business")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all",
                accountType === "business"
                  ? "border-amber-500 bg-amber-500/10 text-amber-400"
                  : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
              )}
            >
              <Building2 className="h-4 w-4" />
              Бізнес
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  {t.auth.firstName}
                </label>
                <Input
                  type="text"
                  placeholder="Іван"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  {t.auth.lastName}
                </label>
                <Input
                  type="text"
                  placeholder="Петренко"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            {accountType === "business" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  {t.auth.companyName} *
                </label>
                <Input
                  type="text"
                  placeholder='Ресторан "Смачна їжа"'
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                {t.auth.email} *
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
                {t.auth.password} *
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Мінімум 8 символів"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
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
                  <UserPlus className="h-4 w-4" />
                  {t.auth.registerButton}
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-400">
            {t.auth.hasAccount}{" "}
            <Link href="/login" className="text-amber-500 hover:underline">
              {t.auth.loginButton}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
    </MainLayout>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <RegisterForm />
    </Suspense>
  );
}

