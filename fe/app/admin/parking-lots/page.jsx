"use client";

import PageHeader from "../../components/admin/PageHeader";
import DataTable from "../../components/common/DataTable";
import Modal from "../../components/common/Modal";
import ParkingLotForm from "../../components/admin/ParkingLotForm";
import { useParkingLots } from "../../components/admin/hooks/useParkingLots";

export default function ParkingLotsPage() {
    const {
        lots,
        loading,
        error,
        form,
        editForm,
        formLoading,
        showForm,
        showEditForm,
        managerOptions,
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
    } = useParkingLots();

    return (
        <>
            <PageHeader title="Parking Lots" buttonText="+ Add Parking Lot" onButtonClick={() => setShowForm(true)} />

            <DataTable
                columns={columns}
                data={lots}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                idField="lot_id"
            />

            {/* Add Parking Lot Modal */}
            <Modal
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                title="Add Parking Lot"
                mode="create"
                error={error}
                loading={formLoading}
                onSubmit={handleSubmit}
                submitText="Add"
            >
                <ParkingLotForm form={form} onChange={handleChange} managerOptions={managerOptions} />
            </Modal>

            {/* Edit Parking Lot Modal */}
            <Modal
                isOpen={showEditForm}
                onClose={() => setShowEditForm(false)}
                title="Edit Parking Lot"
                mode="update"
                error={error}
                loading={formLoading}
                onSubmit={handleEditSubmit}
                submitText="Save Changes"
            >
                <ParkingLotForm
                    form={editForm}
                    onChange={handleEditChange}
                    managerOptions={managerOptions}
                    isEditMode={true}
                />
            </Modal>
        </>
    );
}
