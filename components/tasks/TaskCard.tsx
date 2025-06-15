'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Task } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { useTask } from '@/context/TaskContext';
import { getUsers } from '@/lib/storage';
import { formatDistanceToNow, format } from 'date-fns';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  CheckCircle, 
  RotateCcw,
  Clock,
  Calendar,
  User,
} from 'lucide-react';
import { toast } from 'sonner';
import TimeEntryDialog from './TimeEntryDialog';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-700 border-gray-200',
  medium: 'bg-blue-100 text-blue-700 border-blue-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  critical: 'bg-red-100 text-red-700 border-red-200',
};

const statusColors = {
  open: 'bg-gray-100 text-gray-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  'pending-approval': 'bg-yellow-100 text-yellow-700',
  closed: 'bg-green-100 text-green-700',
  reopened: 'bg-orange-100 text-orange-700',
};

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const { user } = useAuth();
  const { updateTask, deleteTask, approveTask, reopenTask } = useTask();
  const [showTimeEntry, setShowTimeEntry] = useState(false);
  const users = getUsers();

  const assignee = users.find(u => u.id === task.assigneeId);
  const totalHours = task.timeEntries.reduce((total, entry) => total + entry.hours, 0);

  const canEdit = user?.role === 'manager' || task.assigneeId === user?.id;
  const canDelete = user?.role === 'manager' || task.createdBy === user?.id;
  const canApprove = user?.role === 'manager' && task.status === 'pending-approval';

  const handleStatusChange = (newStatus: Task['status']) => {
    updateTask(task.id, { status: newStatus });
    toast.success(`Task ${newStatus.replace('-', ' ')}`);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
      toast.success('Task deleted');
    }
  };

  const handleApprove = () => {
    approveTask(task.id);
    toast.success('Task approved and closed');
  };

  const handleReopen = () => {
    reopenTask(task.id);
    toast.success('Task reopened');
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-gray-900 line-clamp-2">
                {task.title}
              </h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canEdit && (
                    <DropdownMenuItem onClick={() => onEdit(task)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  
                  {task.assigneeId === user?.id && (
                    <>
                      {task.status === 'open' && (
                        <DropdownMenuItem onClick={() => handleStatusChange('in-progress')}>
                          <Play className="mr-2 h-4 w-4" />
                          Start Progress
                        </DropdownMenuItem>
                      )}
                      
                      {task.status === 'in-progress' && (
                        <DropdownMenuItem onClick={() => handleStatusChange('pending-approval')}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Request Approval
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuItem onClick={() => setShowTimeEntry(true)}>
                        <Clock className="mr-2 h-4 w-4" />
                        Log Time
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  {canApprove && (
                    <>
                      <DropdownMenuItem onClick={handleApprove}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve & Close
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleReopen}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reopen
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  {canDelete && (
                    <DropdownMenuItem 
                      onClick={handleDelete}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2">
              {task.description}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
              <Badge className={statusColors[task.status]}>
                {task.status.replace('-', ' ')}
              </Badge>
              {task.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{assignee?.name || 'Unassigned'}</span>
              </div>
              
              {totalHours > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{totalHours}h logged</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  Updated {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
                </span>
              </div>
              
              {task.dueDate && (
                <div className={`flex items-center gap-1 ${
                  new Date(task.dueDate) < new Date() && task.status !== 'closed'
                    ? 'text-red-500' 
                    : 'text-gray-400'
                }`}>
                  <Calendar className="h-3 w-3" />
                  <span>Due {format(new Date(task.dueDate), 'MMM dd')}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {showTimeEntry && (
        <TimeEntryDialog
          task={task}
          isOpen={showTimeEntry}
          onClose={() => setShowTimeEntry(false)}
        />
      )}
    </>
  );
}