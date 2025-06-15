import { User, Task, TimeEntry } from './types';

const USERS_KEY = 'bug_tracker_users';
const TASKS_KEY = 'bug_tracker_tasks';
const CURRENT_USER_KEY = 'bug_tracker_current_user';

// Default users
const defaultUsers: User[] = [
  {
    id: '1',
    name: 'John Developer',
    email: 'john@example.com',
    role: 'developer',
  },
  {
    id: '2',
    name: 'Sarah Manager',
    email: 'sarah@example.com',
    role: 'manager',
  },
  {
    id: '3',
    name: 'Mike Developer',
    email: 'mike@example.com',
    role: 'developer',
  },
];

// Default tasks
const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'Fix login validation bug',
    description: 'The login form is not properly validating email format',
    priority: 'high',
    status: 'in-progress',
    assigneeId: '1',
    createdBy: '2',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    dueDate: '2024-01-20T00:00:00Z',
    tags: ['bug', 'authentication'],
    comments: [],
    timeEntries: [
      {
        id: '1',
        taskId: '1',
        userId: '1',
        description: 'Investigating validation logic',
        hours: 2.5,
        date: '2024-01-15',
        createdAt: '2024-01-15T14:30:00Z',
      },
    ],
  },
  {
    id: '2',
    title: 'Implement dark mode toggle',
    description: 'Add dark mode support throughout the application',
    priority: 'medium',
    status: 'open',
    assigneeId: '3',
    createdBy: '2',
    createdAt: '2024-01-14T09:00:00Z',
    updatedAt: '2024-01-14T09:00:00Z',
    dueDate: '2024-01-25T00:00:00Z',
    tags: ['feature', 'ui'],
    comments: [],
    timeEntries: [],
  },
];

export const initializeStorage = () => {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }
  
  if (!localStorage.getItem(TASKS_KEY)) {
    localStorage.setItem(TASKS_KEY, JSON.stringify(defaultTasks));
  }
};

export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return defaultUsers;
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : defaultUsers;
};

export const getTasks = (): Task[] => {
  if (typeof window === 'undefined') return defaultTasks;
  const tasks = localStorage.getItem(TASKS_KEY);
  return tasks ? JSON.parse(tasks) : defaultTasks;
};

export const saveTasks = (tasks: Task[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const authenticateUser = (email: string, password: string): User | null => {
  const users = getUsers();
  // Simple authentication - in real app, this would be secure
  const user = users.find(u => u.email === email);
  if (user && password === 'password123') {
    return user;
  }
  return null;
};