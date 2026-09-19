import type { DraggableProps, DropZone } from "../types/tier";

export const defaultDraggables: DraggableProps[] = [
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

export const defaultDropZones: DropZone[] = [
  { id: "S", draggables: [] },
  { id: "A", draggables: [] },
  { id: "B", draggables: [] },
  { id: "C", draggables: [] },
  { id: "D", draggables: [] },
  {
    id: "free",
    draggables: defaultDraggables.map((draggable) => draggable.id),
  },
];