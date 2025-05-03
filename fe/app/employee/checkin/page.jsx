"use client";

import { useState, useEffect } from "react";
import { checkInVehicle, fetchParkingLots } from "../../api/employee.client";
import { useToast } from "../../components/providers/ToastProvider";
import PageHeader from "../../components/common/PageHeader";

export default function CheckInPage() {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [parkingLots, setParkingLots] = useState([]);
    const [selectedLotId, setSelectedLotId] = useState("");
    const [ticket, setTicket] = useState(null);
    const [form, setForm] = useState({
        license_plate: "",
        vehicle_type: "car",
    });

    // Fetch parking lots on component mount
    useEffect(() => {
        async function loadParkingLots() {
            try {
                const data = await fetchParkingLots();
                setParkingLots(data || []);
                if (data && data.length > 0) {
                    setSelectedLotId(data[0].lot_id);
                }
            } catch (error) {
                console.error("Error fetching parking lots:", error);
                toast.error("Failed to load parking lots");
            }
        }
        
        loadParkingLots();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setTicket(null);
        
        try {
            const response = await checkInVehicle({
                ...form,
                lot_id: selectedLotId || parkingLots[0]?.lot_id
            });
            
            if (response.success) {
                toast.success("Vehicle checked in successfully");
                setForm({
                    ...form,
                    license_plate: ""
                });
                setTicket(response.ticket);
            } else {
                toast.error(response.message || "Failed to check in vehicle");
            }
        } catch (error) {
            console.error("Check-in error:", error);
            const errorMessage = error.response?.data?.message || "Failed to check in vehicle";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString();
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
                        
                        {parkingLots.length > 1 && (
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Parking Lot *
                                </label>
                                <select
                                    value={selectedLotId}
                                    onChange={(e) => setSelectedLotId(e.target.value)}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {parkingLots.map(lot => (
                                        <option key={lot.lot_id} value={lot.lot_id}>
                                            {lot.lot_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
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
            
            {ticket && (
                <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-4">
                        Parking Ticket
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-600">Ticket ID:</p>
                            <p className="font-medium">{ticket.session_id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">License Plate:</p>
                            <p className="font-medium">{ticket.license_plate}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Vehicle Type:</p>
                            <p className="font-medium capitalize">{ticket.vehicle_type}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Check-in Time:</p>
                            <p className="font-medium">{formatDateTime(ticket.time_in)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Monthly Pass:</p>
                            <p className="font-medium">{ticket.is_monthly ? "Yes" : "No"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">QR Code:</p>
                            <p className="font-medium font-mono text-xs bg-gray-100 p-2 rounded">
                                {ticket.qr_code}
                            </p>
                        </div>
                    </div>
                    
                    <div className="mt-6 flex justify-center">
                        <button 
                            onClick={() => window.print()} 
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Print Ticket
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}