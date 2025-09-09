"use client";

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import type { Task, Column, Assignee, TaskFormData } from '@/lib/types';
import { initialColumns } from '@/lib/data';
import { socketService } from '@/lib/socket';

interface BoardContextType {
  tasks: Task[];
  columns: Column[];
  assignees: Assignee[];
  filters: {
    searchTerm: string;
    assignee: string;
    
  };
  setFilters: React.Dispatch<React.SetStateAction<BoardContextType['filters']>>;
  getTasksForColumn: (columnId: string) => Task[];
  addTask: (taskData: TaskFormData) => void;
  updateTask: (taskId: string, taskData: TaskFormData) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, newColumnId: string) => void;
  draggedTaskId: string | null;
  setDraggedTaskId: (id: string | null) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns] = useState<Column[]>(initialColumns);
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    searchTerm: '',
    assignee: 'all',
    
  });

  useEffect(() => {
    const socket = socketService.connect();

    socket.on('initial-data', ({ tasks: initialTasks, assignees: initialAssignees }) => {
      console.log('Received initial data:', { tasks: initialTasks, assignees: initialAssignees });
      setTasks(initialTasks);
      setAssignees(initialAssignees);
    });

    socket.on('task-added', (newTask) => {
      console.log('Task added via socket:', newTask);
      setTasks(prev => [...prev, newTask]);
    });

    socket.on('task-updated', (updatedTask) => {
      console.log('Task updated via socket:', updatedTask);
      setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
    });

    socket.on('task-deleted', (taskId) => {
      console.log('Task deleted via socket:', taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    });

    socket.on('task-moved', ({ taskId, newColumnId }) => {
      console.log('Task moved via socket:', { taskId, newColumnId });
      setTasks(prev => prev.map(task => task.id === taskId ? { ...task, columnId: newColumnId } : task));
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const addTask = useCallback((taskData: TaskFormData) => {
    const socket = socketService.getSocket();
    if (socket) {
      const taskPayload = {
        columnId: taskData.columnId,
        title: taskData.title,
        description: taskData.description,
        
        tags: [],
      };
      console.log('Emitting add-task:', taskPayload);
      socket.emit('add-task', taskPayload);
    }
  }, []);

  const updateTask = useCallback((taskId: string, taskData: TaskFormData) => {
    const socket = socketService.getSocket();
    if (socket) {
      const updatePayload = {
        title: taskData.title,
        description: taskData.description,
        
        tags: [],
      };
      console.log('Emitting update-task:', { taskId, taskData: updatePayload });
      socket.emit('update-task', { taskId, taskData: updatePayload });
    }
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    const socket = socketService.getSocket();
    if (socket) {
      console.log('Emitting delete-task:', taskId);
      socket.emit('delete-task', taskId);
    }
  }, []);

  const moveTask = useCallback((taskId: string, newColumnId: string) => {
    const socket = socketService.getSocket();
    if (socket) {
      console.log('Emitting move-task:', { taskId, newColumnId });
      socket.emit('move-task', { taskId, newColumnId });
    }
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const searchTermMatch =
        filters.searchTerm === '' ||
        task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const assigneeMatch =
        filters.assignee === 'all' || task.assignee?.id === filters.assignee;
      
      return searchTermMatch && assigneeMatch;
    });
  }, [tasks, filters]);

  const getTasksForColumn = useCallback(
    (columnId: string) => {
      return filteredTasks.filter(task => task.columnId === columnId);
    },
    [filteredTasks]
  );

  const value = {
    tasks,
    columns,
    assignees,
    filters,
    setFilters,
    getTasksForColumn,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    draggedTaskId,
    setDraggedTaskId,
  };

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
};

export const useBoard = (): BoardContextType => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
};
