import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Users, Clock, BookOpen, ArrowLeft } from 'lucide-react';
import { classes, students, attendanceRecords } from '../data/sampleData';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import AttendanceHistory from '../components/attendance/AttendanceHistory';

const ClassDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'attendance'>('overview');
  
  // Find the selected class
  const classData = classes.find(cls => cls.id === id);
  
  if (!classData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Class not found</h2>
        <p className="mt-2 text-gray-500">The class you're looking for doesn't exist</p>
        <Link to="/classes" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
          Back to Classes
        </Link>
      </div>
    );
  }
  
  // Get class students
  const classStudents = students.slice(0, classData.totalStudents);
  
  // Get class attendance records
  const classAttendance = attendanceRecords.filter(record => record.classId === id);
  
  // Calculate attendance statistics
  const attendanceRate = classAttendance.length > 0
    ? Math.round(classAttendance.reduce(
        (sum, record) => sum + (record.presentStudents.length / record.totalStudents) * 100,
        0
      ) / classAttendance.length * 10) / 10
    : 0;
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'students', label: 'Students' },
    { id: 'attendance', label: 'Attendance' },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <Link 
          to="/classes"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Classes
        </Link>
        
        <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{classData.name}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Code: {classData.code} | Subject: {classData.subject}
            </p>
          </div>
          
          <div>
            <Link to={`/attendance`}>
              <Button>
                Take Attendance
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-blue-50 border border-blue-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <Users size={20} />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-blue-800">Total Students</p>
                  <p className="text-2xl font-semibold text-blue-900">{classData.totalStudents}</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-green-50 border border-green-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <Calendar size={20} />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-green-800">Attendance Rate</p>
                  <p className="text-2xl font-semibold text-green-900">{attendanceRate}%</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-indigo-50 border border-indigo-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                  <Clock size={20} />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-indigo-800">Schedule</p>
                  <p className="text-sm font-semibold text-indigo-900">{classData.schedule}</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-amber-50 border border-amber-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                  <BookOpen size={20} />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-amber-800">Subject</p>
                  <p className="text-sm font-semibold text-amber-900">{classData.subject}</p>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Recent Attendance">
              <AttendanceHistory records={classAttendance.slice(0, 5)} />
              <div className="mt-4 text-right">
                <button 
                  onClick={() => setActiveTab('attendance')}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View all attendance records
                </button>
              </div>
            </Card>
            
            <Card title="Class Information">
              <dl className="divide-y divide-gray-200">
                <div className="py-3 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Class Name</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{classData.name}</dd>
                </div>
                <div className="py-3 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Class Code</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{classData.code}</dd>
                </div>
                <div className="py-3 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Subject</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{classData.subject}</dd>
                </div>
                <div className="py-3 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Faculty</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{classData.faculty}</dd>
                </div>
                <div className="py-3 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Schedule</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{classData.schedule}</dd>
                </div>
                <div className="py-3 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Total Students</dt>
                  <dd className="text-sm text-gray-900 col-span-2">{classData.totalStudents}</dd>
                </div>
              </dl>
            </Card>
          </div>
        </div>
      )}
      
      {activeTab === 'students' && (
        <Card title="Enrolled Students">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Roll No
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Student Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {classStudents.map(student => (
                  <tr key={student.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {student.rollNumber}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {student.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {student.email}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button className="text-blue-600 hover:text-blue-900">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      
      {activeTab === 'attendance' && (
        <Card title="Attendance History">
          <AttendanceHistory records={classAttendance} />
        </Card>
      )}
    </div>
  );
};

export default ClassDetail;