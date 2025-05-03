"use client";

import { useEffect, useState } from "react";
import api from "../../api/client.config";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await api.get("/employee/notifications");
                setNotifications(response.data.data);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };
        fetchNotifications();
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <main className="flex-1 p-6">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Notifications</h1>
                    {notifications.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {notifications.map((notification, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 transition cursor-pointer"
                                    onClick={() => router.push(`/employee/notifications/${notification.noti_id}`)}
                                >
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{notification.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {notification.message.length > 30
                                            ? `${notification.message.slice(0, 30)}...`
                                            : notification.message}
                                    </p>
                                    <p className="text-xs text-gray-400">{new Date(notification.created_at).toLocaleDateString()} by {notification.username}</p>
                                </div>
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