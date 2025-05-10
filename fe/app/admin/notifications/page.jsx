"use client";

import { useEffect, useState } from "react";
import api from "../../api/client.config";
import { addNotification } from "../../api/admin.client";

function CustomModal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                    onClick={onClose}
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newNotification, setNewNotification] = useState({ title: "", message: "" });
    const [userId, setUserId] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [currentNotification, setCurrentNotification] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get("http://localhost:8000/api/auth/me");
                setUserId(response.data.data.user.user_id);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await api.get("/admin/notifications");
                setNotifications(response.data.data);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };
        fetchNotifications();
    }, []);

    const handleAddNotification = async () => {
        try {
            if (!userId) {
                console.error("User ID is not available");
                return;
            }

            const response = await addNotification({ ...newNotification, user_id: userId });
            setNotifications([...notifications, response]);
            setIsModalOpen(false);
            setNewNotification({ title: "", message: "" });
        } catch (error) {
            console.error("Error adding notification:", error);
        }
    };

    const handleUpdateClick = (notification) => {
        setCurrentNotification(notification);
        setIsUpdateModalOpen(true);
    };

    const handleUpdateSubmit = (updatedTitle, updatedMessage) => {
        api.put(`/admin/notifications/${currentNotification.noti_id}`, {
            title: updatedTitle,
            message: updatedMessage,
        })
            .then(() => {
                setNotifications(
                    notifications.map((noti) =>
                        noti.noti_id === currentNotification.noti_id
                            ? { ...noti, title: updatedTitle, message: updatedMessage }
                            : noti
                    )
                );
                setIsUpdateModalOpen(false);
            })
            .catch((error) => {
                console.error("Error updating notification:", error);
            });
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <main className="flex-1 p-6">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Notifications</h1>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add New Notification
                    </button>
                    {notifications.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {notifications.map((notification, index) => (
                                <li key={index} className="py-4">
                                    <h2
                                        className="text-lg font-semibold text-gray-800 cursor-pointer hover:underline"
                                        onClick={() => {
                                            window.location.href = `/admin/notifications/${notification.noti_id}`;
                                        }}
                                    >
                                        {notification.title}
                                    </h2>
                                    <p className="text-sm text-gray-600">{notification.message}</p>
                                    <p className="text-xs text-gray-400">{new Date(notification.created_at).toLocaleString().slice(0,10)}</p>
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded mt-2"
                                        onClick={async () => {
                                            try {
                                                await api.delete(`/admin/notifications/${notification.noti_id}`);
                                                setNotifications(notifications.filter((_, i) => i !== index));
                                            } catch (error) {
                                                console.error("Error deleting notification:", error);
                                            }
                                        }}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="bg-yellow-500 text-white px-2 py-1 rounded mt-2 ml-2"
                                        onClick={() => handleUpdateClick(notification)}
                                    >
                                        Update
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">No notifications available.</p>
                    )}
                </div>

                <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <h2 className="text-xl font-bold mb-4">Add New Notification</h2>
                    <input
                        type="text"
                        placeholder="Title"
                        value={newNotification.title}
                        onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                        className="border p-2 w-full mb-4"
                    />
                    <textarea
                        placeholder="Message"
                        value={newNotification.message}
                        onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                        className="border p-2 w-full mb-4"
                    />
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        onClick={handleAddNotification}
                    >
                        Post
                    </button>
                </CustomModal>

                {isUpdateModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
                            <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                                onClick={() => setIsUpdateModalOpen(false)}
                            >
                                &times;
                            </button>
                            <h2 className="text-xl font-bold mb-4">Update Notification</h2>
                            <input
                                type="text"
                                placeholder="Title"
                                defaultValue={currentNotification?.title}
                                className="border p-2 w-full mb-4"
                                onChange={(e) => setCurrentNotification({ ...currentNotification, title: e.target.value })}
                            />
                            <textarea
                                placeholder="Message"
                                defaultValue={currentNotification?.message}
                                className="border p-2 w-full mb-4"
                                onChange={(e) => setCurrentNotification({ ...currentNotification, message: e.target.value })}
                            />
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                onClick={() => handleUpdateSubmit(currentNotification.title, currentNotification.message)}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}