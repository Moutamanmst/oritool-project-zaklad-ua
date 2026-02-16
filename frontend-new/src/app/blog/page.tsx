"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Eye, Search, Loader2, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/MainLayout";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  category: string;
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

const categoryLabels: Record<string, string> = {
  trends: "Тренди",
  guides: "Гайди",
  news: "Новини",
  reviews: "Огляди",
  tips: "Поради",
  business: "Бізнес",
  technology: "Технології",
  marketing: "Маркетинг",
};

const categoryImages: Record<string, string> = {
  trends: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
  guides: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800",
  news: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
  reviews: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
  tips: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
  business: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
  technology: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
  marketing: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800",
};

export default function BlogPage() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch(`${API_URL}/blog?limit=50`, {
          headers: { "x-lang": "uk" },
        });
        if (res.ok) {
          const data = await res.json();
          setArticles(data.data || []);
        }
      } catch (e) {
        console.error("Error fetching articles:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (article.excerpt?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredArticle = filteredArticles.find(a => a.slug === "restaurant-trends-2024") || filteredArticles[0];
  const otherArticles = filteredArticles.filter(a => a.id !== featuredArticle?.id);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("uk-UA", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getArticleImage = (article: BlogArticle) => {
    if (article.coverImage) return article.coverImage;
    return categoryImages[article.category] || categoryImages.guides;
  };

  const estimateReadTime = (excerpt?: string) => {
    if (!excerpt) return 5;
    const words = excerpt.split(/\s+/).length;
    return Math.max(3, Math.ceil(words / 50) + 5);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Skeleton className="h-10 w-32 mb-2" />
              <Skeleton className="h-6 w-64" />
            </div>
            <Skeleton className="h-96 w-full mb-12 rounded-xl" />
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (articles.length === 0) {
    return (
      <MainLayout>
        <div className="min-h-screen py-16">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <BookOpen className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-zinc-100 mb-2">Блог</h1>
            <p className="text-zinc-400">Статті скоро з&apos;являться</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-4xl font-bold text-zinc-100">Блог</h1>
                <p className="text-xl text-zinc-400 mt-2">
                  Корисні статті для рестораторів та власників закладів
                </p>
              </div>
              
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Пошук статей..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-zinc-800/50 border-2 border-zinc-700 rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Featured Article */}
          {featuredArticle && searchQuery === "" && (
            <Link href={`/blog/${featuredArticle.slug}`} className="block mb-12">
              <Card className="group overflow-hidden hover:scale-[1.01] transition-transform duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-64 lg:h-96 overflow-hidden">
                    <Image
                      src={getArticleImage(featuredArticle)}
                      alt={featuredArticle.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-amber-500 text-zinc-900 text-sm font-semibold rounded-full">
                        {categoryLabels[featuredArticle.category] || featuredArticle.category}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-8 flex flex-col justify-center">
                    <p className="text-sm text-zinc-500 mb-2">
                      {formatDate(featuredArticle.publishedAt || featuredArticle.createdAt)}
                    </p>
                    <h2 className="text-2xl lg:text-3xl font-bold text-zinc-100 mb-4 group-hover:text-amber-400 transition-colors">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-zinc-400 mb-6">{featuredArticle.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {estimateReadTime(featuredArticle.excerpt)} хв
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {featuredArticle.viewCount}
                      </span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          )}

          {/* Articles List */}
          <div>
            {filteredArticles.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-zinc-400">
                  Статей за запитом &quot;{searchQuery}&quot; не знайдено
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {(searchQuery ? filteredArticles : otherArticles).map((article) => (
                  <Link key={article.id} href={`/blog/${article.slug}`}>
                    <Card className="group overflow-hidden hover:scale-[1.005] transition-transform duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                        <div className="relative h-56 md:h-full md:min-h-[200px] overflow-hidden">
                          <Image
                            src={getArticleImage(article)}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 bg-amber-500 text-zinc-900 text-sm font-semibold rounded-full">
                              {categoryLabels[article.category] || article.category}
                            </span>
                          </div>
                        </div>
                        <CardContent className="p-6 md:col-span-2 lg:col-span-3 flex flex-col justify-center">
                          <p className="text-sm text-zinc-500 mb-2">
                            {formatDate(article.publishedAt || article.createdAt)}
                          </p>
                          <h3 className="text-xl lg:text-2xl font-bold text-zinc-100 mb-3 group-hover:text-amber-400 transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-zinc-400 mb-4 line-clamp-2">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center gap-6 text-sm text-zinc-500">
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              {estimateReadTime(article.excerpt)} хв читання
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Eye className="h-4 w-4" />
                              {article.viewCount} переглядів
                            </span>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
