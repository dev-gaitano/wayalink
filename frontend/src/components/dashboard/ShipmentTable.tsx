import React from 'react';
import { StatusBadge, ShipmentStatus } from '@/components/ui/status-badge';
import { Eye, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Location {
  name: string;
  type: string;
}

interface Shipment {
  id: number;
  tracking_code: string;
  origin: Location;
  destination: Location;
  status: ShipmentStatus;
  last_update: string;
}

interface ShipmentTableProps {
  shipments: Shipment[];
  onViewDetails?: (trackingCode: string) => void;
  loading?: boolean;
}

export const ShipmentTable: React.FC<ShipmentTableProps> = ({ 
  shipments, 
  onViewDetails, 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-16 bg-muted rounded"></div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tracking Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Origin
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Destination
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Last Update
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-card divide-y divide-border">
          {shipments.map((shipment) => (
            <tr key={shipment.id} className="hover:bg-muted/30 transition-colors duration-150">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-foreground">{shipment.tracking_code}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-foreground">
                  <MapPin className="w-4 h-4 mr-1 text-muted-foreground" />
                  {shipment.origin.name}
                </div>
                <div className="text-xs text-muted-foreground">{shipment.origin.type}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-foreground">
                  <MapPin className="w-4 h-4 mr-1 text-muted-foreground" />
                  {shipment.destination.name}
                </div>
                <div className="text-xs text-muted-foreground">{shipment.destination.type}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={shipment.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                {new Date(shipment.last_update).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails?.(shipment.tracking_code)}
                  className="inline-flex items-center text-primary hover:text-primary-700"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
