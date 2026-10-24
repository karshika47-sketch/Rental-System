/**
 * API Client for FleetPulse backend
 */

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  // Statistics
  getStats: () => request('/stats'),

  // Vehicles
  getVehicles: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/vehicles${query ? `?${query}` : ''}`);
  },
  getVehicleById: (id) => request(`/vehicles/${encodeURIComponent(id)}`),
  registerVehicle: (payload) => request('/vehicles', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  updateVehicleStatus: (id, status) => request(`/vehicles/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),

  // Customers
  getCustomers: () => request('/customers'),
  getCustomerById: (id) => request(`/customers/${encodeURIComponent(id)}`),
  registerCustomer: (payload) => request('/customers', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  // Bookings
  getActiveBookings: () => request('/bookings/active'),
  calculatePrice: (vehicleId, startDate, endDate) => request('/bookings/calculate', {
    method: 'POST',
    body: JSON.stringify({ vehicleId, startDate, endDate })
  }),
  createBooking: (payload) => request('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  returnVehicle: (payload) => request('/bookings/return', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  // History
  getRentalHistory: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/history${query ? `?${query}` : ''}`);
  },

  // Internal Data Structures Telemetry
  getDataStructures: () => request('/data-structures')
};
