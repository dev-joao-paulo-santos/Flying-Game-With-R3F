import React from 'react'

const Trees = () => {
    const trees = []
    for (let i = 0; i < 50; i++){
        const x = (Math.random() - 0.5) * 80;
        const z = (Math.random() - 0.5) * 80;
        trees.push(<Tree key={i} position={[x, 0, z]} />)
    }
  return <>{trees}</>
}

function Tree({position}){
    return (
        <mesh position={position}>
            <boxGeometry args={[.5, 2, .5]} />
            <meshBasicMaterial color="darkgreen" />
        </mesh>
    )
}

export default Trees