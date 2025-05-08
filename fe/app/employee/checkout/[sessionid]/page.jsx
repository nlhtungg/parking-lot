"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { initiateCheckout, confirmCheckout } from "@/app/api/employee.client";
import PageHeader from "@/app/components/common/PageHeader";
import { useToast } from "@/app/components/providers/ToastProvider";
import {
    FaRegCreditCard,
    FaCar,
    FaRegClock,
    FaMoneyBillWave,
    FaCreditCard,
    FaCheckCircle,
    FaSync,
} from "react-icons/fa";

export default function PaymentDetailsPage({ params }) {
    const { sessionid } = params;
    const toast = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [currentSession, setCurrentSession] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!sessionid) return;
        setLoading(true);
        initiateCheckout(sessionid)
            .then((result) => {
                setPaymentDetails(result);
                setCurrentSession(result.session_details);
            })
            .catch((err) => {
                setError(err.response?.data?.message || "Failed to load payment details");
            })
            .finally(() => setLoading(false));
    }, [sessionid]);

    const handleConfirmPayment = async () => {
        if (!paymentDetails || !currentSession) {
            toast.error("No checkout session to confirm");
            return;
        }
        setLoading(true);
        try {
            const result = await confirmCheckout(currentSession.session_id, paymentMethod, currentSession.is_lost);
            setPaymentDetails(result.payment);
            toast.success("Payment confirmed and vehicle checked out");
            router.replace("/employee/checkout");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to confirm payment");
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        return date.toLocaleString();
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
    if (!currentSession || !paymentDetails) return null;

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Payment Details" />
            <div className="bg-white shadow-md rounded-lg overflow-hidden mt-6">
                <div className="bg-blue-600 text-white px-6 py-4">
                    <h2 className="text-xl font-semibold flex items-center">
                        <FaRegCreditCard className="mr-2" />
                        Payment Details
                    </h2>
                    <p className="text-blue-100 text-sm">Confirm payment to complete checkout</p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="mb-4">
                                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                    <FaCar className="mr-2 text-blue-500" />
                                    Vehicle Information
                                </h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Ticket ID:</span>
                                    <span className="text-sm font-medium">{currentSession.session_id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">License Plate:</span>
                                    <span className="text-sm font-medium">{currentSession.license_plate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Vehicle Type:</span>
                                    <span className="text-sm font-medium capitalize">
                                        {currentSession.vehicle_type}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Monthly Pass:</span>
                                    <span
                                        className={`text-sm font-medium ${
                                            currentSession.is_monthly ? "text-green-600" : ""
                                        }`}
                                    >
                                        {currentSession.is_monthly ? "Yes" : "No"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Lost Ticket:</span>
                                    <span
                                        className={`text-sm font-medium ${
                                            currentSession.is_lost ? "text-red-600" : ""
                                        }`}
                                    >
                                        {currentSession.is_lost ? "Yes (penalty applied)" : "No"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="mb-4">
                                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                    <FaRegClock className="mr-2 text-blue-500" />
                                    Time & Billing
                                </h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Check-In Time:</span>
                                    <span className="text-sm font-medium">
                                        {formatDateTime(currentSession.time_in)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Current Time:</span>
                                    <span className="text-sm font-medium">{formatDateTime(new Date())}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Duration:</span>
                                    <span className="text-sm font-medium">{currentSession.duration_hours} hours</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <span className="text-sm text-gray-700">Payment Amount:</span>
                                    <span className="text-lg text-green-600 font-bold">
                                        {formatCurrency(paymentDetails.amount)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <FaMoneyBillWave className="mr-2 text-blue-500" />
                                Payment Method
                            </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                className={`border rounded-lg p-4 flex items-center cursor-pointer ${
                                    paymentMethod === "CASH" ? "bg-blue-50 border-blue-500" : "hover:bg-gray-100"
                                }`}
                                onClick={() => setPaymentMethod("CASH")}
                            >
                                <div className="mr-3 bg-blue-100 p-2 rounded-full">
                                    <FaMoneyBillWave
                                        className={`h-6 w-6 ${
                                            paymentMethod === "CASH" ? "text-blue-500" : "text-gray-400"
                                        }`}
                                    />
                                </div>
                                <div>
                                    <span
                                        className={`font-medium ${
                                            paymentMethod === "CASH" ? "text-blue-700" : "text-gray-700"
                                        }`}
                                    >
                                        Cash Payment
                                    </span>
                                    <p className="text-xs text-gray-500">Pay with physical cash</p>
                                </div>
                                <input
                                    type="radio"
                                    name="payment_method"
                                    value="CASH"
                                    checked={paymentMethod === "CASH"}
                                    onChange={() => setPaymentMethod("CASH")}
                                    className="ml-auto"
                                />
                            </div>
                            <div
                                className={`border rounded-lg p-4 flex items-center cursor-pointer ${
                                    paymentMethod === "CARD" ? "bg-blue-50 border-blue-500" : "hover:bg-gray-100"
                                }`}
                                onClick={() => setPaymentMethod("CARD")}
                            >
                                <div className="mr-3 bg-blue-100 p-2 rounded-full">
                                    <FaCreditCard
                                        className={`h-6 w-6 ${
                                            paymentMethod === "CARD" ? "text-blue-500" : "text-gray-400"
                                        }`}
                                    />
                                </div>
                                <div>
                                    <span
                                        className={`font-medium ${
                                            paymentMethod === "CARD" ? "text-blue-700" : "text-gray-700"
                                        }`}
                                    >
                                        Card Payment
                                    </span>
                                    <p className="text-xs text-gray-500">Pay with debit/credit card</p>
                                </div>
                                <input
                                    type="radio"
                                    name="payment_method"
                                    value="CARD"
                                    checked={paymentMethod === "CARD"}
                                    onChange={() => setPaymentMethod("CARD")}
                                    className="ml-auto"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <button
                            onClick={() => router.replace("/employee/checkout")}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmPayment}
                            disabled={loading}
                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 flex items-center"
                        >
                            {loading ? (
                                <>
                                    <FaSync className="animate-spin mr-2 h-4 w-4" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <FaCheckCircle className="mr-2 h-4 w-4" />
                                    Confirm Payment
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
