import api from "./client.config";

// Client: Fetch all parking lots
export async function fetchParkingLots() {
    const res = await api.get("/admin/parking-lots");
    return res.data.data;
}

// Client: Add a new parking lot
export async function addParkingLot(lot) {
    const res = await api.post("/admin/parking-lots", lot);
    return res.data.data;
}

// Client: Update a parking lot
export async function updateParkingLot(id, lot) {
    const res = await api.put(`/admin/parking-lots/${id}`, lot);
    return res.data.data;
}

// Client: Delete a parking lot
export async function deleteParkingLot(id) {
    const res = await api.delete(`/admin/parking-lots/${id}`);
    return res.data.data;
}

// Client: Fetch all free employees
export async function fetchFreeEmployees() {
    const res = await api.get("/admin/users/free-employees");
    return res.data.data;
}

// Client: Fetch all users
export async function fetchAllUsers() {
    const res = await api.get("/admin/users");
    return res.data.data;
}

// Client: Add a new user
export async function addUser(user) {
    const res = await api.post("/admin/users", user);
    return res.data.data;
}

// Client: Update a user
export async function updateUser(id, user) {
    const res = await api.put(`/admin/users/${id}`, user);
    return res.data.data;
}

// Client: Delete a user
export async function deleteUser(id) {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data.data;
}