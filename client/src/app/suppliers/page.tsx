"use client";

import { useEffect, useState } from "react";
import { CategoryPageWithAggregators } from "@/components/features/CategoryPageWithAggregators";
import { MainLayout } from "@/components/layout/MainLayout";

interface PageContent {
  title: string;
  subtitle: string;
  description: string;
}

const defaultContent: PageContent = {
  title: "Постачальники",
  subtitle: "Надійні партнери",
  description: "Постачальники продуктів та товарів для закладів — каталог та платформи для порівняння",
};

export default function SuppliersPage() {
  const [content, setContent] = useState<PageContent>(defaultContent);

  useEffect(() => {
    const savedContent = localStorage.getItem("zakladua-suppliers");
    if (savedContent) {
      try {
        setContent({ ...defaultContent, ...JSON.parse(savedContent) });
      } catch (e) {
        console.error("Failed to parse suppliers content:", e);
      }
    }
  }, []);

  return (
    <MainLayout>
      <CategoryPageWithAggregators
        title={content.title}
        description={content.description}
        categorySlug="suppliers"
        aggregatorsCategorySlug="suppliers-aggregators"
        basePath="/suppliers"
        servicesTitle="Постачальники продуктів"
        aggregatorsTitle="Агрегатори постачальників"
      />
    </MainLayout>
  );
}
