import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/page-seo";

export const metadata: Metadata = generatePageMetadata("/aggregators");

export default function AggregatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
