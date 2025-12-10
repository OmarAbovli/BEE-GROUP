import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

function Hexagon({ position, scale, speed }: { position: [number, number, number]; scale: number; speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const sides = 6;
    const radius = 1;
    
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }
    shape.closePath();
    
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.3,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 3,
    });
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.2;
      meshRef.current.rotation.y += 0.002 * speed;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * speed * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh
        ref={meshRef}
        position={position}
        scale={scale}
        geometry={geometry}
      >
        <MeshTransmissionMaterial
          color="#f5a623"
          transmission={0.6}
          thickness={0.5}
          roughness={0.1}
          metalness={0.8}
          chromaticAberration={0.1}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.2}
          temporalDistortion={0.1}
        />
      </mesh>
    </Float>
  );
}

function HexagonGrid() {
  const hexagons = useMemo(() => {
    const items: { position: [number, number, number]; scale: number; speed: number }[] = [];
    
    // Create honeycomb pattern
    const positions = [
      [-3, 2, -2],
      [3, 1.5, -3],
      [-2, -1.5, -2],
      [2.5, -2, -2.5],
      [0, 3, -4],
      [-4, 0, -3],
      [4, 0, -4],
    ];
    
    positions.forEach((pos, i) => {
      items.push({
        position: pos as [number, number, number],
        scale: 0.3 + Math.random() * 0.4,
        speed: 0.5 + Math.random() * 0.5,
      });
    });
    
    return items;
  }, []);

  return (
    <>
      {hexagons.map((hex, i) => (
        <Hexagon key={i} {...hex} />
      ))}
    </>
  );
}

function Particles() {
  const count = 100;
  const mesh = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#f5a623"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export const HexagonScene = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#f5a623" />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#c78f1e" />
        <HexagonGrid />
        <Particles />
      </Canvas>
    </div>
  );
};
