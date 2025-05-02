"use client";

import PageHeader from "../../components/admin/PageHeader";
import DataTable from "../../components/common/DataTable";
import Modal from "../../components/common/Modal";
import MonthlySubForm from "../../components/admin/MonthlySubForm";
import { useMonthlySubs } from "../../components/admin/hooks/useMonthlySubs";

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
        setShowForm,
        setError,
        handleChange,
        handleSubmit,
        handleDelete,
    } = useMonthlySubs();

    return (
        <>
            <PageHeader
                title="Monthly Subscriptions"
                buttonText="+ Add Monthly Sub"
                onButtonClick={() => setShowForm(true)}
            />

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
