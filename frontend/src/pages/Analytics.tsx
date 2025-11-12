import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Package, Clock, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { api } from '../api/client';

export const Analytic = () => {
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch status distribution
      const statusRes = await api.getStatusDistribution();
      setStatusDistribution(statusRes.data.data);

      // Fetch timeline
      const timelineRes = await api.getShipmentsTimeline(timeRange);
      setTimeline(timelineRes.data.data);

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = {
    'Picked Up': '#3B82F6',
    'In Transit': '#F59E0B',
    'Delivered': '#10B981',
    'Damaged': '#EF4444',
    'Lost': '#6B7280',
    'pending': '#9CA3AF'
  };

  const totalShipments = statusDistribution.reduce((sum, item) => sum + item.count, 0);
  const deliveredCount = statusDistribution.find(s => s.status === 'Delivered')?.count || 0;
  const deliveryRate = totalShipments > 0 ? (deliveredCount / totalShipments * 100).toFixed(1) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-sm text-gray-600">
          Insights and performance metrics
        </p>
      </div>

      {/* Time Range Selector */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Time Range</h2>
          <div className="flex space-x-2">
            {[7, 14, 30, 60, 90].map(days => (
              <button
                key={days}
                onClick={() => setTimeRange(days)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeRange === days
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Shipments</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalShipments}</p>
                </div>
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Package className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Delivery Rate</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{deliveryRate}%</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Transit</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">
                    {statusDistribution.find(s => s.status === 'In Transit')?.count || 0}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Issues</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">
                    {statusDistribution.filter(s => s.status === 'Damaged' || s.status === 'Lost')
                      .reduce((sum, item) => sum + item.count, 0)}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Status Distribution Pie Chart */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.status}: ${entry.count}`}
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.status] || '#gray'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Status Distribution Bar Chart */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipments by Status</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Timeline Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipments Over Time</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Shipments Created"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}
    </div>
  );
};
