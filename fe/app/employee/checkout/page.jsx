"use client";

import { useState, useEffect } from "react";
import { fetchActiveSessions, checkOutVehicle } from "../../api/employee.client";
import { useToast } from "../../components/providers/ToastProvider";
import PageHeader from "../../components/common/PageHeader";

export default function CheckOutPage() {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [activeSessions, setActiveSessions] = useState([]);
    const [lotInfo, setLotInfo] = useState({});
    const [checkoutResult, setCheckoutResult] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        loadActiveSessions();
    }, []);

    const loadActiveSessions = async () => {
        setLoading(true);
        try {
            const data = await fetchActiveSessions();
            setActiveSessions(data.sessions || []);
            setLotInfo({
                lot_id: data.lot_id,
                lot_name: data.lot_name
            });
        } catch (error) {
            console.error("Error fetching active sessions:", error);
            toast.error("Failed to load active parking sessions");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckout = async (sessionId) => {
        setProcessingId(sessionId);
        try {
            const result = await checkOutVehicle(sessionId);
            setCheckoutResult(result);
            
            // Remove the session from active sessions
            setActiveSessions(activeSessions.filter(
                session => session.session_id !== sessionId
            ));
            
            toast.success("Vehicle checked out successfully");
        } catch (error) {
            console.error("Checkout error:", error);
            const errorMessage = error.response?.data?.message || "Failed to check out vehicle";
            toast.error(errorMessage);
        } finally {
            setProcessingId(null);
        }
    };

    const formatDateTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString();
    };

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Check-Out Vehicle" />
            
            <div className="bg-white shadow-md rounded-lg p-6 mt-6">
                {loading ? (
                    <p className="text-center text-gray-600">Loading active sessions...</p>
                ) : activeSessions.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-lg text-gray-600 mb-4">No active parking sessions found.</p>
                        <p className="text-gray-500">All vehicles have been checked out.</p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-xl font-semibold mb-4">
                            Active Sessions for {lotInfo.lot_name}
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b text-left">License Plate</th>
                                        <th className="py-2 px-4 border-b text-left">Vehicle Type</th>
                                        <th className="py-2 px-4 border-b text-left">Ticket Type</th>
                                        <th className="py-2 px-4 border-b text-left">Check-In Time</th>
                                        <th className="py-2 px-4 border-b text-left">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeSessions.map((session) => (
                                        <tr key={session.session_id}>
                                            <td className="py-2 px-4 border-b">{session.license_plate}</td>
                                            <td className="py-2 px-4 border-b capitalize">{session.vehicle_type}</td>
                                            <td className="py-2 px-4 border-b capitalize">{session.ticket_type}</td>
                                            <td className="py-2 px-4 border-b">{formatDateTime(session.time_in)}</td>
                                            <td className="py-2 px-4 border-b">
                                                <button
                                                    onClick={() => handleCheckout(session.session_id)}
                                                    disabled={processingId === session.session_id}
                                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                                                >
                                                    {processingId === session.session_id ? "Processing..." : "Check Out"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
            
            {checkoutResult && (
                <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-4">
                        Vehicle Checked Out Successfully
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">License Plate:</p>
                            <p className="font-medium">{checkoutResult.license_plate}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Duration:</p>
                            <p className="font-medium">{checkoutResult.hours_parked} hours</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Payment Amount:</p>
                            <p className="font-medium">
                                ${checkoutResult.payment_amount || '0.00'} 
                                {checkoutResult.monthly_pass && " (Monthly Pass)"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Check-out Time:</p>
                            <p className="font-medium">{formatDateTime(checkoutResult.time_out)}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}