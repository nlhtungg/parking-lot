"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import api from "../../api/client.config";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function InsightPage() {
    const [insightData, setInsightData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInsightData = async () => {
            try {
                const response = await api.get("/admin/insight");
                setInsightData(response.data.data);
            } catch (err) {
                setError("Failed to load insight data.");
            } finally {
                setLoading(false);
            }
        };

        fetchInsightData();
    }, []);

    if (loading) {
        return <p className="text-center text-gray-600">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-red-600">{error}</p>;
    }

    const chartData = {
        labels: insightData.map((item) => item.label),
        datasets: [
            {
                label: "Data Overview",
                data: insightData.map((item) => item.value),
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Insight Data Visualization",
            },
        },
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 p-6">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Insight</h1>
                    <p className="text-gray-600 mb-6">
                        This page provides a visual representation of key data insights.
                    </p>
                    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>
            </main>
        </div>
    );
}