"use client";

import { generateSeoContent } from "@/lib/auto-seo";
import { SectionH2, SubsectionH3 } from "./SeoHeading";
import { cn } from "@/lib/utils";

interface SeoContentProps {
  /** Content type for auto-generation */
  type: "pos-system" | "establishment" | "equipment" | "supplier" | "delivery" | "qr-menu" | "marketing" | "general";
  /** Context for personalized content */
  context?: {
    name?: string;
    description?: string;
    features?: string[];
    category?: string;
    city?: string;
  };
  /** Custom content (overrides auto-generated) */
  customContent?: string;
  /** CSS class */
  className?: string;
  /** Show/hide section */
  visible?: boolean;
}

/**
 * Auto-generating SEO Content Section
 * Ensures minimum 300 words of relevant content per page
 */
export function SeoContent({
  type,
  context,
  customContent,
  className,
  visible = true,
}: SeoContentProps) {
  if (!visible) return null;

  const content = customContent || generateSeoContent({ type, ...context });
  
  // Parse markdown-like content
  const sections = parseContent(content);

  return (
    <article 
      className={cn("prose prose-invert prose-amber max-w-none", className)}
      itemScope
      itemType="https://schema.org/Article"
    >
      {sections.map((section, index) => (
        <ContentSection key={index} section={section} />
      ))}
      
      {/* Hidden word count for verification */}
      <meta itemProp="wordCount" content={countWords(content).toString()} />
    </article>
  );
}

interface ContentSectionData {
  type: "h2" | "h3" | "paragraph" | "list";
  content: string;
  items?: string[];
}

function parseContent(content: string): ContentSectionData[] {
  const lines = content.trim().split("\n");
  const sections: ContentSectionData[] = [];
  let currentParagraph = "";

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (!trimmedLine) {
      if (currentParagraph) {
        sections.push({ type: "paragraph", content: currentParagraph.trim() });
        currentParagraph = "";
      }
      continue;
    }

    if (trimmedLine.startsWith("## ")) {
      if (currentParagraph) {
        sections.push({ type: "paragraph", content: currentParagraph.trim() });
        currentParagraph = "";
      }
      sections.push({ type: "h2", content: trimmedLine.replace("## ", "") });
    } else if (trimmedLine.startsWith("### ")) {
      if (currentParagraph) {
        sections.push({ type: "paragraph", content: currentParagraph.trim() });
        currentParagraph = "";
      }
      sections.push({ type: "h3", content: trimmedLine.replace("### ", "") });
    } else if (trimmedLine.startsWith("- ")) {
      if (currentParagraph) {
        sections.push({ type: "paragraph", content: currentParagraph.trim() });
        currentParagraph = "";
      }
      // Collect list items
      const items: string[] = [trimmedLine.replace("- ", "")];
      sections.push({ type: "list", content: "", items });
    } else {
      // Check if previous section is a list and this is a list item
      const lastSection = sections[sections.length - 1];
      if (trimmedLine.startsWith("- ") && lastSection?.type === "list") {
        lastSection.items?.push(trimmedLine.replace("- ", ""));
      } else {
        currentParagraph += " " + trimmedLine;
      }
    }
  }

  if (currentParagraph) {
    sections.push({ type: "paragraph", content: currentParagraph.trim() });
  }

  return sections;
}

function ContentSection({ section }: { section: ContentSectionData }) {
  switch (section.type) {
    case "h2":
      return (
        <SectionH2 className="mt-8 mb-4">
          {section.content}
        </SectionH2>
      );
    case "h3":
      return (
        <SubsectionH3 className="mt-6 mb-3">
          {section.content}
        </SubsectionH3>
      );
    case "list":
      return (
        <ul className="list-disc list-inside space-y-2 text-zinc-400 my-4">
          {section.items?.map((item, index) => (
            <li key={index} className="text-zinc-400">
              <span dangerouslySetInnerHTML={{ __html: formatInlineStyles(item) }} />
            </li>
          ))}
        </ul>
      );
    case "paragraph":
      return (
        <p 
          className="text-zinc-400 leading-relaxed my-4"
          dangerouslySetInnerHTML={{ __html: formatInlineStyles(section.content) }}
        />
      );
    default:
      return null;
  }
}

function formatInlineStyles(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "<strong class='text-zinc-200'>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function countWords(text: string): number {
  return text
    .replace(/[#*\-_]/g, "")
    .split(/\s+/)
    .filter(word => word.length > 0)
    .length;
}

/**
 * Collapsible SEO content (for mobile/UX)
 */
interface CollapsibleSeoContentProps extends SeoContentProps {
  /** Initial preview length in characters */
  previewLength?: number;
}

export function CollapsibleSeoContent({
  previewLength = 500,
  ...props
}: CollapsibleSeoContentProps) {
  const content = props.customContent || generateSeoContent({ type: props.type, ...props.context });
  const isLong = content.length > previewLength;
  
  return (
    <div className={props.className}>
      <SeoContent {...props} />
      
      {isLong && (
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-500">
            Цей текст допомагає пошуковим системам краще розуміти вміст сторінки
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Minimal SEO block for category pages
 */
interface CategorySeoBlockProps {
  categoryName: string;
  categoryType: "establishments" | "equipment" | "pos-systems" | "suppliers" | "delivery" | "qr-menu";
  itemCount?: number;
  className?: string;
}

export function CategorySeoBlock({
  categoryName,
  categoryType,
  itemCount,
  className,
}: CategorySeoBlockProps) {
  const typeLabels: Record<string, { singular: string; plural: string }> = {
    establishments: { singular: "заклад", plural: "закладів" },
    equipment: { singular: "товар", plural: "товарів" },
    "pos-systems": { singular: "систему", plural: "систем" },
    suppliers: { singular: "постачальника", plural: "постачальників" },
    delivery: { singular: "сервіс", plural: "сервісів" },
    "qr-menu": { singular: "рішення", plural: "рішень" },
  };

  const label = typeLabels[categoryType] || { singular: "елемент", plural: "елементів" };

  return (
    <div className={cn("bg-zinc-900/50 rounded-xl p-6 mt-8", className)}>
      <h2 className="text-xl font-bold text-zinc-100 mb-3">
        {categoryName} - каталог на ZakladUA
      </h2>
      <p className="text-zinc-400 leading-relaxed">
        У категорії <strong className="text-zinc-200">{categoryName}</strong> 
        {itemCount && ` представлено ${itemCount} ${label.plural}`}. 
        Порівнюйте варіанти, читайте реальні відгуки від інших користувачів 
        та обирайте оптимальне рішення для вашого бізнесу. 
        Всі {label.plural} в каталозі мають детальні описи, характеристики та актуальні ціни.
      </p>
    </div>
  );
}

/**
 * Location-based SEO block
 */
interface LocationSeoBlockProps {
  location: string;
  categoryType: string;
  className?: string;
}

export function LocationSeoBlock({
  location,
  categoryType,
  className,
}: LocationSeoBlockProps) {
  return (
    <div className={cn("bg-zinc-900/50 rounded-xl p-6 mt-8", className)}>
      <h2 className="text-xl font-bold text-zinc-100 mb-3">
        {categoryType} в {location}
      </h2>
      <p className="text-zinc-400 leading-relaxed">
        Шукаєте {categoryType.toLowerCase()} в місті {location}? 
        На ZakladUA зібрані найкращі варіанти з відгуками та рейтингами. 
        Фільтруйте за ціною, функціями та локацією, щоб знайти ідеальне рішення 
        для вашого закладу в {location}.
      </p>
    </div>
  );
}
