import api from "./client.config";

export async function fetchHomePage() {
    const res = await api.get("/employee");
    return res.data.data;
}

export async function fetchMyLot() {
    const res = await api.get("/employee/monitor");
    return res.data.data;
}

export async function fetchMyParkingSessions() {
    const res = await api.get("/employee/monitor/sessions");
    return res.data.data;
}

// Get parking lots for the employee
export async function fetchParkingLots() {
    const res = await api.get("/employee/parking-lots");
    return res.data.data;
}

// Get active parking sessions for the employee's lot
export async function fetchActiveSessions() {
    const res = await api.get("/employee/parking-sessions");
    return res.data.data;
}

// Check-in a vehicle (Entry API)
export async function checkInVehicle(sessionData) {
    const res = await api.post("/employee/parking/entry", sessionData);
    return res.data;
}

// Initiate check-out process (Exit Stage 1)
export async function initiateCheckout(sessionId, isLost = false) {
    const res = await api.post("/employee/parking/exit", {
        session_id: sessionId,
        is_lost: isLost
    });
    return res.data;
}

// Confirm payment and complete check-out (Exit Stage 2)
export async function confirmCheckout(paymentId, paymentMethod, isLost = false) {
    const res = await api.post("/employee/parking/exit/confirm", {
        payment_id: paymentId,
        payment_method: paymentMethod,
        is_lost: isLost
    });
    return res.data;
}

// Fetch user profile
export async function fetchMyProfile() {
    const res = await api.get("/employee/profile");
    return res.data; // Adjusted to return res.data directly
}

// Update user profile
export async function updateMyProfile(profileData) {
    const res = await api.put("/employee/profile", profileData);
    return res.data;
}