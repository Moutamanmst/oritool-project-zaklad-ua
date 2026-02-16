"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Sparkles,
  Loader2,
  ChefHat,
  Monitor,
  Truck,
  Coffee,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MainLayout } from "@/components/layout/MainLayout";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const suggestedQuestions = [
  "Що таке Goovii?",
  "Як відкрити кафе?",
  "Що таке штучний інтелект?",
  "Поради для бізнесу",
  "Як вивчити програмування?",
  "Цікаві факти про Україну",
];

export default function AIHelperPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Привіт! 👋 Я **Zaklad AI** — ваш розумний помічник, powered by GPT-4.

Запитуйте **абсолютно будь-що** — я відповім на все!

**Мої теми:**
💡 Технології та програмування
💼 Бізнес та фінанси
🍽️ Ресторани та кулінарія
📚 Освіта та наука
🏥 Здоров'я та спорт
🎮 Розваги та хобі
🌍 І взагалі все!

Оберіть питання нижче або напишіть своє!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare history for context
      const history = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          history,
        }),
      });

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "Вибачте, сталася помилка. Спробуйте ще раз.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Вибачте, сталася помилка з'єднання. Спробуйте ще раз.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              На головну
            </Link>

            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-2">
                  Zaklad AI
                  <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full">
                    GPT-4
                  </span>
                </h1>
                <p className="text-zinc-400">
                  Універсальний помічник • Відповідає на все
                </p>
              </div>
            </div>
          </div>

          {/* Chat Container */}
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden">
            {/* Messages */}
            <div className="h-[500px] overflow-y-auto p-6 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-5 py-4 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                        : "bg-zinc-800 text-zinc-100"
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 rounded-2xl px-5 py-4 flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="h-2 w-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="h-2 w-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-zinc-400">Zaklad AI думає...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/50">
              <p className="text-xs text-zinc-500 mb-3">Популярні питання:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 transition-colors disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-6 border-t border-zinc-800">
              <div className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Напишіть ваше питання про ресторанний бізнес..."
                  className="flex-1 h-12 text-base"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => handleSend()}
                  size="lg"
                  className="h-12 px-6 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 text-center">
              <Monitor className="h-6 w-6 text-amber-500 mx-auto mb-2" />
              <p className="text-sm text-zinc-400">POS-системи</p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 text-center">
              <ChefHat className="h-6 w-6 text-amber-500 mx-auto mb-2" />
              <p className="text-sm text-zinc-400">Меню та рецепти</p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 text-center">
              <Truck className="h-6 w-6 text-amber-500 mx-auto mb-2" />
              <p className="text-sm text-zinc-400">Постачальники</p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 text-center">
              <Coffee className="h-6 w-6 text-amber-500 mx-auto mb-2" />
              <p className="text-sm text-zinc-400">Обладнання</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
