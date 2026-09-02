"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { useFittingRoom } from "@/contexts/FittingRoomContext";
import { cn } from "@/lib/utils";

interface AITryOnButtonProps {
  product: Product;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function AITryOnButton({ product, className, size = "md" }: AITryOnButtonProps) {
  const { openFittingRoom, isOpen } = useFittingRoom();
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      onClick={() => openFittingRoom(product)}
      disabled={isOpen}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative flex items-center gap-2 font-medium transition-all duration-200",
        "bg-gradient-to-r from-zinc-900 to-zinc-800 text-zinc-100",
        "border border-zinc-700/50 hover:border-zinc-500/50",
        "shadow-md hover:shadow-lg hover:shadow-zinc-900/20",
        "focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-2 focus:ring-offset-zinc-950",
        sizeClasses[size],
        isHovered && "scale-[1.02]",
        isOpen && "opacity-50 cursor-not-allowed",
        className
      )}
      aria-label={`Try ${product.name} on virtual model`}
    >
      {/* AI icon */}
      <svg
        className={cn(
          "w-4 h-4 transition-transform duration-200",
          isHovered && "scale-110"
        )}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path d="M9 9l6 6M15 9l-6 6" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <span>AI Try-On</span>
      {isHovered && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded whitespace-nowrap opacity-0 animate-fade-in">
          Virtual Fitting
        </span>
      )}
    </button>
  );
}
