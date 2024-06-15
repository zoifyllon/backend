const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const prisma = require('../utils/database');

async function addUserRepository({ name, email, password, imageUrl }) {
  const user = await prisma.users.create({
    data: {
      name, email, password, image_url: imageUrl
    },
    select: {
      user_id: true,
      name: true,
      email: true,
      image_url: true
    }
  });

  return user;
}

async function verifyUserEmail(email) {
  const user = await prisma.users.findFirst({
    where: { email: email }
  })

  if (user) {
    throw new InvariantError('email is used');
  }
}

async function getUserIdRepository(id) {
  const user = await prisma.users.findUnique({
    where: { user_id: id },
    select: {
      user_id: true,
      name: true,
      email: true,
      image_url: true
    }
  });

  if (!user) {
    throw new NotFoundError('user not found');
  }

  return user;
}

async function getUsersRepository() {
  const users = await prisma.users.findMany({
    select: {
      user_id: true,
      name: true,
      email: true,
      image_url: true
    }
  });

  return users;
}

async function putUserRepository(id, { newName, imageUrl, newPassword }) {
  const user = await prisma.users.update({
    where: {
      user_id: id
    },
    data: {
      name: newName,
      image_url: imageUrl,
      password: newPassword
    }
  });

  return user;
}

async function deleteUserRepository(id) {
  await prisma.users.delete({
    where: {
      user_id: id
    },
  });
}

module.exports = {
  addUserRepository, verifyUserEmail, getUserIdRepository, getUsersRepository, putUserRepository, deleteUserRepository
}