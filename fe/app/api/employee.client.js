import api from "./client.config";

export async function fetchHomePage() {
    const res = await api.get("/employee");
    return res.data.data;
}