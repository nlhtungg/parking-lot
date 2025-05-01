"use client";

import Sidebar from "../../components/Sidebar";
import { fetchParkingLots, addParkingLot } from "../../api/admin.api";
import { useState, useEffect } from "react";

export default function ParkingLotsPage() {
    return <ParkingLots />;
}

function ParkingLots() {
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ lot_name: "", car_capacity: "", bike_capacity: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [allLots, setAllLots] = useState([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        fetchParkingLots()
            .then((lots) => setAllLots(lots))
            .catch(() => setError("Failed to fetch parking lots"))
            .finally(() => setFetching(false));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const newLot = await addParkingLot(form);
            setAllLots([...allLots, newLot]);
            setShowForm(false);
            setForm({ lot_name: "", car_capacity: "", bike_capacity: "" });
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to add parking lot");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex" }}>
            <Sidebar />
            <div style={{ flex: 1, padding: 24 }}>
                <h1 className="text-2xl font-bold mb-4">Parking Lots</h1>
                <button
                    className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => setShowForm(true)}
                >
                    + Add Parking Lot
                </button>
                {fetching ? (
                    <div>Loading...</div>
                ) : (
                    <table className="min-w-full border text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2">Name</th>
                                <th className="border px-4 py-2">Car Capacity</th>
                                <th className="border px-4 py-2">Bike Capacity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allLots.map((lot) => (
                                <tr key={lot.lot_id}>
                                    <td className="border px-4 py-2">{lot.lot_name}</td>
                                    <td className="border px-4 py-2">{lot.car_capacity}</td>
                                    <td className="border px-4 py-2">{lot.bike_capacity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {showForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md min-w-[320px] relative">
                            <button
                                type="button"
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                                onClick={() => setShowForm(false)}
                            >
                                ×
                            </button>
                            <h2 className="text-lg font-bold mb-4">Add Parking Lot</h2>
                            {error && <div className="text-red-600 mb-2">{error}</div>}
                            <div className="mb-2">
                                <label className="block mb-1">Name</label>
                                <input
                                    name="lot_name"
                                    value={form.lot_name}
                                    onChange={handleChange}
                                    className="border px-2 py-1 rounded w-full"
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1">Car Capacity</label>
                                <input
                                    name="car_capacity"
                                    type="number"
                                    value={form.car_capacity}
                                    onChange={handleChange}
                                    className="border px-2 py-1 rounded w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Bike Capacity</label>
                                <input
                                    name="bike_capacity"
                                    type="number"
                                    value={form.bike_capacity}
                                    onChange={handleChange}
                                    className="border px-2 py-1 rounded w-full"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                                disabled={loading}
                            >
                                {loading ? "Adding..." : "Add"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
