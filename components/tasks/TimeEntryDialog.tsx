'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Task } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { useTask } from '@/context/TaskContext';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface TimeEntryDialogProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export default function TimeEntryDialog({ task, isOpen, onClose }: TimeEntryDialogProps) {
  const { user } = useAuth();
  const { addTimeEntry } = useTask();
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const hoursNum = parseFloat(hours);
    if (isNaN(hoursNum) || hoursNum <= 0) {
      toast.error('Please enter valid hours');
      return;
    }

    setIsSubmitting(true);
    try {
      addTimeEntry(task.id, {
        taskId: task.id,
        userId: user.id,
        description,
        hours: hoursNum,
        date,
      });
      
      toast.success(`${hoursNum} hours logged for task`);
      onClose();
      
      // Reset form
      setHours('');
      setDescription('');
      setDate(format(new Date(), 'yyyy-MM-dd'));
    } catch (error) {
      toast.error('Failed to log time');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log Time</DialogTitle>
          <p className="text-sm text-gray-600 mt-1">{task.title}</p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hours">Hours Spent</Label>
              <Input
                id="hours"
                type="number"
                step="0.25"
                min="0"
                placeholder="0.0"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What did you work on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Logging...' : 'Log Time'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}