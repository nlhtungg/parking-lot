"use client";

import { useEffect, useState } from "react";
import { fetchMyProfile, updateMyProfile } from "../../api/employee.client";

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        current_password: "",
        new_password: "",
    });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await fetchMyProfile();
                setProfile(data);
            } catch (err) {
                setError("Failed to load profile.");
            }
        };

        loadProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEditClick = () => {
        setFormData({
            full_name: profile.full_name,
            current_password: "",
            new_password: "",
        });
        setIsModalOpen(true);
    };

    const handleSaveChanges = async () => {
        if (!formData.full_name || !formData.current_password) {
            setError("Please fill in all required fields.");
            return;
        }

        try {
            const response = await updateMyProfile(formData);
            if (response.message === "Profile updated successfully") {
                setProfile({ ...profile, full_name: formData.full_name });
                setIsModalOpen(false);
            } else {
                setError(response.message || "Failed to update profile.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile.");
        }
    };

    const isSaveDisabled =
        formData.full_name === profile.full_name && !formData.new_password;

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6 bg-white shadow rounded-md">
            <h1 className="text-2xl font-bold mb-4">My Profile</h1>
            <div className="space-y-4">
                <div>
                    <span className="font-medium">Username:</span> {profile.username}
                </div>
                <div>
                    <span className="font-medium">Full Name:</span> {profile.full_name}
                </div>
                <div>
                    <span className="font-medium">Role:</span> {profile.role}
                </div>
            </div>
            <button
                onClick={handleEditClick}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
                Edit
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-lg font-semibold">Edit Profile</h2>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setIsModalOpen(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-4">
                            {error && <div className="text-red-500 mb-4">{error}</div>}
                            <div className="space-y-4">
                                <div>
                                    <label className="block font-medium">Full Name</label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleInputChange}
                                        className="w-full border rounded-md px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium">Current Password</label>
                                    <input
                                        type="password"
                                        name="current_password"
                                        value={formData.current_password}
                                        onChange={handleInputChange}
                                        className="w-full border rounded-md px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium">New Password</label>
                                    <input
                                        type="password"
                                        name="new_password"
                                        value={formData.new_password}
                                        onChange={handleInputChange}
                                        className="w-full border rounded-md px-3 py-2"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end p-4 border-t">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveChanges}
                                disabled={isSaveDisabled}
                                className={`px-4 py-2 rounded-md text-white ${
                                    isSaveDisabled
                                        ? "bg-gray-300 cursor-not-allowed"
                                        : "bg-blue-500 hover:bg-blue-600"
                                }`}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;