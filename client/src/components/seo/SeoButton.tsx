"use client";

import { forwardRef } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { generateSeoButtonLabel } from "@/lib/auto-seo";

interface SeoButtonProps extends ButtonProps {
  /** SEO action type */
  seoAction: 
    | "view-details"
    | "compare"
    | "add-review"
    | "contact"
    | "order"
    | "subscribe"
    | "download"
    | "learn-more"
    | "visit-website"
    | "call"
    | "email"
    | "share"
    | "save"
    | "filter"
    | "search"
    | "load-more"
    | "submit"
    | "register"
    | "login"
    | "logout";
  /** Context name for the action */
  seoContextName?: string;
  /** Override aria-label */
  ariaLabel?: string;
}

/**
 * SEO-optimized Button component
 * Generates meaningful button labels and aria-labels
 * Avoids generic text like "Click here" or "Submit"
 */
export const SeoButton = forwardRef<HTMLButtonElement, SeoButtonProps>(
  ({ seoAction, seoContextName, ariaLabel, children, ...props }, ref) => {
    const seoAriaLabel = ariaLabel || generateSeoButtonLabel(seoAction, seoContextName);

    return (
      <Button
        ref={ref}
        aria-label={seoAriaLabel}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

SeoButton.displayName = "SeoButton";

/**
 * Predefined SEO buttons for common actions
 */
export function ViewDetailsButton({ name, ...props }: Omit<ButtonProps, "children"> & { name: string }) {
  return (
    <SeoButton seoAction="view-details" seoContextName={name} {...props}>
      Детальніше про {name}
    </SeoButton>
  );
}

export function CompareButton({ name, ...props }: Omit<ButtonProps, "children"> & { name: string }) {
  return (
    <SeoButton seoAction="compare" seoContextName={name} variant="outline" {...props}>
      Порівняти {name}
    </SeoButton>
  );
}

export function AddReviewButton({ name, ...props }: Omit<ButtonProps, "children"> & { name: string }) {
  return (
    <SeoButton seoAction="add-review" seoContextName={name} variant="outline" {...props}>
      Написати відгук про {name}
    </SeoButton>
  );
}

export function ContactButton({ name, ...props }: Omit<ButtonProps, "children"> & { name: string }) {
  return (
    <SeoButton seoAction="contact" seoContextName={name} {...props}>
      Зв&apos;язатися з {name}
    </SeoButton>
  );
}

export function OrderButton({ name, ...props }: Omit<ButtonProps, "children"> & { name?: string }) {
  return (
    <SeoButton seoAction="order" seoContextName={name} {...props}>
      {name ? `Замовити ${name}` : "Оформити замовлення"}
    </SeoButton>
  );
}

export function LearnMoreButton({ topic, ...props }: Omit<ButtonProps, "children"> & { topic: string }) {
  return (
    <SeoButton seoAction="learn-more" seoContextName={topic} variant="link" {...props}>
      Дізнатися більше про {topic}
    </SeoButton>
  );
}

export function VisitWebsiteButton({ name, href, ...props }: Omit<ButtonProps, "children" | "onClick"> & { name: string; href: string }) {
  return (
    <SeoButton 
      seoAction="visit-website" 
      seoContextName={name} 
      variant="outline"
      onClick={() => window.open(href, "_blank")}
      {...props}
    >
      Відвідати сайт {name}
    </SeoButton>
  );
}

export function LoadMoreButton({ itemType, ...props }: Omit<ButtonProps, "children"> & { itemType: string }) {
  return (
    <SeoButton seoAction="load-more" seoContextName={itemType} variant="outline" {...props}>
      Завантажити більше {itemType}
    </SeoButton>
  );
}

export function SubscribeButton({ ...props }: Omit<ButtonProps, "children">) {
  return (
    <SeoButton seoAction="subscribe" {...props}>
      Підписатися на оновлення
    </SeoButton>
  );
}

export function ShareButton({ name, ...props }: Omit<ButtonProps, "children"> & { name: string }) {
  return (
    <SeoButton seoAction="share" seoContextName={name} variant="ghost" size="sm" {...props}>
      Поділитися
    </SeoButton>
  );
}
