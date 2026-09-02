"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { Product, Gender, GarmentCategory, BodyAdjustments, BackgroundType } from "@/types/product";

interface FittingRoomContextValue {
  isOpen: boolean;
  selectedGender: Gender;
  selectedProduct: Product | null;
  outfit: Record<GarmentCategory, Product | null>;
  bodyAdjustments: BodyAdjustments;
  background: BackgroundType;
  pose: "standing" | "relaxed" | "casual";
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
  openFittingRoom: (product?: Product) => void;
  closeFittingRoom: () => void;
  setGender: (gender: Gender) => void;
  selectProduct: (product: Product) => void;
  addToOutfit: (product: Product) => void;
  removeFromOutfit: (category: GarmentCategory) => void;
  updateBodyAdjustments: (adjustments: Partial<BodyAdjustments>) => void;
  setBackground: (background: BackgroundType) => void;
  setPose: (pose: "standing" | "relaxed" | "casual") => void;
  setLoading: (loading: boolean, message?: string) => void;
  setError: (error: string | null) => void;
}

const defaultAdjustments: BodyAdjustments = {
  height: 1.0,
  shoulderWidth: 1.0,
  torsoProportion: 1.0,
  waist: 1.0,
  chest: 1.0,
  legProportion: 1.0,
};

const FittingRoomContext = createContext<FittingRoomContextValue | null>(null);

export function FittingRoomProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState<Gender>("female");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [outfit, setOutfit] = useState<Record<GarmentCategory, Product | null>>({
    top: null,
    bottom: null,
    outerwear: null,
    shoes: null,
    accessory: null,
  });
  const [bodyAdjustments, setBodyAdjustments] = useState<BodyAdjustments>(defaultAdjustments);
  const [background, setBackground] = useState<BackgroundType>("charcoal");
  const [pose, setPose] = useState<"standing" | "relaxed" | "casual">("standing");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const openFittingRoom = useCallback((product?: Product) => {
    if (product) {
      setSelectedProduct(product);
      setOutfit((prev) => ({ ...prev, [product.category]: product }));
    }
    setIsOpen(true);
  }, []);

  const closeFittingRoom = useCallback(() => {
    setIsOpen(false);
    setError(null);
  }, []);

  const selectProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const addToOutfit = useCallback((product: Product) => {
    setOutfit((prev) => ({ ...prev, [product.category]: product }));
    setSelectedProduct(product);
  }, []);

  const removeFromOutfit = useCallback((category: GarmentCategory) => {
    setOutfit((prev) => ({ ...prev, [category]: null }));
  }, []);

  const updateBodyAdjustments = useCallback((adjustments: Partial<BodyAdjustments>) => {
    setBodyAdjustments((prev) => ({ ...prev, ...adjustments }));
  }, []);

  const handleSetLoading = useCallback((loading: boolean, message: string = "") => {
    setIsLoading(loading);
    setLoadingMessage(message);
  }, []);

  return (
    <FittingRoomContext.Provider
      value={{
        isOpen,
        selectedGender,
        selectedProduct,
        outfit,
        bodyAdjustments,
        background,
        pose,
        isLoading,
        loadingMessage,
        error,
        openFittingRoom,
        closeFittingRoom,
        setGender: setSelectedGender,
        selectProduct,
        addToOutfit,
        removeFromOutfit,
        updateBodyAdjustments,
        setBackground,
        setPose,
        setLoading: handleSetLoading,
        setError,
      }}
    >
      {children}
    </FittingRoomContext.Provider>
  );
}

export function useFittingRoom() {
  const context = useContext(FittingRoomContext);
  if (!context) {
    throw new Error("useFittingRoom must be used within a FittingRoomProvider");
  }
  return context;
}
