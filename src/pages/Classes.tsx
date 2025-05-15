import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Users, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { classes } from '../data/sampleData';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Classes: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter classes for current faculty and search term
  const filteredClasses = classes.filter(cls => {
    const belongsToFaculty = user?.role === 'admin' || cls.faculty === user?.name;
    const matchesSearch = 
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    return belongsToFaculty && matchesSearch;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your classes and their attendance
          </p>
        </div>
        
        <Button leftIcon={<PlusCircle size={16} />}>
          Add New Class
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative rounded-md shadow-sm max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search classes..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border-gray-300 rounded-md"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map(cls => (
          <Link
            key={cls.id}
            to={`/classes/${cls.id}`}
            className="block group"
          >
            <Card className="h-full transition-shadow group-hover:shadow-md">
              <div className="flex flex-col h-full">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                    {cls.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Code: {cls.code}
                  </p>
                  <p className="mt-2 text-sm text-gray-700">
                    {cls.subject}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={16} className="mr-1.5" />
                    {cls.schedule}
                  </div>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Users size={16} className="mr-1.5" />
                    {cls.totalStudents} Students
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 text-right">
                  <span className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-500">
                    View Details
                    <svg className="ml-1 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      
      {filteredClasses.length === 0 && (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">No classes found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm 
              ? `No classes match "${searchTerm}"`
              : 'You don\'t have any classes yet'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Classes;