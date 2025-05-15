import React from 'react';
import { format, parseISO } from 'date-fns';
import { AttendanceRecord, students, classes } from '../../data/sampleData';

interface AttendanceHistoryProps {
  records: AttendanceRecord[];
}

const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({ records }) => {
  // Sort records by date, most recent first
  const sortedRecords = [...records].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  if (records.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-gray-50">
        <p className="text-gray-500">No attendance records found</p>
      </div>
    );
  }
  
  const getClassName = (classId: string) => {
    const cls = classes.find(c => c.id === classId);
    return cls ? cls.name : 'Unknown Class';
  };
  
  const getAttendanceRate = (record: AttendanceRecord) => {
    return ((record.presentStudents.length / record.totalStudents) * 100).toFixed(1);
  };
  
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
              Date
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Class
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Present
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Absent
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Attendance Rate
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {sortedRecords.map(record => (
            <tr key={record.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                {format(parseISO(record.date), 'MMM dd, yyyy')}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {getClassName(record.classId)}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-green-600">
                {record.presentStudents.length}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-red-600">
                {record.absentStudents.length}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${getAttendanceRate(record)}%` }}
                    ></div>
                  </div>
                  <span>{getAttendanceRate(record)}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceHistory;