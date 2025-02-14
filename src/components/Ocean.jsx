import React, { useRef, useMemo } from "react";
import { extend, useThree, useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water.js";

extend({ Water });

function Ocean() {
  const ref = useRef();
  const { gl, camera } = useThree(); // Pegamos a câmera para mover o oceano junto com ela
  const waterNormals = useLoader(
    THREE.TextureLoader,
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/waternormals.jpg"
  );

  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

  const geom = useMemo(() => new THREE.PlaneGeometry(500, 500, 656, 656), []);
  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(1, 1, 1), // Direção da luz para reflexos realistas
      sunColor: 0xffccaa, // Cor do sol refletido
      waterColor: 0x0064b5, // Cor azulada da água
      distortionScale: 20, // Distorsão da água (quanto mais alto, mais agitada)
      fog: false,
      format: gl.encoding,
    }),
    [waterNormals]
  );

  useFrame((state, delta) => {
    // 🌊 Mantém a posição do oceano seguindo a câmera (efeito infinito)
    if (ref.current) {
      ref.current.position.x = camera.position.x;
      ref.current.position.z = camera.position.z;
      ref.current.material.uniforms.time.value += delta;
    }
  });

  return (
    <water
      ref={ref}
      args={[geom, config]}
      rotation-x={-Math.PI / 2}
      position={[0, -4, 0]}
    />
  );
}

export default Ocean;
