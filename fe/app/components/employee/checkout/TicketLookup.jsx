"use client";

import { useState } from "react";
import { FaTicketAlt, FaSearch, FaSync, FaExclamationTriangle } from "react-icons/fa";

export default function TicketLookup({
    manualSessionId,
    setManualSessionId,
    isLostTicket,
    setIsLostTicket,
    loading,
    lotInfo,
    refreshSessions,
    handleTicketLookup,
}) {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-blue-600 text-white px-4 py-3">
                <h2 className="text-lg font-semibold flex items-center">
                    <FaTicketAlt className="mr-2" />
                    Ticket Lookup
                </h2>
            </div>
            <div className="p-4">
                <form onSubmit={handleTicketLookup} className="space-y-3">
                    <div>
                        <label htmlFor="ticketId" className="block text-sm font-medium text-gray-700 mb-1">
                            Ticket ID
                        </label>
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                id="ticketId"
                                type="text"
                                value={manualSessionId}
                                onChange={(e) => setManualSessionId(e.target.value)}
                                placeholder="Enter or scan ticket ID"
                                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="lost-ticket"
                            checked={isLostTicket}
                            onChange={(e) => setIsLostTicket(e.target.checked)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="lost-ticket" className="ml-2 flex items-center text-gray-700 text-sm">
                            <FaExclamationTriangle
                                className={`${isLostTicket ? "text-yellow-500" : "text-gray-400"} mr-2 h-4 w-4`}
                            />
                            Lost Ticket
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={!manualSessionId || loading}
                        className="w-full flex justify-center items-center py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
                    >
                        <FaSearch className="mr-2 h-3 w-3" />
                        Look Up Ticket
                    </button>
                </form>

                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center text-xs text-gray-500">
                        <span className="flex-grow">
                            Parking lot: <span className="font-medium">{lotInfo.lot_name || "N/A"}</span>
                        </span>
                        <button
                            onClick={refreshSessions}
                            disabled={loading}
                            className="ml-2 inline-flex items-center text-blue-600 hover:text-blue-800"
                        >
                            <FaSync className={`h-3 w-3 mr-1 ${loading ? "animate-spin" : ""}`} />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
