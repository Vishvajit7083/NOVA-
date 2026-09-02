"use client";

import * as THREE from "three";
import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Gender, BodyAdjustments } from "@/types/product";
import { useFittingRoom } from "@/contexts/FittingRoomContext";

interface HumanModelProps {
  gender: Gender;
  adjustments: BodyAdjustments;
  onLoad?: () => void;
}

export function HumanModel({ gender, adjustments, onLoad }: HumanModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<Map<string, THREE.Mesh>>(new Map());
  const { pose } = useFittingRoom();

  // Realistic human body proportions (based on medical/anthropometric data)
  const bodyDimensions = useMemo(() => {
    const scale = adjustments.height;
    return {
      head: { radius: 0.12 * scale, height: 0.22 * scale },
      neck: { radius: 0.05 * scale, height: 0.1 * scale },
      torso: {
        width: 0.36 * adjustments.shoulderWidth * scale,
        depth: 0.2 * scale,
        height: 0.5 * scale * adjustments.torsoProportion,
      },
      arm: { radius: 0.045 * scale, length: 0.6 * scale },
      leg: { radius: 0.07 * scale, length: 0.9 * scale * adjustments.legProportion },
      waist: { radius: 0.14 * adjustments.waist * scale, height: 0.15 * scale },
      chest: { radius: 0.16 * adjustments.chest * scale },
      shoulder: { width: 0.42 * adjustments.shoulderWidth * scale },
      hip: { width: 0.36 * scale },
    };
  }, [adjustments]);

  // Create skin material with realistic properties
  const skinMaterial = useMemo(() => {
    const skinColor = gender === "female" ? 0xd4a88c : 0xc49578;
    return new THREE.MeshPhysicalMaterial({
      color: skinColor,
      roughness: 0.6,
      metalness: 0.0,
      clearcoat: 0.1,
      clearcoatRoughness: 0.8,
      sheen: 0.3,
      sheenRoughness: 0.5,
      sheenColor: new THREE.Color(0xffccaa),
    });
  }, [gender]);

  // Create procedural body geometry
  const bodyParts = useMemo(() => {
    const parts: Array<{
      key: string;
      geometry: THREE.BufferGeometry;
      position: [number, number, number];
      rotation?: [number, number, number];
    }> = [];

    // Head
    const headGeom = new THREE.SphereGeometry(bodyDimensions.head.radius, 32, 32);
    headGeom.translate(0, bodyDimensions.head.height / 2 + bodyDimensions.neck.height + bodyDimensions.torso.height, 0);
    parts.push({ key: "head", geometry: headGeom, position: [0, 0, 0] });

    // Neck
    const neckGeom = new THREE.CylinderGeometry(
      bodyDimensions.neck.radius,
      bodyDimensions.neck.radius * 1.1,
      bodyDimensions.neck.height,
      16
    );
    neckGeom.translate(0, bodyDimensions.head.height / 2 + bodyDimensions.neck.height / 2, 0);
    parts.push({ key: "neck", geometry: neckGeom, position: [0, 0, 0] });

    // Torso (upper)
    const upperTorsoGeom = new THREE.CylinderGeometry(
      bodyDimensions.chest.radius,
      bodyDimensions.waist.radius,
      bodyDimensions.torso.height * 0.6,
      16
    );
    upperTorsoGeom.translate(0, bodyDimensions.torso.height * 0.35, 0);
    parts.push({ key: "upperTorso", geometry: upperTorsoGeom, position: [0, 0, 0] });

    // Torso (lower) / Hips
    const lowerTorsoGeom = new THREE.CylinderGeometry(
      bodyDimensions.waist.radius,
      bodyDimensions.hip.width / 2,
      bodyDimensions.torso.height * 0.4,
      16
    );
    lowerTorsoGeom.translate(0, -bodyDimensions.torso.height * 0.25, 0);
    parts.push({ key: "lowerTorso", geometry: lowerTorsoGeom, position: [0, 0, 0] });

    // Left arm
    const leftArmGeom = new THREE.CylinderGeometry(
      bodyDimensions.arm.radius * 0.9,
      bodyDimensions.arm.radius * 0.7,
      bodyDimensions.arm.length,
      12
    );
    const leftArmPos: [number, number, number] = [
      -bodyDimensions.shoulder.width / 2 - bodyDimensions.arm.radius,
      bodyDimensions.torso.height * 0.45,
      0,
    ];
    parts.push({ key: "leftArm", geometry: leftArmGeom, position: leftArmPos });

    // Right arm
    const rightArmGeom = new THREE.CylinderGeometry(
      bodyDimensions.arm.radius * 0.7,
      bodyDimensions.arm.radius * 0.9,
      bodyDimensions.arm.length,
      12
    );
    const rightArmPos: [number, number, number] = [
      bodyDimensions.shoulder.width / 2 + bodyDimensions.arm.radius,
      bodyDimensions.torso.height * 0.45,
      0,
    ];
    parts.push({ key: "rightArm", geometry: rightArmGeom, position: rightArmPos });

    // Left forearm
    const leftForearmGeom = new THREE.CylinderGeometry(
      bodyDimensions.arm.radius * 0.7,
      bodyDimensions.arm.radius * 0.6,
      bodyDimensions.arm.length * 0.8,
      12
    );
    const leftForearmPos: [number, number, number] = [
      -bodyDimensions.shoulder.width / 2 - bodyDimensions.arm.radius,
      bodyDimensions.torso.height * 0.45 - bodyDimensions.arm.length * 0.9,
      0,
    ];
    parts.push({ key: "leftForearm", geometry: leftForearmGeom, position: leftForearmPos });

    // Right forearm
    const rightForearmGeom = new THREE.CylinderGeometry(
      bodyDimensions.arm.radius * 0.6,
      bodyDimensions.arm.radius * 0.7,
      bodyDimensions.arm.length * 0.8,
      12
    );
    const rightForearmPos: [number, number, number] = [
      bodyDimensions.shoulder.width / 2 + bodyDimensions.arm.radius,
      bodyDimensions.torso.height * 0.45 - bodyDimensions.arm.length * 0.9,
      0,
    ];
    parts.push({ key: "rightForearm", geometry: rightForearmGeom, position: rightForearmPos });

    // Left hand
    const leftHandGeom = new THREE.SphereGeometry(bodyDimensions.arm.radius * 1.2, 12, 12);
    leftHandGeom.scale(0.8, 1.5, 0.5);
    const leftHandPos: [number, number, number] = [
      -bodyDimensions.shoulder.width / 2 - bodyDimensions.arm.radius,
      bodyDimensions.torso.height * 0.45 - bodyDimensions.arm.length * 1.6,
      0,
    ];
    parts.push({ key: "leftHand", geometry: leftHandGeom, position: leftHandPos });

    // Right hand
    const rightHandGeom = new THREE.SphereGeometry(bodyDimensions.arm.radius * 1.2, 12, 12);
    rightHandGeom.scale(0.8, 1.5, 0.5);
    const rightHandPos: [number, number, number] = [
      bodyDimensions.shoulder.width / 2 + bodyDimensions.arm.radius,
      bodyDimensions.torso.height * 0.45 - bodyDimensions.arm.length * 1.6,
      0,
    ];
    parts.push({ key: "rightHand", geometry: rightHandGeom, position: rightHandPos });

    // Left upper leg
    const leftUpperLegGeom = new THREE.CylinderGeometry(
      bodyDimensions.leg.radius,
      bodyDimensions.leg.radius * 0.85,
      bodyDimensions.leg.length * 0.5,
      12
    );
    const leftUpperLegPos: [number, number, number] = [
      -bodyDimensions.hip.width / 4,
      -bodyDimensions.torso.height * 0.5 - bodyDimensions.leg.length * 0.25,
      0,
    ];
    parts.push({ key: "leftUpperLeg", geometry: leftUpperLegGeom, position: leftUpperLegPos });

    // Right upper leg
    const rightUpperLegGeom = new THREE.CylinderGeometry(
      bodyDimensions.leg.radius * 0.85,
      bodyDimensions.leg.radius,
      bodyDimensions.leg.length * 0.5,
      12
    );
    const rightUpperLegPos: [number, number, number] = [
      bodyDimensions.hip.width / 4,
      -bodyDimensions.torso.height * 0.5 - bodyDimensions.leg.length * 0.25,
      0,
    ];
    parts.push({ key: "rightUpperLeg", geometry: rightUpperLegGeom, position: rightUpperLegPos });

    // Left lower leg
    const leftLowerLegGeom = new THREE.CylinderGeometry(
      bodyDimensions.leg.radius * 0.7,
      bodyDimensions.leg.radius * 0.6,
      bodyDimensions.leg.length * 0.5,
      12
    );
    const leftLowerLegPos: [number, number, number] = [
      -bodyDimensions.hip.width / 4,
      -bodyDimensions.torso.height * 0.5 - bodyDimensions.leg.length * 0.75,
      0,
    ];
    parts.push({ key: "leftLowerLeg", geometry: leftLowerLegGeom, position: leftLowerLegPos });

    // Right lower leg
    const rightLowerLegGeom = new THREE.CylinderGeometry(
      bodyDimensions.leg.radius * 0.6,
      bodyDimensions.leg.radius * 0.7,
      bodyDimensions.leg.length * 0.5,
      12
    );
    const rightLowerLegPos: [number, number, number] = [
      bodyDimensions.hip.width / 4,
      -bodyDimensions.torso.height * 0.5 - bodyDimensions.leg.length * 0.75,
      0,
    ];
    parts.push({ key: "rightLowerLeg", geometry: rightLowerLegGeom, position: rightLowerLegPos });

    // Left foot
    const leftFootGeom = new THREE.BoxGeometry(bodyDimensions.leg.radius * 1.2, bodyDimensions.leg.radius * 0.6, bodyDimensions.leg.radius * 2.5);
    const leftFootPos: [number, number, number] = [
      -bodyDimensions.hip.width / 4,
      -bodyDimensions.torso.height * 0.5 - bodyDimensions.leg.length - bodyDimensions.leg.radius * 0.3,
      bodyDimensions.leg.radius * 0.5,
    ];
    parts.push({ key: "leftFoot", geometry: leftFootGeom, position: leftFootPos });

    // Right foot
    const rightFootGeom = new THREE.BoxGeometry(bodyDimensions.leg.radius * 1.2, bodyDimensions.leg.radius * 0.6, bodyDimensions.leg.radius * 2.5);
    const rightFootPos: [number, number, number] = [
      bodyDimensions.hip.width / 4,
      -bodyDimensions.torso.height * 0.5 - bodyDimensions.leg.length - bodyDimensions.leg.radius * 0.3,
      bodyDimensions.leg.radius * 0.5,
    ];
    parts.push({ key: "rightFoot", geometry: rightFootGeom, position: rightFootPos });

    return parts;
  }, [bodyDimensions]);

  // Handle pose changes with animation
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();

      // Smooth pose transitions
      if (pose === "relaxed") {
        groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
      } else if (pose === "casual") {
        groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.15;
      } else {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.05);
      }
    }
  });

  useEffect(() => {
    if (onLoad) onLoad();
  }, [onLoad]);

  return (
    <group ref={groupRef}>
      {bodyParts.map((part) => (
        <mesh
          key={part.key}
          ref={(el) => {
            if (el) meshRefs.current.set(part.key, el);
          }}
          geometry={part.geometry}
          material={skinMaterial}
          position={part.position}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}
