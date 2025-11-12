import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (for auth tokens, etc.)
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (for error handling)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Dashboard
  getDashboardStats: () => apiClient.get('/api/dashboard/stats'),
  getStatusDistribution: () => apiClient.get('/api/dashboard/status-distribution'),
  getRecentActivity: (limit = 10) => apiClient.get(`/api/dashboard/recent-activity?limit=${limit}`),

  // Shipments
  getShipments: (params) => apiClient.get('/api/shipments', { params }),
  getShipmentDetail: (trackingCode) => apiClient.get(`/api/shipments/${trackingCode}`),
  createShipment: (data) => apiClient.post('/api/shipments', data),

  // Locations
  getLocations: (type) => apiClient.get('/api/locations', { params: { type } }),
  getLocationActivity: (locationId) => apiClient.get(`/api/locations/${locationId}/activity`),

  // Users
  getUsers: (title) => apiClient.get('/api/users', { params: { title } }),
  getUserActivity: (userId) => apiClient.get(`/api/users/${userId}/activity`),

  // Analytics
  getShipmentsTimeline: (days = 30) => apiClient.get(`/api/analytics/timeline?days=${days}`),
};
