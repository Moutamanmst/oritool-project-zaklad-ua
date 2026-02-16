"use client";

import { ReactNode, createElement } from "react";
import { cn } from "@/lib/utils";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface SeoHeadingProps {
  /** Heading level (1-6) */
  level: HeadingLevel;
  /** Heading content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Optional ID for anchor links */
  id?: string;
  /** Include in document outline for screen readers */
  includeInOutline?: boolean;
}

/**
 * Default styles for each heading level
 */
const headingStyles: Record<HeadingLevel, string> = {
  1: "text-3xl md:text-4xl lg:text-5xl font-black text-zinc-100 mb-4",
  2: "text-2xl md:text-3xl font-bold text-zinc-100 mb-3",
  3: "text-xl md:text-2xl font-bold text-zinc-100 mb-2",
  4: "text-lg md:text-xl font-semibold text-zinc-200 mb-2",
  5: "text-base md:text-lg font-semibold text-zinc-300 mb-1",
  6: "text-sm md:text-base font-medium text-zinc-400 mb-1",
};

/**
 * SEO-optimized Heading component
 * Ensures proper heading hierarchy (h1-h6)
 */
export function SeoHeading({
  level,
  children,
  className,
  id,
  includeInOutline = true,
}: SeoHeadingProps) {
  const Tag = `h${level}` as const;
  
  return createElement(
    Tag,
    {
      id,
      className: cn(headingStyles[level], className),
      ...(includeInOutline ? {} : { "aria-hidden": true }),
    },
    children
  );
}

/**
 * Page H1 - only ONE per page
 */
interface PageH1Props {
  children: ReactNode;
  className?: string;
  /** Subtitle (renders as regular text, not heading) */
  subtitle?: string;
}

export function PageH1({ children, className, subtitle }: PageH1Props) {
  return (
    <div className="mb-6">
      <SeoHeading level={1} className={className}>
        {children}
      </SeoHeading>
      {subtitle && (
        <p className="text-lg md:text-xl text-zinc-400 max-w-3xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/**
 * Section H2 - main sections
 */
interface SectionH2Props {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function SectionH2({ children, className, id }: SectionH2Props) {
  return (
    <SeoHeading level={2} className={className} id={id}>
      {children}
    </SeoHeading>
  );
}

/**
 * Subsection H3
 */
interface SubsectionH3Props {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function SubsectionH3({ children, className, id }: SubsectionH3Props) {
  return (
    <SeoHeading level={3} className={className} id={id}>
      {children}
    </SeoHeading>
  );
}

/**
 * Card/Item H4
 */
interface ItemH4Props {
  children: ReactNode;
  className?: string;
}

export function ItemH4({ children, className }: ItemH4Props) {
  return (
    <SeoHeading level={4} className={className}>
      {children}
    </SeoHeading>
  );
}

/**
 * Helper to ensure only one H1 exists on the page
 * Use in layout to track heading hierarchy
 */
export function useHeadingHierarchy() {
  // In a real implementation, this would use context
  // to ensure proper heading hierarchy across components
  return {
    hasH1: false,
    registerH1: () => {},
    getNextLevel: (currentLevel: HeadingLevel) => 
      Math.min(currentLevel + 1, 6) as HeadingLevel,
  };
}

/**
 * Visually hidden H1 for SEO (when design doesn't show H1)
 */
export function HiddenH1({ children }: { children: ReactNode }) {
  return (
    <h1 className="sr-only">
      {children}
    </h1>
  );
}

/**
 * Generate heading with keyword variations (for SEO)
 */
interface KeywordHeadingProps {
  level: HeadingLevel;
  /** Main keyword */
  keyword: string;
  /** Synonym/variation to include */
  variation?: string;
  /** Template: "main" | "with-location" | "with-year" */
  template?: "main" | "with-location" | "with-year" | "question";
  location?: string;
  className?: string;
}

export function KeywordHeading({
  level,
  keyword,
  variation,
  template = "main",
  location,
  className,
}: KeywordHeadingProps) {
  let content: string;
  
  switch (template) {
    case "with-location":
      content = `${keyword}${location ? ` в ${location}` : ""} - ${variation || "каталог та відгуки"}`;
      break;
    case "with-year":
      content = `${keyword} ${new Date().getFullYear()} - ${variation || "актуальні рішення"}`;
      break;
    case "question":
      content = `${variation || "Як обрати"} ${keyword}?`;
      break;
    default:
      content = variation ? `${keyword} - ${variation}` : keyword;
  }

  return (
    <SeoHeading level={level} className={className}>
      {content}
    </SeoHeading>
  );
}
