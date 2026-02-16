"use client";

import { useParams } from "next/navigation";
import { ServiceDetailPage } from "@/components/features/ServiceDetailPage";
import { MainLayout } from "@/components/layout/MainLayout";

export default function QrMenuDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <MainLayout>
      <ServiceDetailPage
        slug={slug}
        backPath="/qr-menu"
        backLabel="Назад до QR-меню"
      />
    </MainLayout>
  );
}

