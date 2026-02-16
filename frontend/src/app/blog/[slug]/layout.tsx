import { Metadata } from "next";
import { generateArticleMetadata } from "@/lib/seo-pages";
import { generateArticleSchema, generateBreadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

async function getArticle(slug: string) {
  try {
    const res = await fetch(`${API_URL}/blog/${slug}?lang=uk`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  
  if (!article) {
    return {
      title: "Стаття не знайдена | ZakladUA",
      description: "Запитувана стаття не знайдена.",
    };
  }
  
  return generateArticleMetadata({
    title: article.title,
    description: article.description,
    excerpt: article.excerpt,
    category: article.category,
    author: article.author,
    publishedAt: article.publishedAt || article.createdAt,
    imageUrl: article.imageUrl,
    slug: article.slug,
    tags: article.tags,
  });
}

export default async function ArticleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  
  const schemas = [];
  
  if (article) {
    schemas.push(generateArticleSchema({
      title: article.title,
      description: article.description || article.excerpt,
      image: article.imageUrl,
      publishedTime: article.publishedAt || article.createdAt,
      modifiedTime: article.updatedAt,
      author: article.author,
      slug: article.slug,
    }));
    
    schemas.push(generateBreadcrumbSchema([
      { name: "Головна", url: "/" },
      { name: "Блог", url: "/blog" },
      { name: article.title, url: `/blog/${slug}` },
    ]));
  }
  
  return (
    <>
      {schemas.length > 0 && <JsonLd data={schemas} />}
      {children}
    </>
  );
}
