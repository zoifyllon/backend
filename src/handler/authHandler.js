const bcrypt = require('bcrypt');
const { login } = require('../repositories/authRepositories');
const AuthenticationError = require('../exceptions/AuthenticationError');
const jwt = require('jsonwebtoken');
const { verifyUserEmail, addUserRepository } = require('../repositories/usersRepositories');

exports.loginController = async (req, res, next) => {
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
};

exports.registerController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const defaultImgUrl = "https://storage.googleapis.com/zoifyllon-bucket/profile/default_image.jpg"
    const imageUrl = req.file?req.file.cloudStoragePublicUrl:defaultImgUrl;
    
    if (!email || !name || !password) return res.status(400).json({ message: 'field tidak boleh kosong' });

    if (typeof email !== 'string' || typeof name !== 'string' || typeof password !== 'string'  ) {
      return res.status(400).json({ message: 'field harus berupa string' });
    }

    if (email.length > 50 || name.length > 50) {
      return res.status(400).json({ message: 'jumlah karakter melebihi batas maksimal 50' });
    }

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
};
