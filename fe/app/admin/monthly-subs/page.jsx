"use client";

import PageHeader from "../../components/admin/PageHeader";
import DataTable from "../../components/common/DataTable";
import Modal from "../../components/common/Modal";
import MonthlySubForm from "../../components/admin/MonthlySubForm";
import { useMonthlySubs } from "../../components/admin/hooks/useMonthlySubs";
import { FaSearch, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function MonthlySubsPage() {
    const {
        subs,
        loading,
        error,
        form,
        formLoading,
        showForm,
        vehicleTypeOptions,
        columns,
        pagination,
        setShowForm,
        setError,
        handleChange,
        handleSubmit,
        handleDelete,
        handlePageChange,
        clearSearch,
    } = useMonthlySubs();

    return (
        <>
            <PageHeader
                title="Monthly Subscriptions"
                buttonText="+ Add Monthly Sub"
                onButtonClick={() => setShowForm(true)}
            />

            {/* Search Bar */}
            <div className="mb-6 max-w-2xl relative">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="h-4 w-4 text-gray-400" />
                    </span>
                    {searchQuery && (
                        <button onClick={clearSearch} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <FaTimes className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </button>
                    )}
                    <input
                        type="text"
                        id="subscription-search"
                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Search subscriptions..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            {/* Pagination Controls - Moved to top */}
            {pagination.totalPages > 1 && (
                <div className="mb-4 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                                pagination.page === 1
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.totalPages}
                            className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                                pagination.page === pagination.totalPages
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing{" "}
                                <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
                                <span className="font-medium">
                                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                                </span>{" "}
                                of <span className="font-medium">{pagination.total}</span> results
                            </p>
                        </div>
                        <div>
                            <nav
                                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                                aria-label="Pagination"
                            >
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                                        pagination.page === 1 ? "cursor-not-allowed" : "hover:bg-gray-50"
                                    }`}
                                >
                                    <span className="sr-only">Previous</span>
                                    <FaChevronLeft className="h-5 w-5" aria-hidden="true" />
                                </button>
                                {/* Page numbers */}
                                {[...Array(pagination.totalPages)].map((_, idx) => (
                                    <button
                                        key={idx + 1}
                                        onClick={() => handlePageChange(idx + 1)}
                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                            pagination.page === idx + 1
                                                ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                                : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                                        }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.totalPages}
                                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                                        pagination.page === pagination.totalPages
                                            ? "cursor-not-allowed"
                                            : "hover:bg-gray-50"
                                    }`}
                                >
                                    <span className="sr-only">Next</span>
                                    <FaChevronRight className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            <DataTable columns={columns} data={subs} loading={loading} onDelete={handleDelete} idField="sub_id" />

            {/* Add Monthly Sub Modal */}
            <Modal
                isOpen={showForm}
                onClose={() => {
                    setShowForm(false);
                    setError("");
                }}
                title="Add Monthly Subscription"
                mode="create"
                error={error}
                loading={formLoading}
                onSubmit={handleSubmit}
                submitText="Add"
            >
                <MonthlySubForm form={form} onChange={handleChange} vehicleTypeOptions={vehicleTypeOptions} />
            </Modal>
        </>
    );
}
