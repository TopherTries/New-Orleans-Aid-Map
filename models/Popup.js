const { text } = require('express')
const mongoose = require('mongoose')
const geocoder = require('../utils/geocoder')

const PopupSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true
    },
    menu: {
        type: String,
        required: false
    },
    hours: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    location: {
        type: {
          type: String, 
          enum: ['Point'], 
        },
        coordinates: {
          type: [Number],
          index: '2dsphere'
        },
        formattedAddress: String
      },
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// Geocode & create location
PopupSchema.pre('save', async function(next) {
    const location = await geocoder.geocode(this.address)
    this.location = {
        type: 'Point',
        coordinates: [location[0].longitude, location[0].latitude],
        formattedAddress: location[0].formattedAddress
    }

    // Do not save address
    this.address = undefined
    next()
})



module.exports = mongoose.model('Popup', PopupSchema)