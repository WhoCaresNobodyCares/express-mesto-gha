/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const app = require('express')();
const mongoose = require('mongoose');
const parser = require('body-parser');
const { errors } = require('celebrate');
const NotFoundError = require('./errors/NotFoundError');

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

app.use('/', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// ---

app.use(errors());

// ---

app.use((req, res, next) => next(new NotFoundError('404 error')));

// ---

app.use((err, req, res, next) => {
  if (!err.statusCode) { res.status(500).send({ message: 'Default server error' }); }
  res.status(err.statusCode).send({ message: err.message });
});
