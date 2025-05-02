"use client";

import Sidebar from "../../components/Sidebar";
import { fetchAllUsers, addUser, updateUser, deleteUser } from "../../api/admin.client";
import { useState, useEffect } from "react";

export default function UsersPage() {
    return <UsersManagement />;
}

function UsersManagement() {
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ username: "", full_name: "", role: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [editForm, setEditForm] = useState({ user_id: "", username: "", full_name: "", role: "" });
    const [showEditForm, setShowEditForm] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const users = await fetchAllUsers();
                setAllUsers(users);
            } catch (error) {
                setError("Failed to fetch users");
            } finally {
                setFetching(false);
            }
        }
        fetchData();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const newUser = await addUser(form);
            setAllUsers([...allUsers, newUser]);
            setShowForm(false);
            setForm({ username: "", full_name: "", role: "" });
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to add user");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setEditForm({
            user_id: user.user_id,
            username: user.username,
            full_name: user.full_name,
            role: user.role,
            password_hash: user.password_hash, // Include current password hash
        });
        setShowEditForm(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const { user_id, ...updateData } = editForm;
            const updatedUser = await updateUser(user_id, updateData);
            setAllUsers(allUsers.map((user) => (user.user_id === updatedUser.user_id ? updatedUser : user)));
            setShowEditForm(false);
        } catch (error) {
            console.error(`Failed to update user:`, error);
        }
    };

    const handleDelete = async (userId) => {
        try {
            await deleteUser(userId);
            setAllUsers(allUsers.filter((user) => user.user_id !== userId));
        } catch (error) {
            console.error(`Failed to delete user with ID ${userId}:`, error);
        }
    };

    return (
        <div style={{ display: "flex" }}>
            <Sidebar />
            <div style={{ flex: 1, padding: 24 }}>
                <h1 className="text-2xl font-bold mb-4">Users Management</h1>
                <button
                    className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => setShowForm(true)}
                >
                    + Add User
                </button>
                {fetching ? (
                    <div>Loading...</div>
                ) : (
                    <table className="min-w-full border text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2">Username</th>
                                <th className="border px-4 py-2">Full Name</th>
                                <th className="border px-4 py-2">Role</th>
                                <th className="border px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allUsers.map((user) => (
                                <tr key={user.user_id}>
                                    <td className="border px-4 py-2">{user.username}</td>
                                    <td className="border px-4 py-2">{user.full_name}</td>
                                    <td className="border px-4 py-2">{user.role}</td>
                                    <td className="border px-4 py-2">
                                        <button
                                            className="text-blue-600 hover:underline mr-2"
                                            onClick={() => handleEdit(user)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-600 hover:underline"
                                            onClick={() => handleDelete(user.user_id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {showForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md min-w-[320px] relative">
                            <button
                                type="button"
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                                onClick={() => setShowForm(false)}
                            >
                                ×
                            </button>
                            <h2 className="text-lg font-bold mb-4">Add User</h2>
                            {error && <div className="text-red-600 mb-2">{error}</div>}
                            <div className="mb-2">
                                <label className="block mb-1">Username</label>
                                <input
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    className="border px-2 py-1 rounded w-full"
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1">Full Name</label>
                                <input
                                    name="full_name"
                                    value={form.full_name}
                                    onChange={handleChange}
                                    className="border px-2 py-1 rounded w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Role</label>
                                <select
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                    className="border px-2 py-1 rounded w-full"
                                    required
                                >
                                    <option value="">Select Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="employee">Employee</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    value={form.password || ""}
                                    onChange={handleChange}
                                    className="border px-2 py-1 rounded w-full"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                                disabled={loading}
                            >
                                {loading ? "Adding..." : "Add"}
                            </button>
                        </form>
                    </div>
                )}
                {showEditForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                        <form onSubmit={handleEditSubmit} className="bg-white p-6 rounded shadow-md min-w-[320px] relative">
                            <button
                                type="button"
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                                onClick={() => setShowEditForm(false)}
                            >
                                ×
                            </button>
                            <h2 className="text-lg font-bold mb-4">Edit User</h2>
                            <div className="mb-2">
                                <label className="block mb-1">Username</label>
                                <input
                                    name="username"
                                    value={editForm.username}
                                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                    className="border px-2 py-1 rounded w-full"
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1">Full Name</label>
                                <input
                                    name="full_name"
                                    value={editForm.full_name}
                                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                                    className="border px-2 py-1 rounded w-full"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Role</label>
                                <select
                                    name="role"
                                    value={form.role}
                                    onChange={handleChange}
                                    className="border px-2 py-1 rounded w-full"
                                    required
                                >
                                    <option value="">Select Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="employee">Employee</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    value={editForm.password || ""}
                                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                    className="border px-2 py-1 rounded w-full"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}