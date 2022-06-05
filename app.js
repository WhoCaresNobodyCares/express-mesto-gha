// REQUIRE
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

// PORT & DB
const { PORT = 3000 } = process.env;
const db = 'mestodb';

// EXPRESS
const app = express();

// MONGOOSE & LISTENER
mongoose.connect(`mongodb://localhost:27017/${db}`, { useNewUrlParser: true, family: 4 })
  .then(() => app.listen(PORT, () => { console.log(`Connected to ${db} & listening on port ${PORT}`); }))
  .catch((err) => console.log(err));

// !!! 629c65f3d4dd32f45a0ced42

// USE
app.use((req, res, next) => {
  req.user = { _id: '629c65f3d4dd32f45a0ced42' };
  next();
});
app.use(bodyParser.json());
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));
