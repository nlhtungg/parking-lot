const { pool } = require('../config/db');

exports.getMyProfile = async (id) => {
    const query = `SELECT * FROM Users WHERE user_id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

exports.updateMyProfile = async (id, data) => {
    const { full_name, password } = data;
    const query = `UPDATE Users SET full_name=$1, password_hash=$2 WHERE user_id = $3`;
    const result = await pool.query(query, [full_name, password, id]);
    return result.rows[0];
};