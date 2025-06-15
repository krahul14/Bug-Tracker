'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';

export interface TaskFilters {
  search: string;
  status: string[];
  priority: string[];
  assignee: string[];
  sortBy: 'createdAt' | 'updatedAt' | 'priority' | 'dueDate';
  sortOrder: 'asc' | 'desc';
}

interface TaskFiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  assignees: Array<{ id: string; name: string }>;
}

const statusOptions = [
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'pending-approval', label: 'Pending Approval' },
  { value: 'closed', label: 'Closed' },
  { value: 'reopened', label: 'Reopened' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const sortOptions = [
  { value: 'createdAt', label: 'Created Date' },
  { value: 'updatedAt', label: 'Updated Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'dueDate', label: 'Due Date' },
];

export default function TaskFiltersComponent({ 
  filters, 
  onFiltersChange, 
  assignees 
}: TaskFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof TaskFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'status' | 'priority' | 'assignee', value: string) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    updateFilter(key, updated);
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: [],
      priority: [],
      assignee: [],
      sortBy: 'updatedAt',
      sortOrder: 'desc',
    });
  };

  const activeFiltersCount = 
    filters.status.length + 
    filters.priority.length + 
    filters.assignee.length + 
    (filters.search ? 1 : 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div>
              <Label>Sort By</Label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => updateFilter('sortBy', value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Order</Label>
              <Select
                value={filters.sortOrder}
                onValueChange={(value) => updateFilter('sortOrder', value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Desc</SelectItem>
                  <SelectItem value="asc">Asc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label>Status</Label>
              <div className="mt-2 space-y-2">
                {statusOptions.map(option => (
                  <div key={option.value} className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant={filters.status.includes(option.value) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleArrayFilter('status', option.value)}
                      className="justify-start flex-1"
                    >
                      {option.label}
                      {filters.status.includes(option.value) && (
                        <X className="ml-2 h-3 w-3" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Priority</Label>
              <div className="mt-2 space-y-2">
                {priorityOptions.map(option => (
                  <div key={option.value} className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant={filters.priority.includes(option.value) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleArrayFilter('priority', option.value)}
                      className="justify-start flex-1"
                    >
                      {option.label}
                      {filters.priority.includes(option.value) && (
                        <X className="ml-2 h-3 w-3" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Assignee</Label>
              <div className="mt-2 space-y-2">
                {assignees.map(assignee => (
                  <div key={assignee.id} className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant={filters.assignee.includes(assignee.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleArrayFilter('assignee', assignee.id)}
                      className="justify-start flex-1"
                    >
                      {assignee.name}
                      {filters.assignee.includes(assignee.id) && (
                        <X className="ml-2 h-3 w-3" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}