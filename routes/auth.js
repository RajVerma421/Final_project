const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) return done(null, false, { message: 'Incorrect username' });
      const isMatch = await user.comparePassword(password);
      if (!isMatch) return done(null, false, { message: 'Incorrect password' });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

router.get('/register', (req, res) => {
  res.render('register', { errors: [], formData: {} });
});

router.post('/register', async (req, res) => {
  const { username, password, nationality, travelStyle, favoriteContinent } = req.body;
  const formData = { username, nationality, travelStyle, favoriteContinent };

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render('register', {
        errors: ['Username already exists'],
        formData
      });
    }

    const user = new User({ username, password, nationality, travelStyle, favoriteContinent });
    await user.save();

    req.login(user, (err) => {
      if (err) return next(err);
      res.redirect('/journals');
    });
  } catch (err) {
    const errors = err.errors ? Object.values(err.errors).map(e => e.message) : ['Registration failed'];
    res.render('register', { errors, formData });
  }
});

router.get('/login', (req, res) => {
  res.render('login', { error: req.query.error || null });
});

router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login?error=Invalid username or password'
  }),
  (req, res) => {
    res.redirect('/journals');
  }
);

router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/login');
  });
});

module.exports = router;
