const {pool} = require('../config/db')

exports.createMonthlyPayment = async (data) => {
    const {
        sub_id,
        payment_date,
        payment_method,
        total_amount
    } = data;

    const query = `
        INSERT INTO Payments (
            sub_id,
            payment_date,
            payment_method,
            total_amount
        ) VALUES ($1, $2, $3, $4)
        RETURNING *
    `;

    const result = await pool.query(query,data);
    return result.rows[0];
}