"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "../../../api/client.config";

export default function SingleNotificationPage() {
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { id: notificationId } = useParams(); // Use useParams to get the notification ID

    useEffect(() => {
        const fetchNotification = async () => {
            try {
                const response = await api.get(`/admin/notifications/${notificationId}`);
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
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">{notification.title}</h1>
                    <p className="text-gray-600 mb-4">{notification.message}</p>
                    <p className="text-sm text-gray-400">
                        Created at: {new Date(notification.created_at).toLocaleString()}
                    </p>
                    <button
                        onClick={() => router.back()}
                        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Go Back
                    </button>
                </div>
            </main>
        </div>
    );
}