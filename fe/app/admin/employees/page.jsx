"use client";

import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import { fetchAllUsers, createUser, updateUser, deleteUser } from "../../api/admin.client";

export default function EmployeesPage() {
    return <Employees />;
}

function Employees() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [form, setForm] = useState({ username: "", password: "", full_name: "", role: "employee" });
    const [editForm, setEditForm] = useState({
        user_id: "",
        username: "",
        password: "",
        full_name: "",
        role: "employee",
    });
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAll();
    }, []);

    async function fetchAll() {
        setLoading(true);
        try {
            const data = await fetchAllUsers();
            setUsers(data);
        } catch (e) {
            setError("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            if (!form.username || !form.password || !form.full_name || !form.role) {
                setError("All fields required");
                return;
            }
            const newUser = await createUser(form);
            setUsers([...users, newUser]);
            setShowForm(false);
            setForm({ username: "", password: "", full_name: "", role: "employee" });
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to add user");
        }
    };

    const handleEdit = (user) => {
        setEditForm({
            user_id: user.user_id,
            username: user.username,
            password: "",
            full_name: user.full_name,
            role: user.role,
        });
        setShowEditForm(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const { user_id, ...updateData } = editForm;
            if (!updateData.username || !updateData.full_name || !updateData.role) {
                setError("All fields except password required");
                return;
            }
            // Only send password if changed
            if (!updateData.password) delete updateData.password;
            const updated = await updateUser(user_id, updateData);
            setUsers(users.map((u) => (u.user_id === updated.user_id ? updated : u)));
            setShowEditForm(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to update user");
        }
    };

    const handleDelete = async (user_id) => {
        if (!confirm("Delete this user?")) return;
        try {
            await deleteUser(user_id);
            setUsers(users.filter((u) => u.user_id !== user_id));
        } catch (err) {
            alert(err.response?.data?.message || err.message || "Failed to delete user");
        }
    };

    return (
        <div style={{ display: "flex" }}>
            <Sidebar />
            <div style={{ flex: 1, padding: 24 }}>
                <h1 className="text-2xl font-bold mb-4">Employees</h1>
                <button
                    className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => setShowForm(true)}
                >
                    + Add Employee
                </button>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <table className="min-w-full border text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2">Full Name</th>
                                <th className="border px-4 py-2">Username</th>
                                <th className="border px-4 py-2">Role</th>
                                <th className="border px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.user_id}>
                                    <td className="border px-4 py-2">{user.full_name}</td>
                                    <td className="border px-4 py-2">{user.username}</td>
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
                            <h2 className="text-lg font-bold mb-4">Add Employee</h2>
                            {error && <div className="text-red-600 mb-2">{error}</div>}
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
                                <label className="block mb-1">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    value={form.password}
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
                                    <option value="employee">Employee</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            >
                                Add
                            </button>
                        </form>
                    </div>
                )}
                {showEditForm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                        <form
                            onSubmit={handleEditSubmit}
                            className="bg-white p-6 rounded shadow-md min-w-[320px] relative"
                        >
                            <button
                                type="button"
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                                onClick={() => setShowEditForm(false)}
                            >
                                ×
                            </button>
                            <h2 className="text-lg font-bold mb-4">Edit Employee</h2>
                            {error && <div className="text-red-600 mb-2">{error}</div>}
                            <div className="mb-2">
                                <label className="block mb-1">Full Name</label>
                                <input
                                    name="full_name"
                                    value={editForm.full_name}
                                    onChange={handleEditChange}
                                    className="border px-2 py-1 rounded w-full"
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1">Username</label>
                                <input
                                    name="username"
                                    value={editForm.username}
                                    onChange={handleEditChange}
                                    className="border px-2 py-1 rounded w-full"
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block mb-1">Password (leave blank to keep unchanged)</label>
                                <input
                                    name="password"
                                    type="password"
                                    value={editForm.password}
                                    onChange={handleEditChange}
                                    className="border px-2 py-1 rounded w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">Role</label>
                                <select
                                    name="role"
                                    value={editForm.role}
                                    onChange={handleEditChange}
                                    className="border px-2 py-1 rounded w-full"
                                    required
                                >
                                    <option value="employee">Employee</option>
                                    <option value="admin">Admin</option>
                                </select>
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
