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
