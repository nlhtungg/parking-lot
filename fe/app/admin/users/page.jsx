"use client";

import Sidebar from "../../components/Sidebar";
import Modal from "../../components/Modal";
import FormField from "../../components/FormField";
import { fetchAllUsers, createUser, updateUser, deleteUser } from "../../api/admin.client";
import { useState, useEffect } from "react";

export default function UsersPage() {
    return <UsersManagement />;
}

function UsersManagement() {
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ username: "", full_name: "", role: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [editForm, setEditForm] = useState({ user_id: "", username: "", full_name: "", role: "", password: "" });
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
            const newUser = await createUser(form);
            setAllUsers([...allUsers, newUser]);
            setShowForm(false);
            resetForm();
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to add user");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm({ username: "", full_name: "", role: "", password: "" });
    };

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

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const { user_id, ...updateData } = editForm;
            // Only include password in update if it was provided
            if (!updateData.password) {
                delete updateData.password;
            }
            const updatedUser = await updateUser(user_id, updateData);
            setAllUsers(allUsers.map((user) => (user.user_id === updatedUser.user_id ? updatedUser : user)));
            setShowEditForm(false);
        } catch (error) {
            setError(error.message || "Failed to update user");
            console.error(`Failed to update user:`, error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await deleteUser(userId);
            setAllUsers(allUsers.filter((user) => user.user_id !== userId));
        } catch (error) {
            console.error(`Failed to delete user with ID ${userId}:`, error);
            alert("Failed to delete user");
        }
    };

    // Role options for select dropdown
    const roleOptions = [
        { value: "", label: "Select Role" },
        { value: "admin", label: "Admin" },
        { value: "employee", label: "Employee" },
    ];

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

                {/* Add User Modal */}
                <Modal
                    isOpen={showForm}
                    onClose={() => {
                        setShowForm(false);
                        resetForm();
                        setError("");
                    }}
                    title="Add User"
                    mode="create"
                    error={error}
                    loading={loading}
                    onSubmit={handleSubmit}
                    submitText="Add"
                >
                    <FormField
                        name="username"
                        label="Username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />

                    <FormField
                        name="full_name"
                        label="Full Name"
                        value={form.full_name}
                        onChange={handleChange}
                        required
                    />

                    <FormField
                        name="role"
                        label="Role"
                        type="select"
                        value={form.role}
                        onChange={handleChange}
                        options={roleOptions}
                        required
                    />

                    <FormField
                        name="password"
                        label="Password"
                        type="password"
                        value={form.password || ""}
                        onChange={handleChange}
                        required
                    />
                </Modal>

                {/* Edit User Modal */}
                <Modal
                    isOpen={showEditForm}
                    onClose={() => {
                        setShowEditForm(false);
                        setError("");
                    }}
                    title="Edit User"
                    mode="update"
                    error={error}
                    loading={loading}
                    onSubmit={handleEditSubmit}
                    submitText="Save Changes"
                >
                    <FormField
                        name="username"
                        label="Username"
                        value={editForm.username}
                        onChange={handleEditChange}
                        required
                    />

                    <FormField
                        name="full_name"
                        label="Full Name"
                        value={editForm.full_name}
                        onChange={handleEditChange}
                        required
                    />

                    <FormField
                        name="role"
                        label="Role"
                        type="select"
                        value={editForm.role}
                        onChange={handleEditChange}
                        options={roleOptions}
                        required
                    />

                    <FormField
                        name="password"
                        label="Password"
                        type="password"
                        value={editForm.password || ""}
                        onChange={handleEditChange}
                        placeholder="Leave blank to keep current password"
                    />
                </Modal>
            </div>
        </div>
    );
}
