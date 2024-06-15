const { Router } = require('express');
const multer = require('../utils/multer');
const ImgUpload = require('../utils/cloudStorage');
const { loginController, registerController, pingController } = require('../handler/authHandler');

const authHandler = Router();

authHandler.get('/ping', pingController);
authHandler.post('/auth/login', loginController);
authHandler.post('/auth/register', multer.single('profileImage'), ImgUpload.uploadToGcs, registerController);

module.exports = authHandler;
