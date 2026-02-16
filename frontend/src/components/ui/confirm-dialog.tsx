"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Button } from "./button";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "default";
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions(opts);
      setIsOpen(true);
      setResolveRef(() => resolve);
    });
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    resolveRef?.(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolveRef?.(false);
  };

  const variantStyles = {
    danger: {
      icon: <Trash2 className="h-6 w-6 text-red-400" />,
      iconBg: "bg-red-500/20",
      confirmBtn: "bg-red-500 hover:bg-red-600 text-white",
    },
    warning: {
      icon: <AlertTriangle className="h-6 w-6 text-amber-400" />,
      iconBg: "bg-amber-500/20",
      confirmBtn: "bg-amber-500 hover:bg-amber-600 text-zinc-900",
    },
    default: {
      icon: <AlertTriangle className="h-6 w-6 text-zinc-400" />,
      iconBg: "bg-zinc-500/20",
      confirmBtn: "bg-zinc-600 hover:bg-zinc-500 text-white",
    },
  };

  const variant = options?.variant || "danger";
  const styles = variantStyles[variant];

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={handleCancel}
          />
          
          {/* Dialog */}
          <div className="relative z-10 w-full max-w-md mx-4 animate-in zoom-in-95 fade-in duration-200">
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${styles.iconBg}`}>
                    {styles.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-zinc-100">
                      {options?.title || "Підтвердження"}
                    </h3>
                    <p className="mt-2 text-zinc-400">
                      {options?.message}
                    </p>
                  </div>
                  <button
                    onClick={handleCancel}
                    className="text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {/* Actions */}
              <div className="px-6 py-4 bg-zinc-800/50 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="border-zinc-600 hover:bg-zinc-700"
                >
                  {options?.cancelText || "Скасувати"}
                </Button>
                <Button
                  onClick={handleConfirm}
                  className={styles.confirmBtn}
                >
                  {options?.confirmText || "Підтвердити"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
