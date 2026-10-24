import { HashSet, HashMap } from './dataStructures.js';
import { INITIAL_VEHICLES, INITIAL_CUSTOMERS, INITIAL_BOOKINGS } from './seedData.js';

class FleetService {
  constructor() {
    // =========================================================================
    // 1. HashSet Data Structures: Unique Identification & Duplication Prevention
    // =========================================================================
    // Tracks unique vehicle plate numbers (and VINs) to prevent duplicates (O(1) duplicate check)
    this.uniqueVehiclesSet = new HashSet(64, "UniqueVehiclesSet");
    this.uniqueVinsSet = new HashSet(64, "UniqueVinsSet");

    // Tracks unique customer IDs and Emails (O(1) duplicate check)
    this.uniqueCustomerIdsSet = new HashSet(64, "UniqueCustomerIdsSet");
    this.uniqueCustomerEmailsSet = new HashSet(64, "UniqueCustomerEmailsSet");

    // =========================================================================
    // 2. HashMap Data Structures: Core Memory & O(1) Retrieval
    // =========================================================================
    // Vehicle Directory: Key = Vehicle ID (or Plate), Value = Vehicle Object
    this.vehicleDirectory = new HashMap(64, 0.75, "VehicleDirectory");

    // Customer Registry: Key = Customer ID, Value = Customer Object
    this.customerRegistry = new HashMap(64, 0.75, "CustomerRegistry");

    // Active Bookings: Key = Booking ID, Value = Booking Object
    this.activeBookings = new HashMap(64, 0.75, "ActiveBookings");

    // Rental History Tracking: Key = Vehicle ID, Value = List<Booking>
    this.rentalHistory = new HashMap(64, 0.75, "RentalHistory");

    // Initialize with rich seed data
    this.seedInitialData();
  }

  seedInitialData() {
    // Seed Vehicles
    for (const v of INITIAL_VEHICLES) {
      this.uniqueVehiclesSet.add(v.plateNumber.toUpperCase());
      if (v.vin) this.uniqueVinsSet.add(v.vin.toUpperCase());
      this.vehicleDirectory.put(v.id, { ...v });
      // Initialize empty rental history list for each vehicle
      this.rentalHistory.put(v.id, []);
    }

    // Seed Customers
    for (const c of INITIAL_CUSTOMERS) {
      this.uniqueCustomerIdsSet.add(c.id);
      this.uniqueCustomerEmailsSet.add(c.email.toLowerCase());
      this.customerRegistry.put(c.id, { ...c });
    }

    // Seed Completed and Active Bookings
    for (const b of INITIAL_BOOKINGS) {
      // Append to rental history HashMap
      let list = this.rentalHistory.get(b.vehicleId);
      if (!list) {
        list = [];
        this.rentalHistory.put(b.vehicleId, list);
      }
      list.push(b);

      // If active, also place in activeBookings HashMap
      if (b.status === "Active") {
        this.activeBookings.put(b.id, b);
      }
    }
  }

  // ===========================================================================
  // Vehicle Management
  // ===========================================================================

  /**
   * Register a new vehicle.
   * Step 1: Check HashSet for duplicate plate or VIN in O(1).
   * Step 2: Add identifier to HashSet.
   * Step 3: Put full vehicle object into vehicleDirectory HashMap.
   * Step 4: Initialize rentalHistory list in HashMap.
   */
  registerVehicle({ plateNumber, vin, make, model, type, year, color, dailyRate, seats, transmission, features }) {
    if (!plateNumber || !make || !model || !dailyRate) {
      throw new Error("License plate, make, model, and daily rate are required.");
    }

    const cleanPlate = plateNumber.trim().toUpperCase();
    const cleanVin = vin ? vin.trim().toUpperCase() : null;

    // 1. HashSet O(1) duplicate check
    if (this.uniqueVehiclesSet.has(cleanPlate)) {
      throw new Error(`Vehicle with license plate "${cleanPlate}" is already registered in HashSet! Duplicate rejected.`);
    }

    if (cleanVin && this.uniqueVinsSet.has(cleanVin)) {
      throw new Error(`Vehicle with VIN "${cleanVin}" is already registered in HashSet! Duplicate rejected.`);
    }

    // Generate unique ID
    const nextNum = this.vehicleDirectory.size() + 101;
    const vehicleId = `VH-${nextNum}`;

    const newVehicle = {
      id: vehicleId,
      plateNumber: cleanPlate,
      vin: cleanVin || `VIN-${Date.now().toString().slice(-8)}`,
      make: make.trim(),
      model: model.trim(),
      type: type || "Sedan",
      year: Number(year) || new Date().getFullYear(),
      color: color || "Silver Metallic",
      dailyRate: Number(dailyRate),
      seats: Number(seats) || 5,
      transmission: transmission || "Automatic",
      status: "Available",
      mileage: 0,
      features: Array.isArray(features) ? features : (features ? features.split(',').map(s => s.trim()) : ["Standard Equip"]),
      registeredAt: new Date().toISOString()
    };

    // 2. Add to HashSets
    this.uniqueVehiclesSet.add(cleanPlate);
    if (cleanVin) this.uniqueVinsSet.add(cleanVin);

    // 3. Put into vehicleDirectory HashMap
    this.vehicleDirectory.put(vehicleId, newVehicle);

    // 4. Initialize rental history in HashMap
    this.rentalHistory.put(vehicleId, []);

    return {
      success: true,
      vehicle: newVehicle,
      message: `Vehicle ${newVehicle.make} ${newVehicle.model} (${cleanPlate}) registered successfully in HashMap.`
    };
  }

  /**
   * O(1) Lookup of a vehicle by ID or Plate Number from vehicleDirectory HashMap
   */
  getVehicleById(idOrPlate) {
    const t0 = performance.now();
    // Direct lookup by ID
    let vehicle = this.vehicleDirectory.get(idOrPlate);

    // If not found by ID, attempt lookup by Plate
    if (!vehicle) {
      const all = this.vehicleDirectory.values();
      vehicle = all.find(v => v.plateNumber.toUpperCase() === idOrPlate.toUpperCase());
    }

    const elapsedMs = Number((performance.now() - t0).toFixed(4));
    return {
      vehicle,
      lookupTimeMs: elapsedMs,
      complexity: "O(1) HashMap lookup"
    };
  }

  /**
   * Filter and search vehicles
   */
  getAllVehicles({ status, type, search } = {}) {
    let list = this.vehicleDirectory.values();

    if (status && status !== 'All') {
      list = list.filter(v => v.status.toLowerCase() === status.toLowerCase());
    }

    if (type && type !== 'All') {
      list = list.filter(v => v.type.toLowerCase() === type.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(v =>
        v.plateNumber.toLowerCase().includes(q) ||
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.id.toLowerCase().includes(q) ||
        v.type.toLowerCase().includes(q)
      );
    }

    return list;
  }

  /**
   * Update vehicle status (e.g. toggle Maintenance)
   */
  updateVehicleStatus(vehicleId, newStatus) {
    const vehicle = this.vehicleDirectory.get(vehicleId);
    if (!vehicle) {
      throw new Error(`Vehicle ${vehicleId} not found in directory.`);
    }

    if (vehicle.status === "Rented" && newStatus === "Maintenance") {
      throw new Error(`Vehicle is currently rented. It must be returned before setting to Maintenance.`);
    }

    vehicle.status = newStatus;
    this.vehicleDirectory.put(vehicleId, vehicle);

    return {
      success: true,
      vehicle,
      message: `Vehicle ${vehicle.plateNumber} status updated to ${newStatus}.`
    };
  }

  // ===========================================================================
  // Customer Management
  // ===========================================================================

  /**
   * Register a new customer.
   * Step 1: Check HashSet for duplicate ID / Email.
   * Step 2: Add ID and Email to HashSets.
   * Step 3: Put into customerRegistry HashMap.
   */
  registerCustomer({ id, name, email, phone, licenseNumber, membership }) {
    if (!name || !email) {
      throw new Error("Customer name and email are required.");
    }

    const cleanEmail = email.trim().toLowerCase();
    const custId = (id && id.trim()) || `CUST-${String(this.customerRegistry.size() + 1).padStart(3, '0')}`;

    // 1. HashSet O(1) duplicate checks
    if (this.uniqueCustomerIdsSet.has(custId)) {
      throw new Error(`Customer ID "${custId}" already exists in HashSet! Duplicate rejected.`);
    }

    if (this.uniqueCustomerEmailsSet.has(cleanEmail)) {
      throw new Error(`Customer with email "${cleanEmail}" already exists in HashSet! Duplicate rejected.`);
    }

    const newCustomer = {
      id: custId,
      name: name.trim(),
      email: cleanEmail,
      phone: phone || "+1 (555) 000-0000",
      licenseNumber: licenseNumber || `DL-${Math.floor(1000000 + Math.random() * 9000000)}`,
      membership: membership || "Standard",
      registeredAt: new Date().toISOString().split('T')[0]
    };

    // 2. Add to HashSets
    this.uniqueCustomerIdsSet.add(custId);
    this.uniqueCustomerEmailsSet.add(cleanEmail);

    // 3. Put into customerRegistry HashMap
    this.customerRegistry.put(custId, newCustomer);

    return {
      success: true,
      customer: newCustomer,
      message: `Customer ${newCustomer.name} (${custId}) registered successfully.`
    };
  }

  getAllCustomers() {
    return this.customerRegistry.values();
  }

  getCustomerById(id) {
    const t0 = performance.now();
    const customer = this.customerRegistry.get(id);
    const elapsedMs = Number((performance.now() - t0).toFixed(4));
    return {
      customer,
      lookupTimeMs: elapsedMs,
      complexity: "O(1) HashMap lookup"
    };
  }

  // ===========================================================================
  // Booking Engine (Rental Operations)
  // ===========================================================================

  /**
   * Calculate rental price dynamically given vehicle ID, start date, end date
   */
  calculatePrice(vehicleId, startDate, endDate) {
    const vehicle = this.vehicleDirectory.get(vehicleId);
    if (!vehicle) throw new Error("Vehicle not found.");

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const baseCost = diffDays * vehicle.dailyRate;
    const tax = Number((baseCost * 0.08).toFixed(2));
    const totalAmount = Number((baseCost + tax).toFixed(2));

    return {
      vehicleId,
      dailyRate: vehicle.dailyRate,
      days: diffDays,
      baseCost,
      tax,
      totalAmount
    };
  }

  /**
   * Create a new booking:
   * 1. Validate customer exists in customerRegistry HashMap (O(1)).
   * 2. Validate vehicle exists and is Available in vehicleDirectory HashMap (O(1)).
   * 3. Update vehicle status to "Rented" in HashMap.
   * 4. Add booking record to activeBookings HashMap.
   * 5. Append booking to rentalHistory HashMap.
   */
  createBooking({ customerId, vehicleId, startDate, endDate, notes }) {
    if (!customerId || !vehicleId || !startDate || !endDate) {
      throw new Error("Customer, Vehicle, Start Date, and End Date are required.");
    }

    // 1. O(1) Customer lookup
    const customer = this.customerRegistry.get(customerId);
    if (!customer) {
      throw new Error(`Customer ID "${customerId}" not found in registry HashMap.`);
    }

    // 2. O(1) Vehicle lookup & status check
    const vehicle = this.vehicleDirectory.get(vehicleId);
    if (!vehicle) {
      throw new Error(`Vehicle ID "${vehicleId}" not found in directory HashMap.`);
    }

    if (vehicle.status !== "Available") {
      throw new Error(`Vehicle ${vehicle.plateNumber} (${vehicle.make} ${vehicle.model}) is currently "${vehicle.status}". Only "Available" vehicles can be booked.`);
    }

    // Calculate duration & price
    const priceCalculation = this.calculatePrice(vehicleId, startDate, endDate);

    const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      id: bookingId,
      vehicleId: vehicle.id,
      vehicleModel: `${vehicle.make} ${vehicle.model}`,
      vehiclePlate: vehicle.plateNumber,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      startDate,
      endDate,
      days: priceCalculation.days,
      dailyRate: vehicle.dailyRate,
      totalAmount: priceCalculation.totalAmount,
      status: "Active",
      notes: notes || "Standard reservation",
      createdAt: new Date().toISOString()
    };

    // 3. Update vehicle status to "Rented" in vehicleDirectory HashMap
    vehicle.status = "Rented";
    this.vehicleDirectory.put(vehicle.id, vehicle);

    // 4. Add to activeBookings HashMap
    this.activeBookings.put(bookingId, newBooking);

    // 5. Append to rentalHistory HashMap
    let hist = this.rentalHistory.get(vehicle.id);
    if (!hist) {
      hist = [];
      this.rentalHistory.put(vehicle.id, hist);
    }
    hist.push(newBooking);

    return {
      success: true,
      booking: newBooking,
      message: `Booking #${bookingId} confirmed! ${vehicle.make} ${vehicle.model} rented to ${customer.name}.`
    };
  }

  // ===========================================================================
  // Return & History Management
  // ===========================================================================

  /**
   * Return a rented vehicle:
   * 1. Find booking in activeBookings HashMap (O(1)) or by vehicleId.
   * 2. Reset vehicle status to "Available" in vehicleDirectory HashMap.
   * 3. Update booking status to "Completed" with return timestamp in rentalHistory.
   * 4. Remove booking from activeBookings HashMap.
   */
  returnVehicle(bookingIdOrVehicleId) {
    let booking = this.activeBookings.get(bookingIdOrVehicleId);

    // If not found by booking ID, search by vehicle ID in active bookings
    if (!booking) {
      const activeList = this.activeBookings.values();
      booking = activeList.find(b => b.vehicleId === bookingIdOrVehicleId);
    }

    if (!booking) {
      throw new Error(`Active booking not found for reference: ${bookingIdOrVehicleId}.`);
    }

    const vehicle = this.vehicleDirectory.get(booking.vehicleId);
    if (!vehicle) {
      throw new Error(`Vehicle ${booking.vehicleId} not found in directory.`);
    }

    // 1. Reset vehicle status to "Available" in HashMap
    vehicle.status = "Available";
    this.vehicleDirectory.put(vehicle.id, vehicle);

    // 2. Mark booking completed in rentalHistory
    const nowIso = new Date().toISOString();
    booking.status = "Completed";
    booking.returnDate = nowIso;

    // Ensure rentalHistory list contains updated booking
    const hist = this.rentalHistory.get(vehicle.id);
    if (hist) {
      const target = hist.find(b => b.id === booking.id);
      if (target) {
        target.status = "Completed";
        target.returnDate = nowIso;
      }
    }

    // 3. Remove from activeBookings HashMap (O(1))
    this.activeBookings.remove(booking.id);

    return {
      success: true,
      booking,
      vehicle,
      message: `Vehicle ${vehicle.plateNumber} (${vehicle.make} ${vehicle.model}) returned successfully and reset to Available.`
    };
  }

  getActiveBookings() {
    return this.activeBookings.values();
  }

  /**
   * Get rental history logs filtered by vehicleId, customerId, or all
   */
  getRentalHistory({ vehicleId, customerId } = {}) {
    let allLogs = [];

    if (vehicleId) {
      // Direct O(1) lookup in rentalHistory HashMap
      const logs = this.rentalHistory.get(vehicleId);
      allLogs = logs ? [...logs] : [];
    } else {
      // Aggregate across all vehicles in HashMap
      const allVehicleHistories = this.rentalHistory.values();
      for (const list of allVehicleHistories) {
        if (Array.isArray(list)) {
          allLogs.push(...list);
        }
      }
    }

    if (customerId) {
      allLogs = allLogs.filter(b => b.customerId === customerId);
    }

    // Sort descending by date
    allLogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return allLogs;
  }

  // ===========================================================================
  // Summary Stats & Live Data Structure Diagnostics
  // ===========================================================================

  getDashboardStats() {
    const vehicles = this.vehicleDirectory.values();
    const totalFleet = vehicles.length;
    const available = vehicles.filter(v => v.status === "Available").length;
    const rented = vehicles.filter(v => v.status === "Rented").length;
    const maintenance = vehicles.filter(v => v.status === "Maintenance").length;
    const activeBookingsCount = this.activeBookings.size();

    // Calculate total revenue from all bookings (completed and active)
    const allHistory = this.getRentalHistory();
    const totalRevenue = allHistory.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);

    const utilizationRate = totalFleet > 0 ? Number(((rented / totalFleet) * 100).toFixed(1)) : 0;

    return {
      totalFleet,
      availableVehicles: available,
      rentedVehicles: rented,
      maintenanceVehicles: maintenance,
      activeBookings: activeBookingsCount,
      totalCustomers: this.customerRegistry.size(),
      totalRevenue: Number(totalRevenue.toFixed(2)),
      utilizationRate
    };
  }

  /**
   * Real-time inspection data for the Data Structure visualizer tab
   */
  getDataStructuresInspection() {
    return {
      hashSets: [
        this.uniqueVehiclesSet.getInspectionData(),
        this.uniqueCustomerIdsSet.getInspectionData(),
        this.uniqueCustomerEmailsSet.getInspectionData()
      ],
      hashMaps: [
        this.vehicleDirectory.getInspectionData(),
        this.customerRegistry.getInspectionData(),
        this.activeBookings.getInspectionData(),
        this.rentalHistory.getInspectionData()
      ]
    };
  }
}

export const fleetService = new FleetService();
