const express = require('express')
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const router = express.Router()

const Popup = require('../models/Popup')

// @desc Login/Landing page
// @route GET /
router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  })
})

// @desc Dashboard
// @route GET /dashboard
router.get('/dashboard', async (req, res) => {
  try {
    res.render('dashboard', {
      mapApi: process.env.GOOGLE_API_KEY,
    })
  } catch (err) {
    console.log(err)
    res.render('error/500')
  }
})

module.exports = router
