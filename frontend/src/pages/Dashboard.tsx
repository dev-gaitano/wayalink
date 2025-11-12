import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, AlertCircle, MapPin, Users } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { ShipmentTable } from '../components/dashboard/ShipmentTable';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { Card } from '../components/ui/Card';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsRes = await fetch('http://localhost:5001/api/dashboard/stats');
      const statsData = await statsRes.json();
      setStats(statsData.data);

      // Fetch recent shipments
      const shipmentsRes = await fetch('http://localhost:5001/api/shipments?limit=10');
      const shipmentsData = await shipmentsRes.json();
      setShipments(shipmentsData.data);

      // Fetch recent activity
      const activityRes = await fetch('http://localhost:5001/api/dashboard/recent-activity?limit=10');
      const activityData = await activityRes.json();
      setActivities(activityData.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleViewDetails = (trackingCode) => {
    // Navigate to shipment detail page
    window.location.href = `/shipments/${trackingCode}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Overview of your logistics operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Shipments"
          value={stats?.total_shipments || 0}
          icon={Package}
          loading={loading}
        />
        <StatCard
          title="Active Shipments"
          value={stats?.active_shipments || 0}
          icon={Truck}
          loading={loading}
        />
        <StatCard
          title="Delivered"
          value={stats?.delivered_shipments || 0}
          icon={CheckCircle}
          trend="up"
          trendValue={`${stats?.delivery_rate || 0}%`}
          loading={loading}
        />
        <StatCard
          title="Issues"
          value={stats?.problem_shipments || 0}
          icon={AlertCircle}
          loading={loading}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Locations</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats?.total_locations || 0}
              </p>
            </div>
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats?.total_users || 0}
              </p>
            </div>
            <Users className="w-8 h-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Events Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats?.events_today || 0}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-gray-400" />
          </div>
        </Card>
      </div>

      {/* Recent Shipments & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Shipments - 2/3 width */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Shipments</h2>
            <ShipmentTable
              shipments={shipments}
              onViewDetails={handleViewDetails}
              loading={loading}
            />
          </Card>
        </div>

        {/* Activity Feed - 1/3 width */}
        <div>
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <ActivityFeed activities={activities} loading={loading} />
          </Card>
        </div>
      </div>
    </div>
  );
};
