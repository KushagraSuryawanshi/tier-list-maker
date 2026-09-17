import { useState } from "react";
import {
  DragDropProvider,
  useDraggable,
  useDroppable,
  type DragEndEvent,
} from "@dnd-kit/react";
import "./App.css";
import { useSortable } from "@dnd-kit/react/sortable";

type DraggableProps = {
  id: string;
  src: string;
  dz: undefined | string;
};
type SortableProps = {
  id: string;
  index: number;
};

const defaultDraggables: DraggableProps[] = [
  { id: crypto.randomUUID(), src: "LeviAckermanCard.png", dz:undefined },
  { id: crypto.randomUUID(), src: "MugenCard.png", dz:undefined },
  { id: crypto.randomUUID(), src: "GojoSatoruCard.png", dz:undefined },
  { id: crypto.randomUUID(), src: "NarutoUzumakiCard.png", dz:undefined },
  { id: crypto.randomUUID(), src: "GutsCard.png", dz:undefined },
  { id: crypto.randomUUID(), src: "MonkeyDLuffyCard.png", dz:undefined },
  { id: crypto.randomUUID(), src: "RoronoaZoroCard.png", dz: undefined },
  { id: crypto.randomUUID(), src: "ItachiUchihaCard.png", dz: undefined },
  { id: crypto.randomUUID(), src: "KakashiHatakeCard.png", dz: undefined },
  { id: crypto.randomUUID(), src: "EdwardElricCard.png", dz: undefined },
  { id: crypto.randomUUID(), src: "SpikeSpiegelCard.png", dz: undefined },
  { id: crypto.randomUUID(), src: "LightYagamiCard.png", dz: undefined },
  { id: crypto.randomUUID(), src: "KenKanekiCard.png", dz: undefined },
  { id: crypto.randomUUID(), src: "ErenYeagerCard.png", dz: undefined },
  { id: crypto.randomUUID(), src: "MikasaAckermanCard.png", dz: undefined },
  { id: crypto.randomUUID(), src: "VegetaCard.png", dz: undefined },
  { id: crypto.randomUUID(), src: "TanjiroKamadoCard.png", dz: undefined },
  { id: crypto.randomUUID(), src: "NezukoKamadoCard.png", dz: undefined },
  { id: crypto.randomUUID(), src: "IchigoKurosakiCard.png", dz: undefined },
  { id: crypto.randomUUID(), src: "JotaroKujoCard.png", dz: undefined },
  { id: crypto.randomUUID(), src: "KilluaZoldyckCard.png", dz: undefined },
  { id: crypto.randomUUID(), src: "GonFreecssCard.png", dz: undefined },
  { id: crypto.randomUUID(), src: "SaitamaCard.png", dz: undefined },
];

export default function App() {
  const [draggables, setDraggables] =
    useState<DraggableProps[]>(defaultDraggables);
  const [isDropped, setIsDropped] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    console.log(event);
    if (event.canceled) return;
    const { target, source } = event.operation;
    const overId = target.id as string;
    const activeDraggableId = source.id as string;

    setDraggables((prev) =>
      prev.map((draggable) =>
        draggable.id !== activeDraggableId
          ? draggable
          : { ...draggable, dz: overId },
      ),
    );
  };

  return (
    <div className="h-screen w-screen flex flex-col gap-4 justify-center items-center">
      <DragDropProvider onDragEnd={handleDragEnd}>
        <Droppable draggables={draggables} />
        <div className=" flex flex-wrap  gap-2 ">
          {draggables.map(
            (draggable) =>
              !draggable.dz && (
                <Draggable key={draggable.id} draggable={draggable} />
              ),
          )}
        </div>
      </DragDropProvider>
    </div>
  );
}

const Sortable = ({ id, index, src }) => {
  const { ref } = useSortable({ id, index });

  return (
    <button className="cursor-pointer" ref={ref}>
      <img src={`/src/assets/${src}`} alt={src} className="max-h-40" />
    </button>
  );
};

const Droppable = ({ draggables }: { draggables: DraggableProps[] }) => {
  const { ref } = useDroppable({ id: "dropZone" });
  return (
    <div
      ref={ref}
      className="border bg-black min-w-screen h-50 flex gap-5 flex-wrap grow"
    >
      {draggables.map(
        (draggable, index) =>
          draggable.dz && (
            <Sortable
              key={draggable.id}
              id={draggable.id}
              index={index}
              src={draggable.src}
            />
          ),
      )}
    </div>
  );
};

const Draggable = ({ draggable }: { draggable: DraggableProps }) => {
  const { id, src } = draggable;
  const { ref } = useDraggable({ id });
  return (
    <button className="cursor-pointer" ref={ref}>
      <img src={`/src/assets/${src}`} alt={src} className="max-h-40" />
    </button>
  );
};
