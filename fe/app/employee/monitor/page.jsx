"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchMyLot, fetchMyParkingSessions } from "../../api/employee.client";

async function fetchLotData(setLot, setError) {
    try {
        const lotData = await fetchMyLot();
        setLot(lotData);
    } catch (err) {
        console.error("Error fetching lot details:", err);
        setError("Failed to load lot details. Please try again later.");
    }
}

async function fetchSessions(setSessions, setError) {
    try {
        const sessionData = await fetchMyParkingSessions();
        setSessions(sessionData);
    } catch (err) {
        console.error("Error fetching parking sessions:", err);
        setError("Failed to load parking sessions. Please try again later.");
    }
}

export default function LotMonitorPage() {
    const [lot, setLot] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null); // Reset error state before fetching

            await Promise.all([
                fetchLotData(setLot, setError),
                fetchSessions(setSessions, setError),
            ]);

            setLoading(false);
        }

        fetchData();
    }, []);

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    if (!lot) {
        return <p className="text-center text-gray-500">Lot not found.</p>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">{lot.lot_name}</h2>
                <div className="grid grid-cols-2 gap-4">
                    <p><strong>Car Capacity:</strong> {lot.car_capacity}</p>
                    <p><strong>Bike Capacity:</strong> {lot.bike_capacity}</p>
                    <p><strong>Current Cars:</strong> {lot.current_car}</p>
                    <p><strong>Current Bikes:</strong> {lot.current_bike}</p>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Active Parking Sessions</h2>
                <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-blue-500 text-white">
                            <th className="border border-gray-300 px-4 py-2 text-left">Session ID</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Vehicle Type</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Plate Number</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Time In</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map((session, index) => (
                            <tr key={session.session_id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white hover:bg-gray-200 transition-colors duration-200"}>
                                <td className="border border-gray-300 px-4 py-2">{session.session_id}</td>
                                <td className="border border-gray-300 px-4 py-2">{session.vehicle_type}</td>
                                <td className="border border-gray-300 px-4 py-2">{session.license_plate}</td>
                                <td className="border border-gray-300 px-4 py-2">{new Date(session.time_in).toLocaleString().slice(0,19)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}