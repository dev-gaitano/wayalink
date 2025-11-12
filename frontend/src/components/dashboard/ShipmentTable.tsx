import React from 'react';
import { StatusBadge } from '../ui/StatusBadge';
import { Eye, MapPin } from 'lucide-react';

export const ShipmentTable = ({ shipments, onViewDetails, loading = false }) => {
  if (loading) {
    return (
      <div className="animate-pulse">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-16 bg-gray-100 rounded mb-2"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Tracking Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Origin
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Destination
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Last Update
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {shipments.map((shipment) => (
            <tr key={shipment.id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{shipment.tracking_code}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                  {shipment.origin.name}
                </div>
                <div className="text-xs text-gray-500">{shipment.origin.type}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                  {shipment.destination.name}
                </div>
                <div className="text-xs text-gray-500">{shipment.destination.type}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={shipment.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(shipment.last_update).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onViewDetails(shipment.tracking_code)}
                  className="text-primary-600 hover:text-primary-900 inline-flex items-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
