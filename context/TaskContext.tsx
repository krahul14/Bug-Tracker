'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TimeEntry } from '@/lib/types';
import { getTasks, saveTasks } from '@/lib/storage';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  addTimeEntry: (taskId: string, timeEntry: Omit<TimeEntry, 'id' | 'createdAt'>) => void;
  approveTask: (taskId: string) => void;
  reopenTask: (taskId: string) => void;
  refreshTasks: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    refreshTasks();
  }, []);

  const refreshTasks = () => {
    const allTasks = getTasks();
    setTasks(allTasks);
  };

  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const addTimeEntry = (taskId: string, timeEntryData: Omit<TimeEntry, 'id' | 'createdAt'>) => {
    const newTimeEntry: TimeEntry = {
      ...timeEntryData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            timeEntries: [...task.timeEntries, newTimeEntry],
            updatedAt: new Date().toISOString(),
          }
        : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const approveTask = (taskId: string) => {
    updateTask(taskId, { 
      status: 'closed',
      closedAt: new Date().toISOString(),
    });
  };

  const reopenTask = (taskId: string) => {
    updateTask(taskId, { 
      status: 'reopened',
      closedAt: undefined,
    });
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      createTask,
      updateTask,
      deleteTask,
      addTimeEntry,
      approveTask,
      reopenTask,
      refreshTasks,
    }}>
      {children}
    </TaskContext.Provider>
  );
};