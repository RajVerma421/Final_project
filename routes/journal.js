const express = require('express');
const router = express.Router();
const Journal = require('../models/journal');

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

router.get('/journals', isAuthenticated, async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user.id })
      .populate('user', 'username travelStyle')
      .sort({ createdAt: -1 });
    res.render('journals', { journals, user: req.user });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.get('/journal/new', isAuthenticated, (req, res) => {
  res.render('journal-form', {
    journal: {},
    errors: [],
    action: '/journal',
    method: 'POST',
    user: req.user
  });
});

router.post('/journal', isAuthenticated, async (req, res) => {
  const { destination, arrivalDate, departureDate, experience, rating } = req.body;

  try {
    const journal = new Journal({
      destination,
      arrivalDate: new Date(arrivalDate),
      departureDate: new Date(departureDate),
      experience,
      rating: Number(rating),
      user: req.user.id
    });
    await journal.save();
    res.redirect('/journals');
  } catch (err) {
    const errors = err.errors ? Object.values(err.errors).map(e => e.message) : ['Failed to create journal'];
    res.render('journal-form', {
      journal: { destination, arrivalDate, departureDate, experience, rating },
      errors,
      action: '/journal',
      method: 'POST',
      user: req.user
    });
  }
});

router.get('/journals/:id', isAuthenticated, async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id).populate('user', 'username travelStyle');
    if (!journal) return res.status(404).send('Journal not found');
    if (journal.user._id.toString() !== req.user.id) return res.status(403).send('Unauthorized');
    res.render('journal-view', { journal, user: req.user });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.get('/journals/:id/edit', isAuthenticated, async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal) return res.status(404).send('Journal not found');
    if (journal.user.toString() !== req.user.id) return res.status(403).send('Unauthorized');
    res.render('journal-form', {
      journal,
      errors: [],
      action: `/journals/${journal.id}`,
      method: 'PUT',
      user: req.user
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.put('/journals/:id', isAuthenticated, async (req, res) => {
  const { arrivalDate, departureDate, experience, rating } = req.body;

  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal) return res.status(404).send('Journal not found');
    if (journal.user.toString() !== req.user.id) return res.status(403).send('Unauthorized');

    journal.arrivalDate = new Date(arrivalDate);
    journal.departureDate = new Date(departureDate);
    journal.experience = experience;
    journal.rating = Number(rating);

    await journal.save();
    res.redirect(`/journals/${journal.id}`);
  } catch (err) {
    const errors = err.errors ? Object.values(err.errors).map(e => e.message) : ['Failed to update journal'];
    const journal = await Journal.findById(req.params.id);
    res.render('journal-form', {
      journal: journal || { arrivalDate, departureDate, experience, rating },
      errors,
      action: `/journals/${req.params.id}`,
      method: 'PUT',
      user: req.user
    });
  }
});

router.delete('/journals/:id', isAuthenticated, async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal) return res.status(404).send('Journal not found');
    if (journal.user.toString() !== req.user.id) return res.status(403).send('Unauthorized');
    await journal.deleteOne();
    res.redirect('/journals');
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
