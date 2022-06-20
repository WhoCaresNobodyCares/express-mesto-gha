/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const app = require('express')();
const mongoose = require('mongoose');
const parser = require('body-parser');
const { errors } = require('celebrate');

// ---

const { PORT = 3000 } = process.env;

// ---

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

// ---

app.use(parser.json());

// ---

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

// ---

app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
});
