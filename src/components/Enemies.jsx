import { useEffect, useState } from "react";
import Enemy from "./Enemy";

const Enemies = ({ bullets }) => {
  const [enemies, setEnemies] = useState([]);
  const [wave, setWave] = useState(1);
  const [waveActive, setWaveActive] = useState(false);

  // 🚀 Iniciar uma nova horda
  const startNewWave = () => {
    setWaveActive(true);
    const enemyCount = 2 ** (wave - 1);

    const newEnemies = Array.from({ length: enemyCount }).map(() => ({
      id: Math.random(),
      position: [
        (Math.random() - 0.5) * 100,
        Math.random() * 20 + 5,
        -Math.random() * 200 - 50,
      ],
    }));

    setEnemies(newEnemies);
  };

  // 🛠️ Monitorar a quantidade de inimigos
  useEffect(() => {
    if (enemies.length === 0 && waveActive) {
      setWaveActive(false);
      setTimeout(() => {
        setWave((prev) => prev + 1);
        startNewWave();
      }, 3000);
    }
  }, [enemies, waveActive]);

  // 🚀 Começar a primeira horda
  useEffect(() => {
    startNewWave();
  }, []);

  return (
    <>
      {enemies.map((enemy) => (
        <Enemy
          key={enemy.id}
          id={enemy.id}
          bullets={bullets}
          position={enemy.position}
          onDestroy={(id) => {
            setEnemies((prev) => prev.filter((e) => e.id !== id));
          }}
        />
      ))}
    </>
  );
};

export default Enemies;
    