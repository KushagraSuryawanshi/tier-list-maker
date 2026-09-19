import { useRef, useState } from "react";
import {
  DragDropProvider,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
} from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import type { DraggableProps, DropZone } from "./types/tier";
import { defaultDraggables, defaultDropZones } from "./data/tierData";
import TierDropZone from "./components/TierDropZone";
import FreeDropZone from "./components/FreeDropZone";
import DraggableContent from "./components/DraggableContent";

export default function App() {
  const [dropZones, setDropZones] = useState<DropZone[]>(defaultDropZones);
  const dragStartDropZones = useRef<DropZone[] | null>(null);
  const [activeDraggable, setActiveDraggable] = useState<
    DraggableProps | undefined
  >();

  const handleDragStart = (event: DragStartEvent) => {
    const { source } = event.operation;
    if (!source) return;

    dragStartDropZones.current = dropZones;

    const activeDraggable = defaultDraggables.find(
      (draggable) => draggable.id === source.id,
    );

    setActiveDraggable(activeDraggable);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { source, target } = event.operation;
    if (!source || !target) return;

    const activeId = source.id as string;
    const overId = target.id as string;

    const fromZoneData = dropZones.find((dz) =>
      dz.draggables.includes(activeId),
    );

    const toZoneData = dropZones.find((dz) => {
      return dz.id === overId || dz.draggables.includes(overId);
    });

    if (!fromZoneData || !toZoneData) return;

    const fromZone = fromZoneData.id;
    const toZone = toZoneData.id;

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
      if (!zone) return;

      const oldIndex = zone.draggables.findIndex((i) => i === activeId);
      const newIndex = zone.draggables.findIndex((i) => i === overId);

      if (oldIndex === -1 || newIndex === -1) return;

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
      const destinationZone = dropZones.find((dz) => dz.id === toZone);
      if (!destinationZone) return;

      const destinationIndex = destinationZone.draggables.findIndex(
        (id) => id === overId,
      );
      if (destinationIndex === -1) return;

      setDropZones((prev) =>
        prev.map((dz) => {
          const cleanedDraggables = dz.draggables.filter(
            (id) => id !== activeId,
          );

          if (dz.id === toZone) {
            return {
              ...dz,
              draggables: cleanedDraggables.toSpliced(
                destinationIndex,
                0,
                activeId,
              ),
            };
          }

          return { ...dz, draggables: cleanedDraggables };
        }),
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (
      (event.canceled || !event.operation.target) &&
      dragStartDropZones.current
    ) {
      setDropZones(dragStartDropZones.current);
    }
    dragStartDropZones.current = null;
    setActiveDraggable(undefined);
  };

  const freeDropZone = dropZones.find((dz) => dz.id === "free")!;

  return (
    <div className="min-h-screen w-full select-none bg-zinc-950 flex flex-col justify-start items-center gap-2 [@media(min-height:850px)]:gap-6 py-2 [@media(min-height:850px)]:py-6 px-3">
      <DragDropProvider
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
      >
        <div className="w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl border border-zinc-700">
          {dropZones
            .filter((dz) => dz.id !== "free")
            .map((dz) => (
              <TierDropZone key={dz.id} dropZone={dz} />
            ))}
        </div>
        <div className="w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl bg-zinc-800 border border-zinc-700 rounded-lg flex flex-col gap-1 [@media(min-height:850px)]:gap-3 p-2 [@media(min-height:850px)]:p-4">
          <p className="mb-1 [@media(min-height:850px)]:mb-3 text-sm font-medium text-zinc-400">
            Available Characters
          </p>

          <FreeDropZone dropZone={freeDropZone} />
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
