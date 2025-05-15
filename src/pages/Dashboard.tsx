import React from 'react';
import { Users, BookOpen, Calendar, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  classes, 
  students, 
  attendanceRecords,
  getAttendanceStats 
} from '../data/sampleData';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import AttendanceChart from '../components/analytics/AttendanceChart';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const stats = getAttendanceStats();
  
  // Get most recent attendance rate for change calculation
  const recentRate = stats.dailyTrends[stats.dailyTrends.length - 1]?.attendanceRate || 0;
  const previousRate = stats.dailyTrends[stats.dailyTrends.length - 2]?.attendanceRate || 0;
  const attendanceChange = {
    value: Math.round((recentRate - previousRate) * 10) / 10,
    isPositive: recentRate >= previousRate
  };
  
  // Filter classes for the current faculty
  const facultyClasses = classes.filter(cls => 
    user?.role === 'admin' || cls.faculty === user?.name
  );
  
  // Calculate recent absentee percentage
  const recentRecords = attendanceRecords
    .filter(record => new Date(record.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  
  const totalAbsents = recentRecords.reduce((sum, record) => sum + record.absentStudents.length, 0);
  const totalStudentRecords = recentRecords.reduce((sum, record) => sum + record.totalStudents, 0);
  const absenteeRate = totalStudentRecords > 0 
    ? Math.round((totalAbsents / totalStudentRecords) * 1000) / 10 
    : 0;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of attendance statistics and performance
        </p>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Classes"
          value={facultyClasses.length}
          icon={<BookOpen size={24} />}
        />
        <StatCard
          title="Total Students"
          value={students.length}
          icon={<Users size={24} />}
        />
        <StatCard
          title="Attendance Rate"
          value={`${recentRate}%`}
          icon={<UserCheck size={24} />}
          change={attendanceChange}
        />
        <StatCard
          title="Absentee Rate"
          value={`${absenteeRate}%`}
          icon={<Calendar size={24} />}
          change={{
            value: Math.round(absenteeRate * 0.05 * 10) / 10,
            isPositive: false
          }}
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart 
          data={stats.dailyTrends} 
          title="Daily Attendance Trends" 
        />
        
        <Card title="Recent Classes">
          <div className="divide-y divide-gray-200">
            {facultyClasses.slice(0, 5).map(cls => (
              <Link 
                key={cls.id}
                to={`/classes/${cls.id}`} 
                className="block hover:bg-gray-50 transition-colors"
              >
                <div className="py-4 px-2 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{cls.name}</p>
                    <p className="text-sm text-gray-500">{cls.subject}</p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <p>{cls.schedule}</p>
                    <svg 
                      className="ml-1 w-5 h-5 text-gray-400" 
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link 
              to="/classes"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all classes
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;