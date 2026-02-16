"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Monitor,
  Truck,
  Package,
  Users,
  MessageSquare,
  FolderTree,
  Settings,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Bot,
  Shield,
  FileEdit,
  Newspaper,
  Utensils,
  Database,
  BarChart3,
  Bell,
  Wrench,
  TrendingUp,
  Search,
  QrCode,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { api, endpoints } from "@/lib/api";
import { ToastProvider } from "@/components/ui/toast-notification";
import { ConfirmProvider } from "@/components/ui/confirm-dialog";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  badgeColor?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const [pendingCounts, setPendingCounts] = useState({
    establishments: 0,
    reviews: 0,
    businesses: 0,
  });

  // Fetch pending counts for badges
  useEffect(() => {
    async function fetchPendingCounts() {
      try {
        const [establishmentsRes, reviewsRes] = await Promise.all([
          api.get<{ data: any[]; meta: { total: number } }>(`${endpoints.establishments.list}?status=PENDING&limit=1`).catch(() => ({ meta: { total: 0 } })),
          api.get<{ data: any[]; meta: { total: number } }>(`${endpoints.reviews.pending}?limit=1`).catch(() => ({ meta: { total: 0 } })),
        ]);

        setPendingCounts({
          establishments: establishmentsRes.meta?.total || 0,
          reviews: reviewsRes.meta?.total || 0,
          businesses: 0, // Would need separate endpoint
        });
      } catch (error) {
        console.error("Failed to fetch pending counts:", error);
      }
    }

    fetchPendingCounts();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPendingCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalPending = pendingCounts.establishments + pendingCounts.reviews + pendingCounts.businesses;

  const navigationGroups: NavGroup[] = [
    {
      title: "Огляд",
      items: [
        { name: "Дашборд", href: "/admin", icon: LayoutDashboard },
        { 
          name: "Модерація", 
          href: "/admin/moderation", 
          icon: Shield, 
          badge: totalPending,
          badgeColor: totalPending > 0 ? "bg-amber-500" : undefined,
        },
      ],
    },
    {
      title: "Дані платформи",
      items: [
        { 
          name: "Заклади", 
          href: "/admin/establishments", 
          icon: Store,
          badge: pendingCounts.establishments > 0 ? pendingCounts.establishments : undefined,
        },
        { name: "POS-системи", href: "/admin/pos-systems", icon: Monitor },
        { name: "QR-меню", href: "/admin/qr-menu", icon: QrCode },
        { name: "Обладнання", href: "/admin/equipment", icon: Package },
        { name: "Майстри", href: "/admin/technicians", icon: Wrench },
        { name: "Постачальники", href: "/admin/suppliers", icon: Utensils },
        { name: "Доставка", href: "/admin/delivery", icon: Truck },
        { name: "Категорії", href: "/admin/categories", icon: FolderTree },
      ],
    },
    {
      title: "Користувачі & Відгуки",
      items: [
        { name: "Користувачі", href: "/admin/users", icon: Users },
        { 
          name: "Відгуки", 
          href: "/admin/reviews", 
          icon: MessageSquare,
          badge: pendingCounts.reviews > 0 ? pendingCounts.reviews : undefined,
        },
      ],
    },
    {
      title: "AI & Аналітика",
      items: [
        { name: "AI Контроль", href: "/admin/ai-logs", icon: Bot },
        { name: "Аналітика", href: "/admin/analytics", icon: BarChart3 },
      ],
    },
    {
      title: "Контент",
      items: [
        { name: "Контент сайту", href: "/admin/content", icon: FileEdit },
        { name: "Блог", href: "/admin/blog", icon: Newspaper },
        { name: "SEO & Meta", href: "/admin/seo", icon: Search },
      ],
    },
    {
      title: "Система",
      items: [
        { name: "Тарифи", href: "/admin/pricing", icon: CreditCard },
        { name: "Налаштування", href: "/admin/settings", icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 transform transition-transform duration-200 lg:translate-x-0 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-800 flex-shrink-0">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <span className="text-zinc-900 font-bold text-sm">Z</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-zinc-100 text-sm leading-none">
                Admin Panel
              </span>
              <span className="text-[10px] text-zinc-500">ZakladUA</span>
            </div>
          </Link>
          <button
            className="lg:hidden text-zinc-400 hover:text-zinc-100"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {navigationGroups.map((group) => (
            <div key={group.title}>
              <p className="px-3 text-[10px] font-semibold text-zinc-600 uppercase tracking-wider mb-2">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== "/admin" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                        isActive
                          ? "bg-amber-500/10 text-amber-400 shadow-sm"
                          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
                      )}
                    >
                      <item.icon className={cn(
                        "h-4 w-4 flex-shrink-0",
                        isActive ? "text-amber-400" : ""
                      )} />
                      <span className="flex-1">{item.name}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={cn(
                          "text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
                          item.badgeColor || "bg-amber-500",
                          "text-zinc-900"
                        )}>
                          {item.badge}
                        </span>
                      )}
                      {isActive && !item.badge && (
                        <ChevronRight className="h-4 w-4 text-amber-400/50" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 flex-shrink-0 space-y-2">
          {/* Status Indicator */}
          <div className="px-3 py-2 rounded-lg bg-zinc-800/50 flex items-center gap-2 text-xs">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-400">API Online</span>
            <span className="ml-auto text-zinc-600">v1.0.0</span>
          </div>
          
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50">
              <LogOut className="h-4 w-4 mr-3" />
              На сайт
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 flex items-center px-4 lg:px-8">
          <button
            className="lg:hidden text-zinc-400 hover:text-zinc-100 mr-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-zinc-100">
              Адмін панель
            </h1>
            <p className="text-xs text-zinc-500 hidden sm:block">
              Керування платформою ZakladUA
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            {totalPending > 0 && (
              <Link href="/admin/moderation">
                <Button variant="ghost" size="sm" className="relative text-zinc-400 hover:text-zinc-100">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-500 text-zinc-900 text-[10px] font-bold flex items-center justify-center">
                    {totalPending}
                  </span>
                </Button>
              </Link>
            )}
            
            {/* User Avatar */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <span className="text-zinc-900 font-bold text-xs">A</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm text-zinc-300">Admin</p>
                <p className="text-xs text-zinc-500">Адміністратор</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <ConfirmProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ConfirmProvider>
        </main>
      </div>
    </div>
  );
}
