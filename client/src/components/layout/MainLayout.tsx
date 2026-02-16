"use client";

import { Header } from "./Header";
import { Footer } from "./Footer";
import { AiAssistant } from "@/components/features/AiAssistant";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <AiAssistant />
    </>
  );
}

