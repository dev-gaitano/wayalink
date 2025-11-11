import React from 'react';
import { Clock, User, MapPin } from 'lucide-react';
import { StatusBadge, ShipmentStatus } from '@/components/ui/status-badge';

interface Activity {
  id: number;
  tracking_code: string;
  status: ShipmentStatus;
  user_name: string;
  location_name: string;
  notes?: string;
  created_at: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  loading?: boolean;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, loading = false }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse flex space-x-4">
            <div className="w-10 h-10 bg-muted rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, idx) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {idx !== activities.length - 1 && (
                <span 
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-border" 
                  aria-hidden="true"
                />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center ring-8 ring-background">
                    <Clock className="h-4 w-4 text-primary-600" />
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{activity.tracking_code}</span> updated to{' '}
                      <StatusBadge status={activity.status} />
                    </p>
                    <div className="mt-1 flex items-center text-xs text-muted-foreground space-x-3">
                      <span className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {activity.user_name}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {activity.location_name}
                      </span>
                    </div>
                    {activity.notes && (
                      <p className="mt-1 text-xs text-muted-foreground italic">"{activity.notes}"</p>
                    )}
                  </div>
                  <div className="whitespace-nowrap text-right text-xs text-muted-foreground">
                    {new Date(activity.created_at).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
