"use client";

import { useState, useEffect } from "react";
import { fetchFeeConfigurations, updateFeeConfiguration } from "../../api/admin.client";
import { FaCar, FaMotorcycle, FaCalendarDay, FaCalendarAlt, FaInfoCircle } from "react-icons/fa";

export default function ConfigPage() {
    return <ConfigurationPage />;
}

function ConfigurationPage() {
    const [fees, setFees] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editValues, setEditValues] = useState({ service_fee: "", penalty_fee: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadFees() {
            try {
                const data = await fetchFeeConfigurations();
                const sortedFees = [
                    data.find((fee) => fee.vehicle_type === "car" && fee.ticket_type === "daily"),
                    data.find((fee) => fee.vehicle_type === "car" && fee.ticket_type === "monthly"),
                    data.find((fee) => fee.vehicle_type === "bike" && fee.ticket_type === "daily"),
                    data.find((fee) => fee.vehicle_type === "bike" && fee.ticket_type === "monthly"),
                ].filter(Boolean);
                setFees(sortedFees);
            } catch (error) {
                console.error("Failed to fetch fees", error);
            }
        }
        loadFees();
    }, []);

    const handleEdit = (fee) => {
        setEditId(fee.id);
        setEditValues({
            service_fee: fee.service_fee,
            penalty_fee: fee.penalty_fee,
        });
    };

    const handleCancel = () => {
        setEditId(null);
        setEditValues({ service_fee: "", penalty_fee: "" });
    };

    const handleChange = (e) => {
        setEditValues({ ...editValues, [e.target.name]: e.target.value });
    };

    const handleSave = async (fee) => {
        setLoading(true);
        try {
            const updatedFee = await updateFeeConfiguration({ ...fee, ...editValues });
            setFees(fees.map((f) => (f.id === updatedFee.id ? updatedFee : f)));
            setEditId(null);
            setEditValues({ service_fee: "", penalty_fee: "" });
        } catch (error) {
            console.error("Failed to update fee", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Fee Configuration</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-6">
                        <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Fee Table</h2>
                            <span className="bg-white text-blue-600 rounded-full px-3 py-1 text-sm font-semibold">
                                {fees.length} items
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Service Fee
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Penalty Fee
                                        </th>
                                        <th className="px-6 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {fees.map((fee) => (
                                        <tr key={fee.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-2 text-sm text-gray-900">
                                                {fee.vehicle_type === "car" ? (
                                                    <FaCar className="text-blue-500 h-5 w-5" />
                                                ) : (
                                                    <FaMotorcycle className="text-blue-500 h-5 w-5" />
                                                )}
                                                {fee.ticket_type === "daily" ? (
                                                    <FaCalendarDay className="text-gray-500 h-4 w-4" />
                                                ) : (
                                                    <FaCalendarAlt className="text-gray-500 h-4 w-4" />
                                                )}
                                                <span className="capitalize font-medium text-gray-700">
                                                    {fee.vehicle_type} - {fee.ticket_type}
                                                </span>
                                            </td>
                                            {editId === fee.id ? (
                                                <>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            name="service_fee"
                                                            value={editValues.service_fee}
                                                            onChange={handleChange}
                                                            className="w-24 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            name="penalty_fee"
                                                            value={editValues.penalty_fee}
                                                            onChange={handleChange}
                                                            className="w-24 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                                                        <button
                                                            onClick={handleCancel}
                                                            className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300 transition text-sm"
                                                            disabled={loading}
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleSave(fee)}
                                                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-sm"
                                                            disabled={loading}
                                                        >
                                                            {loading ? "Saving..." : "Save"}
                                                        </button>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        $ {fee.service_fee}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        $ {fee.penalty_fee}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            onClick={() => handleEdit(fee)}
                                                            className="text-blue-600 hover:underline mr-2 text-sm"
                                                        >
                                                            Edit
                                                        </button>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <div className="bg-white shadow-md rounded-lg overflow-hidden h-full">
                        <div className="bg-blue-600 text-white px-6 py-4 flex items-center">
                            <FaInfoCircle className="mr-2" />
                            <h2 className="text-xl font-semibold">Instructions</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <p className="text-gray-600">
                                    Edit fees inline. Click Edit, change values, then Save or Cancel.
                                </p>
                                <div className="border-t pt-4">
                                    <h3 className="font-medium text-gray-700 mb-2">Guidelines:</h3>
                                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                        <li>Set reasonable service and penalty fees for each vehicle/ticket type</li>
                                        <li>Double-check values before saving</li>
                                        <li>Contact admin if unsure about fee policy</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
