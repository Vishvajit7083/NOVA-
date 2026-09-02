export type Gender = "male" | "female" | "unisex";
export type GarmentCategory = "top" | "bottom" | "outerwear" | "shoes" | "accessory";
export type FitType = "slim" | "regular" | "relaxed";
export type BackgroundType = "black" | "charcoal" | "white" | "warm-studio" | "cool-studio" | "transparent";

export interface Product3DAsset {
  url: string;
  thumbnail?: string;
  category: GarmentCategory;
  compatibleGender: Gender[];
  availableColors: string[];
  availableSizes: string[];
  availableFits: FitType[];
  materialInfo?: {
    textureUrl?: string;
    normalMapUrl?: string;
    roughness?: number;
    metalness?: number;
  };
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency: string;
  images: string[];
  colors: string[];
  sizes: string[];
  fit: FitType[];
  gender: Gender[];
  category: GarmentCategory;
  description: string;
  inStock: boolean;
  sku: string;
  rating?: number;
  reviewCount?: number;
  asset3D?: Product3DAsset;
}

export interface OutfitSlot {
  category: GarmentCategory;
  product: Product | null;
}

export interface BodyAdjustments {
  height: number;
  shoulderWidth: number;
  torsoProportion: number;
  waist: number;
  chest: number;
  legProportion: number;
}

export interface FittingRoomState {
  isOpen: boolean;
  selectedGender: Gender;
  selectedProduct: Product | null;
  outfit: Record<GarmentCategory, Product | null>;
  bodyAdjustments: BodyAdjustments;
  background: BackgroundType;
  pose: "standing" | "relaxed" | "casual";
  showGrid: boolean;
}