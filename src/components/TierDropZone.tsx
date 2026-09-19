import { useDroppable } from "@dnd-kit/react";
import type { DropZone } from "../types/tier";
import { Sortable } from "./SortableCard";
import { defaultDraggables } from "../data/tierData";

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

const dropZoneColorMap: Record<string, string> = {
  S: "rgb(255, 120, 130)",
  A: "rgb(255, 185, 120)",
  B: "#FFF27A",
  C: "rgb(165, 235, 120)",
  D: "rgb(120, 220, 145)",
};

export default Droppable;
