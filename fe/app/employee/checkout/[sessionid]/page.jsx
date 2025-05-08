"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

    // State: loading, error, checkout, payment method
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [checkout, setCheckout] = useState({
        amount: null,
        hours: null,
        serviceFee: null,
        penaltyFee: null,
        session: null,
    });
    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [liveHours, setLiveHours] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        if (!sessionid) return;
        setLoading(true);
        initiateCheckout(sessionid)
            .then((result) => {
                setCheckout({
                    amount: result.amount,
                    hours: result.hours,
                    serviceFee: result.serviceFee,
                    penaltyFee: result.penaltyFee,
                    session: result.session_details,
                });
                setLiveHours(result.hours);
            })
            .catch((err) => {
                setError(err.response?.data?.message || "Failed to load payment details");
            })
            .finally(() => setLoading(false));
    }, [sessionid]);

    // Live update current time and hours (duration)
    useEffect(() => {
        if (!checkout.session || !checkout.session.time_in) return;
        const interval = setInterval(() => {
            setCurrentTime(new Date());
            const checkInTime = new Date(checkout.session.time_in);
            const now = new Date();
            const diffMs = now - checkInTime;
            const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
            setLiveHours(diffHours);
        }, 1000); // update every second
        return () => clearInterval(interval);
    }, [checkout.session]);

    const handleConfirmPayment = async () => {
        if (!checkout.session) {
            toast.error("No checkout session to confirm");
            return;
        }
        setLoading(true);
        try {
            const result = await confirmCheckout(sessionid, paymentMethod);
            setCheckout((prev) => ({
                ...prev,
                amount: result.amount,
                hours: result.hours,
                serviceFee: result.serviceFee,
                penaltyFee: result.penaltyFee,
            }));
            toast.success("Payment confirmed and vehicle checked out");
            // Redirect to success page with relevant info
            const params = new URLSearchParams({
                license_plate: checkout.session.license_plate,
                duration_hours: (liveHours ?? checkout.hours).toString(),
                amount: (result.amount ?? checkout.amount).toString(),
                is_monthly: checkout.session.is_monthly ? "true" : "false",
                payment_method: paymentMethod,
            });
            router.replace(`/employee/checkout/success?${params.toString()}`);
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
    if (!checkout.session) return null;

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
                                    <span className="text-sm font-medium">{checkout.session.session_id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">License Plate:</span>
                                    <span className="text-sm font-medium">{checkout.session.license_plate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Vehicle Type:</span>
                                    <span className="text-sm font-medium capitalize">
                                        {checkout.session.vehicle_type}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Monthly Pass:</span>
                                    <span
                                        className={`text-sm font-medium ${
                                            checkout.session.is_monthly ? "text-green-600" : ""
                                        }`}
                                    >
                                        {checkout.session.is_monthly ? "Yes" : "No"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Lost Ticket:</span>
                                    <span
                                        className={`text-sm font-medium ${
                                            checkout.session.is_lost ? "text-red-600" : ""
                                        }`}
                                    >
                                        {checkout.session.is_lost ? "Yes (penalty applied)" : "No"}
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
                                        {formatDateTime(checkout.session.time_in)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Current Time:</span>
                                    <span className="text-sm font-medium">{formatDateTime(currentTime)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Duration:</span>
                                    <span className="text-sm font-medium">{liveHours ?? checkout.hours} hours</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <span className="text-sm text-gray-700">Payment Amount:</span>
                                    <span className="text-lg text-green-600 font-bold">
                                        {formatCurrency(checkout.amount)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Service Fee:</span>
                                    <span className="text-sm font-medium">{formatCurrency(checkout.serviceFee)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Penalty Fee:</span>
                                    <span className="text-sm font-medium">{formatCurrency(checkout.penaltyFee)}</span>
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
