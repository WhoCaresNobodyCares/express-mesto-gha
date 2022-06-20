/* eslint-disable no-console */
const app = require('express')();
const mongoose = require('mongoose');
const parser = require('body-parser');

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

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// ---

app.use((err, req, res) => {
  res.status(err.statusCode).send({ message: err.message });
});
