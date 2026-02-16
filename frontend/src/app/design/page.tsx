"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";

export default function DesignPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/establishments");
  }, [router]);

  return null;
}
