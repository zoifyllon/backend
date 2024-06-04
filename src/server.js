require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')

const userHandler = require('./handler/userHandler');
const { errorMiddleware } = require('./middleware/errorMiddleware');
const authHandler = require('./handler/authHandler');

const app = express();

app.use('/public', express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(userHandler);
app.use(authHandler);
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`running on port ${process.env.PORT}`)
});
