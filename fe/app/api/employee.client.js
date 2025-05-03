import api from "./client.config";

export async function fetchHomePage() {
    const res = await api.get("/employee");
    return res.data.data;
}

// Get active parking sessions for the employee's lot
export async function fetchActiveSessions() {
    const res = await api.get("/employee/parking-sessions");
    return res.data.data;
}

// Check-in a vehicle
export async function checkInVehicle(sessionData) {
    const res = await api.post("/employee/parking-sessions", sessionData);
    return res.data.data;
}

// Check-out a vehicle
export async function checkOutVehicle(sessionId) {
    const res = await api.put(`/employee/parking-sessions/${sessionId}`);
    return res.data.data;
}