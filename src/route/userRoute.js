const { Router } = require('express');
const multer = require('../utils/multer');
const authMiddleware = require('../middleware/authMiddleware');
const ImgUpload = require('../utils/cloudStorage');
const {
  getUserController,
  putUserController,
  deleteUserController,
} = require('../handler/userHandler');

const userHandler = Router();

userHandler.get('/users', authMiddleware(), getUserController);
userHandler.put('/users', authMiddleware(), multer.single('profileImage'), ImgUpload.uploadToGcs, putUserController);
userHandler.delete('/users/:userId', authMiddleware(), deleteUserController);

module.exports = userHandler;
