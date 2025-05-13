"use client";

import PageHeader from "../../components/admin/PageHeader";
import DataTable from "../../components/common/DataTable";
import Modal from "../../components/common/Modal";
import UserForm from "../../components/admin/UserForm";
import { useUsers } from "../../components/admin/hooks/useUsers";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function UsersPage() {
    const {
        users,
        loading,
        error,
        form,
        editForm,
        formLoading,
        showForm,
        showEditForm,
        roleOptions,
        columns,
        pagination,
        setShowForm,
        setShowEditForm,
        setError,
        handleChange,
        handleEditChange,
        handleSubmit,
        handleEditSubmit,
        handleEdit,
        handleDelete,
        handleSearchChange,
        handlePageChange,
    } = useUsers();

    return (
        <>
            <PageHeader title="Users Management" buttonText="+ Add User" onButtonClick={() => setShowForm(true)} />

            {/* Search Bar */}
            <div className="mb-4 flex">
                <div className="relative w-80">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                            className="w-4 h-4 text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                            />
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="user-search"
                        className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            {/* Pagination Controls */}
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

            <DataTable
                columns={columns}
                data={users}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                idField="user_id"
            />

            {/* Add User Modal */}
            <Modal
                isOpen={showForm}
                onClose={() => {
                    setShowForm(false);
                    setError("");
                }}
                title="Add User"
                mode="create"
                error={error}
                loading={formLoading}
                onSubmit={handleSubmit}
                submitText="Add"
            >
                <UserForm form={form} onChange={handleChange} roleOptions={roleOptions} />
            </Modal>

            {/* Edit User Modal */}
            <Modal
                isOpen={showEditForm}
                onClose={() => {
                    setShowEditForm(false);
                    setError("");
                }}
                title="Edit User"
                mode="update"
                error={error}
                loading={formLoading}
                onSubmit={handleEditSubmit}
                submitText="Save Changes"
            >
                <UserForm form={editForm} onChange={handleEditChange} roleOptions={roleOptions} isEditMode={true} />
            </Modal>
        </>
    );
}
