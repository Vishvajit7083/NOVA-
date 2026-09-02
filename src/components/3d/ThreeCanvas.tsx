"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { ReactNode, useRef, useEffect, useMemo } from "react";

interface ThreeCanvasProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function ThreeCanvas({ children, className = "", style = {} }: ThreeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cssRef = useRef<HTMLDivElement>(null);
  const labelRendererRef = useRef<CSS2DRenderer | null>(null);

  // Create CSS2D renderer for labels/tooltips
  useEffect(() => {
    if (cssRef.current) {
      labelRendererRef.current = new CSS2DRenderer();
      labelRendererRef.current.setSize(window.innerWidth, window.innerHeight);
      labelRendererRef.current.domElement.style.position = "absolute";
      labelRendererRef.current.domElement.style.top = "0";
      labelRendererRef.current.domElement.style.pointerEvents = "none";
      cssRef.current.appendChild(labelRendererRef.current.domElement);
    }

    return () => {
      if (labelRendererRef.current && cssRef.current) {
        cssRef.current.removeChild(labelRendererRef.current.domElement);
      }
    };
  }, []);

  // Resize handlers
  useEffect(() => {
    const handleResize = () => {
      if (labelRendererRef.current) {
        labelRendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onCreated = useCallback((state: any) => {
    state.gl.setPixelRatio(window.devicePixelRatio);
    state.gl.getContext().setClearColor(0x000000, 0);
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`} style={style} ref={cssRef}>
      <Canvas
        ref={canvasRef}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 1.5, 3], fov: 45 }}
        onCreated={onCreated}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 7]} intensity={0.8} castShadow />
        <spotLight position={[-5, 10, 5]} intensity={0.6} angle={0.3} penumbra={0.1} castShadow />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          rotateSpeed={0.8}
          zoomSpeed={0.8}
          panSpeed={0.8}
          dampingFactor={0.05}
          enableDamping={true}
          minDistance={1.5}
          maxDistance={10}
          minPolarAngle={Math.PI * 0.1}
          maxPolarAngle={Math.PI * 0.9}
        >
          <gridArgs args={[10, 10, 10, 10]} visible={false} />
        </OrbitControls>
        {children}
      </Canvas>
    </div>
  );
}