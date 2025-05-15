import React, { useState } from 'react';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';
import Button from '../ui/Button';
import { Student, Class } from '../../data/sampleData';

interface AttendanceFormProps {
  classData: Class;
  students: Student[];
  onSubmit: (data: {
    classId: string;
    date: string;
    presentStudents: string[];
    absentStudents: string[];
  }) => void;
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({ 
  classData, 
  students, 
  onSubmit
}) => {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [attendance, setAttendance] = useState<Record<string, boolean>>(
    // Initialize all students as present
    students.reduce((acc, student) => {
      acc[student.id] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );
  
  const handleAttendanceChange = (studentId: string, isPresent: boolean) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: isPresent
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const presentStudents: string[] = [];
    const absentStudents: string[] = [];
    
    // Sort students into present and absent
    Object.entries(attendance).forEach(([studentId, isPresent]) => {
      if (isPresent) {
        presentStudents.push(studentId);
      } else {
        absentStudents.push(studentId);
      }
    });
    
    onSubmit({
      classId: classData.id,
      date,
      presentStudents,
      absentStudents
    });
  };
  
  const presentCount = Object.values(attendance).filter(Boolean).length;
  const absentCount = students.length - presentCount;
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{classData.name}</h3>
            <p className="text-sm text-gray-500">{classData.subject}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
                Present: {presentCount}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">
                Absent: {absentCount}
              </span>
            </div>
          </div>
        </div>
        
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
                  Status
                </th>
                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {students.map(student => (
                <tr key={student.id} className={!attendance[student.id] ? 'bg-red-50' : ''}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {student.rollNumber}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {student.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      attendance[student.id] 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {attendance[student.id] ? 'Present' : 'Absent'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                    <div className="flex justify-end items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleAttendanceChange(student.id, true)}
                        className={`p-1.5 rounded-full ${
                          attendance[student.id] 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-500'
                        }`}
                      >
                        <Check size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAttendanceChange(student.id, false)}
                        className={`p-1.5 rounded-full ${
                          !attendance[student.id] 
                            ? 'bg-red-100 text-red-600' 
                            : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500'
                        }`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Save Attendance
        </Button>
      </div>
    </form>
  );
};

export default AttendanceForm;