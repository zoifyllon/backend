const { Router } = require('express');
const multer = require('../utils/multer');
const ImgUpload = require('../utils/cloudStorage');
const authMiddleware = require('../middleware/authMiddleware');
const {
  detectController,
  getHistoriesController,
  getHistoryByIdController,
  deleteHistoryByIdController
} = require('../handler/detectHandler');

const predictHandler = Router();

predictHandler.post('/detect', authMiddleware(), multer.single('detectImage'), ImgUpload.uploadToGcs, detectController);
predictHandler.get('/history', authMiddleware(), getHistoriesController);
predictHandler.get('/history/:historyId', authMiddleware(), getHistoryByIdController);
predictHandler.delete('/history/:historyId', authMiddleware(), deleteHistoryByIdController);

module.exports = predictHandler;