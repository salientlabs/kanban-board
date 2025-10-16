export type ColumnId = 
  | 'long-list'
  | 'short-list'
  | 'interview'
  | 'offer'
  | 'compliance'
  | 'onboarding'
  | 'hired';

export type Priority = 'high' | 'medium' | 'low';

export interface Application {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  status: string;
  columnId: ColumnId;
}

export interface Column {
  id: ColumnId;
  title: string;
  applications: Application[];
}