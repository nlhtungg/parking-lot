"use client";

import { useState, useEffect } from "react";
import { fetchUsers, addUser, updateUser, deleteUser } from "../../../api/admin.client";
import toast from "react-hot-toast";

export function useUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    });

    const [form, setForm] = useState({
        username: "",
        full_name: "",
        role: "",
        password: "",
    });

    const [editForm, setEditForm] = useState({
        user_id: "",
        username: "",
        full_name: "",
        role: "",
        password: "",
    });

    const [formLoading, setFormLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    // Fetch users on mount and when page changes
    useEffect(() => {
        fetchAllData();
    }, [pagination.page]);

    // Filter users when searchQuery or users changes
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredUsers(users);
            return;
        }

        const lowercasedQuery = searchQuery.toLowerCase();
        const results = users.filter(
            (user) =>
                user.username.toLowerCase().includes(lowercasedQuery) ||
                user.full_name.toLowerCase().includes(lowercasedQuery) ||
                user.role.toLowerCase().includes(lowercasedQuery)
        );
        setFilteredUsers(results);
    }, [searchQuery, users]);

    // Fetch all users
    const fetchAllData = async () => {
        setLoading(true);
        try {
            const response = await fetchUsers(pagination.page, pagination.limit);
            setUsers(response.data);
            setPagination(response.pagination);
        } catch (err) {
            setError("Failed to fetch users");
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
            const newUser = await createUser(form);
            setUsers([...users, newUser]);
            setShowForm(false);
            resetForm();
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to add user");
        } finally {
            setFormLoading(false);
        }
    };

    // Reset create form
    const resetForm = () => {
        setForm({ username: "", full_name: "", role: "", password: "" });
    };

    // Handle edit button click
    const handleEdit = (user) => {
        setEditForm({
            user_id: user.user_id,
            username: user.username,
            full_name: user.full_name,
            role: user.role,
            password: "",
        });
        setShowEditForm(true);
    };

    // Handle edit form submit
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setError("");
        try {
            const { user_id, ...updateData } = editForm;
            // Only include password in update if it was provided
            if (!updateData.password) {
                delete updateData.password;
            }
            const updatedUser = await updateUser(user_id, updateData);
            setUsers(users.map((user) => (user.user_id === updatedUser.user_id ? updatedUser : user)));
            setShowEditForm(false);
        } catch (error) {
            setError(error.message || "Failed to update user");
            console.error(`Failed to update user:`, error);
        } finally {
            setFormLoading(false);
        }
    };

    // Handle delete
    const handleDelete = async (userId) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await deleteUser(userId);
            setUsers(users.filter((user) => user.user_id !== userId));
        } catch (error) {
            console.error(`Failed to delete user with ID ${userId}:`, error);
            toast.error("Failed to delete user");
        }
    };

    // Handle search change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

    // Role options for dropdown
    const roleOptions = [
        { value: "", label: "Select Role" },
        { value: "admin", label: "Admin" },
        { value: "employee", label: "Employee" },
    ];

    // Column definitions for the table
    const columns = [
        { key: "username", label: "Username" },
        { key: "full_name", label: "Full Name" },
        { key: "role", label: "Role" },
    ];

    return {
        users,
        loading,
        error,
        form,
        editForm,
        formLoading,
        showForm,
        showEditForm,
        roleOptions,
        columns,
        pagination,
        setShowForm,
        setShowEditForm,
        setError,
        handleChange,
        handleEditChange,
        handleSubmit,
        handleEditSubmit,
        handleEdit,
        handleDelete,
        handleSearchChange,
        handlePageChange,
    };
}
