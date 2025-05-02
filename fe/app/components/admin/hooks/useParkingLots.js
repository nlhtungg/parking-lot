"use client";

import { useState, useEffect } from "react";
import {
    fetchParkingLots,
    addParkingLot,
    updateParkingLot,
    deleteParkingLot,
    fetchFreeEmployees,
} from "../../../api/admin.client";

export function useParkingLots() {
    const [lots, setLots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        lot_name: "",
        car_capacity: "",
        bike_capacity: "",
    });

    const [editForm, setEditForm] = useState({
        lot_id: "",
        lot_name: "",
        car_capacity: "",
        bike_capacity: "",
        managed_by: "",
    });

    const [formLoading, setFormLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [users, setUsers] = useState([]);

    // Fetch parking lots on mount
    useEffect(() => {
        fetchAllLots();
    }, []);

    // Fetch users for manager dropdown
    useEffect(() => {
        async function fetchUsers() {
            try {
                const usersData = await fetchFreeEmployees();
                setUsers(usersData);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        }
        fetchUsers();
    }, []);

    // Fetch all parking lots
    const fetchAllLots = async () => {
        setLoading(true);
        try {
            const data = await fetchParkingLots();
            setLots(data);
        } catch (err) {
            setError("Failed to fetch parking lots");
        } finally {
            setLoading(false);
        }
    };

    // Handle form change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle edit form change
    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    // Handle create form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setError("");
        try {
            const newLot = await addParkingLot(form);
            setLots([...lots, newLot]);
            setShowForm(false);
            resetForm();
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to add parking lot");
        } finally {
            setFormLoading(false);
        }
    };

    // Reset create form
    const resetForm = () => {
        setForm({ lot_name: "", car_capacity: "", bike_capacity: "" });
    };

    // Handle edit button click
    const handleEdit = (lot) => {
        const manager = users.find((user) => user.user_id === lot.managed_by);
        setEditForm({
            lot_id: lot.lot_id,
            lot_name: lot.lot_name,
            car_capacity: lot.car_capacity,
            bike_capacity: lot.bike_capacity,
            managed_by: lot.managed_by,
            manager_username: manager ? manager.username : "None",
        });
        setShowEditForm(true);
    };

    // Handle edit form submit
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const { lot_id, ...updateData } = editForm;
            const updatedLot = await updateParkingLot(lot_id, updateData);

            // Re-fetch the updated manager username
            const manager = users.find((user) => user.user_id === updatedLot.managed_by);
            updatedLot.manager_username = manager ? manager.username : "None";

            setLots(lots.map((lot) => (lot.lot_id === updatedLot.lot_id ? updatedLot : lot)));
            setShowEditForm(false);
        } catch (error) {
            console.error(`Failed to update lot:`, error);
            setError(error.message || "Failed to update parking lot");
        } finally {
            setFormLoading(false);
        }
    };

    // Handle delete
    const handleDelete = async (lotId) => {
        if (!confirm("Are you sure you want to delete this parking lot?")) return;
        try {
            await deleteParkingLot(lotId);
            setLots(lots.filter((lot) => lot.lot_id !== lotId));
        } catch (error) {
            console.error(`Failed to delete lot with ID ${lotId}:`, error);
            toast.error("Failed to delete parking lot");
        }
    };

    // Manager options for dropdown
    const managerOptions = [
        { value: "", label: "None" },
        ...users.map((user) => ({ value: user.user_id, label: user.username })),
    ];

    // Column definitions for the table
    const columns = [
        { key: "lot_name", label: "Name" },
        { key: "car_capacity", label: "Car Capacity" },
        { key: "bike_capacity", label: "Bike Capacity" },
        { key: "manager_username", label: "Managed by" },
    ];

    return {
        lots,
        loading,
        error,
        form,
        editForm,
        formLoading,
        showForm,
        showEditForm,
        managerOptions,
        columns,
        setShowForm,
        setShowEditForm,
        setError,
        handleChange,
        handleEditChange,
        handleSubmit,
        handleEditSubmit,
        handleEdit,
        handleDelete,
    };
}
