"use client";

import { useState } from "react";
import { checkInVehicle } from "../../api/employee.client";
import { useToast } from "../../components/providers/ToastProvider";
import PageHeader from "../../components/common/PageHeader";

export default function CheckInPage() {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        lot_id: "",
        license_plate: "",
        vehicle_type: "car",
        ticket_type: "regular"
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await checkInVehicle(form);
            toast.success("Vehicle checked in successfully");
            setForm({
                ...form,
                license_plate: ""
            });
        } catch (error) {
            console.error("Check-in error:", error);
            const errorMessage = error.response?.data?.message || "Failed to check in vehicle";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Check-In Vehicle" />
            
            <div className="bg-white shadow-md rounded-lg p-6 mt-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                License Plate *
                            </label>
                            <input
                                type="text"
                                name="license_plate"
                                value={form.license_plate}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., ABC-123"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Vehicle Type *
                            </label>
                            <select
                                name="vehicle_type"
                                value={form.vehicle_type}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="car">Car</option>
                                <option value="bike">Motorcycle</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Ticket Type *
                            </label>
                            <select
                                name="ticket_type"
                                value={form.ticket_type}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="regular">Regular</option>
                                <option value="event">Event</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? "Processing..." : "Check In Vehicle"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}