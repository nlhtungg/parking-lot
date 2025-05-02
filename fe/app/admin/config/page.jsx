"use client";

import { useState, useEffect } from "react";
import { fetchFeeConfigurations, updateFeeConfiguration } from "../../api/admin.client";

export default function ConfigPage() {
    return <ConfigurationPage />;
}

function ConfigurationPage() {
    const [fees, setFees] = useState([]);
    const [selectedFee, setSelectedFee] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        async function loadFees() {
            try {
                const data = await fetchFeeConfigurations();

                // Sort fees in the desired order: car daily, car monthly, bike daily, bike monthly
                const sortedFees = [
                    data.find(fee => fee.vehicle_type === 'Car' && fee.ticket_type === 'Daily'),
                    data.find(fee => fee.vehicle_type === 'Car' && fee.ticket_type === 'Monthly'),
                    data.find(fee => fee.vehicle_type === 'Bike' && fee.ticket_type === 'Daily'),
                    data.find(fee => fee.vehicle_type === 'Bike' && fee.ticket_type === 'Monthly'),
                ].filter(Boolean); // Remove any undefined entries

                setFees(sortedFees);
            } catch (error) {
                console.error("Failed to fetch fees", error);
            }
        }
        loadFees();
    }, []);

    const handleBoxClick = (fee) => {
        setSelectedFee(fee);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedFee(null);
    };

    const handleSave = async () => {
        try {
            const updatedFee = await updateFeeConfiguration(selectedFee);
            setFees(fees.map(fee => fee.id === updatedFee.id ? updatedFee : fee));
            handleModalClose();
            window.location.reload(); // Reload the page after saving
        } catch (error) {
            console.error("Failed to update fee", error);
        }
    };

    return (
        <div className="flex">
            <main className="p-4 w-full flex justify-center items-center">
                <div className="w-3/4">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Fee Configuration</h1>
                    <section className="grid grid-cols-2 gap-6">
                        {fees.map((fee, index) => (
                            <article
                                key={index}
                                className="border border-gray-300 p-6 rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300 text-center cursor-pointer"
                                onClick={() => handleBoxClick(fee)}
                            >
                                <header className="mb-4">
                                    <h2 className="text-xl font-semibold text-blue-600">{`${fee.vehicle_type} - ${fee.ticket_type}`}</h2>
                                </header>
                                <p className="text-gray-700 text-sm mb-2">
                                    <span className="font-medium">Service Fee:</span> $ {fee.service_fee}
                                </p>
                                <p className="text-gray-700 text-sm">
                                    <span className="font-medium">Penalty Fee:</span> $ {fee.penalty_fee}
                                </p>
                            </article>
                        ))}
                    </section>
                </div>
            </main>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-1/3 relative">
                        <button
                            onClick={handleModalClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
                        >
                            ×
                        </button>
                        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Edit Fee Configuration</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Service Fee</label>
                            <input
                                type="text"
                                value={selectedFee.service_fee}
                                onChange={(e) => setSelectedFee({ ...selectedFee, service_fee: e.target.value })}
                                className="w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Penalty Fee</label>
                            <input
                                type="text"
                                value={selectedFee.penalty_fee}
                                onChange={(e) => setSelectedFee({ ...selectedFee, penalty_fee: e.target.value })}
                                className="w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleModalClose}
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}