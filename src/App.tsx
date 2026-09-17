import { useState } from "react";
import {
  DragDropProvider,
  DragOverlay,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/react";
import "./App.css";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import { atom, useAtom, useAtomValue } from "jotai";

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
  { id: crypto.randomUUID(), src: "LeviAckermanCard.png", dz: undefined },
  { id: crypto.randomUUID(), src: "MugenCard.png", dz: undefined },
  { id: crypto.randomUUID(), src: "GojoSatoruCard.png", dz: undefined },
  { id: crypto.randomUUID(), src: "NarutoUzumakiCard.png", dz: undefined },
  { id: crypto.randomUUID(), src: "GutsCard.png", dz: undefined },
  { id: crypto.randomUUID(), src: "MonkeyDLuffyCard.png", dz: undefined },
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

const activeDraggableAtom = atom<DraggableProps>();

export default function App() {
  const [draggables, setDraggables] =
    useState<DraggableProps[]>(defaultDraggables);

  const [activeDraggable, setActiveDraggable] = useAtom(activeDraggableAtom);

  

  const handleDragStart = (event: DragStartEvent) => {
    const activeDraggable = draggables.find(
      (draggable) => draggable.id === event.operation.source.id,
    );
    setActiveDraggable(activeDraggable);
  };

    const handleDragOver = (event:DragOverEvent)=>{
     console.log(event);
    const { target, source } = event.operation;
    const overId = target.id as string;
    const activeDraggableId = source.id as string;

    if (isSortable(source)) {
      const { index, initialIndex } = source;
      const droppedItems = draggables.filter(
        (draggable) => draggable.dz === "dropZone",
      );
      const next = [...droppedItems];

      const [moved] = next.splice(initialIndex, 1);
      next.splice(index, 0, moved);

      let droppedIndex = 0;
      const merged = draggables.map((draggable) => {
        if (draggable.dz !== "dropZone") {
          return draggable;
        }
        const reorderedDraggable = next[droppedIndex];
        droppedIndex++;

        return reorderedDraggable;
      });

      setDraggables(merged);
      setActiveDraggable(undefined);

      return;
    }

    setDraggables((prev) =>
      prev.map((draggable) =>
        draggable.id !== activeDraggableId
          ? draggable
          : { ...draggable, dz: overId },
      ),
    );
  }

  const handleDragEnd = (event: DragEndEvent) => {
       if (event.canceled) return setActiveDraggable(undefined);

    setActiveDraggable(undefined);
  };

  return (
    <div className="h-screen w-screen flex flex-col gap-4 justify-center items-center">
      <DragDropProvider onDragEnd={handleDragEnd} onDragStart={handleDragStart} onDragOver={handleDragOver}>
        <Droppable draggables={draggables} />
        <div className=" flex flex-wrap  gap-2 ">
          {draggables.map(
            (draggable) =>
              !draggable.dz && (
                <Draggable key={draggable.id} draggable={draggable} />
              ),
          )}
        </div>
        <DragOverlay>
          {activeDraggable && (
            <button className="cursor-pointer">
              <DraggableContent draggable={activeDraggable} isDragging />
            </button>
          )}
        </DragOverlay>
      </DragDropProvider>
    </div>
  );
}

const Sortable = ({
  draggable,
  index,
}: {
  draggable: DraggableProps;
  index: number;
}) => {
  const { ref } = useSortable({ id: draggable.id, index });

  return (
    <button className="cursor-pointer" ref={ref}>
      <DraggableContent draggable={draggable} />
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
      {draggables
        .filter((draggable) => draggable.dz === "dropZone")
        .map((draggable, index) => (
          <Sortable key={draggable.id} draggable={draggable} index={index} />
        ))}
    </div>
  );
};

const Draggable = ({ draggable }: { draggable: DraggableProps }) => {
  const { id, src } = draggable;
  const { ref } = useDraggable({ id });
  return (
    <button className="cursor-pointer" ref={ref}>
      <DraggableContent draggable={draggable} />
    </button>
  );
};

const DraggableContent = ({
  draggable,
  isDragging,
}: {
  draggable: DraggableProps;
  isDragging?: boolean;
}) => {
  const { id, src } = draggable;
  const activeDraggableId = useAtomValue(activeDraggableAtom)?.id;
  return (
    <img
      src={`/src/assets/${src}`}
      alt={src}
      className="max-h-40"
      style={{ opacity: isDragging || activeDraggableId !== id ? 1 : 0.2 }}
    />
  );
};
