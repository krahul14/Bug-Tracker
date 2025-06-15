'use client';

import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTask } from '@/context/TaskContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import StatsCards from '@/components/dashboard/StatsCards';
import TrendChart from '@/components/dashboard/TrendChart';
import RecentTasks from '@/components/dashboard/RecentTasks';
import { DashboardStats, TrendData } from '@/lib/types';
import { subDays, format } from 'date-fns';

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks } = useTask();

  const userTasks = useMemo(() => {
    if (user?.role === 'manager') {
      return tasks;
    }
    return tasks.filter(task => task.assigneeId === user?.id);
  }, [tasks, user]);

  const stats: DashboardStats = useMemo(() => {
    const totalTasks = userTasks.length;
    const openTasks = userTasks.filter(t => t.status === 'open').length;
    const inProgressTasks = userTasks.filter(t => t.status === 'in-progress').length;
    const pendingApprovalTasks = userTasks.filter(t => t.status === 'pending-approval').length;
    const closedTasks = userTasks.filter(t => t.status === 'closed').length;
    const totalTimeSpent = userTasks.reduce((total, task) => {
      return total + task.timeEntries.reduce((taskTotal, entry) => taskTotal + entry.hours, 0);
    }, 0);

    return {
      totalTasks,
      openTasks,
      inProgressTasks,
      pendingApprovalTasks,
      closedTasks,
      totalTimeSpent,
    };
  }, [userTasks]);

  const trendData: TrendData[] = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const dayTasks = userTasks.filter(task => {
        const taskDate = format(new Date(task.updatedAt), 'yyyy-MM-dd');
        return taskDate === dateStr;
      });

      const tasksWorked = dayTasks.filter(t => 
        t.status === 'in-progress' || t.status === 'pending-approval'
      ).length;
      
      const tasksCompleted = dayTasks.filter(t => t.status === 'closed').length;
      
      const hoursSpent = dayTasks.reduce((total, task) => {
        return total + task.timeEntries
          .filter(entry => entry.date === dateStr)
          .reduce((entryTotal, entry) => entryTotal + entry.hours, 0);
      }, 0);

      return {
        date: format(date, 'MMM dd'),
        tasksWorked,
        tasksCompleted,
        hoursSpent,
      };
    }).reverse();

    return last7Days;
  }, [userTasks]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Welcome back, {user.name.split(' ')[0]}!
              </h2>
              <p className="text-gray-600">
                Here's what's happening with your {user.role === 'manager' ? 'team' : 'tasks'} today.
              </p>
            </div>

            <StatsCards stats={stats} />

            <div className="grid gap-6 lg:grid-cols-2">
              <TrendChart data={trendData} />
              <RecentTasks tasks={userTasks} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}