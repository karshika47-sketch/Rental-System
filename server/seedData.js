/**
 * Seed data for realistic initial fleet and customers
 */

export const INITIAL_VEHICLES = [
  {
    id: "VH-101",
    plateNumber: "CA-7TX99",
    vin: "1HGCR2F83HA019284",
    make: "Tesla",
    model: "Model 3 Long Range",
    type: "Electric",
    year: 2024,
    color: "Midnight Silver",
    dailyRate: 95,
    seats: 5,
    transmission: "Automatic",
    status: "Available",
    mileage: 14200,
    features: ["Autopilot", "Glass Roof", "Heated Seats", "Supercharging"]
  },
  {
    id: "VH-102",
    plateNumber: "NY-5KZ21",
    vin: "3FA6P0HD8KR192834",
    make: "Ford",
    model: "F-150 Lightning EV",
    type: "Truck",
    year: 2023,
    color: "Oxford White",
    dailyRate: 110,
    seats: 5,
    transmission: "Automatic",
    status: "Available",
    mileage: 22400,
    features: ["Pro Power Onboard", "Tow Package", "4x4", "Crew Cab"]
  },
  {
    id: "VH-103",
    plateNumber: "TX-9RP44",
    vin: "WBA33AY08NFP12948",
    make: "BMW",
    model: "X5 xDrive40i",
    type: "SUV",
    year: 2024,
    color: "Carbon Black Metallic",
    dailyRate: 145,
    seats: 7,
    transmission: "Automatic",
    status: "Rented",
    mileage: 9800,
    features: ["Panoramic Sunroof", "Harman Kardon", "Leather", "AWD"]
  },
  {
    id: "VH-104",
    plateNumber: "FL-3BB88",
    vin: "4T1B11HK5MU182749",
    make: "Toyota",
    model: "Camry Hybrid XSE",
    type: "Sedan",
    year: 2023,
    color: "Wind Chill Pearl",
    dailyRate: 65,
    seats: 5,
    transmission: "Automatic",
    status: "Available",
    mileage: 31000,
    features: ["52 MPG", "Apple CarPlay", "Adaptive Cruise", "Leather"]
  },
  {
    id: "VH-105",
    plateNumber: "WA-8MN12",
    vin: "WP0AA2Y12MSA73921",
    make: "Porsche",
    model: "Taycan 4S",
    type: "Luxury",
    year: 2024,
    color: "Frozen Blue Metallic",
    dailyRate: 230,
    seats: 4,
    transmission: "Automatic",
    status: "Rented",
    mileage: 5600,
    features: ["Performance Battery Plus", "Sport Chrono", "Air Suspension"]
  },
  {
    id: "VH-106",
    plateNumber: "IL-4JJ76",
    vin: "5NMS23AC2MH928192",
    make: "Hyundai",
    model: "Tucson Ultimate",
    type: "SUV",
    year: 2023,
    color: "Amazon Gray",
    dailyRate: 75,
    seats: 5,
    transmission: "Automatic",
    status: "Maintenance",
    mileage: 28900,
    features: ["Brake Pad Replacement", "Scheduled Service", "AWD"]
  },
  {
    id: "VH-107",
    plateNumber: "CO-2WW33",
    vin: "1C4HJXDG7MW581920",
    make: "Jeep",
    model: "Wrangler Rubicon 4xe",
    type: "SUV",
    year: 2023,
    color: "Sarge Green",
    dailyRate: 120,
    seats: 5,
    transmission: "Automatic",
    status: "Available",
    mileage: 18500,
    features: ["Removable Top", "Rock-Trac 4x4", "Off-Road Plus"]
  },
  {
    id: "VH-108",
    plateNumber: "GA-6QQ51",
    vin: "SALWR2V42NA819201",
    make: "Mercedes-Benz",
    model: "E-Class AMG Line",
    type: "Luxury",
    year: 2024,
    color: "Obsidian Black",
    dailyRate: 180,
    seats: 5,
    transmission: "Automatic",
    status: "Available",
    mileage: 11200,
    features: ["MBUX Superscreen", "Burmester 4D Sound", "Massage Seats"]
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: "CUST-001",
    name: "Elena Rostova",
    email: "elena.rostova@techinnovate.io",
    phone: "+1 (415) 892-4410",
    licenseNumber: "DL-CA9928192",
    membership: "VIP Gold",
    registeredAt: "2026-08-15"
  },
  {
    id: "CUST-002",
    name: "Marcus Vance",
    email: "marcus.vance@apexcap.com",
    phone: "+1 (212) 555-8319",
    licenseNumber: "DL-NY4829103",
    membership: "Executive Platinum",
    registeredAt: "2026-09-01"
  },
  {
    id: "CUST-003",
    name: "Sophia Chen",
    email: "sophia.chen@quantumsoft.net",
    phone: "+1 (206) 773-1944",
    licenseNumber: "DL-WA3719284",
    membership: "Standard",
    registeredAt: "2026-09-20"
  },
  {
    id: "CUST-004",
    name: "David O'Connor",
    email: "david.oc@summitmedia.com",
    phone: "+1 (305) 441-9021",
    licenseNumber: "DL-FL8829104",
    membership: "Standard",
    registeredAt: "2026-10-01"
  }
];

export const INITIAL_BOOKINGS = [
  // Active rental 1
  {
    id: "BK-9001",
    vehicleId: "VH-103",
    vehicleModel: "BMW X5 xDrive40i",
    vehiclePlate: "TX-9RP44",
    customerId: "CUST-001",
    customerName: "Elena Rostova",
    startDate: "2026-10-05",
    endDate: "2026-10-10",
    days: 5,
    dailyRate: 145,
    totalAmount: 725,
    status: "Active",
    createdAt: "2026-10-05T09:30:00Z"
  },
  // Active rental 2
  {
    id: "BK-9002",
    vehicleId: "VH-105",
    vehicleModel: "Porsche Taycan 4S",
    vehiclePlate: "WA-8MN12",
    customerId: "CUST-002",
    customerName: "Marcus Vance",
    startDate: "2026-10-06",
    endDate: "2026-10-09",
    days: 3,
    dailyRate: 230,
    totalAmount: 690,
    status: "Active",
    createdAt: "2026-10-06T11:15:00Z"
  },
  // Historical completed bookings
  {
    id: "BK-8001",
    vehicleId: "VH-101",
    vehicleModel: "Tesla Model 3 Long Range",
    vehiclePlate: "CA-7TX99",
    customerId: "CUST-003",
    customerName: "Sophia Chen",
    startDate: "2026-09-25",
    endDate: "2026-09-28",
    days: 3,
    dailyRate: 95,
    totalAmount: 285,
    status: "Completed",
    returnDate: "2026-09-28T16:00:00Z",
    createdAt: "2026-09-25T08:00:00Z"
  },
  {
    id: "BK-8002",
    vehicleId: "VH-104",
    vehicleModel: "Toyota Camry Hybrid XSE",
    vehiclePlate: "FL-3BB88",
    customerId: "CUST-004",
    customerName: "David O'Connor",
    startDate: "2026-09-28",
    endDate: "2026-10-02",
    days: 4,
    dailyRate: 65,
    totalAmount: 260,
    status: "Completed",
    returnDate: "2026-10-02T14:30:00Z",
    createdAt: "2026-09-28T10:00:00Z"
  },
  {
    id: "BK-8003",
    vehicleId: "VH-103",
    vehicleModel: "BMW X5 xDrive40i",
    vehiclePlate: "TX-9RP44",
    customerId: "CUST-002",
    customerName: "Marcus Vance",
    startDate: "2026-09-18",
    endDate: "2026-09-22",
    days: 4,
    dailyRate: 145,
    totalAmount: 580,
    status: "Completed",
    returnDate: "2026-09-22T17:45:00Z",
    createdAt: "2026-09-18T12:00:00Z"
  }
];
