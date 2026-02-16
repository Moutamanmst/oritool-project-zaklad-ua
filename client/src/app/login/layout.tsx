import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/page-seo";

export const metadata: Metadata = generatePageMetadata("/login");

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
