const AuthenticationError = require('../exceptions/AuthenticationError');
const pool = require('../utils/database');

async function login(email) {
  const [rows, fields] = await pool.execute(
    'SELECT user_id as id, name, email, password, image_url FROM users WHERE email = ?',
    [email]
  );

  if (rows.length === 0) {
    throw new AuthenticationError('Invalid username or password')
  }

  return rows[0];
}

module.exports = { login }
