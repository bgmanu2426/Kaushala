import React, { useState } from 'react';
import { Calendar, FileText } from 'lucide-react';
import { classes, students, attendanceRecords } from '../data/sampleData';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import AttendanceForm from '../components/attendance/AttendanceForm';
import AttendanceHistory from '../components/attendance/AttendanceHistory';

const Attendance: React.FC = () => {
  const { user } = useAuth();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [view, setView] = useState<'form' | 'history'>('history');
  const [records, setRecords] = useState(attendanceRecords);
  
  // Filter classes for current faculty
  const facultyClasses = classes.filter(cls => 
    user?.role === 'admin' || cls.faculty === user?.name
  );
  
  const selectedClass = facultyClasses.find(cls => cls.id === selectedClassId);
  
  // Filter students for selected class (in a real app, you'd have class-student associations)
  const classStudents = students.slice(0, selectedClass?.totalStudents || 0);
  
  // Filter records for selected class
  const filteredRecords = selectedClassId
    ? records.filter(record => record.classId === selectedClassId)
    : records;
  
  const handleAttendanceSubmit = (data: {
    classId: string;
    date: string;
    presentStudents: string[];
    absentStudents: string[];
  }) => {
    // Create new record
    const newRecord = {
      id: `${data.classId}-${data.date}`,
      classId: data.classId,
      date: data.date,
      presentStudents: data.presentStudents,
      absentStudents: data.absentStudents,
      totalStudents: data.presentStudents.length + data.absentStudents.length
    };
    
    // Check if record already exists
    const existingRecordIndex = records.findIndex(record => 
      record.classId === data.classId && record.date === data.date
    );
    
    if (existingRecordIndex >= 0) {
      // Update existing record
      const updatedRecords = [...records];
      updatedRecords[existingRecordIndex] = newRecord;
      setRecords(updatedRecords);
    } else {
      // Add new record
      setRecords([...records, newRecord]);
    }
    
    // Switch to history view after submission
    setView('history');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="mt-1 text-sm text-gray-500">
            Take and manage class attendance
          </p>
        </div>
        
        {selectedClassId && (
          <div className="flex space-x-3">
            <Button
              variant={view === 'form' ? 'primary' : 'outline'}
              leftIcon={<Calendar size={16} />}
              onClick={() => setView('form')}
            >
              Take Attendance
            </Button>
            <Button
              variant={view === 'history' ? 'primary' : 'outline'}
              leftIcon={<FileText size={16} />}
              onClick={() => setView('history')}
            >
              View History
            </Button>
          </div>
        )}
      </div>
      
      {/* Class selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {facultyClasses.map(cls => (
          <button
            key={cls.id}
            onClick={() => setSelectedClassId(cls.id)}
            className={`text-left transition-all ${
              selectedClassId === cls.id
                ? 'ring-2 ring-blue-500 ring-offset-2'
                : 'hover:bg-gray-50'
            }`}
          >
            <Card className="h-full">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {cls.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Code: {cls.code}
                </p>
                <p className="mt-2 text-sm text-gray-700">
                  {cls.subject}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  {cls.schedule}
                </p>
              </div>
            </Card>
          </button>
        ))}
      </div>
      
      {selectedClassId ? (
        <div className="mt-8">
          {view === 'form' && selectedClass && (
            <Card title={`Take Attendance: ${selectedClass.name}`}>
              <AttendanceForm
                classData={selectedClass}
                students={classStudents}
                onSubmit={handleAttendanceSubmit}
              />
            </Card>
          )}
          
          {view === 'history' && (
            <Card title="Attendance History">
              <AttendanceHistory records={filteredRecords} />
            </Card>
          )}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">Select a class to manage attendance</h3>
          <p className="mt-1 text-sm text-gray-500">
            Choose a class from the list above to take or view attendance
          </p>
        </div>
      )}
    </div>
  );
};

export default Attendance;