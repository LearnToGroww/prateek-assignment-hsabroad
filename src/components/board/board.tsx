"use client";

import { useBoard } from '@/contexts/board-context';
import ColumnComponent from './column';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const Board = () => {
  const { columns, getTasksForColumn, moveTask, draggedTaskId, setDraggedTaskId } = useBoard();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
    e.preventDefault();
    if (draggedTaskId) {
      moveTask(draggedTaskId, columnId);
    }
    setDraggedTaskId(null);
    e.currentTarget.classList.remove('border-primary');
    e.currentTarget.classList.remove('bg-primary/10');
  };

  return (
    <div className="flex flex-col h-full w-full">
      <ScrollArea className="flex-grow w-full">
        <div className="flex gap-6 p-4 h-[calc(100vh-80px)]">
          {columns.map(column => (
            <ColumnComponent
              key={column.id}
              column={column}
              tasks={getTasksForColumn(column.id)}
              onDrop={handleDrop}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default Board;
