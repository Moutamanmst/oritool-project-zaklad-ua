import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/page-seo";

export const metadata: Metadata = generatePageMetadata("/register");

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
