"use client";

import Sidebar from "../components/Sidebar";
import api from "../api/client.config";
import { useEffect, useState } from "react";

export default function AdminPage() {
    const [userName, setUserName] = useState("");

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
        fetchUserData();
    }, []);

    return (
        <div style={{ display: "flex" }}>
            <Sidebar />
            <div style={{ marginLeft: "20px", padding: "10px" }}>
                <h1>Welcome, {userName}</h1>
                {/* Main content area */}
            </div>
        </div>
    );
}
