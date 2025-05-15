import { format, subDays } from 'date-fns';

// Types
export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
}

export interface Class {
  id: string;
  name: string;
  code: string;
  faculty: string;
  subject: string;
  schedule: string;
  totalStudents: number;
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  date: string;
  presentStudents: string[];
  absentStudents: string[];
  totalStudents: number;
}

// Generate sample data
export const students: Student[] = [
  { id: '1', name: 'John Smith', rollNumber: 'CS001', email: 'john@example.com' },
  { id: '2', name: 'Emma Johnson', rollNumber: 'CS002', email: 'emma@example.com' },
  { id: '3', name: 'Michael Brown', rollNumber: 'CS003', email: 'michael@example.com' },
  { id: '4', name: 'Sophia Martinez', rollNumber: 'CS004', email: 'sophia@example.com' },
  { id: '5', name: 'William Davis', rollNumber: 'CS005', email: 'william@example.com' },
  { id: '6', name: 'Olivia Wilson', rollNumber: 'CS006', email: 'olivia@example.com' },
  { id: '7', name: 'James Anderson', rollNumber: 'CS007', email: 'james@example.com' },
  { id: '8', name: 'Charlotte Thomas', rollNumber: 'CS008', email: 'charlotte@example.com' },
  { id: '9', name: 'Benjamin Taylor', rollNumber: 'CS009', email: 'benjamin@example.com' },
  { id: '10', name: 'Amelia Moore', rollNumber: 'CS010', email: 'amelia@example.com' },
  { id: '11', name: 'Ethan Jackson', rollNumber: 'CS011', email: 'ethan@example.com' },
  { id: '12', name: 'Mia White', rollNumber: 'CS012', email: 'mia@example.com' },
];

export const classes: Class[] = [
  { 
    id: '1', 
    name: 'Computer Science 101', 
    code: 'CS101', 
    faculty: 'Faculty User',
    subject: 'Introduction to Programming',
    schedule: 'Monday, Wednesday, Friday - 10:00 AM',
    totalStudents: 12
  },
  { 
    id: '2', 
    name: 'Data Structures', 
    code: 'CS201', 
    faculty: 'Faculty User',
    subject: 'Algorithms & Data Structures',
    schedule: 'Tuesday, Thursday - 1:00 PM',
    totalStudents: 10
  },
  { 
    id: '3', 
    name: 'Web Development', 
    code: 'CS301', 
    faculty: 'Faculty User',
    subject: 'Full Stack Development',
    schedule: 'Monday, Friday - 2:00 PM',
    totalStudents: 8
  },
  { 
    id: '4', 
    name: 'Database Systems', 
    code: 'CS401', 
    faculty: 'Admin User',
    subject: 'SQL & Database Design',
    schedule: 'Wednesday, Friday - 9:00 AM',
    totalStudents: 9
  },
];

// Generate attendance records for the past 2 weeks
export const generateAttendanceData = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  
  // For each class
  classes.forEach(cls => {
    // Generate records for past 14 days
    for (let i = 14; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      
      // Skip weekends
      const dayOfWeek = new Date(date).getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;
      
      // Randomly select present students
      const presentStudents: string[] = [];
      const absentStudents: string[] = [];
      
      students.forEach(student => {
        // 85% chance a student is present (for realistic data)
        if (Math.random() < 0.85) {
          presentStudents.push(student.id);
        } else {
          absentStudents.push(student.id);
        }
      });
      
      records.push({
        id: `${cls.id}-${date}`,
        classId: cls.id,
        date,
        presentStudents,
        absentStudents,
        totalStudents: presentStudents.length + absentStudents.length
      });
    }
  });
  
  return records;
};

export const attendanceRecords = generateAttendanceData();

// Generate analytics data
export const getAttendanceStats = () => {
  const classTrends = classes.map(cls => {
    const classRecords = attendanceRecords.filter(record => record.classId === cls.id);
    
    return {
      name: cls.name,
      code: cls.code,
      subject: cls.subject,
      avgAttendance: Math.round(
        (classRecords.reduce(
          (sum, record) => sum + (record.presentStudents.length / record.totalStudents) * 100, 
          0
        ) / classRecords.length) * 10
      ) / 10
    };
  });
  
  const dailyTrends = [...Array(14)].map((_, index) => {
    const date = format(subDays(new Date(), 13 - index), 'yyyy-MM-dd');
    const dayRecords = attendanceRecords.filter(record => record.date === date);
    
    if (dayRecords.length === 0) {
      return {
        date,
        attendanceRate: 0
      };
    }
    
    return {
      date,
      attendanceRate: Math.round(
        (dayRecords.reduce(
          (sum, record) => sum + (record.presentStudents.length / record.totalStudents) * 100, 
          0
        ) / dayRecords.length) * 10
      ) / 10
    };
  }).filter(item => item.attendanceRate > 0);
  
  return {
    classTrends,
    dailyTrends
  };
};