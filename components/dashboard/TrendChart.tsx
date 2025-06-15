'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendData } from '@/lib/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface TrendChartProps {
  data: TrendData[];
}

export default function TrendChart({ data }: TrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Activity Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="tasksWorked"
              stroke="#3B82F6"
              strokeWidth={2}
              name="Tasks Worked"
            />
            <Line
              type="monotone"
              dataKey="tasksCompleted"
              stroke="#10B981"
              strokeWidth={2}
              name="Tasks Completed"
            />
            <Line
              type="monotone"
              dataKey="hoursSpent"
              stroke="#F59E0B"
              strokeWidth={2}
              name="Hours Spent"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}