import { Package, TrendingUp, Users, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';

const Index = () => {
  const stats = [
    {
      title: 'Total Shipments',
      value: '2,453',
      icon: Package,
      trend: 'up' as const,
      trendValue: '+12.5%'
    },
    {
      title: 'Active Deliveries',
      value: '324',
      icon: TrendingUp,
      trend: 'up' as const,
      trendValue: '+8.2%'
    },
    {
      title: 'Total Customers',
      value: '1,892',
      icon: Users,
      trend: 'up' as const,
      trendValue: '+23.1%'
    },
    {
      title: 'Delivery Locations',
      value: '47',
      icon: MapPin,
      trend: 'down' as const,
      trendValue: '-2.4%'
    }
  ];

  const recentShipments = [
    { id: 1, code: 'WL-2024-001', origin: 'Lagos', destination: 'Abuja', status: 'In Transit' as const },
    { id: 2, code: 'WL-2024-002', origin: 'Accra', destination: 'Kumasi', status: 'Delivered' as const },
    { id: 3, code: 'WL-2024-003', origin: 'Nairobi', destination: 'Mombasa', status: 'Picked Up' as const },
    { id: 4, code: 'WL-2024-004', origin: 'Cairo', destination: 'Alexandria', status: 'Pending' as const }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              WayaLink Logistics Platform
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Modern logistics tracking and management system built with React, Vite, and Tailwind CSS
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  className="bg-white text-primary-700 hover:bg-primary-50 font-semibold"
                >
                  View Dashboard
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/10"
              >
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </section>

      {/* Recent Shipments */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Recent Shipments</CardTitle>
            <CardDescription>Overview of the latest shipment activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Tracking Code
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Origin
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Destination
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentShipments.map((shipment) => (
                    <tr 
                      key={shipment.id} 
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className="font-medium text-foreground">{shipment.code}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-foreground">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          {shipment.origin}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-foreground">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          {shipment.destination}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={shipment.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Design System Features
          </h2>
          <p className="text-lg text-muted-foreground">
            Built with WayaLink's comprehensive design system
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-primary-600" />
              </div>
              <CardTitle>Component Library</CardTitle>
              <CardDescription>
                Pre-built components following WayaLink design guidelines with buttons, cards, badges, and more
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-secondary-600" />
              </div>
              <CardTitle>Color System</CardTitle>
              <CardDescription>
                Semantic color palette with primary blue, secondary orange, and status colors for success, warning, and error states
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-success-600" />
              </div>
              <CardTitle>Typography & Spacing</CardTitle>
              <CardDescription>
                Inter font family with consistent sizing, spacing, and layout system for data-heavy interfaces
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
