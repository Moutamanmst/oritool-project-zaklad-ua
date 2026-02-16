"use client";

import Image, { ImageProps } from "next/image";
import { generateSeoImageAlt, generateSeoImageTitle } from "@/lib/auto-seo";

interface SeoImageProps extends Omit<ImageProps, "alt" | "title"> {
  /** Original alt text (will be enhanced with SEO) */
  alt?: string;
  /** Context for SEO generation */
  seoContext?: {
    type: "product" | "establishment" | "service" | "article" | "category" | "logo" | "cover" | "gallery";
    name?: string;
    category?: string;
    location?: string;
  };
  /** Disable auto SEO enhancement */
  disableAutoSeo?: boolean;
}

/**
 * SEO-optimized Image component
 * Automatically generates meaningful alt and title attributes
 */
export function SeoImage({ 
  alt, 
  seoContext, 
  disableAutoSeo = false,
  ...props 
}: SeoImageProps) {
  const seoAlt = disableAutoSeo || !seoContext 
    ? alt || "Зображення" 
    : generateSeoImageAlt(seoContext, alt);
  
  const seoTitle = disableAutoSeo || !seoContext 
    ? alt || "" 
    : generateSeoImageTitle(seoContext);

  return (
    <Image
      {...props}
      alt={seoAlt}
      title={seoTitle}
    />
  );
}

/**
 * SEO-optimized background image wrapper
 */
interface SeoBgImageProps {
  src: string;
  alt?: string;
  seoContext?: SeoImageProps["seoContext"];
  className?: string;
  children?: React.ReactNode;
}

export function SeoBgImage({ 
  src, 
  alt, 
  seoContext, 
  className = "", 
  children 
}: SeoBgImageProps) {
  const seoAlt = seoContext 
    ? generateSeoImageAlt(seoContext, alt) 
    : alt || "Фонове зображення";

  return (
    <div 
      className={`relative ${className}`}
      role="img"
      aria-label={seoAlt}
      style={{ backgroundImage: `url(${src})` }}
    >
      {children}
      {/* Hidden image for SEO crawlers */}
      <span className="sr-only">{seoAlt}</span>
    </div>
  );
}
