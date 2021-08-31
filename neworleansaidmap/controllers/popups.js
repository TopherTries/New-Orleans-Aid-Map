const Popup = require('../models/Popup')

// @ desc Get all popups
// @route GET /api/v1/stores
// @access Public

exports.getPopupLocation = async (req, res, next) => {
    try {
        const popups = await Popup.find()

        return res.status(200).json({
            success: true,
            count: popups.length,
            data: popups
        })
    } catch (error) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
}

// @ desc Create a popup
// @route POST /api/v1/stores
// @access Public

exports.addPopupLocation = async (req, res, next) => {
    try {
        console.log(req.body)
    } catch (error) {
        console.error(err)
        res.status(500).json({ error: 'Server error' })
    }
}