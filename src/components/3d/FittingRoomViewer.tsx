"use client";

import * as THREE from "three";
import { useMemo, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { FittingRoomContext, useFittingRoom } from "@/contexts/FittingRoomContext";
import { HumanModel } from "@/components/3d/HumanModel";
import { Garment3D } from "@/components/3d/Garment3D";
import { Product, Gender, GarmentCategory, BodyAdjustments, Product3DAsset } from "@/types/product";
import { GarmentLoaderService } from "@/services/GarmentLoaderService";

interface FittingRoomViewerProps {
  products: Product[];
  onClose?: () => void;
}

export function FittingRoomViewer({ products, onClose }: FittingRoomViewerProps) {
  const {
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
    setGender,
    selectProduct,
    addToOutfit,
    removeFromOutfit,
    updateBodyAdjustments,
    setBackground,
    setPose,
    setLoading,
    setError,
  } = useFittingRoom();

  // Initialize garment loader service
  const garmentLoaderService = useMemo(() => new GarmentLoaderService(products), [products]);

  // Load garment for selected product
  useEffect(() => {
    if (!selectedProduct) return;
    setLoading(true);
    const loadGarment = async () => {
      try {
        const garment = await garmentLoaderService.loadGarment(selectedProduct.id, selectedProduct.category);
        setError(null);
      } catch (err) {
        setError("Failed to load garment asset");
      } finally {
        setLoading(false);
      }
    };
    loadGarment();
  }, [selectedProduct, garmentLoaderService, setLoading, setError]);

  // Handle closing with escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeFittingRoom();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeFittingRoom]);

  if (!isOpen) {
    return null;
  }

  // Garment assets for outfit composition
  const garmentAssets = useMemo(() => {
    return outfit.reduce((acc, product, category) => {
      if (product && product.asset3D) {
        acc[category] = product.asset3D;
      }
      return acc;
    }, {} as Record<GarmentCategory, Product3DAsset>);
  }, [outfit]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      aria-hidden={true}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-950 rounded-xl shadow-2xl shadow-black/30 overflow-hidden border border-zinc-800/50"
      >
        {/* Close button */}
        <button
          onClick={closeFittingRoom}
          className="absolute top-4 left-4 text-zinc-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-2"
          aria-label="Close fitting room"
        >
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Three.js Canvas */}
        <Canvas
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={{ position: [0, 1.5, 3], fov: 45 }}
          onCreated={(state) => {
            state.gl.setPixelRatio(window.devicePixelRatio);
          }}
          style={{
            width: "100%",
            height: "500px",
            minHeight: "500px",
          }}
        >
          {/* Studio environment - background adaptation */}
          <ambientLight
            intensity={0.7}
            color={background === "black" ? 0xffffff : background === "white" ? 0x111111 : background === "charcoal" ? 0x888888 : 0xffffff}
          />
          <directionalLight
            position={[5, 10, 7]}
            intensity={0.8}
            color={background === "black" ? 0xffffff : background === "white" ? 0x222222 : background === "charcoal" ? 0x666666 : 0xffffff}
          />
          <directionalLight
            position={[-5, 10, 5]}
            intensity={0.6}
            color={background === "black" ? 0xffffff : background === "white" ? 0x222222 : background === "charcoal" ? 0x666666 : 0xffffff}
          />

          {/* Grid overlay when enabled */}
          {background !== "black" && background !== "transparent" && (
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -1.5, 0]}
              castShadow
            >
              <boxGeometry args={[50, 1, 50] } />
              <meshStandardMaterial
                color={background === "white" ? 0xe0e0e0 : background === "charcoal" ? 0x3a3a3a : 0xf0f0f0}
                opacity={0.08}
                transparent
              />
            </mesh>
          )}

          {/* 3D Human Model */}
          <HumanModel
            gender={selectedGender}
            adjustments={bodyAdjustments}
            onLoad={() => setLoading(false)}
          />

          {/* 3D Garment for selected product */}
          {selectedProduct && (
            <Garment3D
              product={selectedProduct}
              adjustments={bodyAdjustments}
              onLoad={() => setLoading(false)}
            />
          )}

          {/* Outfit rendering - all selected garments */}
          {Object.entries(outfit).map(([category, product]) => {
            if (!product) return null;
            return (
              <Garment3D
                key={category}
                product={product}
                adjustments={bodyAdjustments}
                onLoad={() => setLoading(false)}
              />
            );
          })}

          {/* Orbit controls - desktop only */}
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            enableDamping={true}
            dampingFactor={0.05}
            autoRotate={false}
            screenSpacePanning={false}
          />
        </Canvas>

        {/* Mobile overlay controls */}
        {isLoading && loadingMessage && (
          <div
            className="absolute top-20 left-1/2 -translate-x-1/2 text-zinc-300 text-sm font-medium"
          >
            {loadingMessage}
          </div>
        )}

        {/* Bottom control bar for mobile */}
        {window.innerWidth < 768 && (
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-md flex flex-col sm:flex-row gap-2 px-4 py-3 bg-zinc-800/80 backdrop-blur-sm rounded-2xl border border-zinc-700/50"
          >
            <div className="flex-1 text-center text-sm text-zinc-400">
              <svg className="w-4 h-4 mx-auto mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Model
            </div>
            <div className="flex-1 text-center text-sm text-zinc-400">
              <svg className="w-4 h-4 mx-auto mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <polyline points="8 6 12 12 16 6" />
              </svg>
              Rotate
            </div>
            <div className="flex-1 text-center text-sm text-zinc-400">
              <svg className="w-4 h-4 mx-auto mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              Zoom
            </div>
            <div className="flex-1 text-center text-sm text-zinc-400">
              <svg className="w-4 h-4 mx-auto mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
              </svg>
              Background
            </div>
          </div>
        )}

        {/* Selected product info sidebar (desktop) */}
        {window.innerWidth >= 768 && !isLoading && selectedProduct && (
          <div
            className="absolute right-0 top-0 bottom-4 w-80 bg-zinc-900 overflow-y-auto border-l border-zinc-800/50 h-full"
            style={{ maxHeight: "500px" }}
          >
            <div className="p-6 border-b border-zinc-800/30">
              <h2 className="text-lg font-medium text-zinc-100 mb-4">
                {selectedProduct.name}
              </h2>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <label className="block text-zinc-300 text-xs mb-1">Size</label>
                <select
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-zinc-100 focus:outline-none focus:border-zinc-300"
                >
                  {selectedProduct.sizes.map((size: string) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 text-xs mb-1">Color</label>
                <select
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-zinc-100 focus:outline-none focus:border-zinc-300"
                >
                  {selectedProduct.colors.map((color: string) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 text-xs mb-1">Fit</label>
                <select
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-zinc-100 focus:outline-none focus:border-zinc-300"
                >
                  {["slim", "regular", "relaxed"].map((fit: string) => (
                    <option key={fit} value={fit}>
                      {fit.charAt(0).toUpperCase() + fit.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 text-xs mb-1">Background</label>
                <select
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-zinc-100 focus:outline-none focus:border-zinc-300"
                >
                  <option value="charcoal">Charcoal Studio</option>
                  <option value="white">White Studio</option>
                  <option value="black">Black Studio</option>
                  <option value="warm-studio">Warm Studio</option>
                  <option value="cool-studio">Cool Studio</option>
                </select>
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-800/30">
                <button
                  onClick={closeFittingRoom}
                  className="w-full bg-zinc-600 text-zinc-100 px-4 py-2 rounded font-medium hover:bg-zinc-500 transition-colors"
                >
                  Close Fitting Room
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}