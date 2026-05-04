const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// Login check
passport.use(new (require('passport-local').Strategy)(
  async (username, password, done) => {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password)))
      return done(null, false);
    return done(null, user);
  }
));
// Register
router.get('/register', (req, res) => res.render('register'));

router.post('/register', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  req.login(user, () => res.redirect('/journals'));
});

// Login
router.get('/login', (req, res) => res.render('login'));

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/journals')
);

// Logout
router.post('/logout', (req, res) => {
  req.logout(() => res.redirect('/login'));
});

module.exports = router;
