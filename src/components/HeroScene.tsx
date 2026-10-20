import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { useSceneColours } from "@/lib/scene-colours";

function Floater({
  pos,
  speed,
  children,
}: {
  pos: [number, number, number];
  speed: number;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }, d) => {
    const m = ref.current;
    if (!m) return;
    const t = clock.elapsedTime * speed;
    m.position.y = pos[1] + Math.sin(t) * 0.25;
    m.rotation.x += d * 0.4 * speed;
    m.rotation.y += d * 0.3 * speed;
  });
  return (
    <mesh ref={ref} position={pos}>
      {children}
    </mesh>
  );
}

function Scene({ animate }: { animate: boolean }) {
  const colours = useSceneColours();
  const group = useRef<THREE.Group>(null);
  const knot = useRef<THREE.Mesh>(null);
  const orb = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ clock }, raw) => {
    if (!animate) return;
    const d = Math.min(raw, 0.05);
    const s = window.scrollY / window.innerHeight;
    if (knot.current) {
      knot.current.rotation.x += d * 0.2;
      knot.current.rotation.y += d * 0.3;
    }
    if (orb.current) {
      const a = clock.elapsedTime * 0.8;
      orb.current.position.set(Math.cos(a) * 2.2, Math.sin(a) * 2.2, 0);
    }
    if (group.current) {
      const g = group.current;
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, mouse.current.x * 0.5 + s * 1.2, 4, d);
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, mouse.current.y * 0.3, 4, d);
    }
  });

  if (!colours) return null;
  return (
    <>
      <hemisphereLight args={[colours.white, colours.ground, 1.1]} />
      <directionalLight color={colours.white} position={[4, 6, 5]} intensity={1.6} />
      <pointLight position={[-3, -2, 3]} color={colours.primary} intensity={8} />
      <group ref={group}>
        <mesh ref={knot}>
          <torusKnotGeometry args={[1, 0.34, 240, 36, 2, 3]} />
          <meshStandardMaterial color={colours.primary} metalness={0.1} roughness={0.3} />
        </mesh>
        <group rotation={[1.1, 0.3, 0.2]}>
          <mesh>
            <torusGeometry args={[2.2, 0.015, 8, 160]} />
            <meshBasicMaterial color={colours.white} transparent opacity={0.6} />
          </mesh>
          <mesh ref={orb} position={[2.2, 0, 0]}>
            <sphereGeometry args={[0.12, 24, 24]} />
            <meshStandardMaterial color={colours.white} />
          </mesh>
        </group>
        <Floater pos={[-2.4, 1.4, -0.5]} speed={0.9}>
          <octahedronGeometry args={[0.3]} />
          <meshStandardMaterial color={colours.grey} />
        </Floater>
        <Floater pos={[2.5, 1.6, -1]} speed={0.7}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial color={colours.primary} wireframe />
        </Floater>
        <Floater pos={[2.2, -1.7, 0.4]} speed={1.1}>
          <icosahedronGeometry args={[0.32]} />
          <meshStandardMaterial color={colours.grey} />
        </Floater>
        <Floater pos={[-2.1, -1.6, 0.6]} speed={0.8}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color={colours.grey} />
        </Floater>
        <Floater pos={[0.2, 2.5, -1.2]} speed={1}>
          <octahedronGeometry args={[0.28]} />
          <meshStandardMaterial color={colours.white} wireframe />
        </Floater>
      </group>
    </>
  );
}

export default function HeroScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const io = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting));
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  const animate = !reduced;
  return (
    <div ref={wrap} className="h-full w-full" aria-hidden="true">
      <Canvas
        flat
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, 7], fov: 45 }}
        frameloop={animate && visible ? "always" : "demand"}
      >
        <Scene animate={animate} />
      </Canvas>
    </div>
  );
}
