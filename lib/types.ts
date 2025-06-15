export interface User {
  id: string;
  name: string;
  email: string;
  role: 'developer' | 'manager';
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'pending-approval' | 'closed' | 'reopened';
  assigneeId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  closedAt?: string;
  tags: string[];
  comments: Comment[];
  timeEntries: TimeEntry[];
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  description: string;
  hours: number;
  date: string;
  createdAt: string;
}

export interface DashboardStats {
  totalTasks: number;
  openTasks: number;
  inProgressTasks: number;
  pendingApprovalTasks: number;
  closedTasks: number;
  totalTimeSpent: number;
}

export interface TrendData {
  date: string;
  tasksWorked: number;
  tasksCompleted: number;
  hoursSpent: number;
}