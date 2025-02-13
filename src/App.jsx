import { Canvas } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import * as THREE from 'three'
import Trees from "./components/Trees";
import Airplane from "./components/Airplane";
import { Environment, OrbitControls } from "@react-three/drei";

function App() {
  return (
      <Canvas>
        <Environment
        background
        files={[
          "./sky/px.png",
          "./sky/nx.png",
          "./sky/py.png",
          "./sky/ny.png",
          "./sky/pz.png",
          "./sky/nz.png",
        ]}
        />
        <ambientLight intensity={0.5}/>
        <directionalLight position={[10, 10, 5]} intensity={1}/>

        {/* Chão */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color="green" side={THREE.DoubleSide}/>
        </mesh>

        <Trees />

        <Airplane />

        <OrbitControls />
      </Canvas>
  );
}

export default App;
