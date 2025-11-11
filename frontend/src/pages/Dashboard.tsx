import { useState } from 'react';
import { Package, Truck, CheckCircle, AlertCircle, MapPin, Users } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { ShipmentTable } from '@/components/dashboard/ShipmentTable';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  // Sample data - in real app this would come from API
  const [loading] = useState(false);
  
  const stats = {
    total_shipments: 2453,
    active_shipments: 324,
    delivered_shipments: 2089,
    problem_shipments: 12,
    delivery_rate: 98.5,
    total_locations: 47,
    total_users: 156,
    total_customers: 892
  };
  
  const shipments = [
    {
      id: 1,
      tracking_code: 'WL-2024-001',
      origin: { name: 'Lagos', type: 'Hub' },
      destination: { name: 'Abuja', type: 'Warehouse' },
      status: 'In Transit' as const,
      last_update: '2024-11-11T10:30:00'
    },
    {
      id: 2,
      tracking_code: 'WL-2024-002',
      origin: { name: 'Accra', type: 'Distribution Center' },
      destination: { name: 'Kumasi', type: 'Delivery Point' },
      status: 'Delivered' as const,
      last_update: '2024-11-11T09:15:00'
    },
    {
      id: 3,
      tracking_code: 'WL-2024-003',
      origin: { name: 'Nairobi', type: 'Hub' },
      destination: { name: 'Mombasa', type: 'Port' },
      status: 'Picked Up' as const,
      last_update: '2024-11-11T08:45:00'
    },
    {
      id: 4,
      tracking_code: 'WL-2024-004',
      origin: { name: 'Cairo', type: 'Warehouse' },
      destination: { name: 'Alexandria', type: 'Hub' },
      status: 'Pending' as const,
      last_update: '2024-11-11T07:20:00'
    },
    {
      id: 5,
      tracking_code: 'WL-2024-005',
      origin: { name: 'Johannesburg', type: 'Hub' },
      destination: { name: 'Cape Town', type: 'Distribution Center' },
      status: 'In Transit' as const,
      last_update: '2024-11-10T22:10:00'
    }
  ];
  
  const activities = [
    {
      id: 1,
      tracking_code: 'WL-2024-001',
      status: 'In Transit' as const,
      user_name: 'John Doe',
      location_name: 'Lagos Hub',
      notes: 'Package departed from origin facility',
      created_at: '2024-11-11T10:30:00'
    },
    {
      id: 2,
      tracking_code: 'WL-2024-002',
      status: 'Delivered' as const,
      user_name: 'Jane Smith',
      location_name: 'Kumasi Delivery Point',
      notes: 'Successfully delivered to recipient',
      created_at: '2024-11-11T09:15:00'
    },
    {
      id: 3,
      tracking_code: 'WL-2024-003',
      status: 'Picked Up' as const,
      user_name: 'Mike Johnson',
      location_name: 'Nairobi Hub',
      created_at: '2024-11-11T08:45:00'
    },
    {
      id: 4,
      tracking_code: 'WL-2024-006',
      status: 'In Transit' as const,
      user_name: 'Sarah Williams',
      location_name: 'Lagos Distribution',
      notes: 'In transit to destination',
      created_at: '2024-11-11T07:30:00'
    }
  ];
  
  const handleViewDetails = (trackingCode: string) => {
    console.log('View details for:', trackingCode);
    // In real app: navigate to shipment detail page
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Overview of your logistics operations
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Shipments"
            value={stats.total_shipments}
            icon={Package}
            loading={loading}
          />
          <StatCard
            title="Active Shipments"
            value={stats.active_shipments}
            icon={Truck}
            loading={loading}
          />
          <StatCard
            title="Delivered"
            value={stats.delivered_shipments}
            icon={CheckCircle}
            trend="up"
            trendValue={`${stats.delivery_rate}%`}
            loading={loading}
          />
          <StatCard
            title="Issues"
            value={stats.problem_shipments}
            icon={AlertCircle}
            loading={loading}
          />
        </div>
        
        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Locations</p>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    {stats.total_locations}
                  </p>
                </div>
                <MapPin className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    {stats.total_users}
                  </p>
                </div>
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    {stats.total_customers}
                  </p>
                </div>
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipments Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Shipments</CardTitle>
                <CardDescription>Latest shipment activities</CardDescription>
              </CardHeader>
              <CardContent>
                <ShipmentTable 
                  shipments={shipments}
                  onViewDetails={handleViewDetails}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Activity Feed */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest status updates</CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityFeed activities={activities} loading={loading} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
