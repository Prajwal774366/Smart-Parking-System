const API_BASE = "http://localhost:9090/api";

const FLOORS = ["G", "F1", "F2", "F3", "F4", "B1", "B2"];

// Summary elements
const totalSlotsEl = document.getElementById("total-slots");
const occupiedSlotsEl = document.getElementById("occupied-slots");
const freeSlotsEl = document.getElementById("free-slots");

// Table
const slotsTableBody = document.getElementById("slots-table-body");

// Park / unpark elements
const parkForm = document.getElementById("park-form");
const parkMessage = document.getElementById("park-message");
const floorSelect = document.getElementById("floor-select");
const slotSelect = document.getElementById("slot-select");

const unparkForm = document.getElementById("unpark-form");
const unparkFloorSelect = document.getElementById("unpark-floor-select");
const unparkSlotSelect = document.getElementById("unpark-slot-select");
const billDetails = document.getElementById("bill-details");

// Auth bits for header
const adminStatusEl = document.getElementById("admin-status");
const authHintEl = document.getElementById("auth-hint");
const loginLink = document.getElementById("login-link");
const logoutBtn = document.getElementById("logout-btn");

// Auth state
let isLoggedIn = false;
let currentAdmin = null;

// slots cache
let allSlots = [];

// -------- Auth helpers --------

function updateAuthUI() {
  if (isLoggedIn && currentAdmin) {
    adminStatusEl.textContent = `Logged in as ${currentAdmin}`;
    authHintEl.textContent = "You are logged in. You can park/unpark vehicles.";
    logoutBtn.style.display = "inline-flex";
    loginLink.style.display = "none";
  } else {
    adminStatusEl.textContent = "Not logged in";
    authHintEl.textContent = "Login as admin to park/unpark vehicles.";
    logoutBtn.style.display = "none";
    loginLink.style.display = "inline-flex";
  }
}

function setLoggedOut() {
  isLoggedIn = false;
  currentAdmin = null;
  localStorage.removeItem("adminUsername");
  updateAuthUI();
}

// Initialize auth from localStorage
(function initAuth() {
  const saved = localStorage.getItem("adminUsername");
  if (saved) {
    isLoggedIn = true;
    currentAdmin = saved;
  }
  updateAuthUI();
})();

logoutBtn.addEventListener("click", () => {
  setLoggedOut();
});

// -------- Data fetch helpers --------

async function fetchSummary() {
  try {
    const res = await fetch(`${API_BASE}/summary`);
    const data = await res.json();
    totalSlotsEl.textContent = data.totalSlots;
    occupiedSlotsEl.textContent = data.occupiedSlots;
    freeSlotsEl.textContent = data.freeSlots;
  } catch (err) {
    console.error("Failed to load summary", err);
  }
}

async function fetchSlots() {
  try {
    const res = await fetch(`${API_BASE}/slots`);
    const slots = await res.json();
    allSlots = slots;
    renderSlots(slots);
    updateParkSlotsForFloor(floorSelect.value);
    updateUnparkSlotsForFloor(unparkFloorSelect.value);
  } catch (err) {
    console.error("Failed to load slots", err);
  }
}

function renderSlots(slots) {
  slotsTableBody.innerHTML = "";
  slots.forEach(slot => {
    const tr = document.createElement("tr");

    const tdId = document.createElement("td");
    tdId.textContent = slot.id;

    const tdFloor = document.createElement("td");
    tdFloor.textContent = slot.floor || "-";

    const tdStatus = document.createElement("td");
    tdStatus.textContent = slot.occupied ? "Occupied" : "Free";
    tdStatus.className = slot.occupied ? "status-occupied" : "status-free";

    const tdVehicle = document.createElement("td");
    tdVehicle.textContent = slot.vehicleNumber || "-";

    const tdEntry = document.createElement("td");
    tdEntry.textContent = slot.entryTime ? slot.entryTime.replace("T", " ") : "-";

    tr.appendChild(tdId);
    tr.appendChild(tdFloor);
    tr.appendChild(tdStatus);
    tr.appendChild(tdVehicle);
    tr.appendChild(tdEntry);

    slotsTableBody.appendChild(tr);
  });
}

async function refreshData() {
  await Promise.all([fetchSummary(), fetchSlots()]);
}

// -------- Dropdown helpers --------

function updateParkSlotsForFloor(floor) {
  slotSelect.innerHTML = "";
  if (!floor) {
    slotSelect.disabled = true;
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Select a floor first";
    slotSelect.appendChild(opt);
    return;
  }

  const freeSlots = allSlots.filter(
    s => !s.occupied && (s.floor === floor)
  );

  if (freeSlots.length === 0) {
    slotSelect.disabled = true;
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "No free slots on this floor";
    slotSelect.appendChild(opt);
    return;
  }

  slotSelect.disabled = false;

  const defaultOpt = document.createElement("option");
  defaultOpt.value = "";
  defaultOpt.textContent = "Select a slot";
  slotSelect.appendChild(defaultOpt);

  freeSlots.forEach(slot => {
    const opt = document.createElement("option");
    opt.value = String(slot.id);
    opt.textContent = `Slot ${slot.id}`;
    slotSelect.appendChild(opt);
  });
}

function updateUnparkSlotsForFloor(floor) {
  unparkSlotSelect.innerHTML = "";
  if (!floor) {
    unparkSlotSelect.disabled = true;
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Select a floor first";
    unparkSlotSelect.appendChild(opt);
    return;
  }

  const occupiedSlots = allSlots.filter(
    s => s.occupied && (s.floor === floor)
  );

  if (occupiedSlots.length === 0) {
    unparkSlotSelect.disabled = true;
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "No occupied slots on this floor";
    unparkSlotSelect.appendChild(opt);
    return;
  }

  unparkSlotSelect.disabled = false;

  const defaultOpt = document.createElement("option");
  defaultOpt.value = "";
  defaultOpt.textContent = "Select a slot";
  unparkSlotSelect.appendChild(defaultOpt);

  occupiedSlots.forEach(slot => {
    const opt = document.createElement("option");
    opt.value = String(slot.id);
    opt.textContent = `Slot ${slot.id}`;
    unparkSlotSelect.appendChild(opt);
  });
}

floorSelect.addEventListener("change", () => {
  updateParkSlotsForFloor(floorSelect.value);
});

unparkFloorSelect.addEventListener("change", () => {
  updateUnparkSlotsForFloor(unparkFloorSelect.value);
});

// -------- Park / Unpark handlers --------

parkForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  parkMessage.textContent = "";

  if (!isLoggedIn) {
    parkMessage.textContent = "Please login as admin to park a vehicle.";
    return;
  }

  const vehicleNumberInput = document.getElementById("vehicle-number");
  const vehicleNumber = vehicleNumberInput.value.trim().toUpperCase();
  const floor = floorSelect.value;
  const selectedSlotId = slotSelect.value;

  const vehiclePattern = /^[A-Za-z0-9]{10,}$/;
  if (!vehiclePattern.test(vehicleNumber)) {
    parkMessage.textContent = "Vehicle number must be alphanumeric and at least 10 characters (e.g. KA14RD6006).";
    return;
  }

  if (!floor) {
    parkMessage.textContent = "Please select a floor.";
    return;
  }

  if (!selectedSlotId) {
    parkMessage.textContent = "Please select a slot.";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/park`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vehicleNumber,
        slotId: parseInt(selectedSlotId, 10)
      })
    });

    const data = await res.json();
    parkMessage.textContent = data.message + (data.slotId > 0 ? ` (Slot: ${data.slotId})` : "");
    if (data.slotId > 0) {
      vehicleNumberInput.value = "";
      slotSelect.value = "";
    }
    await refreshData();
  } catch (err) {
    console.error("Error parking vehicle", err);
    parkMessage.textContent = "Error while parking vehicle.";
  }
});

unparkForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  billDetails.innerHTML = "";

  if (!isLoggedIn) {
    billDetails.textContent = "Please login as admin to unpark a vehicle.";
    return;
  }

  const floor = unparkFloorSelect.value;
  const selectedSlotId = unparkSlotSelect.value;

  if (!floor) {
    billDetails.textContent = "Please select a floor.";
    return;
  }
  if (!selectedSlotId) {
    billDetails.textContent = "Please select a slot.";
    return;
  }

  const slotId = parseInt(selectedSlotId, 10);

  try {
    const res = await fetch(`${API_BASE}/unpark`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slotId })
    });

    const data = await res.json();

    if (!data.vehicleNumber) {
      billDetails.textContent = data.message;
    } else {
      billDetails.innerHTML = `
        <div id="ticket">
          <h3>Parking Ticket</h3>
          <div>Message: ${data.message}</div>
          <div>Vehicle: <strong>${data.vehicleNumber}</strong></div>
          <div>Slot ID: ${data.slotId}</div>
          <div>Floor: ${floor}</div>
          <div>Entry Time: ${data.entryTime ? data.entryTime.replace("T", " ") : "-"}</div>
          <div>Exit Time: ${data.exitTime ? data.exitTime.replace("T", " ") : "-"}</div>
          <div>Duration: ${data.totalMinutes} minutes</div>
          <div>Billable Hours: ${data.billableHours}</div>
          <div>Amount to Pay: ₹${data.amountToPay}</div>
        </div>
        <button id="print-ticket-btn" class="btn btn-secondary small">Print Ticket</button>
      `;
      attachPrintListener();
    }
    unparkSlotSelect.value = "";
    await refreshData();
  } catch (err) {
    console.error("Error unparking vehicle", err);
    billDetails.textContent = "Error while unparking vehicle.";
  }
});

// -------- Ticket printing --------

function attachPrintListener() {
  const btn = document.getElementById("print-ticket-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const ticket = document.getElementById("ticket");
    if (!ticket) return;

    const win = window.open("", "_blank");
    win.document.write(`
      <html>
      <head>
        <title>Parking Ticket</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 16px; }
          h3 { margin-bottom: 10px; }
          div { margin-bottom: 4px; }
        </style>
      </head>
      <body>
        <div id="ticket-print-window">
          ${ticket.innerHTML}
        </div>
      </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  });
}

// -------- Initial load --------

refreshData();
