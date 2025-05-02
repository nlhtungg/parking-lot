"use client";

import Sidebar from "../../components/Sidebar";
import { fetchParkingLots, addParkingLot, updateParkingLot, deleteParkingLot, fetchAllUsers } from "../../api/admin.client";
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
    const [editForm, setEditForm] = useState({ lot_id: "", lot_name: "", car_capacity: "", bike_capacity: "", managed_by: "" });
    const [showEditForm, setShowEditForm] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchParkingLots()
            .then((lots) => setAllLots(lots))
            .catch(() => setError("Failed to fetch parking lots"))
            .finally(() => setFetching(false));
    }, []);

    useEffect(() => {
        // Fetch all users for the dropdown
        async function fetchUsers() {
            try {
                const usersData = await fetchAllUsers(); // Call the API function
                setUsers(usersData);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        }
        fetchUsers();
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

    const handleEdit = (lot) => {
        const manager = users.find((user) => user.user_id === lot.managed_by);
        setEditForm({
            lot_id: lot.lot_id,
            lot_name: lot.lot_name,
            car_capacity: lot.car_capacity,
            bike_capacity: lot.bike_capacity,
            managed_by: lot.managed_by,
            manager_username: manager ? manager.username : "None",
        });
        setShowEditForm(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const { lot_id, ...updateData } = editForm; // Extract lot_id and other fields
            const updatedLot = await updateParkingLot(lot_id, updateData); // Pass lot_id as param, others as body

            // Re-fetch the updated manager username
            const manager = users.find((user) => user.user_id === updatedLot.managed_by);
            updatedLot.manager_username = manager ? manager.username : "None";

            setAllLots(allLots.map((lot) => (lot.lot_id === updatedLot.lot_id ? updatedLot : lot)));
            setShowEditForm(false);
        } catch (error) {
            console.error(`Failed to update lot:`, error);
        }
    };

    const handleDelete = async (lotId) => {
        try {
            await deleteParkingLot(lotId); // Call the API with the lot ID
            console.log(`Deleted lot with ID: ${lotId}`);
            // Update the state to remove the deleted lot
            setAllLots(allLots.filter((lot) => lot.lot_id !== lotId));
        } catch (error) {
            console.error(`Failed to delete lot with ID ${lotId}:`, error);
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
                                <th className="border px-4 py-2">Managed by</th>
                                <th className="border px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allLots.map((lot) => (
                                <tr key={lot.lot_id}>
                                    <td className="border px-4 py-2">{lot.lot_name}</td>
                                    <td className="border px-4 py-2">{lot.car_capacity}</td>
                                    <td className="border px-4 py-2">{lot.bike_capacity}</td>
                                    <td className="border px-4 py-2">{lot.manager_username}</td>
                                    <td className="border px-4 py-2">
                                        <button
                                            className="text-blue-600 hover:underline mr-2"
                                            onClick={() => handleEdit(lot)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-600 hover:underline"
                                            onClick={() => handleDelete(lot.lot_id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
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
                                    onChange={(e) => {
                                        const value = Math.max(0, Number(e.target.value));
                                        setForm({ ...form, car_capacity: value });
                                    }}
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
                                    onChange={(e) => {
                                        const value = Math.max(0, Number(e.target.value));
                                        setForm({ ...form, bike_capacity: value });
                                    }}
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
                {showEditForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                        <form onSubmit={handleEditSubmit} className="bg-white p-6 rounded shadow-md min-w-[320px] relative">
                            <button
                                type="button"
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                                onClick={() => setShowEditForm(false)}
                            >
                                ×
                            </button>
                            <h2 className="text-lg font-bold mb-4">Edit Parking Lot</h2>
                            <div className="mb-2">
                                <label className="block mb-1">Name</label>
                                <input
                                    name="lot_name"
                                    value={editForm.lot_name}
                                    onChange={(e) => setEditForm({ ...editForm, lot_name: e.target.value })}
                                    className="border px-2 py-1 rounded w-full"
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1">Car Capacity</label>
                                <input
                                    name="car_capacity"
                                    type="number"
                                    value={editForm.car_capacity}
                                    onChange={(e) => {
                                        const value = e.target.value === "" ? "" : Math.max(0, Number(e.target.value));
                                        setEditForm({ ...editForm, car_capacity: value });
                                    }}
                                    className="border px-2 py-1 rounded w-full"
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1">Bike Capacity</label>
                                <input
                                    name="bike_capacity"
                                    type="number"
                                    value={editForm.bike_capacity}
                                    onChange={(e) => {
                                        const value = Math.max(0, Number(e.target.value));
                                        setEditForm({ ...editForm, bike_capacity: value });
                                    }}
                                    className="border px-2 py-1 rounded w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Managed by</label>
                                <select
                                    name="managed_by"
                                    value={editForm.managed_by || ""} // Ensure value is never null
                                    onChange={(e) => setEditForm({ ...editForm, managed_by: e.target.value || null })} // Allow null value
                                    className="border px-2 py-1 rounded w-full"
                                >
                                    <option value="">None</option> {/* Option for no manager */}
                                    {users.map((user) => (
                                        <option key={user.user_id} value={user.user_id}>
                                            {user.username}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
