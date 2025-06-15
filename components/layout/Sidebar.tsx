'use client';

import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  BarChart3,
  Bug,
  Clock,
  Home,
  Plus,
  Settings,
  Users,
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    roles: ['developer', 'manager'],
  },
  {
    name: 'My Tasks',
    href: '/tasks',
    icon: Bug,
    roles: ['developer'],
  },
  {
    name: 'All Tasks',
    href: '/tasks',
    icon: Bug,
    roles: ['manager'],
  },
  {
    name: 'Create Task',
    href: '/tasks/create',
    icon: Plus,
    roles: ['developer', 'manager'],
  },
  {
    name: 'Time Tracking',
    href: '/time-tracking',
    icon: Clock,
    roles: ['developer', 'manager'],
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    roles: ['manager'],
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const filteredNavigation = navigation.filter(item =>
    item.roles.includes(user.role)
  );

  return (
    <aside className="w-64 bg-white border-r">
      <nav className="p-4 space-y-2">
        {filteredNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = 
            pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          
          return (
            <Button
              key={item.name}
              variant={isActive ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start',
                isActive && 'bg-blue-600 text-white hover:bg-blue-700'
              )}
              onClick={() => router.push(item.href)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.name}
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}