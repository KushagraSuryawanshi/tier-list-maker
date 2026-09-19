import type { DraggableProps } from "../types/tier";

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
      draggable={false}
      className="h-full w-auto object-contain block"
      style={{ opacity: isDragging ? 0.2 : 1 }}
    />
  );
};

export default DraggableContent;
