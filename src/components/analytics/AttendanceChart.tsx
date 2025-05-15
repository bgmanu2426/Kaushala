import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from 'recharts';
import { format, parseISO } from 'date-fns';
import Card from '../ui/Card';

interface AttendanceChartProps {
  data: Array<{
    date: string;
    attendanceRate: number;
  }>;
  title: string;
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({ data, title }) => {
  // Format dates for display
  const formattedData = data.map(item => ({
    ...item,
    formattedDate: format(parseISO(item.date), 'MMM dd')
  }));
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">
            Attendance: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card title={title} className="h-full">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="formattedDate" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 100]} 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              unit="%"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="attendanceRate" 
              name="Attendance Rate" 
              fill="#3B82F6" 
              radius={[4, 4, 0, 0]} 
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default AttendanceChart;