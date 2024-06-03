const jwt = require('jsonwebtoken');
const AuthenticationError = require('../exceptions/AuthenticationError');

function authMiddleware() {
  return (req, res, next) => {
    try {
      const token = req.get('Authorization') || req.headers.Authorization;
      if (!token) {
        throw new AuthenticationError('token tidak valid');
      }

      const tokenString = token.split(' ')[1];

      jwt.verify(tokenString, 's3h4rusny4(1n1)s3cr3t[k3y]t4p1{b1ngung}k4t4_k4t4ny4', (err, decodedToken) => {
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
