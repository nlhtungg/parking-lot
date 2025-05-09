"use client";
import React, { useEffect, useState } from "react";
import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";

const columns = [
    { Header: "Session ID", accessor: "session_id" },
    { Header: "License Plate", accessor: "license_plate" },
    { Header: "Vehicle Type", accessor: "vehicle_type" },
    { Header: "Lot ID", accessor: "lot_id" },
    { Header: "Time In", accessor: "time_in" },
    { Header: "Time Out", accessor: "time_out" },
    { Header: "Penalty Fee", accessor: "penalty_fee" },
    { Header: "Created At", accessor: "created_at" },
];

export default function LostTicketsPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLostTickets = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch("/api/admin/lost-tickets");
                const json = await res.json();
                if (json.success) {
                    setData(json.data);
                } else {
                    setError(json.message || "Failed to fetch lost tickets");
                }
            } catch (err) {
                setError("Failed to fetch lost tickets");
            } finally {
                setLoading(false);
            }
        };
        fetchLostTickets();
    }, []);

    return (
        <div className="p-6">
            <PageHeader title="Lost Ticket Reports" />
            <div className="mt-6">
                <DataTable columns={columns} data={data} loading={loading} error={error} />
            </div>
        </div>
    );
}
