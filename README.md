# FleetPulse - Vehicle Rental Management System

A high-performance, full-stack vehicle rental management web application built with **Node.js/Express** and modern **Vanilla HTML/CSS/JavaScript**, featuring explicit implementations of standard **HashSet** and **HashMap** data structures for core memory and query logic.

---

## ⚡ Core Architecture & Data Structure Implementation

### 1. HashSet Operations (O(1) Uniqueness & Collision Prevention)
- **`UniqueVehiclesSet` & `UniqueVinsSet`**: Stores unique vehicle license plate numbers and VINs. Used during vehicle registration to validate uniqueness in $\mathcal{O}(1)$ average time, preventing duplicate registrations.
- **`UniqueCustomerIdsSet` & `UniqueCustomerEmailsSet`**: Tracks unique customer IDs and email addresses in $\mathcal{O}(1)$, preventing duplicate customer records.

### 2. HashMap Operations (O(1) Core Key-Value Directories)
- **`VehicleDirectory`**: `HashMap<String, Vehicle>`
  - **Key**: Vehicle ID (`VH-101`)
  - **Value**: Vehicle Object (`{ id, plateNumber, vin, make, model, type, dailyRate, status, year, color, ... }`)
  - Enables instant $\mathcal{O}(1)$ lookup speed for vehicle availability, specifications, and state transitions.
- **`CustomerRegistry`**: `HashMap<String, Customer>`
  - **Key**: Customer ID (`CUST-001`)
  - **Value**: Customer Object (`{ id, name, email, phone, licenseNumber, membership, ... }`)
- **`ActiveBookings`**: `HashMap<String, Booking>`
  - **Key**: Booking ID (`BK-9001`)
  - **Value**: Booking Object (`{ id, vehicleId, customerId, startDate, endDate, days, totalAmount, status: "Active", ... }`)
  - Enables instant lookups for return processing and active fleet management.
- **`RentalHistory`**: `HashMap<String, List<Booking>>`
  - **Key**: Vehicle ID
  - **Value**: Array of historical bookings maintaining chronological rental logs.

---

## 🚀 Key Features

1. **Fleet Management & Registration**:
   - Register new vehicles with duplicate plate/VIN detection powered by the `HashSet`.
   - Dynamic fleet table with filter pills by status (*Available*, *Rented*, *Maintenance*) and category (*Electric*, *SUV*, *Sedan*, *Truck*, *Luxury*).
   - Quick actions: toggle vehicle maintenance mode, quick rent, and inspect vehicle logs.

2. **Customer Registry**:
   - Register customers with duplicate email and ID validation via `HashSet`.
   - View customer membership tiers (*Standard*, *VIP Gold*, *Executive Platinum*).

3. **Real-Time Availability Checking & Instant O(1) Search**:
   - Topbar search input performs instant $\mathcal{O}(1)$ queries against the `VehicleDirectory` HashMap.
   - Shows sub-millisecond retrieval latency (e.g. `0.02ms`).

4. **Rental Booking Engine**:
   - Interactive booking workstation with live dynamic quote calculator.
   - Computes daily rental cost, duration in days, and itemized taxes.
   - Automated memory transaction pipeline:
     1. Verify vehicle availability in `VehicleDirectory` HashMap.
     2. Mutate vehicle status to `"Rented"`.
     3. Insert record into `ActiveBookings` HashMap.
     4. Append record to `RentalHistory` HashMap.

5. **Return & Rental History Management**:
   - 1-click vehicle return modal: calculates final stats, marks booking as `"Completed"`, archives to `RentalHistory`, and resets vehicle status to `"Available"`.
   - Comprehensive audit log view with multi-criteria filters (by Vehicle and/or Customer).

6. **Memory & Data Structure Inspector**:
   - Dedicated dashboard view providing real-time telemetry into internal bucket arrays, load factors, collision rates, and operation counts (`puts`, `gets`, `deletes`).
   - Interactive O(1) query benchmark sandbox with terminal output.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js (RESTful API, custom djb2 hash function, separate chaining hash table).
- **Frontend**: Vanilla HTML5, Vanilla CSS3 (Custom design system, glassmorphism, responsive tables, dark luxury theme), Vanilla ES Modules.
- **Typography**: Google Fonts (*Outfit*, *Plus Jakarta Sans*, *JetBrains Mono*).

---

## 🏃 Running the Application Locally

The local server is already running and accessible at:
```
http://localhost:3000
```

To run manually or in development mode:
```bash
# Start server
npm start

# Development mode with file watch
npm run dev
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/stats` | Dashboard summary metrics (fleet, available, rented, revenue, utilization) |
| `GET` | `/api/vehicles` | List vehicles with optional `?status=`, `?type=`, `?search=` filters |
| `GET` | `/api/vehicles/:id` | Instant $\mathcal{O}(1)$ vehicle lookup by ID or plate |
| `POST` | `/api/vehicles` | Register vehicle (validated in $\mathcal{O}(1)$ via `HashSet`) |
| `PATCH` | `/api/vehicles/:id/status` | Update vehicle status (`Available`, `Maintenance`) |
| `GET` | `/api/customers` | List all registered customers |
| `POST` | `/api/customers` | Register customer (validated in $\mathcal{O}(1)$ via `HashSet`) |
| `GET` | `/api/bookings/active` | Retrieve active rentals from `ActiveBookings` HashMap |
| `POST` | `/api/bookings/calculate` | Calculate rental duration and price dynamically |
| `POST` | `/api/bookings` | Create new rental agreement and update memory tables |
| `POST` | `/api/bookings/return` | Conclude rental, reset vehicle to `Available`, archive log |
| `GET` | `/api/history` | Retrieve rental history with optional vehicle/customer filters |
| `GET` | `/api/data-structures` | Live diagnostic metrics of all HashSets and HashMaps |
