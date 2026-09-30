// src/components/Avatar3D.jsx
// Avatar 3D interaktif — foto dalam "koin" 3D yang bisa di-drag untuk
// diputar. Foto depan = photos[0], belakang = photos[1] (atau aksen kuning).
// Nonaktif otomatis jika pengguna mengaktifkan "prefers-reduced-motion".
import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const ACCENT = '#f59e0b';

function useTextureSetup(texture) {
  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.minFilter = THREE.LinearFilter;
  }, [texture]);
}

function FrontFace({ url }) {
  const texture = useLoader(THREE.TextureLoader, url);
  useTextureSetup(texture);
  return (
    <mesh position={[0, 0, 0.051]}>
      <circleGeometry args={[1.05, 64]} />
      <meshStandardMaterial map={texture} roughness={0.5} metalness={0.05} />
    </mesh>
  );
}

function BackFace({ url }) {
  const texture = useLoader(THREE.TextureLoader, url);
  useTextureSetup(texture);
  return (
    <mesh position={[0, 0, -0.051]} rotation={[0, Math.PI, 0]}>
      <circleGeometry args={[1.05, 64]} />
      <meshStandardMaterial map={texture} roughness={0.5} metalness={0.05} />
    </mesh>
  );
}

function BackAccent() {
  return (
    <mesh position={[0, 0, -0.051]} rotation={[0, Math.PI, 0]}>
      <circleGeometry args={[1.05, 64]} />
      <meshStandardMaterial color={ACCENT} roughness={0.35} metalness={0.25} />
    </mesh>
  );
}

function Coin({ front, back, spin, target, dragging }) {
  const group = useRef();

  useFrame((state) => {
    if (!group.current) return;
    if (!dragging.current) {
      // Goyangan halus saat idle.
      target.current.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.3;
      target.current.x = Math.sin(state.clock.elapsedTime * 0.45) * 0.12;
    }
    spin.current.y += (target.current.y - spin.current.y) * 0.12;
    spin.current.x += (target.current.x - spin.current.x) * 0.12;
    group.current.rotation.y = spin.current.y;
    group.current.rotation.x = spin.current.x;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.3) * 0.06;
  });

  return (
    <group ref={group}>
      {/* Bingkai/sisi koin */}
      <mesh>
        <cylinderGeometry args={[1.05, 1.05, 0.1, 64]} />
        <meshStandardMaterial color={ACCENT} roughness={0.35} metalness={0.25} />
      </mesh>
      <FrontFace url={front} />
      {back ? <BackFace url={back} /> : <BackAccent />}
    </group>
  );
}

export default function Avatar3D({ photos, alt }) {
  const [reduced, setReduced] = useState(false);
  const spin = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (event) => setReduced(event.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Hormati preferensi "kurangi gerakan" — tampilkan foto statis.
  if (reduced || !photos || photos.length === 0) {
    return <img src={photos?.[0]} alt={alt} className="h-full w-full rounded-full object-cover" />;
  }

  const front = photos[0];
  const back = photos.length > 1 ? photos[1] : null;

  const onPointerDown = (event) => {
    dragging.current = true;
    last.current = { x: event.clientX, y: event.clientY };
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId);
    } catch {
      /* abaikan */
    }
  };

  const onPointerMove = (event) => {
    if (!dragging.current) return;
    const dx = event.clientX - last.current.x;
    const dy = event.clientY - last.current.y;
    last.current = { x: event.clientX, y: event.clientY };
    target.current.y += dx * 0.014;
    target.current.x += dy * 0.01;
    target.current.y = Math.max(-0.75, Math.min(0.75, target.current.y));
    target.current.x = Math.max(-0.45, Math.min(0.45, target.current.x));
  };

  const stopDrag = () => {
    dragging.current = false;
  };

  return (
    <div
      className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      onPointerLeave={stopDrag}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 2.7], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 4, 5]} intensity={1.1} />
        <pointLight position={[-3, -2, 3]} color={ACCENT} intensity={0.8} />
        <Suspense fallback={null}>
          <Coin front={front} back={back} spin={spin} target={target} dragging={dragging} />
        </Suspense>
      </Canvas>
    </div>
  );
}
