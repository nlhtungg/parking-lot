"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCheckCircle, FaTicketAlt, FaMoneyBillWave, FaCreditCard } from "react-icons/fa";

export default function CheckoutSuccess() {
    const router = useRouter();
    const params = useSearchParams();

    // You'd get these from query params or a global store in a real app
    const license_plate = params.get("license_plate");
    const duration_hours = params.get("duration_hours");
    const amount = params.get("amount");
    const is_monthly = params.get("is_monthly") === "true";
    const payment_method = params.get("payment_method");

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
        }).format(amount);

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden mt-6">
            <div className="bg-green-600 text-white px-6 py-4">
                <h2 className="text-xl font-semibold flex items-center">
                    <FaCheckCircle className="mr-2" />
                    Checkout Successful
                </h2>
                <p className="text-green-100 text-sm">Vehicle has been successfully checked out</p>
            </div>
            <div className="p-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-green-100 rounded-full p-3">
                            <FaCheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-center text-green-800 mb-2">Payment Completed</h3>
                    <p className="text-center text-green-700 mb-6">
                        The vehicle has been successfully checked out from the parking lot.
                    </p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-w-lg mx-auto">
                        <div>
                            <p className="text-sm text-gray-500">License Plate:</p>
                            <p className="font-medium">{license_plate}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Duration:</p>
                            <p className="font-medium">{duration_hours} hours</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Payment Amount:</p>
                            <p className="font-medium">
                                {formatCurrency(amount)}
                                {is_monthly && " (Monthly Pass)"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Payment Method:</p>
                            <p className="font-medium flex items-center">
                                {payment_method === "CASH" ? (
                                    <>
                                        <FaMoneyBillWave className="mr-1 text-green-600" />
                                        Cash
                                    </>
                                ) : (
                                    <>
                                        <FaCreditCard className="mr-1 text-green-600" />
                                        Card
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center">
                    <button
                        onClick={() => router.replace("/employee/checkout")}
                        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                    >
                        <FaTicketAlt className="mr-2 h-4 w-4" />
                        Process Another Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}
