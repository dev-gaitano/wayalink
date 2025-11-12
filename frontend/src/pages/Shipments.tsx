import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Plus, Eye, Package } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';

export const Shipments = () => {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ total: 0, limit: 20, offset: 0 });

  useEffect(() => {
    fetchShipments();
  }, [statusFilter, pagination.offset]);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await api.getShipments({
        status: statusFilter || undefined,
        limit: pagination.limit,
        offset: pagination.offset
      });
      setShipments(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredShipments = shipments.filter(shipment =>
    shipment.tracking_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.origin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.destination.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    const headers = ['Tracking Code', 'Origin', 'Destination', 'Status', 'Created', 'Last Update'];
    const rows = filteredShipments.map(s => [
      s.tracking_code,
      s.origin.name,
      s.destination.name,
      s.status,
      new Date(s.created_at).toLocaleDateString(),
      new Date(s.last_update).toLocaleDateString()
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shipments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shipments</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage and track all shipments
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/shipments/new')}
            className="inline-flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Shipment
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by tracking code, origin, or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none appearance-none"
            >
              <option value="">All Statuses</option>
              <option value="Picked Up">Picked Up</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Damaged">Damaged</option>
              <option value="Lost">Lost</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Export */}
          <Button
            variant="secondary"
            onClick={exportToCSV}
            className="inline-flex items-center justify-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
            </div>
            <Package className="w-8 h-8 text-gray-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-yellow-600">
                {shipments.filter(s => s.status === 'In Transit').length}
              </p>
            </div>
            <Package className="w-8 h-8 text-yellow-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-green-600">
                {shipments.filter(s => s.status === 'Delivered').length}
              </p>
            </div>
            <Package className="w-8 h-8 text-green-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Issues</p>
              <p className="text-2xl font-bold text-red-600">
                {shipments.filter(s => s.status === 'Damaged' || s.status === 'Lost').length}
              </p>
            </div>
            <Package className="w-8 h-8 text-red-400" />
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card>
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading shipments...</p>
          </div>
        ) : filteredShipments.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No shipments found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
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
                  {filteredShipments.map((shipment) => (
                    <tr key={shipment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {shipment.tracking_code}
                        </div>
                        {shipment.description && (
                          <div className="text-xs text-gray-500">{shipment.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{shipment.origin.name}</div>
                        <div className="text-xs text-gray-500">{shipment.origin.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{shipment.destination.name}</div>
                        <div className="text-xs text-gray-500">{shipment.destination.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={shipment.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(shipment.last_update).toLocaleDateString()}
                        <div className="text-xs text-gray-400">
                          {new Date(shipment.last_update).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => navigate(`/shipments/${shipment.tracking_code}`)}
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

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} results
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.offset === 0}
                  onClick={() => setPagination(prev => ({ ...prev, offset: Math.max(0, prev.offset - prev.limit) }))}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!pagination.has_more}
                  onClick={() => setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }))}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

