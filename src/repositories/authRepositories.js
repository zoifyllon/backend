const AuthenticationError = require('../exceptions/AuthenticationError');
const prisma = require('../utils/database');

async function login(email) {
  const user = await prisma.users.findUnique({
    where: { email },
    select: {
      user_id: true,
      name: true,
      email: true,
      password: true,
      image_url: true
    }
  });

  if (!user) {
    throw new AuthenticationError('Invalid username or password')
  }

  return user;
}

module.exports = { login }
