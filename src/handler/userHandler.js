const { Router } = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const {
  addUserRepository, getUserIdRepository, verifyUserEmail, getUsersRepository, putUserRepository,
  deleteUserRepository,
} = require('../repositories/usersRepositories');
const multer = require('../utils/multer');
const authMiddleware = require('../middleware/authMiddleware');
const AuthorizationError = require('../exceptions/AuthorizationError');
const ATOI = require('../utils/intToString');

const userHandler = Router();

userHandler.post('/auth/register', multer.single('imageFile'), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const imageUrl = req.file.path.replace(/\\/g, "/");
  
    await verifyUserEmail(email);
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await addUserRepository({ name, email, password: hashedPassword, imageUrl });

    res.status(201).json({
      message: 'Created',
      data: {
        id: result.user_id,
        name: result.name,
        email: result.email,
        image_url: `http://${req.headers.host}/${result.image_url}`
      },
    });
  } catch (error) {
    next(error)
  }
});

userHandler.get('/users', async (req, res, next) => {
  try {
    const result = await getUsersRepository();
  
    res.status(200).json({
      message: 'Success',
      data: result.map((data) => ({
        id: result.user_id,
        name: result.name,
        email: result.email,
        image_url: `http://${req.headers.host}/${data.image_url}`
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
        image_url: `http://${req.headers.host}/${result.image_url}`
      },
    });
  } catch (error) {
    next(error)
  }
});

userHandler.put('/users/:userId', authMiddleware(), multer.single('imageFile'), async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { name } = req.body;
    const imageUrl = req.file.path.replace(/\\/g, "/");
    const { id } = req.user;
    
    const intUserId = ATOI(userId);
    const result = await getUserIdRepository(intUserId);

    if (intUserId !== result.user_id) {
      throw new AuthorizationError('access denied')
    }

    await putUserRepository(intUserId, { name, imageUrl });

    fs.rm(path.join(__dirname, '../../') + result.image_url, (error) => {
      if (error) {
        next(error);
      }
    });
  
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

    if (intUserId !== result.user_id) {
      throw new AuthorizationError('access denied')
    }

    await deleteUserRepository(intUserId);

    fs.rm(path.join(__dirname, '../../') + result.image_url, (error) => {
      if (error) {
        next(error);
      }
    });

    res.status(200).json({
      message: 'Success',
      data: null,
    });
  } catch (error) {
    next(error)
  }
});

module.exports = userHandler;
