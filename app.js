const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');

const app = express();

mongoose.connect('mongodb://localhost:27017/travel-journal');

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret' }));
app.use(passport.initialize());
app.use(passport.session());

app.use(require('./routes/auth'));
app.use(require('./routes/journal'));

app.get('/', (req, res) => {
  res.redirect(req.isAuthenticated() ? '/journals' : '/login');
});

app.listen(3000);
