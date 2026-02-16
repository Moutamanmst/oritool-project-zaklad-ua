"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  sublabel?: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Оберіть...",
  searchPlaceholder = "Пошук...",
  emptyMessage = "Нічого не знайдено",
  className,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0, width: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = React.useMemo(() => {
    if (!search) return options;
    const lowerSearch = search.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(lowerSearch) ||
        opt.sublabel?.toLowerCase().includes(lowerSearch)
    );
  }, [options, search]);

  // Update dropdown position
  const updatePosition = React.useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  }, []);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current && 
        !containerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on scroll (standard UX pattern)
  React.useEffect(() => {
    if (isOpen) {
      updatePosition();
      
      const handleScroll = (e: Event) => {
        // Don't close if scrolling inside the dropdown itself
        if (dropdownRef.current?.contains(e.target as Node)) {
          return;
        }
        setIsOpen(false);
        setSearch("");
      };
      
      const handleResize = () => {
        setIsOpen(false);
        setSearch("");
      };
      
      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [isOpen, updatePosition]);

  // Focus input when dropdown opens
  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
    setSearch("");
  };

  const handleToggle = () => {
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-100 ring-offset-background",
          "focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50",
          "hover:bg-zinc-800 transition-colors",
          !selectedOption && "text-zinc-400"
        )}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-zinc-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown - rendered via Portal */}
      {isOpen && typeof window !== "undefined" && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed z-[9999] rounded-xl border border-zinc-700 bg-zinc-900 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
          }}
        >
          {/* Search Input */}
          <div className="p-2 border-b border-zinc-700/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className={cn(
                  "w-full h-9 pl-9 pr-9 rounded-lg bg-zinc-800/80 border border-zinc-700 text-sm text-zinc-100",
                  "placeholder:text-zinc-500",
                  "focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50",
                  "transition-colors"
                )}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-[240px] overflow-y-auto scroll-smooth p-1">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-zinc-500">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "relative flex w-full items-center gap-3 rounded-lg py-2.5 pl-9 pr-3 text-sm outline-none",
                    "text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer",
                    value === option.value && "bg-amber-500/20 text-amber-100"
                  )}
                >
                  {/* Checkmark */}
                  <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
                    {value === option.value && (
                      <Check className="h-4 w-4 text-amber-500" />
                    )}
                  </span>

                  {/* Label */}
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{option.label}</span>
                    {option.sublabel && (
                      <span className="text-xs text-zinc-500">{option.sublabel}</span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
