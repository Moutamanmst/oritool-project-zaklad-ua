"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { useLanguageStore } from "@/store/language";
import { api, endpoints } from "@/lib/api";

interface FooterContent {
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  socialFacebook: string;
  socialInstagram: string;
  socialTelegram: string;
  copyright: string;
}

const defaultFooter: FooterContent = {
  companyName: "ZakladUA",
  contactEmail: "info@zaklad.ua",
  contactPhone: "+380 44 123 45 67",
  socialFacebook: "",
  socialInstagram: "",
  socialTelegram: "",
  copyright: "© 2024 ZakladUA. Всі права захищено.",
};

export function Footer() {
  const { lang, setLang } = useLanguageStore();
  const [footer, setFooter] = useState<FooterContent>(defaultFooter);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadFooter() {
      try {
        const data = await api.get<FooterContent>(endpoints.siteContent.get("footer"));
        if (data) {
          setFooter({ ...defaultFooter, ...data });
          setLoaded(true);
          return;
        }
      } catch (e) {
        // API failed, try localStorage
      }
      
      // Fallback to localStorage
      const savedFooter = localStorage.getItem("zakladua-footer");
      if (savedFooter) {
        try {
          setFooter({ ...defaultFooter, ...JSON.parse(savedFooter) });
        } catch (e) {
          console.error("Failed to parse footer data:", e);
        }
      }
      setLoaded(true);
    }
    loadFooter();
  }, []);

  const toggleLang = () => {
    setLang(lang === "uk" ? "ru" : "uk");
  };

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center -ml-1">
              <img 
                src="/images/logo.png" 
                alt={footer.companyName} 
                className="h-12 w-12 object-contain"
              />
              <span className="text-xl font-bold -ml-1">
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Zaklad</span><span className="text-white">UA</span>
              </span>
            </Link>
            
            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors border border-zinc-700"
            >
              <Globe className="h-4 w-4" />
              <span>{lang === "uk" ? "Українська" : "Русский"}</span>
            </button>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-100 mb-4">
              Каталоги
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/establishments"
                  className="text-sm text-zinc-500 hover:text-amber-500 transition-colors"
                >
                  Заклади
                </Link>
              </li>
              <li>
                <Link
                  href="/pos-systems"
                  className="text-sm text-zinc-500 hover:text-amber-500 transition-colors"
                >
                  POS-системи
                </Link>
              </li>
              <li>
                <Link
                  href="/equipment"
                  className="text-sm text-zinc-500 hover:text-amber-500 transition-colors"
                >
                  Обладнання
                </Link>
              </li>
              <li>
                <Link
                  href="/suppliers"
                  className="text-sm text-zinc-500 hover:text-amber-500 transition-colors"
                >
                  Постачальники
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-zinc-500 hover:text-amber-500 transition-colors"
                >
                  Блог
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-100 mb-4">
              Для бізнесу
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/register?type=business"
                  className="text-sm text-zinc-500 hover:text-amber-500 transition-colors"
                >
                  Додати компанію
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-zinc-500 hover:text-amber-500 transition-colors"
                >
                  Тарифи
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-100 mb-4">
              Контакти
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-zinc-500">
                <Mail className="h-4 w-4 text-amber-500" />
                {footer.contactEmail}
              </li>
              <li className="flex items-center gap-2 text-sm text-zinc-500">
                <Phone className="h-4 w-4 text-amber-500" />
                {footer.contactPhone}
              </li>
              <li className="flex items-center gap-2 text-sm text-zinc-500">
                <MapPin className="h-4 w-4 text-amber-500" />
                Київ, Україна
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-600">
            {footer.copyright}
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Політика конфіденційності
            </Link>
            <Link
              href="/terms"
              className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Умови використання
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
