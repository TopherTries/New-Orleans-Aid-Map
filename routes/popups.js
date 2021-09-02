const express = require('express')
const { ensureAuth } = require('../middleware/auth')
const { getPopupLocation, addPopupLocation } = require('../controllers/popups')
const router = express.Router()

const Popup = require('../models/Popup')

// @desc Show add page
// @route GET /popups/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('popups/add')
})

// @desc Process add form
// @route POST /popups
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id
    await Popup.create(req.body)
    res.redirect('/dashboard')
  } catch (error) {
    console.error(err)
    res.render('error/500')
  }
})

router.route('/api/v1/popups').get(getPopupLocation).post(addPopupLocation)

// @desc    Show all popups
// @route   GET /popups
router.get('/', async (req, res) => {
  try {
    const popups = await Popup.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    res.render('popups/index', {
      popups,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc Show single popup
// @route GET /popups/:id
router.get('/:id', async (req, res) => {
  try {
    let popup = await Popup.findById(req.params.id).populate('user').lean()

    if (!popup) {
      return res.render('error/404')
    }

    res.render('popups/show', {
      popup,
    })
  } catch (error) {
    console.error(err)
    res.render('error/404')
  }
})

// @desc Show edit page
// @route GET /popups/edit
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const popup = await Popup.findOne({
      _id: req.params.id,
    }).lean()

    if (!popup) {
      return res.render('error/404')
    }

    if (popup.user != req.user.id) {
      res.redirect('/popups')
    } else {
      res.render('popups/edit', {
        popup,
      })
    }
  } catch (error) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc Update Popup
// @route PUT /popups/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let popup = await Popup.findById(req.params.id).lean()

    if (!popup) {
      return res.render('error/404')
    }

    if (popup.user != req.user.id) {
      res.redirect('/popups')
    } else {
      popup = await Popup.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/dashboard')
    }
  } catch (error) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc Delete popup
// @route DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    await Popup.remove({ _id: req.params.id })
    res.redirect('/dashboard')
  } catch (error) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc User popups
// @route GET /popups/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const popups = await Popup.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean()

    res.render('popups/index', {
      popups,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router
