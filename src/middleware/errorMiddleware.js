const ClientError = require('../exceptions/ClientError');

function errorMiddleware(err, req, res, next) {
  if (!err) {
    next();
    return;
  }

  if (err instanceof ClientError) {
    res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    }).end();
  } else {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    }).end();
  }
}

module.exports = { errorMiddleware };
