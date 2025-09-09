"use client";

import React, { useState } from 'react';
import type { Column, Task } from '@/lib/types';
import TaskCard from './task-card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useBoard } from '@/contexts/board-context';
import TaskFormDialog from './task-form-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ColumnProps {
  column: Column;
  tasks: Task[];
  onDrop: (e: React.DragEvent<HTMLDivElement>, columnId: string) => void;
}

const ColumnComponent: React.FC<ColumnProps> = ({ column, tasks, onDrop }) => {
  const { draggedTaskId } = useBoard();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    setIsOver(false);
  };
  
  const handleDropInternal = (e: React.DragEvent<HTMLDivElement>) => {
    onDrop(e, column.id);
    setIsOver(false);
  }

  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDropInternal}
        className={`flex flex-col w-80 flex-shrink-0 h-full rounded-lg transition-colors ${
          isOver && draggedTaskId ? 'bg-primary/10' : ''
        }`}
      >
        <div className="flex items-center justify-between p-3 bg-muted rounded-t-lg">
          <h3 className="font-semibold">{column.title}</h3>
          <span className="text-sm font-medium text-muted-foreground bg-background rounded-full px-2 py-0.5">
            {tasks.length}
          </span>
        </div>
        <ScrollArea className="flex-1">
            <div className="p-3 flex flex-col gap-4">
            {tasks.map(task => (
                <TaskCard key={task.id} task={task} />
            ))}
            </div>
        </ScrollArea>
        <div className="p-3 mt-auto">
          <Button variant="ghost" className="w-full justify-start" onClick={() => setIsTaskFormOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add task
          </Button>
        </div>
      </div>
      <TaskFormDialog
        open={isTaskFormOpen}
        onOpenChange={setIsTaskFormOpen}
        columnId={column.id}
      />
    </>
  );
};

export default ColumnComponent;
