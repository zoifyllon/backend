const NotFoundError = require("../exceptions/NotFoundError");
const prisma = require("../utils/database");

async function addHistoryRepository({ percentage, disease, userId, imageUrl }) {
  const result = await prisma.histories.create({
    data: {
      image_url: imageUrl, percentage, disease, user_id: userId
    },
    select: {
      history_id: true,
      user_id: true,
      image_url: true,
      disease: true,
      percentage: true,
    }
  });

  return result;
}

async function getHistoriesRepository(userId) {
  const histories = await prisma.histories.findMany({
    where: {
      user_id: userId
    },
    select: {
      history_id: true,
      user_id: true,
      image_url: true,
      disease: true,
      percentage: true,
    }
  });

  return histories;
}

async function getHistoryByIdRepository(id, userId) {
  const history = await prisma.histories.findUnique({
    where: {
      history_id: id,
      user_id: userId,
    },
    select: {
      history_id: true,
      user_id: true,
      image_url: true,
      disease: true,
      percentage: true,
    }
  });

  if (!history) {
    throw new NotFoundError('history not found');
  }

  return history;
}

module.exports = { addHistoryRepository, getHistoriesRepository, getHistoryByIdRepository }
