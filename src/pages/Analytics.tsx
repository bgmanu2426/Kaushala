import React from 'react';
import { CalendarIcon, UsersIcon } from 'lucide-react';
import { getAttendanceStats } from '../data/sampleData';
import Card from '../components/ui/Card';
import AttendanceChart from '../components/analytics/AttendanceChart';
import ClassComparisonChart from '../components/analytics/ClassComparisonChart';

const Analytics: React.FC = () => {
  const stats = getAttendanceStats();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Visual analytics for attendance and participation trends
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart 
          data={stats.dailyTrends} 
          title="Daily Attendance Trends" 
        />
        
        <ClassComparisonChart
          data={stats.classTrends}
          title="Class Comparison"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Top Performers">
          <div className="space-y-4">
            {stats.classTrends
              .sort((a, b) => b.avgAttendance - a.avgAttendance)
              .slice(0, 3)
              .map((cls, index) => (
                <div key={cls.code} className="flex items-center">
                  <div className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-medium
                    ${index === 0 ? 'bg-amber-100 text-amber-800' : 
                      index === 1 ? 'bg-gray-100 text-gray-800' : 
                      'bg-orange-100 text-orange-800'}
                  `}>
                    {index + 1}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">{cls.name}</h3>
                      <p className="text-sm font-medium text-blue-600">{cls.avgAttendance}%</p>
                    </div>
                    <p className="text-sm text-gray-500">{cls.subject}</p>
                  </div>
                </div>
              ))}
          </div>
        </Card>
        
        <Card title="Insights">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Daily Attendance Pattern</h3>
                  <p className="mt-1 text-sm text-blue-700">
                    Attendance tends to be higher in the middle of the week and decreases on Mondays and Fridays.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <UsersIcon className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Subject Popularity</h3>
                  <p className="mt-1 text-sm text-green-700">
                    Classes with interactive content show consistently higher attendance rates by 12% on average.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-indigo-800">Overall Trend</h3>
                  <p className="mt-1 text-sm text-indigo-700">
                    Overall attendance has improved by 4.2% compared to the previous month.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;