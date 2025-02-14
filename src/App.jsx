import { Canvas, useThree } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import * as THREE from "three";
import Trees from "./components/Trees";
import Airplane from "./components/Airplane";
import { Environment, OrbitControls } from "@react-three/drei";
import Ocean from "./components/Ocean";
import { useGLTF } from "@react-three/drei";

function App() {
  const {scene: aircraft} = useGLTF('/models/aircraft_carrier.glb')
  return (
    <Canvas>
      <Environment
        background
        files={[
          "./cloudy_sky/px.png",
          "./cloudy_sky/nx.png",
          "./cloudy_sky/py.png",
          "./cloudy_sky/ny.png",
          "./cloudy_sky/pz.png",
          "./cloudy_sky/nz.png",
        ]}
      />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Chão
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color="green" side={THREE.DoubleSide} />
      </mesh> */}

      {/* <Trees /> */}
      <Ocean />
      <Airplane />
        <primitive object={aircraft} position={[23, -8, 10]} scale={0.14}/>

      <OrbitControls />
    </Canvas>
  );
}

export default App;
