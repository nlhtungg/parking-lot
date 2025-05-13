"use client";

import { useState, useEffect } from "react";
import { fetchActiveSessions } from "../../api/employee.client";
import { useToast } from "../../components/providers/ToastProvider";
import PageHeader from "../../components/common/PageHeader";
import { useRouter } from "next/navigation";
import DataTable from "../../components/common/DataTable";
import { FaSearch, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function CheckOutPage() {
    const toast = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [activeSessions, setActiveSessions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [lastRefreshed, setLastRefreshed] = useState(Date.now());
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });

    useEffect(() => {
        loadActiveSessions();
    }, [lastRefreshed, pagination.page]);

    const loadActiveSessions = async () => {
        setLoading(true);
        try {
            const data = await fetchActiveSessions(pagination.page, pagination.limit);
            setActiveSessions(data.sessions || []);
            setPagination(data.pagination);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load sessions");
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchTerm("");
    };

    // DataTable columns and formatting
    const columns = [
        { key: "session_id", label: "Ticket ID" },
        { key: "license_plate", label: "License Plate" },
        { key: "vehicle_type", label: "Vehicle" },
        { key: "time_in", label: "Check-In Time" },
        { key: "is_monthly", label: "Monthly" },
        { key: "is_lost", label: "Is Lost" },
    ];

    const formatDateTime = (dateStr) => {
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        return date.toLocaleString();
    };

    const formatSessions = (sessions) =>
        sessions
            .filter((session) => session.license_plate.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((s) => ({
                ...s,
                vehicle_type: s.vehicle_type.charAt(0).toUpperCase() + s.vehicle_type.slice(1),
                time_in: formatDateTime(s.time_in),
                is_monthly: s.is_monthly ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Yes
                    </span>
                ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        No
                    </span>
                ),
                is_lost: s.is_lost ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-700">
                        Yes
                    </span>
                ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        No
                    </span>
                ),
            }));

    const handleDetail = (sessionId) => {
        router.push(`/employee/checkout/${sessionId}`);
    };

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Check-Out Vehicle" />
            <div className="mb-6 max-w-2xl relative">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="h-4 w-4 text-gray-400" />
                    </span>
                    {searchTerm && (
                        <button onClick={clearSearch} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <FaTimes className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </button>
                    )}
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by license plate..."
                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>
            </div>
            <DataTable
                columns={columns}
                data={formatSessions(activeSessions)}
                loading={loading}
                onDetail={handleDetail}
                idField="session_id"
            />

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                                pagination.page === 1
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.totalPages}
                            className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                                pagination.page === pagination.totalPages
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing{" "}
                                <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
                                <span className="font-medium">
                                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                                </span>{" "}
                                of <span className="font-medium">{pagination.total}</span> results
                            </p>
                        </div>
                        <div>
                            <nav
                                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                                aria-label="Pagination"
                            >
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                                        pagination.page === 1 ? "cursor-not-allowed" : "hover:bg-gray-50"
                                    }`}
                                >
                                    <span className="sr-only">Previous</span>
                                    <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                                </button>
                                {/* Page numbers */}
                                {[...Array(pagination.totalPages)].map((_, idx) => (
                                    <button
                                        key={idx + 1}
                                        onClick={() => handlePageChange(idx + 1)}
                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                            pagination.page === idx + 1
                                                ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                                : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                                        }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.totalPages}
                                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                                        pagination.page === pagination.totalPages
                                            ? "cursor-not-allowed"
                                            : "hover:bg-gray-50"
                                    }`}
                                >
                                    <span className="sr-only">Next</span>
                                    <FaChevronRight className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
