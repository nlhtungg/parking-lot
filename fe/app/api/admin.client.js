import api from "./client.config";

// ===================== PARKING LOTS =====================
// Fetch all parking lots
export async function fetchParkingLots() {
    const res = await api.get("/admin/parking-lots");
    return res.data.data;
}

// Add a new parking lot
export async function addParkingLot(lot) {
    const res = await api.post("/admin/parking-lots", lot);
    return res.data.data;
}

// Update a parking lot
export async function updateParkingLot(id, lot) {
    const res = await api.put(`/admin/parking-lots/${id}`, lot);
    return res.data.data;
}

// Delete a parking lot
export async function deleteParkingLot(id) {
    const res = await api.delete(`/admin/parking-lots/${id}`);
    return res.data.data;
}

// Fetch a parking lot by ID
export async function fetchParkingLotById(id) {
    const res = await api.get(`/admin/parking-lots/${id}`);
    return res.data.data;
}

// Fetch parking sessions for a lot
export async function fetchLotParkingSessions(lotId) {
    const res = await api.get(`/admin/parking-lots/${lotId}/sessions`);
    return res.data.data;
}

// ===================== USERS =====================
// Fetch all users
export async function fetchAllUsers() {
    const res = await api.get("/admin/users");
    return res.data.data;
}

// Fetch user by ID
export async function fetchUserById(id) {
    const res = await api.get(`/admin/users/${id}`);
    return res.data.data;
}

// Create a new user (employee or admin)
export async function createUser(user) {
    const res = await api.post("/admin/users", user);
    return res.data.data;
}

// Update a user
export async function updateUser(id, user) {
    const res = await api.put(`/admin/users/${id}`, user);
    return res.data.data;
}

// Delete a user
export async function deleteUser(id) {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data.data;
}

// Fetch free employees (not managing lots)
export async function fetchFreeEmployees() {
    const res = await api.get("/admin/users/free-employees");
    return res.data.data;
}

// ===================== MONTHLY SUBSCRIPTIONS =====================
// Fetch all monthly subs
export async function fetchAllMonthlySubs() {
    const res = await api.get("/admin/monthly-subs");
    return res.data.data;
}

// Create a new monthly sub
export async function createMonthlySub(sub) {
    const res = await api.post("/admin/monthly-subs", sub);
    return res.data.data;
}

// Delete a monthly sub
export async function deleteMonthlySub(id) {
    const res = await api.delete(`/admin/monthly-subs/${id}`);
    return res.data.data;
}

// Client: Fetch all fee configurations
export async function fetchFeeConfigurations() {
    const res = await api.get("/admin/fee-config");
    return res.data.data;
}

// Client: Update a fee configuration
export async function updateFeeConfiguration(fee) {
    const res = await api.post("/admin/fee-config", {
        ticket_type: fee.ticket_type,
        vehicle_type: fee.vehicle_type,
        service_fee: fee.service_fee,
        penalty_fee: fee.penalty_fee,
    });
    return res.data.data;
}

// Client: Fetch all notifications
export async function fetchNotifications() {
    const res = await api.get("/admin/notifications");
    return res.data.data;
}

// Client: Fetch a notification by ID
export async function fetchNotificationById(id) {
    const res = await api.get(`/admin/notifications/${id}`);
    return res.data.data;
}

// Client: Add a new notification
export async function addNotification(notification) {
    const res = await api.post("/admin/notifications", notification);
    return res.data.data;
}

// Client: Delete a notification
export async function deleteNotification(id) {
    const res = await api.delete(`/admin/notifications/${id}`);
    return res.data.data;
}