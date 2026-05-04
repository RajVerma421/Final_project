const express = require('express');
const router = express.Router();
const Journal = require('../models/journal');

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

// Show all journals
router.get('/journals', isAuth, async (req, res) => {
  const journals = await Journal.find({ user: req.user.id });
  res.render('journals', { journals });
});

// New journal form
router.get('/journal/new', isAuth, (req, res) => {
  res.render('journal-form');
});

// Create journal
router.post('/journal', isAuth, async (req, res) => {
  const journal = new Journal({ ...req.body, user: req.user.id });
  await journal.save();
  res.redirect('/journals');
});

// View one journal
router.get('/journals/:id', isAuth, async (req, res) => {
  const journal = await Journal.findById(req.params.id);
  res.render('journal-view', { journal });
});

// Edit form
router.get('/journals/:id/edit', isAuth, async (req, res) => {
  const journal = await Journal.findById(req.params.id);
  res.render('journal-form', { journal });
});

// Update journal
router.put('/journals/:id', isAuth, async (req, res) => {
  await Journal.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/journals');
});

// Delete journal
router.delete('/journals/:id', isAuth, async (req, res) => {
  await Journal.findByIdAndDelete(req.params.id);
  res.redirect('/journals');
});

module.exports = router;
