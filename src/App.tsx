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
  { id: "dropZone", draggables: [] },
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
    <div className="h-screen w-screen flex flex-col gap-4 justify-center items-center">
      <DragDropProvider
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
      >
        {dropZones.map((dz, index) => (
          <Droppable key={index} dropZone={dz} />
        ))}

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
    <button className="cursor-pointer" ref={ref}>
      <DraggableContent draggable={draggable} isDragging={isDragging} />
    </button>
  );
};

const Droppable = ({ dropZone }: { dropZone: DropZone }) => {
  const { id, draggables } = dropZone;
  const { ref } = useDroppable({ id, type: "zone", accept: "card" });
  return (
    <div
      ref={ref}
      className="border bg-black min-w-screen h-50 flex gap-5 flex-wrap grow"
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

// const BottomArea = ({ draggables }: { draggables: DraggableProps[] }) => {
//   const { ref } = useDroppable({ id: "bottomZone" });
//   return (
//     <div ref={ref} className=" flex flex-wrap  gap-2 ">
//       {draggables
//         .filter((draggable) => draggable.dz === undefined)
//         .map((draggable, index) => (
//           <Sortable
//             key={draggable.id}
//             index={index}
//             draggable={draggable}
//             group="bottomZone"
//           />
//         ))}
//     </div>
//   );
// };

const DraggableContent = ({
  draggable,
  isDragging,
}: {
  draggable: DraggableProps;
  isDragging?: boolean;
}) => {
  const { id, src } = draggable;
  return (
    <img
      src={`/src/assets/${src}`}
      alt={src}
      className="max-h-40"
      style={{ opacity: isDragging ? 0.2 : 1 }}
    />
  );
};
