"use client";

import { FaCar, FaMotorcycle, FaRegCreditCard, FaSync, FaCheckCircle } from "react-icons/fa";

export default function ActiveSessions({
    activeSessions,
    loading,
    handleInitiateCheckout,
    processingId,
    formatDateTime,
}) {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Active Parking Sessions</h2>
                <span className="bg-white text-blue-600 rounded-full px-3 py-1 text-sm font-semibold">
                    {activeSessions.length} vehicles
                </span>
            </div>
            <div className="p-6">
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading active sessions...</p>
                    </div>
                ) : activeSessions.length === 0 ? (
                    <div className="text-center py-12 px-4">
                        <div className="bg-blue-100 p-3 rounded-full inline-flex items-center justify-center mb-4">
                            <FaCheckCircle className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No active sessions</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            All vehicles have been checked out. Vehicles will appear here after they check in.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Ticket ID
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        License Plate
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Vehicle
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Check-In Time
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Monthly
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {activeSessions.map((session) => (
                                    <tr key={session.session_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {session.session_id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {session.license_plate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className="flex items-center">
                                                <FaCar
                                                    className={`mr-2 ${
                                                        session.vehicle_type === "bike" ? "hidden" : ""
                                                    }`}
                                                />
                                                <FaMotorcycle
                                                    className={`mr-2 ${session.vehicle_type === "car" ? "hidden" : ""}`}
                                                />
                                                <span className="capitalize">{session.vehicle_type}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDateTime(session.time_in)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {session.is_monthly ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                    No
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleInitiateCheckout(session.session_id)}
                                                disabled={processingId === session.session_id}
                                                className="inline-flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
                                            >
                                                {processingId === session.session_id ? (
                                                    <>
                                                        <FaSync className="animate-spin mr-2 h-4 w-4" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaRegCreditCard className="mr-2 h-4 w-4" />
                                                        Check Out
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
