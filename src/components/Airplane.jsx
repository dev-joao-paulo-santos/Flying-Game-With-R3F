import { useFrame, useThree } from "@react-three/fiber";
import React, { useRef, useState, useEffect } from "react";
import useSound from "use-sound";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

import shotSound from "/sounds/shot.wav";
import Enemies from "./Enemies";

const Airplane = () => {
  const ref = useRef();
  const { camera, gl, scene } = useThree(); // Pegamos a câmera e o canvas
  const { scene: airplaneModel } = useGLTF("/models/concept_jet.glb");

  // Estados de controle
  const [targetSpeed, setTargetSpeed] = useState(2); // Velocidade alvo (para aceleração gradual)
  const [currentSpeed, setCurrentSpeed] = useState(2); // Velocidade atual
  const [roll, setRoll] = useState(0); // Inclinação no eixo Z (roll)
  const targetRotation = useRef(new THREE.Euler()); // Rotação desejada pelo mouse
  const bullets = useRef([]); //Armazenamento de tiros ativos

  const [playshot] = useSound(shotSound, { volume: 0.5 });

  useFrame((_, delta) => {
    if (!ref.current) return;

    // 🔄 Aceleração gradual da velocidade
    setCurrentSpeed((prev) => THREE.MathUtils.lerp(prev, targetSpeed, 0.02));

    // ✈️ Inclinação (roll com A/D)
    ref.current.rotation.z = THREE.MathUtils.lerp(
      ref.current.rotation.z,
      roll,
      0.1
    );

    // 🌬️ Simulação de vento/turbulência (pequenos movimentos aleatórios)
    const turbulence = (Math.random() - 0.5) * 0.00005;
    ref.current.rotation.x += turbulence;
    ref.current.rotation.y += turbulence;

    // ✈️ Calcula direção do avião
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyQuaternion(ref.current.quaternion);

    // 🏁 Move o avião para frente
    ref.current.position.addScaledVector(direction, currentSpeed * delta * 5);

    // 🎯 Suaviza a rotação para seguir o mouse
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      targetRotation.current.x,
      0.1
    );
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      targetRotation.current.y,
      0.1
    );

    // 📸 Câmera segue o avião dinamicamente
    const cameraOffset = new THREE.Vector3(0, 2, 8);
    cameraOffset.applyQuaternion(ref.current.quaternion);
    const cameraPosition = ref.current.position.clone().add(cameraOffset);
    camera.position.lerp(cameraPosition, 0.1);
    camera.lookAt(ref.current.position);

    bullets.current.forEach((bullet, index) => {
      bullet.position.addScaledVector(bullet.userData.direction, delta * -160);

      //Remoção de tiros que foram muito longe
      if (bullet.position.length() > 500) {
        scene.remove(bullet);
        bullets.current.splice(index, 1);
      }
    });
  });

  // 🖱️ Captura do movimento do mouse e converte para rotação
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (document.pointerLockElement !== gl.domElement) return;

      const sensitivity = 0.005;
      targetRotation.current.y -= e.movementX * sensitivity; // 🔄 Correção no YAW
      targetRotation.current.x -= e.movementY * sensitivity; // 🔄 Correção no Pitch
    };

    const lockMouse = () => {
      gl.domElement.requestPointerLock();
    };

    gl.domElement.addEventListener("mousemove", handleMouseMove);
    gl.domElement.addEventListener("click", lockMouse);

    return () => {
      gl.domElement.removeEventListener("mousemove", handleMouseMove);
      gl.domElement.removeEventListener("click", lockMouse);
    };
  }, [gl]);

  // ⌨️ Controles do teclado (roll e velocidade)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "w") setTargetSpeed(10); // Aumenta suavemente a velocidade
      if (e.key === "s") setTargetSpeed(1); // Diminui a velocidade
      if (e.key === "a") setRoll(1.5); // Inclinação para esquerda
      if (e.key === "d") setRoll(-1.5); // Inclinação para direita
      if (e.key === " ") shoot();
    };

    const handleKeyUp = (e) => {
      if (e.key === "w" || e.key === "s") setTargetSpeed(2); // Volta para velocidade média
      if (e.key === "a" || e.key === "d") setRoll(0);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  //função para atirar
  const shoot = () => {
    if (!ref.current) return;

    playshot();

    // Posições dos canhões (ajuste conforme necessário)
    const gunOffsets = [
      new THREE.Vector3(0.3, -0.2, -1.5), // Metralhadora direita
      new THREE.Vector3(-0.3, -0.2, -1.5), // Metralhadora esquerda
    ];

    gunOffsets.forEach((offset) => {
      // Criar a bala
      const bullet = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 16, 16),
        new THREE.MeshBasicMaterial({ color: "yellow" })
      );

      // Definir a posição inicial relativa ao avião
      const worldOffset = offset.clone().applyMatrix4(ref.current.matrixWorld);
      bullet.position.copy(worldOffset);

      // Definir a direção da bala (na direção que o avião está apontando)
      bullet.userData.direction = new THREE.Vector3();
      bullet.userData.direction.copy(
        ref.current.getWorldDirection(new THREE.Vector3())
      );

      // Adicionar bala na cena
      scene.add(bullet);
      bullets.current.push(bullet);
    });
  };

  return (
    <>
      <group ref={ref} position={[0, 0, 0]} scale={2}>
        <primitive object={airplaneModel} rotation={[0, -Math.PI, 0]} />
      </group>
      <Enemies bullets={bullets} />
    </>
  );
};

export default Airplane;
