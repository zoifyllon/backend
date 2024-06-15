require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const { errorMiddleware } = require('./middleware/errorMiddleware');
const userHandler = require('./route/userRoute');
const authHandler = require('./route/authRoute');
const predictHandler = require('./route/detectRoute');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(userHandler);
app.use(authHandler);
app.use(predictHandler);
app.use(errorMiddleware);

app.get('/', (req, res, next) => {
  res.status(200).send('<h1 align="center">hello world</h1>');
  next();
});

app.listen(process.env.PORT, () => {
  console.log(`running on port ${process.env.PORT}`)
});
