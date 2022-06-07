// REQUIRE
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

// PORT
const { PORT = 3000 } = process.env;

// EXPRESS
const app = express();

// MONGOOSE & LISTENER
mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true, family: 4 })
  .then(() => app.listen(PORT, () => { console.log(`Connected to mestodb & listening on port ${PORT}`); }))
  .catch((err) => console.log(err));

// MIDDLEWARE
app.use((req, res, next) => {
  req.user = { _id: '629c65f3d4dd32f45a0ced42' };
  next();
});

app.use((req, res, next) => {
  if (req.originalUrl !== '/users' || req.originalUrl !== '/cards') {
    app.patch(req.originalUrl, () => {
      res.status(404).send({ message: 'Path not found' });
    });
  }
  next();
});

// BODY PARSER
app.use(bodyParser.json());

// ROUTE
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));
