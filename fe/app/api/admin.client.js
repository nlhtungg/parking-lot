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
