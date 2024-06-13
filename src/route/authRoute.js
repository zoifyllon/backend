const { Router } = require('express');
const multer = require('../utils/multer');
const ImgUpload = require('../utils/cloudStorage');
const { loginController, registerController } = require('../handler/authHandler');

const authHandler = Router();

authHandler.post('/auth/login', loginController);
authHandler.post('/auth/register', multer.single('profileImage'), ImgUpload.uploadToGcs, registerController);

module.exports = authHandler;
