"use client";

import { useParams } from "next/navigation";
import { ServiceDetailPage } from "@/components/features/ServiceDetailPage";
import { MainLayout } from "@/components/layout/MainLayout";

export default function EquipmentDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <MainLayout>
      <ServiceDetailPage
        slug={slug}
        backPath="/equipment"
        backLabel="Назад до обладнання"
      />
    </MainLayout>
  );
}

