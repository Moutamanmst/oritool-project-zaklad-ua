"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Store,
  MonitorSmartphone,
  Truck,
  Package,
  ShoppingBag,
  QrCode,
  Megaphone,
  BookOpen,
  User,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Головна", href: "/", icon: null },
  { name: "Заклади", href: "/establishments", icon: Store },
  { name: "POS-системи", href: "/pos-systems", icon: MonitorSmartphone },
  { name: "Доставка", href: "/delivery", icon: Truck },
  { name: "Постачальники", href: "/suppliers", icon: ShoppingBag },
  { name: "Обладнання", href: "/equipment", icon: Package },
  { name: "QR-меню", href: "/qr-menu", icon: QrCode },
  { name: "Маркетинг", href: "/marketing", icon: Megaphone },
  { name: "Блог", href: "/blog", icon: BookOpen },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
      <nav className="mx-auto max-w-[1400px] px-2 sm:px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-0.5 text-xl font-bold shrink-0"
            >
              <img 
                src="/images/logo.png" 
                alt="ZakladUA" 
                className="h-12 w-12 object-contain"
              />
              <span className="text-xl font-bold">
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Zaklad</span><span className="text-white">UA</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex xl:items-center xl:gap-0.5">
              {navigation.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 px-2.5 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                      isActive
                        ? "bg-zinc-800 text-zinc-100"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                    )}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 ml-auto pl-4">
            {/* Auth Buttons */}
            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-zinc-400 hover:text-zinc-100"
                  >
                    <User className="h-4 w-4" />
                    {user.email.split("@")[0]}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="gap-2 text-zinc-400 hover:text-zinc-100"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-zinc-100"
                  >
                    Увійти
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0"
                  >
                    Реєстрація
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="xl:hidden rounded-lg p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-zinc-800 py-4">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-colors",
                      isActive
                        ? "bg-zinc-800 text-zinc-100"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                    )}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Auth */}
            <div className="mt-4 pt-4 border-t border-zinc-800 space-y-2">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-800/50"
                  >
                    <User className="h-5 w-5" />
                    Профіль
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-base font-medium text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-800/50"
                  >
                    <LogOut className="h-5 w-5" />
                    Вийти
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-center text-base font-medium text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-800/50"
                  >
                    Увійти
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-center text-base font-medium rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                  >
                    Реєстрація
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
