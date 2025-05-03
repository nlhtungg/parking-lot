"use client";

import { useState, useEffect } from "react";
import { fetchActiveSessions, initiateCheckout, confirmCheckout } from "../../api/employee.client";
import { useToast } from "../../components/providers/ToastProvider";
import PageHeader from "../../components/common/PageHeader";

export default function CheckOutPage() {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [activeSessions, setActiveSessions] = useState([]);
    const [lotInfo, setLotInfo] = useState({});
    const [checkoutStage, setCheckoutStage] = useState(0); // 0: none, 1: initiated, 2: completed
    const [processingId, setProcessingId] = useState(null);
    const [currentSession, setCurrentSession] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [isLostTicket, setIsLostTicket] = useState(false);
    const [manualSessionId, setManualSessionId] = useState("");

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

    const handleTicketLookup = async (e) => {
        e.preventDefault();
        if (!manualSessionId) {
            toast.error("Please enter a valid ticket ID");
            return;
        }

        setProcessingId(manualSessionId);
        try {
            await handleInitiateCheckout(manualSessionId);
        } catch (error) {
            toast.error("Failed to find ticket");
        } finally {
            setProcessingId(null);
        }
    };

    const handleInitiateCheckout = async (sessionId) => {
        setProcessingId(sessionId);
        try {
            const result = await initiateCheckout(sessionId, isLostTicket);
            setPaymentDetails(result);
            setCurrentSession(result.session_details);
            setCheckoutStage(1);
            
            toast.success("Checkout initiated");
        } catch (error) {
            console.error("Checkout initiation error:", error);
            const errorMessage = error.response?.data?.message || "Failed to initiate checkout";
            toast.error(errorMessage);
            throw error;
        } finally {
            setProcessingId(null);
        }
    };

    const handleConfirmPayment = async () => {
        if (!paymentDetails || !paymentDetails.payment_id) {
            toast.error("No payment to confirm");
            return;
        }

        setLoading(true);
        try {
            const result = await confirmCheckout(
                paymentDetails.payment_id, 
                paymentMethod,
                isLostTicket
            );
            
            setCheckoutStage(2);
            
            // Remove the session from active sessions if it's in the list
            setActiveSessions(activeSessions.filter(
                session => session.session_id !== currentSession?.session_id
            ));
            
            toast.success("Payment confirmed and vehicle checked out");
        } catch (error) {
            console.error("Payment confirmation error:", error);
            const errorMessage = error.response?.data?.message || "Failed to confirm payment";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const resetCheckout = () => {
        setCheckoutStage(0);
        setCurrentSession(null);
        setPaymentDetails(null);
        setIsLostTicket(false);
        setManualSessionId("");
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        return date.toLocaleString();
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Check-Out Vehicle" />
            
            {checkoutStage === 0 && (
                <>
                    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
                        <h2 className="text-xl font-semibold mb-4">Scan or Enter Ticket ID</h2>
                        <form onSubmit={handleTicketLookup} className="mb-6">
                            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                                <div className="flex-grow">
                                    <input
                                        type="text"
                                        value={manualSessionId}
                                        onChange={(e) => setManualSessionId(e.target.value)}
                                        placeholder="Enter ticket ID or scan barcode"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="lost-ticket"
                                            checked={isLostTicket}
                                            onChange={(e) => setIsLostTicket(e.target.checked)}
                                            className="mr-2"
                                        />
                                        <label htmlFor="lost-ticket">Lost Ticket</label>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={!manualSessionId || loading}
                                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                                >
                                    Look Up Ticket
                                </button>
                            </div>
                        </form>
                        
                        <h3 className="text-lg font-semibold mb-4 mt-8">Active Sessions</h3>
                        {loading ? (
                            <p className="text-center text-gray-600">Loading active sessions...</p>
                        ) : activeSessions.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-lg text-gray-600 mb-4">No active parking sessions found.</p>
                                <p className="text-gray-500">All vehicles have been checked out.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4 border-b text-left">Ticket ID</th>
                                            <th className="py-2 px-4 border-b text-left">License Plate</th>
                                            <th className="py-2 px-4 border-b text-left">Vehicle Type</th>
                                            <th className="py-2 px-4 border-b text-left">Check-In Time</th>
                                            <th className="py-2 px-4 border-b text-left">Monthly Pass</th>
                                            <th className="py-2 px-4 border-b text-left">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeSessions.map((session) => (
                                            <tr key={session.session_id}>
                                                <td className="py-2 px-4 border-b">{session.session_id}</td>
                                                <td className="py-2 px-4 border-b">{session.license_plate}</td>
                                                <td className="py-2 px-4 border-b capitalize">{session.vehicle_type}</td>
                                                <td className="py-2 px-4 border-b">{formatDateTime(session.time_in)}</td>
                                                <td className="py-2 px-4 border-b">{session.is_monthly ? "Yes" : "No"}</td>
                                                <td className="py-2 px-4 border-b">
                                                    <button
                                                        onClick={() => handleInitiateCheckout(session.session_id)}
                                                        disabled={processingId === session.session_id}
                                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                                                    >
                                                        {processingId === session.session_id ? "Processing..." : "Check Out"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
            
            {checkoutStage === 1 && currentSession && paymentDetails && (
                <div className="bg-white shadow-md rounded-lg p-6 mt-6">
                    <h2 className="text-xl font-semibold mb-4">Checkout Payment</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <p className="text-sm text-gray-600">Ticket ID:</p>
                            <p className="font-medium">{currentSession.session_id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">License Plate:</p>
                            <p className="font-medium">{currentSession.license_plate}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Vehicle Type:</p>
                            <p className="font-medium capitalize">{currentSession.vehicle_type}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Check-In Time:</p>
                            <p className="font-medium">{formatDateTime(currentSession.time_in)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Duration:</p>
                            <p className="font-medium">{currentSession.duration_hours} hours</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Monthly Pass:</p>
                            <p className="font-medium">{currentSession.is_monthly ? "Yes" : "No"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Lost Ticket:</p>
                            <p className="font-medium">{isLostTicket ? "Yes (penalty applied)" : "No"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Payment Amount:</p>
                            <p className="text-xl font-bold text-green-600">
                                {formatCurrency(paymentDetails.amount)}
                            </p>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 mt-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                Payment Method
                            </label>
                            <div className="flex space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="CASH"
                                        checked={paymentMethod === "CASH"}
                                        onChange={() => setPaymentMethod("CASH")}
                                        className="mr-2"
                                    />
                                    Cash
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="CARD"
                                        checked={paymentMethod === "CARD"}
                                        onChange={() => setPaymentMethod("CARD")}
                                        className="mr-2"
                                    />
                                    Card
                                </label>
                            </div>
                        </div>
                        
                        <div className="flex justify-between">
                            <button
                                onClick={resetCheckout}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmPayment}
                                disabled={loading}
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                            >
                                {loading ? "Processing..." : "Confirm Payment"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {checkoutStage === 2 && (
                <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-4">
                        Vehicle Checked Out Successfully
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">License Plate:</p>
                            <p className="font-medium">{currentSession?.license_plate}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Duration:</p>
                            <p className="font-medium">{currentSession?.duration_hours} hours</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Payment Amount:</p>
                            <p className="font-medium">
                                {formatCurrency(paymentDetails?.amount)}
                                {currentSession?.is_monthly && " (Monthly Pass)"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Payment Method:</p>
                            <p className="font-medium">{paymentMethod}</p>
                        </div>
                    </div>
                    
                    <div className="mt-6 flex justify-center">
                        <button 
                            onClick={resetCheckout} 
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Process Another Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}