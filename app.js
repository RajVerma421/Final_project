const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');
const path = require('path');

const authRoutes = require('./routes/auth');
const journalRoutes = require('./routes/journal');

const app = express();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-journal')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'travel-journal-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use(authRoutes);
app.use(journalRoutes);

app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/journals');
  } else {
    res.redirect('/login');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
