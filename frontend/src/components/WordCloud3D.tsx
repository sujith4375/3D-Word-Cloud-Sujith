import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text3D, Center, Float } from "@react-three/drei";
import * as THREE from "three";
import { WordItem } from "../types";

interface Props {
  words: WordItem[];
}

const COLORS = ["#22c55e", "#38bdf8", "#eab308", "#f97316", "#a855f7"];

function mapWeightToSize(weight: number): number {
  // weight ~ [0.2, 1.0]
  return 0.5 + weight * 1.5;
}

function mapWeightToColor(weight: number): string {
  const idx = Math.min(
    COLORS.length - 1,
    Math.floor((weight - 0.2) / 0.8 * COLORS.length)
  );
  return COLORS[idx];
}

function generateSpherePositions(count: number, radius: number): THREE.Vector3[] {
  const positions: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    positions.push(new THREE.Vector3(x, y, z));
  }
  return positions;
}

const WordCloudContent: React.FC<Props> = ({ words }) => {
  const positions = useMemo(
    () => generateSpherePositions(words.length, 8),
    [words.length]
  );

  return (
    <group>
      {words.map((w, idx) => {
        const size = mapWeightToSize(w.weight);
        const color = mapWeightToColor(w.weight);
        const pos = positions[idx];

        return (
          <Float
            key={w.word + idx}
            speed={1.5}
            rotationIntensity={0.5}
            floatIntensity={0.8}
          >
            <group position={pos.toArray()}>
              <Center>
                <Text3D
                  font="/fonts/helvetiker_regular.typeface.json"
                  size={size}
                  height={0.2}
                  bevelEnabled
                  bevelThickness={0.02}
                  bevelSize={0.01}
                  bevelSegments={3}
                  curveSegments={6}
                >
                  {w.word}
                  <meshStandardMaterial color={color} />
                </Text3D>
              </Center>
            </group>
          </Float>
        );
      })}
    </group>
  );
};

export const WordCloud3D: React.FC<Props> = ({ words }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 25], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#020617"]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 10]} intensity={0.8} />
      <WordCloudContent words={words} />
      <OrbitControls enablePan enableZoom enableRotate />
    </Canvas>
  );
};
