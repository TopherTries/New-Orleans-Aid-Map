const express = require('express')
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const router = express.Router()

const Popup = require('../models/Popup')

// @desc Login/Landing page
// @route GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

// @desc Dashboard
// @route GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const popups = await Popup.find({ user: req.user.id }).lean()
            res.render('dashboard', {
                name: req.user.firstName,
                popups,
                mapApi: process.env.GOOGLE_API_KEY                
        })
    } catch (error) {
        console.log(err)
        res.render('error/500')
    }
})

module.exports = router