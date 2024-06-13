const { Router } = require('express');

const multer = require('../utils/multer');
const ImgUpload = require('../utils/cloudStorage');
const authMiddleware = require('../middleware/authMiddleware');
const { addHistoryRepository, getHistoriesRepository, getHistoryByIdRepository } = require('../repositories/histRepositories');
const { predict } = require('../predict/predict');
const dataJSON = require('../../data.json');
const ATOI = require('../utils/intToString');

const predictHandler = Router();

predictHandler.post('/detect', authMiddleware(), multer.single('imageFile'), ImgUpload.uploadToGcs, async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const imageUrl = req.file.cloudStoragePublicUrl
    const data = await predict(imageUrl)
    console.log(data)
    
    const result = await addHistoryRepository({ data: data.data, userId, imageUrl });

    console.log(result)

    res.status(201).json({
      message: 'Success',
      data: {
        history_id: result.history_id,
        image_url: result.image_url,
        user_id: result.user_id,
        diseases: result.diseases.map(disease => ({
          ...disease,
          percentage: disease.percentage / 100
        })),
      },
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
