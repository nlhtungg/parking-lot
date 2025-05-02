"use client";

import Sidebar from "../../components/Sidebar";
import Modal from "../../components/Modal";
import FormField from "../../components/FormField";
import { useState, useEffect } from "react";
import { fetchAllMonthlySubs, createMonthlySub, deleteMonthlySub } from "../../api/admin.client";

export default function MonthlySubsPage() {
    return <MonthlySubs />;
}

function MonthlySubs() {
    const [subs, setSubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        license_plate: "",
        vehicle_type: "Car",
        start_date: "",
        months: 1,
        owner_name: "",
        owner_phone: "",
    });
    const [error, setError] = useState("");
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        fetchAll();
    }, []);

    async function fetchAll() {
        setLoading(true);
        try {
            const data = await fetchAllMonthlySubs();
            setSubs(data);
        } catch (e) {
            setError("Failed to fetch monthly subs");
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setFormLoading(true);
        try {
            if (
                !form.license_plate ||
                !form.vehicle_type ||
                !form.start_date ||
                !form.months ||
                !form.owner_name ||
                !form.owner_phone
            ) {
                setError("All fields required");
                setFormLoading(false);
                return;
            }
            const result = await createMonthlySub(form);
            setSubs([...subs, result.newMonthlySub]);
            setShowForm(false);
            resetForm();
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to add monthly sub");
        } finally {
            setFormLoading(false);
        }
    };

    const resetForm = () => {
        setForm({
            license_plate: "",
            vehicle_type: "Car",
            start_date: "",
            months: 1,
            owner_name: "",
            owner_phone: "",
        });
    };

    const handleDelete = async (sub_id) => {
        if (!confirm("Delete this monthly subscription?")) return;
        try {
            await deleteMonthlySub(sub_id);
            setSubs(subs.filter((s) => s.sub_id !== sub_id));
        } catch (err) {
            alert(err.response?.data?.message || err.message || "Failed to delete monthly sub");
        }
    };

    // Options for vehicle type dropdown
    const vehicleTypeOptions = [
        { value: "Car", label: "Car" },
        { value: "Bike", label: "Bike" },
    ];

    return (
        <div style={{ display: "flex" }}>
            <Sidebar />
            <div style={{ flex: 1, padding: 24 }}>
                <h1 className="text-2xl font-bold mb-4">Monthly Subscriptions</h1>
                <button
                    className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => setShowForm(true)}
                >
                    + Add Monthly Sub
                </button>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <table className="min-w-full border text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2">License Plate</th>
                                <th className="border px-4 py-2">Vehicle Type</th>
                                <th className="border px-4 py-2">Start Date</th>
                                <th className="border px-4 py-2">End Date</th>
                                <th className="border px-4 py-2">Owner Name</th>
                                <th className="border px-4 py-2">Owner Phone</th>
                                <th className="border px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subs.map((sub) => (
                                <tr key={sub.sub_id}>
                                    <td className="border px-4 py-2">{sub.license_plate}</td>
                                    <td className="border px-4 py-2">{sub.vehicle_type}</td>
                                    <td className="border px-4 py-2">{sub.start_date}</td>
                                    <td className="border px-4 py-2">{sub.end_date}</td>
                                    <td className="border px-4 py-2">{sub.owner_name}</td>
                                    <td className="border px-4 py-2">{sub.owner_phone}</td>
                                    <td className="border px-4 py-2">
                                        <button
                                            className="text-red-600 hover:underline"
                                            onClick={() => handleDelete(sub.sub_id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Create Monthly Sub Modal */}
                <Modal
                    isOpen={showForm}
                    onClose={() => {
                        setShowForm(false);
                        resetForm();
                        setError("");
                    }}
                    title="Add Monthly Subscription"
                    mode="create"
                    error={error}
                    loading={formLoading}
                    onSubmit={handleSubmit}
                    submitText="Add"
                >
                    <FormField
                        name="license_plate"
                        label="License Plate"
                        value={form.license_plate}
                        onChange={handleChange}
                        required
                    />

                    <FormField
                        name="vehicle_type"
                        label="Vehicle Type"
                        type="select"
                        value={form.vehicle_type}
                        onChange={handleChange}
                        options={vehicleTypeOptions}
                        required
                    />

                    <FormField
                        name="start_date"
                        label="Start Date"
                        type="date"
                        value={form.start_date}
                        onChange={handleChange}
                        required
                    />

                    <FormField
                        name="months"
                        label="Months"
                        type="number"
                        value={form.months}
                        onChange={handleChange}
                        min={1}
                        required
                    />

                    <FormField
                        name="owner_name"
                        label="Owner Name"
                        value={form.owner_name}
                        onChange={handleChange}
                        required
                    />

                    <FormField
                        name="owner_phone"
                        label="Owner Phone"
                        value={form.owner_phone}
                        onChange={handleChange}
                        required
                    />
                </Modal>
            </div>
        </div>
    );
}
