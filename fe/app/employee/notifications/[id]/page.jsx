"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "../../../api/client.config";

export default function SingleNotificationPage() {
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id: notificationId } = useParams(); // Use useParams to get the notification ID

    useEffect(() => {
        const fetchNotification = async () => {
            try {
                const response = await api.get(`/employee/notifications/${notificationId}`);
                setNotification(response.data.data);
            } catch (err) {
                setError("Failed to load notification.");
            } finally {
                setLoading(false);
            }
        };

        if (notificationId) {
            fetchNotification();
        } else {
            setError("Notification ID is missing.");
            setLoading(false);
        }
    }, [notificationId]);

    if (loading) {
        return <p className="text-center text-gray-600">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-red-600">{error}</p>;
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <main className="flex-1 p-6">
                <div className="bg-white shadow-md rounded-lg p-6 relative">
                    <Link
                        href="/employee/"
                        className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Back
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">{notification.title}</h1>
                    <p className="text-sm text-gray-400 text-center">
                        Created on: {new Date(notification.created_at).toLocaleDateString()} by {notification.username}
                    </p>
                    <p className="text-gray-600 mb-4 text-center">{notification.message}</p>
                </div>
            </main>
        </div>
    );
}