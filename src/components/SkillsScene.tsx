import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { Skill } from "@/lib/content";

import { useSceneColours } from "@/lib/scene-colours";

function Orbiter({ skill, index, total, animate }: { skill: Skill; index: number; total: number; animate: boolean }) {
  const colours = useSceneColours();
  const ref = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);
  const radius = 2 + (index % 3) * 0.55;
  const speed = 0.25 + (index % 4) * 0.06;
  const phase = (index / total) * Math.PI * 2;
  const tiltY = ((index % 5) - 2) * 0.25;
  const size = 0.1 + (skill.level / 100) * 0.16;

  const place = (t: number) => {
    const a = phase + t * speed;
    ref.current?.position.set(Math.cos(a) * radius, Math.sin(a * 1.3) * tiltY + Math.sin(a) * 0.4, Math.sin(a) * radius * 0.6);
  };
  useEffect(() => place(0));
  useFrame(({ clock }) => {
    if (animate && !hover) place(clock.elapsedTime);
  });

  if (!colours) return null;
  return (
    <mesh
      ref={ref}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = ""; }}
      scale={hover ? 1.4 : 1}
    >
      <sphereGeometry args={[size, 24, 24]} />
      <meshStandardMaterial color={hover ? colours.white : index % 3 === 0 ? colours.grey : index % 3 === 1 ? colours.primary : colours.white} roughness={0.35} />
      {hover && (
        <Html center distanceFactor={8} style={{ pointerEvents: "none" }}>
          <div className="-translate-y-8 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs font-bold text-paper">
            {skill.name} · {skill.level}%
          </div>
        </Html>
      )}
    </mesh>
  );
}

function Knot({ animate }: { animate: boolean }) {
  const colours = useSceneColours();
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (!animate || !ref.current) return;
    ref.current.rotation.x += Math.min(d, 0.05) * 0.25;
    ref.current.rotation.y += Math.min(d, 0.05) * 0.35;
  });
  if (!colours) return null;
  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[0.7, 0.22, 160, 24, 2, 3]} />
      <meshStandardMaterial color={colours.primary} metalness={0.1} roughness={0.3} />
    </mesh>
  );
}

export default function SkillsScene({ skills }: { skills: Skill[] }) {
  const colours = useSceneColours();
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const io = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting), { rootMargin: "100px" });
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  const animate = !reduced;
  if (!colours) return null;
  return (
    <div ref={wrap} className="h-full w-full" aria-hidden="true">
      <Canvas
        flat
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 1.2, 6.5], fov: 45 }}
        frameloop={animate && visible ? "always" : "demand"}
      >
        <hemisphereLight args={[colours.white, colours.ground, 1.1]} />
        <directionalLight color={colours.white} position={[4, 6, 5]} intensity={1.5} />
        <pointLight position={[-3, -2, 3]} color={colours.primary} intensity={8} />
        <Knot animate={animate} />
        {skills.map((s, i) => (
          <Orbiter key={s.name} skill={s} index={i} total={skills.length} animate={animate} />
        ))}
      </Canvas>
    </div>
  );
}
