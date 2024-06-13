const { Router } = require('express');
const bcrypt = require('bcrypt');
const {
  getUserIdRepository, 
  putUserRepository,
  deleteUserRepository,
} = require('../repositories/usersRepositories');
const multer = require('../utils/multer');
const authMiddleware = require('../middleware/authMiddleware');
const AuthorizationError = require('../exceptions/AuthorizationError');
const ATOI = require('../utils/intToString');
const ImgUpload = require('../utils/cloudStorage');

const userHandler = Router();

userHandler.get('/users', authMiddleware(), async (req, res, next) => {
  try {
    const { id:userId } = req.user;

    const intUserId = ATOI(userId);
    const result = await getUserIdRepository(intUserId);
  
    res.status(200).json({
      message: 'Success',
      data: {
        id: result.user_id,
        name: result.name,
        email: result.email,
        image_url: result.image_url
      },
    });
  } catch (error) {
    next(error)
  }
});

userHandler.put('/users', authMiddleware(), multer.single('profileImage'), ImgUpload.uploadToGcs, async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const { id } = req.user;
    
    const result = await getUserIdRepository(id);

    const imageUrl = req.file ? req.file.cloudStoragePublicUrl : result.image_url;
    const newPassword = password ?await bcrypt.hash(password, 10) : result.password;
    const newName = name ? name : result.name;

    const user = await putUserRepository(id, { newName, imageUrl, newPassword });
    
    if(imageUrl != result.image_url){
      await ImgUpload.deleteFile(result.image_url);
    }

    res.status(200).json({
      message: 'Success',
      data: user
    });
  } catch (error) {
    next(error)
  }
});

userHandler.delete('/users/:userId', authMiddleware(), async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { id } = req.user;

    const intUserId = ATOI(userId);
    const result = await getUserIdRepository(intUserId);

    if (id !== result.user_id) {
      throw new AuthorizationError('access denied')
    }

    await deleteUserRepository(intUserId);

    await ImgUpload.deleteFile(result.image_url);
  
    res.status(200).json({
      message: 'Success',
      data: null,
    });
  } catch (error) {
    next(error)
  }
});

module.exports = userHandler;
