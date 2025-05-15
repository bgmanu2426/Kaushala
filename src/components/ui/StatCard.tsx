import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon,
  change,
  className = '' 
}) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm ${className}`}>
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-blue-50 text-blue-600">
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd>
              <div className="text-lg font-semibold text-gray-900">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
      
      {change && (
        <div className="mt-4">
          <div className={`flex items-center text-sm ${
            change.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <span className="font-medium">
              {change.isPositive ? '+' : ''}{change.value}%
            </span>
            <span className="ml-2 text-gray-500">from last week</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;