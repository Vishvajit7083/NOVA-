"use client";

import * as THREE from "three";
import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Product, GarmentCategory, BodyAdjustments, FitType } from "@/types/product";
import { GarmentLoader, GarmentLoaderService, GarmentAsset } from "@/services/GarmentLoaderService";

interface Garment3DProps {
  product: Product;
  adjustments: BodyAdjustments;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

export function Garment3D({ product, adjustments, onLoad, onError }: Garment3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const garmentRef = useRef<THREE.Mesh>(null);
  const [asset, setAsset] = useState<GarmentAsset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load garment asset when product changes
  useEffect(() => {
    const loadAsset = async () => {
      try {
        setLoading(true);
        const loader = new GarmentLoader([product]);
        const garment = await loader.loadGarment(product.id, product.category);
        setAsset(garment);
        setLoading(false);
        if (onLoad) onLoad();
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to load garment";
        setError(errorMsg);
        setLoading(false);
        if (onError) onError(errorMsg);
      }
    };

    loadAsset();
  }, [product.id, product.category, onLoad, onError]);

  // Create garment geometry based on category
  const garmentGeometry = useMemo(() => {
    const scale = adjustments.height;
    const fitMultiplier = product.fit.includes("slim") ? 0.95 : product.fit.includes("relaxed") ? 1.1 : 1.0;

    if (!asset) return null;

    switch (product.category) {
      case "top":
        // Create shirt/t-shirt geometry
        const torsoHeight = 0.5 * scale * adjustments.torsoProportion;
        const chestRadius = 0.16 * adjustments.chest * scale * fitMultiplier;
        const shoulderWidth = 0.42 * adjustments.shoulderWidth * scale * fitMultiplier;
        const waistRadius = 0.14 * adjustments.waist * scale * fitMultiplier;

        // T-shirt body (cylinder with tapered waist)
        const shirtGeom = new THREE.CylinderGeometry(
          chestRadius,
          waistRadius,
          torsoHeight,
          24,
          4
        );
        // Add sleeve geometry
        return shirtGeom;

      case "bottom":
        // Create trousers/jeans geometry
        const legLength = 0.9 * scale * adjustments.legProportion;
        const hipWidth = 0.36 * scale * fitMultiplier;
        const waistR = 0.14 * adjustments.waist * scale * fitMultiplier;

        // Trousers body (cylinder with hip)
        const trouserGeom = new THREE.CylinderGeometry(
          waistR,
          hipWidth / 2,
          legLength,
          24,
          4
        );
        return trouserGeom;

      case "outerwear":
        // Create jacket/coat geometry (longer than top)
        const coatLength = 0.7 * scale * adjustments.torsoProportion;
        const chestR = 0.18 * adjustments.chest * scale * fitMultiplier;
        const shoulderW = 0.45 * adjustments.shoulderWidth * scale * fitMultiplier;

        const coatGeom = new THREE.CylinderGeometry(
          chestR,
          chestR * 0.9,
          coatLength,
          24,
          4
        );
        return coatGeom;

      case "shoes":
        // Create shoe geometry
        const shoeLength = 0.3 * scale;
        const shoeWidth = 0.12 * scale;
        const shoeHeight = 0.08 * scale;

        const shoeGeom = new THREE.BoxGeometry(shoeWidth, shoeHeight, shoeLength);
        return shoeGeom;

      default:
        return null;
    }
  }, [asset, product.category, adjustments, product.fit]);

  // Create realistic PBR material based on garment type and color
  const garmentMaterial = useMemo(() => {
    if (!asset) return null;

    const colorMap: Record<string, string> = {
      "Classic White": "#f5f5f0",
      "Jet Black": "#1a1a1a",
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

    const materialColor = colorMap[product.colors[0]] || "#888888";
    const baseColor = new THREE.Color(materialColor);

    // Different material properties for different fabric types
    if (product.category === "outerwear" && product.name.includes("Leather")) {
      return new THREE.MeshPhysicalMaterial({
        color: baseColor,
        roughness: 0.4,
        metalness: 0.1,
        clearcoat: 0.5,
        clearcoatRoughness: 0.3,
        sheen: 0.2,
      });
    } else if (product.category === "shoes" && product.name.includes("Leather")) {
      return new THREE.MeshPhysicalMaterial({
        color: baseColor,
        roughness: 0.3,
        metalness: 0.05,
        clearcoat: 0.4,
        clearcoatRoughness: 0.2,
      });
    } else {
      // Default fabric material
      return new THREE.MeshPhysicalMaterial({
        color: baseColor,
        roughness: asset.materialInfo?.roughness || 0.7,
        metalness: asset.materialInfo?.metalness || 0.0,
        sheen: 0.3,
        sheenRoughness: 0.6,
        sheenColor: new THREE.Color(materialColor).multiplyScalar(1.2),
      });
    }
  }, [asset, product.colors, product.category, product.name]);

  // Position garment based on category
  const garmentPosition = useMemo(() => {
    const scale = adjustments.height;
    switch (product.category) {
      case "top":
        return [0, 0, 0] as [number, number, number];
      case "bottom":
        return [0, -0.3 * scale, 0] as [number, number, number];
      case "outerwear":
        return [0, 0, 0] as [number, number, number];
      case "shoes":
        return [0, -1.0 * scale, 0] as [number, number, number];
      default:
        return [0, 0, 0] as [number, number, number];
    }
  }, [product.category, adjustments.height]);

  // Smooth swap animation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  if (loading) {
    return null;
  }

  if (error) {
    return null;
  }

  if (!garmentGeometry || !garmentMaterial) {
    return null;
  }

  return (
    <group ref={groupRef} position={garmentPosition}>
      <mesh
        ref={garmentRef}
        geometry={garmentGeometry}
        material={garmentMaterial}
        castShadow
        receiveShadow
      />
    </group>
  );
}

// Helper hook to use state
import { useState } from "react";
