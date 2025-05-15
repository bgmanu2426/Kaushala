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
import Card from '../ui/Card';

interface ClassData {
  name: string;
  code: string;
  subject: string;
  avgAttendance: number;
}

interface ClassComparisonChartProps {
  data: ClassData[];
  title: string;
}

const ClassComparisonChart: React.FC<ClassComparisonChartProps> = ({ data, title }) => {
  // Format data for display
  const formattedData = data.map(item => ({
    ...item,
    displayName: item.code
  }));
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const classData = data.find(item => item.code === label);
      
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-sm rounded-md">
          <p className="font-medium">{classData?.name}</p>
          <p className="text-sm text-gray-500">{classData?.subject}</p>
          <p className="text-blue-600 mt-1">
            Avg. Attendance: {payload[0].value}%
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
            layout="vertical"
            margin={{
              top: 5,
              right: 30,
              left: 60,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis 
              type="number" 
              domain={[0, 100]} 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              unit="%"
            />
            <YAxis 
              type="category" 
              dataKey="displayName" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="avgAttendance" 
              name="Average Attendance" 
              fill="#6366F1" 
              radius={[0, 4, 4, 0]} 
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ClassComparisonChart;