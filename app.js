// REQUIRE
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

// PORT
const { PORT = 3000 } = process.env;

// EXPRESS
const app = express();

// MONGOOSE & LISTENER
mongoose
  .connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    family: 4,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Connected to mestodb & listening on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));

// BODY PARSER
app.use(bodyParser.json());

// ROUTE
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// 404
app.use((req, res) => {
  res.status(404).send({ message: 'Path not found' });
});
