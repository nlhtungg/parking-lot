"use client";

import PageHeader from "../../components/admin/PageHeader";
import DataTable from "../../components/common/DataTable";
import Modal from "../../components/common/Modal";
import UserForm from "../../components/admin/UserForm";
import { useUsers } from "../../components/admin/hooks/useUsers";

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
        setShowForm,
        setShowEditForm,
        setError,
        handleChange,
        handleEditChange,
        handleSubmit,
        handleEditSubmit,
        handleEdit,
        handleDelete,
    } = useUsers();

    return (
        <>
            <PageHeader title="Users Management" buttonText="+ Add User" onButtonClick={() => setShowForm(true)} />

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
