import { useSortable } from "@dnd-kit/react/sortable";
import type { DraggableProps } from "../types/tier";
import DraggableContent from "./DraggableContent";

export const Sortable = ({
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
