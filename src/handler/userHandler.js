const { Router } = require('express');
const bcrypt = require('bcrypt');

const {
  addUserRepository, getUserIdRepository, verifyUserEmail, getUsersRepository, putUserRepository,
  deleteUserRepository,
} = require('../repositories/usersRepositories');
const multer = require('../utils/multer');
const authMiddleware = require('../middleware/authMiddleware');
const AuthorizationError = require('../exceptions/AuthorizationError');
const ATOI = require('../utils/intToString');
const ImgUpload = require('../utils/cloudStorage');

const userHandler = Router();

userHandler.get('/users', async (req, res, next) => {
  try {
    const result = await getUsersRepository();
  
    res.status(200).json({
      message: 'Success',
      data: result.map((data) => ({
        id: data.user_id,
        name: data.name,
        email: data.email,
        image_url: data.image_url
      })),
    });
  } catch (error) {
    next(error)
  }
});

userHandler.get('/users/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;

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

userHandler.put('/users/:userId', authMiddleware(), multer.single('imageFile'), ImgUpload.uploadToGcs, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { name } = req.body;
    const imageUrl = req.file.cloudStoragePublicUrl;
    const { id } = req.user;
    
    const intUserId = ATOI(userId);
    const result = await getUserIdRepository(intUserId);
  
    if (id !== result.user_id) {
      throw new AuthorizationError('access denied')
    }

    await putUserRepository(intUserId, { name, imageUrl });
  
    await ImgUpload.deleteFile(result.image_url);

    res.status(200).json({
      message: 'Success',
      data: null,
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
