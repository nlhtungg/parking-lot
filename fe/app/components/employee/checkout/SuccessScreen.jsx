"use client";

import { FaCheckCircle, FaTicketAlt, FaMoneyBillWave, FaCreditCard } from "react-icons/fa";

export default function SuccessScreen({
    currentSession,
    paymentDetails,
    paymentMethod,
    resetCheckout,
    formatCurrency,
}) {
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
                            <p className="font-medium">{currentSession?.license_plate}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Duration:</p>
                            <p className="font-medium">{currentSession?.duration_hours} hours</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Payment Amount:</p>
                            <p className="font-medium">
                                {formatCurrency(paymentDetails?.amount)}
                                {currentSession?.is_monthly && " (Monthly Pass)"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Payment Method:</p>
                            <p className="font-medium flex items-center">
                                {paymentMethod === "CASH" ? (
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
                        onClick={resetCheckout}
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
