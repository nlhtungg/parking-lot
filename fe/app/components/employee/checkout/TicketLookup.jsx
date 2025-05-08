"use client";

import { useState } from "react";
import { FaTicketAlt, FaSearch } from "react-icons/fa";

export default function TicketLookup({
    manualSessionId,
    setManualSessionId,
    loading,
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

                    <button
                        type="submit"
                        disabled={!manualSessionId || loading}
                        className="w-full flex justify-center items-center py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 text-sm"
                    >
                        <FaSearch className="mr-2 h-3 w-3" />
                        Look Up Ticket
                    </button>
                </form>
            </div>
        </div>
    );
}
