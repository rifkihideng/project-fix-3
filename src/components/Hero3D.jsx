// src/components/Hero3D.jsx
// Background 3D untuk Hero — bentuk geometris melayang + partikel,
// bereaksi ringan terhadap gerakan mouse. Nonaktif otomatis jika
// pengguna mengaktifkan "prefers-reduced-motion".
import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';

const ACCENT = '#f59e0b';
const ACCENT_SOFT = '#fbbf24';

function Scene() {
  const mouseGroup = useRef();
  const spinGroup = useRef();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((state, delta) => {
    // Rotasi pelan terus-menerus.
    if (spinGroup.current) {
      spinGroup.current.rotation.y += delta * 0.08;
      spinGroup.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.08;
    }
    // Parallax mengikuti mouse (lerp halus).
    if (mouseGroup.current) {
      mouseGroup.current.rotation.x +=
        (mouse.current.y * 0.1 - mouseGroup.current.rotation.x) * 0.04;
      mouseGroup.current.rotation.y +=
        (mouse.current.x * 0.15 - mouseGroup.current.rotation.y) * 0.04;
    }
  });

  return (
    <group ref={mouseGroup}>
      <group ref={spinGroup}>
        <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
          <mesh position={[2.4, 0.8, -1]}>
            <icosahedronGeometry args={[1.05, 1]} />
            <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.35} />
          </mesh>
        </Float>

        <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.6}>
          <mesh position={[-2.6, -0.6, -1.5]}>
            <torusGeometry args={[0.9, 0.28, 20, 48]} />
            <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.25} />
          </mesh>
        </Float>

        <Float speed={2.5} rotationIntensity={1} floatIntensity={1.4}>
          <mesh position={[-1.2, 1.6, -0.5]}>
            <octahedronGeometry args={[0.55, 0]} />
            <meshStandardMaterial color={ACCENT_SOFT} transparent opacity={0.4} />
          </mesh>
        </Float>

        <Float speed={1.8} rotationIntensity={0.7} floatIntensity={1}>
          <mesh position={[0.8, -1.8, -0.8]}>
            <sphereGeometry args={[0.4, 32, 32]} />
            <meshStandardMaterial color={ACCENT} transparent opacity={0.35} />
          </mesh>
        </Float>

        <Sparkles
          count={80}
          scale={[10, 6, 4]}
          size={2}
          speed={0.25}
          color={ACCENT_SOFT}
          opacity={0.5}
        />
      </group>
    </group>
  );
}

export default function Hero3D() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setEnabled(!mq.matches);
    const onChange = (event) => setEnabled(!event.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Hormati preferensi "kurangi gerakan" — tidak render 3D sama sekali.
  if (!enabled) return null;

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -3, 2]} color={ACCENT} intensity={1.5} />
      <Scene />
    </Canvas>
  );
}
