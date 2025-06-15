'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTask } from '@/context/TaskContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import TaskFiltersComponent, { TaskFilters } from '@/components/tasks/TaskFilters';
import TaskCard from '@/components/tasks/TaskCard';
import { Button } from '@/components/ui/button';
import { Task } from '@/lib/types';
import { getUsers } from '@/lib/storage';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import TaskFormDialog from '@/components/tasks/TaskFormDialog';

export default function TasksPage() {
  const { user } = useAuth();
  const { tasks } = useTask();
  const router = useRouter();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    status: [],
    priority: [],
    assignee: [],
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  });

  const users = getUsers();
  const assignees = users.map(u => ({ id: u.id, name: u.name }));

  const userTasks = useMemo(() => {
    let filteredTasks = tasks;
    
    // Filter by user role
    if (user?.role === 'developer') {
      filteredTasks = tasks.filter(task => task.assigneeId === user.id);
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Apply status filter
    if (filters.status.length > 0) {
      filteredTasks = filteredTasks.filter(task =>
        filters.status.includes(task.status)
      );
    }

    // Apply priority filter
    if (filters.priority.length > 0) {
      filteredTasks = filteredTasks.filter(task =>
        filters.priority.includes(task.priority)
      );
    }

    // Apply assignee filter
    if (filters.assignee.length > 0) {
      filteredTasks = filteredTasks.filter(task =>
        filters.assignee.includes(task.assigneeId)
      );
    }

    // Apply sorting
    filteredTasks.sort((a, b) => {
      let aValue: any = a[filters.sortBy];
      let bValue: any = b[filters.sortBy];

      if (filters.sortBy === 'priority') {
        const priorityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
      } else if (filters.sortBy === 'dueDate') {
        aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      } else {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (filters.sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    return filteredTasks;
  }, [tasks, user, filters]);

  if (!user) return null;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">
                    {user.role === 'manager' ? 'All Tasks' : 'My Tasks'}
                  </h2>
                  <p className="text-gray-600">
                    {userTasks.length} task{userTasks.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Task
                </Button>
              </div>

              <TaskFiltersComponent
                filters={filters}
                onFiltersChange={setFilters}
                assignees={assignees}
              />

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {userTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={setEditingTask}
                  />
                ))}
              </div>

              {userTasks.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No tasks found</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Try adjusting your filters or create a new task
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {showCreateDialog && (
        <TaskFormDialog
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
        />
      )}

      {editingTask && (
        <TaskFormDialog
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </>
  );
}