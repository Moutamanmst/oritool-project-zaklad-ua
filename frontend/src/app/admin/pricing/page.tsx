"use client";

import { useEffect, useState } from "react";
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Check,
  Star,
  Save,
  Loader2,
  RefreshCw,
  Zap,
  Building2,
  Rocket,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast-notification";
import { useConfirm } from "@/components/ui/confirm-dialog";

interface PricingPlan {
  id: string;
  name: string;
  nameRu?: string;
  description: string;
  descriptionRu?: string;
  price: number;
  period: string;
  features: string[];
  featuresRu?: string[];
  isPopular: boolean;
  isActive: boolean;
  order: number;
  icon: string;
  color: string;
}

const defaultPlans: PricingPlan[] = [
  {
    id: "basic",
    name: "Базовий",
    nameRu: "Базовый",
    description: "Для початку роботи",
    descriptionRu: "Для начала работы",
    price: 0,
    period: "назавжди",
    features: [
      "1 заклад",
      "Базовий профіль",
      "До 10 фото",
      "Відгуки клієнтів",
    ],
    featuresRu: [
      "1 заведение",
      "Базовый профиль",
      "До 10 фото",
      "Отзывы клиентов",
    ],
    isPopular: false,
    isActive: true,
    order: 1,
    icon: "Zap",
    color: "zinc",
  },
  {
    id: "professional",
    name: "Професійний",
    nameRu: "Профессиональный",
    description: "Для активного бізнесу",
    descriptionRu: "Для активного бизнеса",
    price: 999,
    period: "місяць",
    features: [
      "До 5 закладів",
      "Розширений профіль",
      "Необмежено фото",
      "Пріоритет в каталозі",
      "Аналітика відвідувань",
      "Технічна підтримка",
    ],
    featuresRu: [
      "До 5 заведений",
      "Расширенный профиль",
      "Неограниченно фото",
      "Приоритет в каталоге",
      "Аналитика посещений",
      "Техническая поддержка",
    ],
    isPopular: true,
    isActive: true,
    order: 2,
    icon: "Building2",
    color: "amber",
  },
  {
    id: "premium",
    name: "Преміум",
    nameRu: "Премиум",
    description: "Для мережі закладів",
    descriptionRu: "Для сети заведений",
    price: 2499,
    period: "місяць",
    features: [
      "Необмежено закладів",
      "Преміум профіль",
      "API доступ",
      "ТОП позиція в каталозі",
      "Детальна аналітика",
      "Персональний менеджер",
      "Брендування сторінок",
      "Інтеграція з CRM",
    ],
    featuresRu: [
      "Неограниченно заведений",
      "Премиум профиль",
      "API доступ",
      "ТОП позиция в каталоге",
      "Детальная аналитика",
      "Персональный менеджер",
      "Брендирование страниц",
      "Интеграция с CRM",
    ],
    isPopular: false,
    isActive: true,
    order: 3,
    icon: "Rocket",
    color: "violet",
  },
];

const iconOptions = [
  { value: "Zap", label: "Блискавка", icon: Zap },
  { value: "Building2", label: "Будівля", icon: Building2 },
  { value: "Rocket", label: "Ракета", icon: Rocket },
  { value: "Star", label: "Зірка", icon: Star },
  { value: "CreditCard", label: "Картка", icon: CreditCard },
];

const colorOptions = [
  { value: "zinc", label: "Сірий" },
  { value: "amber", label: "Жовтий" },
  { value: "violet", label: "Фіолетовий" },
  { value: "emerald", label: "Зелений" },
  { value: "blue", label: "Синій" },
  { value: "rose", label: "Рожевий" },
];

export default function PricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const { showToast } = useToast();
  const confirm = useConfirm();

  // Load plans from localStorage or use defaults
  const loadPlans = () => {
    setLoading(true);
    try {
      const saved = localStorage.getItem("zaklad-pricing-plans");
      if (saved) {
        setPlans(JSON.parse(saved));
      } else {
        setPlans(defaultPlans);
        localStorage.setItem("zaklad-pricing-plans", JSON.stringify(defaultPlans));
      }
    } catch (error) {
      console.error("Failed to load plans:", error);
      setPlans(defaultPlans);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const savePlans = (newPlans: PricingPlan[]) => {
    localStorage.setItem("zaklad-pricing-plans", JSON.stringify(newPlans));
    setPlans(newPlans);
  };

  const handleCreate = () => {
    setSelectedPlan({
      id: `plan-${Date.now()}`,
      name: "",
      description: "",
      price: 0,
      period: "місяць",
      features: [],
      isPopular: false,
      isActive: true,
      order: plans.length + 1,
      icon: "Zap",
      color: "zinc",
    });
    setEditDialogOpen(true);
  };

  const handleEdit = (plan: PricingPlan) => {
    setSelectedPlan({ ...plan });
    setEditDialogOpen(true);
  };

  const handleDelete = async (plan: PricingPlan) => {
    const confirmed = await confirm(
      `Ви впевнені, що хочете видалити тариф "${plan.name}"?`
    );
    if (!confirmed) return;

    const newPlans = plans.filter((p) => p.id !== plan.id);
    savePlans(newPlans);
    showToast("Тариф видалено");
  };

  const handleSave = (plan: PricingPlan) => {
    const existing = plans.find((p) => p.id === plan.id);
    let newPlans: PricingPlan[];

    if (existing) {
      newPlans = plans.map((p) => (p.id === plan.id ? plan : p));
    } else {
      newPlans = [...plans, plan];
    }

    savePlans(newPlans);
    setEditDialogOpen(false);
    showToast(existing ? "Тариф оновлено" : "Тариф створено");
  };

  const handleToggleActive = (plan: PricingPlan) => {
    const newPlans = plans.map((p) =>
      p.id === plan.id ? { ...p, isActive: !p.isActive } : p
    );
    savePlans(newPlans);
  };

  const handleTogglePopular = (plan: PricingPlan) => {
    const newPlans = plans.map((p) =>
      p.id === plan.id ? { ...p, isPopular: !p.isPopular } : { ...p, isPopular: false }
    );
    savePlans(newPlans);
  };

  const getIconComponent = (iconName: string) => {
    const option = iconOptions.find((o) => o.value === iconName);
    return option?.icon || Zap;
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      zinc: "bg-zinc-500/20 text-zinc-400 border-zinc-500/50",
      amber: "bg-amber-500/20 text-amber-400 border-amber-500/50",
      violet: "bg-violet-500/20 text-violet-400 border-violet-500/50",
      emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
      blue: "bg-blue-500/20 text-blue-400 border-blue-500/50",
      rose: "bg-rose-500/20 text-rose-400 border-rose-500/50",
    };
    return colors[color] || colors.zinc;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
            <CreditCard className="h-7 w-7 text-amber-400" />
            Тарифні плани
          </h1>
          <p className="text-zinc-500 mt-1">
            Керування тарифами для клієнтів платформи
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => {
              localStorage.removeItem("zaklad-pricing-plans");
              loadPlans();
              showToast("Скинуто до стандартних тарифів");
            }} 
            variant="outline"
            size="sm"
          >
            Скинути
          </Button>
          <Button onClick={loadPlans} variant="outline" size="icon" disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={handleCreate} className="bg-amber-500 hover:bg-amber-600">
            <Plus className="h-4 w-4 mr-2" />
            Додати тариф
          </Button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans
          .sort((a, b) => a.order - b.order)
          .map((plan) => {
            const IconComponent = getIconComponent(plan.icon);
            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden transition-all ${
                  plan.isPopular
                    ? "border-amber-500 ring-2 ring-amber-500/20"
                    : "border-zinc-800"
                } ${!plan.isActive ? "opacity-50" : ""}`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500 text-zinc-900 text-xs font-bold">
                    ПОПУЛЯРНИЙ
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl ${getColorClasses(plan.color)}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(plan)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDelete(plan)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <CardTitle className="text-xl text-zinc-100">{plan.name}</CardTitle>
                    <p className="text-sm text-zinc-500 mt-1">{plan.description}</p>
                  </div>

                  <div className="mt-4">
                    <span className="text-4xl font-bold text-zinc-100">
                      {plan.price === 0 ? "Безкоштовно" : `${plan.price} ₴`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-zinc-500 ml-1">/ {plan.period}</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-zinc-300">
                        <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 pt-4 border-t border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">Активний</span>
                      <Switch
                        checked={plan.isActive}
                        onCheckedChange={() => handleToggleActive(plan)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">Популярний</span>
                      <Switch
                        checked={plan.isPopular}
                        onCheckedChange={() => handleTogglePopular(plan)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {/* Edit Dialog */}
      <PlanEditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSave}
        plan={selectedPlan}
      />
    </div>
  );
}

// Edit Dialog Component
function PlanEditDialog({
  open,
  onClose,
  onSave,
  plan,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (plan: PricingPlan) => void;
  plan: PricingPlan | null;
}) {
  const [data, setData] = useState<PricingPlan | null>(null);
  const [newFeature, setNewFeature] = useState("");

  useEffect(() => {
    setData(plan);
  }, [plan]);

  if (!data) return null;

  const addFeature = () => {
    if (newFeature.trim()) {
      setData({ ...data, features: [...data.features, newFeature.trim()] });
      setNewFeature("");
    }
  };

  const removeFeature = (idx: number) => {
    setData({ ...data, features: data.features.filter((_, i) => i !== idx) });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl text-zinc-100">
            {plan?.name ? "Редагувати тариф" : "Новий тариф"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-zinc-300">Назва (UA)</Label>
              <Input
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="mt-1 bg-zinc-800 border-zinc-700"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Назва (RU)</Label>
              <Input
                value={data.nameRu || ""}
                onChange={(e) => setData({ ...data, nameRu: e.target.value })}
                className="mt-1 bg-zinc-800 border-zinc-700"
              />
            </div>
          </div>

          <div>
            <Label className="text-zinc-300">Опис (UA)</Label>
            <Input
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              className="mt-1 bg-zinc-800 border-zinc-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-zinc-300">Ціна (₴)</Label>
              <Input
                type="number"
                value={data.price}
                onChange={(e) => setData({ ...data, price: Number(e.target.value) })}
                className="mt-1 bg-zinc-800 border-zinc-700"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Період</Label>
              <Input
                value={data.period}
                onChange={(e) => setData({ ...data, period: e.target.value })}
                placeholder="місяць / рік / назавжди"
                className="mt-1 bg-zinc-800 border-zinc-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-zinc-300">Іконка</Label>
              <select
                value={data.icon}
                onChange={(e) => setData({ ...data, icon: e.target.value })}
                className="mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-zinc-100"
              >
                {iconOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-zinc-300">Колір</Label>
              <select
                value={data.color}
                onChange={(e) => setData({ ...data, color: e.target.value })}
                className="mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-zinc-100"
              >
                {colorOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label className="text-zinc-300">Можливості</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Додати можливість..."
                className="bg-zinc-800 border-zinc-700"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
              />
              <Button onClick={addFeature} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 mt-2">
              {data.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-zinc-800/50 rounded-lg"
                >
                  <span className="text-sm text-zinc-300">{feature}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFeature(idx)}
                    className="h-6 w-6 p-0 text-red-400"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-zinc-300">Порядок відображення</Label>
            <Input
              type="number"
              value={data.order}
              onChange={(e) => setData({ ...data, order: Number(e.target.value) })}
              className="mt-1 bg-zinc-800 border-zinc-700"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
          <Button variant="outline" onClick={onClose}>
            Скасувати
          </Button>
          <Button
            onClick={() => onSave(data)}
            className="bg-amber-500 hover:bg-amber-600"
          >
            <Save className="h-4 w-4 mr-2" />
            Зберегти
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
