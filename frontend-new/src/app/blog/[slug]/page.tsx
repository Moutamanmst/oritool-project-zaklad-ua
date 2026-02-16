"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { 
  Calendar, 
  User, 
  Eye, 
  ArrowLeft, 
  Tag,
  Clock,
  Share2,
  BookOpen,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  titleRu?: string;
  excerpt?: string;
  content: string;
  contentRu?: string;
  coverImage?: string;
  category: string;
  tags: string[];
  author?: string;
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export default function BlogArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<BlogArticle[]>([]);

  useEffect(() => {
    async function fetchArticle() {
      if (!slug) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const res = await fetch(`${API_URL}/blog/${slug}`, {
          headers: { "x-lang": "uk" },
        });
        
        if (!res.ok) {
          if (res.status === 404) {
            setError("Стаття не знайдена");
          } else {
            setError("Помилка завантаження");
          }
          return;
        }
        
        const data = await res.json();
        setArticle(data);
        
        // Load related articles
        const relatedRes = await fetch(`${API_URL}/blog?limit=3`, {
          headers: { "x-lang": "uk" },
        });
        if (relatedRes.ok) {
          const relatedData = await relatedRes.json();
          setRelatedArticles(
            (relatedData.data || []).filter((a: BlogArticle) => a.slug !== slug).slice(0, 3)
          );
        }
      } catch (e) {
        console.error("Error fetching article:", e);
        setError("Помилка завантаження статті");
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [slug]);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "d MMMM yyyy", { locale: uk });
    } catch {
      return dateStr;
    }
  };

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      news: "Новини",
      guides: "Гайди",
      trends: "Тренди",
      reviews: "Огляди",
      tips: "Поради",
    };
    return labels[cat] || cat;
  };

  const estimateReadTime = (content: string) => {
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-6 w-64 mb-8" />
          <Skeleton className="h-96 w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !article) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <BookOpen className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-zinc-100 mb-2">
            {error || "Стаття не знайдена"}
          </h1>
          <p className="text-zinc-400 mb-6">
            На жаль, ми не змогли знайти цю статтю
          </p>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              До блогу
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Back button */}
        <Link 
          href="/blog" 
          className="inline-flex items-center text-zinc-400 hover:text-amber-400 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад до блогу
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">
              {getCategoryLabel(article.category)}
            </Badge>
            <span className="text-zinc-500 text-sm flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {estimateReadTime(article.content)} хв читання
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-lg text-zinc-400 mb-6">
              {article.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
            {article.author && (
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {article.author}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(article.publishedAt || article.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {article.viewCount} переглядів
            </span>
          </div>
        </header>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div 
          className="prose prose-invert prose-amber max-w-none mb-12
            prose-headings:text-zinc-100 
            prose-p:text-zinc-300 
            prose-a:text-amber-400 
            prose-strong:text-zinc-100
            prose-ul:text-zinc-300
            prose-ol:text-zinc-300
            prose-li:text-zinc-300
            prose-table:text-zinc-300
            prose-th:text-zinc-100
            prose-td:text-zinc-300
            prose-code:text-amber-400
            prose-pre:bg-zinc-800/50
            prose-blockquote:border-amber-500
            prose-blockquote:text-zinc-400
            prose-hr:border-zinc-700"
          dangerouslySetInnerHTML={{ 
            __html: article.content
              .replace(/\n/g, '<br>')
              .replace(/^# (.*$)/gm, '<h1>$1</h1>')
              .replace(/^## (.*$)/gm, '<h2>$1</h2>')
              .replace(/^### (.*$)/gm, '<h3>$1</h3>')
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/^- (.*$)/gm, '<li>$1</li>')
              .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
          }}
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8 pb-8 border-b border-zinc-800">
            <Tag className="h-4 w-4 text-zinc-500" />
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="border-zinc-700 text-zinc-400">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Share */}
        <div className="flex items-center justify-between mb-12">
          <span className="text-zinc-400">Поділитися:</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
              }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Копіювати посилання
            </Button>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-zinc-100 mb-4">
              Читайте також
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedArticles.map((related) => (
                <Link key={related.id} href={`/blog/${related.slug}`}>
                  <Card className="bg-zinc-900/50 border-zinc-800 hover:border-amber-500/50 transition-colors h-full">
                    <CardContent className="p-4">
                      <Badge className="mb-2 bg-zinc-800 text-zinc-400 text-xs">
                        {getCategoryLabel(related.category)}
                      </Badge>
                      <h3 className="font-medium text-zinc-100 line-clamp-2 mb-2">
                        {related.title}
                      </h3>
                      <p className="text-sm text-zinc-500">
                        {formatDate(related.publishedAt || related.createdAt)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </MainLayout>
  );
}
