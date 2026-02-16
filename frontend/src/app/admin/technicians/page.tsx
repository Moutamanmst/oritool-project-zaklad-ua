"use client";

import { useEffect, useState } from "react";
import {
  Wrench,
  Plus,
  Search,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle,
  Clock,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, endpoints } from "@/lib/api";
import { useToast } from "@/components/ui/toast-notification";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { TechnicianEditDialog } from "@/components/admin/TechnicianEditDialog";

interface Technician {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  city?: string;
  address?: string;
  description?: string;
  specializations: string[];
  experience?: number;
  rating?: number;
  reviewCount?: number;
  photoUrl?: string;
  isVerified: boolean;
  status: string;
  createdAt: string;
}

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const { showToast } = useToast();
  const confirm = useConfirm();

  const fetchTechnicians = async () => {
    setLoading(true);
    try {
      const data = await api.get<{ data: Technician[] }>(`${endpoints.technicians.list}?limit=100`);
      setTechnicians(data.data || []);
    } catch (error) {
      console.error("Failed to fetch technicians:", error);
      showToast("Помилка завантаження", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const filteredTechnicians = technicians.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.specializations?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreate = () => {
    setSelectedTechnician(null);
    setEditDialogOpen(true);
  };

  const handleEdit = (technician: Technician) => {
    setSelectedTechnician(technician);
    setEditDialogOpen(true);
  };

  const handleDelete = async (technician: Technician) => {
    const confirmed = await confirm(
      `Ви впевнені, що хочете видалити майстра "${technician.name}"? Цю дію не можна скасувати.`
    );

    if (!confirmed) return;

    try {
      await api.delete(endpoints.technicians.delete(technician.id));
      showToast("Майстра видалено");
      fetchTechnicians();
    } catch (error) {
      console.error("Failed to delete:", error);
      showToast("Помилка видалення", "error");
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (selectedTechnician?.id) {
        await api.patch(endpoints.technicians.update(selectedTechnician.id), data);
        showToast("Майстра оновлено");
      } else {
        await api.post(endpoints.technicians.create, data);
        showToast("Майстра додано");
      }
      setEditDialogOpen(false);
      fetchTechnicians();
    } catch (error: any) {
      console.error("Failed to save:", error);
      showToast(error.message || "Помилка збереження", "error");
      throw error;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-emerald-500/20 text-emerald-400">Активний</Badge>;
      case "PENDING":
        return <Badge className="bg-amber-500/20 text-amber-400">На модерації</Badge>;
      case "INACTIVE":
        return <Badge className="bg-zinc-500/20 text-zinc-400">Неактивний</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
            <Wrench className="h-7 w-7 text-amber-400" />
            Майстри по обладнанню
          </h1>
          <p className="text-zinc-500 mt-1">
            {technicians.length} майстрів
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Пошук..."
              className="pl-10 bg-zinc-900 border-zinc-700"
            />
          </div>
          <Button onClick={fetchTechnicians} variant="outline" size="icon" disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={handleCreate} className="bg-amber-500 hover:bg-amber-600">
            <Plus className="h-4 w-4 mr-2" />
            Додати майстра
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-zinc-100">
                {technicians.filter(t => t.status === "ACTIVE").length}
              </p>
              <p className="text-xs text-zinc-500">Активних</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <Clock className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-zinc-100">
                {technicians.filter(t => t.status === "PENDING").length}
              </p>
              <p className="text-xs text-zinc-500">На модерації</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Star className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-zinc-100">
                {technicians.filter(t => t.isVerified).length}
              </p>
              <p className="text-xs text-zinc-500">Верифікованих</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-violet-500/20">
              <Wrench className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-zinc-100">{technicians.length}</p>
              <p className="text-xs text-zinc-500">Всього</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technicians List */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-100">Список майстрів</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : filteredTechnicians.length === 0 ? (
            <div className="text-center py-12">
              <Wrench className="h-12 w-12 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500">
                {searchQuery ? "Нічого не знайдено" : "Майстрів поки немає"}
              </p>
              {!searchQuery && (
                <Button onClick={handleCreate} className="mt-4 bg-amber-500 hover:bg-amber-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Додати першого майстра
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTechnicians.map((technician) => (
                <div
                  key={technician.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-700 overflow-hidden flex-shrink-0">
                      {technician.photoUrl ? (
                        <img
                          src={technician.photoUrl}
                          alt={technician.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Wrench className="h-6 w-6 text-zinc-500" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-zinc-100">{technician.name}</p>
                        {technician.isVerified && (
                          <CheckCircle className="h-4 w-4 text-blue-400" />
                        )}
                        {getStatusBadge(technician.status)}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-zinc-500">
                        {technician.city && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {technician.city}
                          </span>
                        )}
                        {technician.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {technician.phone}
                          </span>
                        )}
                        {technician.rating && technician.rating > 0 && (
                          <span className="flex items-center gap-1 text-amber-400">
                            <Star className="h-3 w-3 fill-current" />
                            {technician.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                      {technician.specializations && technician.specializations.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {technician.specializations.slice(0, 3).map((spec) => (
                            <Badge key={spec} variant="outline" className="text-xs py-0">
                              {spec}
                            </Badge>
                          ))}
                          {technician.specializations.length > 3 && (
                            <Badge variant="outline" className="text-xs py-0">
                              +{technician.specializations.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(technician)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => handleDelete(technician)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <TechnicianEditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSave}
        technician={selectedTechnician}
      />
    </div>
  );
}
