const { pool } = require('../config/db');

exports.getMyProfile = async (id) => {
    const query = `SELECT * FROM Users WHERE user_id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

exports.updateMyProfile = async (id, data) => {
    const { full_name, password } = data;

    const query = password
        ? `UPDATE Users SET full_name=$1, password_hash=$2 WHERE user_id=$3 RETURNING *`
        : `UPDATE Users SET full_name=$1 WHERE user_id=$2 RETURNING *`;

    const values = password ? [full_name, password, id] : [full_name, id];

    const result = await pool.query(query, values);
    return result.rows[0];
};