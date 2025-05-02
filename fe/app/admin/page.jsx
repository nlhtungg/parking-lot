"use client";

//import Sidebar from "../components/admin/Sidebar";
import { useRouter } from "next/navigation";
import api from "../api/client.config";
import { useEffect, useState } from "react";

export default function AdminPage() {
    const [userName, setUserName] = useState("");
    const [notifications, setNotifications] = useState([]);
    const router = useRouter();

    useEffect(() => {
        // Fetch user data from backend server with credentials
        const fetchUserData = async () => {
            try {
                const response = await api.get("/admin/");
                setUserName(response.data.data.user.full_name);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        const fetchNotifications = async () => {
            try {
                const response = await api.get("/admin/notifications");
                setNotifications(response.data.data.slice(0, 3)); // Display the latest 3 notifications
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchUserData();
        fetchNotifications();
    }, []);

    const handleNavigation = (path) => {
        router.push(path);
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        return `${year}-${day}-${month}`;
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <main className="flex-1 p-6">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {userName}</h1>
                    <p className="text-gray-600 mb-6">
                        This is your admin dashboard. From here, you can manage users, parking lots, fee configurations, and more.
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                        <div
                            className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow-md hover:bg-blue-200 transition cursor-pointer"
                            onClick={() => handleNavigation("/admin/users")}
                        >
                            <h2 className="text-xl font-semibold">Manage Users</h2>
                            <p className="text-sm">Add, edit, or remove users from the system.</p>
                        </div>
                        <div
                            className="bg-green-100 text-green-800 p-4 rounded-lg shadow-md hover:bg-green-200 transition cursor-pointer"
                            onClick={() => handleNavigation("/admin/parking-lots")}
                        >
                            <h2 className="text-xl font-semibold">Manage Parking Lots</h2>
                            <p className="text-sm">View and update parking lot details.</p>
                        </div>
                        <div
                            className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow-md hover:bg-yellow-200 transition cursor-pointer"
                            onClick={() => handleNavigation("/admin/config")}
                        >
                            <h2 className="text-xl font-semibold">Fee Configurations</h2>
                            <p className="text-sm">Set and update service and penalty fees.</p>
                        </div>
                        <div
                            className="bg-red-100 text-red-800 p-4 rounded-lg shadow-md hover:bg-red-200 transition cursor-pointer"
                            onClick={() => handleNavigation("/admin/monthly-subs")}
                        >
                            <h2 className="text-xl font-semibold">Monthly Subscriptions</h2>
                            <p className="text-sm">Manage monthly parking subscriptions.</p>
                        </div>
                        <div
                            className="bg-purple-100 text-purple-800 p-4 rounded-lg shadow-md hover:bg-purple-200 transition cursor-pointer"
                            onClick={() => handleNavigation("/admin/payments")}
                        >
                            <h2 className="text-xl font-semibold">Payments</h2>
                            <p className="text-sm">Track and manage all payment transactions.</p>
                        </div>
                        <div
                            className="bg-indigo-100 text-indigo-800 p-4 rounded-lg shadow-md hover:bg-indigo-200 transition cursor-pointer"
                            onClick={() => handleNavigation("/admin/lost-tickets")}
                        >
                            <h2 className="text-xl font-semibold">Lost Tickets</h2>
                            <p className="text-sm">Handle and resolve lost ticket cases.</p>
                        </div>
                        <div
                            className="bg-teal-100 text-teal-800 p-4 rounded-lg shadow-md hover:bg-teal-200 transition cursor-pointer"
                            onClick={() => handleNavigation("/admin/insight")}
                        >
                            <h2 className="text-xl font-semibold">Insight</h2>
                            <p className="text-sm">View analytics and insights for better decision-making.</p>
                        </div>
                        <div
                            className="bg-gray-100 text-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-200 transition cursor-pointer"
                            onClick={() => handleNavigation("/admin/notifications")}
                        >
                            <h2 className="text-xl font-semibold">Notifications</h2>
                            <p className="text-sm">Manage and send notifications to users.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 mt-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Notifications</h2>
                    {notifications.length > 0 ? (
                        <div className="grid gap-4">
                            {notifications.map((notification, index) => (
                                <li key={index} className="py-4">
                                    <h3
                                        className="text-lg font-semibold text-gray-800 cursor-pointer"
                                        onClick={() => router.push(`/admin/notifications/${notification.noti_id}`)}
                                    >
                                        {notification.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">{notification.message}</p>
                                    <p className="text-xs text-gray-400">{formatDate(notification.created_at)}</p>
                                </li>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No recent notifications available.</p>
                    )}
                </div>
            </main>
        </div>
    );
}