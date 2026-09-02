"use client";

import { Product } from "@/types/product";
import { AITryOnButton } from "./AITryOnButton";
import { cn } from "@/lib/utils";
import { Star, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  className?: string;
}

export function ProductCard({ product, onAddToCart, className }: ProductCardProps) {
  return (
    <div
      className={cn(
        "group relative bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800/50",
        "transition-all duration-300 hover:border-zinc-700/50 hover:shadow-xl hover:shadow-black/20",
        "focus-within:ring-2 focus-within:ring-zinc-300 focus-within:ring-offset-2 focus-within:ring-offset-zinc-950",
        className
      )}
    >
      {/* Product image placeholder */}
      <div className="relative aspect-[3/4] bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden">
        {/* Placeholder gradient representing product */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900"
        />
        {/* Product image would go here */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-zinc-600 text-lg font-medium">
            {product.category.toUpperCase()}
          </span>
        </div>

        {/* Hover overlay */}
        <div
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3"
        >
          <AITryOnButton product={product} size="lg" />
        </div>

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-zinc-800/80 backdrop-blur-sm text-zinc-300 text-xs font-medium rounded">
            {product.category}
          </span>
        </div>

        {/* 3D available indicator */}
        {product.asset3D && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-zinc-700/80 backdrop-blur-sm text-zinc-200 text-xs font-medium rounded flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
              3D
            </span>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="p-4 space-y-2">
        <h3 className="text-zinc-100 font-medium text-sm line-clamp-1">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-zinc-400 fill-zinc-400" />
            <span className="text-zinc-400 text-xs">
              {product.rating.toFixed(1)}
            </span>
            {product.reviewCount && (
              <span className="text-zinc-600 text-xs">
                ({product.reviewCount})
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-zinc-100 font-semibold">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-zinc-500 line-through text-sm">
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* Colors available */}
        <div className="flex items-center gap-2 pt-1">
          {product.colors.slice(0, 4).map((color, index) => (
            <div
              key={color}
              className="w-4 h-4 rounded-full border border-zinc-700"
              style={{
                backgroundColor: getColorHex(color),
              }}
              title={color}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-zinc-500 text-xs">
              +{product.colors.length - 4}
            </span>
          )}
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => onAddToCart?.(product)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>

        {/* AI Try-On button (always visible) */}
        <AITryOnButton product={product} size="sm" className="w-full mt-2" />
      </div>
    </div>
  );
}

function getColorHex(colorName: string): string {
  const colorMap: Record<string, string> = {
    "Classic White": "#f5f5f0",
    "Jet Black": "#1a1a1a",
    "Midnight Black": "#0a0a0a",
    "Navy Blue": "#1a2a3a",
    "Crimson Red": "#a01828",
    "Charcoal": "#3a3a3a",
    "Black": "#1a1a1a",
    "Cognac Brown": "#8b4513",
    "Burgundy": "#800020",
    "Mid Blue": "#2a4a6a",
    "Light Wash": "#8aa0b8",
    "Dark Blue": "#1a3a5a",
    "Navy": "#1a2a3a",
    "Beige": "#d4c8a8",
    "White": "#f5f5f0",
    "Tan": "#c8a878",
    "Sage Green": "#8a9a7a",
    "Oyster White": "#e8e8e0",
    "Camel": "#c8a878",
  };
  return colorMap[colorName] || "#888888";
}
