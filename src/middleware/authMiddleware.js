const jwt = require('jsonwebtoken');
const AuthenticationError = require('../exceptions/AuthenticationError');

function authMiddleware() {
  return (req, res, next) => {
    try {
      const token = req.get('Authorization') || req.headers.Authorization;
      if (!token) {
        throw new AuthenticationError('token tidak terdeteksi');
      }

      const tokenString = token.split(' ')[1];

      jwt.verify(tokenString, process.env.JWT_KEY, (err, decodedToken) => {
        if (err) {
          throw new AuthenticationError('token tidak valid');
        }

        req.user = decodedToken;
        next();
      });
    } catch (error) {
      res.status(error.statusCode).json({
        status: 'fail',
        message: error.message,
      });
    }
  };
}

module.exports = authMiddleware;
