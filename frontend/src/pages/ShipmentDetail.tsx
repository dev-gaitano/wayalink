import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, User, Clock, Package as PackageIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { api } from '../api/client';

export const ShipmentDetail = () => {
  const { trackingCode } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShipmentDetail();
  }, [trackingCode]);

  const fetchShipmentDetail = async () => {
    try {
      setLoading(true);
      const response = await api.getShipmentDetail(trackingCode);
      setShipment(response.data.data);
    } catch (error) {
      console.error('Error fetching shipment detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-12 text-center">
          <PackageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Shipment Not Found</h2>
          <p className="text-gray-600 mb-6">The tracking code you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/shipments')}>Back to Shipments</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/shipments')}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Shipments
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{shipment.tracking_code}</h1>
            <p className="mt-2 text-sm text-gray-600">
              Created on {new Date(shipment.created_at).toLocaleDateString()}
            </p>
          </div>
          <StatusBadge status={shipment.status} />
        </div>
      </div>

      {/* Shipment Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Origin */}
        <Card className="p-6">
          <div className="flex items-start">
            <div className="bg-blue-100 p-3 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Origin</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">{shipment.origin.name}</p>
              <p className="text-sm text-gray-500">{shipment.origin.type}</p>
              <p className="text-xs text-gray-400 mt-1">{shipment.origin.region}</p>
            </div>
          </div>
        </Card>

        {/* Destination */}
        <Card className="p-6">
          <div className="flex items-start">
            <div className="bg-green-100 p-3 rounded-lg">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Destination</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">{shipment.destination.name}</p>
              <p className="text-sm text-gray-500">{shipment.destination.type}</p>
              <p className="text-xs text-gray-400 mt-1">{shipment.destination.region}</p>
            </div>
          </div>
        </Card>

        {/* Timeline */}
        <Card className="p-6">
          <div className="flex items-start">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Timeline</p>
              <div className="mt-2 space-y-1">
                <div className="text-sm">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-900 ml-2">
                    {new Date(shipment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Last Update:</span>
                  <span className="text-gray-900 ml-2">
                    {new Date(shipment.last_update).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Event Timeline */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Event History</h2>

        {shipment.events.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No events recorded yet</p>
          </div>
        ) : (
          <div className="flow-root">
            <ul className="-mb-8">
              {shipment.events.map((event, idx) => (
                <li key={event.id}>
                  <div className="relative pb-8">
                    {idx !== shipment.events.length - 1 && (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      ></span>
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${event.status === 'Delivered' ? 'bg-green-500' :
                          event.status === 'In Transit' ? 'bg-yellow-500' :
                            event.status === 'Picked Up' ? 'bg-blue-500' :
                              event.status === 'Damaged' || event.status === 'Lost' ? 'bg-red-500' :
                                'bg-gray-500'
                          }`}>
                          <Clock className="h-4 w-4 text-white" />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            Status updated to <StatusBadge status={event.status} />
                          </p>
                          <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              {event.user.name} ({event.user.title})
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {event.location.name}
                            </span>
                          </div>
                          {event.notes && (
                            <p className="mt-2 text-sm text-gray-600 italic bg-gray-50 p-2 rounded">
                              "{event.notes}"
                            </p>
                          )}
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                          <div>{new Date(event.created_at).toLocaleDateString()}</div>
                          <div className="text-xs">{new Date(event.created_at).toLocaleTimeString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Map</h2>
      </Card>
    </div>
  );
};
