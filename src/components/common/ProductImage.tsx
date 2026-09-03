import React, { useState } from 'react';
import { ShoppingBag, Image as ImageIcon } from 'lucide-react';
import { Product } from '../../types';

/**
 * Verified product image resolver.
 * Ensures:
 * 1. Primary and hover/secondary images ALWAYS belong strictly to the same product record.
 * 2. If only one image exists, hover uses the exact same image (or smooth subtle zoom) rather than another product or random fallback.
 * 3. Never loads an unrelated fallback from another product or generic category.
 * 4. Strips out invalid, empty, or broken URLs.
 */
export function getProductDisplayImages(product: Product | undefined | null): {
  primaryImage: string;
  secondaryImage: string;
  hasSecondary: boolean;
  allImages: string[];
} {
  if (!product) {
    return {
      primaryImage: '',
      secondaryImage: '',
      hasSecondary: false,
      allImages: [],
    };
  }

  // Collect verified image candidates strictly from this product record
  const candidateImages: string[] = [];

  if (Array.isArray(product.images) && product.images.length > 0) {
    product.images.forEach((img) => {
      if (typeof img === 'string' && img.trim().length > 0 && !candidateImages.includes(img.trim())) {
        candidateImages.push(img.trim());
      }
    });
  }

  // If no images array, check single image property if present
  if (candidateImages.length === 0 && (product as any).image && typeof (product as any).image === 'string') {
    candidateImages.push((product as any).image.trim());
  }

  // If still empty, check color variant images strictly from this product
  if (candidateImages.length === 0 && Array.isArray(product.colors)) {
    product.colors.forEach((c) => {
      if (c && typeof c.image === 'string' && c.image.trim().length > 0 && !candidateImages.includes(c.image.trim())) {
        candidateImages.push(c.image.trim());
      }
    });
  }

  const primaryImage = candidateImages.length > 0 ? candidateImages[0] : '';
  
  // Secondary / hover image must be the second image of THIS SAME PRODUCT, or match primary
  let secondaryImage = primaryImage;
  let hasSecondary = false;

  if (candidateImages.length > 1) {
    secondaryImage = candidateImages[1];
    hasSecondary = true;
  } else if (
    product.hoverImage &&
    typeof product.hoverImage === 'string' &&
    product.hoverImage.trim().length > 0 &&
    candidateImages.includes(product.hoverImage.trim()) &&
    product.hoverImage.trim() !== primaryImage
  ) {
    secondaryImage = product.hoverImage.trim();
    hasSecondary = true;
  }

  return {
    primaryImage,
    secondaryImage,
    hasSecondary,
    allImages: candidateImages,
  };
}

interface ProductImagePlaceholderProps {
  productName?: string;
  category?: string;
  className?: string;
}

export const ProductImagePlaceholder: React.FC<ProductImagePlaceholderProps> = ({
  productName,
  category,
  className = '',
}) => {
  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center bg-[#151515] border border-[#262626] p-4 text-center select-none ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-[#1C1C1C] border border-[#333333] flex items-center justify-center text-[#C5A880] mb-2.5 shadow-inner">
        <ShoppingBag className="w-5 h-5 opacity-80" />
      </div>
      <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A880] font-bold">
        SINDHUDURG GARMENTS
      </span>
      <p className="text-[11px] font-serif text-[#E0DCD3] mt-1 font-semibold line-clamp-1 max-w-[90%]">
        {productName || 'Handcrafted Garment'}
      </p>
      <span className="text-[9px] text-[#888888] uppercase tracking-wider mt-1 px-2 py-0.5 rounded bg-[#1f1f1f] border border-[#2a2a2a]">
        Image coming soon
      </span>
    </div>
  );
};

interface ProductImageProps {
  product: Product;
  isHovered?: boolean;
  selectedImageUrl?: string;
  alt?: string;
  className?: string;
  aspectRatio?: string;
  priority?: boolean;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  product,
  isHovered = false,
  selectedImageUrl,
  alt,
  className = '',
  aspectRatio = 'aspect-[3/4]',
  priority = false,
}) => {
  const [hasPrimaryError, setHasPrimaryError] = useState(false);
  const [hasSecondaryError, setHasSecondaryError] = useState(false);

  const { primaryImage, secondaryImage, hasSecondary } = getProductDisplayImages(product);

  // If a specific color or angle is selected, use it as primary
  const activePrimary = (selectedImageUrl && selectedImageUrl.trim().length > 0) ? selectedImageUrl : primaryImage;

  if (!activePrimary || hasPrimaryError) {
    return (
      <div className={`relative w-full ${aspectRatio} overflow-hidden ${className}`}>
        <ProductImagePlaceholder productName={product.name} category={product.category} />
      </div>
    );
  }

  const effectiveAlt = alt || `${product.name} | SINDHUDURG GARMENTS`;

  return (
    <div className={`relative w-full ${aspectRatio} bg-[#161616] overflow-hidden flex items-center justify-center ${className}`}>
      {/* Primary Verified Image */}
      <img
        src={activePrimary}
        alt={effectiveAlt}
        loading={priority ? 'eager' : 'lazy'}
        referrerPolicy="no-referrer"
        onError={() => setHasPrimaryError(true)}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ease-out ${
          hasSecondary && isHovered && !hasSecondaryError
            ? 'opacity-0 scale-105'
            : 'opacity-100 group-hover:scale-105'
        }`}
      />

      {/* Secondary / Angle Image strictly from same product */}
      {hasSecondary && !hasSecondaryError && secondaryImage !== activePrimary && (
        <img
          src={secondaryImage}
          alt={`${effectiveAlt} - Detail View`}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setHasSecondaryError(true)}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ease-out ${
            isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
          }`}
        />
      )}
    </div>
  );
};
