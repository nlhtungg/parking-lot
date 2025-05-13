const { pool } = require("../config/db");
const { DEFAULT_PAGE_SIZE } = require("../config/pagination");

exports.createMonthlyPayment = async (data) => {
    const { sub_id, payment_date, payment_method, total_amount } = data;

    const query = `
        INSERT INTO Payment (
            sub_id,
            payment_date,
            payment_method,
            total_amount
        ) VALUES ($1, $2, $3, $4)
        RETURNING *
    `;

    const result = await pool.query(query, [sub_id, payment_date, payment_method, total_amount]);
    return result.rows[0];
};

exports.getAllPayments = async (page = 1, limit = DEFAULT_PAGE_SIZE) => {
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM Payment`;
    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].total);

    // Get paginated results
    const query = `
        SELECT 
            p.*,
            ps.license_plate,
            ps.vehicle_type,
            ps.time_in,
            ps.time_out,
            ms.owner_name
        FROM Payment p
        LEFT JOIN ParkingSessions ps ON p.session_id = ps.session_id
        LEFT JOIN MonthlySubs ms ON p.sub_id = ms.sub_id
        ORDER BY p.payment_id DESC
        LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);

    return {
        payments: result.rows,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};
