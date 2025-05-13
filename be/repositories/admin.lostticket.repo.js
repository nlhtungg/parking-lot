const { pool } = require("../config/db");
const { DEFAULT_PAGE_SIZE } = require("../config/pagination");

// Fetch all lost ticket reports
exports.getAllLostTicketReports = async (page = 1, limit = DEFAULT_PAGE_SIZE) => {
    // Calculate offset
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `
        SELECT COUNT(*) as total
        FROM LostTicketReport
    `;
    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].total);

    // Get paginated results
    const query = `
        SELECT ps.*, ltr.*
        FROM LostTicketReport ltr
        JOIN ParkingSessions ps ON ltr.session_id = ps.session_id
        ORDER BY ltr.reportid DESC
        LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);

    return {
        reports: result.rows,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

exports.getLostTicketReportById = async (id) => {
    const query = `
        SELECT ps.*, ltr.*
        FROM LostTicketReport ltr
        JOIN ParkingSessions ps ON ltr.session_id = ps.session_id
        WHERE ltr.reportid = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

exports.deleteLostTicketReport = async (id) => {
    const query = `
        DELETE FROM LostTicketReport
        WHERE reportid = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
};
