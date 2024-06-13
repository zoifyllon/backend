const { Router } = require('express');
const bcrypt = require('bcrypt');
const { login } = require('../repositories/authRepositories');
const AuthenticationError = require('../exceptions/AuthenticationError');
const jwt = require('jsonwebtoken');
const multer = require('../utils/multer');
const ImgUpload = require('../utils/cloudStorage');
const { verifyUserEmail, addUserRepository } = require('../repositories/usersRepositories');

const authHandler = Router();

authHandler.post('/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await login(email);
    const match = await bcrypt.compare(password, result.password);

    if (!match) {
      throw new AuthenticationError('Invalid username or password');
    }

    const token = jwt.sign({
      id: result.user_id,
    }, process.env.JWT_KEY, { expiresIn: '10h' });

    res.status(200).json({
      message: 'Success',
      data: {
        id: result.user_id,
        name: result.name,
        email: result.email,
        image_url: result.image_url,
        token
      },
    });
  } catch (error) {
    next(error)
  }
});

authHandler.post('/auth/register', multer.single('profileImage'), ImgUpload.uploadToGcs, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const defaultImgUrl = "https://storage.googleapis.com/zoifyllon-bucket/profile/default_image.jpg"
    const imageUrl = req.file?req.file.cloudStoragePublicUrl:defaultImgUrl;

    await verifyUserEmail(email);
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await addUserRepository({ name, email, password: hashedPassword, imageUrl });

    res.status(201).json({
      message: 'Created',
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

module.exports = authHandler;
