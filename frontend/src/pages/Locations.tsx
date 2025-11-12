import React, { useState, useEffect } from 'react';
import { MapPin, Search, Building, Warehouse, Store, Navigation } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { api } from '../api/client';

export const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    fetchLocations();
  }, [typeFilter]);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await api.getLocations(typeFilter || undefined);
      setLocations(response.data.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationActivity = async (locationId) => {
    try {
      const response = await api.getLocationActivity(locationId);
      setSelectedLocation(response.data.data);
    } catch (error) {
      console.error('Error fetching location activity:', error);
    }
  };

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeIcon = (type) => {
    switch (type) {
      case 'manufacturer': return Building;
      case 'warehouse': return Warehouse;
      case 'retailer': return Store;
      default: return Navigation;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'manufacturer': return 'bg-blue-100 text-blue-700';
      case 'warehouse': return 'bg-purple-100 text-purple-700';
      case 'retailer': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Locations</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage supply chain locations
        </p>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or region..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          >
            <option value="">All Types</option>
            <option value="manufacturer">Manufacturers</option>
            <option value="warehouse">Warehouses</option>
            <option value="retailer">Retailers</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {['manufacturer', 'warehouse', 'retailer', 'custom'].map(type => {
          const Icon = getTypeIcon(type);
          const count = locations.filter(l => l.type === type).length;
          return (
            <Card key={type} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 capitalize">{type}s</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
                <Icon className="w-8 h-8 text-gray-400" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Locations Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map(location => {
            const Icon = getTypeIcon(location.type);
            return (
              <Card
                key={location.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => fetchLocationActivity(location.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${getTypeColor(location.type)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getTypeColor(location.type)} mt-1`}>
                        {location.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{location.region}</span>
                  </div>
                  {location.latitude && location.longitude && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Navigation className="w-3 h-3 mr-2" />
                      <span>{location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Location Detail Modal */}
      {selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedLocation.location.name}</h2>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${getTypeColor(selectedLocation.location.type)} mt-2`}>
                  {selectedLocation.location.type}
                </span>
              </div>
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Shipments Originated</p>
                <p className="text-2xl font-bold text-blue-600">{selectedLocation.statistics.shipments_originated}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Shipments Received</p>
                <p className="text-2xl font-bold text-green-600">{selectedLocation.statistics.shipments_received}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Events Logged</p>
                <p className="text-2xl font-bold text-purple-600">{selectedLocation.statistics.events_logged}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Users</p>
                <p className="text-2xl font-bold text-orange-600">{selectedLocation.statistics.users_count}</p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setSelectedLocation(null)}>Close</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
