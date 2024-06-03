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

const userHandler = Router();

userHandler.post('/auth/register', multer.single('imageFile'), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const imageUrl = req.file.path.replace(/\\/g, "/");
  
    await verifyUserEmail(email);
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = await addUserRepository({ name, email, password: hashedPassword, imageUrl });

    const result = await getUserIdRepository(id);

    res.status(201).json({
      message: 'Created',
      data: {
        ...result,
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
        ...data,
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

    const result = await getUserIdRepository(userId);
  
    res.status(200).json({
      message: 'Success',
      data: {
        ...result,
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
    const imageUrl = req.file.path;
    const { id } = req.user;
    
    const result = await getUserIdRepository(userId);

    if (id !== result.id) {
      throw new AuthorizationError('access denied')
    }

    await putUserRepository(userId, { name, imageUrl });

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

    const result = await getUserIdRepository(userId);

    if (id !== result.id) {
      throw new AuthorizationError('access denied')
    }

    await deleteUserRepository(userId);

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
