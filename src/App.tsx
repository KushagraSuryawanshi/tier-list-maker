import { useState } from "react";
import {useDraggable} from '@dnd-kit/react';
import "./App.css";

type Draggable = {
  id: string;
  src: string;
};

const defaultDraggables: Draggable[] = [
  { id: crypto.randomUUID(), src: "LeviAckermanCard.png" },
  { id: crypto.randomUUID(), src: "MugenCard.png" },
  { id: crypto.randomUUID(), src: "GojoSatoruCard.png" },
  { id: crypto.randomUUID(), src: "NarutoUzumakiCard.png" },
  { id: crypto.randomUUID(), src: "GutsCard.png" },
  { id: crypto.randomUUID(), src: "MonkeyDLuffyCard.png" },
  { id: crypto.randomUUID(), src: "RoronoaZoroCard.png" },
  { id: crypto.randomUUID(), src: "ItachiUchihaCard.png" },
  { id: crypto.randomUUID(), src: "KakashiHatakeCard.png" },
  { id: crypto.randomUUID(), src: "EdwardElricCard.png" },
  { id: crypto.randomUUID(), src: "SpikeSpiegelCard.png" },
  { id: crypto.randomUUID(), src: "LightYagamiCard.png" },
  { id: crypto.randomUUID(), src: "KenKanekiCard.png" },
  { id: crypto.randomUUID(), src: "ErenYeagerCard.png" },
  { id: crypto.randomUUID(), src: "MikasaAckermanCard.png" },
  { id: crypto.randomUUID(), src: "VegetaCard.png" },
  { id: crypto.randomUUID(), src: "TanjiroKamadoCard.png" },
  { id: crypto.randomUUID(), src: "NezukoKamadoCard.png" },
  { id: crypto.randomUUID(), src: "IchigoKurosakiCard.png" },
  { id: crypto.randomUUID(), src: "JotaroKujoCard.png" },
  { id: crypto.randomUUID(), src: "KilluaZoldyckCard.png" },
  { id: crypto.randomUUID(), src: "GonFreecssCard.png" },
  { id: crypto.randomUUID(), src: "SaitamaCard.png" },
];

export default function App() {
  const [draggables, setDraggables] = useState<Draggable[]>(defaultDraggables);
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div>
        {draggables.map((draggable) => (
          <Draggable key={draggable.id} draggable={draggable} />
        ))}
      </div>
    </div>
  );
}

const Draggable = ({ draggable }: { draggable: Draggable }) => {
  const { id, src } = draggable;
  const {ref} = useDraggable({ id });
  return (
    <button className="cursor-pointer" ref={ref}>
      <img src={`/src/assets/${src}`} alt={src} className="max-h-40" />
    </button>
  );
};
