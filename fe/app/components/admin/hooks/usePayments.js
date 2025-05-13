"use client";

import { useState, useEffect } from "react";
import { fetchAllPayments } from "../../../api/admin.client";

export function usePayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });

    // Fetch payments when page changes
    useEffect(() => {
        fetchPayments();
    }, [pagination.page]);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const response = await fetchAllPayments(pagination.page, pagination.limit);
            setPayments(response.data || []);
            setPagination(response.pagination);
        } catch (err) {
            setError("Failed to fetch payments");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        setPagination((prev) => ({
            ...prev,
            page: newPage,
        }));
    };

    // Filter payments based on search term
    const filteredPayments = payments.filter((payment) => {
        if (!searchTerm) return true;

        const searchLower = searchTerm.toLowerCase();
        return (
            payment.license_plate?.toLowerCase().includes(searchLower) ||
            payment.vehicle_type?.toLowerCase().includes(searchLower) ||
            payment.payment_method?.toLowerCase().includes(searchLower) ||
            payment.owner_name?.toLowerCase().includes(searchLower) ||
            payment.total_amount?.toString().includes(searchLower)
        );
    });

    const columns = [
        { key: "payment_id", label: "Payment ID" },
        { key: "license_plate", label: "License Plate" },
        { key: "vehicle_type", label: "Vehicle Type" },
        { key: "payment_method", label: "Payment Method" },
        { key: "total_amount", label: "Amount" },
        { key: "owner_name", label: "Owner Name" },
    ];

    return {
        payments: filteredPayments,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        columns,
        pagination,
        handlePageChange,
    };
}
