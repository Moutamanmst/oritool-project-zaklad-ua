"use client";

import * as React from "react";

interface SliderProps {
  value?: number[];
  defaultValue?: number[];
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number[]) => void;
  className?: string;
  disabled?: boolean;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      value,
      defaultValue = [0],
      min = 0,
      max = 100,
      step = 1,
      onValueChange,
      className = "",
      disabled = false,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const currentValue = value ?? internalValue;
    const sliderRef = React.useRef<HTMLDivElement>(null);

    const percentage = ((currentValue[0] - min) / (max - min)) * 100;

    const updateValue = (clientX: number) => {
      if (disabled || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percent = Math.max(0, Math.min(1, x / rect.width));
      const rawValue = min + percent * (max - min);
      const steppedValue = Math.round(rawValue / step) * step;
      const clampedValue = Math.max(min, Math.min(max, steppedValue));

      const newValue = [clampedValue];
      if (!value) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      updateValue(e.clientX);

      const handleMouseMove = (e: MouseEvent) => {
        updateValue(e.clientX);
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
      updateValue(e.touches[0].clientX);

      const handleTouchMove = (e: TouchEvent) => {
        updateValue(e.touches[0].clientX);
      };

      const handleTouchEnd = () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };

      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    };

    return (
      <div
        ref={ref}
        className={`relative flex w-full touch-none select-none items-center ${className}`}
      >
        <div
          ref={sliderRef}
          className={`relative h-2 w-full grow overflow-hidden rounded-full bg-zinc-800 cursor-pointer ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div
            className="absolute h-full bg-amber-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div
          className={`absolute h-5 w-5 rounded-full border-2 border-amber-500 bg-zinc-900 shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
            disabled ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing"
          }`}
          style={{ left: `calc(${percentage}% - 10px)` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        />
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider };
