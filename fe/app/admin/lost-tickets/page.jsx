"use client";
import React, { useEffect, useState } from "react";
import DataTable from "../../components/common/DataTable";
import PageHeader from "../../components/common/PageHeader";
import { fetchAllLostTickets } from "../../api/admin.client";

const columns = [
    //{ key: "reportid", label: "Report ID" },
    { key: "session_id", label: "Session ID" },
    { key: "license_plate", label: "License Plate" },
    { key: "vehicle_type", label: "Vehicle Type" },
    //{ key: "lot_id", label: "Lot ID" },
    //{ key: "time_in", label: "Time In" },
    //{ key: "time_out", label: "Time Out" },
    { key: "penalty_fee", label: "Penalty Fee" },
    //{ key: "guest_phone", label: "Guest Phone" },
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
                const data = await fetchAllLostTickets();
                setData(data);
                console.log(data);
            } catch (err) {
                setError("Failed to fetch lost tickets");
            } finally {
                setLoading(false);
            }
        };
        fetchLostTickets();
    }, []);

    const handleDetail = (session_id) => {
        window.location.href = `/admin/lost-tickets/${session_id}`;
    };

    return (
        <div className="p-6">
            <PageHeader title="Lost Ticket Reports" />
            <div className="mt-6">
                <DataTable columns={columns} data={data} loading={loading} error={error} onDetail={handleDetail} />
            </div>
        </div>
    );
}
