"use client";

import { useState, useEffect } from "react";
import { fetchMonthlySubs, createMonthlySub, deleteMonthlySub } from "@/app/api/admin.client";

const DEFAULT_PAGE_SIZE = 10;

export function useMonthlySubs() {
    const [subs, setSubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        license_plate: "",
        vehicle_type: "",
        start_date: "",
        months: "",
        owner_name: "",
        owner_phone: "",
    });
    const [formLoading, setFormLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        limit: DEFAULT_PAGE_SIZE,
        total: 0,
        totalPages: 0,
    });

    const vehicleTypeOptions = [
        { value: "car", label: "Car" },
        { value: "bike", label: "Bike" },
    ];

    const columns = [
        { key: "sub_id", label: "ID" },
        { key: "license_plate", label: "License Plate" },
        { key: "vehicle_type", label: "Vehicle Type" },
        { key: "start_date", label: "Start Date" },
        { key: "end_date", label: "End Date" },
        { key: "owner_name", label: "Owner Name" },
        { key: "owner_phone", label: "Owner Phone" },
    ];

    useEffect(() => {
        loadMonthlySubs();
    }, [pagination.page]);

    const loadMonthlySubs = async () => {
        try {
            setLoading(true);
            const response = await fetchMonthlySubs(pagination.page, pagination.limit);
            setSubs(response.data.subs);
            setPagination(response.data.pagination);
        } catch (err) {
            setError("Failed to load monthly subscriptions");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const clearSearch = () => {
        setSearchQuery("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setError("");

        try {
            await createMonthlySub(form);
            setShowForm(false);
            loadMonthlySubs(); // Reload the list
            setForm({
                license_plate: "",
                vehicle_type: "",
                start_date: "",
                months: "",
                owner_name: "",
                owner_phone: "",
            });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create monthly subscription");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (subId) => {
        if (window.confirm("Are you sure you want to delete this subscription?")) {
            try {
                await deleteMonthlySub(subId);
                setSubs((prevSubs) => prevSubs.filter((sub) => sub.sub_id !== subId));
            } catch (err) {
                console.error("Failed to delete subscription:", err);
                alert("Failed to delete subscription");
            }
        }
    };

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

    // Filter subs based on search query
    const filteredSubs = subs.filter(
        (sub) =>
            sub.license_plate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.vehicle_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.owner_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.owner_phone?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return {
        subs: filteredSubs,
        loading,
        error,
        form,
        formLoading,
        showForm,
        vehicleTypeOptions,
        columns,
        pagination,
        setShowForm,
        setError,
        handleChange,
        handleSubmit,
        handleDelete,
        handlePageChange,
        clearSearch,
    };
}
