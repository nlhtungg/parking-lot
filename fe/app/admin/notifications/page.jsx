"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../api/client.config";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);

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

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 p-6">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Notifications</h1>
                    {notifications.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {notifications.map((notification, index) => (
                                <li key={index} className="py-4">
                                    <h2 className="text-lg font-semibold text-gray-800">{notification.title}</h2>
                                    <p className="text-sm text-gray-600">{notification.message}</p>
                                    <p className="text-xs text-gray-400">{new Date(notification.created_at).toLocaleString()}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">No notifications available.</p>
                    )}
                </div>
            </main>
        </div>
    );
}