import React from 'react';

export const StatusBadge = ({ status }) => {
  const statusConfig = {
    'Picked Up': {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      dot: 'bg-blue-500'
    },
    'In Transit': {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      dot: 'bg-yellow-500'
    },
    'Delivered': {
      bg: 'bg-green-100',
      text: 'text-green-700',
      dot: 'bg-green-500'
    },
    'Damaged': {
      bg: 'bg-red-100',
      text: 'text-red-700',
      dot: 'bg-red-500'
    },
    'Lost': {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      dot: 'bg-gray-500'
    },
    'pending': {
      bg: 'bg-gray-100',
      text: 'text-gray-600',
      dot: 'bg-gray-400'
    }
  };

  const config = statusConfig[status] || statusConfig['pending'];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot} mr-1.5`}></span>
      {status}
    </span>
  );
};
