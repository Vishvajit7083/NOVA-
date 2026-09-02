import { Product, GarmentCategory } from "@/types/product";

export interface GarmentAsset {
  url: string;
  category: GarmentCategory;
  compatibleGenders: string[];
  availableColors: string[];
  availableSizes: string[];
  materialInfo?: {
    textureUrl?: string;
    normalMapUrl?: string;
    roughness?: number;
    metalness?: number;
  };
}

export class GarmentLoader {
  private products: Product[];

  constructor(products: Product[]) {
    this.products = products;
  }

  async loadGarment(productId: string, category: GarmentCategory): Promise<GarmentAsset> {
    // Simulate loading a 3D garment asset
    // In reality, this would fetch from the product database
    const garment = this.getGarmentForProduct(productId, category);
    if (!garment) {
      throw new Error(`No 3D garment found for product ${productId}`);
    }
    return garment;
  }

  getGarmentForProduct(productId: string, category: GarmentCategory): GarmentAsset | null {
    // In a real implementation, this would scan the product database for 3D garment assets
    // For now, we'll simulate with mock data
    const mockAssets: Record<string, GarmentAsset> = {
      "top-1": {
        url: "/assets/garments/top-1.glb",
        category: "top",
        compatibleGenders: ["male", "female"],
        availableColors: ["Classic White", "Jet Black", "Navy Blue", "Crimson Red"],
        availableSizes: ["XS", "S", "M", "L", "XL"],
        materialInfo: {
          textureUrl: "/textures/top-1_diffuse.png",
          normalMapUrl: "/textures/top-1_normal.png",
          roughness: 0.7,
          metalness: 0.0,
        },
      },
      "bottom-1": {
        url: "/assets/garments/bottom-1.glb",
        category: "bottom",
        compatibleGenders: ["male", "female"],
        availableColors: ["Charcoal", "Navy", "Beige"],
        availableSizes: ["S", "M", "L", "XL"],
        materialInfo: {
          textureUrl: "/textures/bottom-1_diffuse.png",
          normalMapUrl: "/textures/bottom-1_normal.png",
          roughness: 0.6,
          metalness: 0.0,
        },
      },
      "outerwear-2": {
        url: "/assets/garments/outerwear-2.glb",
        category: "outerwear",
        compatibleGenders: ["male", "female"],
        availableColors: ["Black", "Cognac Brown"],
        availableSizes: ["S", "M", "L", "XL"],
        materialInfo: {
          textureUrl: "/textures/outerwear-2_diffuse.png",
          normalMapUrl: "/textures/outerwear-2_normal.png",
          roughness: 0.5,
          metalness: 0.0,
        },
      },
      "shoes-3": {
        url: "/assets/garments/shoes-3.glb",
        category: "shoes",
        compatibleGenders: ["male", "female"],
        availableColors: ["Black", "White", "Tan"],
        availableSizes: ["7", "8", "9", "10", "11", "12"],
        materialInfo: {
          textureUrl: "/textures/shoes-3_diffuse.png",
          normalMapUrl: "/textures/shoes-3_normal.png",
          roughness: 0.4,
          metalness: 0.0,
        },
      },
    };

    return mockAssets[`${category}-${productId}`] || null;
  }
}

export class GarmentLoaderService {
  private loader: GarmentLoader;

  constructor(products: Product[]) {
    this.loader = new GarmentLoader(products);
  }

  async loadGarment(productId: string, category: GarmentCategory): Promise<GarmentAsset> {
    try {
      const garment = await this.loader.loadGarment(productId, category);
      return garment;
    } catch (error) {
      console.error(`Failed to load garment for product ${productId}:`, error);
      throw error;
    }
  }

  getGarmentForProduct(productId: string, category: GarmentCategory): GarmentAsset | null {
    return this.loader.getGarmentForProduct(productId, category);
  }

  getAllGarmentsForProduct(product: Product): {
    top: GarmentAsset | null;
    bottom: GarmentAsset | null;
    outerwear: GarmentAsset | null;
    shoes: GarmentAsset | null;
  } {
    return {
      top: this.loader.getGarmentForProduct(product.id, "top"),
      bottom: this.loader.getGarmentForProduct(product.id, "bottom"),
      outerwear: this.loader.getGarmentForProduct(product.id, "outerwear"),
      shoes: this.loader.getGarmentForProduct(product.id, "shoes"),
    };
  }
}