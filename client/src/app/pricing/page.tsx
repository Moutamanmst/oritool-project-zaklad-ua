"use client";

import Link from "next/link";
import { Check, Star, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MainLayout } from "@/components/layout/MainLayout";

const plans = [
  {
    name: "Базовий",
    price: "Безкоштовно",
    period: "",
    description: "Для початку роботи на платформі",
    icon: Star,
    color: "zinc",
    features: [
      "Розміщення 1 сервісу",
      "Базова картка компанії",
      "Контактна інформація",
      "До 5 фото",
      "Відгуки клієнтів",
    ],
    notIncluded: [
      "Пріоритет у пошуку",
      "Розширена аналітика",
      "Верифікація компанії",
    ],
    buttonText: "Почати безкоштовно",
    buttonVariant: "outline" as const,
  },
  {
    name: "Професійний",
    price: "999",
    period: "грн/міс",
    description: "Для активного просування бізнесу",
    icon: Zap,
    color: "amber",
    popular: true,
    features: [
      "Розміщення до 5 сервісів",
      "Розширена картка компанії",
      "Пріоритет у пошуку",
      "До 20 фото + відео",
      "Відгуки клієнтів",
      "Базова аналітика переглядів",
      "Верифікація компанії ✓",
      "Відповіді на відгуки",
    ],
    notIncluded: ["Топ-розміщення", "API доступ"],
    buttonText: "Обрати план",
    buttonVariant: "default" as const,
  },
  {
    name: "Преміум",
    price: "2499",
    period: "грн/міс",
    description: "Максимальна видимість та можливості",
    icon: Crown,
    color: "violet",
    features: [
      "Необмежена кількість сервісів",
      "Преміум картка компанії",
      "Топ-розміщення у категоріях",
      "Необмежені фото + відео",
      "Відгуки клієнтів",
      "Розширена аналітика",
      "Верифікація компанії ✓",
      "Відповіді на відгуки",
      "Персональний менеджер",
      "API доступ",
      "Брендування сторінки",
    ],
    notIncluded: [],
    buttonText: "Обрати план",
    buttonVariant: "default" as const,
  },
];

export default function PricingPage() {
  return (
    <MainLayout>
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-zinc-100 mb-4">
            Тарифи для бізнесу
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Оберіть план, який підходить вашому бізнесу. Почніть безкоштовно та
            масштабуйтесь разом з нами.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card
                key={plan.name}
                className={`relative overflow-hidden ${
                  plan.popular
                    ? "border-amber-500/50 bg-gradient-to-b from-amber-500/10 to-transparent"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-amber-500 text-zinc-900">
                      Популярний
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div
                    className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${
                      plan.color === "amber"
                        ? "bg-amber-500/20"
                        : plan.color === "violet"
                        ? "bg-violet-500/20"
                        : "bg-zinc-700"
                    }`}
                  >
                    <Icon
                      className={`h-6 w-6 ${
                        plan.color === "amber"
                          ? "text-amber-500"
                          : plan.color === "violet"
                          ? "text-violet-500"
                          : "text-zinc-400"
                      }`}
                    />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <p className="text-sm text-zinc-500">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-zinc-100">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-zinc-500 ml-1">{plan.period}</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-zinc-300">{feature}</span>
                      </div>
                    ))}
                    {plan.notIncluded.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-start gap-3 opacity-50"
                      >
                        <div className="h-5 w-5 flex-shrink-0 mt-0.5 flex items-center justify-center">
                          <div className="h-1 w-3 bg-zinc-600 rounded" />
                        </div>
                        <span className="text-sm text-zinc-500">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link href="/register?type=business" className="block">
                    <Button
                      variant={plan.buttonVariant}
                      className={`w-full ${
                        plan.popular
                          ? "bg-amber-500 hover:bg-amber-600 text-zinc-900"
                          : ""
                      }`}
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800 p-8 lg:p-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">
              Потрібен індивідуальний план?
            </h2>
            <p className="text-zinc-400 mb-6">
              Для великих мереж та особливих потреб ми пропонуємо індивідуальні
              умови співпраці. Зв'яжіться з нами для обговорення.
            </p>
            <Button variant="outline" size="lg">
              Зв'язатися з нами
            </Button>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-zinc-100 mb-8 text-center">
            Часті питання
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <h3 className="font-semibold text-zinc-100 mb-2">
                Чи можна змінити план?
              </h3>
              <p className="text-sm text-zinc-400">
                Так, ви можете змінити план в будь-який момент. При переході на
                вищий план різниця буде розрахована пропорційно.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <h3 className="font-semibold text-zinc-100 mb-2">
                Як працює верифікація?
              </h3>
              <p className="text-sm text-zinc-400">
                Ми перевіряємо документи компанії та контактні дані. Верифіковані
                компанії отримують спеціальну позначку.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <h3 className="font-semibold text-zinc-100 mb-2">
                Чи є пробний період?
              </h3>
              <p className="text-sm text-zinc-400">
                Базовий план безкоштовний назавжди. Для платних планів ми
                пропонуємо 14 днів безкоштовного тестування.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
              <h3 className="font-semibold text-zinc-100 mb-2">
                Які способи оплати?
              </h3>
              <p className="text-sm text-zinc-400">
                Приймаємо оплату карткою, через ПриватБанк, Monobank, а також
                безготівковий розрахунок для юридичних осіб.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </MainLayout>
  );
}

