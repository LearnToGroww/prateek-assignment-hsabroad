"use client";

import React, { useState } from 'react';
import type { Task } from '@/lib/types';
import { useBoard } from '@/contexts/board-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UserAvatar from './user-avatar';
import {
  AlertTriangle,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  GripVertical,
  MoreHorizontal,
  Trash2,
  Edit,
  Move,
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import TaskFormDialog from './task-form-dialog';

interface TaskCardProps {
  task: Task;
}



const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { setDraggedTaskId, deleteTask, moveTask, columns } = useBoard();
  const [isDragging, setIsDragging] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setDraggedTaskId(task.id);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setIsDragging(false);
  };

  return (
    <>
      <Card
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className={`cursor-grab active:cursor-grabbing transition-opacity ${
          isDragging ? 'opacity-50' : 'opacity-100'
        }`}
      >
        <CardHeader className="p-4 flex flex-row items-start justify-between">
          <CardTitle className="text-base font-medium leading-tight">{task.title}</CardTitle>
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded-md hover:bg-muted -mt-2 -mr-2 flex-shrink-0">
                  <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsTaskFormOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Move className="mr-2 h-4 w-4" />
                    <span>Move to</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {columns.filter(c => c.id !== task.columnId).map(c => (
                        <DropdownMenuItem key={c.id} onClick={() => moveTask(task.id, c.id)}>
                          {c.title}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the task.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteTask(task.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {task.description && (
            <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
          )}
          <div className="flex items-center justify-between">
            
            <div className="flex gap-2">
              {task.tags?.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      {isTaskFormOpen && (
        <TaskFormDialog
            open={isTaskFormOpen}
            onOpenChange={setIsTaskFormOpen}
            taskToEdit={task}
        />
      )}
    </>
  );
};

export default TaskCard;
