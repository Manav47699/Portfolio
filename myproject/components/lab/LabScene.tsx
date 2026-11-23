"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, Lightformer } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { RobotModel, type RobotHandle } from "./RobotModel";
import { LINE_WIDTH, type Gains, type Track } from "@/lib/pid/sim";
import type { LabController } from "./usePidSim";

// The world is modelled in metres; render at 10× so the camera maths stays comfortable.
const S = 10;

function trackBounds(track: Track) {
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const p of track.pts) {
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
    minZ = Math.min(minZ, p.z); maxZ = Math.max(maxZ, p.z);
  }
  return { minX, maxX, minZ, maxZ, cx: (minX + maxX) / 2, cz: (minZ + maxZ) / 2, w: maxX - minX, d: maxZ - minZ };
}

function paperTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = "#f3efe6";
  g.fillRect(0, 0, 512, 512);
  const img = g.getImageData(0, 0, 512, 512);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 14;
    img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n;
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(6, 4);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function TrackMesh({ track }: { track: Track }) {
  const { line, mat, start, b } = useMemo(() => {
    const pts = track.pts, n = pts.length;
    const pos: number[] = [], idx: number[] = [];
    for (let i = 0; i < n; i++) {
      const a = pts[(i - 1 + n) % n], c = pts[(i + 1) % n];
      let tx = c.x - a.x, tz = c.z - a.z;
      const l = Math.hypot(tx, tz) || 1;
      tx /= l; tz /= l;
      const nx = -tz * (LINE_WIDTH / 2), nz = tx * (LINE_WIDTH / 2);
      pos.push((pts[i].x + nx) * S, 0.0012 * S, (pts[i].z + nz) * S, (pts[i].x - nx) * S, 0.0012 * S, (pts[i].z - nz) * S);
      const j = i * 2, k = ((i + 1) % n) * 2;
      idx.push(j, k, j + 1, j + 1, k, k + 1);
    }
    const line = new THREE.BufferGeometry();
    line.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    line.setIndex(idx);
    line.computeVertexNormals();

    const b = trackBounds(track);
    const mat = { w: (b.w + 0.5) * S, d: (b.d + 0.5) * S, x: b.cx * S, z: b.cz * S };

    const p = pts[4], q = pts[5];
    const start = { x: p.x * S, z: p.z * S, rot: -Math.atan2(q.z - p.z, q.x - p.x) };
    return { line, mat, start, b };
  }, [track]);

  const tex = useMemo(() => (typeof document !== "undefined" ? paperTexture() : null), []);

  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[b.cx * S, -0.02, b.cz * S]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color="#0c0c0e" roughness={0.9} />
      </mesh>
      {/* competition mat */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[mat.x, 0, mat.z]} receiveShadow>
        <planeGeometry args={[mat.w, mat.d]} />
        <meshStandardMaterial color="#ffffff" map={tex ?? undefined} roughness={0.85} />
      </mesh>
      {/* tape line */}
      <mesh geometry={line} receiveShadow>
        <meshStandardMaterial color="#0a0a0a" roughness={0.55} />
      </mesh>
      {/* start / finish checker */}
      <group position={[start.x, 0.0016 * S, start.z]} rotation={[0, start.rot, 0]}>
        {Array.from({ length: 2 }).map((_, r) =>
          Array.from({ length: 8 }).map((__, c) => (
            <mesh key={`${r}-${c}`} rotation={[-Math.PI / 2, 0, 0]} position={[(r - 0.5) * 0.12, 0, (c - 3.5) * 0.12]}>
              <planeGeometry args={[0.12, 0.12]} />
              <meshStandardMaterial color={(r + c) % 2 ? "#111" : "#fafafa"} roughness={0.6} />
            </mesh>
          )),
        )}
      </group>
    </group>
  );
}

const TRAIL = 700;

function Rig({ lab, gains, follow }: { lab: LabController; gains: Gains; follow: boolean }) {
  const robot = useRef<RobotHandle>(null);
  const controls = useRef<OrbitControlsImpl>(null);
  const { camera, size } = useThree();
  const acc = useRef(0);
  const gainsRef = useRef(gains);
  useEffect(() => {
    gainsRef.current = gains;
  }, [gains]);

  const b = useMemo(() => trackBounds(lab.sim.track), [lab]);

  const trailGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(TRAIL * 3), 3));
    g.setDrawRange(0, 0);
    return g;
  }, []);
  const trailLine = useMemo(
    () => new THREE.Line(trailGeom, new THREE.LineBasicMaterial({ color: "#f59e0b", transparent: true, opacity: 0.9 })),
    [trailGeom],
  );
  const counters = useRef({ trail: 0, tick: 0 });

  // overview camera framing depends on aspect ratio
  const overview = useMemo(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const dist = aspect < 1 ? 62 : aspect < 1.4 ? 48 : 40;
    return new THREE.Vector3(b.cx * S, dist * 0.62, b.cz * S + dist * 0.8);
  }, [size.width, size.height, b]);

  useEffect(() => {
    if (!follow) {
      camera.position.copy(overview);
      controls.current?.target.set(b.cx * S, 0, b.cz * S);
      controls.current?.update();
    }
  }, [follow, overview, camera, b]);

  const tmp = useMemo(() => ({ v: new THREE.Vector3(), look: new THREE.Vector3() }), []);
  const look = useRef(new THREE.Vector3(b.cx * S, 0, b.cz * S));

  useFrame((_, delta) => {
    const { sim } = lab;
    if (!lab.paused) {
      acc.current += Math.min(delta, 0.05);
      const h = 1 / 240;
      while (acc.current >= h) {
        sim.step(h, gainsRef.current);
        acc.current -= h;
        // telemetry + trail sample every 4th step (60 Hz)
        const c = counters.current;
        c.tick = (c.tick + 1) % 4;
        if (c.tick === 0) {
          lab.record(sim.state.error, sim.state.output);
          const pos = trailGeom.getAttribute("position") as THREE.BufferAttribute;
          const arr = pos.array as Float32Array;
          if (c.trail < TRAIL) c.trail++;
          else arr.copyWithin(0, 3);
          const i = (c.trail - 1) * 3;
          const hx = Math.cos(sim.state.heading), hz = Math.sin(sim.state.heading);
          arr[i] = (sim.state.x + hx * 0.07) * S;
          arr[i + 1] = 0.003 * S;
          arr[i + 2] = (sim.state.z + hz * 0.07) * S;
          pos.needsUpdate = true;
          trailGeom.setDrawRange(0, c.trail);
        }
      }
    }
    if (lab.consumeTrailReset()) {
      counters.current.trail = 0;
      trailGeom.setDrawRange(0, 0);
    }

    const s = sim.state;
    const r = robot.current;
    if (r) {
      r.group.position.set(s.x, 0, s.z); // parent group is already scaled by S
      r.group.rotation.y = -s.heading;
      r.setWheels(s.wheelAngleL, s.wheelAngleR);
      r.setSensors(s.sensors);
    }

    if (follow) {
      // three-quarter chase cam: behind, above and slightly to the side
      const hx = Math.cos(s.heading), hz = Math.sin(s.heading);
      const rx = -hz, rz = hx;
      tmp.v.set((s.x - hx * 0.5 + rx * 0.28) * S, 3.4, (s.z - hz * 0.5 + rz * 0.28) * S);
      camera.position.lerp(tmp.v, 1 - Math.pow(0.02, delta));
      tmp.look.set((s.x + hx * 0.22) * S, 0, (s.z + hz * 0.22) * S);
      look.current.lerp(tmp.look, 1 - Math.pow(0.004, delta));
      camera.lookAt(look.current);
    }
  });

  return (
    <>
      <group scale={S}>
        <RobotModel ref={robot} />
      </group>
      <primitive object={trailLine} />
      <OrbitControls
        ref={controls}
        enabled={!follow}
        enablePan={false}
        minDistance={6}
        maxDistance={70}
        maxPolarAngle={Math.PI / 2.15}
        enableDamping
        target={[b.cx * S, 0, b.cz * S]}
      />
    </>
  );
}

export default function LabScene({
  lab,
  gains,
  follow,
  active,
}: {
  lab: LabController;
  gains: Gains;
  follow: boolean;
  active: boolean;
}) {
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 40, near: 0.1, far: 400, position: [0, 26, 20] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <color attach="background" args={["#060608"]} />
      <fog attach="fog" args={["#060608", 45, 110]} />
      <hemisphereLight args={["#dbeafe", "#1c1917", 0.55]} />
      <directionalLight
        position={[12, 26, 10]}
        intensity={2.1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-camera-near={1}
        shadow-camera-far={80}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <pointLight position={[-20, 8, -14]} intensity={60} distance={60} color="#3b82f6" />
      <pointLight position={[22, 6, 14]} intensity={40} distance={50} color="#f59e0b" />
      {/* local studio environment for reflections: no network fetch */}
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={2} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[12, 12, 1]} />
        <Lightformer intensity={1.2} color="#93c5fd" position={[-6, 2, -4]} scale={[6, 2, 1]} />
        <Lightformer intensity={1.2} color="#fcd34d" position={[6, 2, 4]} scale={[6, 2, 1]} />
      </Environment>
      <TrackMesh track={lab.sim.track} />
      <Rig lab={lab} gains={gains} follow={follow} />
    </Canvas>
  );
}
