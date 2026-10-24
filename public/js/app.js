import { api } from './api.js';

// Application State
const state = {
  currentView: 'dashboard',
  vehicles: [],
  customers: [],
  activeBookings: [],
  historyLogs: [],
  stats: null,
  fleetFilter: {
    status: 'All',
    type: 'All',
    search: ''
  },
  customerSearch: '',
  historyFilter: {
    vehicleId: '',
    customerId: ''
  },
  pendingReturnBooking: null
};

// =============================================================================
// DOM Elements
// =============================================================================
const elements = {
  // Navigation
  navItems: document.querySelectorAll('.nav-item'),
  viewPanels: document.querySelectorAll('.view-panel'),
  pageTitle: document.getElementById('page-title'),
  pageSubtitle: document.getElementById('page-subtitle'),
  navFleetCount: document.getElementById('nav-fleet-count'),
  navActiveCount: document.getElementById('nav-active-count'),

  // Header quick lookup
  instantLookupInput: document.getElementById('instant-lookup-input'),
  quickResultDropdown: document.getElementById('quick-result-dropdown'),
  btnHeaderAddVehicle: document.getElementById('btn-header-add-vehicle'),
  btnHeaderNewRental: document.getElementById('btn-header-new-rental'),

  // Stats
  statTotalFleet: document.getElementById('stat-total-fleet'),
  statAvailableFleet: document.getElementById('stat-available-fleet'),
  statActiveRentals: document.getElementById('stat-active-rentals'),
  statTotalRevenue: document.getElementById('stat-total-revenue'),
  statUtilizationRate: document.getElementById('stat-utilization-rate'),
  statUtilizationBar: document.getElementById('stat-utilization-bar'),

  // Dashboard View
  dashboardFleetTableBody: document.querySelector('#dashboard-fleet-table tbody'),
  dashboardActiveTableBody: document.querySelector('#dashboard-active-table tbody'),
  btnViewAllFleet: document.getElementById('btn-view-all-fleet'),
  btnDashboardNewRental: document.getElementById('btn-dashboard-new-rental'),
  badgeUniqueVehiclesCount: document.getElementById('badge-unique-vehicles-count'),
  badgeUniqueCustomersCount: document.getElementById('badge-unique-customers-count'),
  badgeVehicleMapCount: document.getElementById('badge-vehicle-map-count'),
  badgeActiveMapCount: document.getElementById('badge-active-map-count'),

  // Fleet View
  fleetTableBody: document.getElementById('fleet-table-body'),
  fleetFilterSearch: document.getElementById('fleet-filter-search'),
  fleetStatusFilters: document.querySelectorAll('#fleet-status-filters .filter-pill'),
  fleetTypeFilters: document.querySelectorAll('#fleet-type-filters .filter-pill'),
  btnOpenRegisterVehicleModal: document.getElementById('btn-open-register-vehicle-modal'),

  // Customers View
  customersTableBody: document.getElementById('customers-table-body'),
  customerFilterSearch: document.getElementById('customer-filter-search'),
  btnOpenRegisterCustomerModal: document.getElementById('btn-open-register-customer-modal'),

  // Booking View
  bookingForm: document.getElementById('booking-form'),
  bookingCustomerSelect: document.getElementById('booking-customer-select'),
  bookingVehicleSelect: document.getElementById('booking-vehicle-select'),
  bookingStartDate: document.getElementById('booking-start-date'),
  bookingEndDate: document.getElementById('booking-end-date'),
  bookingNotes: document.getElementById('booking-notes'),
  btnResetBookingForm: document.getElementById('btn-reset-booking-form'),
  quoteVehiclePreview: document.getElementById('quote-vehicle-preview'),
  quoteDailyRate: document.getElementById('quote-daily-rate'),
  quoteDuration: document.getElementById('quote-duration'),
  quoteSubtotal: document.getElementById('quote-subtotal'),
  quoteTax: document.getElementById('quote-tax'),
  quoteTotal: document.getElementById('quote-total'),

  // Active Rentals View
  activeRentalsTableBody: document.getElementById('active-rentals-table-body'),

  // History View
  historyTableBody: document.getElementById('history-table-body'),
  historyVehicleFilter: document.getElementById('history-vehicle-filter'),
  historyCustomerFilter: document.getElementById('history-customer-filter'),
  btnResetHistoryFilter: document.getElementById('btn-reset-history-filter'),
  historyCountBadge: document.getElementById('history-count-badge'),

  // Inspector View
  sandboxLookupInput: document.getElementById('sandbox-lookup-input'),
  btnRunSandboxQuery: document.getElementById('btn-run-sandbox-query'),
  sandboxLatencyPill: document.getElementById('sandbox-latency-pill'),
  sandboxTerminalOutput: document.getElementById('sandbox-terminal-output'),
  inspectorHashSetsContainer: document.getElementById('inspector-hashsets-container'),
  inspectorHashMapsContainer: document.getElementById('inspector-hashmaps-container'),

  // Modals
  modalRegisterVehicle: document.getElementById('modal-register-vehicle'),
  formRegisterVehicle: document.getElementById('form-register-vehicle'),
  btnCloseVehicleModal: document.getElementById('btn-close-vehicle-modal'),
  btnCancelVehicleModal: document.getElementById('btn-cancel-vehicle-modal'),

  modalRegisterCustomer: document.getElementById('modal-register-customer'),
  formRegisterCustomer: document.getElementById('form-register-customer'),
  btnCloseCustomerModal: document.getElementById('btn-close-customer-modal'),
  btnCancelCustomerModal: document.getElementById('btn-cancel-customer-modal'),

  modalReturnVehicle: document.getElementById('modal-return-vehicle'),
  returnDetailsBody: document.getElementById('return-details-body'),
  btnCloseReturnModal: document.getElementById('btn-close-return-modal'),
  btnCancelReturnModal: document.getElementById('btn-cancel-return-modal'),
  btnConfirmReturn: document.getElementById('btn-confirm-return'),

  // Toast
  toastContainer: document.getElementById('toast-container')
};

// =============================================================================
// TOAST NOTIFICATION UTILITY
// =============================================================================
function showToast(title, message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconSvg = type === 'success'
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`
    : type === 'error'
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <div class="toast-content">
      <h5>${title}</h5>
      <p>${message}</p>
    </div>
  `;

  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    setTimeout(() => toast.remove(), 200);
  }, 4200);
}

// =============================================================================
// VIEW NAVIGATION
// =============================================================================
const VIEW_METADATA = {
  dashboard: {
    title: 'Fleet Dashboard Overview',
    subtitle: 'Real-time telemetry, availability tracking, and rental operations'
  },
  fleet: {
    title: 'Fleet Management & Vehicle Directory',
    subtitle: 'O(1) Plate uniqueness validated via HashSet, stored in HashMap<String, Vehicle>'
  },
  customers: {
    title: 'Customer Registry & Verification',
    subtitle: 'Duplicate prevention via UniqueCustomers HashSet, stored in HashMap<String, Customer>'
  },
  booking: {
    title: 'Rental Booking Engine',
    subtitle: 'Dynamic multi-day pricing and automated HashMap state transition'
  },
  rentals: {
    title: 'Active Rentals & Return Dispatch',
    subtitle: 'Real-time deployed vehicles stored in activeBookings HashMap'
  },
  history: {
    title: 'Rental Audit & History Logs',
    subtitle: 'Chronological rental logs indexed in rentalHistory HashMap<String, List<Booking>>'
  },
  inspector: {
    title: 'Internal Memory & Algorithm Inspector',
    subtitle: 'Live bucket telemetry, collision diagnostics, and O(1) query sandbox'
  }
};

function switchView(viewName) {
  state.currentView = viewName;

  // Update Nav Buttons
  elements.navItems.forEach(item => {
    if (item.dataset.view === viewName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Update Panels
  elements.viewPanels.forEach(panel => {
    if (panel.id === `view-${viewName}`) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });

  // Update Titles
  const meta = VIEW_METADATA[viewName] || VIEW_METADATA.dashboard;
  elements.pageTitle.textContent = meta.title;
  elements.pageSubtitle.textContent = meta.subtitle;

  // Refresh view data
  if (viewName === 'inspector') {
    renderInspector();
  } else if (viewName === 'history') {
    loadHistory();
  } else if (viewName === 'rentals') {
    loadActiveBookings();
  } else if (viewName === 'booking') {
    populateBookingDropdowns();
  }
}

// =============================================================================
// DATA FETCHING & SYNCHRONIZATION
// =============================================================================
async function refreshAllData() {
  try {
    await Promise.all([
      loadStats(),
      loadVehicles(),
      loadCustomers(),
      loadActiveBookings()
    ]);
  } catch (err) {
    console.error("Error refreshing data:", err);
  }
}

async function loadStats() {
  const stats = await api.getStats();
  state.stats = stats;

  elements.statTotalFleet.textContent = stats.totalFleet;
  elements.statAvailableFleet.textContent = stats.availableVehicles;
  elements.statActiveRentals.textContent = stats.activeBookings;
  elements.statTotalRevenue.textContent = `$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  elements.statUtilizationRate.textContent = `${stats.utilizationRate}%`;
  elements.statUtilizationBar.style.width = `${Math.min(100, stats.utilizationRate)}%`;

  elements.navFleetCount.textContent = stats.totalFleet;
  elements.navActiveCount.textContent = stats.activeBookings;

  // Update callout badges
  elements.badgeUniqueVehiclesCount.textContent = `${stats.totalFleet} keys`;
  elements.badgeUniqueCustomersCount.textContent = `${stats.totalCustomers} verified`;
  elements.badgeVehicleMapCount.textContent = `${stats.totalFleet} entities`;
  elements.badgeActiveMapCount.textContent = `${stats.activeBookings} dispatched`;
}

async function loadVehicles() {
  const list = await api.getVehicles();
  state.vehicles = list;
  renderFleetTable();
  renderDashboardFleetTable();
  populateHistoryFilters();
  populateBookingDropdowns();
}

async function loadCustomers() {
  const list = await api.getCustomers();
  state.customers = list;
  renderCustomersTable();
  populateHistoryFilters();
  populateBookingDropdowns();
}

async function loadActiveBookings() {
  const list = await api.getActiveBookings();
  state.activeBookings = list;
  renderActiveRentalsTable();
  renderDashboardActiveTable();
}

async function loadHistory() {
  const params = {};
  if (state.historyFilter.vehicleId) params.vehicleId = state.historyFilter.vehicleId;
  if (state.historyFilter.customerId) params.customerId = state.historyFilter.customerId;

  const logs = await api.getRentalHistory(params);
  state.historyLogs = logs;
  renderHistoryTable();
}

// =============================================================================
// RENDERERS
// =============================================================================

function getStatusBadge(status) {
  if (status === 'Available') {
    return `<span class="badge badge-emerald">Available</span>`;
  } else if (status === 'Rented') {
    return `<span class="badge badge-rose">Rented</span>`;
  } else if (status === 'Maintenance') {
    return `<span class="badge badge-amber">Maintenance</span>`;
  }
  return `<span class="badge badge-gray">${status}</span>`;
}

// Dashboard mini fleet table
function renderDashboardFleetTable() {
  const tbody = elements.dashboardFleetTableBody;
  tbody.innerHTML = '';

  const displayList = state.vehicles.slice(0, 5);
  if (displayList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--text-muted);">No vehicles registered.</td></tr>`;
    return;
  }

  displayList.forEach(v => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="vehicle-cell-title">
          <span class="plate-chip">${v.plateNumber}</span>
          <span>${v.make} ${v.model}</span>
        </div>
      </td>
      <td><span class="badge badge-gray">${v.type}</span></td>
      <td class="rate-cell">$${v.dailyRate}/day</td>
      <td>${getStatusBadge(v.status)}</td>
      <td>
        ${v.status === 'Available'
          ? `<button class="btn btn-sm btn-primary btn-quick-rent" data-id="${v.id}">Rent Now</button>`
          : v.status === 'Rented'
          ? `<span class="text-rose" style="font-size:0.75rem; font-weight:600;">Dispatched</span>`
          : `<span class="text-amber" style="font-size:0.75rem; font-weight:600;">Service</span>`
        }
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Dashboard active bookings table
function renderDashboardActiveTable() {
  const tbody = elements.dashboardActiveTableBody;
  tbody.innerHTML = '';

  if (state.activeBookings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: var(--text-muted); padding: 24px;">No vehicles currently out on rental. All available in fleet.</td></tr>`;
    return;
  }

  state.activeBookings.forEach(b => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="code-pill">${b.id}</span></td>
      <td>
        <div class="vehicle-cell-title">
          <span class="plate-chip">${b.vehiclePlate}</span>
          <span>${b.vehicleModel}</span>
        </div>
      </td>
      <td><strong>${b.customerName}</strong></td>
      <td>${b.startDate} &rarr; ${b.endDate} (${b.days}d)</td>
      <td class="rate-cell text-cyan">$${Number(b.totalAmount).toFixed(2)}</td>
      <td><span class="badge badge-rose">Active Rental</span></td>
      <td>
        <button class="btn btn-sm btn-emerald btn-return-trigger" data-id="${b.id}">Return Vehicle</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Full Fleet View Table
function renderFleetTable() {
  const tbody = elements.fleetTableBody;
  tbody.innerHTML = '';

  let list = [...state.vehicles];

  // Apply status filter
  if (state.fleetFilter.status !== 'All') {
    list = list.filter(v => v.status.toLowerCase() === state.fleetFilter.status.toLowerCase());
  }

  // Apply type filter
  if (state.fleetFilter.type !== 'All') {
    list = list.filter(v => v.type.toLowerCase() === state.fleetFilter.type.toLowerCase());
  }

  // Apply search query
  if (state.fleetFilter.search) {
    const q = state.fleetFilter.search.toLowerCase();
    list = list.filter(v =>
      v.plateNumber.toLowerCase().includes(q) ||
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.id.toLowerCase().includes(q)
    );
  }

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: var(--text-muted); padding: 32px;">No vehicles match the selected filter criteria.</td></tr>`;
    return;
  }

  list.forEach(v => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="code-pill">${v.id}</span></td>
      <td><span class="plate-chip">${v.plateNumber}</span></td>
      <td>
        <strong>${v.make} ${v.model}</strong>
        <div style="font-size:0.72rem; color:var(--text-muted);">VIN: ${v.vin || 'N/A'}</div>
      </td>
      <td><span class="badge badge-indigo">${v.type}</span></td>
      <td>${v.year} &bull; <span style="color:var(--text-secondary);">${v.color}</span></td>
      <td class="rate-cell">$${v.dailyRate} / day</td>
      <td>${getStatusBadge(v.status)}</td>
      <td>
        <div style="display:flex; gap:6px;">
          ${v.status === 'Available'
            ? `<button class="btn btn-sm btn-primary btn-quick-rent" data-id="${v.id}">Rent</button>
               <button class="btn btn-sm btn-outline btn-toggle-maintenance" data-id="${v.id}" data-action="Maintenance" title="Send to Maintenance">Service</button>`
            : v.status === 'Maintenance'
            ? `<button class="btn btn-sm btn-emerald btn-toggle-maintenance" data-id="${v.id}" data-action="Available">Restore Available</button>`
            : `<button class="btn btn-sm btn-secondary btn-return-trigger" data-id="${v.id}">Return</button>`
          }
          <button class="btn btn-sm btn-outline btn-inspect-history" data-id="${v.id}" title="View History Logs">Logs</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Full Customer View Table
function renderCustomersTable() {
  const tbody = elements.customersTableBody;
  tbody.innerHTML = '';

  let list = [...state.customers];
  if (state.customerSearch) {
    const q = state.customerSearch.toLowerCase();
    list = list.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  }

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: var(--text-muted); padding: 32px;">No customers found.</td></tr>`;
    return;
  }

  list.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="code-pill">${c.id}</span></td>
      <td><strong>${c.name}</strong></td>
      <td><span style="color:var(--accent-cyan);">${c.email}</span></td>
      <td>${c.phone}</td>
      <td><span class="code-pill">${c.licenseNumber}</span></td>
      <td><span class="badge badge-amber">${c.membership}</span></td>
      <td>${c.registeredAt}</td>
      <td>
        <button class="btn btn-sm btn-outline btn-customer-history" data-id="${c.id}">View Rentals</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Active Rentals View Table
function renderActiveRentalsTable() {
  const tbody = elements.activeRentalsTableBody;
  tbody.innerHTML = '';

  if (state.activeBookings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; color: var(--text-muted); padding: 36px;">No active rentals currently deployed. All vehicles are in fleet inventory.</td></tr>`;
    return;
  }

  state.activeBookings.forEach(b => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="code-pill">${b.id}</span></td>
      <td><span class="plate-chip">${b.vehiclePlate}</span></td>
      <td><strong>${b.vehicleModel}</strong></td>
      <td>
        <div><strong>${b.customerName}</strong></div>
        <div style="font-size:0.72rem; color:var(--text-muted);">${b.customerEmail || ''}</div>
      </td>
      <td>${b.startDate} &rarr; ${b.endDate}</td>
      <td>${b.days} Days</td>
      <td class="rate-cell">$${b.dailyRate}/day</td>
      <td class="rate-cell text-cyan" style="font-size:0.95rem;">$${Number(b.totalAmount).toFixed(2)}</td>
      <td>
        <button class="btn btn-sm btn-emerald btn-return-trigger" data-id="${b.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          <span>Return Vehicle</span>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Rental History Logs Table
function renderHistoryTable() {
  const tbody = elements.historyTableBody;
  tbody.innerHTML = '';

  const logs = state.historyLogs;
  elements.historyCountBadge.textContent = `${logs.length} Logs Found`;

  if (logs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; color: var(--text-muted); padding: 36px;">No rental history logs recorded for the selected criteria.</td></tr>`;
    return;
  }

  logs.forEach(item => {
    const tr = document.createElement('tr');
    const isCompleted = item.status === 'Completed';
    tr.innerHTML = `
      <td><span class="code-pill">${item.id}</span></td>
      <td>${new Date(item.createdAt).toLocaleDateString()}</td>
      <td>
        <span class="plate-chip">${item.vehiclePlate}</span>
        <span style="margin-left: 6px;">${item.vehicleModel}</span>
      </td>
      <td><strong>${item.customerName}</strong></td>
      <td>${item.days} Days</td>
      <td class="rate-cell">$${item.dailyRate}/day</td>
      <td class="rate-cell text-cyan">$${Number(item.totalAmount).toFixed(2)}</td>
      <td>
        ${isCompleted
          ? `<span class="badge badge-emerald">Completed</span>`
          : `<span class="badge badge-rose">Active</span>`
        }
      </td>
      <td>
        <span style="font-size: 0.75rem; color: var(--text-muted);">
          ${item.returnDate ? new Date(item.returnDate).toLocaleString() : 'Currently Active'}
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// =============================================================================
// BOOKING ENGINE HELPERS
// =============================================================================
function populateBookingDropdowns() {
  // Populate Customers
  const custSelect = elements.bookingCustomerSelect;
  const currentCust = custSelect.value;
  custSelect.innerHTML = `<option value="">-- Choose registered customer (CustomerRegistry Map) --</option>`;
  state.customers.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.name} (${c.id}) - ${c.membership}`;
    custSelect.appendChild(opt);
  });
  if (currentCust) custSelect.value = currentCust;

  // Populate Available Vehicles
  const vehSelect = elements.bookingVehicleSelect;
  const currentVeh = vehSelect.value;
  vehSelect.innerHTML = `<option value="">-- Choose available vehicle (VehicleDirectory Map) --</option>`;
  const availableVehicles = state.vehicles.filter(v => v.status === 'Available');
  availableVehicles.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.id;
    opt.textContent = `${v.make} ${v.model} [${v.plateNumber}] - $${v.dailyRate}/day (${v.type})`;
    vehSelect.appendChild(opt);
  });
  if (currentVeh && availableVehicles.some(v => v.id === currentVeh)) {
    vehSelect.value = currentVeh;
  }

  // Set default dates if empty
  if (!elements.bookingStartDate.value) {
    const today = new Date();
    const returnDate = new Date();
    returnDate.setDate(today.getDate() + 3);

    elements.bookingStartDate.value = today.toISOString().split('T')[0];
    elements.bookingEndDate.value = returnDate.toISOString().split('T')[0];
  }

  updateLiveQuote();
}

async function updateLiveQuote() {
  const vehicleId = elements.bookingVehicleSelect.value;
  const startDate = elements.bookingStartDate.value;
  const endDate = elements.bookingEndDate.value;

  if (!vehicleId) {
    elements.quoteVehiclePreview.innerHTML = `
      <div class="preview-placeholder">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.9 2 11.2 2 11.5V16c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
        <span>Select an available vehicle above to view specifications & dynamic pricing</span>
      </div>
    `;
    elements.quoteDailyRate.textContent = '$0.00 / day';
    elements.quoteDuration.textContent = '0 Days';
    elements.quoteSubtotal.textContent = '$0.00';
    elements.quoteTax.textContent = '$0.00';
    elements.quoteTotal.textContent = '$0.00';
    return;
  }

  const vehicle = state.vehicles.find(v => v.id === vehicleId);
  if (!vehicle) return;

  // Render vehicle preview
  elements.quoteVehiclePreview.innerHTML = `
    <div class="quote-vehicle-card">
      <div class="vehicle-lead-info">
        <h4>${vehicle.make} ${vehicle.model} (${vehicle.year})</h4>
        <p><span class="plate-chip">${vehicle.plateNumber}</span> &bull; ${vehicle.type} &bull; ${vehicle.color}</p>
      </div>
      <div style="text-align: right;">
        <div style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 700; color: #fff;">$${vehicle.dailyRate}</div>
        <div style="font-size: 0.72rem; color: var(--text-muted);">per 24h</div>
      </div>
    </div>
  `;

  if (!startDate || !endDate) return;

  try {
    const calc = await api.calculatePrice(vehicleId, startDate, endDate);
    elements.quoteDailyRate.textContent = `$${calc.dailyRate}.00 / day`;
    elements.quoteDuration.textContent = `${calc.days} Day${calc.days > 1 ? 's' : ''}`;
    elements.quoteSubtotal.textContent = `$${calc.baseCost.toFixed(2)}`;
    elements.quoteTax.textContent = `$${calc.tax.toFixed(2)}`;
    elements.quoteTotal.textContent = `$${calc.totalAmount.toFixed(2)}`;
  } catch (err) {
    console.error("Price calculation error:", err);
  }
}

// =============================================================================
// HISTORY FILTERS POPULATION
// =============================================================================
function populateHistoryFilters() {
  const vSelect = elements.historyVehicleFilter;
  const currentV = vSelect.value;
  vSelect.innerHTML = `<option value="">All Vehicles</option>`;
  state.vehicles.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v.id;
    opt.textContent = `${v.plateNumber} - ${v.make} ${v.model}`;
    vSelect.appendChild(opt);
  });
  if (currentV) vSelect.value = currentV;

  const cSelect = elements.historyCustomerFilter;
  const currentC = cSelect.value;
  cSelect.innerHTML = `<option value="">All Customers</option>`;
  state.customers.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.name} (${c.id})`;
    cSelect.appendChild(opt);
  });
  if (currentC) cSelect.value = currentC;
}

// =============================================================================
// INSPECTOR & BENCHMARK SANDBOX
// =============================================================================
async function renderInspector() {
  try {
    const data = await api.getDataStructures();

    // Render HashSets
    elements.inspectorHashSetsContainer.innerHTML = '';
    data.hashSets.forEach(set => {
      const card = document.createElement('div');
      card.className = 'ds-card';
      card.innerHTML = `
        <div class="ds-card-header">
          <span class="ds-card-title">${set.name}</span>
          <span class="badge badge-emerald">HashSet</span>
        </div>
        <div class="ds-metric-row">
          <span class="ds-metric-label">Size (Unique Elements):</span>
          <span class="ds-metric-val">${set.size}</span>
        </div>
        <div class="ds-metric-row">
          <span class="ds-metric-label">Backing Map Capacity:</span>
          <span class="ds-metric-val">${set.capacity}</span>
        </div>
        <div class="ds-metric-row">
          <span class="ds-metric-label">Duplicates Rejected:</span>
          <span class="ds-metric-val text-rose">${set.stats.duplicatesRejected}</span>
        </div>
        <div class="ds-metric-row">
          <span class="ds-metric-label">Add Operations:</span>
          <span class="ds-metric-val">${set.stats.adds}</span>
        </div>
        <div class="ds-metric-row">
          <span class="ds-metric-label">O(1) Uniqueness Checks:</span>
          <span class="ds-metric-val text-cyan">${set.stats.checks}</span>
        </div>
        <div class="ds-tags-container">
          ${set.elements.map(el => `<span class="ds-tag">${el}</span>`).join('')}
        </div>
      `;
      elements.inspectorHashSetsContainer.appendChild(card);
    });

    // Render HashMaps
    elements.inspectorHashMapsContainer.innerHTML = '';
    data.hashMaps.forEach(map => {
      const card = document.createElement('div');
      card.className = 'ds-card';
      card.innerHTML = `
        <div class="ds-card-header">
          <span class="ds-card-title">${map.name}</span>
          <span class="badge badge-indigo">HashMap</span>
        </div>
        <div class="ds-metric-row">
          <span class="ds-metric-label">Size (Active Key-Value Pairs):</span>
          <span class="ds-metric-val">${map.size}</span>
        </div>
        <div class="ds-metric-row">
          <span class="ds-metric-label">Total Bucket Array Capacity:</span>
          <span class="ds-metric-val">${map.capacity}</span>
        </div>
        <div class="ds-metric-row">
          <span class="ds-metric-label">Current Load Factor:</span>
          <span class="ds-metric-val">${map.loadFactor}</span>
        </div>
        <div class="ds-metric-row">
          <span class="ds-metric-label">Collision Rate:</span>
          <span class="ds-metric-val text-amber">${map.collisionRate}%</span>
        </div>
        <div class="ds-metric-row">
          <span class="ds-metric-label">Puts / Gets / Deletes:</span>
          <span class="ds-metric-val">${map.stats.puts} / ${map.stats.gets} / ${map.stats.deletes}</span>
        </div>
        <div class="ds-metric-row">
          <span class="ds-metric-label">Sample Key Entries:</span>
          <span class="ds-metric-val">${map.sampleEntries.length} previewed</span>
        </div>
        <div class="ds-tags-container">
          ${map.sampleEntries.map(e => `<span class="ds-tag" title="Hash bucket #${e.hashIndex}"><strong>${e.key}</strong> &rarr; ${e.preview}</span>`).join('')}
        </div>
      `;
      elements.inspectorHashMapsContainer.appendChild(card);
    });

  } catch (err) {
    console.error("Inspector load failed:", err);
  }
}

async function runSandboxBenchmark() {
  const query = elements.sandboxLookupInput.value.trim();
  if (!query) {
    showToast("Input Required", "Please enter a Plate Number or Vehicle ID.", "error");
    return;
  }

  try {
    const t0 = performance.now();
    const result = await api.getVehicleById(query);
    const clientLatency = (performance.now() - t0).toFixed(2);

    elements.sandboxLatencyPill.textContent = `${clientLatency} ms (Client-to-API)`;

    const output = {
      queryInput: query,
      dataStructure: "HashMap<String, Vehicle>",
      lookupComplexity: result.complexity,
      serverMemoryLatencyMs: result.lookupTimeMs,
      foundRecord: result.vehicle
    };

    elements.sandboxTerminalOutput.textContent = JSON.stringify(output, null, 2);
    showToast("O(1) HashMap Lookup Complete", `Found ${result.vehicle.make} ${result.vehicle.model} (${result.vehicle.plateNumber}) in ${result.lookupTimeMs}ms`, "success");
  } catch (err) {
    elements.sandboxTerminalOutput.textContent = `// ERROR: ${err.message}\nKey not located in VehicleDirectory HashMap.`;
    elements.sandboxLatencyPill.textContent = "Not Found";
    showToast("Lookup Error", err.message, "error");
  }
}

// =============================================================================
// EVENT LISTENERS & HANDLERS
// =============================================================================

function setupEventListeners() {
  // Navigation tabs
  elements.navItems.forEach(item => {
    item.addEventListener('click', () => {
      const view = item.dataset.view;
      if (view) switchView(view);
    });
  });

  // Topbar quick buttons
  elements.btnHeaderAddVehicle.addEventListener('click', () => {
    elements.modalRegisterVehicle.classList.add('show');
  });

  elements.btnHeaderNewRental.addEventListener('click', () => {
    switchView('booking');
  });

  // Dashboard quick triggers
  elements.btnViewAllFleet.addEventListener('click', () => switchView('fleet'));
  elements.btnDashboardNewRental.addEventListener('click', () => switchView('booking'));

  // Fleet View Filters
  elements.fleetFilterSearch.addEventListener('input', (e) => {
    state.fleetFilter.search = e.target.value;
    renderFleetTable();
  });

  elements.fleetStatusFilters.forEach(pill => {
    pill.addEventListener('click', () => {
      elements.fleetStatusFilters.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.fleetFilter.status = pill.dataset.status;
      renderFleetTable();
    });
  });

  elements.fleetTypeFilters.forEach(pill => {
    pill.addEventListener('click', () => {
      elements.fleetTypeFilters.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.fleetFilter.type = pill.dataset.type;
      renderFleetTable();
    });
  });

  elements.btnOpenRegisterVehicleModal.addEventListener('click', () => {
    elements.modalRegisterVehicle.classList.add('show');
  });

  // Customer View
  elements.customerFilterSearch.addEventListener('input', (e) => {
    state.customerSearch = e.target.value;
    renderCustomersTable();
  });

  elements.btnOpenRegisterCustomerModal.addEventListener('click', () => {
    elements.modalRegisterCustomer.classList.add('show');
  });

  // Modals close buttons
  elements.btnCloseVehicleModal.addEventListener('click', () => elements.modalRegisterVehicle.classList.remove('show'));
  elements.btnCancelVehicleModal.addEventListener('click', () => elements.modalRegisterVehicle.classList.remove('show'));

  elements.btnCloseCustomerModal.addEventListener('click', () => elements.modalRegisterCustomer.classList.remove('show'));
  elements.btnCancelCustomerModal.addEventListener('click', () => elements.modalRegisterCustomer.classList.remove('show'));

  elements.btnCloseReturnModal.addEventListener('click', () => elements.modalReturnVehicle.classList.remove('show'));
  elements.btnCancelReturnModal.addEventListener('click', () => elements.modalReturnVehicle.classList.remove('show'));

  // Form Submission: Register Vehicle (HashSet duplicate check)
  elements.formRegisterVehicle.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      plateNumber: document.getElementById('veh-plate').value.trim(),
      vin: document.getElementById('veh-vin').value.trim(),
      make: document.getElementById('veh-make').value.trim(),
      model: document.getElementById('veh-model').value.trim(),
      type: document.getElementById('veh-type').value,
      dailyRate: Number(document.getElementById('veh-rate').value),
      year: Number(document.getElementById('veh-year').value),
      color: document.getElementById('veh-color').value.trim(),
      features: document.getElementById('veh-features').value.trim()
    };

    try {
      const res = await api.registerVehicle(payload);
      showToast("Vehicle Registered", res.message, "success");
      elements.formRegisterVehicle.reset();
      elements.modalRegisterVehicle.classList.remove('show');
      await refreshAllData();
    } catch (err) {
      showToast("Registration Failed", err.message, "error");
    }
  });

  // Form Submission: Register Customer (HashSet duplicate check)
  elements.formRegisterCustomer.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      name: document.getElementById('cust-name').value.trim(),
      email: document.getElementById('cust-email').value.trim(),
      phone: document.getElementById('cust-phone').value.trim(),
      licenseNumber: document.getElementById('cust-license').value.trim(),
      membership: document.getElementById('cust-membership').value
    };

    try {
      const res = await api.registerCustomer(payload);
      showToast("Customer Registered", res.message, "success");
      elements.formRegisterCustomer.reset();
      elements.modalRegisterCustomer.classList.remove('show');
      await refreshAllData();
    } catch (err) {
      showToast("Customer Duplicate Detected", err.message, "error");
    }
  });

  // Booking Engine Listeners
  elements.bookingVehicleSelect.addEventListener('change', updateLiveQuote);
  elements.bookingStartDate.addEventListener('change', updateLiveQuote);
  elements.bookingEndDate.addEventListener('change', updateLiveQuote);

  elements.btnResetBookingForm.addEventListener('click', () => {
    elements.bookingForm.reset();
    populateBookingDropdowns();
  });

  elements.bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      customerId: elements.bookingCustomerSelect.value,
      vehicleId: elements.bookingVehicleSelect.value,
      startDate: elements.bookingStartDate.value,
      endDate: elements.bookingEndDate.value,
      notes: elements.bookingNotes.value.trim()
    };

    try {
      const res = await api.createBooking(payload);
      showToast("Booking Confirmed!", res.message, "success");
      elements.bookingForm.reset();
      await refreshAllData();
      populateBookingDropdowns();
      switchView('rentals');
    } catch (err) {
      showToast("Booking Error", err.message, "error");
    }
  });

  // Return Vehicle Modal Confirm Action
  elements.btnConfirmReturn.addEventListener('click', async () => {
    if (!state.pendingReturnBooking) return;

    try {
      const res = await api.returnVehicle({ bookingId: state.pendingReturnBooking.id });
      showToast("Vehicle Return Complete", res.message, "success");
      elements.modalReturnVehicle.classList.remove('show');
      state.pendingReturnBooking = null;
      await refreshAllData();
      if (state.currentView === 'history') loadHistory();
    } catch (err) {
      showToast("Return Failed", err.message, "error");
    }
  });

  // Table Action Delegations (Quick Rent, Toggle Maintenance, Return Trigger)
  document.addEventListener('click', async (e) => {
    // Quick rent button
    const quickRentBtn = e.target.closest('.btn-quick-rent');
    if (quickRentBtn) {
      const vId = quickRentBtn.dataset.id;
      switchView('booking');
      elements.bookingVehicleSelect.value = vId;
      updateLiveQuote();
      return;
    }

    // Toggle Maintenance
    const maintBtn = e.target.closest('.btn-toggle-maintenance');
    if (maintBtn) {
      const vId = maintBtn.dataset.id;
      const targetStatus = maintBtn.dataset.action;
      try {
        const res = await api.updateVehicleStatus(vId, targetStatus);
        showToast("Status Updated", res.message, "success");
        await refreshAllData();
      } catch (err) {
        showToast("Update Failed", err.message, "error");
      }
      return;
    }

    // Return Trigger
    const returnBtn = e.target.closest('.btn-return-trigger');
    if (returnBtn) {
      const id = returnBtn.dataset.id;
      // id can be bookingId or vehicleId
      let booking = state.activeBookings.find(b => b.id === id || b.vehicleId === id);
      if (!booking) {
        showToast("Error", "Active rental record not found.", "error");
        return;
      }

      state.pendingReturnBooking = booking;
      elements.returnDetailsBody.innerHTML = `
        <div style="margin-bottom: 12px;">
          <h4 style="color:#fff; font-size:1.05rem;">Conclude Rental for ${booking.vehicleModel}</h4>
          <p style="color:var(--text-muted); font-size:0.8rem;">Booking ID: <span class="code-pill">${booking.id}</span></p>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-secondary);">Customer:</span>
            <strong style="color:#fff;">${booking.customerName}</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-secondary);">License Plate:</span>
            <span class="plate-chip">${booking.vehiclePlate}</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="color:var(--text-secondary);">Duration & Period:</span>
            <span>${booking.startDate} &rarr; ${booking.endDate} (${booking.days} days)</span>
          </div>
          <div style="display:flex; justify-content:space-between; border-top:1px solid var(--border-subtle); padding-top:8px;">
            <span style="color:var(--text-secondary);">Total Rental Paid:</span>
            <span class="rate-cell text-cyan">$${Number(booking.totalAmount).toFixed(2)}</span>
          </div>
        </div>
        <div style="margin-top: 14px; font-size: 0.78rem; color: #a5b4fc;">
          &bull; Vehicle status will immediately revert to "Available" in the vehicle directory HashMap.<br>
          &bull; The booking will be closed and permanently indexed in the rental history HashMap.
        </div>
      `;
      elements.modalReturnVehicle.classList.add('show');
      return;
    }

    // Inspect History Logs for specific vehicle
    const vehHistoryBtn = e.target.closest('.btn-inspect-history');
    if (vehHistoryBtn) {
      const vId = vehHistoryBtn.dataset.id;
      switchView('history');
      elements.historyVehicleFilter.value = vId;
      state.historyFilter.vehicleId = vId;
      state.historyFilter.customerId = '';
      elements.historyCustomerFilter.value = '';
      loadHistory();
      return;
    }

    // Customer History
    const custHistoryBtn = e.target.closest('.btn-customer-history');
    if (custHistoryBtn) {
      const cId = custHistoryBtn.dataset.id;
      switchView('history');
      elements.historyCustomerFilter.value = cId;
      state.historyFilter.customerId = cId;
      state.historyFilter.vehicleId = '';
      elements.historyVehicleFilter.value = '';
      loadHistory();
      return;
    }
  });

  // History Filter Listeners
  elements.historyVehicleFilter.addEventListener('change', (e) => {
    state.historyFilter.vehicleId = e.target.value;
    loadHistory();
  });

  elements.historyCustomerFilter.addEventListener('change', (e) => {
    state.historyFilter.customerId = e.target.value;
    loadHistory();
  });

  elements.btnResetHistoryFilter.addEventListener('click', () => {
    elements.historyVehicleFilter.value = '';
    elements.historyCustomerFilter.value = '';
    state.historyFilter.vehicleId = '';
    state.historyFilter.customerId = '';
    loadHistory();
  });

  // Instant Header O(1) Lookup
  let lookupTimeout = null;
  elements.instantLookupInput.addEventListener('input', (e) => {
    clearTimeout(lookupTimeout);
    const query = e.target.value.trim();

    if (!query) {
      elements.quickResultDropdown.classList.remove('show');
      return;
    }

    lookupTimeout = setTimeout(async () => {
      try {
        const res = await api.getVehicleById(query);
        const v = res.vehicle;
        elements.quickResultDropdown.innerHTML = `
          <div class="quick-result-item" data-id="${v.id}">
            <div class="item-info">
              <h5>${v.make} ${v.model}</h5>
              <p><span class="plate-chip">${v.plateNumber}</span> &bull; ${v.type} &bull; $${v.dailyRate}/day &bull; Latency: ${res.lookupTimeMs}ms</p>
            </div>
            <div>${getStatusBadge(v.status)}</div>
          </div>
        `;
        elements.quickResultDropdown.classList.add('show');
      } catch (err) {
        elements.quickResultDropdown.innerHTML = `
          <div style="padding: 10px 12px; font-size: 0.8rem; color: var(--text-muted);">
            No matching vehicle key found in HashMap directory for "${query}".
          </div>
        `;
        elements.quickResultDropdown.classList.add('show');
      }
    }, 200);
  });

  // Click on quick result item
  elements.quickResultDropdown.addEventListener('click', (e) => {
    const item = e.target.closest('.quick-result-item');
    if (item) {
      const vId = item.dataset.id;
      elements.quickResultDropdown.classList.remove('show');
      elements.instantLookupInput.value = '';
      switchView('fleet');
      state.fleetFilter.search = vId;
      elements.fleetFilterSearch.value = vId;
      renderFleetTable();
    }
  });

  // Hide dropdown on click outside
  document.addEventListener('click', (e) => {
    if (!elements.instantLookupInput.contains(e.target) && !elements.quickResultDropdown.contains(e.target)) {
      elements.quickResultDropdown.classList.remove('show');
    }
  });

  // Inspector Sandbox Button
  elements.btnRunSandboxQuery.addEventListener('click', runSandboxBenchmark);
}

// =============================================================================
// INITIALIZATION
// =============================================================================
async function initApp() {
  setupEventListeners();
  await refreshAllData();
  switchView('dashboard');
  showToast("FleetPulse Ready", "HashSet duplicate detection & HashMap directories active.", "info");
}

document.addEventListener('DOMContentLoaded', initApp);
