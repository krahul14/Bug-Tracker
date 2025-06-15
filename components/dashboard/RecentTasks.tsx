'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { getUsers } from '@/lib/storage';

interface RecentTasksProps {
  tasks: Task[];
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

const statusColors = {
  open: 'bg-gray-100 text-gray-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  'pending-approval': 'bg-yellow-100 text-yellow-700',
  closed: 'bg-green-100 text-green-700',
  reopened: 'bg-orange-100 text-orange-700',
};

export default function RecentTasks({ tasks }: RecentTasksProps) {
  const users = getUsers();
  const recentTasks = tasks
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Unknown User';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentTasks.map((task) => (
          <div key={task.id} className="flex items-start space-x-3 p-3 rounded-lg border">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {task.title}
              </p>
              <p className="text-sm text-gray-500">
                Assigned to {getUserName(task.assigneeId)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <Badge className={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
              <Badge className={statusColors[task.status]}>
                {task.status.replace('-', ' ')}
              </Badge>
            </div>
          </div>
        ))}
        {recentTasks.length === 0 && (
          <p className="text-gray-500 text-center py-4">No recent tasks</p>
        )}
      </CardContent>
    </Card>
  );
}