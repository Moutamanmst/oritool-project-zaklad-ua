"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  Users,
  User,
  Building2,
  Shield,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Ban,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Crown,
  RefreshCw,
  Download,
  Activity,
  TrendingUp,
  Search,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DataTable, Column } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api, endpoints } from "@/lib/api";

// Types based on Prisma schema
interface UserProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  avatarUrl: string | null;
  city: string | null;
}

interface BusinessProfile {
  id: string;
  companyName: string;
  companyNameRu: string | null;
  description: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  logoUrl: string | null;
  isVerified: boolean;
  verifiedAt: string | null;
  createdAt: string;
}

interface UserData {
  id: string;
  email: string;
  role: "GUEST" | "USER" | "BUSINESS" | "ADMIN";
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profile: UserProfile | null;
  businessProfile: BusinessProfile | null;
  _count?: {
    reviews: number;
    ratings: number;
    favorites: number;
    aiLogs: number;
  };
}

interface UsersResponse {
  data: UserData[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const roleLabels: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  GUEST: { label: "Гість", color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20", icon: <User className="h-3 w-3" /> },
  USER: { label: "Користувач", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: <User className="h-3 w-3" /> },
  BUSINESS: { label: "Бізнес", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: <Building2 className="h-3 w-3" /> },
  ADMIN: { label: "Адмін", color: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: <Crown className="h-3 w-3" /> },
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    users: 0,
    business: 0,
    admin: 0,
    verified: 0,
    blocked: 0,
    newThisWeek: 0,
    pendingVerification: 0,
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<UsersResponse>(`${endpoints.users.list}?limit=100`);
      const usersData = response.data || [];
      setUsers(usersData);

      // Calculate stats
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      setStats({
        total: usersData.length,
        users: usersData.filter((u) => u.role === "USER").length,
        business: usersData.filter((u) => u.role === "BUSINESS").length,
        admin: usersData.filter((u) => u.role === "ADMIN").length,
        verified: usersData.filter((u) => u.isVerified).length,
        blocked: usersData.filter((u) => !u.isActive).length,
        newThisWeek: usersData.filter((u) => new Date(u.createdAt) >= weekAgo).length,
        pendingVerification: usersData.filter(
          (u) => u.role === "BUSINESS" && !u.businessProfile?.isVerified
        ).length,
      });
    } catch (error: any) {
      // Silently handle unauthorized - API requires auth
      if (!error?.message?.includes("Unauthorized")) {
        console.error("Failed to fetch users:", error);
      }
      // Show demo data when API is unavailable
      setUsers([
        {
          id: "demo-1",
          email: "admin@zaklad.ua",
          role: "ADMIN",
          isActive: true,
          isVerified: true,
          createdAt: new Date().toISOString(),
          profile: { firstName: "Адмін", lastName: "Системи" },
        },
        {
          id: "demo-2",
          email: "business@example.com",
          role: "BUSINESS",
          isActive: true,
          isVerified: true,
          createdAt: new Date().toISOString(),
          profile: { firstName: "Іван", lastName: "Петренко" },
          businessProfile: { companyName: "Ресторан Смак", isVerified: true },
        },
      ] as any);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter users based on tab and filters
  const filteredUsers = users.filter((u) => {
    // Tab filter
    if (activeTab === "business" && u.role !== "BUSINESS") return false;
    if (activeTab === "pending" && (u.role !== "BUSINESS" || u.businessProfile?.isVerified)) return false;
    if (activeTab === "blocked" && u.isActive) return false;

    // Dropdown filters
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (statusFilter === "active" && !u.isActive) return false;
    if (statusFilter === "blocked" && u.isActive) return false;
    if (statusFilter === "unverified" && u.isVerified) return false;
    
    return true;
  });

  // Actions
  const handleBlockUser = async (id: string) => {
    setProcessingId(id);
    try {
      const user = users.find((u) => u.id === id);
      await api.patch(endpoints.users.update(id), { isActive: !user?.isActive });
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u))
      );
    } catch (error) {
      console.error("Failed to update user:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleVerifyBusiness = async (id: string) => {
    setProcessingId(id);
    try {
      await api.patch(endpoints.users.verifyBusiness(id), {});
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id && u.businessProfile
            ? { ...u, isVerified: true, businessProfile: { ...u.businessProfile, isVerified: true } }
            : u
        )
      );
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to verify business:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цього користувача?")) return;
    
    setProcessingId(id);
    try {
      await api.delete(endpoints.users.delete(id));
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const exportUsers = () => {
    const csv = [
      ["ID", "Email", "Ім'я", "Прізвище", "Роль", "Верифікований", "Активний", "Місто", "Дата реєстрації"].join(","),
      ...users.map((u) =>
        [
          u.id,
          u.email,
          u.profile?.firstName || "",
          u.profile?.lastName || "",
          u.role,
          u.isVerified ? "Так" : "Ні",
          u.isActive ? "Так" : "Ні",
          u.profile?.city || "",
          new Date(u.createdAt).toISOString(),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // Table columns
  const columns: Column<UserData>[] = [
    {
      key: "email",
      header: "Користувач",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {item.profile?.avatarUrl ? (
              <Image
                src={item.profile.avatarUrl}
                alt=""
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-zinc-500" />
            )}
          </div>
          <div>
            <p className="font-medium text-zinc-100">
              {item.profile?.firstName && item.profile?.lastName
                ? `${item.profile.firstName} ${item.profile.lastName}`
                : item.email.split("@")[0]}
            </p>
            <p className="text-xs text-zinc-500">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Роль",
      sortable: true,
      render: (item) => {
        const role = roleLabels[item.role];
        return (
          <Badge variant="outline" className={`${role.color} gap-1`}>
            {role.icon}
            {role.label}
          </Badge>
        );
      },
    },
    {
      key: "businessProfile",
      header: "Компанія",
      render: (item) =>
        item.businessProfile ? (
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-zinc-500" />
            <span className="text-zinc-300 truncate max-w-[150px]">
              {item.businessProfile.companyName}
            </span>
            {item.businessProfile.isVerified && (
              <CheckCircle className="h-3 w-3 text-emerald-400" />
            )}
          </div>
        ) : (
          <span className="text-zinc-600">—</span>
        ),
    },
    {
      key: "city",
      header: "Місто",
      render: (item) => (
        <div className="flex items-center gap-1 text-zinc-400">
          <MapPin className="h-3 w-3" />
          {item.profile?.city || "—"}
        </div>
      ),
    },
    {
      key: "_count",
      header: "Активність",
      render: (item) => (
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span title="Відгуки">{item._count?.reviews || 0} відг.</span>
          <span title="Оцінки">{item._count?.ratings || 0} оц.</span>
          {item._count?.aiLogs !== undefined && (
            <span title="AI запити">{item._count.aiLogs} AI</span>
          )}
        </div>
      ),
    },
    {
      key: "isActive",
      header: "Статус",
      sortable: true,
      render: (item) => (
        <div className="flex flex-wrap items-center gap-1">
          {item.isActive ? (
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
              Активний
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 text-[10px]">
              Заблокований
            </Badge>
          )}
          {item.role === "BUSINESS" && !item.businessProfile?.isVerified && (
            <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]">
              Не верифікований
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Реєстрація",
      sortable: true,
      render: (item) => (
        <span className="text-zinc-500 text-xs">
          {new Date(item.createdAt).toLocaleDateString("uk-UA")}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
            <Users className="h-7 w-7 text-violet-400" />
            Користувачі
          </h1>
          <p className="text-zinc-400 mt-1">
            Керування користувачами та бізнес-акаунтами
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchUsers}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Оновити
          </Button>
          <Button variant="outline" size="sm" onClick={exportUsers}>
            <Download className="h-4 w-4 mr-2" />
            Експорт
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-600">
            <UserPlus className="h-4 w-4 mr-2" />
            Додати
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-zinc-100">{stats.total}</p>
            <p className="text-xs text-zinc-500">Всього</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-blue-400">{stats.users}</p>
            <p className="text-xs text-zinc-500">Користувачів</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-emerald-400">{stats.business}</p>
            <p className="text-xs text-zinc-500">Бізнес</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-amber-400">{stats.admin}</p>
            <p className="text-xs text-zinc-500">Адміни</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <p className="text-2xl font-bold text-zinc-100">{stats.verified}</p>
            </div>
            <p className="text-xs text-zinc-500">Верифіковані</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-red-400">{stats.blocked}</p>
            <p className="text-xs text-zinc-500">Заблоковані</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <p className="text-2xl font-bold text-zinc-100">{stats.newThisWeek}</p>
            </div>
            <p className="text-xs text-zinc-500">Нові (тиждень)</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800 border-amber-500/20">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-amber-400">{stats.pendingVerification}</p>
            <p className="text-xs text-zinc-500">Очікують верифікації</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Verification Alert */}
      {stats.pendingVerification > 0 && (
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-amber-400" />
              <div>
                <p className="text-zinc-200 font-medium">
                  {stats.pendingVerification} бізнес-акаунтів очікують верифікації
                </p>
                <p className="text-zinc-500 text-sm">
                  Перевірте та підтвердіть легітимність компаній
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-amber-500/20 text-amber-400"
              onClick={() => setActiveTab("pending")}
            >
              Переглянути
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="all" className="data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-900">
            Всі ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="business" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            <Building2 className="h-4 w-4 mr-2" />
            Бізнес ({stats.business})
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-900">
            <Shield className="h-4 w-4 mr-2" />
            На верифікацію ({stats.pendingVerification})
          </TabsTrigger>
          <TabsTrigger value="blocked" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
            <Ban className="h-4 w-4 mr-2" />
            Заблоковані ({stats.blocked})
          </TabsTrigger>
        </TabsList>

        {/* All Tabs Content */}
        <TabsContent value={activeTab}>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-6">
              <DataTable
                columns={columns}
                data={filteredUsers}
                loading={loading}
                searchPlaceholder="Пошук користувачів..."
                pageSize={15}
                onRowClick={(user) => setSelectedUser(user)}
                onRefresh={fetchUsers}
                onExport={exportUsers}
                filters={
                  <div className="flex items-center gap-2">
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="w-36 bg-zinc-800/50 border-zinc-700">
                        <SelectValue placeholder="Роль" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Всі ролі</SelectItem>
                        <SelectItem value="USER">Користувачі</SelectItem>
                        <SelectItem value="BUSINESS">Бізнес</SelectItem>
                        <SelectItem value="ADMIN">Адміністратори</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40 bg-zinc-800/50 border-zinc-700">
                        <SelectValue placeholder="Статус" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Всі статуси</SelectItem>
                        <SelectItem value="active">Активні</SelectItem>
                        <SelectItem value="blocked">Заблоковані</SelectItem>
                        <SelectItem value="unverified">Не верифіковані</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                }
                actions={(item) => (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => setSelectedUser(item)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Переглянути
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Редагувати
                      </DropdownMenuItem>
                      {item.role === "BUSINESS" && !item.businessProfile?.isVerified && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleVerifyBusiness(item.id)}
                            className="text-emerald-400"
                            disabled={processingId === item.id}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Верифікувати бізнес
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleBlockUser(item.id)}
                        className={item.isActive ? "text-red-400" : "text-emerald-400"}
                        disabled={processingId === item.id}
                      >
                        {item.isActive ? (
                          <>
                            <Ban className="h-4 w-4 mr-2" />
                            Заблокувати
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Розблокувати
                          </>
                        )}
                      </DropdownMenuItem>
                      {item.role !== "ADMIN" && (
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(item.id)}
                          className="text-red-400"
                          disabled={processingId === item.id}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Видалити
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-violet-400" />
              Профіль користувача
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
                  {selectedUser.profile?.avatarUrl ? (
                    <Image
                      src={selectedUser.profile.avatarUrl}
                      alt=""
                      width={64}
                      height={64}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-zinc-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-zinc-100">
                    {selectedUser.profile?.firstName && selectedUser.profile?.lastName
                      ? `${selectedUser.profile.firstName} ${selectedUser.profile.lastName}`
                      : selectedUser.email.split("@")[0]}
                  </h3>
                  <p className="text-zinc-400">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {(() => {
                      const role = roleLabels[selectedUser.role];
                      return (
                        <Badge variant="outline" className={`${role.color} gap-1`}>
                          {role.icon}
                          {role.label}
                        </Badge>
                      );
                    })()}
                    {!selectedUser.isActive && (
                      <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">
                        Заблокований
                      </Badge>
                    )}
                    {selectedUser.isVerified && (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Верифікований
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-zinc-800/50">
                  <div className="flex items-center gap-2 text-zinc-500 mb-1">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">Телефон</span>
                  </div>
                  <p className="text-zinc-200">{selectedUser.profile?.phone || "—"}</p>
                </div>
                <div className="p-4 rounded-lg bg-zinc-800/50">
                  <div className="flex items-center gap-2 text-zinc-500 mb-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Місто</span>
                  </div>
                  <p className="text-zinc-200">{selectedUser.profile?.city || "—"}</p>
                </div>
              </div>

              {/* Business Profile */}
              {selectedUser.businessProfile && (
                <div className="p-4 rounded-lg bg-zinc-800/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-zinc-100 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-emerald-400" />
                      Бізнес-профіль
                    </h4>
                    {selectedUser.businessProfile.isVerified ? (
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Верифікований
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20">
                        Очікує верифікації
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-zinc-500">Назва компанії</p>
                      <p className="text-zinc-200">{selectedUser.businessProfile.companyName}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500">Сайт</p>
                      <p className="text-zinc-200">{selectedUser.businessProfile.website || "—"}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500">Email</p>
                      <p className="text-zinc-200">{selectedUser.businessProfile.email || "—"}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500">Телефон</p>
                      <p className="text-zinc-200">{selectedUser.businessProfile.phone || "—"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-zinc-500">Опис</p>
                      <p className="text-zinc-200">{selectedUser.businessProfile.description || "—"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-zinc-800/50">
                  <p className="text-2xl font-bold text-zinc-100">{selectedUser._count?.reviews || 0}</p>
                  <p className="text-xs text-zinc-500">Відгуків</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-zinc-800/50">
                  <p className="text-2xl font-bold text-zinc-100">{selectedUser._count?.ratings || 0}</p>
                  <p className="text-xs text-zinc-500">Оцінок</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-zinc-800/50">
                  <p className="text-2xl font-bold text-zinc-100">{selectedUser._count?.favorites || 0}</p>
                  <p className="text-xs text-zinc-500">В обраному</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-zinc-800/50">
                  <p className="text-2xl font-bold text-zinc-100">{selectedUser._count?.aiLogs || 0}</p>
                  <p className="text-xs text-zinc-500">AI запитів</p>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-center gap-6 text-sm text-zinc-500 pt-4 border-t border-zinc-800">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Реєстрація: {new Date(selectedUser.createdAt).toLocaleDateString("uk-UA")}
                </span>
                <span>
                  Оновлено: {new Date(selectedUser.updatedAt).toLocaleDateString("uk-UA")}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                {selectedUser.role === "BUSINESS" && !selectedUser.businessProfile?.isVerified && (
                  <Button
                    onClick={() => handleVerifyBusiness(selectedUser.id)}
                    className="bg-emerald-500 hover:bg-emerald-600"
                    disabled={processingId === selectedUser.id}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Верифікувати бізнес
                  </Button>
                )}
                <Button
                  onClick={() => handleBlockUser(selectedUser.id)}
                  variant="outline"
                  className={selectedUser.isActive ? "text-red-400 border-red-400/20 hover:bg-red-500/10" : "text-emerald-400 border-emerald-400/20 hover:bg-emerald-500/10"}
                  disabled={processingId === selectedUser.id}
                >
                  {selectedUser.isActive ? (
                    <>
                      <Ban className="h-4 w-4 mr-2" />
                      Заблокувати
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Розблокувати
                    </>
                  )}
                </Button>
                {selectedUser.role !== "ADMIN" && (
                  <Button
                    onClick={() => handleDeleteUser(selectedUser.id)}
                    variant="outline"
                    className="text-red-400 border-red-400/20 hover:bg-red-500/10 ml-auto"
                    disabled={processingId === selectedUser.id}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Видалити
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
