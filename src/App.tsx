import { useState } from "react";
import {
  DragDropProvider,
  DragOverlay,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
} from "@dnd-kit/react";
import "./App.css";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";

type DraggableProps = {
  id: string;
  src: string;
};
type DropZone = {
  id: string;
  draggables: string[];
};

const defaultDraggables: DraggableProps[] = [
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

const defaultDropZones: DropZone[] = [
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

export default function App() {
  const [draggables, setDraggables] =
    useState<DraggableProps[]>(defaultDraggables);

  const [dropZones, setDropZones] = useState<DropZone[]>(defaultDropZones);

  const [activeDraggable, setActiveDraggable] = useState<
    DraggableProps | undefined
  >();
  const handleDragStart = (event: DragStartEvent) => {
    const activeDraggable = draggables.find(
      (draggable) => draggable.id === event.operation.source.id,
    );
    setActiveDraggable(activeDraggable);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { source, target } = event.operation;
    if (!target) return;
    const activeId = source.id as string;
    const overId = target.id as string;

    const fromZone = dropZones.find((dz) =>
      dz.draggables.includes(activeId),
    ).id;

    const toZone = dropZones.find((dz) => {
      return dz.id === overId || dz.draggables.includes(overId);
    }).id;

    // dropping card in empty part of any dropzone
    if (dropZones.some((dz) => dz.id === overId)) {
      setDropZones((prev) =>
        prev.map((dz) => {
          const cleanedDraggables = dz.draggables.filter(
            (id) => id !== activeId,
          );
          return dz.id === overId
            ? { ...dz, draggables: [...cleanedDraggables, activeId] }
            : {
                ...dz,
                draggables: cleanedDraggables,
              };
        }),
      );
    }

    // dropping card on another card in same zone
    else if (fromZone === toZone && isSortable(source)) {
      const zone = dropZones.find((dz) => dz.id === toZone);

      const oldIndex = zone.draggables.findIndex((i) => i === activeId);
      const newIndex = zone.draggables.findIndex((i) => i === overId);

      if (oldIndex !== newIndex) {
        setDropZones((prev) =>
          prev.map((dz) => {
            if (dz.id !== toZone) {
              return dz;
            }

            const moved = dz.draggables[oldIndex];
            const withoutMoved = dz.draggables.toSpliced(oldIndex, 1);
            const next = withoutMoved.toSpliced(newIndex, 0, moved);

            return { ...dz, draggables: next };
          }),
        );
      }
    }

    // dropping a card on to another card in a different zone
    else if (fromZone !== toZone) {
      const destinationIndex = dropZones
        .find((dz) => dz.id === toZone)
        .draggables.findIndex((id) => id === overId);

      setDropZones((prev) =>
        prev.map((dz) => {
          const cleanedDraggables = dz.draggables.filter(
            (id) => id !== activeId,
          );
          let newSortedDraggables;
          if (dz.id === toZone) {
            newSortedDraggables = cleanedDraggables.toSpliced(
              destinationIndex,
              0,
              activeId,
            );
          }
          return dz.id === toZone
            ? { ...dz, draggables: newSortedDraggables }
            : { ...dz, draggables: cleanedDraggables };
        }),
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.canceled || !event.operation.target) {
      setActiveDraggable(undefined);
      return;
    }
    setActiveDraggable(undefined);
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 flex flex-col justify-start items-center gap-2 [@media(min-height:850px)]:gap-6 py-2 [@media(min-height:850px)]:py-6 px-3">
      <DragDropProvider
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
      >
        <div className="w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl border border-zinc-700">
          {dropZones
            .filter((dz) => dz.id !== "free")
            .map((dz) => (
              <Droppable key={dz.id} dropZone={dz} />
            ))}
        </div>
        <div className="w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl bg-zinc-800 border border-zinc-700 rounded-lg flex flex-col gap-1 [@media(min-height:850px)]:gap-3 p-2 [@media(min-height:850px)]:p-4">
          <p className="mb-1 [@media(min-height:850px)]:mb-3 text-sm font-medium text-zinc-400">
            Available Characters
          </p>

          <FreeDropZone dropZone={dropZones.find((dz) => dz.id === "free")} />
        </div>

        <DragOverlay>
          {activeDraggable && (
            <button className="cursor-pointer">
              <DraggableContent draggable={activeDraggable} />
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
  group,
}: {
  draggable: DraggableProps;
  index: number;
  group: string;
}) => {
  const { ref, isDragging } = useSortable({
    id: draggable.id,
    index,
    group,
    type: "card",
    accept: "card",
  });

  return (
    <button
      className="cursor-grab active:cursor-grabbing h-16 [@media(min-height:850px)]:h-28 shrink-0"
      ref={ref}
    >
      <DraggableContent draggable={draggable} isDragging={isDragging} />
    </button>
  );
};

const Droppable = ({ dropZone }: { dropZone: DropZone }) => {
  const { id, draggables } = dropZone;
  const { ref } = useDroppable({ id, type: "zone", accept: "card" });

  const backgroundColor = dropZoneColorMap[id];
  return (
    <div
      ref={ref}
      className="w-full min-h-20 [@media(min-height:850px)]:min-h-32 bg-zinc-800 border-b border-zinc-950 flex"
    >
      <div
        className="w-16 [@media(min-height:850px)]:w-28 shrink-0 self-stretch flex justify-center items-center text-2xl [@media(min-height:850px)]:text-4xl font-bold text-zinc-950"
        style={{ backgroundColor }}
      >
        {id}
      </div>
      <div className="flex-1 flex flex-wrap items-start gap-1 p-1 [@media(min-height:850px)]:gap-2 [@media(min-height:850px)]:p-2">
        {draggables.map((draggableId, index) => {
          const draggable = defaultDraggables.find(
            (draggable) => draggable.id === draggableId,
          );
          if (!draggable) return null;
          return (
            <Sortable
              key={draggable.id}
              draggable={draggable}
              index={index}
              group={id}
            />
          );
        })}
      </div>
    </div>
  );
};
const FreeDropZone = ({ dropZone }: { dropZone: DropZone }) => {
  const { id, draggables } = dropZone;
  const { ref } = useDroppable({ id, type: "zone", accept: "card" });

  return (
    <div
      ref={ref}
      className="w-full min-h-20 [@media(min-height:850px)]:min-h-40 bg-zinc-900 rounded-md flex flex-wrap items-start justify-center gap-1 [@media(min-height:850px)]:gap-3 p-1 [@media(min-height:850px)]:p-3"
    >
      {draggables.map((draggableId, index) => {
        const draggable = defaultDraggables.find(
          (draggable) => draggable.id === draggableId,
        );
        if (!draggable) return null;
        return (
          <Sortable
            key={draggable.id}
            draggable={draggable}
            index={index}
            group={id}
          />
        );
      })}
    </div>
  );
};

const DraggableContent = ({
  draggable,
  isDragging,
}: {
  draggable: DraggableProps;
  isDragging?: boolean;
}) => {
  const { src } = draggable;
  return (
    <img
      src={`/src/assets/${src}`}
      alt={src}
      className="h-full w-auto object-contain block"
      style={{ opacity: isDragging ? 0.2 : 1 }}
    />
  );
};

const dropZoneColorMap = {
  S: "rgb(255, 120, 130)",
  A: "rgb(255, 185, 120)",
  B: "#FFF27A",
  C: "rgb(165, 235, 120)",
  D: "rgb(120, 220, 145)",
};
