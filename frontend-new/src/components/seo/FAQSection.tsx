"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateAutoFAQ, type FAQItem } from "@/lib/auto-seo";
import { SectionH2 } from "./SeoHeading";

interface FAQSectionProps {
  /** FAQ category for auto-generation */
  category?: "pos-system" | "establishment" | "equipment" | "supplier" | "delivery" | "qr-menu" | "marketing" | "general";
  /** Context for personalized FAQ */
  context?: {
    name?: string;
    features?: string[];
    priceFrom?: number;
    city?: string;
  };
  /** Custom FAQ items (will be merged with auto-generated) */
  customFAQ?: FAQItem[];
  /** Section title */
  title?: string;
  /** CSS class */
  className?: string;
  /** Max items to show initially */
  initialVisible?: number;
}

/**
 * Auto-generating FAQ Section with schema.org markup
 * Automatically creates relevant questions based on page type
 */
export function FAQSection({
  category = "general",
  context,
  customFAQ = [],
  title = "Часті запитання",
  className,
  initialVisible = 5,
}: FAQSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Generate FAQ items
  const autoFAQ = generateAutoFAQ(category, context);
  const allFAQ = [...customFAQ, ...autoFAQ];
  const visibleFAQ = showAll ? allFAQ : allFAQ.slice(0, initialVisible);

  const toggleItem = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section 
      className={cn("py-12", className)}
      itemScope 
      itemType="https://schema.org/FAQPage"
      aria-labelledby="faq-heading"
    >
      <SectionH2 id="faq-heading" className="mb-8">
        {title}
      </SectionH2>
      
      <div className="space-y-3">
        {visibleFAQ.map((item, index) => (
          <FAQItem
            key={index}
            question={item.question}
            answer={item.answer}
            isExpanded={expandedIndex === index}
            onToggle={() => toggleItem(index)}
          />
        ))}
      </div>

      {allFAQ.length > initialVisible && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-6 text-amber-400 hover:text-amber-300 font-medium transition-colors"
          aria-label={`Показати всі ${allFAQ.length} запитань`}
        >
          Показати всі запитання ({allFAQ.length})
        </button>
      )}
    </section>
  );
}

/**
 * Single FAQ Item with accordion behavior
 */
interface FAQItemProps {
  question: string;
  answer: string;
  isExpanded: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isExpanded, onToggle }: FAQItemProps) {
  return (
    <div
      itemScope
      itemProp="mainEntity"
      itemType="https://schema.org/Question"
      className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/50"
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-zinc-800/50 transition-colors"
        aria-expanded={isExpanded}
        aria-controls={`faq-answer-${question.slice(0, 20)}`}
      >
        <h3 
          itemProp="name" 
          className="text-zinc-100 font-medium pr-4"
        >
          {question}
        </h3>
        <ChevronDown 
          className={cn(
            "h-5 w-5 text-amber-500 flex-shrink-0 transition-transform duration-200",
            isExpanded && "rotate-180"
          )}
        />
      </button>
      
      <div
        id={`faq-answer-${question.slice(0, 20)}`}
        itemScope
        itemProp="acceptedAnswer"
        itemType="https://schema.org/Answer"
        className={cn(
          "overflow-hidden transition-all duration-200",
          isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div 
          itemProp="text"
          className="px-6 pb-4 text-zinc-400"
        >
          {answer}
        </div>
      </div>
    </div>
  );
}

/**
 * Compact inline FAQ for product/service pages
 */
interface InlineFAQProps {
  items: FAQItem[];
  className?: string;
}

export function InlineFAQ({ items, className }: InlineFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div 
      className={cn("space-y-2", className)}
      itemScope 
      itemType="https://schema.org/FAQPage"
    >
      {items.slice(0, 3).map((item, index) => (
        <div
          key={index}
          itemScope
          itemProp="mainEntity"
          itemType="https://schema.org/Question"
          className="bg-zinc-800/30 rounded-lg"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full p-3 flex items-center justify-between text-left text-sm"
          >
            <span itemProp="name" className="text-zinc-200 font-medium">
              {item.question}
            </span>
            <ChevronDown 
              className={cn(
                "h-4 w-4 text-amber-500 transition-transform",
                openIndex === index && "rotate-180"
              )}
            />
          </button>
          {openIndex === index && (
            <div
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
              className="px-3 pb-3"
            >
              <p itemProp="text" className="text-sm text-zinc-400">
                {item.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Static FAQ for SSR/SEO (no interactivity, fully visible)
 */
export function StaticFAQ({ items }: { items: FAQItem[] }) {
  return (
    <div itemScope itemType="https://schema.org/FAQPage">
      {items.map((item, index) => (
        <div
          key={index}
          itemScope
          itemProp="mainEntity"
          itemType="https://schema.org/Question"
          className="mb-6"
        >
          <h3 itemProp="name" className="text-lg font-semibold text-zinc-100 mb-2">
            {item.question}
          </h3>
          <div
            itemScope
            itemProp="acceptedAnswer"
            itemType="https://schema.org/Answer"
          >
            <p itemProp="text" className="text-zinc-400">
              {item.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
