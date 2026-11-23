"use client";

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { ROBOT } from "@/lib/pid/sim";

// Procedural model of a small competition line follower, in metres.
// Local axes: +x forward, +y up, +z right. Built from primitives so there is
// no model file to download: it renders the instant the scene mounts.

export type RobotHandle = {
  group: THREE.Group;
  setWheels: (l: number, r: number) => void;
  setSensors: (values: number[]) => void;
};

const R = ROBOT.wheelRadius;
const HALF_TRACK = ROBOT.wheelBase / 2;

function Wheel({ side, wheelRef }: { side: 1 | -1; wheelRef: React.RefObject<THREE.Group | null> }) {
  const spokes = [0, 1, 2, 3, 4];
  return (
    <group position={[0, R, side * HALF_TRACK]}>
      <group ref={wheelRef}>
        {/* tyre */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[R, R, 0.011, 40]} />
          <meshStandardMaterial color="#121212" roughness={0.92} />
        </mesh>
        {/* tread ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[R - 0.0005, 0.0025, 10, 40]} />
          <meshStandardMaterial color="#1c1c1c" roughness={1} />
        </mesh>
        {/* amber rim */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, side * 0.0012]}>
          <cylinderGeometry args={[R * 0.68, R * 0.68, 0.0105, 32]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.25} roughness={0.35} />
        </mesh>
        {spokes.map((i) => (
          <mesh key={i} rotation={[0, 0, (i / spokes.length) * Math.PI * 2]} position={[0, 0, side * 0.0062]}>
            <boxGeometry args={[0.0025, R * 1.2, 0.0012]} />
            <meshStandardMaterial color="#b45309" roughness={0.5} />
          </mesh>
        ))}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, side * 0.0066]}>
          <cylinderGeometry args={[0.0035, 0.0035, 0.002, 16]} />
          <meshStandardMaterial color="#d4d4d8" metalness={0.9} roughness={0.25} />
        </mesh>
      </group>
      {/* N20 gear motor */}
      <group position={[0, 0, -side * 0.021]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -side * 0.006]} castShadow>
          <cylinderGeometry args={[0.0062, 0.0062, 0.016, 20]} />
          <meshStandardMaterial color="#c0c4cc" metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, side * 0.0075]} castShadow>
          <boxGeometry args={[0.012, 0.01, 0.009]} />
          <meshStandardMaterial color="#c9a227" metalness={0.8} roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
}

export const RobotModel = forwardRef<RobotHandle>(function RobotModel(_, ref) {
  const group = useRef<THREE.Group>(null);
  const wheelL = useRef<THREE.Group>(null);
  const wheelR = useRef<THREE.Group>(null);

  const ledMats = useMemo(
    () =>
      Array.from({ length: ROBOT.sensorCount }, () =>
        new THREE.MeshStandardMaterial({ color: "#3f0d0d", emissive: new THREE.Color("#ff2a2a"), emissiveIntensity: 0 }),
      ),
    [],
  );
  const glowMats = useMemo(
    () =>
      Array.from({ length: ROBOT.sensorCount }, () =>
        new THREE.MeshBasicMaterial({ color: "#ff3b3b", transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }),
      ),
    [],
  );

  useImperativeHandle(ref, () => ({
    get group() {
      return group.current!;
    },
    setWheels(l, r) {
      // wheels spin about local z; forward motion = negative rotation about +z
      if (wheelL.current) wheelL.current.rotation.z = -l;
      if (wheelR.current) wheelR.current.rotation.z = -r;
    },
    setSensors(values) {
      values.forEach((v, i) => {
        const on = Math.max(0, Math.min(1, v));
        ledMats[i].emissiveIntensity = on * 3.2;
        glowMats[i].opacity = on * 0.55;
      });
    },
  }));

  const half = (ROBOT.sensorCount - 1) / 2;
  const sensorX = ROBOT.sensorAhead;

  return (
    <group ref={group}>
      {/* base plate: black acrylic */}
      <RoundedBox args={[0.13, 0.003, 0.1]} radius={0.0014} smoothness={3} position={[0.012, 0.028, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#0d0d0f" roughness={0.25} metalness={0.1} clearcoat={1} clearcoatRoughness={0.15} />
      </RoundedBox>
      {/* front arm to sensor bar */}
      <mesh position={[sensorX * 0.62, 0.02, 0]} rotation={[0, 0, -0.28]} castShadow>
        <boxGeometry args={[0.055, 0.0025, 0.02]} />
        <meshStandardMaterial color="#0d0d0f" roughness={0.3} />
      </mesh>

      {/* standoffs + top deck PCB */}
      {[
        [-0.03, -0.032],
        [-0.03, 0.032],
        [0.045, -0.032],
        [0.045, 0.032],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.039, z]}>
          <cylinderGeometry args={[0.0022, 0.0022, 0.019, 6]} />
          <meshStandardMaterial color="#d6b25e" metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
      <RoundedBox args={[0.092, 0.0016, 0.078]} radius={0.0007} smoothness={2} position={[0.0075, 0.049, 0]} castShadow>
        <meshStandardMaterial color="#14532d" roughness={0.55} />
      </RoundedBox>
      {/* silkscreen traces */}
      {[-0.025, -0.01, 0.006, 0.021].map((z, i) => (
        <mesh key={i} position={[0.0075, 0.0499, z]}>
          <boxGeometry args={[0.08, 0.0002, 0.0009]} />
          <meshStandardMaterial color="#c9a227" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}

      {/* microcontroller board (Nano-style) */}
      <group position={[0.018, 0.0512, -0.012]}>
        <mesh castShadow>
          <boxGeometry args={[0.044, 0.0016, 0.018]} />
          <meshStandardMaterial color="#0a4fa8" roughness={0.45} />
        </mesh>
        <mesh position={[0.002, 0.0015, 0]}>
          <boxGeometry args={[0.009, 0.0014, 0.009]} />
          <meshStandardMaterial color="#111" roughness={0.6} />
        </mesh>
        <mesh position={[-0.019, 0.002, 0]}>
          <boxGeometry args={[0.007, 0.0035, 0.008]} />
          <meshStandardMaterial color="#cfd3da" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* header pins */}
        {Array.from({ length: 13 }, (_, i) => (
          <group key={i}>
            <mesh position={[-0.0175 + i * 0.0029, 0.0022, 0.0078]}>
              <boxGeometry args={[0.0018, 0.003, 0.0018]} />
              <meshStandardMaterial color="#111" />
            </mesh>
            <mesh position={[-0.0175 + i * 0.0029, 0.0022, -0.0078]}>
              <boxGeometry args={[0.0018, 0.003, 0.0018]} />
              <meshStandardMaterial color="#111" />
            </mesh>
          </group>
        ))}
        <mesh position={[0.012, 0.0012, 0.004]}>
          <boxGeometry args={[0.0018, 0.0008, 0.0012]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2.5} />
        </mesh>
      </group>

      {/* motor driver */}
      <group position={[0.016, 0.054, 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[0.024, 0.0016, 0.021]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.0025, 0]}>
          <boxGeometry args={[0.009, 0.0035, 0.007]} />
          <meshStandardMaterial color="#18181b" roughness={0.7} />
        </mesh>
        <mesh position={[-0.009, 0.003, 0.006]}>
          <cylinderGeometry args={[0.003, 0.003, 0.006, 14]} />
          <meshStandardMaterial color="#27272a" metalness={0.4} roughness={0.4} />
        </mesh>
      </group>

      {/* 2S 18650 battery pack, mounted under the deck */}
      {[-0.0095, 0.0095].map((x, i) => (
        <group key={i} position={[-0.012 + x, 0.0395, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.009, 0.009, 0.066, 24]} />
            <meshStandardMaterial color="#0e7490" roughness={0.35} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0.0335, 0]}>
            <cylinderGeometry args={[0.0085, 0.0085, 0.0012, 24]} />
            <meshStandardMaterial color="#d4d4d8" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* wires from deck to sensor bar */}
      {[-0.006, 0, 0.006].map((z, i) => (
        <mesh key={i} position={[0.05, 0.034, z]} rotation={[0, 0, -0.55]}>
          <cylinderGeometry args={[0.0007, 0.0007, 0.04, 6]} />
          <meshStandardMaterial color={["#ef4444", "#111", "#f59e0b"][i]} roughness={0.6} />
        </mesh>
      ))}

      {/* sensor bar */}
      <group position={[sensorX, 0.0085, 0]}>
        <RoundedBox args={[0.013, 0.0016, ROBOT.sensorPitch * ROBOT.sensorCount + 0.008]} radius={0.0006} smoothness={2} castShadow>
          <meshStandardMaterial color="#111827" roughness={0.5} />
        </RoundedBox>
        {Array.from({ length: ROBOT.sensorCount }, (_, i) => {
          const z = (i - half) * ROBOT.sensorPitch;
          return (
            <group key={i} position={[0, 0, z]}>
              {/* emitter + receiver (TCRT5000-style), pointing down */}
              <mesh position={[0.0015, -0.003, -0.0028]}>
                <cylinderGeometry args={[0.0021, 0.0021, 0.004, 12]} />
                <meshStandardMaterial color="#60a5fa" roughness={0.15} transparent opacity={0.85} />
              </mesh>
              <mesh position={[0.0015, -0.003, 0.0028]}>
                <cylinderGeometry args={[0.0021, 0.0021, 0.004, 12]} />
                <meshStandardMaterial color="#0a0a0a" roughness={0.3} />
              </mesh>
              {/* indicator LED on top: lights when this sensor sees the line */}
              <mesh position={[-0.004, 0.0012, 0]} material={ledMats[i]}>
                <boxGeometry args={[0.0022, 0.0012, 0.0016]} />
              </mesh>
              {/* soft glow on the mat */}
              <mesh position={[0.0015, -0.0079, 0]} rotation={[-Math.PI / 2, 0, 0]} material={glowMats[i]}>
                <circleGeometry args={[0.0055, 20]} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* front caster */}
      <mesh position={[0.052, 0.006, 0]} castShadow>
        <sphereGeometry args={[0.006, 20, 16]} />
        <meshStandardMaterial color="#e4e4e7" metalness={0.95} roughness={0.12} />
      </mesh>
      <mesh position={[0.052, 0.017, 0]}>
        <cylinderGeometry args={[0.0075, 0.0068, 0.016, 16]} />
        <meshStandardMaterial color="#18181b" roughness={0.5} />
      </mesh>

      <Wheel side={-1} wheelRef={wheelL} />
      <Wheel side={1} wheelRef={wheelR} />
    </group>
  );
});
