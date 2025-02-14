import { useFrame, useThree } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { DoubleSide } from "three";

const Enemy = ({ bullets, position, onDestroy, id }) => {
  const ref = useRef();
  const { scene } = useThree(); // ✅ Pegamos a cena corretamente
  const { scene: originalModel } = useGLTF("/models/red-jet.glb");

  const [health, setHealth] = useState(100);
  const [showHealthBar, setShowHealthBar] = useState(false);
  let hideHealthBarTimeout = null;

  const model = originalModel.clone();

  useFrame(() => {
    if (!ref.current) return;

    // 📌 Movimento básico (oscilação no ar)
    ref.current.position.z += 0.05;
    ref.current.position.y += Math.sin(ref.current.position.z * 0.1) * 0.01;

    // 🏹 Verificar se foi atingido por um tiro
    for (const bullet of bullets.current) {
      const distance = ref.current.position.distanceTo(bullet.position);

      if (distance < 2) {
        if (health <= 0) return;

        setHealth((prev) => {
          const newHealth = prev - 20;
          setShowHealthBar(true);

          if (hideHealthBarTimeout) clearTimeout(hideHealthBarTimeout);
          hideHealthBarTimeout = setTimeout(
            () => setShowHealthBar(false),
            3000
          );

          if (newHealth <= 0) {
            setTimeout(() => {
              if (ref.current && ref.current.parent) {
                scene.remove(ref.current); // ✅ Agora garantimos que a cena existe
                onDestroy(id); // ✅ Passamos corretamente o ID do inimigo
              }
            }, 100);
          }

          return Math.max(newHealth, 0);
        });

        // 🛠️ Remove o tiro da cena corretamente
        scene.remove(bullet);
        bullets.current = bullets.current.filter((b) => b !== bullet);
      }
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* ✈️ Corpo do inimigo */}
      <primitive object={model} scale={0.35} rotation={[0, -Math.PI / 2, 0]} />

      {/* 🏥 Barra de vida */}
      {showHealthBar && (
        <mesh position={[0, 1.5, 0]}>
          <planeGeometry args={[2, 0.2]} />
          <meshBasicMaterial color="black" side={DoubleSide} />
          <mesh position={[-1 + health / 100, 0, 0.01]}>
            <boxGeometry args={[(health / 100) * 2, 0.2, 0.1]} />
            <meshBasicMaterial color="red" side={DoubleSide} />
          </mesh>
        </mesh>
      )}
    </group>
  );
};

export default Enemy;
