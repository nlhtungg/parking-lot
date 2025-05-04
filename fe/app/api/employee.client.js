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