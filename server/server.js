import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { fleetService } from './fleetService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(projectRoot, 'public')));

// Request logging middleware
app.use((req, res, next) => {
  const start = performance.now();
  res.on('finish', () => {
    const duration = (performance.now() - start).toFixed(2);
    if (req.url.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// =============================================================================
// API Routes
// =============================================================================

// Summary Statistics
app.get('/api/stats', (req, res) => {
  try {
    const stats = fleetService.getDashboardStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vehicle Management Routes
app.get('/api/vehicles', (req, res) => {
  try {
    const { status, type, search } = req.query;
    const vehicles = fleetService.getAllVehicles({ status, type, search });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/vehicles/:id', (req, res) => {
  try {
    const result = fleetService.getVehicleById(req.params.id);
    if (!result.vehicle) {
      return res.status(404).json({ error: `Vehicle "${req.params.id}" not found in HashMap.` });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/vehicles', (req, res) => {
  try {
    const result = fleetService.registerVehicle(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/vehicles/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "New status is required." });
    const result = fleetService.updateVehicleStatus(req.params.id, status);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Customer Management Routes
app.get('/api/customers', (req, res) => {
  try {
    const customers = fleetService.getAllCustomers();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/customers/:id', (req, res) => {
  try {
    const result = fleetService.getCustomerById(req.params.id);
    if (!result.customer) {
      return res.status(404).json({ error: `Customer "${req.params.id}" not found in registry.` });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/customers', (req, res) => {
  try {
    const result = fleetService.registerCustomer(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Booking Engine Routes
app.get('/api/bookings/active', (req, res) => {
  try {
    const active = fleetService.getActiveBookings();
    res.json(active);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bookings/calculate', (req, res) => {
  try {
    const { vehicleId, startDate, endDate } = req.body;
    if (!vehicleId || !startDate || !endDate) {
      return res.status(400).json({ error: "vehicleId, startDate, and endDate are required." });
    }
    const calculation = fleetService.calculatePrice(vehicleId, startDate, endDate);
    res.json(calculation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/bookings', (req, res) => {
  try {
    const result = fleetService.createBooking(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/bookings/return', (req, res) => {
  try {
    const { bookingId, vehicleId } = req.body;
    const identifier = bookingId || vehicleId;
    if (!identifier) {
      return res.status(400).json({ error: "bookingId or vehicleId is required to process return." });
    }
    const result = fleetService.returnVehicle(identifier);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Rental History Routes
app.get('/api/history', (req, res) => {
  try {
    const { vehicleId, customerId } = req.query;
    const history = fleetService.getRentalHistory({ vehicleId, customerId });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Data Structures Real-Time Inspection Route
app.get('/api/data-structures', (req, res) => {
  try {
    const inspection = fleetService.getDataStructuresInspection();
    res.json(inspection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fallback to SPA for unmatched routes
app.use((req, res) => {
  res.sendFile(path.join(projectRoot, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 FleetPulse - Vehicle Rental Management Engine`);
  console.log(`📡 Server running at: http://localhost:${PORT}`);
  console.log(`⚡ Memory Architecture: Custom HashSet & HashMap active`);
  console.log(`====================================================`);
});
