import { useDroppable } from "@dnd-kit/react";
import type { DropZone } from "../types/tier";
import { defaultDraggables } from "../data/tierData";
import { Sortable } from "./SortableCard";

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
export default FreeDropZone;
