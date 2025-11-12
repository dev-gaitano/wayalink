const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const api = {
  // Dashboard
  getDashboardStats: () => fetch(`${API_BASE_URL}/api/dashboard/stats`).then(r => r.json()),
  getRecentActivity: (limit = 10) => fetch(`${API_BASE_URL}/api/dashboard/recent-activity?limit=${limit}`).then(r => r.json()),

  // Shipments
  getShipments: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetch(`${API_BASE_URL}/api/shipments?${queryString}`).then(r => r.json());
  },
  getShipmentDetail: (trackingCode) => fetch(`${API_BASE_URL}/api/shipments/${trackingCode}`).then(r => r.json()),
  createShipment: (data) => fetch(`${API_BASE_URL}/api/shipments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  // Locations
  getLocations: (type) => {
    const query = type ? `?type=${type}` : '';
    return fetch(`${API_BASE_URL}/api/locations${query}`).then(r => r.json());
  },

  // Users
  getUsers: (title) => {
    const query = title ? `?title=${title}` : '';
    return fetch(`${API_BASE_URL}/api/users${query}`).then(r => r.json());
  }
};

