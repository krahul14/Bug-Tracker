'use client';

import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTask } from '@/context/TaskContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Task, TimeEntry } from '@/lib/types';
import { getUsers } from '@/lib/storage';
import { format } from 'date-fns';
import { Clock, Calendar, User } from 'lucide-react';

export default function TimeTrackingPage() {
  const { user } = useAuth();
  const { tasks } = useTask();
  const users = getUsers();

  const timeData = useMemo(() => {
    let relevantTasks = tasks;
    
    // Filter tasks based on user role
    if (user?.role === 'developer') {
      relevantTasks = tasks.filter(task => task.assigneeId === user.id);
    }

    // Get all time entries with task and user information
    const allTimeEntries: (TimeEntry & { task: Task; userName: string })[] = [];
    
    relevantTasks.forEach(task => {
      task.timeEntries.forEach(entry => {
        const entryUser = users.find(u => u.id === entry.userId);
        allTimeEntries.push({
          ...entry,
          task,
          userName: entryUser?.name || 'Unknown User',
        });
      });
    });

    // Sort by date (newest first)
    allTimeEntries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Calculate totals
    const totalHours = allTimeEntries.reduce((sum, entry) => sum + entry.hours, 0);
    const totalEntries = allTimeEntries.length;
    
    // Group by user
    const byUser = allTimeEntries.reduce((acc, entry) => {
      if (!acc[entry.userId]) {
        acc[entry.userId] = {
          userName: entry.userName,
          hours: 0,
          entries: 0,
        };
      }
      acc[entry.userId].hours += entry.hours;
      acc[entry.userId].entries += 1;
      return acc;
    }, {} as Record<string, { userName: string; hours: number; entries: number }>);

    // Group by task
    const byTask = allTimeEntries.reduce((acc, entry) => {
      if (!acc[entry.taskId]) {
        acc[entry.taskId] = {
          task: entry.task,
          hours: 0,
          entries: 0,
        };
      }
      acc[entry.taskId].hours += entry.hours;
      acc[entry.taskId].entries += 1;
      return acc;
    }, {} as Record<string, { task: Task; hours: number; entries: number }>);

    return {
      allTimeEntries,
      totalHours,
      totalEntries,
      byUser: Object.values(byUser),
      byTask: Object.values(byTask),
    };
  }, [tasks, user, users]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Time Tracking</h2>
              <p className="text-gray-600">
                {user.role === 'manager' ? 'Team time tracking overview' : 'Your time tracking summary'}
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
                  <Clock className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{timeData.totalHours.toFixed(1)}h</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Time Entries</CardTitle>
                  <Calendar className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{timeData.totalEntries}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average per Entry</CardTitle>
                  <Clock className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {timeData.totalEntries > 0 
                      ? (timeData.totalHours / timeData.totalEntries).toFixed(1) 
                      : '0'
                    }h
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Time by User */}
              {user.role === 'manager' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Time by Developer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {timeData.byUser.map((userData, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{userData.userName}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{userData.hours.toFixed(1)}h</div>
                            <div className="text-sm text-gray-500">{userData.entries} entries</div>
                          </div>
                        </div>
                      ))}
                      {timeData.byUser.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No time entries found</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Time by Task */}
              <Card>
                <CardHeader>
                  <CardTitle>Time by Task</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {timeData.byTask
                      .sort((a, b) => b.hours - a.hours)
                      .slice(0, 10)
                      .map((taskData, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium line-clamp-1">{taskData.task.title}</h4>
                            <div className="text-right ml-2">
                              <div className="font-semibold">{taskData.hours.toFixed(1)}h</div>
                              <div className="text-sm text-gray-500">{taskData.entries} entries</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {taskData.task.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {taskData.task.status.replace('-', ' ')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    {timeData.byTask.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No time entries found</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Time Entries */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Time Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {timeData.allTimeEntries.slice(0, 10).map((entry) => (
                    <div key={entry.id} className="flex items-start justify-between p-3 border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-1">{entry.task.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <span>{entry.userName}</span>
                          <span>•</span>
                          <span>{format(new Date(entry.date), 'MMM dd, yyyy')}</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-semibold text-lg">{entry.hours}h</div>
                      </div>
                    </div>
                  ))}
                  {timeData.allTimeEntries.length === 0 && (
                    <p className="text-gray-500 text-center py-8">
                      No time entries found. Start logging time on your tasks!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}