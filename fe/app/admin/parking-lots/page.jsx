"use client";

import Sidebar from "../../components/Sidebar";
import Modal from "../../components/Modal";
import FormField from "../../components/FormField";
import { IoMdClose } from "react-icons/io";
import {
    fetchParkingLots,
    addParkingLot,
    updateParkingLot,
    deleteParkingLot,
    fetchFreeEmployees,
} from "../../api/admin.client";
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
    const [editForm, setEditForm] = useState({
        lot_id: "",
        lot_name: "",
        car_capacity: "",
        bike_capacity: "",
        managed_by: "",
    });
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
                const usersData = await fetchFreeEmployees(); // Call the API function
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
            manager_username: manager ? manager.username : "None", // Default to current manager or None
        });
        setShowEditForm(true);
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
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
            setError(error.message || "Failed to update parking lot");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (lotId) => {
        if (!confirm("Are you sure you want to delete this parking lot?")) return;
        try {
            await deleteParkingLot(lotId); // Call the API with the lot ID
            // Update the state to remove the deleted lot
            setAllLots(allLots.filter((lot) => lot.lot_id !== lotId));
        } catch (error) {
            console.error(`Failed to delete lot with ID ${lotId}:`, error);
            alert("Failed to delete parking lot");
        }
    };

    // Create options array for the manager dropdown
    const managerOptions = [
        { value: "", label: "None" },
        ...users.map((user) => ({ value: user.user_id, label: user.username })),
    ];

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

                {/* Add Parking Lot Modal */}
                <Modal
                    isOpen={showForm}
                    onClose={() => setShowForm(false)}
                    title="Add Parking Lot"
                    mode="create"
                    error={error}
                    loading={loading}
                    onSubmit={handleSubmit}
                    submitText="Add"
                >
                    <FormField name="lot_name" label="Name" value={form.lot_name} onChange={handleChange} required />

                    <FormField
                        name="car_capacity"
                        label="Car Capacity"
                        type="number"
                        value={form.car_capacity}
                        onChange={handleChange}
                        min={0}
                        required
                    />

                    <FormField
                        name="bike_capacity"
                        label="Bike Capacity"
                        type="number"
                        value={form.bike_capacity}
                        onChange={handleChange}
                        min={0}
                        required
                    />
                </Modal>

                {/* Edit Parking Lot Modal */}
                <Modal
                    isOpen={showEditForm}
                    onClose={() => setShowEditForm(false)}
                    title="Edit Parking Lot"
                    mode="update"
                    error={error}
                    loading={loading}
                    onSubmit={handleEditSubmit}
                    submitText="Save Changes"
                >
                    <FormField
                        name="lot_name"
                        label="Name"
                        value={editForm.lot_name}
                        onChange={handleEditChange}
                        required
                    />

                    <FormField
                        name="car_capacity"
                        label="Car Capacity"
                        type="number"
                        value={editForm.car_capacity}
                        onChange={handleEditChange}
                        min={0}
                        required
                    />

                    <FormField
                        name="bike_capacity"
                        label="Bike Capacity"
                        type="number"
                        value={editForm.bike_capacity}
                        onChange={handleEditChange}
                        min={0}
                        required
                    />

                    <FormField
                        name="managed_by"
                        label="Managed by"
                        type="select"
                        value={editForm.managed_by || ""}
                        onChange={handleEditChange}
                        options={managerOptions}
                    />
                </Modal>
            </div>
        </div>
    );
}
