"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

// GA4 Measurement ID - can be set via admin panel
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

// Send pageview to GA
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && (window as any).gtag && GA_MEASUREMENT_ID) {
    (window as any).gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Send custom event to GA
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track outbound links
export const trackOutboundLink = (url: string, label?: string) => {
  event({
    action: "click",
    category: "outbound",
    label: label || url,
  });
};

// Track search
export const trackSearch = (searchTerm: string) => {
  event({
    action: "search",
    category: "engagement",
    label: searchTerm,
  });
};

// Track file download
export const trackDownload = (fileName: string, fileType: string) => {
  event({
    action: "download",
    category: "engagement",
    label: `${fileType}: ${fileName}`,
  });
};

// Track form submission
export const trackFormSubmission = (formName: string) => {
  event({
    action: "form_submit",
    category: "engagement",
    label: formName,
  });
};

// Track social share
export const trackShare = (platform: string, url: string) => {
  event({
    action: "share",
    category: "social",
    label: `${platform}: ${url}`,
  });
};

// Simple trackEvent function for components
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  event({ action, category, label, value });
};

// Track product view
export const trackProductView = (productId: string, productName: string, category?: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "view_item", {
      items: [
        {
          item_id: productId,
          item_name: productName,
          item_category: category,
        },
      ],
    });
  }
};

// Navigation tracker component
function NavigationTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      pageview(url);
    }
  }, [pathname, searchParams]);

  return null;
}

// Main Google Analytics component
export function GoogleAnalytics() {
  // Check if GA ID is configured
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              send_page_view: true,
            });
          `,
        }}
      />
      {/* Navigation tracker with Suspense for useSearchParams */}
      <Suspense fallback={null}>
        <NavigationTracker />
      </Suspense>
    </>
  );
}

// Hook to use analytics in components
export function useAnalytics() {
  return {
    trackEvent: event,
    trackOutboundLink,
    trackSearch,
    trackDownload,
    trackFormSubmission,
    trackShare,
    trackProductView,
  };
}
