import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Sparkles, Volume2, VolumeX, ChevronRight } from 'lucide-react';

interface LuxuryClothIntroProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

// Procedural synthesized silk rustle audio using Web Audio API (zero external assets needed)
class SilkSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;

  init() {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    } catch {
      this.ctx = null;
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!muted && this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playSilkGlide(duration = 2.0) {
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Velvet / silk textile acoustic modeling with pink noise
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + white * 0.5362) * 0.038;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(340, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(760, this.ctx.currentTime + duration * 0.65);
      filter.Q.setValueAtTime(2.2, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.075, this.ctx.currentTime + duration * 0.25);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noiseSource.start();
      noiseSource.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  destroy() {
    if (this.ctx) {
      try {
        this.ctx.close().catch(() => {});
      } catch {}
      this.ctx = null;
    }
  }
}

export const LuxuryClothIntro: React.FC<LuxuryClothIntroProps> = ({
  onComplete,
  forceShow = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [replayKey, setReplayKey] = useState(0);

  const [isVisible, setIsVisible] = useState(() => {
    if (forceShow) return true;
    return true;
  });

  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const [brandOpacity, setBrandOpacity] = useState(1);
  const [brandScale, setBrandScale] = useState(1);
  const [backlightGlow, setBacklightGlow] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(true);

  const soundEngineRef = useRef<SilkSoundEngine | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const hasFinishedRef = useRef(false);

  const handleFinish = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;

    setBrandOpacity(0);
    setOverlayOpacity(0);

    // Notify listeners that cloth stage is complete so Stage 2 seamlessly takes over
    try {
      window.dispatchEvent(new CustomEvent('sindhura:cloth-complete'));
      window.dispatchEvent(new CustomEvent('aurelia:cloth-complete'));
    } catch {}

    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 450);
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;

    try {
      window.dispatchEvent(new CustomEvent('sindhudurg:skip-trailer'));
      window.dispatchEvent(new CustomEvent('sindhura:skip-trailer'));
      window.dispatchEvent(new CustomEvent('aurelia:skip-trailer'));
    } catch {}

    setBrandOpacity(0);
    setOverlayOpacity(0);

    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 250);
  }, [onComplete]);

  // Audio setup
  useEffect(() => {
    soundEngineRef.current = new SilkSoundEngine();
    soundEngineRef.current.init();

    return () => {
      if (soundEngineRef.current) {
        soundEngineRef.current.destroy();
      }
    };
  }, []);

  const toggleSound = () => {
    if (!soundEngineRef.current) return;
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    soundEngineRef.current.setMuted(nextMuted);
  };

  // Replay event listener across the app (e.g. from footer)
  useEffect(() => {
    const handleReplay = () => {
      hasFinishedRef.current = false;
      setOverlayOpacity(1);
      setBrandOpacity(1);
      setBrandScale(1);
      setBacklightGlow(0);
      setIsVisible(true);
      setReplayKey((prev) => prev + 1);
    };

    window.addEventListener('aurelia:replay-intro', handleReplay);
    return () => {
      window.removeEventListener('aurelia:replay-intro', handleReplay);
    };
  }, []);

  // WebGL Cinematic Fabric & Film Flare Simulation
  useEffect(() => {
    if (!isVisible) return;

    // Respect prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches && !forceShow) {
      handleFinish();
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Failsafe timer: ensures user is never trapped if WebGL encounters issues
    const failsafeTimer = setTimeout(() => {
      handleFinish();
    }, 4500);

    let width = window.innerWidth;
    let height = window.innerHeight;

    // Perspective Camera: positioned for dramatic fashion proscenium framing
    const scene = new THREE.Scene();
    const initialCamDist = 4.25;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, initialCamDist);

    // Precise frustum calculations to ensure zero gaps at screen edges
    const vFovRad = (camera.fov * Math.PI) / 180;
    const frustumH = 2 * Math.tan(vFovRad / 2) * initialCamDist;
    const frustumW = frustumH * (width / height);

    // WebGL Renderer with alpha transparency so the parted opening reveals the real homepage underneath
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setClearColor(0x000000, 0.0);
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);
    } catch {
      clearTimeout(failsafeTimer);
      handleFinish();
      return;
    }

    // Dynamic cursor / touch interaction coordinates
    const mouse = new THREE.Vector2(0.5, 0.5);
    const targetMouse = new THREE.Vector2(0.5, 0.5);

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      targetMouse.x = clientX / window.innerWidth;
      targetMouse.y = 1.0 - clientY / window.innerHeight;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Panel Geometry sizing:
    // Generously sized to ensure 100% full coverage in closed state, extending well past screen edges
    const panelWidth = (frustumW / 2) * 1.42;
    const panelHeight = frustumH * 1.30;
    // High-resolution grid for silk-like organic drape curvature
    const segmentsX = 96;
    const segmentsY = 72;
    const panelGeom = new THREE.PlaneGeometry(panelWidth, panelHeight, segmentsX, segmentsY);

    // Vertex Shader: Physical multi-harmonic columnar drapery, natural breathing, and slow-motion pull
    const vertexShader = `
      uniform float uTime;
      uniform float uOpenProgress;  // 0.0 (closed stage) -> 1.0 (swept beyond viewport)
      uniform float uSide;          // -1.0 for Left Panel, +1.0 for Right Panel
      uniform float uPanelWidth;
      uniform vec2 uMouse;

      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying float vFoldDepth;
      varying float vInnerEdgeGlow;

      void main() {
        vUv = uv;
        vec3 pos = position;

        // 1. Outward Sweep Motion:
        // Closed at 0.0 (covering screen completely).
        // Pulls apart smoothly from 0.8s to 2.8s and clears screen edges completely.
        float openDistance = uPanelWidth * 1.48;
        float openOffset = uOpenProgress * uSide * openDistance;

        // 2. Physical Gathering Dynamics:
        // As the inner edge is drawn outward, the fabric gathers into dense accordion pleats
        float pullEdgeDist = (uSide < 0.0) ? uv.x : (1.0 - uv.x);
        float gatherCompression = pow(pullEdgeDist, 1.35) * uOpenProgress * (uPanelWidth * 0.44);
        pos.x += openOffset - (uSide * gatherCompression);

        // 3. Couture Columnar Fluting Folds:
        // Frequency increases dynamically as fabric bunches together
        float pleatFreq = 16.0 * (1.0 + uOpenProgress * 1.5);
        float foldCoord = uv.x * pleatFreq;

        // Multi-frequency harmonics: deep primary pleats + intermediate waves + subtle micro-fluting
        float foldP = sin(foldCoord);
        float foldS = sin(foldCoord * 2.19 + 0.85) * 0.36;
        float foldT = sin(foldCoord * 4.42 + 1.45) * 0.14;
        float foldZ = (foldP + foldS + foldT) * 0.20;

        // Deepening folds as fabric bunches up
        float bunchingAmplitude = mix(1.0, 2.35, uOpenProgress);
        foldZ *= bunchingAmplitude;

        // Weighted vertical drape: taut at top heading, billowing fullness towards the hem
        float verticalWeight = mix(0.72, 1.42, pow(1.0 - uv.y, 1.35));
        foldZ *= verticalWeight;

        // 4. Natural breathing motion (slow cinematic pause):
        float breathingSpeed = 1.25;
        float breath = sin(uTime * breathingSpeed + uv.y * 2.6 + uv.x * 2.0) * 0.038 * (1.0 - uv.y * 0.3);
        foldZ += breath;

        // 5. Diagonal tension ripples when pulled open:
        float tensionRipple = sin(uv.x * 14.0 - uv.y * 7.0 + uTime * 2.2) * (0.028 * uOpenProgress);
        foldZ += tensionRipple;

        // 6. Interactive tactile ripple from mouse / touch:
        float mouseDist = distance(uv, uMouse);
        float ripple = exp(-mouseDist * 7.2) * sin(mouseDist * 28.0 - uTime * 6.2) * 0.045 * (1.0 - uOpenProgress);
        foldZ += ripple;

        // 7. Hem flare & 3D lead-edge curl when drawing back:
        float innerEdgeProximity = (uSide < 0.0) ? (1.0 - uv.x) : uv.x;
        float leadEdgeCurl = pow(innerEdgeProximity, 2.8) * sin(uOpenProgress * 3.14159) * 0.24;
        pos.z += foldZ + leadEdgeCurl;

        // 8. Slight proscenium curvature:
        float prosceniumArc = (1.0 - pow(uv.x * 2.0 - 1.0, 2.0)) * 0.07;
        pos.z += prosceniumArc;

        // Analytical normal derivative for pristine specular lighting
        float dZdx = (cos(foldCoord) + 0.78 * cos(foldCoord * 2.19 + 0.85) + 0.62 * cos(foldCoord * 4.42 + 1.45))
                      * 0.20 * pleatFreq * bunchingAmplitude;
        vec3 tangentX = normalize(vec3(1.0, 0.0, dZdx));
        vec3 tangentY = vec3(0.0, 1.0, 0.0);
        vec3 normalCalc = normalize(cross(tangentX, tangentY));

        vNormal = normalMatrix * normalCalc;
        vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
        vViewPosition = -mvPos.xyz;
        vFoldDepth = foldZ;

        // Inner center seam proximity (gilded piping radiance)
        float seamDist = (uSide < 0.0) ? (1.0 - uv.x) : uv.x;
        vInnerEdgeGlow = exp(-seamDist * 18.0);

        gl_Position = projectionMatrix * mvPos;
      }
    `;

    // Fragment Shader: Heavy couture velvet/silk duchesse satin with anisotropic sheen and champagne luster
    const fragmentShader = `
      uniform vec3 uColorCharcoal;
      uniform vec3 uColorGold;
      uniform vec3 uColorIvory;
      uniform float uTime;
      uniform float uOpenProgress;

      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying float vFoldDepth;
      varying float vInnerEdgeGlow;

      void main() {
        vec3 N = normalize(vNormal);
        vec3 V = normalize(vViewPosition);

        // Key spotlight: warm champagne directional raking light from top right
        vec3 L_key = normalize(vec3(0.65, 0.82, 0.70));
        // Fill light: deep atmospheric ambient tone
        vec3 L_fill = normalize(vec3(-0.55, -0.22, 0.45));

        // Soft velvet half-Lambert wrap
        float NdotL = max(0.0, dot(N, L_key));
        float diffuseKey = pow(NdotL * 0.5 + 0.5, 1.8);
        float diffuseFill = max(0.0, dot(N, L_fill)) * 0.28;

        // Anisotropic Specular Sheen (vertical silk thread reflection)
        vec3 H = normalize(L_key + V);
        vec3 T = vec3(0.0, 1.0, 0.0);
        float TdotH = dot(T, H);
        float sinTH = sqrt(max(0.0, 1.0 - TdotH * TdotH));
        float anisotropicSheen = pow(sinTH, 30.0) * 0.74;

        // Crest highlight on fold ridges
        float crestHighlight = pow(max(0.0, dot(N, H)), 18.0) * 0.38;

        // Fresnel Grazing Halo (classic couture silk rim glow)
        float fresnel = pow(1.0 - max(0.0, dot(N, V)), 3.2);

        // Deep valley Ambient Occlusion
        float ao = smoothstep(-0.26, 0.22, vFoldDepth);

        // Microscopic twill weave texture
        vec2 weaveCoord = vUv * vec2(190.0, 310.0);
        float weave = sin(weaveCoord.x + weaveCoord.y) * sin(weaveCoord.x - weaveCoord.y);
        float microTexture = 0.95 + 0.05 * weave;

        // Base royal charcoal velvet tone
        vec3 baseTone = uColorCharcoal * microTexture;
        vec3 finalColor = baseTone * (diffuseKey * 0.88 + diffuseFill + 0.08);

        // Champagne-gold luster along pleat ridges
        vec3 goldLuster = uColorGold * (anisotropicSheen + crestHighlight);
        finalColor += goldLuster * ao;

        // Refined ivory rim reflection
        finalColor += uColorIvory * fresnel * 0.35;

        // Gilded Lead-Edge French-piping
        float goldPiping = vInnerEdgeGlow * (0.42 + 0.48 * uOpenProgress);
        finalColor += uColorGold * goldPiping * (1.0 - uOpenProgress * 0.65);

        // Deepen shadows in fold recesses
        finalColor *= mix(0.38, 1.0, ao);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const baseUniforms = {
      uTime: { value: 0 },
      uOpenProgress: { value: 0 },
      uMouse: { value: mouse },
      uPanelWidth: { value: panelWidth },
      uColorCharcoal: { value: new THREE.Color(0x0c0b0a) }, // Deep royal charcoal/black velvet
      uColorGold: { value: new THREE.Color(0xd4af37) },     // Sindhudurg champagne gold
      uColorIvory: { value: new THREE.Color(0xf5f2eb) },    // Refined ivory
    };

    const leftMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        ...baseUniforms,
        uSide: { value: -1.0 },
      },
      side: THREE.DoubleSide,
      transparent: false,
    });

    const rightMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        ...baseUniforms,
        uSide: { value: 1.0 },
      },
      side: THREE.DoubleSide,
      transparent: false,
    });

    // Mesh placement:
    // Left panel right edge extends slightly past center (+0.07)
    // Right panel left edge extends slightly past center (-0.07)
    // Overlapping seamlessly at center with right panel slightly in front (z = +0.015)
    const leftMesh = new THREE.Mesh(panelGeom, leftMaterial);
    leftMesh.position.set(-panelWidth / 2 + 0.07, 0, 0);
    scene.add(leftMesh);

    const rightMesh = new THREE.Mesh(panelGeom, rightMaterial);
    rightMesh.position.set(panelWidth / 2 - 0.07, 0, 0.015);
    scene.add(rightMesh);

    // Intentional Fashion Film Timing:
    // 0.0s – 0.8s: Dramatic closed-stage pause. Fabric breathes naturally. Insignia radiates.
    // 0.8s – 2.8s: Cinematic fabric opening. Fabrics slowly pull away, accelerating; logo scales down & dissolves.
    //              Midpoint exposes bright cinematic glow and reveals real homepage underneath.
    // 2.8s – 3.4s: Fabrics sweep completely beyond viewport edges; final reveal and transition into homepage.
    // 3.4s – 3.6s: Clean dissolve & unmount.
    const startTime = performance.now();
    let hasPlayedOpenSound = false;

    const easeInOutCubic = (x: number): number =>
      x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

    const animate = () => {
      const now = performance.now();
      const elapsed = (now - startTime) / 1000;

      // Mouse damping
      mouse.x += (targetMouse.x - mouse.x) * 0.06;
      mouse.y += (targetMouse.y - mouse.y) * 0.06;

      // Subtle Steadicam camera push-in: 4.25 -> 3.88
      const camPushProgress = Math.min(1.0, elapsed / 3.2);
      camera.position.z = initialCamDist - camPushProgress * 0.37;

      let openP = 0;

      // 1. 0.0s - 0.80s: Closed Dramatic Stage
      if (elapsed < 0.8) {
        openP = 0;
        setBrandOpacity(1);
        setBrandScale(1.0);
        setBacklightGlow(0);
      }
      // 2. 0.80s - 2.80s: Cinematic Fabric Opening
      else if (elapsed >= 0.8 && elapsed < 2.8) {
        const openDuration = 2.0;
        const raw = (elapsed - 0.8) / openDuration;
        openP = easeInOutCubic(raw);

        // Audio trigger
        if (!hasPlayedOpenSound && soundEngineRef.current) {
          hasPlayedOpenSound = true;
          soundEngineRef.current.playSilkGlide(2.0);
        }

        // Brand dissolves and scales down gently (0.8s to 1.6s)
        if (elapsed < 1.6) {
          const brandFade = (elapsed - 0.8) / 0.8;
          setBrandOpacity(Math.max(0, 1.0 - brandFade));
          setBrandScale(1.0 - brandFade * 0.08);
        } else {
          setBrandOpacity(0);
        }

        // Backlight rays and golden halo peek through the widening seam (1.0s to 2.8s)
        if (elapsed >= 1.0) {
          const glowRaw = Math.min(1.0, (elapsed - 1.0) / 1.1);
          setBacklightGlow(glowRaw);
        }
      }
      // 3. 2.80s - 3.40s: Fabrics sweep completely beyond viewport edges
      else if (elapsed >= 2.8 && elapsed < 3.4) {
        openP = 1.0;
        const fadeOutRaw = (elapsed - 2.8) / 0.6;
        setOverlayOpacity(Math.max(0, 1.0 - fadeOutRaw));
        setBrandOpacity(0);
      }
      // 4. 3.40s - 3.60s: Complete & Reveal Homepage
      else if (elapsed >= 3.4) {
        handleFinish();
        return;
      }

      // Update shader uniforms
      leftMaterial.uniforms.uTime.value = elapsed;
      leftMaterial.uniforms.uOpenProgress.value = openP;
      leftMaterial.uniforms.uMouse.value = mouse;

      rightMaterial.uniforms.uTime.value = elapsed;
      rightMaterial.uniforms.uOpenProgress.value = openP;
      rightMaterial.uniforms.uMouse.value = mouse;

      renderer.render(scene, camera);
      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animationFrameIdRef.current = requestAnimationFrame(animate);

    // Responsive resize handler
    const handleResize = () => {
      if (!renderer || !camera) return;
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(failsafeTimer);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);

      try {
        scene.remove(leftMesh);
        scene.remove(rightMesh);
        panelGeom.dispose();
        leftMaterial.dispose();
        rightMaterial.dispose();
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      } catch {}
    };
  }, [isVisible, replayKey, forceShow, handleFinish]);

  if (!isVisible) return null;

  return (
    <div
      id="sindhudurg-cloth-intro"
      style={{ opacity: overlayOpacity }}
      className="fixed inset-0 z-50 pointer-events-auto select-none overflow-hidden transition-opacity duration-300 ease-out"
      aria-label="SINDHUDURG GARMENTS Presentation Opening"
    >
      {/* Three.js GPU Fabric Simulation Canvas */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Cinematic Golden Light Rays / Showroom Backlight through center parting */}
      <div
        style={{
          opacity: backlightGlow * 0.75,
          transform: `scale(${1 + backlightGlow * 0.3})`,
        }}
        className="absolute inset-0 pointer-events-none flex items-center justify-center transition-transform duration-700 ease-out"
      >
        <div className="w-[480px] sm:w-[720px] h-[480px] sm:h-[720px] rounded-full bg-radial from-[#C5A880]/35 via-[#C5A880]/10 to-transparent blur-[120px]" />
      </div>

      {/* Subtle Cinematic Vignette / Anamorphic Film Atmosphere */}
      <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-black/15 to-black/75" />

      {/* Center SINDHUDURG GARMENTS Brand Insignia (Cinematic Reveal) */}
      <div
        id="sindhudurg-intro-insignia"
        style={{
          opacity: brandOpacity,
          transform: `scale(${brandScale})`,
        }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none transition-transform duration-300 ease-out px-6 text-center"
      >
        {/* Ambient Halo behind insignia */}
        <div className="absolute w-80 h-80 rounded-full bg-[#C5A880]/20 blur-[90px] pointer-events-none animate-pulse" />

        {/* Heraldic Konkan Crest */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="w-18 h-18 rounded-full bg-[#100F0E]/95 border border-[#C5A880]/70 flex items-center justify-center shadow-[0_0_45px_rgba(197,168,128,0.35)]">
            <span className="font-serif text-2xl font-bold text-[#C5A880]">सिं</span>
          </div>
          <div className="absolute inset-0 rounded-full border border-[#C5A880]/30 scale-125" />
        </div>

        {/* Wordmark with Trailer Typography */}
        <div className="relative space-y-3">
          <div className="text-xs font-mono uppercase tracking-[0.45em] text-[#C5A880]/90 font-semibold">
            सिंधुदुर्ग • KONKAN
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif tracking-[0.22em] text-[#F5F2EB] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            SINDHUDURG GARMENTS
          </h1>
          <div className="flex items-center justify-center space-x-4 text-[11px] sm:text-xs font-mono uppercase tracking-[0.38em] text-[#C5A880]">
            <span className="w-8 h-[1px] bg-[#C5A880]/70" />
            <span>Konkan Roots • Maharashtra Soul</span>
            <span className="w-8 h-[1px] bg-[#C5A880]/70" />
          </div>
        </div>

        {/* Cinematic Film Subtitle */}
        <p className="mt-5 text-[11px] sm:text-xs tracking-[0.26em] uppercase text-[#A0988A] font-light max-w-md drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          Maharashtrian Sarees • Premium Shirts • Kokani T-Shirts
        </p>
      </div>

      {/* Top Right Quick Skip Button */}
      <div className="absolute top-6 right-6 z-20 pointer-events-auto">
        <button
          id="skip-cloth-intro-top-btn"
          onClick={handleSkip}
          type="button"
          className="group flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#121110]/80 hover:bg-[#C5A880] text-[#D4CEBF] hover:text-black border border-[#C5A880]/40 hover:border-[#C5A880] text-[11px] font-mono tracking-[0.2em] uppercase transition-all duration-200 cursor-pointer backdrop-blur-md shadow-lg active:scale-95"
        >
          <span>SKIP</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Bottom Bar Controls */}
      <div className="absolute bottom-7 left-0 right-0 z-20 px-6 flex items-center justify-between max-w-7xl mx-auto pointer-events-auto">
        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          type="button"
          aria-label={isAudioMuted ? 'Unmute luxury silk sound' : 'Mute silk sound'}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#121110]/80 hover:bg-[#1C1A18] border border-[#2B2824] hover:border-[#C5A880]/50 text-[#A0988A] hover:text-[#F5F2EB] text-[11px] font-mono tracking-wider transition-colors cursor-pointer backdrop-blur-xs"
        >
          {isAudioMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#736E65]" />
              <span className="hidden sm:inline">Audio Off</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="hidden sm:inline text-[#C5A880]">Silk Audio Active</span>
            </>
          )}
        </button>

        {/* Atmospheric Status */}
        <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#736E65] hidden sm:block">
          The Autumn/Winter Haute Couture Collection
        </div>
      </div>
    </div>
  );
};
