"use client";

import Link, { LinkProps } from "next/link";
import { generateSeoAnchor } from "@/lib/auto-seo";

interface SeoLinkProps extends Omit<LinkProps, "href"> {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** Context for SEO anchor generation */
  seoContext?: {
    type: "product" | "establishment" | "service" | "article" | "category" | "action" | "navigation";
    name?: string;
    action?: "view" | "compare" | "review" | "order" | "contact" | "learn";
  };
  /** External link */
  external?: boolean;
  /** Disable auto SEO enhancement */
  disableAutoSeo?: boolean;
  /** Optional aria-label override */
  ariaLabel?: string;
}

/**
 * SEO-optimized Link component
 * Generates meaningful anchor text and aria-labels
 */
export function SeoLink({
  href,
  children,
  className,
  seoContext,
  external = false,
  disableAutoSeo = false,
  ariaLabel,
  ...props
}: SeoLinkProps) {
  const seoAriaLabel = disableAutoSeo || !seoContext
    ? ariaLabel
    : generateSeoAnchor(seoContext);

  if (external) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={seoAriaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      aria-label={seoAriaLabel}
      {...props}
    >
      {children}
    </Link>
  );
}

/**
 * SEO-optimized internal navigation link
 */
interface SeoNavLinkProps extends Omit<SeoLinkProps, "seoContext"> {
  /** Navigation section name */
  section: string;
}

export function SeoNavLink({
  href,
  section,
  children,
  className,
  ...props
}: SeoNavLinkProps) {
  return (
    <SeoLink
      href={href}
      className={className}
      seoContext={{
        type: "navigation",
        name: section,
        action: "view",
      }}
      {...props}
    >
      {children}
    </SeoLink>
  );
}

/**
 * SEO breadcrumb link
 */
interface SeoBreadcrumbLinkProps {
  href: string;
  children: React.ReactNode;
  isLast?: boolean;
}

export function SeoBreadcrumbLink({ href, children, isLast }: SeoBreadcrumbLinkProps) {
  if (isLast) {
    return (
      <span 
        className="text-zinc-300"
        aria-current="page"
      >
        {children}
      </span>
    );
  }

  return (
    <Link 
      href={href}
      className="text-zinc-400 hover:text-amber-400 transition-colors"
    >
      {children}
    </Link>
  );
}
