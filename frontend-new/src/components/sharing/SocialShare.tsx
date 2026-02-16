"use client";

import { useState } from "react";
import {
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Check,
  Send,
  MessageCircle,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trackEvent } from "@/components/analytics/GoogleAnalytics";

interface SocialShareProps {
  url?: string;
  title: string;
  description?: string;
  image?: string;
  variant?: "default" | "minimal" | "expanded";
  className?: string;
}

export function SocialShare({
  url,
  title,
  description = "",
  image,
  variant = "default",
  className = "",
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  // Get current URL if not provided
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    viber: `viber://forward?text=${encodedTitle}%20${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    trackEvent("share", platform, title);
    window.open(shareLinks[platform], "_blank", "width=600,height=400,noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      trackEvent("share", "copy_link", title);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
        trackEvent("share", "native", title);
      } catch (err) {
        // User cancelled or error
      }
    }
  };

  // Minimal variant - just an icon button
  if (variant === "minimal") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className={`h-8 w-8 p-0 ${className}`}>
            <Share2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => handleShare("facebook")}>
            <Facebook className="h-4 w-4 mr-2 text-blue-500" />
            Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare("twitter")}>
            <Twitter className="h-4 w-4 mr-2 text-sky-500" />
            Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare("telegram")}>
            <Send className="h-4 w-4 mr-2 text-blue-400" />
            Telegram
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare("linkedin")}>
            <Linkedin className="h-4 w-4 mr-2 text-blue-600" />
            LinkedIn
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCopyLink}>
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2 text-emerald-500" />
                Скопійовано!
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4 mr-2" />
                Копіювати посилання
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Expanded variant - show all buttons in a row
  if (variant === "expanded") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-sm text-zinc-500 mr-2">Поділитися:</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare("facebook")}
          className="h-9 w-9 p-0 border-zinc-700 hover:bg-blue-500/10 hover:border-blue-500/50"
        >
          <Facebook className="h-4 w-4 text-blue-500" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare("twitter")}
          className="h-9 w-9 p-0 border-zinc-700 hover:bg-sky-500/10 hover:border-sky-500/50"
        >
          <Twitter className="h-4 w-4 text-sky-500" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare("telegram")}
          className="h-9 w-9 p-0 border-zinc-700 hover:bg-blue-400/10 hover:border-blue-400/50"
        >
          <Send className="h-4 w-4 text-blue-400" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare("linkedin")}
          className="h-9 w-9 p-0 border-zinc-700 hover:bg-blue-600/10 hover:border-blue-600/50"
        >
          <Linkedin className="h-4 w-4 text-blue-600" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare("whatsapp")}
          className="h-9 w-9 p-0 border-zinc-700 hover:bg-emerald-500/10 hover:border-emerald-500/50"
        >
          <MessageCircle className="h-4 w-4 text-emerald-500" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className={`h-9 px-3 border-zinc-700 ${copied ? "bg-emerald-500/10 border-emerald-500/50" : ""}`}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-1 text-emerald-500" />
              <span className="text-emerald-500">Скопійовано</span>
            </>
          ) : (
            <>
              <Link2 className="h-4 w-4 mr-1" />
              Копіювати
            </>
          )}
        </Button>
      </div>
    );
  }

  // Default variant - button with dropdown
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Native share on mobile */}
      {typeof navigator !== "undefined" && "share" in navigator && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleNativeShare}
          className="md:hidden border-zinc-700"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Поділитися
        </Button>
      )}

      {/* Desktop dropdown */}
      <div className="hidden md:flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare("facebook")}
          className="h-9 w-9 p-0 border-zinc-700 hover:bg-blue-500/10 hover:border-blue-500/50"
          title="Facebook"
        >
          <Facebook className="h-4 w-4 text-blue-500" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare("telegram")}
          className="h-9 w-9 p-0 border-zinc-700 hover:bg-blue-400/10 hover:border-blue-400/50"
          title="Telegram"
        >
          <Send className="h-4 w-4 text-blue-400" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className={`h-9 w-9 p-0 border-zinc-700 ${copied ? "bg-emerald-500/10 border-emerald-500/50" : ""}`}
          title={copied ? "Скопійовано!" : "Копіювати посилання"}
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : (
            <Link2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
