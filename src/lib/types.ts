import type { z } from 'zod';
import type { taskSchema } from '@/components/board/task-form-dialog';

export interface Assignee {
  id: string;
  name: string;
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignee?: Assignee;
  tags?: string[];
  columnId: string;
}

export type TaskFormData = z.infer<typeof taskSchema>;

export interface Column {
  id: string;
  title: string;
}
