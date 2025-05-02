"use client";

/**
 * Generic table component for displaying data with actions
 *
 * @param {Object} props
 * @param {Array} props.columns - Array of column definitions with { key, label }
 * @param {Array} props.data - Array of data objects
 * @param {function} props.onEdit - Function to call when edit button is clicked (optional)
 * @param {function} props.onDelete - Function to call when delete button is clicked (optional)
 * @param {string} props.idField - Name of the ID field in data objects (default: 'id')
 * @param {boolean} props.loading - Whether data is loading
 */
export default function DataTable({ columns = [], data = [], onEdit, onDelete, idField = "id", loading = false }) {
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <table className="min-w-full border text-sm">
            <thead>
                <tr className="bg-gray-100">
                    {columns.map((column) => (
                        <th key={column.key} className="border px-4 py-2">
                            {column.label}
                        </th>
                    ))}
                    {(onEdit || onDelete) && <th className="border px-4 py-2">Actions</th>}
                </tr>
            </thead>
            <tbody>
                {data.map((item) => (
                    <tr key={item[idField]}>
                        {columns.map((column) => (
                            <td key={`${item[idField]}-${column.key}`} className="border px-4 py-2">
                                {item[column.key]}
                            </td>
                        ))}
                        {(onEdit || onDelete) && (
                            <td className="border px-4 py-2">
                                {onEdit && (
                                    <button className="text-blue-600 hover:underline mr-2" onClick={() => onEdit(item)}>
                                        Edit
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        className="text-red-600 hover:underline"
                                        onClick={() => onDelete(item[idField])}
                                    >
                                        Delete
                                    </button>
                                )}
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
