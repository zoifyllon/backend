const pool = require('../utils/database');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

async function addUserRepository({ name, email, password, imageUrl }) {
  const [rows, fields] = await pool.execute(
    'INSERT INTO users (name, email, password, image_url) VALUES (?, ?, ?, ?)',
    [name, email, password, imageUrl],
  );

  return rows.insertId;
}

async function verifyUserEmail(email) {
  const [ rows ] = await pool.execute(
    'SELECT user_id FROM users WHERE email = ?',
    [email],
  );

  if (rows.length > 0) {
    throw new InvariantError('email is used')
  }
}

async function getUserIdRepository(id) {
  const [rows, fields] = await pool.execute(
    'SELECT user_id as id, name, email, image_url FROM users WHERE user_id = ?',
    [id],
  );

  if (rows.length === 0) {
    throw new NotFoundError('user not found')
  }

  return rows[0];
}

async function getUsersRepository() {
  const [rows, fields] = await pool.execute(
    'SELECT user_id as id, name, email, image_url FROM users'
  );

  return rows;
}

async function putUserRepository(id, { name, imageUrl }) {
  await pool.execute(
    'UPDATE users SET name = ?, image_url = ? WHERE user_id = ?',
    [name, imageUrl, id],
  );
}

async function deleteUserRepository(id) {
  await pool.execute(
    'DELETE FROM users WHERE user_id = ?',
    [id],
  );
}

module.exports = {
  addUserRepository, verifyUserEmail, getUserIdRepository, getUsersRepository, putUserRepository, deleteUserRepository
}