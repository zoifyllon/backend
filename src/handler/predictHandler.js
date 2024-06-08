const { Router } = require('express');

const multer = require('../utils/multer');
const ImgUpload = require('../utils/cloudStorage');
const authMiddleware = require('../middleware/authMiddleware');
const { addHistoryRepository, getHistoriesRepository, getHistoryByIdRepository } = require('../repositories/histRepositories');
const predict = require('../predict/predict');
const dataJSON = require('../../data.json');
const ATOI = require('../utils/intToString');

const predictHandler = Router();

// predictHandler.post('/detect', authMiddleware(), multer.single('image'), ImgUpload.uploadToGcs, async (req, res, next) => {
predictHandler.post('/detect', authMiddleware(), async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const { disease, percentage } = predict();
    const imageUrl = '...'

    const result = await addHistoryRepository({ percentage, disease, userId, imageUrl });

    res.status(201).json({
      message: 'Success',
      data: {
        id: result.history_id,
        user_id: result.user_id,
        image_url: result.image_url,
        disease: result.disease,
        percentage: result.percentage
      }
    })
  } catch (error) {
    next(error)
  }
});

predictHandler.get('/history', authMiddleware(), async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const result = await getHistoriesRepository(userId);

    res.status(200).json({
      message: 'Success',
      data: result.map((data) => ({
        id: data.history_id,
        user_id: data.user_id,
        image_url: data.image_url,
        disease: data.disease,
        percentage: data.percentage
      })),
    });
  } catch (error) {
    next(error)
  }
});

predictHandler.get('/history/:historyId', authMiddleware(), async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { historyId } = req.params;

    const intHistoryId = ATOI(historyId);
    const result = await getHistoryByIdRepository(intHistoryId, userId);

    const index = dataJSON.findIndex((d) => d.name === result.disease);

    res.status(200).json({
      message: 'Success',
      data: {
        id: result.history_id,
        user_id: result.user_id,
        image_url: result.image_url,
        disease: result.disease,
        percentage: result.percentage,
        symptoms: dataJSON[index].symptoms
      },
    });
  } catch (error) {
    next(error)
  }
});

module.exports = predictHandler;
